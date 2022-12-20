import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";

export default function ItemsPage() {
  return (
    <DefaultLayout>
      <Outlet></Outlet>
    </DefaultLayout>
  )
}