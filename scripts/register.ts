import commands from '@/commands';
import { config } from '@/config.cjs';
import { REST, Routes } from 'discord.js';

const json = commands.map((c) => c.data.toJSON());

const rest = new REST({}).setToken(config.BOT_TOKEN);

await rest.put(
    Routes.applicationGuildCommands(
        config.BOT_APPLICATION_ID,
        config.SERVER_ID
    ),
    {
        body: json,
    }
);

console.log(`💪 Posted ${json.length} public commands`);
