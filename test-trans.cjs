const translate = require('translate-google');
translate('Hello world', {to: 'vi'}).then(console.log).catch(console.error);
