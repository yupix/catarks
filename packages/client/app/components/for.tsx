import type { ReactNode } from "react";

export const For = <T,>({
  v,
  children,
}: {
  v: [T, (v: T) => unknown, (v: T) => T];
  children: (v: T, index: number) => ReactNode;
}) => {
  let index = 0;
  const value: ReactNode[] = [];
  for (let i = v[0]; v[1](i); i = v[2](i)) {
    value.push(children(i, index++));
  }
  return <>{value}</>;
};