
const MealBooking = require('./booking');
const booking1 = new MealBooking("Rita Wak", "240164", "Dinner", "2026-07-20", 1, "No tinned fish");

console.log("Booking validated:", booking1.validate());
console.log("Total cost:", booking1.totalCost);

console.log("\n--- Booking Summary ---");
console.log(`Student: ${booking1.studentName}`);
console.log(`Meal Type: ${booking1.mealType}`);
console.log(`Meal Date: ${booking1.mealDate}`);
console.log(`Quantity: ${booking1.quantity}`);
console.log(`Dietary Note: ${booking1.dietaryNote}`);
console.log(`Total Cost: K${booking1.totalCost}`);

