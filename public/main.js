// This event listener ensures that the script runs after the HTML document has been fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the form element and add an event listener for form submission
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    // Validate fields when the form is submitted
    if (!validateInvoiceId() || !validateBranch() || !validateRating()) {
      event.preventDefault(); // Prevent form submission if validation fails
    }
  });

  // Function to validate Invoice ID
  function validateInvoiceId() {
    const invoiceIdInput = document.getElementById("invoiceId");
    const invoiceIdPattern = /^\d{3}-\d{2}-\d{4}$/;

    // Check if the entered Invoice ID matches the specified pattern
    if (!invoiceIdPattern.test(invoiceIdInput.value)) {
      alert("Invalid Invoice ID. Please use the format XXX-XX-XXXX.");
      return false; // Return false to indicate validation failure
    }

    return true; // Return true to indicate validation success
  }

  // Function to validate Branch
  function validateBranch() {
    const branchInput = document.getElementById("branch");
    const validBranches = ["A", "B", "C"];

    // Check if the selected branch is one of the valid branches
    if (!validBranches.includes(branchInput.value)) {
      alert("Invalid Branch. Please select a valid branch.");
      return false; // Return false to indicate validation failure
    }

    return true; // Return true to indicate validation success
  }

  // Function to validate Rating
  function validateRating() {
    const ratingInput = document.getElementById("rating");

    // Check if the entered rating is a number between 1 and 10
    if (
      isNaN(ratingInput.value) ||
      ratingInput.value < 1 ||
      ratingInput.value > 10
    ) {
      alert("Invalid Rating. Please enter a number between 1 and 10.");
      return false; // Return false to indicate validation failure
    }

    return true; // Return true to indicate validation success
  }
});

// Function to calculate total based on unit price and quantity
function calculateTotal() {
  // Get user inputs
  var unitPrice = parseFloat(document.getElementById("unitPrice").value) || 0.0;
  var quantity = parseInt(document.getElementById("quantity").value) || 0;

  // Calculate tax, discount, and total
  var taxRate = 0.05; // 5%
  var tax = unitPrice * quantity * taxRate;

  var subtotal = unitPrice * quantity;
  var total = subtotal + tax;

  // Update the calculated values in the form
  document.getElementById("tax").value = tax.toFixed(2);
  document.getElementById("total").value = total.toFixed(2);
}
