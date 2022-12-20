import { Text, ActionIcon, Burger, Code, Group, Header, MediaQuery, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { IconMoonStars, IconSun } from "@tabler/icons"
import { FC, useState } from "react";
import { useSnapshot } from "valtio";
import { useMenuState } from "~/states/menu";

export const DefaultHeader = () => {

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const opened = useSnapshot(useMenuState).opened


  return (
    <Header height={{ base: 50, md: 70 }} >

      <Group sx={{ height: '100%' }} px={20} position="apart">
        <Group>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => useMenuState.opened = !opened}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          {/* <Logo colorScheme={colorScheme} /> */}
          <Text>Vent</Text>
          {/* <MantineLogo size={28} /> */}
          <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
        </Group>
        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
          {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoonStars size={16} />}
        </ActionIcon>
      </Group>
    </Header>
  )
}