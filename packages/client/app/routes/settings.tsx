import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";
import { authenticator } from "~/utils/auth.server";



const SETTINGS = [
  { title: "基本設定", links: [{ title: "プロフィール", link: "/settings" }, {title: "テーマ", link: "/settings/themes" }] },
  { title: "クライアント設定", links: [{ title: "全般", link: "/settings/common" }] },
];

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  return null;
}

export default function Settings() {
  const location = useLocation();

  return (
    <DefaultLayout>
      <div className="flex gap-4 sm:flex-row flex-col">
        <ul className="menu bg-base-100 w-full sm:w-56 rounded-box">
          {SETTINGS.map((setting, i) => {
            return (
              <div key={setting.title}>
                <li>
                  <Link to="">
                    <span className="menu-title">{setting.title}</span>
                  </Link>
                </li>
                {setting.links.map((link) => {
                  return (
                    <li key={link.title}>
                      <Link to={link.link} className={`${location.pathname === link.link  ? 'active' : ''}`}>
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
                {SETTINGS.length-1 !== i && <li></li>}
              </div>
            );
          })}


        </ul>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </DefaultLayout>
  );
}
