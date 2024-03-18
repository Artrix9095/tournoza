const { version } = require('./package.json');
const { z } = require('zod');
const { fromZodError } = require('zod-validation-error');

const schema = z.object({
    version: z.string(),
    BOT_TOKEN: z.string().min(1, '🌟 You forgot your token silly.'),
    SERVER_ID: z
        .string()
        .min(1, "🌟 You didn't set your tournament server's id!"),
    MATCH_RESULTS_CHANNEL_ID: z.string(),
    DATABASE_URL: z.string().url("🌟 Don't forget your database url!"),
    OSU_API_KEY: z.string().min(1, '🌟 You need an osu! API key!'),
    BOT_APPLICATION_ID: z.string(),
    BOT_PUBLIC_KEY: z
        .string()
        .min(1, "🌟 You can't use slash commands without your bot public key!"),
});
try {
    const config = schema.parse({
        version,
        BOT_TOKEN: Bun.env.BOT_TOKEN,
        BOT_APPLICATION_ID: Bun.env.BOT_APPLICATION_ID,
        SERVER_ID: Bun.env.TOURNAMENT_SERVER_ID,
        DATABASE_URL: Bun.env.DATABASE_URL,
        MATCH_RESULTS_CHANNEL_ID: Bun.env.MATCH_RESULTS_CHANNEL_ID,
        OSU_API_KEY: Bun.env.OSU_API_KEY,
    });

    module.exports = { config, configSchema: schema };
} catch (err) {
    throw fromZodError(err);
}
