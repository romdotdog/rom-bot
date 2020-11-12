const registry = {}
var register = (name, f) => registry[name, f]

const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'modules');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.forEach(function (file) {
        require(file)
    });
});

bind(({message, content}) => {
  if (content.startsWith("_")) {
    const args = content.split("")
    const command = registry[args[0].substring(1)]
    if (command) {
      command(message, args.slice(1))
    }
  }
})