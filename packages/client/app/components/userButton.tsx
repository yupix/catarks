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
import { IconChevronRight } from '@tabler/icons';

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

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>
        </div>
        <Menu position="right-end" withArrow>
          {icon || <IconChevronRight size={14} stroke={1.5} />}
        </Menu>
      </Group>
    </UnstyledButton>
  );
}