const db = require('./config/connection')
const init = require('./inquirer')

db.connect(err => {
    if (err) throw err; 
});

init();
