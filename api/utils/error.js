// Error handler method for whem we type the username and password and email
export const errorHandler=(statusCode,message)=>{
    const error= new Error();
    error.statusCode=statusCode;
    error.message=message;
     return error
}