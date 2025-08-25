import exceljs from "exceljs";
import moment from "moment-timezone";
import { WorkType } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { selectPrivateUser, selectWork } from "../../database/common";
import { createRoute, validator, verifyJwt } from "../../utils";

const schema = z.object({ startDate: z.string(), endDate: z.string() });

createRoute("POST", "/report", verifyJwt(), validator("json", schema), async (c) => {
    const payload = c.get("tokenPayload");
    const body = c.req.valid("json");

    const user = await prisma.user.getById(payload.id, { select: selectPrivateUser });
    const works = await prisma.work.getUserWorks(payload.id, body.startDate, body.endDate, { select: selectWork });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.addRow(["Name:", `${user.firstName} ${user.lastName}`]);
    worksheet.addRow(["From:", new Date(body.startDate), "To:", new Date(body.endDate)]);

    worksheet.addRow([]);

    const row = worksheet.addRow(["Type", "Start", "End", "Total", "Overtime"]);
    row.eachCell((cell) => {
        cell.style = { font: { bold: true } };
    });

    let totalWorkTimeSeconds = 0;
    let totalOvertimeSeconds = 0;
    for (const work of works) {
        if (!work.timeOfExit && (work.type === WorkType.ONSITE || work.type === WorkType.REMOTE)) {
            continue;
        }

        const overtimeReachLimitSeconds = 28800;
        let restTimeSeconds = 0;
        let workTimeSeconds = 0;

        if (work.timeOfExit && (work.type === WorkType.ONSITE || work.type === WorkType.REMOTE)) {
            const durationMs = new Date(work.timeOfExit).getTime() - new Date(work.timeOfEntry).getTime();
            workTimeSeconds = durationMs / 1000;

            //work time more than 6 hours and less than or equal 9 hours. reduce 30 minutes for rest time
            if (workTimeSeconds > 21600 && workTimeSeconds <= 32400) {
                restTimeSeconds = 1800;
            }

            //work time more than 9 hours. reduce 45 minutes for rest time
            if (workTimeSeconds > 32400) {
                restTimeSeconds = 2700;
            }
        }

        const actualWorkTimeSeconds = workTimeSeconds - restTimeSeconds;
        const overtimeSeconds = work.type === WorkType.VACATION ? 0 : actualWorkTimeSeconds - overtimeReachLimitSeconds;

        totalWorkTimeSeconds += workTimeSeconds;
        totalOvertimeSeconds += overtimeSeconds;

        const entryString = work.type === WorkType.ABSENT || work.type === WorkType.VACATION ? moment(work.timeOfEntry).tz("Europe/Berlin").format("DD.MM.YYYY") : moment(work.timeOfEntry).tz("Europe/Berlin").format("DD.MM.YYYY HH:mm");
        const exitString = work.type === WorkType.ABSENT || work.type === WorkType.VACATION ? "-" : moment(work.timeOfExit).tz("Europe/Berlin").format("DD.MM.YYYY HH:mm");
        const workTime = moment.duration(workTimeSeconds, "seconds");
        const overtime = moment.duration(Math.abs(overtimeSeconds), "seconds");

        const durationString = `${Math.floor(workTime.asHours()).toString().padStart(2, "0")}:${workTime.minutes().toString().padStart(2, "0")}`;
        const overtimeString = `${overtimeSeconds < 0 ? "-" : ""}${Math.floor(overtime.asHours()).toString().padStart(2, "0")}:${overtime.minutes().toString().padStart(2, "0")}`;

        const typeString = { [WorkType.ABSENT]: "Absent", [WorkType.ONSITE]: "Onsite", [WorkType.REMOTE]: "Remote", [WorkType.VACATION]: "Vacation" }[work.type];

        const row = worksheet.addRow([typeString, entryString, exitString, durationString, overtimeString]);
        row.getCell(2).numFmt = work.type === WorkType.ABSENT || work.type === WorkType.VACATION ? "DD.MM.YYYY" : "DD.MM.YYYY hh:mm";
        row.getCell(3).numFmt = "DD.MM.YYYY hh:mm";
    }

    const totalWorkTimeDuration = moment.duration(totalWorkTimeSeconds, "seconds");
    const totalCell = worksheet.getCell(worksheet.rowCount + 1, 4);
    totalCell.style = { font: { bold: true } };
    totalCell.value = `${Math.floor(totalWorkTimeDuration.asHours()).toString().padStart(2, "0")}:${totalWorkTimeDuration.minutes().toString().padStart(2, "0")}`;

    const totalOvertimeDuration = moment.duration(Math.abs(totalOvertimeSeconds), "seconds");
    console.log(totalOvertimeSeconds, totalOvertimeDuration.asHours())
    const ovetimeCell = worksheet.getCell(worksheet.rowCount, 5);
    ovetimeCell.style = { font: { bold: true } };
    ovetimeCell.value = `${totalOvertimeSeconds < 0 ? "-" : ""}${Math.floor(totalOvertimeDuration.asHours()).toString().padStart(2, "0")}:${totalOvertimeDuration.minutes().toString().padStart(2, "0")}`;

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
