const db = require('../config/connection')

class Employee {
    constructor () {
        this.firstName;
        this.lastName;
        this.departmentId;
        this.roleId;
        this.managerId
    };
    
    setName(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName
    };

    setDepartmentId(departmentName) {
        return db.promise().query({ sql: `SELECT departments.id FROM departments WHERE departments.name = '${departmentName}'`, rowsAsArray: true })
            .then( ([rows]) =>{
                const department = rows.flat()[0];
                this.departmentId = department;
            })
    };

    setRoleId(title, departmentId) {
        return db.promise().query({ sql: `SELECT roles.id FROM roles WHERE roles.title = '${title}' AND roles.department_id = ${departmentId}`, rowsAsArray: true })
                .then(([rows]) => {
                    const roleId = rows.flat()[0]
                    this.roleId = roleId
                });
    };

    setManagerId(name) {
        console.log(name)
        return db.promise().query({ sql: `Select employees.id FROM employees WHERE CONCAT_WS(' ', employees.first_name, employees.last_name) = '${name}'`, rowsAsArray: true })
        .then(([rows]) => {
            const managerId = rows.flat()[0]
            this.managerId = managerId
        });
    }

}

module.exports = Employee