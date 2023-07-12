import { LoaderArgs, json } from "@remix-run/node";
import AutocompleteInput, {
  AutocompleteInputOption,
} from "~/components/AutoComplete/AutoComplete";
import ItemTrade from "~/assets/data/item_trade.json";
import { useEffect, useReducer, useState } from "react";
import { Card } from "~/components/Card/Card";
import { NumberInput } from "~/components/common/numberInput";

export async function loader({ request }: LoaderArgs) {
  return json({});
}

// Stateの型定義
type State = {
  [key: number]: number;
};

// Actionの型定義
type Action =
  | {
      type: "UPDATE_PRICE";
      index: string;
      price: number;
      number: number;
    }
  | {
      type: "RESET";
    };

// reducer関数
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "UPDATE_PRICE":
      return {
        ...state,
        [action.index]: { price: action.price, number: action.number },
      };
    case "RESET":
      return {};
    default:
      return state;
  }
}

export default function createItemPricePage() {
  const keys = Object.keys(ItemTrade);
  const [selectedItem, setSelectedItem] = useState<AutocompleteInputOption>();
  const [selectedRecipe, setSelectedRecipe] = useState<number>(0);
  const [createNumber, setCreateNumber] = useState<number>(1);
  const [prices, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [selectedItem]);

  const updatePrice = (index: string, price: number, number: number) => {
    dispatch({ type: "UPDATE_PRICE", index, price, number: number });
  };
  return (
    <>
      <Card classes={{ root: "mb-5" }}>
        <AutocompleteInput
          label="アイテムを選択"
          onSelected={(option) => setSelectedItem(option)}
          options={keys.map((key) => {
            return { label: key, value: key };
          })}
        />
      </Card>

      {selectedItem && (
        <Card>
          <div className="flex justify-between">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">使用するレシピ</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                defaultValue={selectedRecipe}
                onChange={(v) => setSelectedRecipe(Number(v.target.value))}
              >
                {ItemTrade[selectedItem?.label].map((recipe, i) => (
                  <option key={i} value={i}>
                    レシピ {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <NumberInput
              label="作成する数"
              id="createNumber"
              value={createNumber}
              onChange={(v) => setCreateNumber(Number(v.target.value))}
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>アイテム名</th>
                <th>必要数</th>
                <th>値段</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ItemTrade[selectedItem?.label][selectedRecipe][
                "requirements"
              ].map((recipe, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>{recipe.name}</div>
                    </div>
                  </td>
                  <td>{recipe.amount}</td>
                  <td>
                    <NumberInput
                      label="値段"
                      defaultValue={prices[recipe.name]}
                      onChange={(target) =>
                        updatePrice(
                          recipe.name,
                          Number(target.target.value),
                          Number(recipe.amount)
                        )
                      }
                    />
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            金額:{" "}
            {(Object.keys(prices).map((key) => {
              return prices[key]["price"] * prices[key]["number"];
            }).length > 0
              ? Object.keys(prices)
                  .map((key) => {
                    return prices[key]["price"] * prices[key]["number"];
                  })
                  .reduce((a, b) => a + b) * createNumber
              : 0).toLocaleString()}
          </p>
        </Card>
      )}
    </>
  );
}
