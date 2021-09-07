const db = require('../config/connection')

class NewEmployee {
    constructor () {
        this
        this.roleId
    }

    getRoleId(role, departmentId) {
    return db.promise().query({sql: `SELECT roles.id FROM roles WHERE roles.title LIKE '%${role}%' AND roles.department_id = ${departmentId}`, rowsAsArray: true})
                .then(([rows]) => {
                    const roleId = rows.flat()[0]
                    this.roleId = roleId
                });
            }
}

module.exports = NewEmployee