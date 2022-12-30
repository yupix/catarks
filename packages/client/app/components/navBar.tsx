import { Navbar, createStyles } from "@mantine/core"
import type { FC } from "react";
import { useState } from "react"
import { UserButton } from "./userButton"
import { useSnapshot } from "valtio"
import { useMenuState } from "~/states/menu"
import { IconBellRinging, IconReceipt2 } from "@tabler/icons"
import { useSessionState } from "~/states/common";
import { Link } from "@remix-run/react";

const data = [
  { link: '', label: 'notification', icon: IconBellRinging },
  { link: '/categories', label: 'categories', icon: IconReceipt2 },
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

export const DefaultNavBar: FC<{ currentActive: string }> = ({ currentActive }) => {
  const { classes, cx } = useStyles();
  const opened = useSnapshot(useMenuState).opened
  const [active, setActive] = useState(currentActive);
  const { user: currentUser } = useSnapshot(useSessionState);

  const links = data.map((item) => (
    <Link
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span style={{ textTransform: 'uppercase' }}>{item.label}</span>
    </Link>
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