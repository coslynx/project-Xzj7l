module.exports = {
  parseArgs(argsString) {
    const args = argsString.trim().split(/ +/);
    return args.filter((arg) => arg !== '');
  },
};