import {
  Image,
  Avatar,
  Text,
  Group,
  Center,
} from "@mantine/core";
import { Card } from "flowbite-react";


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
  return (
    <Card className="h-full">
      <div className="flex">
        <Center>
          <Image
            src={image}
            height="75"
            width={75}
            radius="md"
            style={{ marginLeft: "16px" }}
            withPlaceholder
            alt={title}
          ></Image>
        </Center>
        {/* <img src={image} height={75} width={75} style={{ borderRadius: '6%', marginLeft: "16px" }} /> */}
        <div className="flex flex-col">
          <p className="text-gray-400 font-bold text-xs">{category}</p>
          <p className="font-bold mt-2">{title}</p>
          {author && (
            <Group noWrap spacing="xs">
              <Group spacing="xs" noWrap>
                <Avatar size={20} src={author?.avatar} />
                <Text size="xs">{author?.name}</Text>
              </Group>
              <Text size="xs" color="dimmed">
                {date}
              </Text>
            </Group>
          )}
        </div>
      </div>
    </Card>
  );
}
