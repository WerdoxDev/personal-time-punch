import exceljs from "exceljs";
import moment, { type Moment } from "moment-timezone";
import { type Snowflake, WorkType } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { selectPrivateUser, selectWork } from "../../database/common";
import { createRoute, validator, verifyJwt } from "../../utils";

type FormattedWork = { id: Snowflake; type: WorkType; date: string; start?: Moment, end?: Moment, isNextDay: boolean, total?: number; overtime?: number, isGroup: boolean };

const schema = z.object({ startDate: z.string(), endDate: z.string(), language: z.optional(z.string()) });

const english = {
    name: "Name",
    from: "From",
    to: "To",
    report: "Report",
    date: "Date",
    type: "Type",
    start: "Start",
    end: "End",
    total: "Total",
    overtime: "Overtime",
    absent: "Absent",
    onsite: "Onsite",
    remote: "Remote",
    vacation: "Vacation",
    sick: "Sick",
    day_short: "d"
}

const german = {
    name: "Name",
    from: "Von",
    to: "Bis",
    report: "Bericht",
    date: "Datum",
    type: "Typ",
    start: "Start",
    end: "Ende",
    total: "Gesamt",
    overtime: "Überstunde",
    absent: "Fehlzeit",
    onsite: "Vor Ort",
    remote: "Homeoffice",
    vacation: "Urlaub",
    sick: "Krank",
    day_short: "T"
}

