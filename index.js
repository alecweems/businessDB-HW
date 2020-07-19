// * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles


//7 different options
// ask the user , which of those 7 yould you like to do.
// option 1 - view department   
//    select name from departments
//    dislay to user
// option 2 - view roles
//    select title, salary from roles
//    display to user
// option 3 view employees
//    select first_name, last_name, from employees 
//    display all employees
// option 4 add department
//     ask the user for a department name
//     insert the new department in the departments table
// option 5 add role
//     select id, name from departments
//     ask the user for which department (in order to get the id)
//     ask the user for a tile, salary
//     add the title, salary,  department id to the role table 
// option 6 add employee
//     select id, title from role
//     ask user which role (to get the role id)
//     add user for first_name, last_name
//     add first_name, last_name, role_id to employee table
// option 7 update employee role
//     select first_name, last_name from employee
//     ask user which employee to update
//     select title from role table (provides a list of roles)
//     ask user what is the new role 
//     update the role of the employee selected

var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "businessDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "businessChoice",
            type: "list",
            message: "Which would you like to do?",
            choices: ["View Departments", "View Roles", "View all Employees", "Add Role", "Add Employee", "Update Employee Role", "Delete Employee"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.businessChoice === "View Departments") {
                showDepartments();
            }
            else if (answer.businessChoice === "View Roles") {
                showRoles();
            }
            else if (answer.businessChoice === "View all Employees") {
                showEmployees();

            }
            else if (answer.businessChoice === "Add Employee") {
                addEmployee();
            } else if(answer.businessChoice === "Update Employee Role") {
                updateEmployeeRole();
            } else if (answer.businessChoice === "Delete Employee") {
                removeEmployees();
            }
                
                else {
                connection.end();
            }
        });
}
function showDepartments() {
    connection.query("SELECT * FROM department", function (err, results) {
        console.table(results);
        start();
    })
}
function showRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        console.table(results);
        start();
    })
}
function showEmployees() {
    connection.query("SELECT * FROM employee", function (err, results) {
        console.table(results);
        start();
    })
}



// Having issues with this and the dept_id
function addEmployee() {
    console.log("Adding an Employee!");

    var query = `SELECT role.id, role.title, role.salary FROM role`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const roleChoices = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));

        console.table(res);
        console.log("RoleToInsert!");

        promptInsert(roleChoices);
    });
}

function promptInsert(roleChoices) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the employees first name?',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the employees last name?',
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'What is the employees role?',
                choices: roleChoices,
            },
        ])
        .then(function(answer){
            console.log(answer);

            var query = `INSERT INTO employee SET ?`;
            connection.query(
                query,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id,
                },
                function(err, res){
                    if (err) throw err;

                    console.table(res);
                    console.log(res.insertedRows + 'inserted successfully! \n');

                    start();
                }
            )
        })
};

function removeEmployees() {
	console.log('Deleting an employee');

	var query = `SELECT e.id, e.first_name, e.last_name
      FROM employee e`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
			value: id,
			name: `${id} ${first_name} ${last_name}`,
		}));

		console.table(res);
		console.log('ArrayToDelete!\n');

		promptDelete(deleteEmployeeChoices);
	});
}

function promptDelete(deleteEmployeeChoices) {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'employeeId',
				message: 'Which employee do you want to remove?',
				choices: deleteEmployeeChoices,
			},
		])
		.then(function (answer) {
			var query = `DELETE FROM employee WHERE ?`;
			// when finished prompting, insert a new item into the db with that info
			connection.query(query, { id: answer.employeeId }, function (err, res) {
				if (err) throw err;

				console.table(res);
				console.log(res.affectedRows + 'Deleted!\n');

				start();
			});
		});
}

function updateEmployeeRole() {
	employeeArray();
}

function employeeArray() {
	console.log('Updating an employee');

	var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		const employeeChoices = res.map(({ id, first_name, last_name }) => ({
			value: id,
			name: `${first_name} ${last_name}`,
		}));

		console.table(res);
		console.log('employeeArray To Update!\n');

		roleArray(employeeChoices);
	});
}

function roleArray(employeeChoices) {
	console.log('Updating an role');

	var query = `SELECT r.id, r.title, r.salary
  FROM role r`;
	let roleChoices;

	connection.query(query, function (err, res) {
		if (err) throw err;

		roleChoices = res.map(({ id, title, salary }) => ({
			value: id,
			title: `${title}`,
			salary: `${salary}`,
		}));

		console.table(res);
		console.log('roleArray to Update!\n');

		promptEmployeeRole(employeeChoices, roleChoices);
	});
}

function promptEmployeeRole(employeeChoices, roleChoices) {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'employeeId',
				message: 'Which employee do you want to set with the role?',
				choices: employeeChoices,
			},
			{
				type: 'list',
				name: 'roleId',
				message: 'Which role do you want to update?',
				choices: roleChoices,
			},
		])
		.then(function (answer) {
			var query = `UPDATE employee SET role_id = ? WHERE id = ?`;
			connection.query(query, [answer.roleId, answer.employeeId], function (
				err,
				res
			) {
				if (err) throw err;

				console.table(res);
				console.log(res.affectedRows + 'Updated successfully!');

				start();
			});
		});
}