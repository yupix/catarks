import { type Item } from '@prisma/client'
import { TYPE_TO_CATEGORY } from '#app/utils/const.ts'
import { NIcon } from './n-icon.tsx'

interface Props {
	item: Item
	nowPrice?: number
	useCopy?: boolean
	copyHandler?: (item: Item) => void
}

export function ItemCard({ item, nowPrice, useCopy, copyHandler }: Props) {
	const clickItemNameHandler = () => {
		if (useCopy) {
			navigator.clipboard.writeText(item.name)
			copyHandler?.(item)
		}
	}

	return (
		<div className="grid border-spacing-0 grid-cols-3 gap-4 rounded-md border p-2">
			<div>
				<img
					className="h-20 w-20 rounded-md"
					src={item.iconUrl}
					alt={`${item.name} icon`}
					loading="lazy"
				/>
			</div>
			<div style={{ width: '100%' }} className="col-span-2">
				<div style={{ maxWidth: 'calc(90%)' }}>
					<p className=" text-xs font-bold">{TYPE_TO_CATEGORY[item.type]}</p>
					<p
						className="cat-item-card-title flex items-center font-bold"
						onClick={clickItemNameHandler}
					>
						{item.name}
					</p>
					{nowPrice ? (
						<p className="items-center flex">
							<NIcon />
							{nowPrice}
						</p>
					) : null}
				</div>
			</div>
		</div>
	)
}
