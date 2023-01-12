interface ActionResponse<T = undefined> {
  status: "failed" | "success";
  intent: string;
  message?: string;
  body?: T;
}
