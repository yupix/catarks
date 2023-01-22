import { Avatar, Button, Input, Paper, TextInput } from "@mantine/core";
import { ActionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useSnapshot } from "valtio";
import { authenticator } from "~/utils/auth.server";
import { useSessionState } from "~/states/common";
import { api, assertIsDefined, createAuthHeaders } from "~/utils/utils";
import { ShipType, assertIsShip } from "@catarks/shared"
import { assertIsSuccess } from "strictcat/built/rpc"

export async function action({ request }: ActionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: '/signin' })
  const form = await request.formData()
  const avatarUrl = form.get('avatarUrl')?.toString()
  const bannerUrl = form.get('bannerUrl')?.toString()
  const description = form.get('description')?.toString()
  let ship: string | number | undefined = form.get('ship')?.toString()
  if (ship) {
    ship = Number(ship)
  }

  const res = await api.call('PATCH', '/api/user', {
    body: {
      avatarUrl,
      bannerUrl,
      description,
      ship: assertIsShip(ship) ? ship : undefined
    },
    headers: {
      ...await createAuthHeaders(request)
    }
  })
  assertIsSuccess(res)
  return json(res.data)
}

export default function Settings() {
  const user = useSnapshot(useSessionState).user

  return (
    <Paper>
      <Form method="patch">
        <Avatar src={user?.avatarUrl} size="lg" />
        <TextInput label="自己紹介" name="description" defaultValue={user?.description} />
        <Button type="submit" />
      </Form>
    </Paper>
  )
}