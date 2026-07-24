
const MealBooking = require("./booking");

// Create a sample booking
const booking1 = new MealBooking("240164", "Rita Wak", "2026-07-24", "Lunch", 1, "No globe");

try {
  booking1.validate();
  booking1.calculateTotal();
  console.log(booking1.getSummary());
} catch (err) {
  console.error("Error:", err.message);
}