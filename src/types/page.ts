export interface Page {
  id: number;
  title: string;
  icon?: string;
  children: Page[];
}
