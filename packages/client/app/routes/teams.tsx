import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";

export default function TeamsIndex() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  )
}