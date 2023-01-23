interface ActionResponse<T = undefined> {
  status: "failed" | "success";
  intent: string;
  message?: string;
  body?: T;
}

type ObjectValues<T> = T[keyof T]