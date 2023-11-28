const express = require("express");
const mongoose = require("mongoose");
const app = express();
const database = require("./config/database");
const Handlebars = require("handlebars");

require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser"); // pull information from HTML POST (express4)
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const exphbs = require("express-handlebars");

// Set up Handlebars as the view engine with a custom file extension
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",

    partialsDir: "views/partials/",
    defaultLayout: "main",
  })
);

// Register a Handlebars helper
Handlebars.registerHelper("getProperty", function (object, property) {
  return object[property];
});

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

const sales = require("./models/invoice");

main().catch((err) => console.log(err));
async function main() {
  try {
    await mongoose.connect(database.url);

    console.log("Database connection established");

    app.listen(process.env.PORT, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

app.get("/", async (req, res) => {
  res.render("index");
});

// get all invoices
app.get("/allInvoices", async (req, res) => {
  try {
    const allInvoices = await sales.find({});

    res.render("invoices", { invoices: allInvoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).send("Error fetching invoices");
  }
});

// Form search for invoices form
app.get("/searchInvoice", async (req, res) => {
  res.render("searchInvoice");
});

// Search single invoice
// Search single invoice
app.post("/searchInvoice", async (req, res) => {
  const { invoiceID } = req.body;

  try {
    const searchResult = await sales.find({ "Invoice ID": invoiceID });

    res.render("searchResults", { searchResult });
  } catch (error) {
    console.error("Error searching invoice:", error);
    res.status(500).send("Error searching invoice");
  }
});

// display form to add new invoice
app.get("/addInvoice", async (req, res) => {
  res.render("addNewInvoice");
});

// Insert single invoice
app.post("/addInvoice", async (req, res) => {
  try {
    const newSales = new sales({ ...req.body });
    await newSales.save();
    return res.render("invoiceAdded", { newInvoice: newSales });
  } catch (error) {
    console.error("Error creating new, invoice:", error);
    return res.status(500).send("Error creating new invoice");
  }
});

// Display success page after inserting invoice
app.get("/invoiceAdded", (req, res) => {
  res.render("invoiceAdded");
});

// display delete invoice form
app.get("/deleteInvoice", (req, res) => {
  res.render("deleteInvoice");
});
// delete invoice by ID or exact name
// Route to handle form submission
app.post("/deleteInvoice", async (req, res) => {
  const invoiceID = req.body["Invoice ID"];
  try {
    // Use the correct field name in the query
    const result = await sales.deleteOne({ "Invoice ID": invoiceID });

    console.log(result);
    if (result.deletedCount > 0) {
      // Render the deleted template with the deleted document information
      res.render("deletedInvoice", { deletedDoc: { "Invoice ID": invoiceID } });
    } else {
      res.send("product not found.");
    }
  } catch (err) {
    console.log(err);

    // You might want to handle errors differently, e.g., show an error template
    res.status(500).send("Error deleting the document.");
  }
});

// update an invoice
app.put("/invoice/:id", async (req, res) => {
  const { id } = req.params;

  const newData = { ...req.body };
  await sales.findByIdAndUpdate({ _id: id }, newData, { new: true });
  const updatedsales = await sales.findById(id);
  return res.status(200).json(updatedsales);
});

// Assuming 'sales' is your Mongoose model

// render update invoice form
app.get("/updateInvoice", (req, res) => {
  res.render("updateInvoiceForm");
});

// Update an existing invoice
app.post("/updateInvoice", async (req, res) => {
  const { invoiceID, newCustomerType, newUnitPrice } = req.body;

  try {
    // Find the invoice by ID and update the specified fields
    const updatedInvoice = await sales.findOneAndUpdate(
      { "Invoice ID": invoiceID },
      {
        $set: { "Customer type": newCustomerType, "Unit price": newUnitPrice },
      },
      { new: true }
    );

    if (!updatedInvoice) {
      // If the invoice with the given ID is not found
      return res.status(404).send("Invoice not found");
    }

    // Render a success page or send a JSON response with the updated invoice
    res.render("updateSuccess", { updatedInvoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).send("Error updating invoice");
  }
});

/**********************************************************************************
 * ITE5315 – Assignment 2* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source* (including web sites) or distributed to other students.
 * ** Name: killada chandrika venu
 *  Student ID: N01536668
 * Date: 26th november
 * **********************************************************************************/
