exports.asynchandeler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};
