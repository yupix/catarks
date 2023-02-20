import { useFetcher } from "@remix-run/react";
import { useSnapshot } from "valtio";
import { useSessionState } from "~/states/common";
import { Avatar, Button } from "flowbite-react";
import type { TUpdateUserAction } from "../api/users/$userId";

export default function Settings() {
  const user = useSnapshot(useSessionState).user;
  const fetcher = useFetcher<TUpdateUserAction>();

  return (
    <div>
      <Avatar img={user?.avatarUrl} size="lg" />
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

          <Button type="submit" />
        </div>
      </fetcher.Form>
    </div>
  );
}
