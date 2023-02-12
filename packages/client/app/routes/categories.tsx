import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";
import { CategorySidebar } from "~/components/sidebar/category";



export default function Categories() {

  return (
    <DefaultLayout  navbar={<CategorySidebar />}>
      <Outlet></Outlet>
    </DefaultLayout>
  );
}
