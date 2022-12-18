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

export default function Authentication() {
  const example_users = ["yupix", "ikaros", "Alumis"]
  const { classes } = useStyles();
  return (
    <div>
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
            Welcome back to Vent!
          </Title>

          <TextInput label="ユーザー名" placeholder={example_users[Math.floor(Math.random() * example_users.length)]} type="text" size="md" />
          <PasswordInput label="パスワード" autoComplete='current-password' type="password" placeholder="Your password" mt="md" size="md" />
          <Button fullWidth mt="xl" size="md">
            Login
          </Button>

          <Text align="center" mt="md">
            アカウントを持っていませんか?{' '}
            <Anchor<'a'> href="#" weight={700} onClick={(event) => event.preventDefault()}>
              登録
            </Anchor>
          </Text>
        </Paper>
      </div>


    </div>
  );
}