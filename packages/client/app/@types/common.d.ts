interface ActionResponse<I extends string, T = undefined> {
  status: "failed" | "success";
  intent: I;
  message?: string;
  body?: T;
}

type ObjectValues<T> = T[keyof T]