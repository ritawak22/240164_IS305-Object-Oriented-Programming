class DiningAccount {
  #accountNumber;
  #balance;
  #transactions;

  constructor(accountNumber, openingBalance = 0) {
    if (!accountNumber || accountNumber.trim() === "") throw new Error("Account number cannot be empty.");
    if (openingBalance < 0) throw new Error("Opening balance cannot be negative.");

    this.#accountNumber = accountNumber;
    this.#balance = openingBalance;
    this.#transactions = [];
    
    if (openingBalance > 0) {
      this.#recordTransaction("Deposit", openingBalance, "Opening balance", this.#balance);
    }
  }

  // Task 5: Format transaction history
  #recordTransaction(type, amount, description, balanceAfter) {
    this.#transactions.push({
      type,
      amount,
      description,
      dateTime: new Date().toLocaleString(),
      balanceAfter
    });
  }

  deposit(amount, description = "Deposit") {
    if (amount <= 0) throw new Error("Deposit amount must be greater than zero.");
    this.#balance += amount;
    this.#recordTransaction("Deposit", amount, description, this.#balance);
    return true;
  }

  // Added 'allowNegative' parameter to support CreditDiningAccount
  payForMeal(amount, description, allowNegative = false) {
    if (amount <= 0) throw new Error("Payment amount must be greater than zero.");
    
    if (!allowNegative && amount > this.#balance) {
      return false; // Insufficient funds
    }
    
    this.#balance -= amount;
    this.#recordTransaction("Meal Payment", amount, description, this.#balance);
    return true;
  }

  getBalance() { return this.#balance; }
  getTransactions() { return [...this.#transactions]; }
  
  displayAccountSummary() {
    console.log(`
========================================
      STANDARD DINING ACCOUNT
========================================
Account Number: ${this.#accountNumber}
Current Balance: K${this.#balance.toFixed(2)}
========================================`);
  }

  get accountNumber() { return this.#accountNumber; }
  getAccountType() { return "DiningAccount"; }
}

module.exports = DiningAccount;