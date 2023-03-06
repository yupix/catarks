import type { LoaderArgs } from "@remix-run/node";
import { Modal } from "flowbite-react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ClientOnly } from "remix-utils";
import { TextInput } from "~/components/common/textInput";
import { prisma } from "~/utils/prisma.server";

export async function loader({ request }: LoaderArgs) {
  const teams = await prisma.teams.findMany();
  return typedjson({ teams });
}

export default function TeamsIndex() {
  const { teams } = useTypedLoaderData<typeof loader>();
  const [isOpenCreateTeam, setIsOpenCreateTeam] = useState<boolean>(false);

  function CreateTeamModal() {
    return (
      <Modal
        dismissible={true}
        show={isOpenCreateTeam}
        onClose={() => setIsOpenCreateTeam(false)}
      >
        <Modal.Header>
          <p>チームの新規作成</p>
        </Modal.Header>
        <Modal.Body>
          <TextInput id="teamName" name="teamName" label="チーム名" />
          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary">
              送信
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <div>
      <ClientOnly>{() => <CreateTeamModal />}</ClientOnly>
      <div className="flex justify-end">
        <button className="btn" onClick={() => setIsOpenCreateTeam(true)}>
          チームを作成
        </button>
      </div>
      <div>
        <h1>チーム一覧</h1>
      </div>
      {teams.map((team) => {
        return <>{team.name}</>;
      })}
    </div>
  );
}