createRoute("POST", "/report", verifyJwt(), validator("json", schema), async (c) => {
    const payload = c.get("tokenPayload");
    const body = c.req.valid("json");
    const language = body.language === "en" ? english : body.language === "de" ? german : english;

    const user = await prisma.user.getById(payload.id, { select: selectPrivateUser });
    const works = await prisma.work.getUserWorks(payload.id, body.startDate, body.endDate, { select: selectWork });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(language.report);

    worksheet.addRow([`${language.name}:`, `${user.firstName} ${user.lastName}`]);
    worksheet.addRow([`${language.from}:`, new Date(body.startDate), `${language.to}:`, new Date(body.endDate)]);

    worksheet.addRow([]);

    const row = worksheet.addRow([language.date, language.type, language.start, language.end, language.total, language.overtime]);
    row.eachCell((cell) => {
        cell.style = { font: { bold: true } };
    });

    const timezone = "Europe/Berlin";

    const formattedWorks: FormattedWork[] = [];
    for (const [index, work] of works.entries()) {
        // If is not finished then continue
        if (!work.timeOfExit && (work.type === WorkType.ONSITE || work.type === WorkType.REMOTE)) {
            continue;
        }

        const nextWork = works[index + 1];
        const previousWork = works[index - 1];

        const isTimeCalculable = work.type !== WorkType.ABSENT && work.type !== WorkType.SICK && work.type !== WorkType.VACATION;
        const isNextTimeCalculable = nextWork?.type !== WorkType.ABSENT && nextWork?.type !== WorkType.SICK && nextWork?.type !== WorkType.VACATION
        const isPreviousTimeCalculable = previousWork?.type !== WorkType.ABSENT && previousWork?.type !== WorkType.SICK && previousWork?.type !== WorkType.VACATION

        const isNextSameDate = isNextTimeCalculable ? moment(work.timeOfEntry).isSame(nextWork?.timeOfEntry, "date") : false;
        const isPreviousSameDate = isPreviousTimeCalculable ? moment(work.timeOfEntry).isSame(previousWork?.timeOfEntry, "date") : false;

        const date = moment(work.timeOfEntry).tz(timezone).format("DD.MM.YYYY");
        const start = isTimeCalculable ? moment(work.timeOfEntry).tz(timezone) : undefined;
        const end = isTimeCalculable ? moment(work.timeOfExit).tz(timezone) : undefined;
        const isNextDay = isTimeCalculable ? moment(end).isAfter(start, "date") : false;
        const contract = moment.duration(8, "hours");

        if (!isTimeCalculable) {
            formattedWorks.push({ date, id: work.id, isNextDay: false, type: work.type, overtime: work.type === WorkType.ABSENT ? -contract.asSeconds() : undefined, isGroup: false });
            continue;
        }

        const duration = moment.duration({ from: start, to: end });
        if (isPreviousSameDate) {
            duration.add(formattedWorks.at(-1)?.total, "seconds");
        }

        if (isNextSameDate) {
            formattedWorks.push({ date, start: start, end: end, id: work.id, isNextDay, type: work.type, total: duration.asSeconds(), isGroup: true })
            continue;
        }
        if (!isNextSameDate) {
            const pause = moment.duration();

            if (duration.asHours() > 6 && duration.asHours() <= 9) {
                pause.add(30, "minutes");
            }

            if (duration.asHours() > 9) {
                pause.add(45, "minutes");
            }

            const durationWithoutPause = moment.duration(duration).subtract(pause);
            const overtime = durationWithoutPause.subtract(contract);

            formattedWorks.push({ date, start: start, end: end, id: work.id, isNextDay, type: work.type, total: duration.asSeconds(), overtime: overtime.asSeconds(), isGroup: false })
        }
    }

    const totalSum = moment.duration();
    const overtimeSum = moment.duration();
    for (const work of formattedWorks) {
        const startString = work.start ? work.start.format("HH:mm") : "-";
        const endString = work.end ? work.isNextDay ? work.end.format(`HH:mm [+1${language.day_short}]`) : work.end.format("HH:mm") : "-";

        const typeString = { [WorkType.ABSENT]: language.absent, [WorkType.ONSITE]: language.onsite, [WorkType.REMOTE]: language.remote, [WorkType.VACATION]: language.vacation, [WorkType.SICK]: language.sick }[
            work.type
        ];

        const total = moment.duration(work.total, "seconds");
        const totalString = `${Math.floor(total.asHours()).toString().padStart(2, "0")}:${total.minutes().toString().padStart(2, "0")}`

        const overtime = moment.duration(Math.abs(work.overtime ?? 0), "seconds");
        const overtimeString = `${(work.overtime ?? 0) < 0 ? "-" : ""}${Math.floor(overtime.asHours()).toString().padStart(2, "0")}:${overtime.minutes().toString().padStart(2, "0")}`

        const row = worksheet.addRow([work.date, typeString, startString, endString, work.total !== undefined && work.overtime !== undefined ? totalString : "-", work.overtime !== undefined ? overtimeString : "-"])

        if (work.total !== undefined && work.overtime !== undefined || (work.type !== WorkType.ONSITE && work.type !== WorkType.REMOTE && work.overtime !== undefined)) {
            console.log(work.overtime)
            totalSum.add(moment.duration(work.total, "seconds"));
            overtimeSum.add(moment.duration(work.overtime, "seconds"));
        }

        if (!work.isGroup) {
            row.eachCell((c) => {
                c.style = { border: { bottom: { style: "thin", color: { argb: "#000000", theme: 0 }, } } }
            })
        }
    }

    const totalCell = worksheet.getCell(worksheet.rowCount + 1, row.cellCount - 1);
    totalCell.style = { font: { bold: true } };
    totalCell.value = `${Math.floor(totalSum.asHours()).toString().padStart(2, "0")}:${totalSum.minutes().toString().padStart(2, "0")}`

    const ovetimeCell = worksheet.getCell(worksheet.rowCount, row.cellCount);
    ovetimeCell.style = { font: { bold: true } };
    const absSeconds = Math.abs(overtimeSum.asSeconds());
    const newOvertimeSum = moment.duration(absSeconds, "seconds");
    ovetimeCell.value = `${(overtimeSum.asSeconds()) < 0 ? "-" : ""}${Math.floor(newOvertimeSum.asHours()).toString().padStart(2, "0")}:${newOvertimeSum.minutes().toString().padStart(2, "0")}`

    worksheet.columns.forEach((column) => {
        column.width = 15;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });
});
