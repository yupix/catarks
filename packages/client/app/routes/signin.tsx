import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
} from '@mantine/core';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { authenticator } from '~/auth.server';
import { AUTHORS } from '~/const';

const useStyles = createStyles((theme) => ({
  wrapper: {
    maxHeight: "100vh",
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://cdn.discordapp.com/attachments/647712128026935320/1053530819597172786/pso20221217_133454_000.jpg)',
  },

  form: {
    borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
    minHeight: "100vh",
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export async function loader({ request }: LoaderArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export async function action({ request }: ActionArgs) {
  return await authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/signin",
  });
}

export default function Authentication() {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Welcome back to CatArks!
        </Title>
        <Form method="post">
          <TextInput label="ユーザー名" name="username" placeholder={AUTHORS[Math.floor(Math.random() * AUTHORS.length)]} required type="text" size="md" />
          <PasswordInput label="パスワード" name="password" autoComplete='current-password' type="password" placeholder="Your password" required mt="md" size="md" />
          <Button fullWidth mt="xl" size="md" type="submit">
            Login
          </Button>
        </Form>

        <Text align="center" mt="md">
          アカウントを持っていませんか?{' '}
          <Link to="/signup" style={{ fontWeight: 700 }}>
            登録
          </Link>
        </Text>
      </Paper>
    </div>


  );
}