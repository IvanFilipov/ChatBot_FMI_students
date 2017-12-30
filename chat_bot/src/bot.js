const TelegramBot = require('node-telegram-bot-api');

console.log('hi, i am the chatbot :)');

//console.log(process.argv);

let botToken;

function init(){

    botToken = process.argv[2];

    if(botToken === undefined)
        throw Error("can't process");

}

try {

    init();
    console.log(botToken);
}
catch(err){

    console.error(err);
    process.exit(-1);
}

const bot = new TelegramBot(botToken, {polling: true});

bot.on('message',(msg) =>{

    bot.sendMessage(msg.chat.id, msg.text);

});


