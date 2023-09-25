// File where the enums, interfaces of the component are defined (Only used in the component - if your interface is used in multiple views, it should be in a shared folder)

export interface ExampleStateInterface {
  example: string;
}

export interface ExampleInterface {
  example: string;
}

export enum ExampleEnum {
  EXAMPLE = 'EXAMPLE',
}

export type ExampleType = ExampleEnum.EXAMPLE;
