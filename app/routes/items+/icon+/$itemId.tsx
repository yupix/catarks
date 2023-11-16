import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	return json(
		await prisma.item.findFirst({
			where: { id: params.itemId },
			select: { iconUrl: true },
		}),
	)
}
