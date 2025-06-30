const jwt = require("jsonwebtoken");
const dotenv=require("dotenv")
dotenv.config()

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")

  if (!token) return res.send({ mess: "error", status: 400, text: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWTKEY);
    req.user = decoded;
    next();
  } catch (err) {
  return  res.send({ mess: "error", status: 400, text: err.message });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.send({ mess: "error", status: 400, text: "Forbidden"});
    }
    next();
  };
};


module.exports={authenticate,authorize}