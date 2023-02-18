import { Outlet } from "@remix-run/react";
import { useSnapshot } from "valtio";
import { DefaultLayout } from "~/components/defaultLayout";
import { SpeedDial } from "~/components/speedDial";
import { useSessionState } from "~/states/common";



export default function ItemsIndex() {
  const { user } = useSnapshot(useSessionState);
  return (
    <DefaultLayout>
      <Outlet></Outlet>
      {user && <SpeedDial />}
    </DefaultLayout>
  );
}
