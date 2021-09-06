const inquirer = require('inquirer')
const db = require('../config/connection')
const cTable = require('console.table')


function addDepartment() {
    inquirer
    .prompt({
            type: "input",
            message: "Enter the department name",
            name: "departmentName",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please provide the department name")
                    return false;
                }
           }
        })
    };

function addRole() {
    inquirer
        .prompt([
        {
            type: "input",
            message: "Enter title of role",
            name: "roleTitle",
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    console.log("Please provide the role title")
                    return false;
                }
            },
        },
        {
            type: "input",
            message: "Enter the starting salary for this role",
            name: "salary",
            validate: salaryInput => {
                if (salaryInput) {
                    return true;
                } else {
                    console.log("Please provide the starting salary")
                    return false;
                }
        
            }
        },
        {
            type: "list",
            message: "What department is the role under?",
            name: "roleDepartment",
            choices: [],
        }
    ])
};

function addEmployee() {
    inquirer
        .prompt([
        {
            type: "input",
            message: "Enter the employee's first name",
            name: "firstName",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please provide the employee's name")
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "Enter the employee's last name",
            name: "lastName",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please provide the employee's name")
                    return false;
                }
            }
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: []
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            name: "manager",
            choices: []
        }
    ]);
};

function updateEmployee() {
    inquirer
        .prompt([
        {
            type: ''

        },
        {
            type: ''
        }
    ])
}

function init() {
    inquirer
        .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "start",
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee']
        }
    ]).then( ({ start }) => {
        if ( start === 'View All Departments') {
            allDepartments()
        } else if ( start === 'View All Roles') {
            allRoles()
        } else if ( start === 'View All Employees') {
            allEmployess()
        }
    })
}


function allDepartments() {
    db.promise().query("SELECT * FROM department")
        .then( ([rows]) => {
            console.log(cTable.getTable(rows));
            init()
        });
    };

function allRoles() {
    db.promise().query("SELECT * FROM role")
        .then( ([rows]) => {
            console.log(cTable.getTable(rows));
            init()
        });
    };

function allEmployess() {
    db.promise().query("SELECT * FROM employee")
        .then( ([rows]) => {
            console.log(cTable.getTable(rows));
            init()
        });
    };

// const allDepartments = ;
// const allRoles = 'SELECT * FROM role';
// const allEmployees = 'SELECT * FROM employee';
// const addDepartment = `INSERT INTO department(name) VALUES(${})`; 
// const addRoles = `INSERT INTO role((title, salary, department_id)) VALUES(${},${},${})`;
// const addEmployee = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(${},${},${})`;
// const updateEmployee = `UPDATE employee SET role_id = ${} WHERE id = ${}`

module.exports = init;