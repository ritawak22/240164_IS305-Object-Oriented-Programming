const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const MealBooking = require("./booking");
const Student = require("./Student");

const rl = readline.createInterface({ input, output });
const bookings = [];

// TASK 3: Display Booking History
function displayBookingHistory(student, bookingArray) {
  // 1. Display student details once
  console.log(student.displayInfo());

  // 2. Find bookings belonging to that student
  const studentBookings = bookingArray.filter(b => b.studentId === student.studentId);

  console.log("========================================");
  console.log("             BOOKING HISTORY            ");
  console.log("========================================");

  if (studentBookings.length === 0) {
    console.log("No bookings found for this student.");
    return;
  }

  let combinedCost = 0;

  // 3. Display all meal bookings
  studentBookings.forEach((booking, index) => {
    console.log(`${index + 1}. ${booking.mealType} - ${booking.mealDate}`);
    console.log(`   Quantity: ${booking.quantity}`);
    console.log(`   Status: ${booking.status}`);
    console.log(`   Cost: K${booking.totalCost.toFixed(2)}\n`);
    
    combinedCost += booking.totalCost;
  });

  // 4 & 5. Display total bookings and combined cost
  console.log(`Total Bookings: ${studentBookings.length}`);
  console.log(`Combined Cost: K${combinedCost.toFixed(2)}`);
  console.log("========================================");
}

async function main() {
  try {
    // --- 1. Create ONE Student Object (Task 2) ---
    console.log("\n--- Enter Student Details ---");
    const studentId = await rl.question("Student ID: ");
    const firstName = await rl.question("First name: ");
    const lastName = await rl.question("Last name: ");

    const student = new Student(studentId, firstName, lastName);

    // --- 2. Create Meal Bookings connected to the Student Object ---
    let continueBooking = true;
    while (continueBooking) {
      console.log("\n--- Enter Meal Booking Details ---");
      const mealDate = await rl.question("Meal date (YYYY-MM-DD): ");
      const mealType = await rl.question("Meal type (Breakfast, Lunch, Dinner): ");
      const quantity = parseInt(await rl.question("Quantity: "));
      const dietaryNote = await rl.question("Dietary note: ");

      // Pass the whole student object into the booking
      const booking = new MealBooking(
        student, 
        student.studentId, 
        mealDate, 
        mealType, 
        quantity, 
        dietaryNote
      );
      
      booking.validate();
      booking.calculateTotal();
      
      // Automatically confirm the first one to match your screenshot's "Confirmed" status
      if (bookings.length === 0) {
        booking.confirmBooking(); 
      }

      bookings.push(booking);
      console.log("Booking added successfully!");

      const answer = await rl.question("\nAdd another booking? (yes/no): ");
      if (answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "y") {
        continueBooking = false;
      }
    }

    // --- TASK 4: Controlled Student Update ---
    console.log("\n--- Update Student Name ---");
    const newFirst = await rl.question("Enter new first name (or press Enter to skip): ");
    const newLast = await rl.question("Enter new last name (or press Enter to skip): ");
    
    if (newFirst.trim() !== "" || newLast.trim() !== "") {
      student.updateName(newFirst || student.firstName, newLast || student.lastName);
      console.log("Name updated successfully.");
    }

    // --- FINAL OUTPUT ---
    console.log("\n");
    displayBookingHistory(student, bookings);

  } catch (err) {
    console.error("\nError:", err.message);
  } finally {
    rl.close();
  }
}

main();
