import type { LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Menu } from "~/components/Menu/Menu";
import { DefaultLayout } from "~/components/defaultLayout";
import { authenticator } from "~/utils/auth.server";



const SETTINGS = [
  { title: "基本設定", links: [{ title: "プロフィール", link: "/settings" }, { title: "テーマ", link: "/settings/themes" }] },
  { title: "クライアント設定", links: [{ title: "全般", link: "/settings/common" }] },
];

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  return null;
}

export default function Settings() {

  return (
    <DefaultLayout>
      <div className="flex gap-4 sm:flex-row flex-col">
        <ul className="menu bg-base-100 w-full sm:w-56 rounded-box">
          <Menu sections={SETTINGS} />
        </ul>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </DefaultLayout>
  );
}
