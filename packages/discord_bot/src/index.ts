import { CacheType, ChatInputCommandInteraction, Client, Collection, Events, GatewayIntentBits, REST, Routes } from "discord.js";

import {config} from "@vent/shared";
import * as fs from 'node:fs';
import { ORM } from "./db/session";

const orm = ORM.instance()

const commands = [];
const commandCollection = new Collection();
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.ts'));




const client = new Client({intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]})
const rest = new REST({ version: '10' }).setToken(config.discord.token);


for (const file of commandFiles) {

	const command = require(`${__dirname}/commands/${file}`);
	const data = command.data()
    commandCollection.set(data.name, command)
	commands.push(data.toJSON());
}


(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = rest.put(
			Routes.applicationGuildCommands("863698060454658058", "530299114387406860"),
			{ body: commands },
		);

		// console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.once(Events.ClientReady, (c) => {
    
    console.log(c.user.tag)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commandCollection.get(interaction.commandName) as {execute: (interaction: ChatInputCommandInteraction<CacheType>
        ) => void};

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(config.discord.token)

