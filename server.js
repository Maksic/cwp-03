const path = require("path");
const net = require('net');
const fs = require('fs');
const port = 8124;
let floderName;
let seed = 0;
let dirPath;

const server = net.createServer((client) => {
    const logger = fs.createWriteStream('client_'+ seed +'.txt');
    logger.write('Client ' + seed + ' disconnected\n');
    client.id = seed++;
    dirPath = "client_" + seed;
    client.setEncoding('utf8');

    client.on('data', (data) => {
        if (data === 'FILES') {
            client.write('ACK');
            console.log("New user with files and ID: " + seed);
        }
        else{
            fs.mkdir(dirPath, function(err) {
                arr = data.split(' ');
                for (var i = 0; i < arr.length; i++) {
                    let extname = path.extname(arr[i]);
                    if(extname == ".txt"){
                   fs.writeFile(dirPath +'/'+ arr[i], "text", function(err) {
                        if(err) throw err; 
                    });
                  }
                }
            });
        }
    });

    client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});