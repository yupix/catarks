import { Card } from "~/components/Card/Card";
import type { TUpdateUserSettingsAction } from "~/routes/api.users.$userId.settings";
import { useSessionState } from "~/states/common";
import { useAtom } from "jotai";
import { useTypedFetcher } from "remix-typedjson";

export default function SettingsCommonPage() {
  const [session] = useAtom(useSessionState);
  const fetcher = useTypedFetcher<TUpdateUserSettingsAction>();
  return (
    <Card>
      <fetcher.Form
        action={`/api/users/${session?.user.id}/settings`}
        method="put"
      >
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">
              デフォルトで税込みにチェックを入れる
            </span>
            <input
              name="defaultUseTax"
              type="checkbox"
              defaultChecked={session?.user.settings?.defaultUseTax}
              className="toggle toggle-primary"
            />
          </label>
        </div>
        <button className="btn" type="submit">
          保存
        </button>
      </fetcher.Form>
    </Card>
  );
}
