import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
} from '@mantine/core';
import { useForm } from "@mantine/form"
import { ActionArgs, LoaderArgs, json } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { authenticator } from '~/auth.server';
import { AUTHORS } from '~/const';
import { api, assertIsDefined } from '~/utils/utils';
import { ClientAPI } from '~/utils/utils.client';

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
  const form = await request.formData()
  const intent = form.get('intent')?.toString()
  const username = form.get('username')?.toString()
  const password = form.get('password')?.toString()

  assertIsDefined(username)
  switch (intent) {
    case 'checkUsername':
      const res = await api.call('GET', '/api/users/:username/:username', { params: { username } })
      if (res.type === 'failed') throw new Error(JSON.parse(res.data.data))
      return json({ status: 'success', intent: 'checkUsername', message: 'alreadyUsed' } as ActionResponse)

    default:
      break;
  }
  assertIsDefined(password)
  const res = await api.call('POST', '/api/auth/signup', { body: { password, username } })
  if (res.type === 'failed') throw new Error(JSON.stringify(res.data))
  return { 'status': 'success', 'intent': 'signup' } as ActionResponse
}


export default function Authentication() {
  const { classes } = useStyles();
  const fethcer = useFetcher()
  const form = useForm(
    {
      initialValues: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      validate: {
        confirmPassword: (value, values) => (value !== values.password ? 'パスワードが一致しません' : null),
      }
    }
  )

  useEffect(() => {
    if (fethcer.data?.status) {

      fethcer.submit(form.values, { method: 'post', action: '/signin' })
    }
  }, [fethcer.data, form.values])

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Welcome back to CatArks!
        </Title>
        <Form method="post" onSubmit={form.onSubmit((value) => {
          fethcer.submit(value, { method: 'post' })
        })}>

          <TextInput
            label="ユーザー名"
            name="username"
            placeholder={AUTHORS[Math.floor(Math.random() * AUTHORS.length)]}
            required
            type="text"
            size="md"
            {...form.getInputProps('username')}
          />
          <PasswordInput label="パスワード" name="password" autoComplete='new-password' type="password" placeholder="Your password" required mt="md" size="md" {...form.getInputProps('password')} />
          <PasswordInput label="パスワードの確認" name="retype_password" autoComplete='new-password' type="password" placeholder="Your password" required mt="md" size="md" {...form.getInputProps('confirmPassword')} />
          <Button fullWidth mt="xl" size="md" type="submit">
            SignUp
          </Button>
        </Form>
      </Paper>
    </div>


  );
}