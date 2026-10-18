const DiningAccount = require('./DiningAccount');
const RewardsDiningAccount = require('./RewardsDiningAccount');
const CreditDiningAccount = require('./CreditDiningAccount');
const Student = require('./Student');
const MealBooking = require('./booking');

function runLab3Part2() {
  // ==========================================
  // TASK 1 & 6: Credit Account & Overloading Test
  // ==========================================
  console.log("--- Task 1: Credit Dining Account Test ---");
  const creditAcc = new CreditDiningAccount("CA001", 1000, 500);
  
  const pay1 = creditAcc.payForMeal(1500, "Catering");
  console.log(`Attempted K1500 payment. Success: ${pay1}. Balance: K${creditAcc.getBalance()}`);
  
  const pay2 = creditAcc.payForMeal(200, "Extra Food");
  console.log(`Attempted K200 payment. Success: ${pay2}. (Limit exceeded)\n`);

  console.log("--- Task 6: Overloading Test ---");
  const accOverload = new DiningAccount("DA002", 500);
  accOverload.deposit(100);
  accOverload.deposit(100, "Additional meal funds");
  console.log("Deposits with and without descriptions processed successfully.\n");

  // ==========================================
  // TASK 2: Polymorphism Demonstration
  // ==========================================
  console.log("--- Task 2: Polymorphism Demonstration ---");
  const polyAccounts = [
    new DiningAccount("DA001", 100),
    new RewardsDiningAccount("RA001", 500, 2.5),
    new CreditDiningAccount("CA002", 100, 200)
  ];

  for (const acc of polyAccounts) {
    acc.displayAccountSummary(); // Same method call, different class behavior
  }

  // ==========================================
  // TASK 3, 4, & 5: Full Integration & Output
  // ==========================================
  console.log("\n--- Final Integration Output ---");
  
  // 1. Create Student
  const student = new Student("DWU2026001", "Maria", "Kila");
  
  // 2. Create and Assign Account
  const mariaAccount = new RewardsDiningAccount("RA001", 100, 2.5);
  student.assignDiningAccount(mariaAccount);
  
  // 3. Create Booking
  const booking = new MealBooking(student, student.studentId, "12 August 2026", "Dinner", 2, "None");
  
  // 4. Process Payment (Polymorphic call)
  const paymentResult = booking.processPayment(student.diningAccount);

  // 5. Display Final Output (Exactly matching your screenshot)
  console.log(`
========================================
        STUDENT DINING ACCOUNT
========================================
Student: ${student.getFullName()}
Student ID: ${student.studentId}
Account Type: ${mariaAccount.getAccountType()}
Account Number: ${mariaAccount.accountNumber}
Opening Balance: K100.00

========================================
             MEAL BOOKING
========================================
Meal: ${booking.mealType}
Quantity: ${booking.quantity}
Total Cost: K${booking.totalCost.toFixed(2)}
Payment Status: ${paymentResult.success ? 'Successful' : 'Failed'}
Booking Status: ${booking.status}
Remaining Balance: K${mariaAccount.getBalance().toFixed(2)}

========================================
           TRANSACTION HISTORY
========================================`);

  const txs = mariaAccount.getTransactions();
  txs.forEach((tx, index) => {
    console.log(`${index + 1}. ${tx.type} - K${tx.amount.toFixed(2)}`);
    console.log(`   Description: ${tx.description}`);
    console.log(`   Balance: K${tx.balanceAfter.toFixed(2)}\n`);
  });

  console.log(`Total Transactions: ${txs.length}`);
}

runLab3Part2();