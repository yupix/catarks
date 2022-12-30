import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";

import { config } from "@vent/shared";
import * as fs from "node:fs";
import { ORM } from "./db/session.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ItemsCommand } from "./commands/items.js";
import { UsersCommand } from "./commands/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const orm = ORM.instance();

const commands = [];
const commandCollection = new Collection();
const COMMANDS = [ItemsCommand, UsersCommand];

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds],
});
const rest = new REST({ version: "10" }).setToken(config.discord.token);
for (const _command of COMMANDS) {
  const command = await _command();
  const data = command.data;
  commandCollection.set(data.name, command);
  commands.push(data.toJSON());
}

try {
  console.log(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = rest.put(
    Routes.applicationGuildCommands("863698060454658058", "530299114387406860"),
    { body: commands }
  );

  // console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  // And of course, make sure you catch and log any errors!
  console.error(error);
}

client.once(Events.ClientReady, (c) => {
  console.log(c.user.tag);
});

client.on(Events.InteractionCreate, async (interaction) => {
  const getCommandName = (commandName: string) => {
    return commandCollection.get(commandName) as {
      execute: (interaction: ChatInputCommandInteraction<CacheType>) => void;
      autocomplete?: (interaction: AutocompleteInteraction<CacheType>) => void;
    };
  };
  // console.log('1', interaction.isChatInputCommand())
  if (interaction.isAutocomplete()) {
    const command = getCommandName(interaction.commandName);
    if (!command?.autocomplete) return;
    await command?.autocomplete(interaction);
  }
  if (!interaction.isChatInputCommand()) return;

  const command = getCommandName(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(config.discord.token);
