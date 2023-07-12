import { Card } from "~/components/Card/Card";
import type { TUpdateUserSettingsAction } from "../api/users/$userId/settings";
import { useSessionState } from "~/states/common";
import { THEMES } from "~/const";
import { useAtom } from "jotai";
import { useTypedFetcher } from "remix-typedjson";

export default function SettingsCommonPage() {
  const [session] = useAtom(useSessionState);
  const fetcher = useTypedFetcher<TUpdateUserSettingsAction>();
  return (
    <Card>
      <fetcher.Form action={`/api/users/${session?.user.id}/settings`} method="put">
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
