// eslint-disable-next-line no-unused-vars
export default function errorMiddleware(err, req, res, next) {
  let status = err.status || 500;

  res.status(status);

  // eslint-disable-next-line no-console
  console.log(err);

  res.send({
    status,
    message: err.message
  });
}
