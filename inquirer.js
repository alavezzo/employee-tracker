const inquirer = require('inquirer')
const db = require('./config/connection')
const cTable = require('console.table')
const EmployeeChoices = require('./lib/EmployeeChoices')
const Employee = require('./lib/Employee')

function init() {
    promptUser()
    .then( ({ start }) => {
        if ( start === 'View All Departments') {
            allDepartments()
        } else if ( start === 'View All Roles') {
            allRoles()
        } else if ( start === 'View All Employees') {
            allEmployees()
        } else if ( start === 'Add a Department') {
            addDepartment()
        } else if ( start === 'Add a Role') {
            addRole()
        } else if ( start === 'Add an Employee') {
           addEmployee()
        } else {
            getEmployeeChoices().then(({ employees, roles, departments}) => {
                updateEmployeeRole(employees, roles, departments)
            })
        }
    })
}


function promptUser() {
    return inquirer.prompt(
        {
            type: "list",
            message: "What would you like to do?",
            name: "start",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee's Role"]
        }
    )
};

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
        .then(({ departmentName }) => {
            addDepartmentQuery(departmentName);
        })
};

function addDepartmentQuery(name) {
    db.promise().query(`INSERT INTO departments(name) VALUES('${name}')`)
        .then(() => {
            console.log(`Added '${name}' to list of departments`);
            init();
        }    
        )
};

function addRole() {
    db.promise().query({sql: "SELECT departments.name FROM departments", rowsAsArray: true})
        .then( ([rows]) => {
            const departments = rows.flat()
            promptAddRole(departments)
        })
}

function promptAddRole(departments) {
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
                        if (salaryInput && !isNaN(salaryInput) ) {
                            return true;
                        } else if (isNaN(salaryInput)) {
                            console.log('Please enter a numerical salary')
                            return false;
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
                    choices: departments
                }
            ])
            .then( ({ roleTitle, salary, roleDepartment }) => {
                let departmentId = 1 + departments.findIndex(x => x === roleDepartment)
                addRoleQuery(roleTitle, salary, departmentId)
            })
};

function addRoleQuery(title, salary, department) {
    db.promise().query(`INSERT INTO roles(title, salary, department_id) VALUES('${title}',${salary},${department})`)
        .then(() => {
            console.log(`Added '${title}' to list of roles`);
            init();
        }    
        )
};


async function addEmployee() {
    const employee = new Employee;
    const employeeChoices = new EmployeeChoices;
        
    await employeeChoices.getAllDepartments();
    await promptNameAndDepartment(employeeChoices.departments)
        .then( async function ({ firstName, lastName, department }) {
            await employee.setName(firstName, lastName)
            await employee.setDepartmentId(department)
        });
    await employeeChoices.getRolesByDepartment(employee.departmentId);
    await employeeChoices.getManagers();
    await promptRoleAndManager(employeeChoices.rolesByDepartment, employeeChoices.managers)
        .then( async function ({ role, manager }) {
           await employee.setRoleId(role, employee.departmentId)
           if (manager) {
                await employee.setManagerId(manager)
                await addNewEmployee(employee.firstName, employee.lastName, employee.roleId, employee.managerId)
                        .then(() => {
                            console.log(`${employee.firstName} ${employee.lastName} has been added to the employee database!`)
                            init();
                         })
           } else {
                await addNewEmployeeNoManager(employee.firstName, employee.lastName, employee.roleId)
                    .then(() => {
                        console.log(`${employee.firstName} ${employee.lastName} has been added to the employee database!`)
                        init();
                    })
            }
        });
}


async function addNewEmployee(firstName, lastName, roleId, managerId) {
    await db.promise().query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES('${firstName}','${lastName}',${roleId}, ${managerId})`)
}

async function addNewEmployeeNoManager(firstName, lastName, roleId) {
    await db.promise().query(`INSERT INTO employees(first_name, last_name, role_id) VALUES('${firstName}','${lastName}',${roleId})`)
}


function promptNameAndDepartment(departments) {
    return inquirer
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
                message: "What is the employee's department?",
                name: "department",
                choices: departments
            }
        ])
}

function promptRoleAndManager (roles, managers) {
    return inquirer
        .prompt([
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: roles
            },
            {
                type: 'confirm',
                name: 'confirmManager',
                message: 'Does this employee report to a manager?',
                default: false,
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: managers,
                when: ({confirmManager}) => {
                    if (confirmManager) {
                    return true;
                    } else {
                        return false
                    }
                } 
            }
        ])
    };


async function updateEmployee(employeeId, role, departmentId) {
    console.log(role)
    console.log(departmentId)
    const roleId = new RoleId
    await roleId.getRoleIdFromTitleAndDepartment(role, departmentId)
    if (!roleId.roleId) {
        console.log('This role does not exist for this department!')
        init();
    }
    await db.promise().query(`UPDATE employees SET employees.role_id = ${roleId.roleId} WHERE employees.id = ${employeeId}`)
}

function updateEmployeeRole(employees, roles, departments) {
   inquirer
    .prompt([
        {
            type: "list",
            message: "Select the employee you wish to update",
            name: "employee",
            choices: employees
        },
        {
            type: "list",
            message: "What is the employee's new role?",
            name: "newRole",
            choices: roles
        },
        {
            type: "list",
            message: "Which department is this role under?",
            name: "department",
            choices: departments
        }
    ]).then( ({ employee, newRole, department }) => {
        let departmentId = 1 + departments.findIndex(x => x === department)
        let employeeId = 1 + employees.findIndex(x => x === employee)
        updateEmployee(employeeId, newRole, departmentId).then(() => {
                console.log(`Added '${employee}' to list of employees`);
                init();
            })   
    });
}




// const updateEmployee = `UPDATE employee SET role_id = ${} WHERE id = ${}`

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

module.exports = init;
// SELECT DISTINCT roles.title FROM roles UNION SELECT departments.name FROM departments UNION SELECT CONCAT_WS(' ', employees.first_name, employees.last_name) FROM employees INNER JOIN roles ON employees.role_id = roles.id WHERE roles.title LIKE '%manager%'

// SELECT roles.id FROM roles WHERE roles.title LIKE '%manager%' AND roles.department_id = 7;
// SELECT CONCAT_WS(' ', employees.first_name, employees.last_name) WHERE roles.title LIKE '%manager%', roles.title FROM employees JOIN roles ON employees.role_id = roles.id