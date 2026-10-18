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
    this.isPaid = false; // NEW: Prevents double payment
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

  confirmBooking() { this.status = "Confirmed"; }
  cancelBooking() { this.status = "Cancelled"; }

  // Task 4: Process Payment polymorphically
  processPayment(diningAccount) {
    if (this.isPaid) {
      return { success: false, message: "This booking has already been paid." };
    }

    this.calculateTotal();
    const description = `${this.mealType} booking`;

    // Polymorphism in action: we don't care if it's standard, credit, or rewards
    const success = diningAccount.payForMeal(this.totalCost, description);

    if (success) {
      this.confirmBooking();
      this.isPaid = true;
      return { success: true, message: "Payment successful" };
    } else {
      return { success: false, message: "Insufficient funds or credit limit exceeded" };
    }
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