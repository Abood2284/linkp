export type APIResponse<T = any> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};
