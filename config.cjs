const { version } = require('./package.json');
const { z } = require('zod');
// const { fromZodError } = require('zod-validation-error');
const googleCreds = require('./secrets.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { REST, CDN } = require('@discordjs/rest');
const { API } = require('@discordjs/core/http-only');

const cdn = new CDN();

const TOURNAMENT_NAME = 'Tournoza Battle Grounds'; // Edit this with your tournament name

const TOURNAMENT_PREFIX = 'TBG1'; // EX: NGT1/NGT2/SNT1

const BRAND = '#FFA500'; // Hex code for your tournaments brand color

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
    TOURNAMENT_NAME: z.string(),
    TOURNAMENT_PREFIX: z.string(),
    TOURNAMENT_BRAND: z.number(),
    version: z.string(),
    BOT_TOKEN: z.string().min(1, '🌟 You forgot your token silly.'),
    SERVER_ID: z.string(),
    // .min(1, "🌟 You didn't set your tournament server's id!"),
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
        TOURNAMENT_NAME,
        TOURNAMENT_PREFIX,
        TOURNAMENT_BRAND: Number(BRAND.replace('#', '0x')), // Converts to hexadecimal number
    });
    const botSheet = new GoogleSpreadsheet(env.CONFIG_SHEET_ID, jwt);
    const rest = new REST().setToken(env.BOT_TOKEN);
    const discord = new API(rest);
    /**
     * @type {'Bun' | 'Nodejs' | 'Serverless'}
     */
    const runtime =
        typeof Bun !== 'undefined'
            ? 'Bun'
            : process.env.VERCEL
              ? 'Serverless'
              : 'Nodejs';

    const runtimeVersion = runtime === 'Bun' ? Bun.version : process.version;

    module.exports = {
        env,
        system: { version: runtimeVersion, runtime },
        configSchema: schema,
        googleCreds,
        jwt,
        botSheet,
        rest,
        discord,
        /**
         * A bunch of pre-made embed components
         */
        embeds: {
            /**
             * @type {(int: import('discord-api-types/v10').APIInteraction) => import('@discordjs/builders').EmbedFooterOptions}
             */
            footer: ({ user, member }) => ({
                text: `${new Date().toISOString()} | ${TOURNAMENT_PREFIX}`,
                iconURL: cdn.avatar(
                    (user || member.user).id,
                    (user || member.user).avatar
                ),
            }),
            
        },
    };
} catch (err) {
    // throw fromZodError(err);
}
