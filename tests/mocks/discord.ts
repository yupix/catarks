import { HttpHandler, HttpResponse, http, passthrough } from "msw";
import fsExtra from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import { DiscordProfile } from "remix-auth-discord";
import { ca } from "date-fns/locale";

const { json } = HttpResponse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const here = (...s: Array<string>) => path.join(__dirname, ...s)

const discordUserFixturePath = path.join(
    here(
        '..',
        'fixtures',
        'discord',
        `users.${process.env.VITEST_POOL_ID || 0}.local.json`
    )
)

await fsExtra.ensureDir(path.dirname(discordUserFixturePath))


const passthroughDiscord = !process.env.DISCORD_CLIENT_ID.startsWith('MOCK_') && !process.env.TESTING

function createDiscordUser(code?: string | null) {
    const createEmail = () => ({
        email: faker.internet.email(),
        verified: faker.datatype.boolean(),
        primary: false, // <-- can only have one of these
        visibility: faker.helpers.arrayElement(['public', null]),
    })

    const primaryEmail = {
        ...createEmail(),
        verified: true,
        primary: true,
    }

    const emails = [
        {
            email: faker.internet.email(),
            verified: false,
            primary: false,
            visibility: 'public',
        },
        {
            email: faker.internet.email(),
            verified: true,
            primary: false,
            visibility: null,
        },
        primaryEmail,
    ]

    code ??= faker.string.uuid()
    return {
        code,
        accessToken: `${code}_mock_access_token`,
        profile: {
            id: faker.string.uuid(),
            emails: emails.map(e => e.email),
            __json: {
                username: faker.internet.userName(),
                avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            }
        },
        emails
    }
}

type DiscordUser = ReturnType<typeof createDiscordUser>


async function getDiscordUsers() {
    try {
        if (await fsExtra.pathExists(discordUserFixturePath)) {
            const json = await fsExtra.readJson(discordUserFixturePath)
            return json as Array<DiscordUser>
        }
        return []
    } catch (error) {
        console.error(error)
        return []
    }
}

async function setDiscordUsers(users: Array<DiscordUser>) {
    await fsExtra.writeJson(discordUserFixturePath, users, { spaces: 2 })
}

export async function insertDiscordUser(code?: string | null) {
    const githubUsers = await getDiscordUsers()
    let user = githubUsers.find(u => u.code === code)
    if (user) {
        Object.assign(user, createDiscordUser(code))
    } else {
        user = createDiscordUser(code)
        githubUsers.push(user)
    }
    await setDiscordUsers(githubUsers)
    return user
}

async function getUser(request: Request) {
	const accessToken = request.headers
		.get('authorization')
		?.slice('token '.length)

	if (!accessToken) {
		return new Response('Unauthorized', { status: 401 })
	}
	const user = (await getDiscordUsers()).find(u => u.accessToken === accessToken)

	if (!user) {
		return new Response('Not Found', { status: 404 })
	}
	return user
}

export const handlers: Array<HttpHandler> = [
    http.post('https://discord.com/api/v10/oauth2/token',
        async ({ request }) => {
            if (passthroughDiscord) return passthrough()
            const params = new URLSearchParams(await request.text())

            const code = params.get('code')
            const githubUsers = await getDiscordUsers()
            let user = githubUsers.find(u => u.code === code)
            if (!user) {
                user = await insertDiscordUser(code)
            }

            return new Response(
                new URLSearchParams({
                    access_token: user.accessToken,
                    token_type: '__MOCK_TOKEN_TYPE__',
                }).toString(),
                { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
            )
        },
    ),
    http.get('https://discord.com/api/v10/users/@me', async ({ request }) => {
        if (passthroughDiscord) return passthrough()
        console.log('MEが呼ばれたよ!!')
        const user = await getUser(request)
        if (user instanceof Response) return user
        return json(user.profile)
    }),
]