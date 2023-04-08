import { Card } from "~/components/common/Card";
import type { TUpdateUserSettingsAction } from "../api/users/$userId/settings";
import { useSessionState } from "~/states/common";
import { useAtom } from "jotai";
import { useTypedFetcher } from "remix-typedjson";
import { useState } from "react";

export default function SettingsCommonPage() {
  const [session] = useAtom(useSessionState);
  const fetcher = useTypedFetcher<TUpdateUserSettingsAction>();
  const [shortcuts, setShortcuts] = useState<{name: string, value: string}[]>([])

  function add() {

  }

  return (
    <Card>
      <fetcher.Form
        action={`/api/users/${session?.user.id}/settings`}
        method="put"
      >
        <div className="flex justify-end">
        <button className="btn">
          追加
        </button>
        </div>
          <ul>
            {shortcuts.map((shortcut) => {
              return (
                <div key={shortcut.name}>
                  <li>{shortcut.name}</li>
                  <li>{shortcut.name}</li>
                </div>
              );
            })}
          </ul>
        <button className="btn" type="submit">
          保存
        </button>
      </fetcher.Form>
    </Card>
  );
}
