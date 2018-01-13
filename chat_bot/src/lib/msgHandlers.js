const {
    keyboardOptions,
    unknownCommand, languageChanged,
    helpUrl, generalInfo,
    chose, testKeyboardOptions,
    questionsList,
    EN,BG } = require('./constants');


//each function will return a promise
module.exports = {

    welcome: function (bot, msg) {

        const answerEN = 'Welcome, ' 
            + msg.chat.first_name + ' '
            + msg.chat.last_name + '!' 
            + '\nI am the FMI\'s chat bot, click below to see how to communicate with me 😎';

        const answerBG = 'Здравей, ' 
            + msg.chat.first_name + ' '
            + msg.chat.last_name + '!'
            + '\nАз съм чатботът на ФМИ, кликни на линка отдолу за да '
            + 'видиш как най - лесно да комуникираш с мен 😎';


        //because sendMessage changes its param
        //deep copy objects
        //const optEN = JSON.parse(JSON.stringify(keyboardOptions[EN]));
        const optBG = JSON.parse(JSON.stringify(keyboardOptions[BG]));

        return bot.sendMessage(msg.chat.id, answerEN)//, optEN)
            .then(() => this.help(bot, msg, EN))
            .then(() => bot.sendMessage(msg.chat.id, answerBG, optBG))
            .then(() => this.help(bot, msg, BG));

    },

    langChanged: function (bot, msg, ln) {

        const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));

        return bot.sendMessage(msg.chat.id, languageChanged[ln], opt);
    },

    help: function (bot, msg, ln) {

        return bot.sendMessage(msg.chat.id, helpUrl[ln], { parse_mode: "Markdown" });
    },

    unknown: function (bot, msg, ln) {

        return bot.sendMessage(msg.chat.id, unknownCommand[ln], keyboardOptions[ln]);
    },

    gInfo: function (bot, msg, ln) {

        return bot.sendMessage(msg.chat.id, chose[ln], generalInfo[ln]);
    },


    testCallback: function (bot, msg, ln, callBacks) {

        const ansOpt = ['ABCD', 'АБВГ'];
        let userAnswer = ansOpt[ln].indexOf(msg.text);
        let [questionId, correctAnswer] = callBacks[msg.chat.id];

        //remove from callback list
        delete callBacks[msg.chat.id];

        //see answer option
        if (msg.text === 'See the answer' ||
            msg.text === 'Виж отговора') {

            let answerMsg = ln ? 'Верният отговор е: \n'
                               : 'The correct answer is :\n ';

            answerMsg += questionsList[questionId][ln].answerOptions[correctAnswer];

            const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));
            return bot.sendMessage(msg.chat.id, answerMsg, opt);
        }

        //another question option
        if (msg.text === 'Give me another question' ||
            msg.text === 'Задай ми друг въпорс') {

            return this.testMe(bot, msg, ln, callBacks);
        }

        //invalid answer
        if (userAnswer === -1)
            return this.unknown(bot, msg, ln);


        //wrong answer
        if (userAnswer !== -1 && userAnswer !== correctAnswer) {

            let answerMsg = ln ? 'Грешен отговор 😞\nВерният отговор е :\n'
                               :'Wrong answer 😞\nThe correct answer is :\n ';

            answerMsg += questionsList[questionId][ln].answerOptions[correctAnswer];

            const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));
            return bot.sendMessage(msg.chat.id, answerMsg, opt);
        }

        //correct answer
        let answerMsg = ln ? 'Верен отговор 👍' : 'Correct answer 👍\n';
        const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));
        return bot.sendMessage(msg.chat.id, answerMsg, opt);
    },


    testMe: function (bot, msg, ln, callBacks) {

        let qIndex = getRandomInt(questionsList.length);

        let question = questionsList[qIndex][ln];

        let answer = questionRender(question, ln);

        return bot.sendMessage(msg.chat.id, answer, testKeyboardOptions[ln])
            .then(() => callBacks[msg.chat.id] = [qIndex, question.correctAnswer]);
    }

};

//a helper function to represent a question
//as a test
const questionRender = (question, ln) => {

    let format = [

        ['\nA) ', '\nB) ', '\nC) ', '\nD) '],
        ['\nА) ', '\nБ) ', '\nВ) ', '\nГ) ']
    ];

    return question.text +
        format[ln][0] + question.answerOptions[0] +
        format[ln][1] + question.answerOptions[1] +
        format[ln][2] + question.answerOptions[2] +
        format[ln][3] + question.answerOptions[3] + '\n';

}

//a helper function to get a random index for
//a question from the test
const getRandomInt = (max) => {

    return Math.floor(Math.random() * Math.floor(max));

}