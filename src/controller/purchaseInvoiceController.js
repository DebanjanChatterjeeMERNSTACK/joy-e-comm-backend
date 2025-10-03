const PurchaseInvoice = require("../model/purchaseInvoiceSchema");
const Product = require("../model/productSchema");

const createPurchaseInvoice = async (req, res) => {
  try {
    const adminId = req.user._id;
    console.log(req.body);
    const {
      companyName,
      email,
      phoneNumber,
      address,
      gstNumber,
      invoiceNumber,
      invoiceDate,
      item,
      totalDiscountAmount,
      totalTaxAmount,
      transportCharge,
      roundOff,
      grandTotal,
    } = req.body;

    // 1️⃣ Save Purchase Invoice
    const purchaseInvoice = new PurchaseInvoice({
      adminId,
      companyName,
      email,
      phoneNumber,
      address,
      gstNumber,
      invoiceNumber,
      invoiceDate,
      item,
      totalDiscountAmount,
      totalTaxAmount,
      roundOff,
      transportCharge,
      grandTotal,
    });

    await purchaseInvoice.save();

    // 2️⃣ Loop through each item and update product stock
    for (const e of item) {
      // Always convert productName to UPPERCASE to match schema
      const productName = e.productName.toUpperCase();

      let product = await Product.findOne({
        adminId,
        productName,
      });

      if (product) {
        // Product exists → update quantity & stock
        product.quantity = e.quantity || 0;
        product.stock = (product.stock || 0) + (e.quantity || 0);
        product.units = e.units;
        product.purchesPrice = e.purchesPrice;
        product.gst = e.gst;
        product.taxAmount = e.taxAmount;
        product.discountPercent = e.discountPercent;
        product.discount = e.discount;
        product.amount = e.amount;
        await product.save();
      } else {
        // Product not found → create new one
        const newProduct = new Product({
          adminId,
          productName,
          units: e.units,
          quantity: e.quantity,
          stock: e.quantity,
          purchesPrice: e.purchesPrice,
          gst: e.gst,
          taxAmount: e.taxAmount,
          discountPercent: e.discountPercent,
          discount: e.discount,
          amount: e.amount,
        });
        await newProduct.save();
      }
    }

    return res.send({
      mess: "success",
      status: 200,
      text: "Purchase Invoice Created Successfully",
      data: purchaseInvoice,
    });
  } catch (err) {
    return res.send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

// Edit / Update Purchase Invoice
const editPurchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params; // invoice ID
    const adminId = req.user._id;
    const {
      vendorId,
      invoiceNumber,
      invoiceDate,
      item,
      totalDiscountAmount,
      totalTaxAmount,
      roundOff,
      grossAmount,
    } = req.body;

    // 1️⃣ Find the existing invoice
    const oldInvoice = await PurchaseInvoice.findById(id);
    if (!oldInvoice) {
      return res.status(404).send({
        mess: "error",
        status: 404,
        text: "Invoice not found",
      });
    }

    // 2️⃣ Rollback stock from old items
    for (const oldItem of oldInvoice.item) {
      const productName = oldItem.productName.toUpperCase();
      let product = await Product.findOne({ adminId, productName });

      if (product) {
        if (product.quantity > oldItem.quantity) {
          product.quantity = (product.quantity || 0) + (oldItem.quantity || 0);
          product.stock = (product.stock || 0) + (oldItem.quantity || 0);
          product.purchesPrice = product.purchesPrice;
          product.gst = product.gst;
          product.taxAmount = product.taxAmount;
          product.discountPercent = product.discountPercent;
          product.discount = product.discount;
          product.amount = product.amount;
        }

        if (product.quantity < oldItem.quantity) {
          product.quantity = (product.quantity || 0) + (oldItem.quantity || 0);
          product.stock = (product.stock || 0) + (oldItem.quantity || 0);
          product.purchesPrice = product.purchesPrice;
          product.gst = product.gst;
          product.taxAmount = product.taxAmount;
          product.discountPercent = product.discountPercent;
          product.discount = product.discount;
          product.amount = product.amount;
        }
        // Prevent negative stock
        if (product.stock < 0) product.stock = 0;

        await product.save();
      }
    }

    // 3️⃣ Update invoice with new data
    oldInvoice.adminId = adminId;
    oldInvoice.vendorId = vendorId;
    oldInvoice.invoiceNumber = invoiceNumber;
    oldInvoice.invoiceDate = invoiceDate;
    oldInvoice.item = item;
    oldInvoice.totalDiscountAmount = totalDiscountAmount;
    oldInvoice.totalTaxAmount = totalTaxAmount;
    oldInvoice.roundOff = roundOff;
    oldInvoice.grossAmount = grossAmount;
    await oldInvoice.save();

    // 4️⃣ Apply new items to stock
    for (const newItem of item) {
      const productName = newItem.productName.toUpperCase();
      let product = await Product.findOne({ adminId, productName });

      if (product) {
        product.quantity = (product.quantity || 0) + (newItem.quantity || 0);
        product.stock = (product.stock || 0) + (newItem.quantity || 0);
        product.purchesPrice = newItem.purchesPrice;
        product.gst = newItem.gst;
        product.taxAmount = newItem.taxAmount;
        product.discountPercent = newItem.discountPercent;
        product.discount = newItem.discount;
        product.amount = newItem.amount;
        await product.save();
      } else {
        const newProduct = new Product({
          adminId,
          productName,
          units: newItem.units,
          quantity: newItem.quantity,
          stock: newItem.quantity,
          purchesPrice: newItem.purchesPrice,
          gst: newItem.gst,
          taxAmount: newItem.taxAmount,
          discountPercent: newItem.discountPercent,
          discount: newItem.discount,
          amount: newItem.amount,
        });
        await newProduct.save();
      }
    }

    return res.send({
      mess: "success",
      status: 200,
      text: "Purchase Invoice Updated & Stock Adjusted",
      data: oldInvoice,
    });
  } catch (err) {
    return res.status(400).send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

const getAllPurchaseInvoices = async (req, res) => {
  try {
    const adminId = req.user._id;
    let {
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filter = { adminId };

    // 🔎 Search by invoiceNumber or productName in items
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    // 📅 Date range filter
    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 🔽 Sorting (default newest first)
    let sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    // 📑 Pagination
    const invoices = await PurchaseInvoice.find(filter)
      .populate("adminId", "storeName email phoneNumber address")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await PurchaseInvoice.countDocuments(filter);

    return res.send({
      mess: "success",
      status: 200,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: invoices,
    });
  } catch (err) {
    return res.status(400).send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};

module.exports = {
  createPurchaseInvoice,
  editPurchaseInvoice,
  getAllPurchaseInvoices,
};
