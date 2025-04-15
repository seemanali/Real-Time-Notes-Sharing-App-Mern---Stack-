const apiResponse = (res, statusCode, message, data = null, devMessage = null) => {

    res.status(statusCode).json({
        success: true,
        message,
        devMessage,
        data: data || undefined,
    });

}


const apiError = (res, statusCode, userMessage, devMessage = null, data = null) => {

    // statusCode = 200;
    res.status(statusCode).json({
        success: false,
        errorMessage: userMessage,
        DeveloperMessage: devMessage,
        data: data || undefined,
    });
};

export { apiResponse, apiError }