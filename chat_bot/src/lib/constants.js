const config = require('./configuration');

//loading all URLs from the config file
const externalLinks = config.get('externalLinks');

//loading questions from file
const questions = config.get('questions');

module.exports = {

    //taken externally from a file
    questionsList : questions,

    //language number constants
    BG : 1,
    EN : 0,
    
    //all supported commands
    commandList : ['/lang_bg' , '/lang_en', '/start', '/help', '/key'],

    //all supported buttons / text messages
    buttonLists : [

        ['News','Assignments', 'Personal information','General information','Test my knowledge'],

        [ 'Новини', 'Задания', 'Лична информация', 'Обща информация', 'Тествай познанията ми']
    
    ],

    //constants for indexes of the buttons
    enumOptions: {
        NEWS_INDEX: 0,
        ASSIGN_INDEX: 1,
        P_INFO_INDEX: 2,
        G_INFO_INDEX: 3,
        TEST_INDEX: 4,
        INVALID : -1
    },


    //keyboardOptions[0] - > object with options in EN
    //keyboardOptions[1] - > with options in BG
    keyboardOptions : [ 
        
        {  
            'reply_markup': {
        
                'keyboard': [
                    ['News'],
                    ['Assignments', 'Personal information'],
                    ['General information'],
                    ['Test my knowledge']
                ]
            }
        
        },

        {

        'reply_markup': {
            
                    'keyboard': [
                        ['Новини'],
                        ['Задания', 'Лична информация'],
                        ['Обща информация'],
                        ['Тествай познанията ми']
                    ]
                }
        }
        
    ],

    //test keyboard options
    testKeyboardOptions : [ 
        
        {  
            'reply_markup': {
        
                'keyboard': [
                    ['A', 'B', 'C', 'D'],
                    ['See the answer'],
                    ['Give me another question']
                ]
            }
        
        },

        {

        'reply_markup': {
            
                    'keyboard': [
                        ['А', 'Б', 'В', 'Г'],
                        ['Виж отговора'],
                        ['Задай ми друг въпорс']
                    ]
                }
        }
        
    ],

    //creates inline keyboard
    //to give options for 
    //general information links
    generalInfo: [

        {
            'reply_markup': {
                'inline_keyboard': [

                    [
                        {
                            text: 'course info',
                            url: externalLinks.courseInfo
                        },
                        {
                            text: 'staff & contacts',
                            url: externalLinks.teamInfo
                        }
                    ],
                    [
                        {
                            text: 'books & links',
                            url: externalLinks.booksInfo
                        },
                        {
                            text: 'syllabus',
                            url: externalLinks.themesInfo
                        }
                    ]
                ]
            }
        },
        {
            'reply_markup': {
                'inline_keyboard': [

                    [
                        {
                            text: 'За курса',
                            url: externalLinks.courseInfo
                        },
                        {
                            text: 'екип & контакти',
                            url: externalLinks.teamInfo
                        }
                    ],
                    [
                        {
                            text: 'книги & връзки',
                            url: externalLinks.booksInfo
                        },
                        {
                            text: 'конспект',
                            url: externalLinks.themesInfo
                        }
                    ]
                ]
            }
        }
    ],

    //messages for picking a choice 
    choose : [

        'Chose from below 🔗 :'
        ,
        'Избери от опциите 🔗 :'
    ],

    //messages for unknown commands
    unknownCommand : [

        'I don\'t understand you 😓'
        ,
        'Не те разбирам 😓'
    ],

    //messages for invalid test answer
    invalidTestAnswer : [

        'Sorry, but I don\'t understand your answer 🤔\nThe next time just press a button 🤓'
        ,
        'Съжалявам, но не мога да разбера отговора ти 🤔\nСледващия път просто натисни бутонче 🤓'
    ],

    //messages for successful language change
    languageChanged :[

        'Now we are talking in english! 🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿'
        ,
        'Вече си говорим на български! 🇧🇬'
    ],

    //message for invalid faculty number
    invalidFn :[

        'Invalid faculty number! ⚠️'
        ,
        'Невалиден факултетен номер! ⚠️'
    ],

    unseenFn :[

        'I can\'t see a student with such faculty number from this course! 👀'
        ,
        'Не "виждам" студент с такъв факултетен номер в този курс! 👀'
    ],

    //message for internal error
    internalError :[

        'Internal error, please excuse us! 🙇\nwrite about the problem : email'
        ,
        'Вътрешна грешка, моля да ни извиниш! 🙇\nпиши ни за проблема : майл'
    ],

    //messages for access denied error
    accessDeniedEnrol :[

        'Access denied : Not enrolled! ⛔'
        ,
        'Достъпът отказан : Не си записан/а за този курс! ⛔'
    ],

    accessDeniedOtherFn :[

        'Access denied : This is not your account! 🚫'
        ,
        'Достъпът отказан : Това не е твоят профил! 🚫'

    ],

    accessDeniedMoodleConfig :[
        
        'Access denied : Moodle profile is not configured! ⚠️'
        ,
        'Достъпът отказан : Профилът ти в moodle не е конфигуриран! ⚠️'
    ],

    //message for get news
    news :[

        'These are the tittles of forum news, click on a tittle to read it\'s contain 📃\n'
        ,
        'Това са заглавията на новините от форума, кликни на някое заглавиe, за да получиш съдържанието на новината 📃\n'
    ],

    keyInfo : [

        'This is your telegram key for moodle 🔑 : '
        ,
        'Това е ключът ти за moodle 🔑 : '
    ],
    
    //links to instant views
    //urls with how to use information
    helpUrl : [
        '[click here]' + externalLinks.helpEN
        ,
        '[кликни тук]' + externalLinks.helpBG
    ]
};