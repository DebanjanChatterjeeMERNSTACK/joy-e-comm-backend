const vendorSchema = require("../model/vendorScheme");

const addVendor = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { companyName, email, phoneNumber, address, gstNumber } = req.body;

    if (
      !companyName ||
      !email ||
      !adminId ||
      !phoneNumber ||
      !address ||
      !gstNumber
    ) {
      return res.send({
        mess: "error",
        status: 400,
        text: "Please Fill All Filed",
      });
    }

    const data = await vendorSchema({
      adminId: adminId,
      email: email,
      companyName: companyName,
      phoneNumber: phoneNumber,
      address: address,
      gstNumber: gstNumber,
    });
    data.save().then(() => {
      return res.send({
        mess: "success",
        status: 200,
        text: "Vendor Added Successfully",
        data,
      });
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const getVendor = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Query params
    const { search, page = 1, limit  } = req.query;

    // 1️⃣ Build query
    let query = { adminId };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { gstNumber: { $regex: search, $options: "i" } },
      ];
    }

    // 2️⃣ Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 3️⃣ Fetch vendors
    const vendors = await vendorSchema
      .find(query)
      .populate("adminId", "storeName email phoneNumber address")
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await vendorSchema.countDocuments(query);

    return res.send({
      mess: "success",
      status: 200,
      text: "Vendors fetched successfully",
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page: Number(page),
      limit: Number(limit),
      data: vendors,
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};


const updateVendor = async (req, res) => {
  try {
    const id = req.params.id;
    const { companyName, email, phoneNumber, address, gstNumber } = req.body;
    const updateData = await vendorSchema.findOneAndUpdate(
      { _id: id },
      { companyName, email, phoneNumber, address, gstNumber }
    );

    if (updateData) {
      return res.send({
        mess: "success",
        status: 200,
        text: "Update Successfully",
      });
    } else {
      return res.send({
        mess: "success",
        status: 400,
        text: "Update Is Not Successfully",
      });
    }
  } catch (error) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await vendorSchema.findOneAndDelete({ _id: id }, { _id: id });

    if (data) {
      return res.send({
        mess: "success",
        status: 200,
        text: "Delete Successfully",
      });
    }
  } catch (err) {
      return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const getVendorSearch = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Query params
    const {search} = req.query;

    // 1️⃣ Build query
    let query = { adminId };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { gstNumber: { $regex: search, $options: "i" } },
      ];
    }

    // 2️⃣ Pagination
  

    // 3️⃣ Fetch vendors
    const vendors = await vendorSchema
      .find(query)
      .populate("adminId", "storeName email phoneNumber address")

    

    return res.send({
      mess: "success",
      status: 200,
      text: "Vendors fetched successfully",
      data: vendors,
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

module.exports = {
  addVendor,
  getVendor,
  updateVendor,
  deleteVendor,
  getVendorSearch
};
