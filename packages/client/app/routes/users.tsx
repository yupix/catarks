import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";



export default function Users() {

  return (
    <DefaultLayout currentActive="">
      <Outlet></Outlet>
    </DefaultLayout>
  );
}
