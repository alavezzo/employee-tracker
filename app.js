const db = require('./config/connection')
const init = require('./queries/sql')

db.connect(err => {
    if (err) throw err; 
    console.log('Database conected.');
});

init();
