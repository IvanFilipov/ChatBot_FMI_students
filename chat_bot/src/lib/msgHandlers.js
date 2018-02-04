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
        userReq, gradesReq } = require('./moodleAPI');

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

        let answer = questionRender(question, ln);

        return bot.sendMessage(msg.chat.id, answer, testKeyboardOptions[ln])
            .then(() => callBacks[msg.chat.id] = [qIndex, question.correctAnswer]);
    },


    getNews : function (bot, msg, ln){

        return fetchDiscussions()
            .catch(err => {

                bot.sendMessage(msg.chat.id, internalError[ln]);
                throw err;
            })
            .then(() => getTittles(discussions))
            .then((res) => bot.sendMessage(msg.chat.id, news[ln], res))

    },

    getNewsContain : function (bot, msg, action){

        let disc = discussions.find(el => el.id === action);

        if(disc === undefined)
            return bot.sendMessage(msg.chat.id, 'Currently unavailable');
        
        //basic HTML supported ...
        let answer = replaceAll(disc.message,'<p.*?>','\n');
        answer = replaceAll(answer,'</p>','');
        answer = replaceAll(answer, '<br.*?/>', '\n');

        return bot.sendMessage(msg.chat.id, answer, { parse_mode: "HTML" })
               .catch(() => bot.sendMessage(msg.chat.id, disc.message)); // send raw .. :(
            
    },

    getAssignments : function (bot, msg, ln){

         //console.log(assignments);

         return fetchAssignments()
             .catch(err => {
 
                 bot.sendMessage(msg.chat.id, internalError[ln]);
                 throw err;
             })
             .then(() => getAssignmentsInfo(assignments, ln))
             .then((res) => bot.sendMessage(msg.chat.id, res))

    },

    personalInfo: function (bot, msg, ln){

        let facultyId = msg.text;

        return userReq.request()
            .catch(err => {
                bot.sendMessage(msg.chat.id, internalError[ln], keyboardOptions[ln]);
                throw err;
            })
            .then(response => userInfo(response.data, facultyId, msg.from.id.toString(), ln))
            .catch(err => {
                bot.sendMessage(msg.chat.id, err, keyboardOptions[ln]);
                throw err;
            })
            .then(userid => {
                //setting the current request parameter
                gradesReq.defaults.params['userid'] = userid;

                return gradesReq.request()
                    .catch(err => {
                        bot.sendMessage(msg.chat.id, internalError[ln], keyboardOptions[ln]);
                        throw err;
                    })
                    .then(response => getGrades(response.data, ln))
                    .then(res => bot.sendMessage(msg.chat.id, res, keyboardOptions[ln]))

            });


    },

    invalidFacultyNumber : function(bot, msg, ln){

        return bot.sendMessage(msg.chat.id, invalidFn[ln], keyboardOptions[ln]);

    }

};


//used to replace <p> and other tags
//in order to make a valid html for parse mode
const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace);
}

//will hold all forum's discussions
let discussions = [];
//will hold all forum's assignments
let assignments = [];


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


const getAssignmentsInfo = (assignments, ln) => {

    let res = ln ? 'Предстоящите ви задания са 🗓️ : \n\n' 
                 : 'Your upcoming assignments are 🗓️ : \n\n';

    //TO DO filter
    assignments.forEach(assign => res += formatAssignment(assign));
    
    return res;
}

const formatAssignment = (assignment) => {

    return assignment.name + '\n'
        + 'от : \n'
        + 'до : \n'
        + 'къде : в мудъл \n'
        + '\n\n';
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

//a helper function to get personal data of a user
const userInfo = (users, facultyId, fromId, ln) =>{

    if(users === undefined)
        throw internalError[ln];

    let user = users.find(el => el.idnumber === facultyId);

    //this faculty number is not enrolled in the course
    if(user === undefined)
        throw accessDeniedEnrol[ln];

    
    //if(user.customfields === undefined)
      //  throw "Access denied : Moodle profile is not configured!";

    //let telegramId = user.customfields.find(el => el.shortname === "telegramid").value;

    let telegramId = user.skype;

    if(telegramId === undefined)
        throw accessDeniedMoodleConfig[ln];

    if(telegramId !== fromId)
        throw accessDeniedOtherFn[ln];

    return user.id;
}

//a helper to get all grades for a user
const getGrades = (user, ln) => {


    let arrGrades = user.usergrades[0].gradeitems;

    return formatGradesAnswer(arrGrades, ln);

}

//a helper function used for formating the answer with
//a user's grades
const formatGradesAnswer = (arrGrades, ln) => {

    let res = ln ? "Оценките, които имаме за теб са 🏫 :\n"
                 :  "Your grades are 🏫 :\n" ;

    arrGrades.forEach(el => {

        res += el.itemname + '\n'
            + el.gradeformatted + ' / ' 
            + el.grademax + '\n\n';

    })

    return res;
}


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