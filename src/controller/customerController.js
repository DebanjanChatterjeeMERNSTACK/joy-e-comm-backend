const customerSchema = require("../model/customerSchema");



const getCustomer = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Query params
    const { search, page = 1, limit=5  } = req.query;

    // 1️⃣ Build query
    let query = { adminId };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    // 2️⃣ Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 3️⃣ Fetch vendors
    const customers = await customerSchema
      .find(query)
      .populate("adminId", "storeName email phoneNumber address")
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await customerSchema.countDocuments(query);

    return res.send({
      mess: "success",
      status: 200,
      text: "customer fetched successfully",
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page: Number(page),
      limit: Number(limit),
      data: customers,
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
  getCustomer,
};
