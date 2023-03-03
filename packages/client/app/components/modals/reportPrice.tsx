import { Modal } from "flowbite-react";
import { memo, useEffect, useMemo, useState } from "react";
import { useModalState, useSessionState } from "~/states/common";
import { Link, useFetcher, useLocation } from "@remix-run/react";
import type { TgetItemsLoader } from "~/routes/api/items";
import { assertIsDefined, isUUID } from "~/utils/utils";
import type { TCreateItemPriceAction } from "~/routes/api/items/price";
import { toast } from "react-hot-toast";
import type { AutocompleteInputOption } from "../autocomplete";
import AutocompleteInput from "../autocomplete";
import type { TGetItemByIdLoader } from "~/routes/api/items/$itemId";
import type { Items } from "@catarks/db";
import { useMount } from "@reactuses/core";
import { useForm } from "react-hook-form";
import { NumberInput } from "../common/numberInput";
import { useAtom } from "jotai";

export const ReportPriceModal = memo(function ReportPriceModal() {
  let [items, setItems] = useState<{ value: string; label: string }[]>([]);
  const [session] = useAtom(useSessionState);
  const location = useLocation();
  const [option, setOption] = useState<AutocompleteInputOption | undefined>(
    undefined
  );
  useEffect(() => {
    const itemId = location.pathname.split("/").pop();
    if (isUUID(itemId) && items) {
      const hitItems = items.filter((v) => v.value === itemId);
      if (hitItems.length > 0) {
        setOption(hitItems[0]);
        fetcher.submit(null, {
          action: `/api/items/${hitItems[0].value}`,
          method: "get",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, items]);

  useMount(() => {
    fetcher.submit(null, { action: "/api/items?index", method: "get" });
  });
  const [modalState, setModalState] = useAtom(useModalState);
  const fetcher = useFetcher<
    TgetItemsLoader | TCreateItemPriceAction | TGetItemByIdLoader
  >();
  const [selectedItem, setSelectedItem] = useState<undefined | Items>(
    undefined
  );

  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data;
      if (fetcher.data.intent === "getItems") {
        assertIsDefined(fetcher.data.body);
        setItems(
          fetcher.data.body.items.map((item) => {
            return { value: item.id, label: item.name };
          })
        );
        return;
      }
      if (data.intent === "getItemById" && data.status === "success") {
        setSelectedItem(data.body);
      }
      if (data.intent === "createPrice") {
        if (data.status === "failed") {
          if (data.message === "BELOW_THE_MINIMUM_PRICE") {
            toast.error("価格が最低価格(900)を下回っています", {
              position: "bottom-right",
            });
          }
          if (data.message === "INVALID_PRICE") {
            toast.error("不正な価格です", {
              position: "bottom-right",
            });
          }
        }
        if (data.status === "success") {
          toast.custom(
            (t) => (
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
                      setModalState({ isOpenedPriceRepost: false });
                    }}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    アイテムを見る
                  </Link>
                </div>
              </div>
            ),
            { position: "bottom-right" }
          );
        }
      }
    }
  }, [fetcher.data]);
  const handleSelectChange = (itemId: string) => {
    fetcher.submit(null, { action: `/api/items/${itemId}`, method: "get" });
  };
  type FormData = {
    itemId: string;
    price: number;
    qty: number;
    ship: number;
    useTax: string;
  };
  const { register, watch } = useForm<FormData>({
    criteriaMode: "all",
    defaultValues: {
      itemId: "",
      price: 1000,
      qty: 1,
      ship: 8,
      useTax: "",
    },
  });

  const price = watch("price");
  const qty = watch("qty");
  const useTax = watch("useTax");
  const proceeds = useMemo(() => {
    const _price = price / qty;
    return (useTax ? _price * (1 - 0.1) : _price / (1 - 0.1)).toLocaleString();
  }, [price, qty, useTax]);

  const itemIcon = selectedItem
    ? { backgroundImage: `url(${selectedItem.iconUrl})` }
    : {};
  return (
    <Modal
      dismissible={true}
      show={modalState.isOpenedPriceRepost}
      onClose={() => setModalState({ isOpenedPriceRepost: true })}
    >
      <Modal.Header>
        <p>価格の報告</p>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        <div className="block sm:flex bg-base-100">
          <div className="flex-0 bg-base-200 flex justify-center items-center p-5 rounded-r-lg">
            <div
              className="rounded-full h-24 w-24 bg-cover bg-center bg-white border-solid border-gray-600 border-4 shadow-lg"
              style={itemIcon}
            />
          </div>
          <div className="flex-1 p-6">
            <fetcher.Form
              action="/api/items/price"
              method="post"
              className="form-control w-full max-w-xs"
            >
              <AutocompleteInput
                defaultValue={option}
                name="itemId"
                options={items}
                label="アイテム名"
                onSelected={(option) => handleSelectChange(option.value)}
              />
              <div>
                <NumberInput
                  id="price"
                  label="値段"
                  required
                  step={100}
                  min={900}
                  max={99999999999}
                  {...register("price")}
                />
              </div>
              <div>
                <NumberInput
                  label="個数"
                  id="qty"
                  step={1}
                  defaultValue={1}
                  min={1}
                  max={999}
                  {...register("qty")}
                />
              </div>
              <div>
                <NumberInput
                  label="シップ番号"
                  id="ship"
                  step={1}
                  defaultValue={session?.user?.ship || 8}
                  min={1}
                  max={10}
                  {...register("ship")}
                />
              </div>
              <div>
                <label htmlFor="useTax" className="label">
                  <span className="label-text">税込み</span>
                </label>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">税込み</span>
                    <input
                      id="useTax"
                      type="checkbox"
                      className="checkbox"
                      {...register("useTax")}
                    />
                  </label>
                </div>
              </div>
              <div>
                {useTax ? (
                  <>
                    <p>純売上: {(price * (1 - 0.1)).toLocaleString()}</p>
                    <p>売値: {price.toLocaleString()}</p>
                  </>
                ) : (
                  <>
                    <p>純売上: {(price * (1 - 0.1)).toLocaleString()}</p>
                    <p>売値: {Number(price).toLocaleString()}</p>
                  </>
                )}
                <p>一つあたりの価格: {proceeds}</p>
              </div>
              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  送信
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
});
