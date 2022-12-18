import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Outlet } from "@remix-run/react";
import { Footer, FooterDefaultData } from '~/components/Footer';
import { DefaultLayout } from '~/components/defaultLayout';
import { SwitchToggle } from '~/components/toggleColorSchema';

export default function Categories() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      padding={0}
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Text>Application navbar</Text>
          <SwitchToggle></SwitchToggle>
        </Navbar>
      }

      footer={
        <Footer data={FooterDefaultData} />
      }

    >
      <DefaultLayout>
        <Outlet></Outlet>
      </DefaultLayout>
    </AppShell>
  );
}