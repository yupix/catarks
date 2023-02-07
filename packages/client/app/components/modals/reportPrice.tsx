import { Select, Space } from "@mantine/core";
import { Label, TextInput, Checkbox, Button } from "flowbite-react";
import { Modal } from "flowbite-react";
import { useEffect, useReducer, useState } from "react";
import { useSnapshot } from "valtio";
import { useModalState, useSessionState } from "~/states/common";
import { SelectItem } from "../common/selectItem";
import { useFetcher } from "@remix-run/react";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck } from "@tabler/icons";
import type { TgetItemsLoader } from "~/routes/api/items";
import { assertIsDefined } from "~/utils/utils";
import type { TCreateItemPriceAction } from "~/routes/api/items/price";

type TState = {
  price: number;
  ship: number;
  itemId: string;
};

type TAction = {
  type: "INPUT";
  field: string;
  payload: any;
};

function reducer(state: TState, action: TAction) {
  switch (action.type) {
    case "INPUT": {
      return {
        ...state,
        [action.field]: action.payload,
      };
    }
    default:
      return state;
  }
}

export const ReportPriceModal = () => {
  let [items, setItems] = useState<
    { value: string; label: string; image: string }[]
  >([]);
  const user = useSnapshot(useSessionState).user;
  const initialState = {
    price: 1000,
    ship: user?.ship || 8,
    itemId: "",
  };
  useEffect(() => {
    fetcher.submit(null, { action: "/api/items?index", method: "get" });
  }, []);
  const [state, dispatch] = useReducer(reducer, initialState);
  const isOpen = useSnapshot(useModalState).isOpenedPriceRepost;
  const fetcher = useFetcher<TgetItemsLoader | TCreateItemPriceAction>();

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.intent === "getItems") {
        assertIsDefined(fetcher.data.body);
        setItems(
          fetcher.data.body.items.map((item) => {
            return { value: item.id, label: item.name, image: item.iconUrl };
          })
        );
        return;
      }
      if (fetcher.data.intent === "createPrice") {
        if (fetcher.data.status === "failed") {
          if (fetcher.data.message === "BELOW_THE_MINIMUM_PRICE") {
            showNotification({
              color: "red",
              icon: <IconAlertTriangle />,
              title: "送信に失敗",
              message: "価格が1000を下回っています",
            });
          }
        }
        if (fetcher.data.status === "success") {
          showNotification({
            color: "green",
            icon: <IconCheck />,
            title: "送信に成功",
            message: "ご協力感謝します!",
          });
        }
      }
    }
  }, [fetcher.data]);

  return (
    <Modal
      show={isOpen}
      onClose={() => (useModalState.isOpenedPriceRepost = false)}
    >
          <Modal.Header>
      <p>価格の報告</p>
    </Modal.Header>
      <Modal.Body>
        <fetcher.Form action="/api/items/price" method="post">
          <Select
          classNames={{input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}}
            label="アイテムを選択してください"
            name="itemId"
            placeholder="アイテムを選択"
            itemComponent={SelectItem}
            onChange={(itemId) => {
              dispatch({
                type: "INPUT",
                field: "selectItemId",
                payload: itemId,
              });
            }}
            data={items}
            searchable
            maxDropdownHeight={400}
            nothingFound="Nobody here"
            filter={(value, item) =>
              item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
              false
            }
          ></Select>
          <div>
            <Label htmlFor="price" value="値段" />
            <TextInput
              id="price"
              required
              name="price"
              step={1000}
              defaultValue={1000}
              min={1000}
              max={99999999999}
            />
          </div>
          <div>
            <Label htmlFor="qty" value="個数" />
            <TextInput
              id="qty"
              name="qty"
              step={1}
              defaultValue={1}
              min={1}
              max={999}
            />
          </div>
          <div>
            <Label htmlFor="ship" value="シップ番号" />
            <TextInput
              id="ship"
              name="ship"
              step={1}
              defaultValue={user?.ship || 8}
              min={1}
              max={10}
            />
          </div>
          <div>
            <Label htmlFor="tax" value="税込み" />
            <Checkbox id="tax" name="useTax" />
          </div>
          <Button type="submit">送信</Button>
        </fetcher.Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
