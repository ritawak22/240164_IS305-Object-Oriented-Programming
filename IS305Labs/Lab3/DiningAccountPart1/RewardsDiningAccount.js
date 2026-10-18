const DiningAccount = require('./DiningAccount');

class RewardsDiningAccount extends DiningAccount {
  #rewardRate;

  constructor(accountNumber, openingBalance, rewardRate) {
    super(accountNumber, openingBalance);
    
    if (rewardRate < 0) {
      throw new Error("Reward rate cannot be negative.");
    }
    this.#rewardRate = rewardRate;
  }

  calculateReward() {
    return this.getBalance() * (this.#rewardRate / 100);
  }

  applyReward() {
    const reward = this.calculateReward();
    if (reward > 0) {
      this.deposit(reward, `Reward Earned (${this.#rewardRate}%)`);
    }
    return reward;
  }

  displayAccountSummary() {
    return `
========================================
      REWARDS DINING ACCOUNT
========================================
Account Number: ${this.accountNumber}
Current Balance: K${this.getBalance().toFixed(2)}
Reward Rate: ${this.#rewardRate}%
========================================`;
  }
}

module.exports = RewardsDiningAccount;