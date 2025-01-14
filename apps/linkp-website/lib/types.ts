import { BaseTemplateConfig, WorkspaceData } from "./templates/template-types";

// Import necessary types from your schema
import type {
  SelectWorkspace,
  SelectWorkspaceLink,
  SelectLinkEvent,
  SelectAggregatedMetric,
  SelectRealtimeMetric,
} from "@repo/db/schema";

export type TemplateResponse = {
  template: BaseTemplateConfig;
  previewData: WorkspaceData;
};

export interface TemplatePreviewData {
  template: BaseTemplateConfig;
  previewData: WorkspaceData;
}


