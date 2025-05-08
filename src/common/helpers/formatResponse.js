const formatResponse = (
  data,
  hasError = false,
  message = null,
  status = 200
) => ({
  data: hasError ? {} : data,
  meta: {
    has_error: hasError,
    message,
    status,
  },
});

module.exports = { formatResponse };
