import type { ErrorBoundaryComponent, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserFromId } from "~/middlewares/users";
import { UserCard } from "~/components/user/userCard";

export async function loader({ params }: LoaderArgs) {
  const userId = params.userId;
  if (!userId) throw new Error("");
  const user = await getUserFromId(userId);
  if (!user) throw new Error("User Not Found");

  return json(user);
}

export default function UserCardImage() {
  const user = useLoaderData<typeof loader>();
  const radius = 14;
  return (
    <div className="container p-10" style={{ borderRadius: radius }}>
      <UserCard user={user!} />

      <p className="text-center"></p>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <>{error.message}</>;
};
