const getAuthTest = (req, res) => {
  res.status(200).send("Hitting Protected Route");
};

module.exports = { getAuthTest };
