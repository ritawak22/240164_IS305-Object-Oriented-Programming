
class MealBooking {
  constructor(studentName, studentID, mealType, mealDate, quantity, dietaryNote) {
    this.studentName = studentName;
    this.studentID = studentID;
    this.mealType = mealType;
    this.mealDate = mealDate;
    this.quantity = quantity;
    this.dietaryNote = dietaryNote;
    this.bookingStatus = "Pending";
    this.totalCost = this.calculateCost();
  }

  calculateCost() {
    const prices = { Breakfast: 10, Lunch: 15, Dinner: 20 };
    return prices[this.mealType] * this.quantity;
  }

  validate() {
    return this.studentName && this.studentID && this.mealType && this.mealDate && this.quantity > 0;
  }
}

let bookings = [];

function addBooking(booking) {
  if (booking.validate()) {
    bookings.push(booking);
    console.log("Booking added successfully!");
  } else {
    console.log("Invalid booking information!");
  }
}

function displayBookings() {
  console.log("\n--- Booking Summary ---");
  bookings.forEach(b => {
    console.log(`${b.studentName} | ${b.mealType} | ${b.mealDate} | Qty: ${b.quantity} | Total: K${b.totalCost}`);
  });
}

// Example run
const booking1 = new MealBooking("Rita Wak", "240164", "Dinner", "2026-07-20", 1, "Chicken Stew");
addBooking(booking1);
displayBookings();
module.exports = MealBooking;

