function errorHandler(err, req, res, next) {
  const statusCode = res.status ? res.status : 500;
  res.status = statusCode;

  if (res.replySent) {
    console.error(err);
    return;
  }
  console.error(err);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "dev" ? err.stack : null,
  });
}

module.exports = errorHandler;
