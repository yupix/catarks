

// function isConnected(args: any): args is IntegrationRequestDto {
//   return args.code !== undefined;
// }

// export async function loader({ request }: LoaderArgs) {
//   const user = await authenticator.isAuthenticated(request, { failureRedirect: '/signin' })
//   const res = await api.call('POST', '/api/users/integration/discord', { headers: new Headers({ "Cookie": user.session, "Content-Type": "text/plain" }) })
//   if (res.type === 'failed') {
//     if (res.data.data.id === '639ebe9f-b8be-435c-a350-5802e1ad2687') {
//       return json({ isConnected: true })
//     }
//     throw new Response(`${res.status}`)
//   }
//   return json(res.data)
// }

// export default function DiscordIntegration() {
//   const data = useLoaderData<typeof loader>()
//   const { classes } = useStyles();

//   return (
//     <Container size={460} my={30}>
//       <Title className={classes.title} align="center">
//         Integration With Discord
//       </Title>
//       <Paper withBorder shadow="md" p={30} radius="md" mt="xl">

//         {isConnected(data) ? <>
//           <Text color="dimmed" size="sm" align="center">
//             コマンドを使用して取得したコードを入力してください
//           </Text>

//           <Flex align="center">
//             <Text>{data.code}</Text>
//             <CopyButton value="" timeout={2000}>
//               {({ copied, copy }) => (
//                 <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
//                   <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
//                     {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
//                   </ActionIcon>
//                 </Tooltip>
//               )}
//             </CopyButton>
//           </Flex>
//           <Group position="apart" mt="lg" className={classes.controls}>
//             <Anchor color="dimmed" size="sm" className={classes.control}>
//               <Center inline>
//                 <IconArrowLeft size={12} stroke={1.5} />
//                 <Box ml={5}>元のページに戻る</Box>
//               </Center>
//             </Anchor>
//             <Button className={classes.control}>接続する</Button>
//           </Group>
//         </> : <>既に接続済みのようです！</>
//         }
//       </Paper>

//     </Container>
//   );
// }