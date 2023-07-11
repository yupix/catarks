import type { Files } from "@catarks/db";
import { memo, useEffect } from "react";
import { ALLOWED_IMAGE_TYPES } from "~/const";
import { IconTrash } from "@tabler/icons";
import type { TDriveAction } from "~/routes/api.drive._index";
import { useTypedFetcher } from "remix-typedjson";
import { toast } from "react-hot-toast";
import type { TriggerEvent } from "react-contexify";
import { Menu, Item, useContextMenu } from "react-contexify";

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

  const MENU_ID = `context-file-${file.id}`;

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleContextMenu(event: TriggerEvent) {
    show({
      event,
    });
  }

  function ShowImage() {
    return (
      <img src={file.url} alt={file.filename} className="rounded-md w-28" />
    );
  }
  return (
    <>
      <Menu id={MENU_ID}>
        <Item
          onClick={() =>
            fetcher.submit(
              { fileId: file.id },
              { method: "delete", action: "/api/drive?index" }
            )
          }
        >
          <IconTrash /> 削除
        </Item>
      </Menu>
      <div className="card items-center " onContextMenu={handleContextMenu}>
        {ALLOWED_IMAGE_TYPES.filter((type) => type === file.contentType)
          .length > 0 && <ShowImage />}
        <div className="card-body">
          <h2 className="card-title">{file.filename}</h2>
        </div>
      </div>
    </>
  );
});
