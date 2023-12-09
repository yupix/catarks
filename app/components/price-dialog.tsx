import { useFetcher, useRouteLoaderData } from '@remix-run/react'
import { IconPencil } from '@tabler/icons-react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useRemixForm } from 'remix-hook-form'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { type loader as RootLoader } from '#app/root.tsx'
import { type loader as ItemIconLoader } from '#app/routes/items+/icon+/$itemId.tsx'
import { createItemPriceActionIntent } from '#app/routes/items+/price.tsx'
import {
	type AutoCompleteItem,
	AutoCompleteWithFormField,
} from './auto-complete.tsx'
import { Button } from './ui/button.tsx'
import { Checkbox } from './ui/checkbox.tsx'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog.tsx'
import { Input } from './ui/input.tsx'
import { Label } from './ui/label.tsx'

const ReportPriceModal = memo(function ReportPriceModal() {
	let [itemIcon, setItemIcon] = useState({})
	const data = useRouteLoaderData<typeof RootLoader>('root') // アイテムの一覧を取得するために、rootのloaderを使う

	const selectedItemIconFetcher = useFetcher<typeof ItemIconLoader>()
	const createItemPriceFetcher = useFetcher<typeof ItemIconLoader>()

	useEffect(() => {
		if (
			selectedItemIconFetcher.state === 'idle' &&
			selectedItemIconFetcher.data
		) {
			setItemIcon({
				backgroundImage: `url(${selectedItemIconFetcher.data.iconUrl})`,
			})
		}
	}, [selectedItemIconFetcher])
	//   const [modalState, setModalState] = useAtom(useModalState);

	//   const [session] = useAtom(useSessionState);
	// const location = useLocation();
	// const [option, setOption] = useState<AutoCompleteItem | undefined>(
	//     undefined
	// );
	// useEffect(() => {
	//     const itemId = location.pathname.split("/").pop();
	//     if (z.string().cuid().parse(itemId) && items) {
	//         const hitItems = items.filter((v) => v.value === itemId);
	//         if (hitItems.length > 0) {
	//             setOption(hitItems[0]);
	//             fetcher.submit(null, {
	//                 action: `/api/items/${hitItems[0].value}`,
	//                 method: "get",
	//             });
	//         }
	//     }
	//     // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [location.pathname, items]);

	// useMount(() => {
	//     fetcher.submit(null, { action: "/api/items?index", method: "get" });
	// });
	// const fetcher = useFetcher<
	//     TgetItemsLoader | TCreateItemPriceAction | TGetItemByIdLoader
	// >();
	// const [selectedItem, setSelectedItem] = useState<undefined | Items>(
	//     undefined
	// );

	// useEffect(() => {
	//     if (fetcher.data) {
	//         const data = fetcher.data;
	//         if (fetcher.data.intent === "getItems") {
	//             assertIsDefined(fetcher.data.body);
	//             setItems(
	//                 fetcher.data.body.map((item) => {
	//                     return { value: item.id, label: item.name };
	//                 })
	//             );
	//             return;
	//         }
	//         if (data.intent === "getItemById" && data.status === "success") {
	//             setSelectedItem(data.body);
	//         }
	//         if (data.intent === "createPrice") {
	//             if (data.status === "failed") {
	//                 if (data.message === "BELOW_THE_MINIMUM_PRICE") {
	//                     toast.error("価格が最低価格(900)を下回っています", {
	//                         position: "bottom-right",
	//                     });
	//                 }
	//                 if (data.message === "INVALID_PRICE") {
	//                     toast.error("不正な価格です", {
	//                         position: "bottom-right",
	//                     });
	//                 }
	//             }
	//             if (data.status === "success") {
	//                 toast.custom(
	//                     (t) => (
	//                         <div
	//                             className={`${t.visible ? "animate-enter" : "animate-leave"
	//                                 } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
	//                         >
	//                             <div className="flex-1 w-0 p-4">
	//                                 <div className="flex items-start">
	//                                     <div className="flex-shrink-0 pt-0.5">
	//                                         <img
	//                                             className="h-10 w-10 rounded-full"
	//                                             src={data?.body?.item.iconUrl}
	//                                             alt=""
	//                                         />
	//                                     </div>
	//                                     <div className="ml-3 flex-1">
	//                                         <p className="text-sm font-medium text-gray-900">
	//                                             {data?.body?.item.name}
	//                                         </p>
	//                                         <p className="mt-1 text-sm text-gray-500">
	//                                             価格の報告に成功しました
	//                                         </p>
	//                                     </div>
	//                                 </div>
	//                             </div>
	//                             <div className="flex border-l border-gray-200">
	//                                 <Link
	//                                     to={`/items/${data?.body?.item.id}`}
	//                                     onClick={() => {
	//                                         toast.dismiss(t.id);
	//                                         setModalState({ isOpenedPriceRepost: false });
	//                                     }}
	//                                     className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
	//                                 >
	//                                     アイテムを見る
	//                                 </Link>
	//                             </div>
	//                         </div>
	//                     ),
	//                     { position: "bottom-right" }
	//                 );
	//             }
	//         }
	//     }
	// }, [fetcher.data]);
	const handleSelectChange = (option: AutoCompleteItem) => {
		selectedItemIconFetcher.submit(null, {
			action: `/items/icon/${option.value}`,
			method: 'get',
		})
	}

	type FormData = {
		intent: string
		itemId: string
		price: number
		qty: number
		ship: number
		useTax: boolean
	}


	const remixForm = useRemixForm<FormData>({
		criteriaMode: 'all',
		defaultValues: {
			intent: 'create-item-price',
			price: 1000,
			qty: 1,
			ship: 8,
			useTax: false,
		},
		mode: 'onSubmit',
		submitConfig: {
			action: '/items/price',
			method: 'POST',
		},
	})
	const {
		watch,
		register,
		setValue,
		formState: { errors },
	} = remixForm

	const price = watch('price')
	const qty = watch('qty')
	const useTax = watch('useTax')
	const proceeds = useMemo(() => {
		const _price = price / qty
		return (useTax ? _price * (1 - 0.1) : _price / (1 - 0.1)).toLocaleString()
	}, [price, qty, useTax])


	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>値段の報告</DialogTitle>
				<DialogDescription asChild>
					<div className="bg-base-100 block sm:flex">
						<div className="flex-0 bg-base-200 flex items-center justify-center rounded-r-lg p-5">
							<div
								className="h-24 w-24 rounded-full border-4 border-solid border-gray-600 bg-white bg-cover bg-center shadow-lg"
								style={itemIcon}
							/>
						</div>
						<div className="flex-1 p-6">
							<createItemPriceFetcher.Form
							{...remixForm}
							action="/items/price"
							method="POST"
							>
								<AuthenticityTokenInput />
								<HoneypotInputs />
								<AutoCompleteWithFormField<FormData>
									name="itemId"
									form={remixForm}
									placeholder="アイテムを選択"
									notfoundText="アイテムが見つかりませんでした"
									searchWordPlaceholder="アイテムを検索"
									options={
										data?.items.map(item => {
											return { value: item.id, label: item.name }
										}) ?? []
									}
									onCustomSelected={value => {
										handleSelectChange(value)
									}}
								/>
								{errors.itemId && <p>{errors.itemId.message}</p>}
								<div>
									<Label htmlFor="price">値段</Label>
									<Input
										id="price"
										required
										type="number"
										step={100}
										min={900}
										max={99999999999}
										{...register('price')}
									/>
									{errors.price && <p>{errors.price.message}</p>}
								</div>
								<div>
									<Label htmlFor="qty">個数</Label>
									<Input
										id="qty"
										step={1}
										type="number"
										defaultValue={1}
										min={1}
										max={999}
										{...register('qty')}
									/>
								</div>
								<div>
									<Label htmlFor="ship">シップ番号</Label>
									<Input
										id="ship"
										step={1}
										type="number"
										// TODO: 将来的にユーザーのshipを使えるように
										// defaultValue={user?.ship || 8}
										min={1}
										max={10}
										{...register('ship')}
									/>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										onCheckedChange={checked => {
											const _checked = checked.valueOf()
											setValue(
												'useTax',
												typeof _checked === 'boolean' ? _checked : false,
											)
										}}
										{...register('useTax')}
									/>
									<label htmlFor="useTax">税込み</label>
								</div>
								<div>
									{useTax ? (
										<>
											<p>純売上: {(price * (1 - 0.1)).toLocaleString()}</p>
											<p>売値: {price.toLocaleString()}</p>
										</>
									) : (
										<>
											<p>純売上: {(price * (1 - 0.1)).toLocaleString()}</p>

											<p>売値: {Number(price).toLocaleString()}</p>
										</>
									)}
									<p>一つあたりの価格: {proceeds}</p>
								</div>
								<div className="card-actions justify-end">
									<Button
										type="submit"
										value={createItemPriceActionIntent}
										{...register('intent')}
									>
										送信
									</Button>
								</div>
							</createItemPriceFetcher.Form>
						</div>
					</div>
				</DialogDescription>
			</DialogHeader>
		</DialogContent>
	)
})

export function ReportPriceDial() {
	return (
		<div className="group fixed bottom-6 right-6">
			<Dialog>
				<DialogTrigger>
					<Button variant="outline" size="icon" asChild>
						<IconPencil />
					</Button>
				</DialogTrigger>
				<ReportPriceModal />
			</Dialog>
		</div>
	)
}
