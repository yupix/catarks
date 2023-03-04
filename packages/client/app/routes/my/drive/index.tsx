import type { LoaderArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { File } from "~/components/common/File";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const files = await prisma.files.findMany({ where: { userId: user.id } });
  return typedjson({ files });
}

export default function DriveIndex() {
  const { files } = useTypedLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-6">
      {files.map((file) => (
        <File file={file} key={file.id} />
      ))}
    </div>
  );
}
