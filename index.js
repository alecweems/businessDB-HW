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
connection.connect(function(err) {
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
        choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.businessChoice === "View Departments") {
          showDepartments();
        }
        else if(answer.businessChoice === "View Roles") {
          showRoles();
        } 
        else if(answer.businessChoice === "View Employees") {
            showEmployees();
        }else{
          connection.end();
        }
      });
  }
  function showDepartments(){
    connection.query("SELECT * FROM department", function(err, results) {
        console.table(results);
        start();
    })
  }
  function showRoles(){
    connection.query("SELECT * FROM role", function(err, results) {
        console.table(results);
        start();
    })
  }
  function showEmployees(){
    connection.query("SELECT * FROM employee", function(err, results) {
        console.table(results);
        start();
    })
  }
  function addDepartment(){
      connection.query("INSERT INTO department")
  }
