interface ActionResponse<I extends string, T = undefined, M=undefined> {
  status: "failed" | "success";
  intent: I;
  message?: M;
  body?: T;
}

type AwaitedReturnType <T extends (...args: any) => any>=  Awaited<ReturnType<T>>
