import Button from "@components/Button";
import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type Column = {
	id: number;
	start: number;
	end: number;
	test: number;
};

export default function Panel() {
	const navigate = useNavigate();
	const columns = useMemo<ColumnDef<Column>[]>(
		() => [
			{ accessorKey: "id", cell: (info) => info.getValue(), header: "ID" },
			{ accessorKey: "start", cell: (info) => info.getValue(), header: "Start" },
			{ accessorKey: "end", cell: (info) => info.getValue(), header: "End" },
			{ accessorKey: "test", cell: (info) => info.getValue(), header: "Test" },
		],
		[],
	);

	const [data, setData] = useState<Column[]>(
		new Array(10).fill({ id: 0, start: 0, end: 0, test: 0 }).map(() => ({
			id: Math.floor(Math.random() * 100),
			start: Math.floor(Math.random() * 100),
			end: Math.floor(Math.random() * 100),
			test: Math.random(),
		})),
	);

	const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });

	async function goToHome() {
		await navigate("/app");
		window.electronAPI.resize(480, 480);
	}

	return (
		<div className="flex h-full w-full flex-col gap-y-5 p-5">
			<Button className="w-max" onClick={goToHome}>
				Go to Home
			</Button>
			<table className="w-full table-fixed overflow-hidden rounded-lg border-2 border-primary">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className="cursor-pointer border-primary border-l-2 px-2 text-start text-white first:border-l-0 hover:bg-background-700"
									onClick={header.column.getToggleSortingHandler()}
								>
									<div className="flex w-full items-center gap-x-2">
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										{header.column.getIsSorted() === "asc" && <IconMingcuteArrowUpFill />}
										{header.column.getIsSorted() === "desc" && <IconMingcuteArrowDownFill />}
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="border-primary border-t-2 border-l-2 px-2 text-white first:border-l-0">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
