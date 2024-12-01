import { BaseTemplateConfig, WorkspaceData } from "./templates/template-types";

export type APIResponse = {
  status: 'success' | 'error';
  data?: any;
};

export type TemplateResponse = {
      template:  BaseTemplateConfig,
      previewData: WorkspaceData,
  };