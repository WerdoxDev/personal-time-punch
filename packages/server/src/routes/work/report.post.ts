import exceljs from "exceljs";
import moment, { type Moment } from "moment-timezone";
import { type Snowflake, WorkType } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { selectPrivateUser, selectWork } from "../../database/common";
import { createRoute, validator, verifyJwt } from "../../utils";

type FormattedWork = { id: Snowflake; type?: WorkType; date: string; start?: Moment, end?: Moment, isNextDay: boolean, total?: number; overtime?: number, isGroup: boolean, isPreviousSameDate: boolean, isNextSameDate: boolean };

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
    overtime: "Überstunden",
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

    // Filter out the ones that are not finished yet
    const works = (await prisma.work.getUserWorks(payload.id, body.startDate, body.endDate, { select: selectWork }))
        .filter(x => x.timeOfExit !== null || (x.type !== WorkType.ONSITE && x.type !== WorkType.REMOTE));

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(language.report);

    worksheet.addRow([`${language.name}:`, `${user.firstName} ${user.lastName}`]);
    const row = worksheet.addRow([`${language.from}:`, new Date(body.startDate), `${language.to}:`, new Date(body.endDate)]);
    row.eachCell(c => {
        c.alignment = { horizontal: "left" }
    })

    worksheet.addRow([]);

    const row2 = worksheet.addRow([language.date, language.type, language.start, language.end, language.total, language.overtime]);
    row2.eachCell((cell) => {
        cell.style = { font: { bold: true }, border: { bottom: { style: "double", color: { argb: "#000000" } } } };
    });

    const timezone = "Europe/Berlin";
    moment.tz(timezone);

    const formattedWorks: FormattedWork[] = [];
    for (const [index, work] of works.entries()) {
        const nextWork = works[index + 1];
        const previousWork = works[index - 1];

        const isTimeCalculable = work.type !== WorkType.ABSENT && work.type !== WorkType.SICK && work.type !== WorkType.VACATION;

        const isNextSameDate = nextWork ? moment(work.timeOfEntry).tz(timezone).isSame(nextWork?.timeOfEntry, "date") : false;
        const isPreviousSameDate = previousWork ? moment(work.timeOfEntry).tz(timezone).isSame(previousWork?.timeOfEntry, "date") : false;

        const date = moment(work.timeOfEntry).tz(timezone).format("DD.MM.YYYY");
        const start = isTimeCalculable ? moment(work.timeOfEntry).tz(timezone) : undefined;
        const end = isTimeCalculable ? moment(work.timeOfExit).tz(timezone) : undefined;
        const isNextDay = isTimeCalculable ? moment(end).tz(timezone).isAfter(start, "date") : false;
        const contract = moment.duration(8, "hours");

        // This record is not calculable.
        if (!isTimeCalculable) {
            formattedWorks.push({ date, id: work.id, isNextDay: false, type: work.type, overtime: work.type === WorkType.ABSENT ? -contract.asSeconds() : undefined, isGroup: false, isPreviousSameDate, isNextSameDate });
            continue;
        }

        const duration = moment.duration({ from: start, to: end });

        // This record is part of a group
        if (isNextSameDate) {
            formattedWorks.push({ date, start, end, id: work.id, isNextDay, type: work.type, total: duration.asSeconds(), isGroup: true, isPreviousSameDate, isNextSameDate })
            continue;
        }

        // This record is either the end of a group, or the start of an independent record
        if (!isNextSameDate) {
            const pause = moment.duration();

            // If this is the end of a group, add an extra row for the last record before showing a total calculated record
            if (isPreviousSameDate) {
                formattedWorks.push({ date, start, end, id: work.id, isNextDay, type: work.type, total: duration.asSeconds(), isGroup: true, isPreviousSameDate, isNextSameDate })
            }

            // Add all other records of the same day together
            for (const otherWork of formattedWorks.filter(x => x.date === date && x.id !== work.id)) {
                duration.add(otherWork.total, "seconds");
            }

            if (duration.asHours() > 6 && duration.asHours() <= 9) {
                pause.add(30, "minutes");
            }

            if (duration.asHours() > 9) {
                pause.add(45, "minutes");
            }

            const durationWithoutPause = moment.duration(duration).subtract(pause);
            const overtime = durationWithoutPause.subtract(contract);

            // Should act as an "final" row for the whole day calculation
            if (isPreviousSameDate) {
                formattedWorks.push({ date, id: work.id, isNextDay: false, total: duration.asSeconds(), overtime: overtime.asSeconds(), isGroup: false, isPreviousSameDate, isNextSameDate })
            }
            // Should be a normal single independent row
            else {
                formattedWorks.push({ date, id: work.id, start, end, isGroup: false, isNextDay, isNextSameDate, isPreviousSameDate, overtime: overtime.asSeconds(), total: duration.asSeconds(), type: work.type })
            }
        }
    }

    const totalSum = moment.duration();
    const overtimeSum = moment.duration();
    for (const work of formattedWorks) {
        const dateString = !work.isPreviousSameDate && work.isGroup ? work.date : work.isPreviousSameDate || work.isGroup ? "〃" : work.date
        const startString = work.start ? work.start.format("HH:mm") : "-";
        const endString = work.end ? work.isNextDay ? work.end.format(`HH:mm [+1${language.day_short}]`) : work.end.format("HH:mm") : "-";

        const typeString = work.type !== undefined ? { [WorkType.ABSENT]: language.absent, [WorkType.ONSITE]: language.onsite, [WorkType.REMOTE]: language.remote, [WorkType.VACATION]: language.vacation, [WorkType.SICK]: language.sick }[
            work.type
        ] : "-";

        const total = moment.duration(work.total, "seconds");
        const totalString = work.total ? `${Math.floor(total.asHours()).toString().padStart(2, "0")}:${total.minutes().toString().padStart(2, "0")}` : "-"

        const overtime = moment.duration(Math.abs(work.overtime ?? 0), "seconds");
        const overtimeString = `${(work.overtime ?? 0) < 0 ? "-" : ""}${Math.floor(overtime.asHours()).toString().padStart(2, "0")}:${overtime.minutes().toString().padStart(2, "0")}`

        const row = worksheet.addRow([dateString, typeString, startString, endString, totalString, work.overtime !== undefined ? overtimeString : "-"])

        if (work.isGroup) {
            row.getCell(5).style = { font: { size: 9, italic: true } };
        }

        if (work.total !== undefined && work.overtime !== undefined || (work.type !== WorkType.ONSITE && work.type !== WorkType.REMOTE && work.overtime !== undefined)) {
            totalSum.add(moment.duration(work.total, "seconds"));
            overtimeSum.add(moment.duration(work.overtime, "seconds"));
        }

        if (!work.isGroup) {
            row.eachCell((c) => {
                c.style = { border: { bottom: { style: "thin", color: { argb: "#000000" }, } } }
            })
        }
    }

    const totalCell = worksheet.getCell(worksheet.rowCount + 1, 5);
    totalCell.style = { font: { bold: true } };
    totalCell.value = `${Math.floor(totalSum.asHours()).toString().padStart(2, "0")}:${totalSum.minutes().toString().padStart(2, "0")}`

    const ovetimeCell = worksheet.getCell(worksheet.rowCount, 6);
    ovetimeCell.style = { font: { bold: true } };
    const absSeconds = Math.abs(overtimeSum.asSeconds());
    const newOvertimeSum = moment.duration(absSeconds, "seconds");
    ovetimeCell.value = `${(overtimeSum.asSeconds()) < 0 ? "-" : ""}${Math.floor(newOvertimeSum.asHours()).toString().padStart(2, "0")}:${newOvertimeSum.minutes().toString().padStart(2, "0")}`

    worksheet.columns.forEach((column) => {
        column.width = 15;
    });

    for (const row of worksheet.getRows(4, worksheet.rowCount) ?? []) {
        row.eachCell(c => {
            c.fill = { fgColor: { argb: "f2f2f2" }, type: "pattern", pattern: "solid" }
            c.border = { ...c.border, left: { color: { argb: "#000000" }, style: "thin" }, right: { color: { argb: "#000000" }, style: "thin" } }
        })
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });
});
