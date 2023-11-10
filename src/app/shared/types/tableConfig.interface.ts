export interface TableConfig {
  name: string;
  value: string;
  type?: TableColumnType;
  actions?: TableColumnActions[];
}

export enum TableColumnType {
  ACTIONS = 'ACTIONS',
}

export interface TableColumnActions {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (row: any) => void;
  color?: string;
}
