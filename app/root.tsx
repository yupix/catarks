import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { cssBundleHref } from '@remix-run/css-bundle'
import {
	json,
	type DataFunctionArgs,
	type HeadersFunction,
	type LinksFunction,
	type MetaFunction,
} from '@remix-run/node'
import {
	Form,
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetcher,
	useFetchers,
	useLoaderData,
	useMatches,
	useNavigation,
	useSubmit,
} from '@remix-run/react'
import { withSentry } from '@sentry/remix'
import { IconMenu2 } from '@tabler/icons-react'
import React, { useEffect, useRef } from 'react'
import rdtStylesheet from "remix-development-tools/index.css";
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { Confetti } from './components/confetti.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { ErrorList } from './components/forms.tsx'
import { ReportPriceDial } from './components/price-dialog.tsx'
import { EpicProgress } from './components/progress-bar.tsx'
import { SearchBar } from './components/search-bar.tsx'
import { EpicToaster } from './components/toaster.tsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion.tsx'
import { Button } from './components/ui/button.tsx'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from './components/ui/dropdown-menu.tsx'
import { Icon, href as iconsHref } from './components/ui/icon.tsx'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from './components/ui/navigation-menu.tsx'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet.tsx'
import fontStyleSheetUrl from './styles/font.css'
import tailwindStyleSheetUrl from './styles/tailwind.css'
import { authenticator, getUserId } from './utils/auth.server.ts'
import { cache, cachified } from './utils/cache.server.ts'
import { ClientHintCheck, getHints, useHints } from './utils/client-hints.tsx'
import { getConfetti } from './utils/confetti.server.ts'
import { ITEM_TYPES, TYPE_TO_CATEGORY } from './utils/const.ts'
import { csrf } from './utils/csrf.server.ts'
import { prisma } from './utils/db.server.ts'
import { getEnv } from './utils/env.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { cn, combineHeaders, getDomainUrl, getUserImgSrc } from './utils/misc.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import { useRequestInfo } from './utils/request-info.ts'
import { type Theme, setTheme, getTheme } from './utils/theme.server.ts'
import { makeTimings, time } from './utils/timing.server.ts'
import { getToast } from './utils/toast.server.ts'
import { useOptionalUser, useUser } from './utils/user.ts'


export const links: LinksFunction = () => {
	return [
		// Preload svg sprite as a resource to avoid render blocking
		{ rel: 'preload', href: iconsHref, as: 'image' },
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'preload', href: fontStyleSheetUrl, as: 'style' },
		{ rel: 'preload', href: tailwindStyleSheetUrl, as: 'style' },
		cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,
		{ rel: 'mask-icon', href: '/favicons/mask-icon.svg' },
		{
			rel: 'alternate icon',
			type: 'image/png',
			href: '/favicons/favicon-32x32.png',
		},
		{ rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon.png' },
		{
			rel: 'manifest',
			href: '/site.webmanifest',
			crossOrigin: 'use-credentials',
		} as const, // necessary to make typescript happy
		//These should match the css preloads above to avoid css as render blocking resource
		{ rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
		{ rel: 'stylesheet', href: fontStyleSheetUrl },
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
		...(process.env.NODE_ENV === "development" ? [{ rel: "stylesheet", href: rdtStylesheet }] : []),

	].filter(Boolean)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data ? 'CatArks' : 'Error | CatArks' },
		{ name: 'description', content: `Your own captain's log` },
	]
}


export async function loader({ request }: DataFunctionArgs) {
	const timings = makeTimings('root loader')
	const userId = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	})

	const user = userId
		? await time(
			() =>
				prisma.user.findUniqueOrThrow({
					select: {
						id: true,
						name: true,
						username: true,
						image: { select: { id: true } },
						roles: {
							select: {
								name: true,
								permissions: {
									select: { entity: true, action: true, access: true },
								},
							},
						},
					},
					where: { id: userId },
				}),
			{ timings, type: 'find user', desc: 'find user in root' },
		)
		: null
	if (userId && !user) {
		console.info('something weird happened')
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await authenticator.logout(request, { redirectTo: '/' })
	}


	const items = await cachified({
		key: `root-loader-items`,
		cache,
		timings,
		ttl: 1000 * 60,
		swr: 1000 * 60 * 60 * 24 * 7,
		async getFreshValue() {
			await new Promise(r => setTimeout(r, 3000))
			const items = await prisma.item.findMany()
			return items;
		}
	})

	const { toast, headers: toastHeaders } = await getToast(request)
	const { confettiId, headers: confettiHeaders } = getConfetti(request)
	const honeyProps = honeypot.getInputProps()
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken()


	return json(
		{
			user,
			items,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {
					theme: getTheme(request),
				},
			},
			ENV: getEnv(),
			toast,
			confettiId,
			honeyProps,
			csrfToken,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
				confettiHeaders,
				csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : null,
			),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

