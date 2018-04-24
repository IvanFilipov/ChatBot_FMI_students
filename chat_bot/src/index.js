const TelegramBot = require('node-telegram-bot-api'),
      schedule = require('node-schedule'),
      msgHandlers = require('./lib/msgHandlers'),
      config = require('./lib/configuration'),
      logger = require('./lib/logger');


const { 
    BG, EN, 
    commandList,
    buttonLists,
    enumOptions
} = require('./lib/constants');

logger.info('STARTED');

//getting the token from the argv
const botToken = config.get('bToken');

//creating the bot context
const bot = new TelegramBot(botToken, {polling: true});

//will be used to remember language settings
//chatId -> BG | EN
let usersLangs = {};

//will hold chatId -> correct answer
//map information for Test option 
let callBacks = {};

//will hold all bot's stickers
let stickers = [];

//polling error handler
let online = true; //use to avoid multiple error logs
bot.on('polling_error', (err) => {
   
    if(online){

        logger.error(err.code);
        online = false;
    }
});

//on first message ever
bot.onText(/\/start/, (msg) => {

     //saving user preferences
    usersLangs[msg.chat.id] = BG; //default language is bulgarian

    msgHandlers.welcome(bot, msg)
        .then(() => logger.info('WELCOME ' + msg.chat.id + ' OK'))
        .catch(err => logger.error(err.toString()));
});

//handling language changes
bot.onText(/\/lang_(en|bg)/, (msg, res) => {
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

//handling personal information by faculty number
bot.onText(/\d+/, (msg, res) => {

    const ln = (usersLangs[msg.chat.id] === EN) ? EN : BG;

    //faculty ids are at least 5 digits,
    //not handled by the regexp on purpose 
    if (res.input.length < 5 || res.input.length > 8) {

        msgHandlers.invalidFacultyNumber(bot, msg, ln)
            .then(() => logger.info('PERSONAL INFO ' + msg.chat.id + ' INVALID ID'))
            .catch(err => logger.error(err.toString()));

        return;
    }

    msgHandlers.personalInfo(bot, msg, ln)
        .then(() => logger.info('PERSONAL INFO ' + msg.chat.id + ' OK'))
        .catch(err => logger.error(err.toString()));
});

//handle key command
bot.onText(/\/key/, (msg, res) => {

    const ln = (usersLangs[msg.chat.id] === EN) ? EN : BG;

    msgHandlers.getMoodleKey(bot, msg, ln)
        .then(() => logger.info('MOODLE KEY ' + msg.chat.id + ' OK'))
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
            .catch(err => logger.error(err.toString()));

       return;
    }

    if(msg.sticker !== undefined) {

        let ans_sticker = stickers.find(el => el.emoji == msg.sticker.emoji);

        if(ans_sticker === undefined) {

            if(stickers.length !== 0) {

                let index = Math.floor(Math.random() * Math.floor(stickers.length));
                ans_sticker = stickers[index];
            } else {

                ans_sticker = msg.sticker;
            }
        }

        bot.sendSticker(msg.chat.id, ans_sticker.file_id) 
            .then(() => logger.info("sticker OK"))
            .catch(() => logger.error("sticker PROBLEM"));
        
        return;
    }

    if(msg.text === undefined) {

        msgHandlers.unknown(bot, msg, ln)
        .then(msg => logger.info('UNKNOWN ' + msg.chat.id + ' OK'))
        .catch(err => logger.error(err.toString()));
        return;
    }

    //it is a known command, it should be handled somewhere else
    if(commandList.find((el) => el === msg.text) !== undefined ||
        msg.text.indexOf('/help') !== -1 || !isNaN(msg.text))
        return;

    //searching for the option in the current language
    const optIndex = buttonLists[ln].indexOf(msg.text);
         
    
    switch (optIndex) {

        case enumOptions.G_INFO_INDEX:

            msgHandlers.getGeneralInfo(bot, msg, ln)
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

        case enumOptions.NEWS_INDEX:

            msgHandlers.getNews(bot, msg, ln)
                .then(msg => logger.info('GET NEWS ' + msg.chat.id + ' OK'))
                .catch(err => logger.error(err.toString()));

            return;

        case enumOptions.ASSIGN_INDEX:

            msgHandlers.getAssignments(bot, msg, ln)
                .then(msg => logger.info('ASSIGNMENTS ' + msg.chat.id + ' OK'))
                .catch(err => logger.error(err.toString()));
            return;

        case enumOptions.P_INFO_INDEX:

            let answer = ln ? 'моля, въведи факултетния си номер 🎓'
                            : 'please, enter your faculty number 🎓';

            bot.sendMessage(msg.chat.id, answer, {
                reply_markup: JSON.stringify({ //hides the keyboard
                    hide_keyboard: true
                })
            });
            return;
            
        default:
            //debug reason only...
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

 
bot.getStickerSet('HackerBoyStickers')
    .then(res => {

        stickers = res.stickers;
})

//update all info on starting...
msgHandlers.update()
    .then(() => logger.info('UPDATE NEWS AND ASSIGNMENTS : OK'))
    .catch(err => logger.error('UPDATE : ' + err.toString()));


//try to update on every five minutes
const updateJob = schedule.scheduleJob('*/15 * * * *', () => {

    msgHandlers.update()
        .then(() => logger.info('UPDATE NEWS AND ASSIGNMENTS : OK'))
        .catch(err => logger.error('UPDATE : ' + err.toString()));
});