import { z } from "zod";
import { AuthProvider, ProviderUser } from "./provider.ts";
import { Strategy } from "remix-auth";
import { Timings } from "../timing.server.ts";
import { DiscordStrategy } from "remix-auth-discord";
import { connectionSessionStorage } from "../connections.server.ts";
import { createId as cuid } from '@paralleldrive/cuid2'
import { redirect } from "@remix-run/node";

const DiscordUserSchema = z.object({ login: z.string() })
const DiscordUserParseResult = z.object({
    success: z.literal(true),
    data: DiscordUserSchema
}).or(z.object({
    success: z.literal(false)
}))

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
    async resolveConnectionData(providerId: string, { timings }: { timings?: Timings }): Promise<{ displayName: string; link?: string | null | undefined; }> {
        return { displayName: providerId, link: null } as const;
    }

}