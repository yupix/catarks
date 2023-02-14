import { Select } from "@mantine/core";
import { Label, TextInput, Checkbox, Button } from "flowbite-react";
import { Modal } from "flowbite-react";
import { useEffect, useReducer, useState } from "react";
import { useSnapshot } from "valtio";
import { useModalState, useSessionState } from "~/states/common";
import { SelectItem } from "../common/selectItem";
import { Link, useFetcher } from "@remix-run/react";
import type { TgetItemsLoader } from "~/routes/api/items";
import { assertIsDefined } from "~/utils/utils";
import type { TCreateItemPriceAction } from "~/routes/api/items/price";
import { toast } from "react-hot-toast";

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
      const data = fetcher.data;
      if (fetcher.data.intent === "getItems") {
        assertIsDefined(fetcher.data.body);
        setItems(
          fetcher.data.body.items.map((item) => {
            return { value: item.id, label: item.name, image: item.iconUrl };
          })
        );
        return;
      }
      if (data.intent === "createPrice") {
        if (data.status === "failed") {
          if (data.message === "BELOW_THE_MINIMUM_PRICE") {
            toast.error("価格が最低価格(900)を下回っています", {position: "bottom-right"})
          }
        }
        if (data.status === "success") {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={data?.body?.item.iconUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {data?.body?.item.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      価格の報告に成功しました
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <Link
                  to={`/items/${data?.body?.item.id}`}
                  onClick={() => {
                    toast.dismiss(t.id);
                    useModalState.isOpenedPriceRepost = false;
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  アイテムを見る
                </Link>
              </div>
            </div>
          ), {position: "bottom-right"});
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
            classNames={{
              input:
                "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            }}
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
