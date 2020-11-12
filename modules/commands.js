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

bind(({message, content}))