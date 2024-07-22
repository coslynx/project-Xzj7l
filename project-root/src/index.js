const { Client, IntentsBitField } = require('discord.js');
const { token } = require('./utils/config');
const { handleCommand } = require('./commands/utils/handleCommand');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.MessageContent] });
const prefix = '!';

client.on('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = handleCommand(commandName, args, message, client);
  if (command) {
    await command.execute();
  }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const { member, channel, guild } = newState;
  const { channel: oldChannel } = oldState;

  if (member.user.bot) return;

  const queue = client.queue.get(guild.id);
  if (!queue) return;

  if (channel && oldChannel !== channel && channel.type === 'GUILD_VOICE') {
    // Join the new voice channel
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    queue.connection = connection;
    queue.player.connection = connection;
    if (!queue.player.playing) {
      queue.player.play();
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);