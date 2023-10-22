import { type LoaderFunctionArgs, json, type MetaFunction } from '@remix-run/node'
import { Container } from '#app/components/container.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card.tsx'
import { prisma } from '#app/utils/db.server.ts'

export const meta: MetaFunction = () => [{ title: 'CatArks' }]

export async function loader({ params }: LoaderFunctionArgs) {
	const recentReports = await prisma.itemPrice.findMany({ take: 50, select: { item: true, id: true } })
	return json(recentReports)
}

export default function Index() {

	return (
		<main className="">
			<Spacer size='xs' />
			<Container>
				<section>
					<div className='flex pl-4 items-center h-96 rounded-2xl bg-gradient-to-br from-green-300 to-purple-400 dark:from-gray-700 dark:via-gray-900 dark:to-black'>
						<div className='w-full'>
							<div className='text-white font-bold text-3xl'>CatAkrs</div>
							<div className='text-white text-2xl'>アークスの為のサイト</div>
							<Button variant="outline" size="lg" className='mt-6'>始める</Button>
						</div>
					</div>
				</section>
				<Spacer size='xs' />

				<section className='grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-1 gap-4  justify-center'>
					<Card className='lg:col-span-2 md:col-span-2 sm:col-span-1'>
						<CardHeader>
							<CardTitle>相場の管理</CardTitle>
						</CardHeader>
						<CardContent>
							サイトの利用者同士で相場を報告し、管理することができます。
						</CardContent>
					</Card>
					<Card className='lg:col-span-2 md:col-span-2 sm:col-span-1'>
						<CardHeader>
							<CardTitle>便利なツール</CardTitle>
						</CardHeader>
						<CardContent>
							アークス装備開発部員から交換で入手できるアイテムの価格を計算するツールなどを提供しています。
						</CardContent>
					</Card>
					<Card className='lg:col-span-2 md:col-span-full sm:col-span-1'>
						<CardHeader>
							<CardTitle>個人ブログ</CardTitle>
						</CardHeader>
						<CardContent>
							ご自慢のSSを一言添えて自慢しましょう！
						</CardContent>
					</Card>
				</section>
			</Container>
		</main>
	)
}
