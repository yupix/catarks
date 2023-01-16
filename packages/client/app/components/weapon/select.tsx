import { FC, forwardRef, useState } from 'react';
import { Group, Avatar, Text, Select, Grid, Container, Title, Box, Space, Checkbox, NumberInput } from '@mantine/core';
import { get_site, percent_to_float } from '~/utils/weapon';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);
export const SelectOps: FC<{
  data: (string | ItemProps)[]
}> = ({ data }) => {
  return (
    <Select
      label="武器を選択してください"
      placeholder="アイテムを選んでください"
      itemComponent={SelectItem}
      onChange={onChangeSelectWeapon}
      data={data}
      searchable
      maxDropdownHeight={400}
      nothingFound="Nobody here"
      filter={(value, item) =>
        item.label.toLowerCase().includes(value.toLowerCase().trim())
      }
    />)
}