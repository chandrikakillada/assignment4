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

// get all invoices
app.get("/allInvoices", async (req, res) => {
  try {
    const allInvoices = await sales.find({});
    res.status(200).json(allInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).send("Error fetching invoices");
  }
});

// Show a specific invoice based on invoiceID
app.get("/invoices/:invoiceID", async (req, res) => {
  try {
    const invoiceID = req.params.invoiceID;
    const foundInvoice = await sales.findById(invoiceID).exec();

    if (!foundInvoice) {
      return res.status(404).send("Invoice not found");
    }

    res.json(foundInvoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).send("Error fetching invoice");
  }
});

const Sale = require("./models/invoice"); // Import the Sales model

// Route to create a new sales record
app.post("/api/sales", async (req, res) => {
  try {
    // Create a new sales record using the Sales model and provided data
    const newSalesRecord = await sales.create({
      "Invoice ID": req.body["Invoice ID"],
      Branch: req.body.Branch,
      City: req.body.City,
      "Customer type": req.body["Customer type"],
      "Product line": req.body["Product line"],
      name: req.body.name,
      image: req.body.image,
      "Unit price": req.body["Unit price"],
      Quantity: req.body.Quantity,
      "Tax 5%": req.body["Tax 5%"],
      Total: req.body.Total,
      Date: req.body.Date,
      Time: req.body.Time,
      Payment: req.body.Payment,
      cogs: req.body.cogs,
      "gross income": req.body["gross income"],
      Rating: req.body.Rating,
    });

    // Retrieve and return all sales after the new record is created
    const allSales = await sales.find({});
    res.status(201).json(allSales);
  } catch (error) {
    console.error("Error creating new sales record:", error);
    res.status(500).send("Error creating new sales record");
  }
});

app.delete("/api/sales/:sales_id", async (req, res) => {
  try {
    const id = req.params.sales_id;

    const deletionResult = await sales.deleteOne({ _id: id });

    if (deletionResult.deletedCount > 0) {
      res.send("Successfully! Sales record has been deleted.");
    } else {
      res.status(404).send("Sales record not found.");
    }
  } catch (error) {
    console.error("Error deleting sales record:", error);
    res.status(500).send("Error deleting sales record");
  }
});

app.put("/api/sales/:sales_id", async (req, res) => {
  try {
    const id = req.params.sales_id;

    // Extract fields that need to be updated from the request body
    const { CustomerType, UnitPrice } = req.body; // Assuming request body contains CustomerType and UnitPrice fields

    const updateFields = {};
    if (CustomerType) {
      updateFields["Customer type"] = CustomerType;
    }
    if (UnitPrice) {
      updateFields["Unit price"] = UnitPrice;
    }

    // Update the specific fields in the sales record
    const updatedSales = await sales.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    if (updatedSales) {
      res.status(200).json(updatedSales);
    } else {
      res.status(404).send("Sales record not found");
    }
  } catch (error) {
    console.error("Error updating sales record:", error);
    res.status(500).send("Error updating sales record");
  }
});

/**********************************************************************************
 * ITE5315 – Assignment 2* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source* (including web sites) or distributed to other students.
 * ** Name: killada chandrika venu
 *  Student ID: N01536668
 * Date: 26th november
 * **********************************************************************************/
