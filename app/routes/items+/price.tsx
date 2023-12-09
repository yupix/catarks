import { parse } from '@conform-to/zod'
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/server-runtime'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { requireUserId } from '#app/utils/auth.server.ts'
import { calcPrice } from '#app/utils/calc-price.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ request }: LoaderFunctionArgs) {
	return json({})
}

type ItempriceActionArgs = {
	request: Request
	userId: string
	formData: FormData
}
export const createItemPriceActionIntent = 'create-item-price'

export const createItemPriceFormSchema = zfd.formData({
	intent: z.literal(createItemPriceActionIntent),
	itemId: z.string(),
	price: z.number().min(900),
	ship: z.number().min(0).max(10),
	useTax: z.string().nullable().transform(v => (v === 'on' ? true : false)),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	// await validateCSRF(formData, request.headers) TODO: 将来的にCSRF対策を入れる
	const intent = formData.get('intent')

	switch (intent) {
		case createItemPriceActionIntent: {
			return createItemPriceAction({ userId, formData, request })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

async function createItemPriceAction({
	userId,
	formData,
}: ItempriceActionArgs) {
	const submission = await parse(formData, {
		async: true,
		schema: createItemPriceFormSchema.superRefine(
			async ({ price: originalPrice, useTax }, ctx) => {
				const price = await calcPrice(originalPrice, useTax) // システム利用料10%を引く

				if (price < 900) {
					// 900円以下は正しくないので例外を返す
					ctx.addIssue({
						path: ['price'],
						code: z.ZodIssueCode.custom,
						message: '税抜きで900円以上の金額を入力してください',
					})
				}
				if (Number.isInteger(price / (1 - 0.1)) === false) {
					// 売値に計算し直し、小数点が出る場合は何かおかしいので例外を返す
					ctx.addIssue({
						path: ['price'],
						code: z.ZodIssueCode.custom,
						message:
							'不正な金額です。多くの場合税込み価格を入力し、税込みにチェックを入れてないことが多いです。再度確認してください',
					})
				}
			},
		),
	})

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { itemId, price: originalPrice, ship, useTax } = submission.value

	const price = await calcPrice(originalPrice, useTax) // システム利用料10%を引く

	await prisma.itemPrice.create({
		data: {
			itemId,
			price,
			ship,
			reporterId: userId,
		},
	})

	return json({
		status: 'success',
		submission,
	} as const)
}
