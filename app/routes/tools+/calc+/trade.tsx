import * as numeral from "@elastic/numeral"
import { type LoaderFunctionArgs, json } from "@remix-run/server-runtime";
import { useEffect, useReducer, useState } from "react";
import ItemTrade from "#app/assets/data/item_trade.json";
import { AutoComplete, type AutoCompleteItem } from "#app/components/auto-complete.tsx";
import { Container } from "#app/components/container.tsx";
import { NIcon } from "#app/components/n-icon.tsx";
import { Spacer } from "#app/components/spacer.tsx";
import { TopSection } from "#app/components/top-section.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#app/components/ui/card.tsx";
import { Input } from "#app/components/ui/input.tsx";
import { Label } from "#app/components/ui/label.tsx";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#app/components/ui/select.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#app/components/ui/table.tsx";
import { cn } from "#app/utils/misc.tsx";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({});
}

// Stateの型定義
type State = {
  [key: string]: { price: number; number: number };
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

export default function CreateItemPricePage() {
  const keys = Object.keys(ItemTrade);
  const [selectedItem, setSelectedItem] = useState<AutoCompleteItem>();
  const [selectedRecipe, setSelectedRecipe] = useState<number>(0);
  const [createNumber, setCreateNumber] = useState<number>(1);
  const [shopPrice, setShopPrice] = useState<number>(0);
  const [prices, dispatch] = useReducer(reducer, {});
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [selectedItem]);

  useEffect(() => {
    setCreateNumber(1);
  }, [selectedRecipe])

  useEffect(() => {
    setPrice(Object.keys(prices).map((key) => {
      return prices[key]["price"] * prices[key]["number"];
    }).length > 0
      ?
      Object.keys(prices)
        .map((key) => {
          return prices[key]["price"] * prices[key]["number"];
        })
        .reduce((a, b) => a + b) * createNumber : 0)
  }, [prices, createNumber])


  const updatePrice = (index: string, price: number, number: number) => {
    dispatch({ type: "UPDATE_PRICE", index, price, number: number });
  }

  const sales = (price - shopPrice * 0.1 * createNumber) - (price - shopPrice * 0.1 * createNumber) * 0.1;

  return (
    <Container>
      <Spacer size={"xs"} />
      <TopSection className="h-60">
        <div className="text-white font-bold text-3xl">トレード価格計算機</div>
      </TopSection>
      <Spacer size={"4xs"} />
      <div className="border rounded-md flex justify-between p-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="createItem">作成するアイテム</Label>
          <AutoComplete
            id={"createItem"}
            label="アイテムを選択"
            onCustomSelected={(option) => setSelectedItem(option)}
            options={keys.map((key) => {
              return { label: key, value: key };
            })}
            placeholder="アイテムを選択"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="shopPrice">ショップでの価格</Label>
          <Input
            min={0}
            step={100}
            type="number"
            max={9999999999}
            id="shopPrice"
            value={shopPrice}
            onChange={(v) => setShopPrice(Number(v.target.value))}
          />
        </div>
      </div>

      {selectedItem && (
        <div className="border rounded-md p-4">
          <div className="flex justify-between">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="selectRecipe">作成個数</Label>
              <Select name="selectRecipe" defaultValue={String(0)} onValueChange={(v) => setSelectedRecipe(Number(v))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="使用するレシピ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ItemTrade[selectedItem?.label as ItemTradeKeys].map((recipe, i) => (

                      <SelectItem key={i} value={String(i)}>レシピ {i + 1}</SelectItem>
                    ))}

                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="form-control w-full max-w-xs">

            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="createNumber">作成個数</Label>
              <Input
                //   label="作成する数"
                min={0}
                type="number"
                max={999}
                id="createNumber"
                value={createNumber}
                onChange={(v) => setCreateNumber(Number(v.target.value))}
              />
            </div>

          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">アイテム名</TableHead>
                <TableHead>必要数</TableHead>
                <TableHead>1つあたりの値段</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ItemTrade[selectedItem?.label as ItemTradeKeys][selectedRecipe][
                "requirements"
              ].map((recipe, i) => (
                <TableRow key={`${recipe.name}${selectedRecipe}${i}`}>
                  <TableCell className="font-medium">{recipe.name}</TableCell>
                  <TableCell>{recipe.amount}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      //   label="値段"
                      defaultValue={0}
                      onChange={(target) =>
                        updatePrice(
                          recipe.name,
                          Number(target.target.value),
                          Number(recipe.amount)
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Spacer size={"4xs"} />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              必要な総額
            </CardTitle>
            <NIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{price.toLocaleString()}{price > 1000 ? <>{" "}({numeral.default(price).format('0.0a')})</> : null}</div>

          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              純売上
            </CardTitle>
            <NIcon />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", 0 === sales ? '' : sales > 0 ? 'text-green-300' : 'text-red-300')}>{sales === 0 ? sales : sales > 0 ? `+${sales.toLocaleString()}` : sales.toLocaleString()}{sales > 1000 ? <>{" "}({numeral.default(sales).format('0.0a')})</> : null}</div>
            <p className="text-xs text-muted-foreground">
              システム利用料（10%）は排除しています。
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}