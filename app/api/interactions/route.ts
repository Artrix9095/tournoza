import commands from '@/commands';
import { env } from '@/config.cjs';
import { type APIInteraction, InteractionType } from 'discord-api-types/v10';
import { InteractionResponseType, verifyKey } from 'discord-interactions';
import { type Context, Hono, type Next } from 'hono';
import { handle } from 'hono/vercel';

// export const runtime = 'edge';

const app = new Hono().basePath('/api/interactions');

/**
 * This is a middleware that verifies that the request we're getting is from discord
 * *so sneaky people cant abuse our bot*
 */
const verifySignature = async (ctx: Context, next: Next) => {
    console.log('🔃 Verifying body...');
    // Clone the body
    const body = await ctx.req.raw.clone().arrayBuffer();

    const sig = ctx.req.raw.headers.get('x-signature-ed25519');
    const timestamp = ctx.req.raw.headers.get('x-signature-timestamp');

    if (!sig || !timestamp) return ctx.text('Invalid signature', 401);
    return !verifyKey(body, sig, timestamp, env.BOT_PUBLIC_KEY)
        ? ctx.text('Invalid signature', 401)
        : next();
};

app.all('/', verifySignature, async (c) => {
    const interaction: APIInteraction = await c.req.json();

    console.log(`Got interaction type ${interaction.type}`);

    // So you cant use the bot outside of its designated server
    if (
        interaction.guild_id !== env.SERVER_ID &&
        interaction.type !== InteractionType.Ping
    ) {
        console.log('Someone tried to access our API outside the server!');
        return c.text('Incorrect server', 401);
    }
    switch (interaction.type) {
        case InteractionType.Ping:
            return c.json({ type: InteractionResponseType.PONG });
        case InteractionType.ApplicationCommand: {
            const command = commands.find(
                (c) => c.data.name === interaction.data.name
            );
            if (!command) return;
            return c.json(await command.run(c, interaction));

            // case InteractionType.MessageComponent:
            //     const component = components.find(
            //         (c) => c.label === interaction.data.custom_id
            //     );
            //     if (!component) {
            //         console.log('Unknown component', interaction);
            //         return;
            //     }
            //     return c.json(await component.run(c as any, interaction));
        }
    }
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
export const PUT = handler;
export const PATCH = handler;

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';
