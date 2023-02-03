import { ActionIcon, Burger, Code, Group, Header, MediaQuery, useMantineColorScheme, useMantineTheme, Tooltip, Button, Title } from "@mantine/core"
import { Form } from "@remix-run/react";
import { IconMoonStars, IconPencil, IconSun } from "@tabler/icons"
import { useSnapshot } from "valtio";
import { useModalState, useSessionState } from "~/states/common";
import { useMenuState } from "~/states/menu";

export const DefaultHeader = () => {

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const opened = useSnapshot(useMenuState).opened
  const user = useSnapshot(useSessionState).user

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
          <div>
            <Title color="dark" size="1.5em">Cat Arks</Title>
          </div>
          {/* <Text>CatArks</Text> */}
          {/* <MantineLogo size={28} /> */}
          <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
        </Group>
        <Group>
          {user ? <Tooltip label="価格を報告する">
            <ActionIcon variant="default" onClick={() => {useModalState.isOpenedPriceRepost = true}}><IconPencil size={16} /></ActionIcon>
          </Tooltip> : <Form action="/auth/auth0" method="post">
            <Button size="xs" type="submit">ログイン</Button>
          </Form>}
          <Tooltip label={colorScheme === 'dark' ? '光に満たされる' : '闇に飲まれる'}>
            <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
              {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoonStars size={16} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Header>
  )
}