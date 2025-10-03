const Product = require("../model/productSchema");

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    const adminId = req.user._id;
    const product = new Product({ ...req.body, adminId });
    const saved = await product.save();
    return res.send({
      mess: "success",
      status: 200,
      text: "Product Add Successfully",
      data: saved,
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

// ✅ Get All Products (with admin details)
exports.getAllProducts = async (req, res) => {
  try {
    const adminId = req.user._id;

    // 👉 Query params
    const {
      search,
      page = 1,
      limit = 5,
      startDate,
      endDate,
      sortBy = "createdAt", // default sorting field
      sortOrder = "desc", // default sorting order
    } = req.query;

    // 👉 Build filter
    let filter = { adminId };

    // 🔍 Search filter
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { units: { $regex: search, $options: "i" } },
      ];
    }

    // 📅 Date filter
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch data
    const products = await Product.find(filter)
      .populate("adminId", "storeName email phoneNumber address")
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions);

    // Total count
    const total = await Product.countDocuments(filter);

    return res.send({
      mess: "success",
      status: 200,
      text: "Product Fetch Successfully",
      data: products,

      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),

      // sorting: {
      //   sortBy,
      //   sortOrder,
      // },
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res.send({
        mess: "error",
        status: 400,
        text: "Product Not Found",
      });
    return res.send({
      mess: "success",
      status: 200,
      text: "Product Update Successfully",
      data: updated,
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.send({
        mess: "error",
        status: 400,
        text: "Product Not Found",
      });
    return res.send({
      mess: "success",
      status: 200,
      text: "Product Delete Successfully",
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};
