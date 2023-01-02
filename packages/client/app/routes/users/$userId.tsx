import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createStyles, Avatar, Text, Group, Container, Box, Indicator } from '@mantine/core';

import { api, assertIsDefined } from "~/utils/utils";

export async function loader({ params }: LoaderArgs) {
  assertIsDefined(params.userId)
  const res = await api.call('GET', '/api/users/:userId', { params: { userId: params.userId } })
  if (res.type === 'failed') throw new Error(JSON.stringify(res.data))
  return res.data
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
  },
}));


export default function UserCardImage() {
  const { classes, theme } = useStyles();
  const user = useLoaderData<typeof loader>()


  return (
    <Container className={classes.card} p={0}>
      <div style={{ backgroundImage: `url(${user.bannerUrl})`, backgroundPosition: "center", height: 200 }}>
        <Box style={{ position: "relative", height: "100%", width: "100%", }}>
          <Box style={{ position: "absolute", bottom: 0, left: 0, paddingLeft: '165px', color: "white" }}>
            <Text align="center" size={30} weight={500} mt="lg" style={{ textShadow: "0px 0px 4px #000" }} >
              {user.username}
            </Text>
          </Box>
        </Box>
      </div>
      <Box mt="-80px">
        <Indicator dot inline size={25} offset={122} position="bottom-end" color="red" withBorder styles={{ common: { bottom: 20 } }}>

          <Avatar src={user.avatarUrl} size={145} radius={80} className={classes.avatar} styles={{ 'root': { marginLeft: "0px !important", boxShadow: "0px 0px 20px 2px rgba(17, 17, 26, 0.18);" } }} />
        </Indicator>
      </Box>
      <Text align="center" size="sm" color="dimmed">
        {/* {job} */}
      </Text>
      <Group mt="md" position="center" spacing={30}>
        {/* {items} */}
      </Group>

    </Container>
  );
}