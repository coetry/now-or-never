/* eslint-disable */
const fetch = require("node-fetch");
module.exports = async function(req, res) {
  let path = req.query.path || null;
  if (!path) res.status(400).send("you must specify a path parameter");

  if (path.startsWith("https://")) path = path.slice(8);
  if (path.startsWith("http://")) path = path.slice(7);

  try {
    const server = await fetch(`https://${path}`).then(res => {
      let obj = {};
      res.headers.forEach((v, k) => (obj[k] = v));
      return obj;
    });

    res.status(200).json(server);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};
