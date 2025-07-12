const jwt = require("jsonwebtoken");
const dotenv=require("dotenv")
dotenv.config()

const authenticate = (req, res) => {
  const token = req.header("Authorization").split(" ")[1]  || req.body.Authorization.split(" ")[1];

  if (!token) return res.send({ mess: "error", status: 400, text: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWTKEY);
  return  res.send({ mess: "success", status: 200, text: "Token Verify Successfull" , data:decoded});
    
  } catch (err) {
  return  res.send({ mess: "error", status: 400, text: err.message });
  }
};




module.exports={authenticate}