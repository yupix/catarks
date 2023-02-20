import type { LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { DefaultLayout } from "~/components/defaultLayout";
import { authenticator } from "~/utils/auth.server";

// const SETTINGS = [
//   { title: '基本設定', links: [{ title: 'プロフィール', link: '/settings', icon: IconUser }, { title: 'アカウント', link: '', icon: IconSettings }, { title: 'テーマ', link: '', icon: IconUser }] },
//   { title: 'クライアント設定', links: [{ title: '通知', link: '', icon: IconUser }] }
// ]

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/signin" });
  return null;
}

export default function Settings() {
  // const location = useLocation()

  // const items = SETTINGS.map((setting) => (
  //   <div key={setting.title}>
  //     {setting.title}
  //     {setting.links.map((link) => (
  //       <div key={link.title}>
  //         <Link to={link.link} >
  //           <Button variant={location.pathname === link.link ? 'filled' : 'subtle'} color={location.pathname === link.link ? 'blue' : "dark"} leftIcon={<link.icon />} size="xs" styles={{ root: { width: '100%' }, inner: { justifyContent: "left" } }}>
  //             {link.title}
  //           </Button>
  //         </Link>
  //       </div>
  //     ))}
  //   </div>
  // ))
  return (
    <DefaultLayout>
      <div>
        <Outlet />
      </div>
    </DefaultLayout>
  );
}
