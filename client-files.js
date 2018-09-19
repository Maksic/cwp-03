const net = require('net');
const fs = require('fs');
const path = require('path');
const port = 8124;
const client = new net.Socket();
let arg = false;

client.setEncoding('utf8');
client.connect(port, function () {
    console.log('Connected');
    client.write('FILES');
});

client.on('data',  (data) => {
    if (data === 'DEC') {
        client.destroy();
    }
    if (data === 'ACK') {
        process.argv.forEach(function (val, index, array) {
         fs.stat(val, (err, stats) => {
            if (stats.isDirectory()){
                fs.readdir(val, function(err, files){
                   files.forEach(function(file){
                    client.write(path.basename(file) + " ");
                   })
                });
            }
        });
        //client.destroy();  
      });
    }
});

client.on('close', function () {
    client.destroy();
    console.log('Connection closed');
});

function push(fileName){
    return client.write(fileName + "\n");;
}