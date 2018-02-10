const htmlToText = require('html-to-text');

const {
    keyboardOptions,
    unknownCommand, languageChanged,
    helpUrl, generalInfo,
    chose, testKeyboardOptions,
    questionsList, invalidFn,
    internalError, news,
    accessDeniedEnrol, accessDeniedOtherFn,
    accessDeniedMoodleConfig,
    EN,BG } = require('./constants');


const { forumReq, assignReq,
        userReq, gradesReq,
        coursesReq, updatesReq } = require('./moodleAPI');

//each function will handle a message
//received by the bot
//and will return a promise
module.exports = {

    welcome: function (bot, msg) {

        const answerEN = 'Welcome, ' 
            + msg.chat.first_name + ' '
            + msg.chat.last_name + '!' 
            + '\nI am the FMI\'s chat bot 🤖, click below to see how to communicate with me 😎';

        const answerBG = 'Здравей, ' 
            + msg.chat.first_name + ' '
            + msg.chat.last_name + '!'
            + '\nАз съм чатботът на ФМИ 🤖, кликни на линка отдолу за да '
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

    getGeneralInfo: function (bot, msg, ln) {

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

        let answer = formatQuestion(question, ln);

        return bot.sendMessage(msg.chat.id, answer, testKeyboardOptions[ln])
            .then(() => callBacks[msg.chat.id] = [qIndex, question.correctAnswer]);
    },

    getNews: function (bot, msg, ln) {

        if (discussions.length === 0)
            return bot.sendMessage(msg.chat.id, internalError[ln]);

        let res = getTittles(discussions);
        return bot.sendMessage(msg.chat.id, news[ln], res);
    },

    getNewsContain : function (bot, msg, action){

        let disc = discussions.find(el => el.id === action);

        if(disc === undefined)
            return bot.sendMessage(msg.chat.id, 'Currently unavailable');
        
        //only basic HTML is supported ...
        //all moodle discussions are formatted as HTML,
        //so we need to convert them to plain text
       let answer = htmlToText.fromString(disc.message);

        return bot.sendMessage(msg.chat.id, answer)//, { parse_mode: "HTML" })
               //.catch(() => bot.sendMessage(msg.chat.id, disc.message)); // send raw .. :(           
    },

    getAssignments : function (bot, msg, ln){

        if (assignments.length === 0)
            return bot.sendMessage(msg.chat.id, internalError[ln]);
         
        let res = getAssignmentsInfo(assignments, ln);
        return bot.sendMessage(msg.chat.id, res);
    },

    personalInfo: function (bot, msg, ln) {

        let facultyId = msg.text;
        let courseid = gradesReq.defaults.params['courseid'];
        let userid;

        userReq.defaults.params['values'] = [facultyId];

        return userReq.request()
            .then(response => {

                try {
                    coursesReq.defaults.params['userid'] =
                        checkUserTelegram(response.data[0], msg.from.id.toString(), ln);
                }
                catch (err) { //authentication error
                    bot.sendMessage(msg.chat.id, err, keyboardOptions[ln]);
                    throw err;
                }

                return coursesReq.request();

            })
            .then(response => {

                let courses = response.data;

                let ind = courses.find(el => el.id === courseid);

                if (ind === undefined) {
                    
                    bot.sendMessage(msg.chat.id, accessDeniedEnrol[ln], keyboardOptions[ln]);
                    throw accessDeniedEnrol[ln];
                }

                gradesReq.defaults.params['userid'] =
                    coursesReq.defaults.params['userid'];

                return gradesReq.request();

            })
            .then(response => formatGradesAnswer(response.data, ln))
            .then(res => bot.sendMessage(msg.chat.id, res, keyboardOptions[ln]))
            .catch(err => {

                if (err.code !== undefined) {
                    bot.sendMessage(msg.chat.id, internalError[ln], keyboardOptions[ln]);
                    throw err.code;
                }

                throw err;
            });
    },

    invalidFacultyNumber: function (bot, msg, ln) {

        return bot.sendMessage(msg.chat.id, invalidFn[ln], keyboardOptions[ln]);
    },

    update: function () {

        return fetchDiscussions()
            .then(fetchAssignments())
    }
};

//will hold all forum's discussions
let discussions = [];
//will hold all assignments
let assignments = [];

//makes a request to moodule in order to get 
//all course assignments
const fetchAssignments = () => {

    return assignReq.request()
        .then(response => assignments = response.data.courses[0].assignments);

}

//makes a request to moodule in order to get 
//all news from the forum
const fetchDiscussions = () => {

    return forumReq.request()
        .then(response => discussions = response.data.discussions);

}

//a helper function to get tittles of news in forum
//and create an inline keyboard from them
const getTittles = (discussions) => {

    const opts = {
        reply_markup: {
          inline_keyboard: [
          ]
        }
      };


    discussions.forEach(el => {
       opts.reply_markup.inline_keyboard.push([{
           text : el.name,
           callback_data : el.id
       }]);
    });

    return opts;
}

//a helper function to check fn - telegram id 
//personal data of a user
const checkUserTelegram = (user, fromId, ln) =>{

    if(user === undefined)
        throw invalidFn[ln];
    
    if(user.customfields === undefined) 
        throw accessDeniedMoodleConfig[ln];

    let telegramId = user.customfields.find(el => el.shortname === "telegramid").value;

    if(telegramId === undefined)
        throw accessDeniedMoodleConfig[ln];

    if(telegramId !== fromId)
        throw accessDeniedOtherFn[ln];

    return user.id;
}

//a helper that returns all 
//upcoming assignments formatted
const getAssignmentsInfo = (assignments, ln) => {

    let res = ln ? 'Предстоящите ви задания са 🗓️ : \n\n' 
                 : 'Your upcoming assignments are 🗓️ : \n\n';

    //UTC current time
    let currTime = Math.floor((new Date()).getTime() / 1000);

    assignments.filter(assign => assign.duedate > currTime)
               .forEach(assign => res += formatAssignment(assign, ln));

    return res;
}

//a helper to format a single assignment
const formatAssignment = (assignment, ln) => {

    let helpWords = [['\n\nfrom : ', '\nto : ', '\nwhere : '],
                     ['\n\nот : ', '\nдо : ', '\nкъде : ']];

    //UNIX timestamp is in seconds ... JS's is in milliseconds
    let timeDiff = 120 * 60, //BG is +2GMT
        from = (assignment.allowsubmissionsfromdate + timeDiff) * 1000,
        to = (assignment.duedate + timeDiff) * 1000;

    let fromTimeFormated = (new Date(from)).toUTCString().slice(0, -4), //removes " GMT"
        dueTimeFormated = (new Date(to)).toUTCString().slice(0, -4); 
    
    let where = 'moodle';

    let start = assignment.intro.indexOf('Ще проведем');

    if(start > 0){

        start = assignment.intro.indexOf('в ');
        let end = assignment.intro.indexOf('.');

        where = assignment.intro.slice(start, end);
    }

    return assignment.name
        + helpWords[ln][0] + fromTimeFormated
        + helpWords[ln][1] + dueTimeFormated
        + helpWords[ln][2] + where
        + '\n\n';
}

//a helper function used for formating the answer with
//a user's grades
const formatGradesAnswer = (user, ln) => {

    let res = ln ? "Оценките, които имаме за теб са 🏫 :\n"
                 :  "Your grades are 🏫 :\n" ;

    let arrGrades = user.usergrades[0].gradeitems;

    arrGrades.forEach(el => {
        //skip overall grade
        if (el.itemname !== null) { 

            res += el.itemname + '\n'
                + el.gradeformatted + ' / '
                + el.grademax + '\n\n';
        }

    })

    return res;
}

//a helper function to represent a question
//as a test
const formatQuestion = (question, ln) => {

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

//used to replace substring in a given string
const replaceAll = (str, find, replace) => {

    return str.replace(new RegExp(find, 'g'), replace);
}

//a helper designed to removed unsupported HTML tags
//currently unused
const clearTags = (str) => {

    let answer = replaceAll(str, '<p.*?>', '\n');
    answer = replaceAll(answer, '</p>', '');
    answer = replaceAll(answer, '<br.*?/>', '\n');

    return answer;
}