const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      require: [true, "Role Name Is Require"],
      unique: [true, "Role Name Already Exists"],
    },
    roleDescription:{
     type:String,
     require:[true, "Role Description Is Require"]
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  },
  {
    timestamps: true,
  }
);

const adminRolesSchema = mongoose.model("admin_roles", rolesSchema);

module.exports = adminRolesSchema;
