class ServiceRequest {
  #requestId; #requester; #title; #description; #campusLocation; 
  #category; #priority; #status; #dateSubmitted; #dateUpdated; #history; #assignedTechnician;

  constructor(requestId, requester, title, description, campusLocation, category, priority) {
    this.#requestId = requestId;
    this.#requester = requester; 
    this.#title = title;
    this.#description = description;
    this.#campusLocation = campusLocation;
    this.#category = category;
    this.#priority = priority;
    this.#status = "Submitted"; 
    this.#dateSubmitted = new Date().toISOString();
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
  get assignedTechnician() { return this.#assignedTechnician; }
  get dateSubmitted() { return this.#dateSubmitted; }
  get history() { return this.#history; }

  // Abstract Methods (throw error if subclass doesn't implement)
  calculatePriorityScore() { throw new Error("Method 'calculatePriorityScore()' must be implemented."); }
  getTargetResolutionHours() { throw new Error("Method 'getTargetResolutionHours()' must be implemented."); }
  getRequestSummary() { throw new Error("Method 'getRequestSummary()' must be implemented."); }

  recordHistory(action, newStatus, actorId, comment) {
    this.#history.push({ 
      previousStatus: this.#status, 
      newStatus: newStatus || this.#status, 
      action: action, 
      actorId: actorId, 
      comment: comment, 
      dateTime: new Date().toISOString() 
    });
  }

  reviewRequest(officerId) { 
    if (this.#status !== "Submitted") return false; 
    this.recordHistory("Reviewed", "Reviewed", officerId, "Request reviewed."); 
    this.#status = "Reviewed"; 
    return true; 
  }
  
  assignTechnician(techId) { 
    if (this.#status !== "Reviewed") return false; 
    this.#assignedTechnician = techId; 
    this.recordHistory("Assigned", "Assigned", techId, `Technician assigned.`); 
    this.#status = "Assigned"; 
    return true; 
  }
  
  startWork(techId) { 
    if (this.#status !== "Assigned" || this.#assignedTechnician !== techId) return false; 
    this.recordHistory("Work Started", "In Progress", techId, "Work started."); 
    this.#status = "In Progress"; 
    return true; 
  }
  
  resolveRequest(techId, notes) { 
    if (this.#status !== "In Progress" || this.#assignedTechnician !== techId) return false; 
    this.recordHistory("Resolved", "Resolved", techId, notes); 
    this.#status = "Resolved"; 
    return true; 
  }
  
  closeRequest(officerId) { 
    if (this.#status !== "Resolved") return false; 
    this.recordHistory("Closed", "Closed", officerId, "Request closed."); 
    this.#status = "Closed"; 
    return true; 
  }
  
  cancelRequest(userId) { 
    if (this.#status !== "Submitted") return false; 
    this.recordHistory("Cancelled", "Cancelled", userId, "Request cancelled."); 
    this.#status = "Cancelled"; 
    return true; 
  }
  
  // Used for saving the main request data
  toJSON() {
    return {
      requestId: this.#requestId, 
      requestType: this.constructor.name, 
      requesterId: this.#requester.userId,
      title: this.#title, 
      description: this.#description, 
      location: this.#campusLocation,
      category: this.#category, 
      priority: this.#priority, 
      status: this.#status,
      assignedTechnicianId: this.#assignedTechnician, 
      dateSubmitted: this.#dateSubmitted
    };
  }

  // --- NEW METHOD ADDED FOR TASK 3 (JSON SAVING) ---
  getHistoryData() {
    return this.#history;
  }
}

module.exports = ServiceRequest;