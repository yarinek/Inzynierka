export interface TableConfig {
  name: string;
  value: string;
  type?: TableColumnType;
  actions?: TableColumnActions[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customDisplay?: (row: any) => string;
}

export enum TableColumnType {
  ACTIONS = 'ACTIONS',
  CUSTOM_DISPLAY = 'CUSTOM_DISPLAY',
  DATETIME = 'DATETIME',
}

export interface TableColumnActions {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (row: any) => void;
  color?: string;
}
