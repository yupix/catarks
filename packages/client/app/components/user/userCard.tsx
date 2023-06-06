import type { FC} from "react";
import type { CardProps } from "~/components/Card/Card";
import { Card } from "~/components/Card/Card";
import type { UserRoles, Users } from "@catarks/db";
import { getName } from "~/utils/utils";

export type UserCardProps = {
  classes?: {
    card?: Pick<CardProps, 'classes'>
  };
  user: Users & {role?: UserRoles}
  // children?: React.ReactNode;
};

export const UserCard: FC<UserCardProps> = ({ classes, user }) => {

  return (
    <Card classes={classes?.card?.classes}>
      <div
        className="bg-gray-700 rounded-md bg-ccenter h-52"
        style={{
          backgroundImage: `url(${user.bannerUrl})`,
        }}
      >
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              paddingLeft: "165px",
              color: "white",
            }}
          >
            <div className="flex items-center">
              <h1
                className="font-medium text-3xl drop-shadow-2xl"
              >
                {getName(user)}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-3 -mt-20">
        <div className="relative">
          <img
            className="border-2 border-solid border-white dark:border-gray-900 rounded-full h-36"
            src={user.avatarUrl}
            alt={`${user.username} Avatar`}
            style={{ boxShadow: "0px 0px 20px 2px rgba(17, 17, 26, 0.18);" }}
          />
          <span
            className="left-4 absolute  w-6 h-6 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"
            style={{ top: "118px" }}
          ></span>
        </div>
      </div>
      <p className="text-center"></p>
    </Card>
  );
};

