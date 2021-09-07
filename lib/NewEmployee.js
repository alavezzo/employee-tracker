const db = require('../config/connection')


class newEmployee {
    constructor() {
        this.roles
        this.departments
        this.managers
    }

    defineRoles() {
        return db.promise().query({ sql: "SELECT DISTINCT roles.title FROM roles", rowsAsArray: true })
            .then( ([rows]) => {
                const roles = rows.flat()
                this.roles = roles
            });
    };
    
    defineDepartments() {
        return db.promise().query({ sql: "SELECT departments.name FROM departments", rowsAsArray: true })
        .then( ([rows]) => {
            const departments = rows.flat()
            this.departments = departments
        })
    };

    defineManagers() {
        return db.promise().query({ sql: "SELECT CONCAT_WS(' ', employees.first_name, employees.last_name) FROM employees INNER JOIN roles ON employees.role_id = roles.id WHERE roles.title LIKE '%manager%'", rowsAsArray: true })
        .then( ([rows]) => {
            const managers = rows.flat()
            this.managers = managers
        })
    };
}

module.exports = newEmployee