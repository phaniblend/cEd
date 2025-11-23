export function handleError(res, message, status = 500) {
  return res.status(status).json({
    success: false,
    error: message
  });
}
