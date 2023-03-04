import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";

export default function MyIndex() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  )
}