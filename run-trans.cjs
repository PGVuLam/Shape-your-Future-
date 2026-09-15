const fs = require('fs');
const translate = require('translate-google');

const careersFile = './src/data/careers.ts';

// We need to parse careers.ts. It's a TS file exporting an array.
// To easily modify it, we can write a script that imports it (or reads it) and writes it back.
// I will use TSX to run the translation script.
