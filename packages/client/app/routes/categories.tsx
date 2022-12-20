import { Outlet, useLoaderData } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/auth.server";



export default function Categories() {

  return (
    <DefaultLayout>
      <Outlet></Outlet>
    </DefaultLayout>
  );
}
