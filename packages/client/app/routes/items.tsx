import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";



export default function ItemsIndex() {

  return (
    <DefaultLayout>
      <Outlet></Outlet>
    </DefaultLayout>
  );
}
