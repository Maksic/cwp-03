const path = require("path");
const net = require('net');
const fs = require('fs');
require('dotenv').config();
const port = 8124;
let floderName;
let seed = 0;
let dirPath;
let dir = process.env.DIR;
let countUser = process.env.FILES;
let conections = 0;
//DIR=default FILES=2 nodemon server.js
const server = net.createServer((client) => {
    const logger = fs.createWriteStream('client_'+ seed +'.txt');
    logger.write('Client ' + seed + ' disconnected\n');
    client.id = seed;
    conections++;
    dirPath = "client_" + seed;
    client.setEncoding('utf8');

    client.on('data', (data) => {
        if (data === 'FILES') {
            client.write('ACK');
            console.log("New user with files and ID: " + seed++);
        }
        else{
            if(conections <= countUser){
            fs.mkdir(dirPath, function(err) {
                arr = data.split(' ');
                arrs = data.split('!');
                    if(arr.length == 1){
                        fs.writeFile(dirPath +'/'+ dir +".txt", "Default text!", function(err) {
                            if(err) throw err; 
                        });
                    }
                for (var i = 0; i < arr.length; i++) {
                    let extname = path.extname(arr[i]);
                    if(extname == ".txt"){
                    fs.writeFile(dirPath +'/'+ arr[i], data, function(err) {
                        if(err) throw err; 
                    });
                  }
                }
                //client.write('DEC');
            });
          }
          else console.log("Exceeded the allowable limit.")
        }
    });

    client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});