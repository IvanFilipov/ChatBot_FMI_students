module.exports = {


    //will be used to remember language settings
    usersStates : {},
    
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
                    ['Events', 'Personal info'],
                    ['General information'],
                    ['Test my knowledge']
                ]
            }
        
        },

        {

        'reply_markup': {
            
                    'keyboard': [
                        ['Новини'],
                        ['Събития', 'Персонална инфо'],
                        ['Обща информация'],
                        ['Тествай познанията ми']
                    ]
                }
            }
    ],

    unknownCommand : [
        'I don\'t understand you 😓'
        ,
        'Не те разбирам 😓'
    ],

    languageChanged :[
        'Now we are talking in english! 🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿'
        ,
        'Вече си говорим на български! 🇧🇬'
    ],

    helpUrl : [
        '[inline URL](https://github.com/IvanFilipov/ChatBot_FMI_students/blob/master/documentation/how_to_use/user_guide/en_guide.txt)'
        ,
        '[inline URL](https://github.com/IvanFilipov/ChatBot_FMI_students/blob/master/documentation/how_to_use/user_guide/%D0%B1%D0%B3_%D0%BD%D0%B0%D1%80%D1%8A%D1%87%D0%BD%D0%B8%D0%BA.txt)'
    ]

};