const net = require('net');
const fs = require('fs');
const port = 8124;
let seed = 0;
let statistic = 0;

const server = net.createServer((client) => {
    const logger = fs.createWriteStream('client_'+ seed +'.txt');
    logger.write('Client ' + seed + ' disconnected\n');
    client.id = seed++;
    client.setEncoding('utf8');

    client.on('data', (data) => {
        if (data === 'QA') {
            client.write('ACK');
            console.log("New user with ID: " + seed);
            statistic = 0
        }
        else{
            logger.write('Quastion: ' + data);
            let answer = Math.random() > 0.5 ? '1' : '0';
            if (answer == '1') statistic++;
            logger.write('\nAnswer: ' + answer + '\n');
            logger.write('Statistic: ' + statistic + ' right answer\n')
            client.write(answer);
        }
    });

    client.on('end', () => {
        logger.write('client ' + client.id + ' disconnected\n');
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});