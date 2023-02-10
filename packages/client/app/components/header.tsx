import { ActionIcon, Tooltip } from "@mantine/core";
import { Form, Link, useLocation } from "@remix-run/react";
import { IconPencil } from "@tabler/icons";
import { useSnapshot } from "valtio";
import { useModalState, useSessionState } from "~/states/common";
import { Button, Navbar, Dropdown, Avatar } from "flowbite-react";

export const DefaultHeader = () => {
  const user = useSnapshot(useSessionState).user;
  const location = useLocation()
  return (
    <>
      <Navbar
        fluid={false}
        rounded={true}
        className="sticky w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600"
      >
        <Navbar.Brand>
          <Link to="/">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Cat Arks
            </span>
          </Link>
        </Navbar.Brand>
        <div className="flex md:order-2">
          {user ? (
            <div className="flex items-center">
              <Tooltip label="価格を報告する">
                <ActionIcon
                  variant="default"
                  onClick={() => {
                    useModalState.isOpenedPriceRepost = true;
                  }}
                >
                  <IconPencil size={16} />
                </ActionIcon>
              </Tooltip>
              <div className="pl-2" />
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={
                  <Avatar
                    alt="User settings"
                    img={user.avatarUrl}
                    rounded={true}
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{user.username}</span>
                </Dropdown.Header>
                <Dropdown.Item>
                  <Link to={`/users/${user.id}`}>プロフィール</Link>
                </Dropdown.Item>
                <Dropdown.Item>設定</Dropdown.Item>
                <Dropdown.Divider />
                <Form action="/auth/auth0/logout" method="post">
                  <Dropdown.Item className="text-red-400">
                    <button type="submit">ログアウト</button>
                  </Dropdown.Item>
                </Form>
              </Dropdown>
              <Navbar.Toggle />
            </div>
          ) : (
            <Form action="/auth/auth0" method="post">
              <Button size="xs" type="submit">
                ログイン
              </Button>
            </Form>
          )}
        </div>

        <Navbar.Collapse>
          <Navbar.Link active={location.pathname === '/'}>
            <Link to="/">TOP</Link>
          </Navbar.Link>
          <Navbar.Link active={location.pathname.match('/categories') ? true : false}>
            <Link to="/categories">CATEGORIES</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
