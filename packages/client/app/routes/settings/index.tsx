import { useFetcher } from "@remix-run/react";
import { useSnapshot } from "valtio";
import { useSessionState } from "~/states/common";
import type { TUpdateUserAction } from "../api/users/$userId";

export default function Settings() {
  const user = useSnapshot(useSessionState).user;
  const fetcher = useFetcher<TUpdateUserAction>();

  return (
    <div>
      <img src={user?.avatarUrl} className="avatar rounded-full h-32" />
      {/* <TextInput
          label="自己紹介"
          name="description"
          value={user?.description}
        /> */}
      <fetcher.Form
        method="put"
        action={`/api/users/${user!.id}`}
        encType="multipart/form-data"
      >
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">アバターを編集</span>
          </label>
          <input
            name="avatar"
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />

          <button type="submit" className="btn btn-primary btn-square">保存</button>
        </div>
      </fetcher.Form>
    </div>
  );
}
