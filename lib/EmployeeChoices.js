const db = require('../config/connection')


class EmployeeChoices {
    constructor() {
        this.departments
        this.departmentId
        this.roles
        this.rolesByDepartment
        this.managers
        this.employees
    }

   
    
    getAllDepartments() {
        return db.promise().query({ sql: "SELECT departments.name FROM departments", rowsAsArray: true })
            .then( ([rows]) => {
                const departments = rows.flat()
                this.departments = departments
            })
    };
    

    getAllRoles() {
        return db.promise().query({ sql: "SELECT DISTINCT roles.title FROM roles", rowsAsArray: true })
            .then( ([rows]) => {
                const roles = rows.flat()
                this.roles = roles
            });
    };

    getRolesByDepartment(departmentId) {
        return db.promise().query({ sql: `SELECT roles.title FROM roles WHERE roles.department_id = ${departmentId}`, rowsAsArray: true })
            .then( ([rows]) => {
                const roles = rows.flat()
                this.rolesByDepartment = roles
            });
    }

    getManagers() {
        return db.promise().query({ sql: "SELECT CONCAT_WS(' ', employees.first_name, employees.last_name) FROM employees INNER JOIN roles ON employees.role_id = roles.id WHERE roles.title LIKE '%manager%'", rowsAsArray: true })
        .then( ([rows]) => {
            const managers = rows.flat()
            this.managers = managers
        })
    };

    defineEmployees() {
        return db.promise().query({ sql: "SELECT CONCAT_WS(' ', employees.first_name, employees.last_name) FROM employees", rowsAsArray: true })
        .then( ([rows]) => {
            const employees = rows.flat()
            this.employees = employees
        })
    };
}

module.exports = EmployeeChoices