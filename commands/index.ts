import {
    type APIInteraction,
    type APIInteractionResponse,
    InteractionResponseType,
    type SlashCommandBuilder,
} from 'discord.js';
import type { Context } from 'hono';
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

export default [] as SlashCommand[];
