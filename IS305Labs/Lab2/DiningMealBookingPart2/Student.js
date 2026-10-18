class Student {
  #studentId;
  #firstName;
  #lastName;

  constructor(studentId, firstName, lastName) {
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get studentId() { return this.#studentId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }

  set studentId(value) {
    if (!value || value.trim() === "") throw new Error("Student ID cannot be empty.");
    this.#studentId = value;
  }

  set firstName(value) {
    if (!value || value.trim() === "") throw new Error("First name cannot be empty.");
    this.#firstName = value;
  }

  set lastName(value) {
    if (!value || value.trim() === "") throw new Error("Last name cannot be empty.");
    this.#lastName = value;
  }

  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    return `
========================================
             STUDENT INFORMATION
========================================
Student ID: ${this.#studentId}
Student Name: ${this.getFullName()}
`;
  }

  // Controlled update method (Task 4)
  updateName(newFirstName, newLastName) {
    this.firstName = newFirstName;
    this.lastName = newLastName;
  }
}

module.exports = Student;
