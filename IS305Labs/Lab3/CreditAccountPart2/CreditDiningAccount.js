const DiningAccount = require('./DiningAccount');

class CreditDiningAccount extends DiningAccount {
  #creditLimit;

  constructor(accountNumber, openingBalance, creditLimit) {
    super(accountNumber, openingBalance);
    if (creditLimit < 0) throw new Error("Credit limit cannot be negative.");
    this.#creditLimit = creditLimit;
  }

  // Override payForMeal to allow negative balance up to the credit limit
  payForMeal(amount, description) {
    if (amount <= 0) throw new Error("Payment amount must be greater than zero.");
    
    // Check if the resulting balance would fall below the negative credit limit
    if ((this.getBalance() - amount) < -this.#creditLimit) {
      return false; // Rejected: exceeds credit limit
    }
    
    // Call parent method with the 'allowNegative' flag set to true
    return super.payForMeal(amount, description, true);
  }

  displayAccountSummary() {
    console.log(`
========================================
      CREDIT DINING ACCOUNT
========================================
Account Number: ${this.accountNumber}
Current Balance: K${this.getBalance().toFixed(2)}
Credit Limit: K${this.#creditLimit.toFixed(2)}
========================================`);
  }

  getAccountType() { return "CreditDiningAccount"; }
}

module.exports = CreditDiningAccount;