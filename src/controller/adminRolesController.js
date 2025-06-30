const adminRoleSchema = require("../model/adminRolesSchema");

const addRoles = async (req, res) => {
  const { roleName, roleDescription } = req.body;

  try {
    const roledata = await adminRoleSchema.findOne({ roleName });

    if (roledata) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Role Name Already Exists",
      });
    }

    if (!roleName || !roleDescription) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Please Send The Valid Infomation",
      });
    }

    const data = await adminRoleSchema({
      roleName,
      roleDescription,
    });
    data.save().then(() => {
      return res.send({
        mess: "success",
        status: 200,
        text: "Role Added Successfully",
      });
    });
  } catch (err) {
    return res.send({ mess: "error", status: 400, text: err.message });
  }
};


const getRoles = async (req, res) => {
  try {
    const data = await adminRoleSchema.find({ isDeleted:false });
    if (data) {
      return res.send({
        mess: "success",
        status: 200,
        text: "Role Fetch Successfully",
        contant: data,
      });
    }
  } catch (err) {
    return res.send({ mess: "error", status: 400, text: err.message });
  }
};



const deleteRoles = async (req, res) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Invalid Information",
      });
    }
    const data = await adminRoleSchema.findOneAndUpdate(
      { _id: id },
      { isDeleted: true }
    );
   
    if(data){
        return res.send({
        mess: "success",
        status: 200,
        text: "Role Deleted Successfully",
        contant: data,
      });
    }

  } catch (error) {
    return res.send({ mess: "error", status: 400, text: error.message });
  }
};


module.exports = { addRoles, getRoles, deleteRoles };
