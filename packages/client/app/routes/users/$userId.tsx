import type { ErrorBoundaryComponent, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Tooltip } from "flowbite-react";

import { getName } from "~/utils/utils";
import { getUserFromId } from "~/middlewares/users";
import { IconStar } from "@tabler/icons";

export async function loader({ params }: LoaderArgs) {
  const userId = params.userId
  if (!userId) throw new Error('')
  const user = await getUserFromId(userId);
  if (!user) throw new Error("User Not Found");
  
  return json(user);
}

export default function UserCardImage() {
  const user = useLoaderData<typeof loader>();
  const radius = 14;
  return (
    <div className="container p-10" style={{ borderRadius: radius }}>
      <div
        className="bg-gray-700"
        style={{
          height: 200,
          boxShadow: "inset 0px 0px 20px 5px rgba(17, 17, 26, 0.18)",
          borderRadius: `${radius}px ${radius}px 0 0`,
          backgroundImage: `url(${user.bannerUrl})`,
          backgroundPosition: "center",
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
                className="font-medium"
                style={{ textShadow: "0px 0px 4px #000" }}
              >
                {getName(user)}
              </h1>
              {user.role.filter((v) => v.name === "admin").length > 0 && (
                <Tooltip content={<p>管理者</p>}>
                  <IconStar style={{ marginTop: "10px" }} color="#FFD43B" />
                </Tooltip>
              )}
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
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  return (
    <>{error.message}</>
  )
}