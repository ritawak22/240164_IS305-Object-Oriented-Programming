class DiningAccount {
  #accountNumber;
  #balance;
  #transactions;

  constructor(accountNumber, openingBalance = 0) {
    if (!accountNumber || accountNumber.trim() === "") {
      throw new Error("Account number cannot be empty.");
    }
    if (openingBalance < 0) {
      throw new Error("Opening balance cannot be negative.");
    }

    this.#accountNumber = accountNumber;
    this.#balance = openingBalance;
    this.#transactions = [];
    
    if (openingBalance > 0) {
      this.#transactions.push(`Opening Balance: K${openingBalance.toFixed(2)}`);
    }
  }

  deposit(amount, description = "Deposit") {
    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than zero.");
    }
    this.#balance += amount;
    this.#transactions.push(`${description}: +K${amount.toFixed(2)}`);
    return true;
  }

  payForMeal(amount, description) {
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than zero.");
    }
    if (amount > this.#balance) {
      return false; // Insufficient funds
    }
    this.#balance -= amount;
    this.#transactions.push(`Meal Payment (${description}): -K${amount.toFixed(2)}`);
    return true;
  }

  getBalance() {
    return this.#balance;
  }

  getTransactions() {
    return [...this.#transactions];
  }

  displayAccountSummary() {
    return `
========================================
      STANDARD DINING ACCOUNT
========================================
Account Number: ${this.#accountNumber}
Current Balance: K${this.#balance.toFixed(2)}
========================================`;
  }

  get accountNumber() {
    return this.#accountNumber;
  }
}

module.exports = DiningAccount;

