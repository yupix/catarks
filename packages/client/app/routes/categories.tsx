import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";



export default function Categories() {

  return (
    <DefaultLayout>
      <Outlet></Outlet>
    </DefaultLayout>
  );
}
