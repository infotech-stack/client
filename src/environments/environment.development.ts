
export const environment = {
    production: true,
    name:"(DEV)",
    apiBaseUrl:"http://devUrl.com",
    // EMPLOYEE REGISTER 
    getEmployee:`http://localhost:3000/api/employee-register/get-employee`,
    insertEmployee:`http://localhost:3000/api/employee-register/insert-employee`,
    updateEmployee:`http://localhost:3000/api/employee-register/update-employee`,
    removeEmployee:`http://localhost:3000/api/employee-register/remove-employee`,
    //LOGIN 
    login:`http://localhost:3000/api/employee-register/login`,
    logout:`http://localhost:3000/api/employee-register/logout`,
    //EMPLOYEE ATTENDANCE
    getEmployeeAttendance:`http://localhost:3000/api/employee-register/employee-attendance`,
    //TASK ASSIGN
    assignTask:`http://localhost:3000/api/employee-register/task-assign-to-employee`

};
