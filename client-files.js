const net = require('net');
const fs = require('fs');
const path = require('path');
const port = 8124;
const client = new net.Socket();

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
                    let extname = path.extname(file);
                        if(extname == ".txt"){
                            fs.readFile(val +"/"+ file, "utf8", function(err, datas) {
                                let st = path.basename(file) + "|" + datas+ "|";
                                console.log(st);
                                client.write(st);
                            });
                        }
                    })
                });
            }
        }); 
      });
    }
    if(process.argv.length == 2) client.destroy();
});

client.on('close', function () {
    client.destroy();
    console.log('Connection closed');
});

function push(fileName){
    return client.write(fileName + "\n");;
}