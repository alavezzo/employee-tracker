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
            updateEmployeeRole()
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



function promptEmployee(employees) {
    return inquirer
         .prompt(
             {
                 type: "list",
                 message: "Select the employee you wish to update",
                 name: "employeeName",
                 choices: employees
             }
         )
 }

function promptName() {
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
            }
        ])
}

function promptDepartment(departments) {
    return inquirer
            .prompt(
                    {
                        type: "list",
                        message: "What is the employee's department?",
                        name: "department",
                        choices: departments
                    }
                )
};


function promptRole(roles) {
    return inquirer
            .prompt(
                {
                    type: "list",
                    message: "What is the employee's role?",
                    name: "role",
                    choices: roles
                }
            )
}

function promptManager(managers) {
    return inquirer
            .prompt([      
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

async function addEmployee() {
        const employee = new Employee;
        const employeeChoices = new EmployeeChoices;
            
        await employeeChoices.getAllDepartments();
        await promptName()
            .then( async function ({ firstName, lastName }) {
                await employee.setName(firstName, lastName)
            });
        await promptDepartment(employeeChoices.departments)
            .then( async function ({ department }) {
                await employee.setDepartmentId(department)
        });
        await employeeChoices.getRolesByDepartment(employee.departmentId);
        await employeeChoices.getManagers();
        await promptRole(employeeChoices.rolesByDepartment)
            .then( async function ({ role }) {
                await employee.setRoleId(role, employee.departmentId)
            });
        await promptManager(employeeChoices.managers)
            .then( async function ({ manager }) {
               if (manager) {
                    await employee.setManagerId(manager)
                    await insertNewEmployee(employee.firstName, employee.lastName, employee.roleId, employee.managerId)
                            .then(() => {
                                console.log(`${employee.firstName} ${employee.lastName} has been added to the employee database!`)
                                init();
                             })
               } else {
                    await insertNewEmployeeNoManager(employee.firstName, employee.lastName, employee.roleId)
                        .then(() => {
                            console.log(`${employee.firstName} ${employee.lastName} has been added to the employee database!`)
                            init();
                        })
                }
            });
    }
    

async function updateEmployeeRole() {
    const employee = new Employee
    const employeeChoices = new EmployeeChoices
    
    
    await employeeChoices.getAllEmployees();
    await promptEmployee(employeeChoices.employees)
        .then( async function ({ employeeName }) {
            await employee.setFullName(employeeName)
        });
    await employeeChoices.getAllDepartments();
    await promptDepartment(employeeChoices.departments)
        .then( async function ({ department }) {
            await employee.setDepartmentId(department)
        });
    await employeeChoices.getRolesByDepartment(employee.departmentId);
    await promptRole(employeeChoices.rolesByDepartment)
        .then( async function ({role}) {
            await employee.setRoleTitle(role)
            await employee.setRoleId(role, employee.departmentId)
        })
    await updateRole(employee.roleId, employee.fullName)
        .then(() => {
            console.log(`Employee's role has been updated to ${employee.roleTitle}`)
            init();
        })
};


async function insertNewEmployee(firstName, lastName, roleId, managerId) {
    await db.promise().query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES('${firstName}','${lastName}',${roleId}, ${managerId})`)
}

async function insertNewEmployeeNoManager(firstName, lastName, roleId) {
    await db.promise().query(`INSERT INTO employees(first_name, last_name, role_id) VALUES('${firstName}','${lastName}',${roleId})`)
}

async function updateRole(roleId, fullName) {
    await db.promise().query(`UPDATE employees SET employees.role_id = ${roleId} WHERE CONCAT_WS(' ', employees.first_name, employees.last_name) = '${fullName}' `)
}

module.exports = init;
