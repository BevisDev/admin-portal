export interface Priority {
  id: number;
  label: string;
  color: string;
}

export interface Status {
  id: number;
  label: string;
  color: string;
}

export interface Constant {
  priorities: Priority[];
  statuses: Status[];
}
