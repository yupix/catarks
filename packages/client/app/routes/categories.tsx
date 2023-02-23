import { Outlet } from "@remix-run/react";
import { useAtom } from "jotai";
import { DefaultLayout } from "~/components/defaultLayout";
import { SpeedDial } from "~/components/speedDial";
import { useSessionState } from "~/states/common";

export default function Categories() {
  const [session] = useAtom(useSessionState);
  return (
    <DefaultLayout>
      <Outlet></Outlet>
      {session?.user && <SpeedDial />}
    </DefaultLayout>
  );
}
