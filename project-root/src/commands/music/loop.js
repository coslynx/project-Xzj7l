const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggles the loop mode for the current song or the entire queue')
    .addStringOption((option) =>
      option
        .setName('mode')
        .setDescription('Loop mode')
        .setRequired(false)
        .addChoices(
          { name: 'song', value: 'song' },
          { name: 'queue', value: 'queue' },
          { name: 'off', value: 'off' }
        )
    ),
  async execute(interaction) {
    const queue = interaction.client.queue.get(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        content: 'There is no song currently playing!',
        ephemeral: true,
      });
    }

    const loopMode = interaction.options.getString('mode');
    if (loopMode === 'song') {
      queue.loopMode = true;
      queue.loopType = 'song';
      await interaction.reply(`Looped the current song!`);
    } else if (loopMode === 'queue') {
      queue.loopMode = true;
      queue.loopType = 'queue';
      await interaction.reply(`Looped the entire queue!`);
    } else if (loopMode === 'off') {
      queue.loopMode = false;
      queue.loopType = 'off';
      await interaction.reply(`Loop mode disabled!`);
    } else {
      await interaction.reply(`Invalid loop mode!`);
    }
  },
};