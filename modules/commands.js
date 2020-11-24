module.exports = bind => {
  const registry = {}
  const register = (name, f) => registry[name] = f

  const path = require('path');
  const fs = require('fs');

  const directoryPath = path.join(__dirname, 'commands');

  fs.readdir(directoryPath, { withFileTypes: true }, function (err, files) {
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 

      files.filter(dirent => dirent.isFile()).forEach(function (file) {
          require(path.join(directoryPath, file.name))(register)
      });
  });

  bind((message, content, client) => {
    if (content.startsWith("_")) {
      const args = content.split(" ")
      console.log(registry)
      const command = registry[args[0].substring(1)]
      if (command) {
        command(message, args.slice(1), client)
      }
    }
  })
}
