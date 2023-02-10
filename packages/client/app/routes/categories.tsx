import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";
import { CategorySidebar } from "~/components/sidebar/category";



export default function Categories() {

  return (
    <DefaultLayout currentActive="categories" navbar={<CategorySidebar />}>
      <Outlet></Outlet>
    </DefaultLayout>
  );
}
