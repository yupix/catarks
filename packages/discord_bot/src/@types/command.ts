import { SlashCommandSubcommandsOnlyBuilder } from "discord.js"

export interface ICommand {
    execute(): void
}