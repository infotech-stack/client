
export const environment = {
    production: true,
    name:"(DEV)",
    apiBaseUrl:"http://devUrl.com",
    // EMPLOYEE REGISTER 
    getAllEmployee:`http://localhost:3000/api/employee-register/get-all-employee`,
    getEmployee:`http://localhost:3000/api/employee-register/get-employee`,
    insertEmployee:`http://localhost:3000/api/employee-register/insert-employee`,
    updateEmployee:`http://localhost:3000/api/employee-register/update-employee`,
    removeEmployee:`http://localhost:3000/api/employee-register/remove-employee`,
    getEmployeeRole:`http://localhost:3000/api/employee-register/get-employee-role`,
    getEmployeeAccess:`http://localhost:3000/api/employee-register/get-employee-access`,
    employeeForMessage:`http://localhost:3000/api/employee-register/employee-for-message`,
    //LOGIN 
    login:`http://localhost:3000/api/employee-register/login`,
    logout:`http://localhost:3000/api/employee-register/logout`,
    //EMPLOYEE ATTENDANCE
    getEmployeeAttendance:`http://localhost:3000/api/employee-register/employee-attendance`,
    employeeFilter:`http://localhost:3000/api/employee-register/employee-filter`,
    //TASK ASSIGN
    gettaskByRole:`http://localhost:3000/api/employee-register/get-Tasks-ByRole`,
    assignTask:`http://localhost:3000/api/employee-register/task-assign-to-employee`,
    updatetask:`http://localhost:3000/api/employee-register/update-task`,
    deleteTask:`http://localhost:3000/api/employee-register/delete-task`,
    //EMPLOYEE SEARCH
    employeeSearchById:`http://localhost:3000/api/employee-register/search-employee-by-id`,
    //TASK REPORTS
    taskReports:`http://localhost:3000/api/employee-register/task-reports`,
    //MESSAGE
    uploadFile:`http://localhost:3000/api/employee-register/upload`,
    postMessage:`http://localhost:3000/api/employee-register/post-message`,
    getMessage:`http://localhost:3000/api/employee-register/get-message`,
    //WEBSOCKET URL
    wsUrl:`http://localhost:4000/messages`,
    postWebSocketMesage:`http://localhost:4000/messages/post-message`,      
    getWebSocketMesage:`http://localhost:4000/messages/get-message`,
    updateWebsocketMessage:`http://localhost:4000/messages/update-message`,
    deleteWebsocketMessage:`http://localhost:4000/messages/delete-message`,
    websocketUploadFile:`http://localhost:4000/messages/upload-files`,
    websocketDownloadFile:`http://localhost:4000/messages/download-files`,
    //SETTINGS
    resetPassword:`http://localhost:3000/api/employee-register/reset-password`,

};
