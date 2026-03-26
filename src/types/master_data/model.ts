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

export interface MasterData {
  priorities: Priority[];
  statuses: Status[];
}
