import { cn } from '#app/utils/misc.tsx'

interface Props {
	children: React.ReactNode
	className?: string
}

export function TopSection({ children, className }: Props) {
	return (
		<section>
			<div
				className={cn(
					'flex h-96 items-center rounded-2xl bg-gradient-to-br from-green-300 to-purple-400 pl-4 dark:from-gray-700 dark:via-gray-900 dark:to-black',
					className,
				)}
			>
				<div className="w-full">{children}</div>
			</div>
		</section>
	)
}
