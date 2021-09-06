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
            allEmployees()
        }
    })
}


function allDepartments() {
    db.promise().query("SELECT * FROM departments")
        .then( ([rows]) => {
            console.log(cTable.getTable(rows));
            init()
        });
    };

function allRoles() {
    db.promise().query("SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id")
        .then( ([rows]) => {
            console.log(cTable.getTable(rows));
            init()
        });
    };

function allEmployees() {
    db.promise().query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT_WS(' ', IFNULL(manager.first_name,''), IFNULL(manager.last_name,'')) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id")
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

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

module.exports = init;