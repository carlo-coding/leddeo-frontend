export enum HistoryActions {
  VIDEO_CAPTION = "VC",
  SUBTITLE_TRANSLATE = "ST",
}

export interface IHistoryItem {
  id: number;
  action: HistoryActions;
  description: string | null;
  created_at: string;
}
