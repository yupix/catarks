import { createId as cuid } from '@paralleldrive/cuid2'
import { redirect } from "@remix-run/node";
import { type Strategy } from "remix-auth";
import { DiscordStrategy } from "remix-auth-discord";
import { z } from "zod";
import { connectionSessionStorage } from "../connections.server.ts";
import { type AuthProvider, type ProviderUser } from "./provider.ts";


const shouldMock = process.env.DISCORD_CLIENT_ID?.startsWith('MOCK_')

const validateDiscordUser = z.object({
    emails: z.array(z.object({value: z.string()})),
    __json: z.object({
        username: z.string(),
        avatar: z.string()
    })
    
})

export class DiscordProvider implements AuthProvider {
    getAuthStrategy(): Strategy<ProviderUser, any> {
        return new DiscordStrategy({
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: '/auth/discord/callback',
            scope: ['identify', 'email']
        }, async ({ profile }) => {
            const validated = validateDiscordUser.parse(profile)
            const email = validated.emails[0].value.trim().toLowerCase()
            const username = validated.__json.username!
            const imageUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${validated.__json.avatar}`
            return {
                email,
                id: profile.id,
                username,
                name: profile.displayName,
                imageUrl
            }
        })
    }
    async handleMockAction(request: Request): Promise<void> {
        if (!shouldMock) return

        const connectionSession = await connectionSessionStorage.getSession(request.headers.get('Cookie'))
        const state = cuid()
        connectionSession.set('oauth2:state', state)
        const code = "MOCK_CODE_DISCORD_KODY"
        const searchParams = new URLSearchParams({ code, state })
        throw redirect(`/auth/discord/callback?${searchParams}`, {
            headers: {
                'set-cookie': await connectionSessionStorage.commitSession(connectionSession),
            }
        })
    }
    async resolveConnectionData(providerId: string): Promise<{ displayName: string; link?: string | null | undefined; }> {
        return { displayName: providerId, link: null } as const;
    }

}