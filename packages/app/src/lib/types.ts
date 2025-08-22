import type { Snowflake, WorkType } from "shared";

export type AppWork = {
    id: Snowflake;
    timeOfEntry: string | Date;
    timeOfExit?: string | Date;
    dayOfWeek: number;
    date: string | Date;
    type: WorkType
}

export type ClockTime = { hour: number | undefined, minute: number | undefined, finished: boolean };

export type DropdownOption<T = string | number> = {
    text: string;
    value: T;
}