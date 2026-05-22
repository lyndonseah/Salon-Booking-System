function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const isServerError = statusCode >= 500;
  const responseMessage = isServerError ? 'Internal server error' : error.message;
  const responseDetails = isServerError ? undefined : error.details;

  if (isServerError) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message: responseMessage,
      statusCode,
      details: responseDetails
    }
  });
}

module.exports = { errorHandler };
