import type { SlashCommandBuilder } from '@discordjs/builders';
import {
    type APIInteraction,
    type APIInteractionResponse,
    InteractionResponseType,
} from 'discord-api-types/v10';
import type { Context } from 'hono';
import info from './info';
export type SlashCommand = {
    data: SlashCommandBuilder;
    run: (
        ctx: Context,
        interaction: APIInteraction
    ) => Promise<APIInteractionResponse>;
};

// export type ResType<T extends keyof typeof InteractionResponseType> = {
//     type: T;
//     content?: string;
// };
// export const res = <T extends keyof typeof InteractionResponseType>(
//     r: ResType<T>
// ): APIInteractionResponse => {
//     return {
//         type: InteractionResponseType[r.type],
//         data: {
//             content: r.content,

//         },
//     };
// };

export default [info] as SlashCommand[];
