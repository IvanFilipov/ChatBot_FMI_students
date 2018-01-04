module.exports = {


    //will be used to remember language settings
    usersStates : {},
    
    //will hold chatId -> correct answer
    //map information for Test option 
    callBacks : {},

    //questions TODO : will not be a constant, will be taken from file
    questions : [
        {
            text : 'Memory leak is :',
            answerOptions : [
                'someone, how forgets a lot',
                'a dynamic allocated memory without a pointer to it',
                'C/C++ lack of garbage collector',
                'a null pointer'
            ],
            correctAnswer : 1
        }
    ],

    //language number constants
    BG : 1,
    EN : 0,
    
    //all supported commands
    commandList : ['/lang bg' , '/lang en', '/start', '/help'],


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
                            url: 'https://docs.google.com/document/d/1UaaONmxmHAJXpL4RcGcgMSptBVLR4guacb45CdYN770'
                        },
                        {
                            text: 'staff & contacts',
                            url: 'https://docs.google.com/document/d/1UaaONmxmHAJXpL4RcGcgMSptBVLR4guacb45CdYN770'
                        }
                    ],
                    [
                        {
                            text: 'books & links',
                            url: 'https://docs.google.com/document/d/1Q9P_YwHMFULFn84VK-VLggO0JOmGs3Cn-B9klSmIrJs'
                        },
                        {
                            text: 'syllabus',
                            url: 'https://docs.google.com/document/d/1tKRmULwk2tb_iKXIGD3jDqSNRlFidCDBv8WipIGMzyo'
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
    choseOne : [

        'Chose one from below :'
        ,
        'Изберете едно :'
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
    //urls with how to use information
    helpUrl : [
        '[click here](http://telegra.ph/User-guide-how-to-use-the-chatbot-01-03)'
        //(https://github.com/IvanFilipov/ChatBot_FMI_students/blob/master/documentation/how_to_use/user_guide/en_guide.txt)'
        ,
        '[кликнете тук](http://telegra.ph/Narchnik-za-izpolzvane-na-bota-01-03)'
        //(https://github.com/IvanFilipov/ChatBot_FMI_students/blob/master/documentation/how_to_use/user_guide/%D0%B1%D0%B3_%D0%BD%D0%B0%D1%80%D1%8A%D1%87%D0%BD%D0%B8%D0%BA.txt)'
    ]



};