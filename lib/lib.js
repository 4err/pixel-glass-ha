var fs = require('fs');
const replace = require('replace-in-file');
const node_path = process.env.APPDATA + '\\npm\\node_modules\\pixel-glass-ha\\httpdocs\\';

var questions = [
    {
        type: 'input',
        name: 'path',
        message: 'Build root?',
        default: './'
    },
    {
        type: 'list',
        name: 'project',
        message: 'Build root?',
        choices: ['Pink', 'Sedona', 'Mishka'],
        filter: function (val) {
            return val.toLowerCase();
        }
    },
    // {
    //     type: 'input',
    //     name: 'mobile-width',
    //     message: 'Mobile width?',
    //     when: function (answers) {
    //         return answers.project == 'own project';
    //     },
    //     validate: function (value) {
    //         var valid = !isNaN(parseFloat(value));
    //         return valid || 'Please enter a number';
    //     },
    //     filter: Number
    // },
    // {
    //     type: 'input',
    //     name: 'tablet-width',
    //     message: 'Tablet width?',
    //     when: function (answers) {
    //         return answers.project == 'own project';
    //     },
    //     validate: function (value) {
    //         var valid = !isNaN(parseFloat(value));
    //         return valid || 'Please enter a number';
    //     },
    //     filter: Number
    // },
    // {
    //     type: 'input',
    //     name: 'desktop-width',
    //     message: 'Desktop width?',
    //     when: function (answers) {
    //         return answers.project == 'own project';
    //     },
    //     validate: function (value) {
    //         var valid = !isNaN(parseFloat(value));
    //         return valid || 'Please enter a number';
    //     },
    //     filter: Number
    // },
    {
        type: 'input',
        name: 'preview_root',
        message: 'Previews root?',
        default: './preview/'
    }
];

function getData(answers) {
    var params = {
        preview_root: answers.preview_root,
        tablet_name: '',
        desktop_name: '',
        mobile_width: '',
        tablet_width: '',
        desktop_width: ''
    };

    var makets = [];

    switch (answers.project) {
        case 'pink':
            params.tablet_width = 660;
            params.desktop_width = 960;
            makets = ['index', 'form', 'photo'];
            break;
        case 'sedona':
            params.tablet_width = 768;
            params.desktop_width = 1200;
            makets = ['index', 'form', 'photo'];
            break;
        case 'mishka':
            params.tablet_width = 768;
            params.desktop_width = 1150;
            makets = ['index', 'form', 'catalog'];
            break;
    }
    var data = [];
    for (var i=0;i<makets.length;i++){

        var text = "<!-- Pixel Glass --><style> " +
            "HTML { " +
            "background-repeat: no-repeat;" +
            "background-position:  50% 0;" +
            "background-image: url( '"+ answers.preview_root+ answers.project+"-"+makets[i]+"-mobile.jpg"+"' );" +
            "}" +
            " /* Планшет */ " +
            "@media ( min-width: "+params.tablet_width+"px ) { " +
            "HTML {" +
            "background-image: url( '"+ answers.preview_root+ answers.project+"-"+makets[i]+"-tablet.jpg"+"' ); } } " +
            "/* Десктоп */ " +
            "@media ( min-width: "+params.desktop_width+"px ) { " +
            "HTML { " +
            "background-image: url( '"+ answers.preview_root+ answers.project+"-"+makets[i]+"-desktop.jpg"+"' ); } } " +
            "</style> " +
            "<link href='"+node_path+"styles.css' rel='stylesheet'>"+
            "<script src='"+node_path+"script.js'></script>"+
            "<!-- // Pixel Glass -->" +
            "</head>";

        data[makets[i]] = text;
    }

    return data;
}

function getFiles(answers) {
    fs.readdir(answers.path, function (err, files) {

        if (!files.length) {
            return console.log('There is no HTML files');
        }

        console.log('Start working with files');
        console.log('Loading params');

        var data  = getData(answers);

        console.log('Params loaded');

        files
            .filter(function (file) {
                return file.substr(-5) === '.html';
            })
            .forEach(function (file) {
                var file_name = file.slice(0, -5);

                var options = {
                    files: answers.path + file,
                    from: '</head>',
                    to: data[file_name],
                };
                replace(options, function (error, changes) {
                    if (error) {
                        return console.error('Error occurred:', error);
                    }
                    console.log('Modified file:', changes.join(', '));
                });
            });
    });
}

module.exports.questions = questions;
module.exports.getFiles = getFiles;