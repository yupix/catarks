import {
  Avatar,
  Card,
  Text,
  Container,
  Grid,
  Group,
  HoverCard,
  List,
  Space,
  Table,
  Title,
  Stack,
  Tabs,
} from "@mantine/core";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArticleCardVertical } from "~/components/item/verticalArticleCard";
import { SITE_META_PREFIX } from "~/const";
import { getItemByID } from "~/middlewares/items";
import { generateSvg } from "~/utils/og.server";
import { getCategoryName } from "~/utils/utils";
import { ClientOnly } from "remix-utils";
import { Line } from 'react-chartjs-2';
import { getItemPriceChartById } from "~/middlewares/charts";
import { PriceChart } from "~/components/item/priceChart";


export async function loader({ params }: LoaderArgs) {
  const itemId = params.itemId;
  if (typeof itemId !== "string")
    throw new Error("アイテムIdが指定されていません");

  const item = await getItemByID(itemId);
  const charts = await getItemPriceChartById(itemId);
  if (!item) throw Error('Item Not Found')
  const ogpImage = await generateSvg({title: item.name})
  return json({item, ogpImage, charts});
}

export const meta: MetaFunction<typeof loader> = ({data,  location}) => {
  return {
    title: `${data.item.name} - ${SITE_META_PREFIX}`,
    charset: 'utf-8',
    'og:title': `${data.item.name} - ${SITE_META_PREFIX}`,
    'og:url': `https://catarks.org/items/${data.item.id}`,
    'og:image': data.ogpImage
  }
}

export default function Item() {
  const {item, charts} = useLoaderData<typeof loader>();

  const priceThs = (
    <tr>
      <th>値段</th>
      <th>報告者</th>
    </tr>
  );
  const priceRow = item.prices
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).valueOf();
      const dateB = new Date(b.createdAt).valueOf();
      return dateA - dateB;
    })
    .reverse()
    .map((price) => (
      <tr key={price.id}>
        <td>{price.price}</td>
        <td>
          <HoverCard
            width={280}
            shadow="md"
            withinPortal
            withArrow
            position="bottom-start"
          >
            <HoverCard.Target>
              <Link to={`/users/${price.reporter.id}`}>
                <Group align="center">
                  <Avatar src={price.reporter.avatarUrl} radius="xs"></Avatar>
                  {price.reporter.username}
                </Group>
              </Link>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group>
                <Avatar src={price.reporter.avatarUrl} radius="xl" />
                <Stack spacing={5}>
                  <Text size="sm" weight={700} sx={{ lineHeight: 1 }}>
                    {price.reporter.username}
                  </Text>
                  <Link to={`/users/${price.reporter.id}`} color="dimmed">
                    @{price.reporter.username}
                  </Link>
                </Stack>
              </Group>
              <Text size="sm" mt="md">
                {price.reporter.description}
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </td>
      </tr>
    ));

  return (
    <Container>
      <div style={{ margin: "8px" }}>
        <ArticleCardVertical
          image={item.iconUrl}
          category={getCategoryName(item.type)}
          title={item.name}
          date=""
        />
        <Space h="lg" />
        <Grid justify="center" grow>
          <Grid.Col md={6} lg={3}>
            <Card withBorder h="100%">
              <Title order={3} color="dark.4">
                入手方法
              </Title>
              <List>
                {item.droparias.map((aria) => (
                  <List.Item key={aria.name}>{aria.name}</List.Item>
                ))}
              </List>
            </Card>
          </Grid.Col>
          <Grid.Col md={6} lg={3}>
            {item.type == "ability" && (
              <Card withBorder h="100%">
                <Title order={3} color="dark.4">
                  効果
                </Title>
                {item?.ability?.effects.map((effect) => (
                  <div key={effect.name}>{effect.name}</div>
                ))}
              </Card>
            )}
          </Grid.Col>
        </Grid>
        <Space h="lg" />
        <Tabs defaultValue="prices">
        <Card withBorder>
        <Tabs.List>
          <Tabs.Tab value="prices">価格</Tabs.Tab>
          <Tabs.Tab value="chart">チャート</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="prices">
          <Table striped highlightOnHover withBorder>
            <thead>{priceThs}</thead>
            <tbody>{priceRow}</tbody>
          </Table>
          </Tabs.Panel>
          <Tabs.Panel value="chart">
                <ClientOnly fallback={<></>}>
                  {() => <>
                  <PriceChart chartData={charts} />
                  </>}
                </ClientOnly>
          </Tabs.Panel>
        </Card>
        </Tabs>
      </div>
    </Container>
  );
}
