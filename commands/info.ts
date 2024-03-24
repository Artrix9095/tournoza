import { embeds, env } from '@/config.cjs';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { InteractionResponseType } from 'discord-api-types/v10';
import type { SlashCommand } from '.';

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription(
            `Information on ${env.TOURNAMENT_PREFIX}'s Tournoza client`
        ),

    async run(ctx, interaction) {
        const stats = [
            `**Tournoza version**: \`${env.version}\``,
            `**Tournament Name**: ${env.TOURNAMENT_NAME} | ${env.TOURNAMENT_PREFIX} `,
            // `**Bun version**: \`${Bun.version}\``,
        ];
        const embed = new EmbedBuilder({
            color: env.TOURNAMENT_BRAND,
            title: `${env.TOURNAMENT_NAME} Bot Information`,
            // description: `**Information on ${env.TOURNAMENT_PREFIX}'s Tournoza client**`,
        })
            .addFields({
                name: 'Information',
                value: stats.join('\n'),
            })
            .setFooter(embeds.footer(interaction))
            .toJSON();

        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [embed],
            },
        };
    },
} satisfies SlashCommand;
