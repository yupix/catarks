interface ActionResponse<I extends string, T = undefined, M=undefined> {
  status: "failed" | "success";
  intent: I;
  message?: M;
  body?: T;
}

