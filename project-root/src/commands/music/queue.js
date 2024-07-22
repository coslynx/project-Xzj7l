const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current song queue'),
  async execute(interaction) {
    const queue = interaction.client.queue.get(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        content: 'There is no song currently playing!',
        ephemeral: true,
      });
    }

    const queueContent = queue.songs
      .map((song, index) => `${index + 1}. **${song.title}** by **${song.author}**`)
      .join('\n');

    await interaction.reply(`**Current Queue:**\n${queueContent}`);
  },
};