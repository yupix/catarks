import { useFetcher } from "@remix-run/react";
import { Card } from "~/components/common/Card";
import type { TUpdateUserSettingsAction } from "../api/users/$userId/settings";
import { useSnapshot } from "valtio";
import { useSessionState } from "~/states/common";
import { THEMES } from "~/const";

export default function SettingsCommonPage() {
  const { user } = useSnapshot(useSessionState);
  const fetcher = useFetcher<TUpdateUserSettingsAction>();
  return (
    <Card>
      <fetcher.Form action={`/api/users/${user!.id}/settings`} method="put">
        <select name="useTheme" className="select w-full max-w-xs">
          <option disabled selected>
            テーマを選択
          </option>
          {THEMES.map((theme) => (
            <option key={theme}>{theme}</option>
          ))}
        </select>
        <button className="btn" type="submit">
          保存
        </button>
      </fetcher.Form>
    </Card>
  );
}
