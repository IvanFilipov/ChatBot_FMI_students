const TelegramBot = require('node-telegram-bot-api'),
      msgHandlers = require('./lib/msgHandlers'),
      config = require('./lib/configuration'),
      logger = require('./lib/logger');

const { 
    BG, EN, 
    commandList,
    buttonLists,
    enumOptions
} = require('./lib/constants');


//getting the token from the argv
const botToken = config.get('bToken');

//logger.debug('console');
logger.info('STARTED');
logger.debug(botToken);

//creating the bot context
const bot = new TelegramBot(botToken, {polling: true});

//will be used to remember language settings
//chatId -> BG | EN
let usersLangs = {};

//will hold chatId -> correct answer
//map information for Test option 
let callBacks = {};

//polling error handler
let OK = true;
bot.on('polling_error', (err) => {
   
    if(OK){

        logger.error(err.code);
        OK = false;
    }
});

//on first message ever
bot.onText(/\/start/, (msg) => {
    
    //saving user preferences
    if (usersLangs[msg.chat.id] === undefined)
        usersLangs[msg.chat.id] = BG; //default language is bulgarian

    msgHandlers.welcome(bot, msg)
                .then(() => logger.info('WELCOME ' + msg.chat.id + ' OK'))
                .catch(err => logger.error(err.toString()));

});

//handling language changes
bot.onText(/\/lang (en|bg)/, (msg, res) => {
    //the result parameter is
    //the result of executing exec on the regular expression

    //exec gives us an array with matched results
    let ln = (res[1] === 'bg') ? BG : EN;

    //saving the choice
    usersLangs[msg.chat.id] = ln;

    msgHandlers.langChanged(bot, msg, ln)
        .then(() => logger.info('CHANGE LN ' + msg.chat.id + ' OK'))
        .catch(err => logger.error(err.toString()));

});

//handling /help option
bot.onText(/\/help+/, (msg) => {

    //will match everything starting with help
    
    //if undefined => bulgarian
    const ln = (usersLangs[msg.chat.id] === EN) ? EN : BG;

    msgHandlers.help(bot, msg, ln)
        .then(() => logger.info('HELP ' + msg.chat.id + ' OK'))
        .catch(err => logger.error(err.toString()));

});

bot.on('message', (msg) => {

    
    OK = true; //back online

    //language of communication
    //undefined -> BG
    const ln = (usersLangs[msg.chat.id] === EN) ? EN : BG;

    //first of all checking for callback from "test me" option
    let isCallback = callBacks[msg.chat.id];

    //!== undefined
    if(isCallback){

        msgHandlers.testCallback(bot, msg, ln, callBacks)
            .then(() => logger.info('TEST CALLBACK ' + msg.chat.id + ' OK'))
            .catch(err => logger.error(err.toString()));;

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

            msgHandlers.gInfo(bot, msg, ln)
                .then(() => logger.info('GENERAL INFO ' + msg.chat.id + ' OK'))
                .catch(err => logger.error(err.toString()));

            return;

        case enumOptions.TEST_INDEX:

            msgHandlers.testMe(bot, msg, ln, callBacks)
                .then(() => logger.info('TEST ' + msg.chat.id + ' OK'))
                .catch(err => logger.error(err.toString()));

            return;

        case enumOptions.INVALID:

            msgHandlers.unknown(bot, msg, ln)
                .then(msg => logger.info('UNKNOWN ' + msg.chat.id + ' OK'))
                .catch(err => logger.error(err.toString()));

            return;

        case enumOptions.NEWS_INDEX :

            msgHandlers.getNews(bot, msg, ln)
                .then(msg => logger.info('GET NEWS ' + msg.chat.id + ' OK'))
                .catch(err => logger.error(err.toString()));

            return;

        default:
            //proceed the command...
            bot.sendMessage(msg.chat.id, msg.text + ' pressed!');

    }

});


// Handle callback queries from inline keyboard
bot.on('callback_query', callbackQuery => {


    const wantedId = parseInt(callbackQuery.data);
    const msg = callbackQuery.message;
    
    msgHandlers.getNewsContain(bot, msg, wantedId)
        .then(msg => logger.info('GET NEWS CONTAIN ' + msg.chat.id + ' OK'))
        .catch(err => logger.error(err.toString()));
    
});