export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}

export interface DatePreset {
  id: string;
  label: string;
  range: DateRange;
}
