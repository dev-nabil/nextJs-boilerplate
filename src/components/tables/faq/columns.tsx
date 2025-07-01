import { CellAction } from "./cell-action";

export const columns: any = [
  {
    accessorKey: "question",
    header: "Question",
    cell: (cell: any) =>
      cell?.row?.original?.question ?? (
        <span className="text-muted-foreground">N/A</span>
      ),
  },
  {
    id: "actions",
    header: () => <div className="text-end">Actions</div>,
    cell: (cell: any) => <CellAction id={cell?.row?.original?.id ?? ""} />,
  },
];
