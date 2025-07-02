import { Snowflake as SnowflakeLibrary } from "@sapphire/snowflake";

export type Snowflake = string;

const epoch = new Date("2025-02-07T00:00:00.000Z");

const globalSnowflake = new SnowflakeLibrary(epoch);

export const snowflake = {
	generateString(workerId: WorkerID): string {
		const value = this.generate(workerId);
		return value.toString();
	},
	generate(workerId: WorkerID): bigint {
		const value = globalSnowflake.generate({ workerId: BigInt(workerId) });
		return value;
	},
	getTimestamp(id: Snowflake): number {
		return globalSnowflake.timestampFrom(id);
	},
};

export enum WorkerID {
	AUTH = 0,
}
