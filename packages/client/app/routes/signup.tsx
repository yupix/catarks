import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
} from '@mantine/core';
import { useForm } from "@mantine/form"
import { ActionArgs, LoaderArgs, TypedResponse, json } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { authenticator } from '~/auth.server';
import { AUTHORS } from '~/const';
import { api, assertIsDefined } from '~/utils/utils';

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

export async function action({ request }: ActionArgs): Promise<TypedResponse<ActionResponse<ALREADY_USED_USERNAME_ERROR>>> {
  const form = await request.formData()
  const intent = form.get('intent')?.toString()
  const username = form.get('username')?.toString()
  const password = form.get('password')?.toString()

  assertIsDefined(username)
  assertIsDefined(password)
  const res = await api.call('POST', '/api/auth/signup', { body: { password, username } })
  if (res.type === 'failed') return json({
    'status': 'failed', intent: 'signup', body: res.data.data as ALREADY_USED_USERNAME_ERROR
  })
  return json({ 'status': 'success', 'intent': 'signup' })
}


export default function Authentication() {
  const { classes } = useStyles();
  const fetcher = useFetcher<typeof action>()
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
    if (fetcher.type === 'done' && fetcher.data.status) {
      (
        async () => {
          if (fetcher.data.body) {
            if (fetcher.data.body.code === 'ALREADY_USED_USERNAME') {
              form.setFieldError('username', fetcher.data.body.message)
            }
          }
          if (fetcher.data.status === 'success') {
            fetcher.submit(form.values, { method: 'post', action: '/signin' })
          }
        }
      )()

    }
  }, [fetcher, form.values])

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Welcome back to CatArks!
        </Title>
        <Form method="post" onSubmit={form.onSubmit((value) => {
          fetcher.submit(value, { method: 'post' })
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