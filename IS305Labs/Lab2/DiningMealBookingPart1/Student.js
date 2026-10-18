/*
  Program: Student Class
  Student Name: Rita WAK
  Student ID: 240164
  Description: A JavaScript class for Student with private fields.
*/

class Student {
  // Private fields
  #studentId;
  #firstName;
  #lastName;

  constructor(studentId, firstName, lastName) {
    // Using setters in the constructor allows validation to run immediately
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Getters
  get studentId() {
    return this.#studentId;
  }

  get firstName() {
    return this.#firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  // Setters with validation (rejecting empty values)
  set studentId(value) {
    if (!value || value.trim() === "") {
      throw new Error("Student ID cannot be empty.");
    }
    this.#studentId = value;
  }

  set firstName(value) {
    if (!value || value.trim() === "") {
      throw new Error("First name cannot be empty.");
    }
    this.#firstName = value;
  }

  set lastName(value) {
    if (!value || value.trim() === "") {
      throw new Error("Last name cannot be empty.");
    }
    this.#lastName = value;
  }

  // Required Methods
  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    return `
========================================
             STUDENT DETAILS
========================================
Student ID: ${this.#studentId}
Student Name: ${this.getFullName()}
========================================`;
  }
}

module.exports = Student;
