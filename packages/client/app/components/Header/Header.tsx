
import { Form, Link } from "@remix-run/react";
import { getCDNUrl, useOptionalUser } from "~/utils/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from "react";
import { cn } from "~/lib/utils";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

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


export function Header() {
  const session = useOptionalUser();
  return (
    <div className="border-b">
      <div className="flex justify-between px-4 h-16">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link to="/">
                  CatArks
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
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
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="justify-between">
              {session?.user ?
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage
                        src={getCDNUrl(session?.user.avatarUrl!, {
                          format: "webp",
                          size: "40x40",
                        })}
                        alt="Avatar"
                      />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{session.user.username}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/users/${session?.user.id}`}>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my/drive">
                        Drive
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                      <Form action="/auth/auth0/logout" method="post">
                    <DropdownMenuItem asChild>

                        <button type="submit">Log out</button>
                    </DropdownMenuItem>
                      </Form>
                  </DropdownMenuContent>
                </DropdownMenu> : <Form action="/auth/auth0" method="post">
                  <Button type="submit">
                    ログイン
                  </Button>
                </Form>}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

      </div>
      {/* {process.env.NODE_ENV === "development" && (
        <div className="alert bg-error text-neutral rounded-none">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              開発者モードを使用しています。これを本番環境で使用しないでください
            </span>
          </div>
        </div>
      )}
      <div className="sticky w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 navbar bg-base-100">
        <div className="navbar-start">
          <label
            htmlFor="drawer"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
          >
            <IconMenu2 />
          </label>
        </div>
        <div className="flex md:order-2 navbar-end">
          {session?.user ? (
            <div className="flex items-center">
              <div className="pl-2" />
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={getCDNUrl(session?.user.avatarUrl!, {
                        format: "webp",
                        size: "40x40",
                      })}
                      alt="Avatar"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link
                      to={`/users/${session?.user.id}`}
                      className="justify-between"
                    >
                      プロフィール
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="justify-between">
                      設定
                    </Link>
                  </li>
                  <li>
                    <Link to="/my/drive" className="justify-between">
                      ドライブ<span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Form action="/auth/auth0/logout" method="post">
                      <button type="submit">ログアウト</button>
                    </Form>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Form action="/auth/auth0" method="post">
              <button className="btn" type="submit">
                ログイン
              </button>
            </Form>
          )}
        </div>
      </div> */}
    </div>
  );
}
