const { TIME_CAPSULE_BASE_URL } = require("../config");

module.exports = function generateEmailVerificationURL({
  userId,
  emailVerificationToken,
}) {
  const queryParams = URLSearchParams({ emailVerificationToken });
  return `${TIME_CAPSULE_BASE_URL}/users/${id}/verify?${queryParams.toString()}`;
};
