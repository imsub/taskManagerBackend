


// Send response on errors
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res,next) => {
    let { statusCode, message ,data} = err;

    res.locals.errorMessage = err.message;

    let response = {
        code: statusCode,
        message,
        data
    }
    if(err.message === "Not found") {
        const {stack, ... newResponse} = response;
        response = newResponse;
    }
    res.status(statusCode).send(response);
};

export default {errorHandler};