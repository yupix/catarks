import { Avatar, Card, Container, Grid, Group, List, Space, Table, Title } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArticleCardVertical } from "~/components/item/verticalArticleCard";
import { api, getCategoryName } from "~/utils/utils";

export async function loader({ params }: LoaderArgs) {
  const itemId = params.itemId
  if (typeof itemId !== 'string') throw new Error('アイテムIdが指定されていません')

  const res = await api.call('GET', '/api/items/:itemId', { params: { itemId } })
  const itemPrices = await api.call('GET', '/api/items/:itemId/price', { params: { itemId } })
  if (res.type === 'failed') throw new Error(JSON.stringify(res.data))
  if (itemPrices.type === 'failed') throw new Error(JSON.stringify(res.data))
  return json({ item: res.data, prices: itemPrices.data })
}

export default function Item() {
  const { item, prices } = useLoaderData<typeof loader>()

  const priceThs = (
    <tr>
      <th>
        値段
      </th>
      <th>
        報告者
      </th>
    </tr>
  )
  const priceRow = prices.map((price) => (
    <tr key={price.id}>
      <td>{price.price}</td>
      <td>
        <Group align="center">
          <Avatar src={price.reporter.avatarUrl} radius="xs"></Avatar>
          {price.reporter.username}
        </Group>
      </td>
    </tr>
  ))

  return (
    <Container>
      <div style={{ margin: '8px' }}>
        <ArticleCardVertical image={item.iconUrl} category={getCategoryName(item.type)} title={item.name} date="" />
        <Space h="lg" />
        <Grid justify="center" grow>


          <Grid.Col md={6} lg={3}>
            <Card withBorder h="100%">
              <Title order={3}>入手方法</Title>
              {item.droparias.map((aria) => <List key={aria.name}><List.Item>
                {aria.name}</List.Item></List>)}
            </Card>
          </Grid.Col>
          <Grid.Col md={6} lg={3}>
            {item.type == 'ability' &&
              <Card withBorder h="100%">
                <Title order={3}>効果</Title>
                {item.ability.effects.map((effect) => (
                  <div key={effect.name}>{effect.name}</div>
                ))}
              </Card>
            }
          </Grid.Col>
        </Grid>
        <Space h="lg" />
        <Card withBorder>
          <Table striped highlightOnHover withBorder>
            <thead>{priceThs}</thead>
            <tbody>{priceRow}</tbody>

          </Table>
        </Card>
      </div>
    </Container>
  )
}