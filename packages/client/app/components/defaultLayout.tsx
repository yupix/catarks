import { Paper, useMantineTheme } from "@mantine/core";
import type { FC } from "react";
import React from "react";
import { Footer } from "./Footer";
import { DefaultHeader } from "./header";

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
}) => {
  const theme = useMantineTheme();
  return (
    <>
      <DefaultHeader />
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        <aside className="hidden sm:block"></aside>
        <article className="col-span-4">
        <Paper
          shadow="sm"
          mt="lg"
          style={{
            zIndex: 1,
            position: "relative",
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            paddingBottom: "16px",
            borderRadius: "2%",
          }}
        >
          {children}
        </Paper>
        </article>
        <div style={{ height: 400 }} />
        <div className="col-span-4">
        <Footer />
        </div>
      </div>
    </>
  );
};
