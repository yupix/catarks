import { AppShell, Paper, useMantineTheme } from "@mantine/core";
import type { FC } from "react";
import React from "react";
import { Footer } from "./Footer";
import { DefaultHeader } from "./header";
import { DefaultNavBar } from "./navBar";

export const DefaultLayout: FC<{
  children?: React.ReactNode;
  currentUser?: TUserSession | null;
  currentActive: string;
  navbar?:
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | undefined;
  header?:
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | undefined;
  footer?:
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | undefined;
}> = ({
  children,
  currentActive,
  navbar = <DefaultNavBar currentActive={currentActive} />,
  header = <DefaultHeader />,
  footer = <Footer />,
}) => {
    const theme = useMantineTheme();
    return (
      <AppShell
        padding={0}
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbar={navbar}
        header={header}
        footer={footer}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
      >

        <Paper shadow="sm" mt="lg" style={{
          zIndex: 1,
          position: "relative",
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          paddingBottom: "16px",
          borderRadius: "2%",
        }}>
          {children}
        </Paper>
        <div style={{ height: 400 }} />
      </AppShell>
    );
  };
