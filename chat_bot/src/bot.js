const TelegramBot = require('node-telegram-bot-api');

console.log('hi, i am the chatbot :)');

//will be used to remember language settings
const usersStates = {};
const BG = 1;
const EN = 0;

const commandList = ['/lang bg' , '/lang en', '/start'];

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


const optionsInEnglish = { 
    
    'reply_markup': {

        'keyboard': [
            ['News'],
            ['Events', 'Personal info'],
            ['General information'],
            ['Test my knowledge']
        ]
    }

};

const optionsInBulgarian = {

    'reply_markup': {

        'keyboard': [
            ['Новини'],
            ['Събития', 'Персонална инфо'],
            ['Обща информация'],
            ['Тествай познанията ми']
        ]
    }
}

//first message ever
bot.onText(/\/start/, (msg) => {
    
    const answer = 'Welcome, ' + msg.chat.first_name + ' '
                             + msg.chat.last_name + '!';

                           
    //saving user preferences
    if (usersStates[msg.chat.id] === undefined)
        usersStates[msg.chat.id] = EN;

    console.log(usersStates); 

     //because sendMessage changes its param
     //deep copy objects
    const opt = JSON.parse(JSON.stringify(optionsInEnglish));
    bot.sendMessage(msg.chat.id, answer, opt);

});

//the result parameter is
//the result of executing exec on the regular expression
bot.onText(/\/lang (en|bg)/, (msg, res) => {
    

    let ln = (res[1] === 'bg') ? BG : EN;

    usersStates[msg.chat.id] = ln;
    
    const answer = (ln === EN) ? "Now we are talking in english! 🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿" :
                                 "Вече си говорим на български! 🇧🇬";

    const opt = (ln === EN) ? JSON.parse(JSON.stringify(optionsInEnglish)):
                            JSON.parse(JSON.stringify(optionsInBulgarian));

    bot.sendMessage(msg.chat.id, answer, opt);

});

bot.on('message',(msg) =>{

    //it is a known command, it should be handled somewhere else
    if(commandList.find((el) => el === msg.text) !== undefined)
        return;

    const optIndex = optionsInEnglish.reply_markup.keyboard.
                                                    join(' ').
                                                    indexOf(msg.text);
    //no such option
    if(optIndex === -1)
        bot.sendMessage(msg.chat.id, 'I don\'t understand you 😓');
    else
        bot.sendMessage(msg.chat.id, msg.text + ' pressed!');

});


