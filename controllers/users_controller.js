const { fetchUserByUsername } = require("../models/users_model");

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({
          status: 400,
          msg: "Invalid username!"
        });
      } else {
        return res.status(200).send({ user: user });
      }
    })
    .catch(next);
};

module.exports = { getUserByUsername };
