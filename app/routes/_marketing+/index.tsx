import {
	type LoaderFunctionArgs,
	json,
	type MetaFunction,
} from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Container } from '#app/components/container.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { Button } from '#app/components/ui/button.tsx'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { logos } from './logos/logos.ts'

export const meta: MetaFunction = () => [{ title: 'CatArks' }]

export async function loader({ params }: LoaderFunctionArgs) {
	const recentReports = await prisma.itemPrice.findMany({
		take: 50,
		select: { item: true, id: true },
	})
	return json(recentReports)
}

// Tailwind Grid cell classes lookup
const columnClasses: Record<(typeof logos)[number]['column'], string> = {
	1: 'xl:col-start-1',
	2: 'xl:col-start-2',
	3: 'xl:col-start-3',
	4: 'xl:col-start-4',
	5: 'xl:col-start-5',
}
const rowClasses: Record<(typeof logos)[number]['row'], string> = {
	1: 'xl:row-start-1',
	2: 'xl:row-start-2',
	3: 'xl:row-start-3',
	4: 'xl:row-start-4',
	5: 'xl:row-start-5',
	6: 'xl:row-start-6',
}

export default function Index() {
	return (
		<main className="">
			<Spacer size="xs" />
			<Container>
				<section>
					<div className="flex h-96 items-center rounded-2xl bg-gradient-to-br from-green-300 to-purple-400 pl-4 dark:from-gray-700 dark:via-gray-900 dark:to-black">
						<div className="w-full">
							<div className="text-3xl font-bold text-white">CatAkrs</div>
							<div className="text-2xl text-white">アークスの為のサイト</div>
							<Link to="/categories/ability">
								<Button variant="outline" size="lg" className="mt-6">
									始める
								</Button>
							</Link>
						</div>
					</div>
				</section>
				<Spacer size="xs" />

				<section className="grid justify-center gap-4 sm:grid-cols-1 md:grid-cols-4  lg:grid-cols-6">
					<Card className="sm:col-span-1 md:col-span-2 lg:col-span-2">
						<CardHeader>
							<CardTitle>相場の管理</CardTitle>
						</CardHeader>
						<CardContent>
							サイトの利用者同士で相場を報告し、管理することができます。
						</CardContent>
					</Card>
					<Card className="sm:col-span-1 md:col-span-2 lg:col-span-2">
						<CardHeader>
							<CardTitle>便利なツール</CardTitle>
						</CardHeader>
						<CardContent>
							アークス装備開発部員から交換で入手できるアイテムの価格を計算するツールなどを提供しています。
						</CardContent>
					</Card>
					<Card className="sm:col-span-1 md:col-span-full lg:col-span-2">
						<CardHeader>
							<CardTitle>個人ブログ</CardTitle>
						</CardHeader>
						<CardContent>ご自慢のSSを一言添えて自慢しましょう！</CardContent>
					</Card>
				</section>
			</Container>
			</main>

			)
}
