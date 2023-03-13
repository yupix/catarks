import type { ErrorBoundaryComponent, LoaderArgs } from "@remix-run/node";

import { getUserFromId } from "~/middlewares/users";
import { UserCard } from "~/components/user/userCard";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export async function loader({ params }: LoaderArgs) {
  const userId = params.userId;
  if (!userId) throw new Error("");
  const user = await getUserFromId(userId);
  if (!user) throw new Error("User Not Found");

  return typedjson(user);
}

export default function UserCardImage() {
  const user = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <UserCard user={user!} classes={{ card: { classes: { body: "p-0" } } }} />

      <p className="text-center"></p>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <>{error.message}</>;
};
