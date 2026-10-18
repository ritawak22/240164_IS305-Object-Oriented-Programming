class User {
  #userId;
  #firstName;
  #lastName;
  #email;
  #userType;

  constructor(userId, firstName, lastName, email, userType) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userType = userType || "Student"; 
  }

  get userId() { return this.#userId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }
  get email() { return this.#email; }
  get userType() { return this.#userType; }

  set userId(value) { this.#userId = value; }
  set firstName(value) { this.#firstName = value; }
  set lastName(value) { this.#lastName = value; }
  set email(value) { this.#email = value; }
  set userType(value) { this.#userType = value; }

  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  validate() {
    if (!this.#userId || this.#userId.trim() === "") return "User ID is required.";
    if (!this.#firstName || this.#firstName.trim() === "") return "First name is required.";
    if (!this.#lastName || this.#lastName.trim() === "") return "Last name is required.";
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.#email || !emailRegex.test(this.#email)) return "Invalid email address.";
    
    return null; // Return null means no errors
  }

  displayInfo() {
    return `User ID: ${this.#userId} | Name: ${this.getFullName()} | Email: ${this.#email} | Type: ${this.#userType}`;
  }
}

module.exports = User;