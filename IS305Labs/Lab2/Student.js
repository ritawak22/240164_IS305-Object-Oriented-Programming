class Student {
    #studentID;
    #studentName;

    constructor(studentID, studentName) {
        this.#studentID = studentID;
        this.#studentName = studentName;
    }

    get studentID() {
        return this.#studentID;
    }

    get studentName() {
        return this.#studentName;
    }

    set studentName(name) {
        this.#studentName = name;
    }
}

module.exports = Student;
