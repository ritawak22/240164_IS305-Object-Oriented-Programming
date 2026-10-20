const User = require('./User');

class ServiceOfficer extends User {
  constructor(userId, firstName, lastName, email, serviceSection) {
    super(userId, firstName, lastName, email, "Service Officer");
    this.serviceSection = serviceSection;
  }
}
module.exports = ServiceOfficer;
