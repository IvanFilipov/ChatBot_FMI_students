const TelegramBot = require('node-telegram-bot-api');

console.log('hi, i am the chatbot :)');

//console.log(process.argv);

//the token passed as argument
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

//creating the bot context
const bot = new TelegramBot(botToken, {polling: true});

//first message ever
bot.onText(/\/start/, (msg) => {
    
    let answer = "Welcome, " + msg.chat.first_name + ' ' + msg.chat.last_name + '!';

    bot.sendMessage(msg.chat.id, answer, { 
        
        "reply_markup": {

            "keyboard": [
                ["News"],
                ["Events", "Personal info"],
                ["General information"]
            ]
        }

    });

});


bot.on('message',(msg) =>{

    bot.sendMessage(msg.chat.id, msg.text + " pressed!");

});


