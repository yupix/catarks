import { CREATE_URL, config } from '@catarks/shared';
import { createStyles, Container, Title, Text, Button } from '@mantine/core';
import { Footer, FooterDefaultData } from '~/components/Footer';

export function links() {
  return [{ rel: "preconnect", href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap' }]
}


const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: '#11284b',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage:
      'linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, #062343 70%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80)',
    paddingTop: theme.spacing.xl * 3,
    paddingBottom: theme.spacing.xl * 3,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('md')]: {
      flexDirection: 'column',
    },
  },

  image: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  content: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan('md')]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,
    fontFamily: `Kosugi Maru, sans-serif, ${theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: 500,
    fontSize: 48,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: 34,
      lineHeight: 1.15,
    },
  },

  description: {
    color: theme.white,
    opacity: 0.75,
    maxWidth: 500,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
    },
  },

  control: {
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 22,

    [theme.fn.smallerThan('md')]: {
      width: '100%',
    },
  },
}));

export default function Index() {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: 'blue', to: 'green' }}
              >
                簡単
              </Text>
              な相場管理
            </Title>

            <Text className={classes.description} mt={30}>
              CatArksはPhantasy Start Online 2 New Genesisの現役プレイヤーが開発しているマイショップの相場管理サイトです
            </Text>

            <Button
              variant="gradient"
              gradient={{ from: 'blue', to: 'green' }}
              size="xl"
              className={classes.control}
              mt={40}
            >
              始める
            </Button>
          </div>
        </div>
      </Container>
      <Footer data={FooterDefaultData} />
    </div>
  );
}