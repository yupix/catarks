import { useFetcher } from "@remix-run/react";
import { useSnapshot } from "valtio";
import { useSessionState } from "~/states/common";
import type { TUpdateUserAction } from "../api/users/$userId";
import { TextInput } from "~/components/common/textInput";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useSnapshot(useSessionState).user;
  const fetcher = useFetcher<TUpdateUserAction>();

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setIsSubmitting(true)
    }
    if (fetcher.state === 'idle'  && isSubmitting) {
      setIsSubmitting(false)
      toast.success('保存しました')
    }
  }, [fetcher, isSubmitting])

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
          <TextInput label="ニックネーム" name="nickname" defaultValue={user!.nickname} />

          <button type="submit" className="btn btn-primary btn-square">
            保存
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
