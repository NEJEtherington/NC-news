const { fetchUserByUsername } = require("../models/users_model");

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(userArr => {
      const [user] = userArr;
      if (!userArr.length) {
        return Promise.reject({
          status: 404,
          msg: "User not found"
        });
      } else {
        return res.status(200).send({ user });
      }
    })
    .catch(next);
};

module.exports = { getUserByUsername };
