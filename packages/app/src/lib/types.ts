import type { Duration } from "moment";
import type { Snowflake, WorkType } from "shared";

export type AppWork = {
    id: Snowflake;
    timeOfEntry: string | Date;
    timeOfExit?: string | Date;
    total: Duration;
    date: string | Date;
    type: WorkType
}

export type ClockTime = { hour: number | undefined, minute: number | undefined, finished: boolean };

export type DropdownOption<T = string | number> = {
    text: string;
    value: T;
}