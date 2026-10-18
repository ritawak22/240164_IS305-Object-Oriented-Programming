const DiningAccount = require('./DiningAccount');
const RewardsDiningAccount = require('./RewardsDiningAccount');
const Student = require('./Student');
const MealBooking = require('./booking'); // Change to './MealBooking' if you named the file that way

// ==========================================
// LAB 3 PART 1 DEMONSTRATION
// ==========================================
function runPart1Demonstration() {
  // --- 1. STANDARD DINING ACCOUNT DEMO ---
  const standardAcc = new DiningAccount("DA001", 1000);
  
  // Deposit K500
  standardAcc.deposit(500, "Deposit"); 
  
  // Attempt to pay K200
  const paymentAmount = 200;
  const isPaymentSuccessful = standardAcc.payForMeal(paymentAmount, "Lunch");

  console.log("========================================");
  console.log("      STANDARD DINING ACCOUNT");
  console.log("========================================");
  console.log(`Account Number: DA001`);
  console.log(`Opening Balance: K1000.00`);
  console.log(`Deposit: K500.00`);
  console.log(`Meal Payment: K${paymentAmount.toFixed(2)}`);
  
  if (isPaymentSuccessful) {
    console.log(`Payment Status: Successful`);
  } else {
    console.log(`Payment Status: Failed - Insufficient funds`);
  }
  console.log(`Final Balance: K${standardAcc.getBalance().toFixed(2)}`);


  console.log("\n"); // Spacing

  // --- 2. REWARDS DINING ACCOUNT DEMO ---
  const rewardsAcc = new RewardsDiningAccount("RA001", 1500, 2.5);
  
  // Deposit K500
  rewardsAcc.deposit(500);
  
  const balanceBeforeReward = rewardsAcc.getBalance(); // Should be 2000
  const rewardEarned = rewardsAcc.calculateReward();   // Should be 50
  
  rewardsAcc.applyReward(); // Applies the 50

  console.log("========================================");
  console.log("      REWARDS DINING ACCOUNT");
  console.log("========================================");
  console.log(`Account Number: RA001`);
  console.log(`Balance Before Reward: K${balanceBeforeReward.toFixed(2)}`);
  console.log(`Reward Rate: 2.5%`);
  console.log(`Reward Earned: K${rewardEarned.toFixed(2)}`);
  console.log(`Final Balance: K${rewardsAcc.getBalance().toFixed(2)}`);
}

// Run the demonstration
runPart1Demonstration();

