
/*
  Program: Dining Meal Booking Feature
  Student Name: Rita WAK
  Student ID: 240164
  Date: 17 July 2026
  Description: A JavaScript program on classes,
  objects, constructors, private fields and methods.
*/

class MealBooking {
  constructor(studentID, studentName, mealDate, mealType, quantity, dietaryNote) {
    this.studentID = studentID;
    this.studentName = studentName;
    this.mealDate = mealDate;
    this.mealType = mealType;
    this.quantity = quantity;
    this.dietaryNote = dietaryNote;
    this.status = "Pending";
    this.totalCost = 0;
  }

  validate() {
    const validMeals = ["Breakfast", "Lunch", "Dinner"];
    if (!this.studentID || !this.studentName || !this.mealDate || !validMeals.includes(this.mealType) || this.quantity < 1) {
      throw new Error("Invalid booking information.");
    }
    return true;
  }

  calculateTotal() {
    const prices = { Breakfast: 10, Lunch: 15, Dinner: 20 };
    this.totalCost = prices[this.mealType] * this.quantity;
    return this.totalCost;
  }

  confirmBooking() {
    this.status = "Confirmed";
  }

  cancelBooking() {
    this.status = "Cancelled";
  }

  getSummary() {
    return `
========================================
DWU DINING MEAL BOOKING
========================================
Student: ${this.studentName} (${this.studentID})
Meal: ${this.mealType} x ${this.quantity}
Date: ${this.mealDate}
Dietary note: ${this.dietaryNote}
Status: ${this.status}
Total cost: K${this.totalCost.toFixed(2)}
========================================
`;
  }
}

module.exports = MealBooking;
