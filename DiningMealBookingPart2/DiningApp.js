
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const MealBooking = require("./booking");

const rl = readline.createInterface({ input, output });
const bookings = [];

async function main() {
  console.log("========================================");
  console.log("DWU DINING MEAL BOOKING");
  console.log("========================================");

  const studentID = await rl.question("Student ID: ");
  const studentName = await rl.question("Student name: ");
  const mealDate = await rl.question("Meal date (YYYY-MM-DD): ");
  const mealType = await rl.question("Meal type (Breakfast, Lunch, Dinner): ");
  const quantity = parseInt(await rl.question("Quantity: "));
  const dietaryNote = await rl.question("Dietary note: ");

  try {
    // Prevent duplicate booking
    const duplicate = bookings.find(
      b => b.studentID === studentID && b.mealDate === mealDate && b.mealType === mealType
    );
    if (duplicate) throw new Error("Duplicate booking detected.");

    const booking = new MealBooking(studentID, studentName, mealDate, mealType, quantity, dietaryNote);
    booking.validate();
    booking.calculateTotal();

    bookings.push(booking);
    console.log("\nBOOKING CREATED");
    console.log(booking.getSummary());
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    rl.close();
  }
}

main();
