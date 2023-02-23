import { useFetcher } from "@remix-run/react";
import { Card } from "~/components/common/Card";
import type { TUpdateUserSettingsAction } from "../api/users/$userId/settings";
import { useSnapshot } from "valtio";
import { useSessionState } from "~/states/common";

export default function SettingsCommonPage() {
  const {settings, user} = useSnapshot(useSessionState)
  const fetcher = useFetcher<TUpdateUserSettingsAction>();
  return (
    <Card>
      <fetcher.Form action={`/api/users/${user!.id}/settings`} method="put">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">
              デフォルトで税込みにチェックを入れる
            </span>
            <input
              name="defaultUseTax"
              type="checkbox"
              defaultChecked={settings?.defaultUseTax}
              className="toggle toggle-primary"
            />
          </label>
        </div>
        <button className="btn" type="submit">保存</button>
      </fetcher.Form>
    </Card>
  );
}
