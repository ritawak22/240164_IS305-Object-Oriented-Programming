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
  #history;
  #assignedTechnician;

  constructor(requestId, requester, title, description, campusLocation, category, priority) {
    this.#requestId = requestId;
    this.#requester = requester; 
    this.#title = title;
    this.#description = description;
    this.#campusLocation = campusLocation;
    this.#category = category;
    this.#priority = priority;
    this.#status = "Submitted"; 
    this.#dateSubmitted = new Date().toLocaleString();
    this.#dateUpdated = this.#dateSubmitted;
    this.#history = [];
    this.#assignedTechnician = null;
    
    this.recordHistory("Created", "Submitted", requester.userId, "Request initially submitted.");
  }

  get requestId() { return this.#requestId; }
  get requester() { return this.#requester; }
  get status() { return this.#status; }
  get category() { return this.#category; }
  get priority() { return this.#priority; }
  get title() { return this.#title; }
  get description() { return this.#description; }
  get history() { return this.#history; }
  get assignedTechnician() { return this.#assignedTechnician; }

  recordHistory(action, newStatus, actorId, comment) {
    this.#history.push({
      previousStatus: this.#status,
      newStatus: newStatus || this.#status,
      action: action,
      actorId: actorId,
      comment: comment,
      dateTime: new Date().toLocaleString()
    });
  }

  // --- STATUS WORKFLOW METHODS ---
  reviewRequest(officerId) {
    if (this.#status !== "Submitted") return false;
    this.recordHistory("Reviewed", "Reviewed", officerId, "Request reviewed by Service Officer.");
    this.#status = "Reviewed";
    return true;
  }

  assignTechnician(techId) {
    if (this.#status !== "Reviewed" && this.#status !== "Assigned") return false;
    this.#assignedTechnician = techId;
    this.recordHistory("Assigned", "Assigned", techId, `Technician assigned.`);
    this.#status = "Assigned";
    return true;
  }

  startWork(techId) {
    if (this.#status !== "Assigned" || this.#assignedTechnician !== techId) return false;
    this.recordHistory("Work Started", "In Progress", techId, "Technician started work.");
    this.#status = "In Progress";
    return true;
  }

  resolveRequest(techId, notes) {
    if (this.#status !== "In Progress" || this.#assignedTechnician !== techId) return false;
    this.recordHistory("Resolved", "Resolved", techId, `Resolution notes: ${notes}`);
    this.#status = "Resolved";
    return true;
  }

  closeRequest(officerId) {
    if (this.#status !== "Resolved") return false;
    this.recordHistory("Closed", "Closed", officerId, "Request verified and closed.");
    this.#status = "Closed";
    return true;
  }

  cancelRequest(userId) {
    if (this.#status !== "Submitted") return false;
    this.recordHistory("Cancelled", "Cancelled", userId, "Request cancelled by user.");
    this.#status = "Cancelled";
    return true;
  }

  updateDetails(changes, userId) {
    if (this.#status !== "Submitted") return false;
    if (changes.title) this.#title = changes.title;
    if (changes.description) this.#description = changes.description;
    this.recordHistory("Updated", this.#status, userId, "Details updated.");
    return true;
  }

  getRequestSummary() {
    return `ID: ${this.#requestId} | Title: ${this.#title} | Status: ${this.#status}`;
  }
}

module.exports = ServiceRequest;