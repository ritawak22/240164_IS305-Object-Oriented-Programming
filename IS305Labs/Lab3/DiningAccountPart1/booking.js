class MealBooking {
  constructor(student, studentIdCheck, mealDate, mealType, quantity, dietaryNote) {
    this.student = student; 
    this.studentId = studentIdCheck; 
    this.mealDate = mealDate;
    this.mealType = mealType;
    this.quantity = quantity;
    this.dietaryNote = dietaryNote;
    this.status = "Pending";
    this.totalCost = 0;
  }

  validate() {
    const validMeals = ["Breakfast", "Lunch", "Dinner"];
    if (!this.student || !this.mealDate || !validMeals.includes(this.mealType) || this.quantity < 1) {
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
Student: ${this.student.getFullName()} (${this.student.studentId})
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