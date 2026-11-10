// Junta os posts escritos à mão (posts.js) com as matérias automáticas (noticias.json).
const fs = require('fs');
const path = require('path');
const ARQ = path.join(__dirname, 'noticias.json');
const noticias = () => (fs.existsSync(ARQ) ? JSON.parse(fs.readFileSync(ARQ, 'utf8')) : []);
module.exports = () => [...noticias(), ...require('./posts.js')];
module.exports.ARQ = ARQ;
module.exports.noticias = noticias;
