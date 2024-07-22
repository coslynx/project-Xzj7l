const { Collection } = require('discord.js');
const { token } = require('../../utils/config');
const play = require('../music/play');
const skip = require('../music/skip');
const stop = require('../music/stop');
const queue = require('../music/queue');
const nowplaying = require('../music/nowplaying');
const loop = require('../music/loop');
const clearqueue = require('../admin/clearqueue');
const leave = require('../admin/leave');
const help = require('../help');

const commands = new Collection();

commands.set(play.data.name, play);
commands.set(skip.data.name, skip);
commands.set(stop.data.name, stop);
commands.set(queue.data.name, queue);
commands.set(nowplaying.data.name, nowplaying);
commands.set(loop.data.name, loop);
commands.set(clearqueue.data.name, clearqueue);
commands.set(leave.data.name, leave);
commands.set(help.data.name, help);

module.exports = {
  handleCommand(commandName, args, message, client) {
    const command = commands.get(commandName);
    if (command) {
      return command;
    }
    return null;
  },
};