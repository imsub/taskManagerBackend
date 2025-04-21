function asyncHandler(requestHandler) {
  return function (req, res, next) {
    Promise.resolve(requestHandler(req, res, next))
      .catch(function (err) {
        next(err);
      })
      .finally(async function () {
        if (req.session) {
          await req.session.endSession();
        }
      });
  };
}

export { asyncHandler };
