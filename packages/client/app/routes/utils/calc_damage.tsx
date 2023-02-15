
// const data = [
//   {
//     image: 'https://s3.akarinext.org/assets/*/pso2/weapons/セイガインライフル.webp',
//     label: 'ククロフィスマシンガン',
//     value: 'ククロフィスマシンガン',
//   },

//   {
//     image: 'https://s3.akarinext.org/assets/*/pso2/weapons/セイガインライフル.webp',
//     label: 'Carol Miller',
//     value: 'ククロフィスマシンガン1',
//   },
//   {
//     image: 'https://s3.akarinext.org/assets/*/pso2/weapons/セイガインライフル.webp',
//     label: 'Homer Simpson',
//     value: 'ククロフィスマシンガン2',
//   },
//   {
//     image: 'https://s3.akarinext.org/assets/*/pso2/weapons/セイガインライフル.webp',
//     label: 'Spongebob Squarepants',
//     value: 'ククロフィスマシンガン3',
//   },
// ];

// interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
//   image: string;
//   label: string;
//   description: string;
// }

// const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
//   ({ image, label, description, ...others }: ItemProps, ref) => (
//     <div ref={ref} {...others}>
//       <Group noWrap>
//         <Avatar src={image} />

//         <div>
//           <Text size="sm">{label}</Text>
//         </div>
//       </Group>
//     </div>
//   )
// );
// export default function CalcDamage() {
//   const [weapon, setWeapon] = useState<string>()
//   const onChangeSelectWeapon = (value: string) => {
//     setWeapon(value)
//   }


//   return (
//     <Container>
//       <Grid gutter={10}>
//         <Grid.Col md={12} lg={10}>        {weapon}  <Select
//           label="武器を選択してください"
//           placeholder="Pick one"
//           itemComponent={SelectItem}
//           onChange={onChangeSelectWeapon}
//           data={data}
//           searchable
//           maxDropdownHeight={400}
//           nothingFound="Nobody here"
//           filter={(value, item) =>
//             item.label.toLowerCase().includes(value.toLowerCase().trim())
//           }
//         />
//           <Space h="lg" />
//           <Select
//             label="特殊能力（1スロ目）"
//             placeholder="Pick one"
//             itemComponent={SelectItem}
//             onChange={onChangeSelectWeapon}
//             data={data}
//             searchable
//             maxDropdownHeight={400}
//             nothingFound="Nobody here"
//             filter={(value, item) =>
//               item.label.toLowerCase().includes(value.toLowerCase().trim())
//             }
//           /><Select
//             label="特殊能力（2スロ目）"
//             placeholder="Pick one"
//             itemComponent={SelectItem}
//             onChange={onChangeSelectWeapon}
//             data={data}
//             searchable
//             maxDropdownHeight={400}
//             nothingFound="Nobody here"
//             filter={(value, item) =>
//               item.label.toLowerCase().includes(value.toLowerCase().trim())
//             }
//           /><Select
//             label="特殊能力（3スロ目）"
//             placeholder="Pick one"
//             itemComponent={SelectItem}
//             onChange={onChangeSelectWeapon}
//             data={data}
//             searchable
//             maxDropdownHeight={400}
//             nothingFound="Nobody here"
//             filter={(value, item) =>
//               item.label.toLowerCase().includes(value.toLowerCase().trim())
//             }
//           /><Select
//             label="特殊能力（4スロ目）"
//             placeholder="Pick one"
//             itemComponent={SelectItem}
//             onChange={onChangeSelectWeapon}
//             data={data}
//             searchable
//             maxDropdownHeight={400}
//             nothingFound="Nobody here"
//             filter={(value, item) =>
//               item.label.toLowerCase().includes(value.toLowerCase().trim())
//             }
//           />
//           <Select
//             label="特殊能力（5スロ目）"
//             placeholder="Pick one"
//             itemComponent={SelectItem}
//             onChange={onChangeSelectWeapon}
//             data={data}
//             searchable
//             maxDropdownHeight={400}
//             nothingFound="Nobody here"
//             filter={(value, item) =>
//               item.label.toLowerCase().includes(value.toLowerCase().trim())
//             }
//           />
//           <Space h="lg" />
//           <Group>
//             <NumberInput
//               defaultValue={18}
//               placeholder="メインクラスのレベル"
//               label="メインクラスのレベル"
//               withAsterisk
//             />
//             <NumberInput
//               defaultValue={18}
//               placeholder="エネミーのレベル"
//               label="エネミーのレベル"
//               withAsterisk
//             />
//           </Group>
//           <Space h="sm" />
//           <Group>
//             <Checkbox checked={false} label="属性武器" />
//             <Checkbox checked={false} label="弱点属性と同じ属性" />
//             <Checkbox checked={false} label="部位攻撃" />
//             <Checkbox checked={false} label="メインクラス武器" />
//           </Group>
//         </Grid.Col>
//         <Grid.Col md={12} lg={2}>
//           <Box>
//             <Title order={4}>最低ダメージ</Title>
//             <Text>123456</Text>
//           </Box>
//           <Box>
//             <Title order={4}>最大ダメージ</Title>
//             <Text>123456</Text>
//           </Box>
//           <Box>
//             <Title order={4}>期待値</Title>
//             <Text>123456</Text>
//           </Box>
//         </Grid.Col>

//       </Grid></Container>
//   )
// }