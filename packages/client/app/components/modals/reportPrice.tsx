import { Button, Checkbox, Modal, NumberInput, Select, Space, Tooltip, useMantineTheme } from "@mantine/core"
import { useEffect, useReducer, useState } from "react"
import { useSnapshot } from "valtio"
import { useModalState, useSessionState } from "~/states/common"
import { SelectItem } from "../common/selectItem"
import { useFetcher } from "@remix-run/react"
import { showNotification } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons"
import { TgetItemsLoader } from "~/routes/api/items"
import { assertIsDefined } from "~/utils/utils"
import { TCreateItemPriceAction } from "~/routes/api/items/price"

type TState = {
  price: number;
  ship: number;
  itemId: string
}

type TAction = {
  type: 'INPUT'
  field: string
  payload: any
}

function reducer(state: TState, action: TAction) {
  switch (action.type) {
    case 'INPUT': {
      return {
        ...state,
        [action.field]: action.payload
      }
    }
    default:
      return state
  }
}

export const ReportPriceModal = () => {
  let [items, setItems] = useState<{ value: string, label: string, image: string }[]>([])
  const user = useSnapshot(useSessionState).user
  const initialState = {
    price: 1000,
    ship: user?.ship || 8,
    itemId: ''
  }
  useEffect(() => {
    fetcher.submit(null, {action: '/api/items?index', method: 'get'})

  }, [])
  const [state, dispatch] = useReducer(reducer, initialState)
  const isOpen = useSnapshot(useModalState).isOpenedPriceRepost
  const theme = useMantineTheme();
  const fetcher = useFetcher<TgetItemsLoader | TCreateItemPriceAction>()

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.intent === 'getItems') {
        assertIsDefined(fetcher.data.body)
        setItems(fetcher.data.body.items.map((item) => {return {value: item.id,label: item.name, image: item.iconUrl} }))
        return
      }
      if (fetcher.data.intent === 'createPrice') { 
      showNotification({
        color: "green",
        icon: <IconCheck />,
        title: "送信に成功",
        message: "ご協力感謝します!"
      })
    }
    }
  }, [fetcher.data])

  
  return (
    <Modal
      overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={isOpen}
      shadow="lg"
      radius="md"
      onClose={() => useModalState.isOpenedPriceRepost = false}
    >
      <fetcher.Form action="/api/items/price" method="post">
        <Select label="アイテムを選択してください"
          name="itemId"
          placeholder="Pick one"
          itemComponent={SelectItem}
          onChange={(itemId) => {
            dispatch({
              type: 'INPUT',
              field: 'selectItemId',
              payload: itemId
            })
          }}
          data={items}
          searchable
          maxDropdownHeight={400}
          nothingFound="Nobody here"
          filter={(value, item) =>
            item.label?.toLowerCase().includes(value.toLowerCase().trim()) || false
          }></Select>
        <NumberInput
          name="price"
          label="値段"
          step={1000}
          defaultValue={1000}
          min={1000}
          max={99999999999}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
        // formatter={(value) =>
        //   value && !Number.isNaN(parseFloat(value))
        //     ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        //     : '$ '
        // }
        />
        <NumberInput
          name="ship"
          label="シップ番号"
          step={1}
          defaultValue={user?.ship || 8}
          min={1}
          max={10}

        />
        <Space h="sm" />
        <Tooltip label="アイテムが売れてその値段を報告する際は外してください">
          <Checkbox
            name="useTax"
            label="税込み"
          />
        </Tooltip>
        <Button fullWidth mt="xl" type="submit">
          送信
        </Button>
      </fetcher.Form>
    </Modal >
  )
}