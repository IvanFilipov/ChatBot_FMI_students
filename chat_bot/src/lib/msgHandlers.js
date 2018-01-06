const {
    keyboardOptions,
    unknownCommand, languageChanged,
    helpUrl, generalInfo,
    chose, testKeyboardOptions,
    questions } = require('./constants');


//each function will return a promise
module.exports = {

    welcome: function (bot, msg) {

        const answer = 'Welcome, ' + msg.chat.first_name + ' '
            + msg.chat.last_name + '!';

        //because sendMessage changes its param
        //deep copy objects
        const opt = JSON.parse(JSON.stringify(keyboardOptions[EN]));
        return bot.sendMessage(msg.chat.id, answer, opt);
    },

    langChanged: function (bot, msg, ln) {

        const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));

        return bot.sendMessage(msg.chat.id, languageChanged[ln], opt);
    },

    help: function (bot, msg, ln) {

        return bot.sendMessage(msg.chat.id, helpUrl[ln], { parse_mode: "Markdown" });
    },

    unknown: function (bot, msg, ln) {

        return bot.sendMessage(msg.chat.id, unknownCommand[ln]);
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

            let answerMsg = 'The correct answer is :\n ' +
                questions[questionId].answerOptions[correctAnswer];

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

            let answerMsg = 'Wrong answer :(\n' + 'The correct answer is :\n ' +
                questions[questionId].answerOptions[correctAnswer];

            const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));
            return bot.sendMessage(msg.chat.id, answerMsg, opt);
        }

        //correct answer
        let answerMsg = 'Correct answer :)\n';
        const opt = JSON.parse(JSON.stringify(keyboardOptions[ln]));
        return bot.sendMessage(msg.chat.id, answerMsg, opt);
    },


    testMe: function (bot, msg, ln, callBacks) {

        let question = questions[0];

        let answer = questionRender(question);

        return bot.sendMessage(msg.chat.id, answer, testKeyboardOptions[ln])
            .then(() => callBacks[msg.chat.id] = [0, question.correctAnswer]);
    }

};

//a helper function to represent a question
//as a test
const questionRender = function (question) {


    return question.text +
        '\nA) ' + question.answerOptions[0] +
        '\nB) ' + question.answerOptions[1] +
        '\nC) ' + question.answerOptions[2] +
        '\nD) ' + question.answerOptions[3] + '\n';

}