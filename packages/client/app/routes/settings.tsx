import { Button, Container, Grid } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { IconSettings, IconUser } from "@tabler/icons";
import { authenticator } from "~/utils/auth.server";
import { DefaultLayout } from "~/components/defaultLayout";

const SETTINGS = [
  { title: '基本設定', links: [{ title: 'プロフィール', link: '/settings', icon: IconUser }, { title: 'アカウント', link: '', icon: IconSettings }, { title: 'テーマ', link: '', icon: IconUser }] },
  { title: 'クライアント設定', links: [{ title: '通知', link: '', icon: IconUser }] }
]

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: '/signin' })
  return null
}

export default function Settings() {
  const location = useLocation()

  const items = SETTINGS.map((setting) => (
    <div key={setting.title}>
      {setting.title}
      {setting.links.map((link) => (
        <div key={link.title}>
          <Link to={link.link} >
            <Button variant={location.pathname === link.link ? 'filled' : 'subtle'} color={location.pathname === link.link ? 'blue' : "dark"} leftIcon={<link.icon />} size="xs" styles={{ root: { width: '100%' }, inner: { justifyContent: "left" } }}>
              {link.title}
            </Button>
          </Link>
        </div>
      ))}
    </div>
  ))
  return (<DefaultLayout currentActive="settings">
    <Container>
      <Grid>
        <Grid.Col sm={2}>
          {items}
        </Grid.Col>
        <Grid.Col sm={10}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Container>
  </DefaultLayout>
  )
}