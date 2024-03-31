// TODO:  Add more information from the sheet to the info command such as tournament format (3v3 ts5 etc etc)

import { embeds, env, system } from '@/config.cjs';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { InteractionResponseType } from 'discord-api-types/v10';
import type { SlashCommand } from '.';

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription(
            `Information on ${env.TOURNAMENT_PREFIX} & its Tournoza client`
        ),

    async run(ctx, interaction) {
        const systemInformation = [
            `**Tournoza version**: [v\`${env.version}\`](https://github.com/Artrix9095/tournoza/releases)`,
            `**Runtime**: \`${system.runtime} @ ${system.version}\``,
        ];

        const tournamentInformation = [
            `**Tournament Name**: ${env.TOURNAMENT_NAME} | ${env.TOURNAMENT_PREFIX} `,
        ];

        const embed = new EmbedBuilder({
            color: env.TOURNAMENT_BRAND,
            title: 'Tournament & Bot Information',
            // description: `**Information on ${env.TOURNAMENT_PREFIX}'s Tournoza client**`,
        })
            .addFields(
                {
                    name: 'Tournament Information',
                    value: tournamentInformation.join('\n'),
                },
                {
                    name: 'System Information',
                    value: systemInformation.join('\n'),
                }
            )
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
