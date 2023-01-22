import { Divider, Navbar, Space, createStyles } from "@mantine/core"
import type { FC } from "react";
import { UserButton } from "./userButton"
import { useSnapshot } from "valtio"
import { useMenuState } from "~/states/menu"
import type { TablerIcon } from "@tabler/icons";
import { IconBellRinging, IconHome, IconReceipt2, IconSettings } from "@tabler/icons"
import { useSessionState } from "~/states/common";
import { Link, useLocation } from "@remix-run/react";

const DefaultLinks = [
  { link: '/', label: 'トップ', icon: IconHome },
  { link: '/categories', label: 'カテゴリ', icon: IconReceipt2, divider: true },
  { link: '/notifications', label: '通知', icon: IconBellRinging, divider: true, requiredAuth: true },
  { link: '/settings', label: '設定', icon: IconSettings, requiredAuth: true },
];


const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');

  return {
    navbar: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      paddingBottom: 0,
    },

    header: {
      padding: theme.spacing.md,
      paddingTop: 0,
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
      },
    },
    linksInner: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
    },

    footer: {
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
    },
  }
});

const DefaultNavBar: FC<{ currentActive: string, items?: { link: string, label: string, icon: TablerIcon, divider?: boolean, requiredAuth?: boolean }[] }> = ({ currentActive, items }) => {
  const location = useLocation()
  const { classes, cx } = useStyles();
  const opened = useSnapshot(useMenuState).opened
  const { user: currentUser } = useSnapshot(useSessionState);

  const getAuth = (value: boolean | undefined) => {
    if (value) {
      if (currentUser) return true
      return false
    }
    return true
  }

  const links = items?.map((item) => (
    <div key={item.label}>
      {getAuth(item.requiredAuth) &&<>
        <Link
          className={cx(classes.link, { [classes.linkActive]: item.link === location.pathname })}
          to={item.link}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span style={{ textTransform: 'uppercase' }}>{item.label}</span>
        </Link>
        {item.divider && <><Space h="lg" /><Divider /><Space h="lg" /></>}</>
      }
    </div>
  ));


  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>

      <Navbar.Section grow>

        {links}
      </Navbar.Section>
      <Navbar.Section className={classes.footer}>
        {currentUser ?
          <UserButton
            image={currentUser.avatarUrl}
            name={currentUser.username}
          /> : <></>
        }
      </Navbar.Section>
    </Navbar>)
}

DefaultNavBar.defaultProps = {
  items: DefaultLinks
}
export { DefaultNavBar }