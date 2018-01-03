const TelegramBot = require('node-telegram-bot-api');


const { BG, EN, commandList, 
    usersStates, keyboardOptions, 
    unknownCommand, languageChanged,
    helpUrl, generalInfo,
    choseOne } = require('./constants');


console.log('hi, i am the chatbot :)');

//console.log(process.argv);

//the token passed as argument
let botToken;

function init(){

    botToken = process.argv[2];

    if(botToken === undefined)
        throw Error('can\'t process');

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
    
    const answer = 'Welcome, ' + msg.chat.first_name + ' '
                             + msg.chat.last_name + '!';

    //saving user preferences
    if (usersStates[msg.chat.id] === undefined)
        usersStates[msg.chat.id] = EN;

     //because sendMessage changes its param
     //deep copy objects
    const opt = JSON.parse(JSON.stringify(keyboardOptions[EN]));
    bot.sendMessage(msg.chat.id, answer, opt);

});

//handling language changes
bot.onText(/\/lang (en|bg)/, (msg, res) => { 
    //the result parameter is
    //the result of executing exec on the regular expression
    
    //exec gives us an array with matched results
    let ln = (res[1] === 'bg') ? BG : EN;

    //saving the choice
    usersStates[msg.chat.id] = ln;
    
    const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));

    bot.sendMessage(msg.chat.id, languageChanged[ln], opt);

});

//handling /help option
bot.onText(/\/help+/, (msg) => {

    //will match everything starting with help
    
    const ln = (usersStates[msg.chat.id] === BG) ? BG : EN;
    
    bot.sendMessage(msg.chat.id, helpUrl[ln], {parse_mode : "Markdown"});

});

bot.on('message',(msg) =>{

    //it is a known command, it should be handled somewhere else
    if(commandList.find((el) => el === msg.text) !== undefined ||
                                msg.text.indexOf('/help') !== -1)
        return;

    //undefined -> EN
    const ln = (usersStates[msg.chat.id] === BG) ? BG : EN;

    //searching for the option
    const optIndex = keyboardOptions[ln].reply_markup.keyboard.
                                                    join(' ').
                                                    indexOf(msg.text);
    //no such option
    if(optIndex === -1){

        bot.sendMessage(msg.chat.id, unknownCommand[ln]);
        return;
    }

    if( msg.text === 'General information' ||
        msg.text === 'Обща информация'){
        bot.sendMessage(msg.chat.id, choseOne[ln], generalInfo[ln]);
        return;

    }
    
    //proceed the command...
    bot.sendMessage(msg.chat.id, msg.text + ' pressed!');

});


