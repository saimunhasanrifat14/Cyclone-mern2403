const { customError } = require("../utils/customError");

const authorize = (resource, action) => {
  return async (req, res, next) => {
    try {
      const findPermission = req.user.permissions.find(
        (permission) =>
          permission.permissionId.name == resource &&
          permission.actions.includes(action)
      );

      if (!findPermission) {
        throw new customError(401, "unatuhorized access !!  ");
      }
      req.permission = findPermission;
      next();
    } catch (error) {
      throw new customError(401, "unatuhorized access !! " + error);
    }
  };
};

module.exports = { authorize };
