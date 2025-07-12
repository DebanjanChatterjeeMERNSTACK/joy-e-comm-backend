const express =require("express");
const route =express.Router();
const {authenticate,authorize} =require("../middleware/authMiddleware")
const adminRole=require("../controller/adminRolesController")

route.post("/admin_add_role",authenticate,authorize(["superadmin"]),adminRole.addRoles)
route.post("/admin_get_role",authenticate,authorize(["superadmin"]),adminRole.getRoles)
route.post("/admin_delete_role/:id",authenticate,authorize(["superadmin"]),adminRole.deleteRoles)

module.exports=route