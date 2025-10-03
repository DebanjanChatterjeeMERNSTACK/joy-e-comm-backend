const customerInvoice = require("../model/customerInvoiceSchema");
const Product = require("../model/productSchema");
const Customer =require("../model/customerSchema")

const createcustomerInvoice = async (req, res) => {
  try {
    const adminId = req.user._id;
    const {
      customerName,
      email,
      phoneNumber,
      address,
      invoiceNumber,
      invoiceDate,
      item,
      totalDiscountAmount,
      totalTaxAmount,
      transportCharge,
      roundOff,
      grandTotal,
    } = req.body;

    
    // 1️⃣ Check stock availability before saving invoice
    for (const e of item) {
      const productName = e.productName.toUpperCase();

      let product = await Product.findOne({ adminId, productName });

      if (!product) {
        return res.status(400).send({
          mess: "error",
          status: 400,
          text: `${productName} product is not available.`,
        });
      }

      if ((product.stock || 0) < (e.quantity || 0)) {
        return res.status(400).send({
          mess: "error",
          status: 400,
          text: `Insufficient stock for ${product.productName}. Available: ${product.stock}, Required: ${e.quantity}`,
        });
      }
    }

    // 2️⃣ If all products have enough stock → Save invoice
    const customerinvoice = new customerInvoice({
      adminId,
      customerName,
      email,
      phoneNumber,
      address,
      invoiceNumber,
      invoiceDate,
      item,
      transportCharge,
      totalDiscountAmount,
      totalTaxAmount,
      roundOff,
      grandTotal,
    });

    await customerinvoice.save();

    // 3️⃣ Deduct stock after saving invoice
    for (const e of item) {
      const productName = e.productName.toUpperCase();

      await Product.findOneAndUpdate(
        { adminId, productName },
        { $inc: { stock: -(e.quantity || 0) } },
        { new: true }
      );
    }
    const customerData=await Customer.findOne({phoneNumber:phoneNumber})
    if(!customerData){
     const  data= new Customer({adminId,customerName,email,phoneNumber,address})
     await data.save()
    }

    return res.send({
      mess: "success",
      status: 200,
      text: "Customer Invoice Created Successfully",
      data: customerinvoice,
    });
  } catch (err) {
    return res.status(400).send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};



const editCustomerInvoice = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { id } = req.params; // Invoice ID
    const {
      customerName,
      email,
      phoneNumber,
      address,
      invoiceNumber,
      invoiceDate,
      item,
      totalDiscountAmount,
      totalTaxAmount,
      roundOff,
      grandTotal,
    } = req.body;

    // 1️⃣ Find existing invoice
    const existingInvoice = await customerInvoice.findOne({ _id: id, adminId });
    if (!existingInvoice) {
      return res.status(404).send({
        mess: "error",
        status: 404,
        text: "Invoice not found",
      });
    }

    // 2️⃣ Restore stock from old invoice items
    for (const e of existingInvoice.item) {
      const productName = e.productName.toUpperCase();
      await Product.findOneAndUpdate(
        { adminId, productName },
        { $inc: { stock: (e.quantity || 0) } }, // add back old stock
        { new: true }
      );
    }

    // 3️⃣ Check stock availability for new items
    for (const e of item) {
      const productName = e.productName.toUpperCase();
      const product = await Product.findOne({ adminId, productName });

      if (!product) {
        return res.status(400).send({
          mess: "error",
          status: 400,
          text: `${productName} product is not available.`,
        });
      }

      if ((product.stock || 0) < (e.quantity || 0)) {
        return res.status(400).send({
          mess: "error",
          status: 400,
          text: `Insufficient stock for ${product.productName}. Available: ${product.stock}, Required: ${e.quantity}`,
        });
      }
    }

    // 4️⃣ Update invoice
    existingInvoice.customerName = customerName;
    existingInvoice.email = email;
    existingInvoice.phoneNumber = phoneNumber;
    existingInvoice.address = address;
    existingInvoice.invoiceNumber = invoiceNumber;
    existingInvoice.invoiceDate = invoiceDate;
    existingInvoice.item = item;
    existingInvoice.totalDiscountAmount = totalDiscountAmount;
    existingInvoice.totalTaxAmount = totalTaxAmount;
    existingInvoice.roundOff = roundOff;
    existingInvoice.grandTotal = grandTotal;

    await existingInvoice.save();

    // 5️⃣ Deduct stock for new items
    for (const e of item) {
      const productName = e.productName.toUpperCase();
      await Product.findOneAndUpdate(
        { adminId, productName },
        { $inc: { stock: -(e.quantity || 0) } },
        { new: true }
      );
    }

    return res.send({
      mess: "success",
      status: 200,
      text: "Customer Invoice Updated Successfully",
      data: existingInvoice,
    });
  } catch (err) {
    return res.status(400).send({
      mess: "error",
      status: 400,
      text: err.message,
    });
  }
};


const getCustomerInvoices = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Query Params
    const {
      search, // invoiceNumber or customerName
      startDate,
      endDate,
      sortBy = "invoiceDate",
      sortOrder = "desc",
      page = 1,
      limit = 5,
    } = req.query;

    // 1️⃣ Build Query
    let query = { adminId };

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate && endDate) {
      query.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.invoiceDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.invoiceDate = { $lte: new Date(endDate) };
    }

    // 2️⃣ Sorting
    let sortQuery = {};
    sortQuery[sortBy] = sortOrder === "asc" ? 1 : -1;

    // 3️⃣ Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const invoices = await customerInvoice
      .find(query)
      .populate("adminId", "storeName email phoneNumber address")
      // .populate("item") // in case items have references later
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await customerInvoice.countDocuments(query);

    return res.send({
      mess: "success",
      status: 200,
      text: "Customer Invoices fetched successfully",
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
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






module.exports = { createcustomerInvoice,editCustomerInvoice,getCustomerInvoices };