const ThemeFormSchema = z.object({
	theme: z.enum(['system', 'light', 'dark']),
})


export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const submission = parse(formData, {
		schema: ThemeFormSchema,
	})




	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}
	const { theme } = submission.value

	const responseInit = {
		headers: { 'set-cookie': setTheme(theme) },
	}
	return json({ success: true, submission }, responseInit)
}


function Document({
	children,
	nonce,
	theme = 'light',
	env = {},
}: {
	children: React.ReactNode
	nonce: string
	theme?: Theme
	env?: Record<string, string>
}) {
	return (
		<html lang="en" className={`${theme} h-full overflow-x-hidden`}>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body className="bg-background text-foreground">
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<LiveReload nonce={nonce} />
			</body>
		</html>
	)
}

const ListItem = React.forwardRef<
	React.ElementRef<typeof Link>,
	React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = "ListItem"

function MobileMenu() {
	const matches = useMatches()
	const isOnSearchPage = matches.find(m => m.id === 'routes/users+/index')
	const searchBar = isOnSearchPage ? null : <SearchBar status="idle" />
	const user = useOptionalUser()
	const navigation = useNavigation()
	const [isOpen, setIsOpen] = React.useState(false)

	useEffect(() => {
		if (navigation.state !== 'idle') {
			setIsOpen(false)
		}
	}, [navigation])

	return (
		<Sheet open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
			<SheetTrigger asChild>
				<Button size="icon"><IconMenu2 /></Button>
			</SheetTrigger>
			<SheetContent side={"left"} className='flex flex-col h-screen'>
				<SheetHeader>
					<SheetTitle>CatArks</SheetTitle>
					{/* <SheetDescription> */}

					{/* </SheetDescription> */}
				</SheetHeader>
				<div className="block w-full sm:hidden">{searchBar}</div>

				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger>CATEGORIES</AccordionTrigger>

						<AccordionContent asChild>
							<ul>
								{ITEM_TYPES.map((itemType) => (
									<ListItem key={itemType} to={`/categories/${itemType}`}>{TYPE_TO_CATEGORY[itemType]}</ListItem>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>TOOLS</AccordionTrigger>

						<AccordionContent asChild>
							<ul>
								<ListItem to={`/tools/calc/trade`}>トレード価格計算機</ListItem>
							</ul>
						</AccordionContent>
					</AccordionItem>

				</Accordion>

				<SheetFooter className='mt-auto w-full'>
					<SheetClose asChild>
						<div className="flex items-center gap-10">
							<div className='w-full'>
								{/* <Alert className='mb-2'>
									<IconBrandDiscord className="h-4 w-4" />
									<AlertTitle>Discordに参加しませんか？</AlertTitle>
									<AlertDescription>
										一緒にNGSを盛り上げましょう！
									</AlertDescription>
									<AlertDescription>
									<a href="https://discord.gg/CcT997U" className='flex justify-end'>
											<Button>参加する</Button>
										</a>
									</AlertDescription>
								</Alert> */}

								{user ? (
									<UserDropdown />
								) : (
									<Button asChild variant="default" size="sm" className='w-full'>
										<Link to="/login">Log In</Link>
									</Button>
								)}
							</div>
						</div>

					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()
	const user = useOptionalUser()
	const theme = useTheme()
	const matches = useMatches()
	const isOnSearchPage = matches.find(m => m.id === 'routes/users+/index')
	const searchBar = isOnSearchPage ? null : <SearchBar status="idle" />


	return (
		<Document nonce={nonce} theme={theme} env={data.ENV}>
			<div className="flex h-screen flex-col justify-between">
				<header className="flex justify-between p-4 h-16 border-b">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
									<a href="https://discord.gg/CcT997U">
										<div className="font-bold">CatArks</div>
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem className='sm:block hidden'>
								<NavigationMenuTrigger>CATEGORIES</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
										<li className="row-span-4">
											<NavigationMenuLink asChild>
												<Link
													className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
													to="/"
												>
													<>
														<div className="mb-2 mt-4 text-lg font-medium">
															Discord
														</div>
														<p className="text-sm leading-tight text-muted-foreground">
															公式Discordサーバーに参加して皆でNGSを盛り上げませんか?
														</p>
													</>
												</Link>
											</NavigationMenuLink>
										</li>
										<ListItem to="/categories/ability" title="特殊能力" />
										<ListItem to="/categories/weapon" title="武器" />
										<ListItem to="/categories/armor" title="防具" />
										<ListItem to="/categories/material" title="素材" />
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem className='sm:block hidden'>
								<NavigationMenuTrigger>TOOLS</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
										<ListItem to="/tools/calc/trade" title="トレード価格計算機" />
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<NavigationMenu className='sm:block hidden'>
						<NavigationMenuList className="justify-between">
							<NavigationMenuItem >
								<div className="ml-auto hidden max-w-sm flex-1 sm:block">
									{searchBar}
								</div>
							</NavigationMenuItem>
							<NavigationMenuItem>

								<div className="flex items-center gap-10">
									{user ? (
										<UserDropdown />
									) : (
										<Button asChild variant="default" size="sm">
											<Link to="/login">Log In</Link>
										</Button>
									)}
								</div>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<div className="block w-full sm:hidden">{searchBar}</div>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<NavigationMenu className='block sm:hidden'>
						<NavigationMenuList>
							<NavigationMenuItem><MobileMenu /></NavigationMenuItem>
						</NavigationMenuList>

					</NavigationMenu>

				</header>

				<div className="flex-1">
					<Outlet />
					<ReportPriceDial />
				</div>

				<div className="container flex justify-between pb-5">
					<Link to="/">
						<div className="font-bold">CatArks</div>
					</Link>
					<ThemeSwitch userPreference={data.requestInfo.userPrefs.theme} />
				</div>
			</div>
			<Confetti id={data.confettiId} />
			<EpicToaster toast={data.toast} />
			<EpicProgress />
		</Document>
	)
}

function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<HoneypotProvider {...data.honeyProps}>
				<App />
			</HoneypotProvider>
		</AuthenticityTokenProvider>
	)
}

let AppExport = AppWithProviders;

if (process.env.NODE_ENV === 'development') {
	const { withDevTools } = await import("remix-development-tools");
	AppExport = withDevTools(AppExport);
}


export default withSentry(AppExport)

function UserDropdown() {
	const user = useUser()
	const submit = useSubmit()
	const formRef = useRef<HTMLFormElement>(null)
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button asChild variant="secondary" className='w-full'>
					<Link
						to={`/users/${user.username}`}
						// this is for progressive enhancement
						onClick={e => e.preventDefault()}
						className="flex items-center gap-2"
					>
						<img
							className="h-8 w-8 rounded-full object-cover"
							alt={user.name ?? user.username}
							src={getUserImgSrc(user.image?.id)}
						/>
						<span className="text-body-sm font-bold">
							{user.name ?? user.username}
						</span>
					</Link>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent sideOffset={8} align="start">
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/${user.username}`}>
							<Icon className="text-body-md" name="avatar">
								Profile
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/${user.username}/reports`}>
							<Icon className="text-body-md" name="pencil-2">
								Reports
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/${user.username}/notes`}>
							<Icon className="text-body-md" name="pencil-2">
								Notes
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						// this prevents the menu from closing before the form submission is completed
						onSelect={event => {
							event.preventDefault()
							submit(formRef.current)
						}}
					>
						<Form action="/logout" method="POST" ref={formRef}>
							<Icon className="text-body-md" name="exit">
								<button type="submit">Logout</button>
							</Icon>
						</Form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	)
}

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
	const hints = useHints()
	const requestInfo = useRequestInfo()
	const optimisticMode = useOptimisticThemeMode()
	if (optimisticMode) {
		return optimisticMode === 'system' ? hints.theme : optimisticMode
	}
	return requestInfo.userPrefs.theme ?? hints.theme
}

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
	const fetchers = useFetchers()
	const themeFetcher = fetchers.find(f => f.formAction === '/')

	if (themeFetcher && themeFetcher.formData) {
		const submission = parse(themeFetcher.formData, {
			schema: ThemeFormSchema,
		})
		return submission.value?.theme
	}
}

function ThemeSwitch({ userPreference }: { userPreference?: Theme | null }) {
	const fetcher = useFetcher<typeof action>()

	const [form] = useForm({
		id: 'theme-switch',
		lastSubmission: fetcher.data?.submission,
	})

	const optimisticMode = useOptimisticThemeMode()
	const mode = optimisticMode ?? userPreference ?? 'system'
	const nextMode =
		mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
	const modeLabel = {
		light: (
			<Icon name="sun">
				<span className="sr-only">Light</span>
			</Icon>
		),
		dark: (
			<Icon name="moon">
				<span className="sr-only">Dark</span>
			</Icon>
		),
		system: (
			<Icon name="laptop">
				<span className="sr-only">System</span>
			</Icon>
		),
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<input type="hidden" name="theme" value={nextMode} />
			<div className="flex gap-2">
				<button
					type="submit"
					className="flex h-8 w-8 cursor-pointer items-center justify-center"
				>
					{modeLabel[mode]}
				</button>
			</div>
			<ErrorList errors={form.errors} id={form.errorId} />
		</fetcher.Form>
	)
}

export function ErrorBoundary() {
	// the nonce doesn't rely on the loader so we can access that
	const nonce = useNonce()

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the user a better UX.

	return (
		<Document nonce={nonce}>
			<GeneralErrorBoundary />
		</Document>
	)
}
