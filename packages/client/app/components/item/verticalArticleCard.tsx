import { createStyles, Card, Image, Avatar, Text, Group, Center } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
    flexGrow: 1
  },

  body: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing.md,
  },
}));

interface ArticleCardVerticalProps {
  image: string;
  category: string;
  title: string;
  date: string;
  author?: {
    name: string;
    avatar: string;
  };
}

export function ArticleCardVertical({
  image,
  category,
  title,
  date,
  author,
}: ArticleCardVerticalProps) {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p={0} className={classes.card} style={{ height: '100%' }}>
      <Group noWrap spacing={0} style={{ height: '100%' }}>
        <Center>
          <Image src={image} height="75" width={75} radius="md" style={{ marginLeft: '16px' }} withPlaceholder alt={title}></Image>
        </Center>
        {/* <img src={image} height={75} width={75} style={{ borderRadius: '6%', marginLeft: "16px" }} /> */}
        <div className={classes.body}>
          <Text transform="uppercase" color="dimmed" weight={700} size="xs">
            {category}
          </Text>
          <Text className={classes.title} mt="xs" mb="md" >
            {title}
          </Text>
          {author &&
            <Group noWrap spacing="xs">
              <Group spacing="xs" noWrap>
                <Avatar size={20} src={author?.avatar} />
                <Text size="xs">{author?.name}</Text>
              </Group>
              {/* <Text size="xs" color="dimmed">
              •
            </Text> */}
              <Text size="xs" color="dimmed">
                {date}
              </Text>
            </Group>
          }
        </div>
      </Group>
    </Card >
  );
}