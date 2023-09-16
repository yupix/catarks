import { useSessionState } from "~/states/common";
import type { TUpdateUserAction } from "./api.users.$userId.index";
import { TextInput } from "~/components/common/textInput";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { ErrorBoundaryComponent } from "@remix-run/node";
import { useMount } from "@reactuses/core";
import { Card } from "~/components/Card/Card";
import { useAtom } from "jotai";
import { useTypedFetcher } from "remix-typedjson";
import { useOptionalUser, useUser } from "~/utils/utils";

const SettingBody = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const session = useOptionalUser()
  const fetcher = useTypedFetcher<TUpdateUserAction>();

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
    <>
    {session && <Card classes={{root: "@container"}}>
      <div className="block @sm:flex justify-between flex-row-reverse">
      <img src={session?.user?.avatarUrl} className="avatar rounded-full h-32" />
      <div className="divider lg:divider-horizontal" />

      <fetcher.Form
        method="put"
        action={`/api/users/${session?.user.id}`}
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
          <TextInput label="ニックネーム" name="nickname" defaultValue={session!.user!.nickname} />

          <button type="submit" className="btn btn-primary btn-square">
            保存
          </button>
        </div>
      </fetcher.Form>

      </div>
    </Card>}
    </>
  );
}

export default function Settings() {
  return <SettingBody />
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  useMount(() => {
    let ErrorMessage = ''
    if (error.message === 'Not allowed Content-Type') ErrorMessage = '指定できない種類のファイルです'
    toast.error('エラーが発生しました: ' + ErrorMessage)
  })
  return <SettingBody />
};