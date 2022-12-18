import { useMantineTheme } from "@mantine/core"
import React, { FC } from "react"

export const DefaultLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useMantineTheme()
  return (
    <>
      <main style={{
        zIndex: 1,
        position: "relative",
        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        boxShadow: "0px 18px 24px -12px rgba(0, 0, 0, 0.1);",
        paddingBottom: "16px",
        borderRadius: "2%"


      }}>
        {children}
      </main>
      <div style={{ height: 400 }} />

    </>
  )
}