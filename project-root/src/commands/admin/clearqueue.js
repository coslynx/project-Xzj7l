const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearqueue')
    .setDescription('Clears the queue of songs (admin only)'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: 'You do not have permission to use this command!',
        ephemeral: true,
      });
    }

    const queue = interaction.client.queue.get(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        content: 'There is no song currently playing!',
        ephemeral: true,
      });
    }

    queue.songs = [];
    await interaction.reply('Cleared the queue!');
  },
};