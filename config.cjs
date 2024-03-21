const { version } = require('./package.json');
const { z } = require('zod');
// const { fromZodError } = require('zod-validation-error');
const googleCreds = require('./secrets.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { REST } = require('@discordjs/rest');
const { API } = require('@discordjs/core/http-only');

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
    email: googleCreds.client_email,
    key: googleCreds.private_key,
    scopes: SCOPES,
});

const schema = z.object({
    version: z.string(),
    BOT_TOKEN: z.string().min(1, '🌟 You forgot your token silly.'),
    SERVER_ID: z
        .string()
        .min(1, "🌟 You didn't set your tournament server's id!"),
    MATCH_RESULTS_CHANNEL_ID: z.string(),
    CONFIG_SHEET_ID: z.string().min(1, "🌟 Don't forget your database url!"),
    OSU_API_KEY: z.string().min(1, '🌟 You need an osu! API key!'),
    BOT_APPLICATION_ID: z.string(),
    BOT_PUBLIC_KEY: z
        .string()
        .min(1, "🌟 You can't use slash commands without your bot public key!"),
});
try {
    const env = schema.parse({
        version,
        BOT_TOKEN: process.env.BOT_TOKEN,
        BOT_APPLICATION_ID: process.env.BOT_APPLICATION_ID,
        SERVER_ID: process.env.SERVER_ID,
        BOT_PUBLIC_KEY: process.env.BOT_PUBLIC_KEY,
        CONFIG_SHEET_ID: process.env.CONFIG_SHEET_ID,
        MATCH_RESULTS_CHANNEL_ID: process.env.MATCH_RESULTS_CHANNEL_ID,
        OSU_API_KEY: process.env.OSU_API_KEY,
    });
    const botSheet = new GoogleSpreadsheet(env.CONFIG_SHEET_ID, jwt);
    const rest = new REST().setToken(env.BOT_TOKEN);
    const discord = new API(rest);

    module.exports = {
        env,
        configSchema: schema,
        googleCreds,
        jwt,
        botSheet,
        rest,
        discord,
    };
} catch (err) {
    // throw fromZodError(err);
}
