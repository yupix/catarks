import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";
import { SpeedDial } from "~/components/speedDial";



export default function ItemsIndex() {
  return (
    <DefaultLayout>
      <Outlet></Outlet>
      <SpeedDial />
    </DefaultLayout>
  );
}
