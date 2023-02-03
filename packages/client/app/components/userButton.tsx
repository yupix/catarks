import type {
  UnstyledButtonProps
} from '@mantine/core';
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
  Menu,
} from '@mantine/core';
import { Form, Link } from '@remix-run/react';
import { IconChevronRight, IconLogout, IconUser } from '@tabler/icons';
import { useSnapshot } from 'valtio';
import { useSessionState } from '~/states/common';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  icon?: React.ReactNode;
}

export function UserButton({ image, name, icon, ...others }: UserButtonProps) {
  const { classes } = useStyles();
  const {user} = useSnapshot(useSessionState)
  return (
    <Menu position="right-start">
      <Menu.Target>
        <UnstyledButton className={classes.user} {...others}>
          <Group>
            <Avatar src={image} radius="xl" />

            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {name}
              </Text>
            </div>
            {icon || <IconChevronRight size={14} stroke={1.5} />}
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Link to={`/users/${user?.id}`}><Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item></Link>
        <Form action="/auth/auth0/logout" method="post">
          <Menu.Item color="red" icon={<IconLogout size={14} />} type="submit">Logout</Menu.Item>
        </Form>

      </Menu.Dropdown>

    </Menu>
  );
}