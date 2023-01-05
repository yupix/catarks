import {
  createStyles,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container, Flex,
} from '@mantine/core';
import { Link } from '@remix-run/react';

const mockdata = [
  {
    title: '特殊能力',
    value: 'ability',

    icon: "https://s3.akarinext.org/assets/*/pso2/op/op_2.webp",
  },
  {
    title: '武器',
    value: 'weapon',

    icon: "https://s3.akarinext.org/assets/*/pso2/op/op_2.webp",
  },
  {
    title: '防具',
    value: 'armmor',
    icon: "https://s3.akarinext.org/assets/*/pso2/op/op_2.webp",
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 24,
    },
  },

  description: {
    maxWidth: 600,


  },

  card: {
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
      }`,
  },

  cardTitle: {
    '&::after': {
      content: '""',
      display: 'block',
      width: 45,
    },
  },
}));

export default function FeaturesCards() {
  const { classes, theme } = useStyles();
  const features = mockdata.map((feature) => (
    <Link key={feature.value} to={`/categories/${feature.value}`}>
      <Card shadow="md" radius="md" className={classes.card} p="xl">
        <Flex wrap="wrap" direction="row" align="center">
          <img src={feature.icon} height={50} width={50} alt={feature.title} style={{ borderRadius: "10%", marginRight: "1em" }} />
          <Text size="lg" weight={500} className={classes.cardTitle} >
            {feature.title}
          </Text>
        </Flex>
      </Card>
    </Link>
  ));
  return (
    <Container size="lg">


      <Title order={2} className={classes.title} mt="sm">
        Categories
      </Title>

      <Text color="dimmed" className={classes.description} mt="md">
        同じ種類の金策可能なアイテムを見つけ、直ぐに金策を始めましょう
      </Text>

      <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        {features}
      </SimpleGrid>
    </Container>
  );
}