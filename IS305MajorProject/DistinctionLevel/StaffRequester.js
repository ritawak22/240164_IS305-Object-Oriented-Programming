const User = require('./User');
class StaffRequester extends User {
  constructor(userId, firstName, lastName, email, department) {
    super(userId, firstName, lastName, email, "Staff");
    this.department = department;
  }
}
module.exports = StaffRequester;