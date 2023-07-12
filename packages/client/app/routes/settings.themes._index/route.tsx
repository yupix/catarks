import { Card } from "~/components/Card/Card";
import { useSessionState } from "~/states/common";
import { THEMES } from "~/const";
import { useAtom } from "jotai";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ActionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { NotNullableFormData } from "~/utils/utils";
import { validateUpdateUserTheme } from "./validate-update-theme";
import { prisma } from "~/utils/prisma.server";
import { commitSession, sessionStorage } from "~/utils/session.server";

export async function action({ request }: ActionArgs) {

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const formData = NotNullableFormData(await request.clone().formData());
  const useTheme = formData.get('useTheme')
  const body = validateUpdateUserTheme.parse({ useTheme })
  switch (request.method) {
    case 'PATCH': {
      const updatedUserSettings = await prisma.userSettings.update({
        where: {
          userId: user.id
        },
        data: {
          useTheme: body.useTheme
        }
      })

      let session = await sessionStorage.getSession(request.headers.get('cookie'))
      user.settings = updatedUserSettings
      session.set(authenticator.sessionKey, user);
      return redirect('/settings/themes', {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }
  }
}

export default function SettingsCommonPage() {
  const [session] = useAtom(useSessionState);
  const submit = useSubmit()
  const navigation = useNavigation();
  const changeHandler = (theme: string) => {
    submit({ useTheme: theme }, { method: 'PATCH', replace: true })
  }

  useEffect(() => {
    if (navigation.state === 'submitting') {
      toast.success('設定を保存しました')
    }
  }, [navigation.state])

  return (
    <Card>
      <Form method="put">
        <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {THEMES.map((theme) => (
            <div key={theme} onClick={() => changeHandler(theme)} className={`border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline outline-2 outline-offset-2 outline-transparent ${session?.user.settings?.useTheme === theme && '!outline-base-content'}`} data-set-theme="light" >
              <div data-theme={theme} className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                  <div className="bg-base-300 col-start-1 row-start-3"></div>
                  <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                    <div className="font-bold" >{theme}</div>
                    <div className="flex flex-wrap gap-1">
                      <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-primary-content text-sm font-bold" >A</div>
                      </div>
                      <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-secondary-content text-sm font-bold" >A</div>
                      </div>
                      <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-accent-content text-sm font-bold" >A</div>
                      </div>
                      <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-neutral-content text-sm font-bold" >A</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Form>
    </Card>
  );
}
