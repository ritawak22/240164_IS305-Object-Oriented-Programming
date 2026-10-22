const User = require('./User');
class StudentRequester extends User {
  constructor(userId, firstName, lastName, email, programme, year) {
    super(userId, firstName, lastName, email, "Student");
    this.programme = programme; this.year = year;
  }
}
module.exports = StudentRequester;