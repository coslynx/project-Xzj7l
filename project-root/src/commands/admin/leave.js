const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Disconnects the bot from the voice channel (admin only)'),
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
        content: 'The bot is not in a voice channel!',
        ephemeral: true,
      });
    }

    queue.player.stop();
    queue.connection.destroy();
    interaction.client.queue.delete(interaction.guild.id);
    await interaction.reply('Disconnected from the voice channel!');
  },
};