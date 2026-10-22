class User {
  #userId; #firstName; #lastName; #email; #userType;

  constructor(userId, firstName, lastName, email, userType) {
    this.#userId = userId; this.#firstName = firstName; this.#lastName = lastName; this.#email = email; this.#userType = userType;
  }
  get userId() { return this.#userId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }
  get email() { return this.#email; }
  get userType() { return this.#userType; }
  set userId(v) { this.#userId = v; }
  set firstName(v) { this.#firstName = v; }
  set lastName(v) { this.#lastName = v; }
  set email(v) { this.#email = v; }
  getFullName() { return `${this.#firstName} ${this.#lastName}`; }
  validate() {
    if (!this.#userId || this.#userId.trim() === "") return "User ID is required.";
    if (!this.#firstName || this.#firstName.trim() === "") return "First name is required.";
    if (!this.#lastName || this.#lastName.trim() === "") return "Last name is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.#email || !emailRegex.test(this.#email)) return "Invalid email address.";
    return null;
  }
  toJSON() { return { userId: this.#userId, firstName: this.#firstName, lastName: this.#lastName, email: this.#email, userType: this.#userType }; }
}
module.exports = User;