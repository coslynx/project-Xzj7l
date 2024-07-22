const { createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');

class Queue {
  constructor(guildId) {
    this.guildId = guildId;
    this.songs = [];
    this.loopMode = false;
    this.loopType = 'off';
    this.connection = null;
    this.player = new Player(this);

    // Bind methods to the class instance
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.skip = this.skip.bind(this);
    this.clear = this.clear.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.next = this.next.bind(this);
    this.loop = this.loop.bind(this);
  }

  add(song) {
    this.songs.push(song);
  }

  remove(index) {
    if (index >= 0 && index < this.songs.length) {
      this.songs.splice(index, 1);
    }
  }

  skip() {
    this.player.stop();
  }

  clear() {
    this.songs = [];
  }

  shuffle() {
    for (let i = this.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
    }
  }

  next() {
    if (this.loopMode && this.loopType === 'song') {
      // Loop the current song
      this.player.play();
    } else if (this.loopMode && this.loopType === 'queue') {
      // Loop the entire queue
      this.songs.push(this.songs.shift());
      this.player.play();
    } else if (this.songs.length > 0) {
      // Play the next song in the queue
      this.player.play();
    }
  }

  loop(mode, type) {
    this.loopMode = mode;
    this.loopType = type;
  }
}

class Player {
  constructor(queue) {
    this.queue = queue;
    this.player = createAudioPlayer();
    this.dispatcher = null;
    this.playing = false;
    this.connection = null;

    // Bind methods to the class instance
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.skip = this.skip.bind(this);
    this.seek = this.seek.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.destroy = this.destroy.bind(this);

    // Event listeners for the player
    this.player.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
        this.playing = false;
        this.queue.next();
        this.play();
      }
    });

    this.player.on('error', (error) => {
      console.error('Player error:', error);
      this.queue.next();
      this.play();
    });
  }

  play() {
    if (!this.queue.songs.length) {
      return;
    }

    const song = this.queue.songs[0];
    const resource = createAudioResource(song.stream, { inputType: StreamType.Arbitrary });

    this.dispatcher = this.player.play(resource);
    this.playing = true;

    // Set the player connection
    if (this.connection) {
      this.player.connection = this.connection;
    }
  }

  stop() {
    if (this.dispatcher) {
      this.dispatcher.stop();
    }
    this.playing = false;
  }

  skip() {
    if (this.dispatcher) {
      this.dispatcher.stop();
    }
  }

  seek(time) {
    if (this.dispatcher) {
      this.dispatcher.seek(time);
    }
  }

  setVolume(volume) {
    if (this.dispatcher) {
      this.dispatcher.setVolumeLogarithmic(volume / 100);
    }
  }

  destroy() {
    if (this.dispatcher) {
      this.dispatcher.stop();
    }
    if (this.connection) {
      this.connection.destroy();
    }
  }
}

module.exports = Queue;