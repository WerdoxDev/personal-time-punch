import Button from "@components/Button";
import { useDeleteWork } from "@hooks/useDeleteWork";
import { getWorksOptions } from "@lib/queries";
import type { AppWork } from "@lib/types";
import { useLanguage } from "@stores/languageStore";
import { useModals } from "@stores/modalsStore";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, type Row, type SortingState, useReactTable } from "@tanstack/react-table";
import clsx from "clsx";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { type Snowflake, WorkType } from "shared";

function sortDate(rowA: Row<AppWork>, rowB: Row<AppWork>, columnId: string) {
	const a = rowA.getValue(columnId) as string | undefined;
	const b = rowB.getValue(columnId) as string | undefined;
	if (!a && !b) return 0;
	if (!a) return -1;
	if (!b) return 1;
	return new Date(b).getTime() - new Date(a).getTime();
}

export default function Panel() {
	const { data } = useQuery(getWorksOptions());
	const formattedData = useMemo<AppWork[]>(
		() =>
			data
				? data.toReversed().map((x) => ({
						id: x.id,
						date: x.timeOfEntry,
						timeOfEntry: x.timeOfEntry,
						timeOfExit: x.timeOfExit,
						dayOfWeek: moment(x.timeOfEntry).day(),
						type: x.type,
					}))
				: [],
		[data],
	);
	const navigate = useNavigate();
	const { updateModals } = useModals();
	const { language, currentLanguage } = useLanguage();
	const columns = useMemo<ColumnDef<AppWork>[]>(
		() => [
			{
				accessorKey: "date",
				cell: (info) => moment(info.getValue() as string).format("DD MMM YYYY"),
				sortingFn: sortDate,
				header: language.date,
				minSize: 140,
				id: "date",
			},
			{
				accessorKey: "dayOfWeek",
				cell: (info) =>
					moment()
						.day(info.getValue() as number)
						.format("ddd"),
				header: language.day_of_week,
				minSize: 150,
			},
			{
				accessorKey: "timeOfEntry",
				cell(props) {
					const work = props.row.original;
					const value = props.getValue();

					return work.type === WorkType.ONSITE || work.type === WorkType.REMOTE ? (
						<div className="flex items-center gap-x-1">
							<IconMingcuteArrowRightDownFill className="size-5 text-green-400" />
							{moment(value as string).format("HH:mm")}
						</div>
					) : (
						<div>-</div>
					);
				},
				header: language.entry,
				sortingFn: sortDate,
				minSize: 100,
			},
			{
				accessorKey: "timeOfExit",
				cell(props) {
					const work = props.row.original;
					const value = props.getValue();
					const timeOfEntry = new Date(props.row.original.timeOfEntry).getTime();
					const timeOfExit = new Date(value as string).getTime();
					const duration = moment.duration(timeOfExit - timeOfEntry);

					return work.type === WorkType.ONSITE || work.type === WorkType.REMOTE ? (
						value ? (
							<div className="flex items-center gap-x-1">
								<IconMingcuteArrowLeftUpFill className="size-5 text-red-400" />
								<div>
									{duration.asHours() > 24 ? moment(value).format("DD. MMM YYYY HH:mm") : moment(value).format("HH:mm")}
									<span className="text-white/80"> ({duration.humanize()})</span>
								</div>
							</div>
						) : (
							<span className="text-white/80 italic">Not finished</span>
						)
					) : (
						<div>-</div>
					);
				},
				header: language.exit,
				sortingFn: sortDate,
				id: "timeOfExit",
				minSize: 250,
			},
			{
				accessorKey: "type",
				cell: (info) =>
					({
						[WorkType.ABSENT]: language.absent,
						[WorkType.ONSITE]: language.onsite,
						[WorkType.REMOTE]: language.remote,
						[WorkType.VACATION]: language.vacation,
					})[info.getValue() as WorkType],
				header: language.type,
				minSize: 100,
				size: 100,
			},
			{
				accessorKey: "id",
				enableSorting: false,
				header: language.actions,
				cell(props) {
					const work = props.row.original;
					return (
						(work?.timeOfExit || work?.type === WorkType.ABSENT || work?.type === WorkType.VACATION) && (
							<div className="flex items-center justify-center gap-x-2">
								<Button color="primary" className="text-sm" onClick={() => updateWork(work.id)}>
									{language.edit}
								</Button>
								<Button color="negative" className="text-sm" onClick={() => deleteWork(work.id)}>
									{language.delete}
								</Button>
							</div>
						)
					);
				},
				minSize: 180,
				size: 180,
			},
		],
		[data, currentLanguage],
	);

	const [sorting, setSorting] = useState<SortingState>([]);
	const deleteWorkMutation = useDeleteWork();

	const table = useReactTable({
		columns,
		data: formattedData ?? [],
		columnResizeMode: "onChange",
		columnResizeDirection: "ltr",
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: { sorting },
		onSortingChange: setSorting,
	});

	useEffect(() => {
		if (sorting.length === 0) {
			setSorting([{ id: "date", desc: false }]);
		}
	}, [sorting]);

	async function goToHome() {
		await navigate("/app");
		window.electronAPI.resize(480, 480);
	}

	function deleteWork(id: Snowflake) {
		updateModals({
			info: {
				status: "warn",
				title: language.are_you_sure,
				text: language.delete_record_desc,
				isOpen: true,
				onConfirm: async () => {
					if (deleteWorkMutation.isPending) {
						return;
					}

					await deleteWorkMutation.mutateAsync(id);
				},
			},
		});
	}

	function updateWork(id: Snowflake) {
		updateModals({ editWork: { isOpen: true, work: data?.find((x) => x.id === id) } });
	}

	function createWork() {
		updateModals({ createWork: { isOpen: true } });
	}

	function donwloadReport() {
		updateModals({ downloadReport: { isOpen: true } });
	}

	return (
		<div className="flex h-full w-full flex-col">
			<div className="m-5 flex">
				<Button color="primary" className="w-max shrink-0" onClick={goToHome}>
					{language.home}
				</Button>
				<div className="ml-auto flex gap-x-2">
					<Button color="primary" className=" w-max shrink-0" onClick={donwloadReport}>
						{language.download_report}
					</Button>
					<Button color="primary" className=" w-max shrink-0" onClick={createWork}>
						{language.create_record}
					</Button>
				</div>
			</div>
			<div className="h-full overflow-auto ">
				<table className="m-5 mt-0 table-fixed overflow-hidden rounded-lg border-2 border-primary" style={{ width: table.getCenterTotalSize() }}>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										colSpan={header.colSpan}
										className={clsx(
											"relative border-primary border-l-2 px-2 py-1 text-start text-white/80 first:border-l-0",
											header.column.getCanSort() && "cursor-pointer hover:bg-background-700",
										)}
										style={{ width: header.getSize() }}
										onClick={header.column.getToggleSortingHandler()}
									>
										<div className="flex w-full items-center gap-x-2">
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											{header.column.getIsSorted() === "asc" && <IconMingcuteArrowUpFill className="size-5" />}
											{header.column.getIsSorted() === "desc" && <IconMingcuteArrowDownFill className="size-5" />}
										</div>
										{header.column.getCanResize() && (
											<div
												className="-right-1.5 absolute top-0 z-10 h-full w-2.5 cursor-col-resize"
												onDoubleClick={header.column.resetSize}
												onClick={(e) => e.stopPropagation()}
												onMouseDown={(e) => header.getResizeHandler()(e)}
											/>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className="border-primary border-t-2 border-l-2 px-2 py-1 text-white first:border-l-0"
										style={{ width: cell.column.getSize() }}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
