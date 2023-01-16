import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";



export default function Utils() {

  return (
    <DefaultLayout currentActive="utils">
      <Outlet></Outlet>
    </DefaultLayout>
  );
}
