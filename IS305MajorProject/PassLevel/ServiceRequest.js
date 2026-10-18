class ServiceRequest {
  #requestId;
  #requester;
  #title;
  #description;
  #campusLocation;
  #category;
  #priority;
  #status;
  #dateSubmitted;
  #dateUpdated;

  constructor(requestId, requester, title, description, campusLocation, category, priority) {
    this.#requestId = requestId;
    this.#requester = requester; // This will be the User object
    this.#title = title;
    this.#description = description;
    this.#campusLocation = campusLocation;
    this.#category = category;
    this.#priority = priority;
    this.#status = "Submitted"; // Default status
    this.#dateSubmitted = new Date().toLocaleString();
    this.#dateUpdated = this.#dateSubmitted;
  }

  // Getters
  get requestId() { return this.#requestId; }
  get requester() { return this.#requester; }
  get status() { return this.#status; }
  get category() { return this.#category; }
  get priority() { return this.#priority; }
  get title() { return this.#title; }
  get description() { return this.#description; }
  get campusLocation() { return this.#campusLocation; }

  validate() {
    const validCategories = ["ICT Support", "Facilities Maintenance", "Cleaning and Sanitation", "General Campus Service"];
    const validPriorities = ["Low", "Normal", "High", "Urgent"];

    if (!this.#requestId || this.#requestId.trim() === "") return "Request ID is required.";
    if (!this.#title || this.#title.trim() === "") return "Request title is required.";
    if (!this.#description || this.#description.trim() === "") return "Request description is required.";
    if (!validCategories.includes(this.#category)) return "Unsupported category.";
    if (!validPriorities.includes(this.#priority)) return "Unsupported priority value.";

    return null;
  }

  updateDetails(changes) {
    if (changes.title) this.#title = changes.title;
    if (changes.description) this.#description = changes.description;
    if (changes.campusLocation) this.#campusLocation = changes.campusLocation;
    if (changes.category) this.#category = changes.category;
    if (changes.priority) this.#priority = changes.priority;
    
    this.#dateUpdated = new Date().toLocaleString();
    return true;
  }

  cancelRequest() {
    if (this.#status === "Cancelled") {
      return false; // Already cancelled
    }
    this.#status = "Cancelled";
    this.#dateUpdated = new Date().toLocaleString();
    return true;
  }

  getRequestSummary() {
    return `
----------------------------------------
Request ID: ${this.#requestId}
Title: ${this.#title}
Requester: ${this.#requester.getFullName()} (${this.#requester.userId})
Category: ${this.#category}
Priority: ${this.#priority}
Location: ${this.#campusLocation}
Status: ${this.#status}
Description: ${this.#description}
Submitted: ${this.#dateSubmitted}
Last Updated: ${this.#dateUpdated}
----------------------------------------`;
  }
}

module.exports = ServiceRequest;