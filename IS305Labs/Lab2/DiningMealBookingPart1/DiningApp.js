const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const MealBooking = require("./booking");
const Student = require("./Student"); // NEW: Import the Student class

const rl = readline.createInterface({ input, output });
const bookings = [];

async function main() {
  try {
    // --- NEW LAB 2 PART 1: Student Details ---
    console.log("\n--- Enter Student Details ---");
    const studentId = await rl.question("Student ID: ");
    const firstName = await rl.question("First name: ");
    const lastName = await rl.question("Last name: ");

    // Create the student object
    const student = new Student(studentId, firstName, lastName);
    
    // Display the student info
    console.log(student.displayInfo());

    // --- EXISTING LAB 1 PART 2: Meal Booking ---
    console.log("\n--- Enter Meal Booking Details ---");
    // Note: We already got the Student ID and Name in the Student section, 
    // but to strictly follow your Lab 1 code, we'll ask again. 
    // Alternatively, you can auto-fill this using `student.studentId` and `student.getFullName()`.
    const studentID = await rl.question("Student ID: ");
    const studentName = await rl.question("Student name: ");
    const mealDate = await rl.question("Meal date (YYYY-MM-DD): ");
    const mealType = await rl.question("Meal type (Breakfast, Lunch, Dinner): ");
    const quantity = parseInt(await rl.question("Quantity: "));
    const dietaryNote = await rl.question("Dietary note: ");

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
