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
      <div className="grid justify-center items-center grid-cols-none sm:grid-cols-2">
        <div className="flex justify-center sm:justify-between">
        <img
          src={image}
          width={75}
          height={75}
          alt={title}
          className="rounded-xl mr-2"
        />
        </div>
        <div className="flex flex-col justify-center sm:justify-between">
          <p className="text-gray-400 font-bold text-xs">{category}</p>
          <p className="font-bold mt-2">{title}</p>
          {author && (
            <div className="flex flex-nowrap">
              <div className="flex flex-nowrap ">
                <img height={20} alt={author.name} src={author?.avatar} />
                <p>{author?.name}</p>
              </div>
              <p color="dimmed">
                {date}
              </p>
            </div>
          )}
        </div>
        </div>
    </Card>
  );
}
