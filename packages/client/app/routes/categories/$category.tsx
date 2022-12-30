import { Center, Container, Grid } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArticleCardVertical } from "~/components/item/verticalArticleCard";
import { Pagination } from "~/components/pagination";
import { HTTP_ERRORS, api, getCategoryName, getPaginationPageNumber } from "~/utils/utils";

export async function loader({ params, request }: LoaderArgs) {
  const url = new URL(request.url)
  const page = url.searchParams.get('page') || '1'
  const limit = 20
  const skip = getPaginationPageNumber({ limit, page })

  const res = await api.call('GET', '/api/items', { query: { type: params.category, skip, limit } })
  const status = res.status?.toString() || "404"
  console.log(status, res.type)
  if (res.type === 'failed') throw new Response(`${HTTP_ERRORS.get(status)}`, { status: res.status })
  return json({ data: res.data, category: params.category, page: Number(page) })
}

export default function Category() {
  const { data, page, category } = useLoaderData<typeof loader>()


  return (
    <Container>
      <Grid justify="center" style={{ margin: 0 }} grow>
        {data.items.map((item) => <Grid.Col key={item.id} md={6} lg={4}>
          <Link to={`/items/${item.id}`} style={{ textDecoration: 'none' }}>
            <ArticleCardVertical author={{ name: '1000', avatar: "https://s3.akarinext.org/assets/*/pso2/n.webp" }} image={item.iconUrl} category={getCategoryName(item.type)} title={item.name} date="" />
          </Link></Grid.Col>)}
      </Grid>
      <div>
        <Center>
          <Pagination max={Math.floor(data.max / 20)} currentPage={page} to={`/categories/${category}?page=`} />
        </Center>
      </div>
    </Container>)
}

// export function ErrorBoundary({ error }: any) {
//   console.log(error)
//   return (
//     <>{error.data.statusCode}</>
//   );
// }
