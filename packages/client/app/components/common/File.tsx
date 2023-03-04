import type { Files } from "@catarks/db";
import { memo, useEffect } from "react";
import { ALLOWED_IMAGE_TYPES } from "~/const";
import { IconTrash } from "@tabler/icons";
import type { TDriveAction } from "~/routes/api/drive";
import { useTypedFetcher } from "remix-typedjson";
import { toast } from "react-hot-toast";
import { ContextMenuTrigger } from "../contextMenu";

type FileProps = { file: Files };

export const File = memo(function File({ file }: FileProps) {
  const fetcher = useTypedFetcher<TDriveAction>();

  useEffect(() => {
    if (fetcher?.data?.body && fetcher.data.status === "success") {
      switch (fetcher?.data.intent) {
        case "deleteFile": {
          toast.success("ファイルの削除に成功しました");
        }
      }
    }
  }, [fetcher?.data]);

  function ShowImage() {
    return (
      <img src={file.url} alt={file.filename} className="rounded-md w-28" />
    );
  }
  return (
    <>
      <ContextMenuTrigger
        menu={
          <ul className="menu bg-base-100 w-56 p-2 rounded-box">
            <li
              onClick={() =>
                fetcher.submit(
                  { fileId: file.id },
                  { method: "delete", action: "/api/drive?index" }
                )
              }
            >
              <span>
                <IconTrash /> 削除
              </span>
            </li>
          </ul>
        }
      >
        <div className="card items-center ">
          {ALLOWED_IMAGE_TYPES.filter((type) => type === file.contentType)
            .length > 0 && <ShowImage />}
          <div className="card-body">
            <h2 className="card-title">{file.filename}</h2>
          </div>
        </div>
      </ContextMenuTrigger>
    </>
  );
});
