const TelegramBot = require('node-telegram-bot-api'),
      msgHandlers = require('./lib/msgHandlers'),
      config = require('./lib/configuration');

const { 
    BG, EN, 
    commandList,
    buttonLists,
    enumOptions
} = require('./lib/constants');


//getting the token from the argv
const botToken = config.get('token');

console.log('hi, i am the chatbot :)');
console.log(botToken);

//creating the bot context
const bot = new TelegramBot(botToken, {polling: true});


//will be used to remember language settings
//chatId -> BG | EN
let usersLangs = {};

//will hold chatId -> correct answer
//map information for Test option 
let callBacks = {};

//on first message ever
bot.onText(/\/start/, (msg) => {
    
    //saving user preferences
    if (usersLangs[msg.chat.id] === undefined)
        usersLangs[msg.chat.id] = EN;

    msgHandlers.welcome(bot, msg);

});

//handling language changes
bot.onText(/\/lang (en|bg)/, (msg, res) => {
    //the result parameter is
    //the result of executing exec on the regular expression

    //exec gives us an array with matched results
    let ln = (res[1] === 'bg') ? BG : EN;

    //saving the choice
    usersLangs[msg.chat.id] = ln;

    msgHandlers.langChanged(bot, msg, ln);

});

//handling /help option
bot.onText(/\/help+/, (msg) => {

    //will match everything starting with help
    
    const ln = (usersLangs[msg.chat.id] === BG) ? BG : EN;
    
    msgHandlers.help(bot, msg, ln);

});

bot.on('message', (msg) => {

    //language of communication
    //undefined -> EN
    const ln = (usersLangs[msg.chat.id] === BG) ? BG : EN;

    //first of all checking for callback from "test me" option
    let isCallback = callBacks[msg.chat.id];

    //!== undefined
    if(isCallback){

       msgHandlers.testCallback(bot, msg, ln, callBacks);
       return;

    }

    //it is a known command, it should be handled somewhere else
    if(commandList.find((el) => el === msg.text) !== undefined ||
                                msg.text.indexOf('/help') !== -1)
        return;

    //searching for the option in the current language
    const optIndex = buttonLists[ln].indexOf(msg.text);
         
    
    switch (optIndex) {

        case enumOptions.G_INFO_INDEX:

            msgHandlers.gInfo(bot, msg, ln);
            return;

        case enumOptions.TEST_INDEX:

            msgHandlers.testMe(bot, msg, ln, callBacks);
            return;

        case enumOptions.INVALID:

            msgHandlers.unknown(bot, msg, ln);
            return;

        default:
            //proceed the command...
            bot.sendMessage(msg.chat.id, msg.text + ' pressed!');

    }

});


