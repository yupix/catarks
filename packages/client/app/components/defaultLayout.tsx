import { AppShell, useMantineTheme } from "@mantine/core";
import React, { FC } from "react";
import { Footer, FooterDefaultData } from "./Footer";
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
  footer = <Footer data={FooterDefaultData} />,
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
        <main
          style={{
            zIndex: 1,
            position: "relative",
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            boxShadow: "0px 18px 24px -12px rgba(0, 0, 0, 0.1);",
            paddingBottom: "16px",
            borderRadius: "2%",
          }}
        >
          {children}
        </main>
        <div style={{ height: 400 }} />
      </AppShell>
    );
  };
