import commands from '@/commands';
import { env } from '@/config.cjs';
import { Routes } from 'discord-api-types/v10';
import { REST } from 'discord.js';

const json = commands.map((c) => c.data.toJSON());

const rest = new REST({}).setToken(env.BOT_TOKEN);

await rest.put(
    Routes.applicationGuildCommands(env.BOT_APPLICATION_ID, env.SERVER_ID),
    {
        body: json,
    }
);

console.log(`💪 Posted ${json.length} public commands`);
