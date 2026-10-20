const User = require('./User');

class Technician extends User {
  constructor(userId, firstName, lastName, email, technicalSpeciality) {
    super(userId, firstName, lastName, email, "Technician");
    this.technicalSpeciality = technicalSpeciality;
  }
}
module.exports = Technician;
