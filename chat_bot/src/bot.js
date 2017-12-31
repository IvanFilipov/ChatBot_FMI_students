const TelegramBot = require('node-telegram-bot-api');

console.log('hi, i am the chatbot :)');

//will be used to remember language settings
const usersStates = {};

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


const optionsInEnglish = { 
    
    "reply_markup": {

        "keyboard": [
            ["News"],
            ["Events", "Personal info"],
            ["General information"],
            ["Test my knowledge"]
        ]
    }

};

//first message ever
bot.onText(/\/start/, (msg) => {
    
    let answer = "Welcome, " + msg.chat.first_name + ' '
                             + msg.chat.last_name + '!';

    bot.sendMessage(msg.chat.id, answer, optionsInEnglish);

});

bot.on('message',(msg) =>{

    const optIndex = optionsInEnglish.reply_markup.keyboard.
                                                    join(' ').
                                                    indexOf(msg.text);
    
    //no such option
    if(optIndex === -1)
        bot.sendMessage(msg.chat.id, "I don't understand you 😓");
    else
        bot.sendMessage(msg.chat.id, msg.text + " pressed!");

});


