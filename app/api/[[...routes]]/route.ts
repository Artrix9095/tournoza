import commands from '@/commands';
import { config } from '@/config.cjs';
import { InteractionResponseType, verifyKey } from 'discord-interactions';
import { type APIInteraction, InteractionType } from 'discord.js';
import { type Context, Hono, type Next } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const verifySignature = async (ctx: Context, next: Next) => {
    console.log('🔃 Verifying body...');
    // Clone the body
    const body = await ctx.req.raw.clone().arrayBuffer();

    const sig = ctx.req.raw.headers.get('x-signature-ed25519');
    const timestamp = ctx.req.raw.headers.get('x-signature-timestamp');

    if (!sig || !timestamp) return ctx.text('Invalid signature', 401);

    return !verifyKey(body, sig, timestamp, config.BOT_PUBLIC_KEY)
        ? ctx.text('Invalid signature', 401)
        : next();
};

app.all('/interactions', verifySignature, async (c) => {
    const interaction: APIInteraction = await c.req.json();

    console.log(`Got interaction type ${interaction.type}`);
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

export const GET = handle(app);
export const POST = handle(app);
