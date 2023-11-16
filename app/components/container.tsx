import { cn } from '#app/utils/misc.tsx'

interface Props {
	children: React.ReactNode
	className?: string
}

export function Container({ children, className }: Props) {
	return (
		<div className={cn(`container flex justify-center`, className)}>
			<div className="w-full">{children}</div>
		</div>
	)
}
