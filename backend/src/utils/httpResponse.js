export function ok(res, data = {}) {
  return res.status(200).json({
    success: true,
    data
  });
}

export function fail(res, message = "Something went wrong", status = 400) {
  return res.status(status).json({
    success: false,
    error: message
  });
}
