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
    commandList : ['/lang bg' , '/lang en', '/start', '/help'],

    //all supported buttons / text messages
    buttonLists : [

        ['News','Events', 'Personal information','General information','Test my knowledge'],

        [ 'Новини', 'Събития', 'Лична информация', 'Обща информация', 'Тествай познанията ми']
    
    ],

    //constants for indexes of the buttons
    enumOptions: {
        NEWS_INDEX: 0,
        EVENTS_INDEX: 1,
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
                    ['Events', 'Personal information'],
                    ['General information'],
                    ['Test my knowledge']
                ]
            }
        
        },

        {

        'reply_markup': {
            
                    'keyboard': [
                        ['Новини'],
                        ['Събития', 'Лична информация'],
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
                            url: 'https://docs.google.com/document/d/1UaaONmxmHAJXpL4RcGcgMSptBVLR4guacb45CdYN770'
                        },
                        {
                            text: 'екип & контакти',
                            url: 'https://docs.google.com/document/d/1UaaONmxmHAJXpL4RcGcgMSptBVLR4guacb45CdYN770'
                        }
                    ],
                    [
                        {
                            text: 'книги & връзки',
                            url: 'https://docs.google.com/document/d/1Q9P_YwHMFULFn84VK-VLggO0JOmGs3Cn-B9klSmIrJs'
                        },
                        {
                            text: 'конспект',
                            url: 'https://docs.google.com/document/d/1tKRmULwk2tb_iKXIGD3jDqSNRlFidCDBv8WipIGMzyo'
                        }
                    ]
                ]
            }
        }
    ],

    //messages for picking a choice 
    chose : [

        'Chose from below :'
        ,
        'Изберете от опциите :'
    ],

    //messages for unknown commands
    unknownCommand : [
        'I don\'t understand you 😓'
        ,
        'Не те разбирам 😓'
    ],

    //messages for successful language change
    languageChanged :[
        'Now we are talking in english! 🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿'
        ,
        'Вече си говорим на български! 🇧🇬'
    ],

    //links to instant view
    //urls with who to use information
    helpUrl : [
        '[click here]' + externalLinks.helpEN
        //(https://github.com/IvanFilipov/ChatBot_FMI_students/blob/master/documentation/how_to_use/user_guide/en_guide.txt)'
        ,
        '[кликнете тук]' + externalLinks.helpBG
        //(https://github.com/IvanFilipov/ChatBot_FMI_students/blob/master/documentation/how_to_use/user_guide/%D0%B1%D0%B3_%D0%BD%D0%B0%D1%80%D1%8A%D1%87%D0%BD%D0%B8%D0%BA.txt)'
    ]
};