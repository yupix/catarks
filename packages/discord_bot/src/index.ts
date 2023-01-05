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

import { Logger, config } from "@catarks/shared";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COMMANDS } from "@/commands/const.js";

const logger = Logger.getInstance;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandCollection = new Collection();

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds],
});
const rest = new REST({ version: "10" }).setToken(config.discord.token);
for (const _command of COMMANDS) {
  const command = await _command();
  const data = command.data;
  if (data) {
    commandCollection.set(data.name, command);
    commands.push(data.toJSON());
  }
}

try {
  logger.info(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  // The put method is used to fully refresh all commands in the guild with the current set
  rest.put(
    Routes.applicationGuildCommands("863698060454658058", "530299114387406860"),
    { body: commands }
  );

  // console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  // And of course, make sure you catch and log any errors!
  logger.error(error);
}

client.once(Events.ClientReady, (c) => {
  logger.info(c.user.tag);
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
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(config.discord.token);
