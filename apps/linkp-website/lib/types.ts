import { BaseTemplateConfig, WorkspaceData } from "./templates/template-types";


export type TemplateResponse = {
  template: BaseTemplateConfig;
  previewData: WorkspaceData;
};

export interface TemplatePreviewData {
  template: BaseTemplateConfig;
  previewData: WorkspaceData;
}
