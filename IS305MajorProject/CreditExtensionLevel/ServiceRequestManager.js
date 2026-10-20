class ServiceRequestManager {
  constructor() {
    this.users = [];
    this.requests = [];
  }

  registerUser(user) {
    if (this.users.find(u => u.userId === user.userId)) return { success: false, message: "Error: User ID exists." };
    this.users.push(user);
    return { success: true, message: "User added successfully." };
  }

  findUserById(userId) {
    return this.users.find(u => u.userId === userId);
  }

  submitRequest(request) {
    if (this.requests.find(r => r.requestId === request.requestId)) return { success: false, message: "Error: Request ID exists." };
    this.requests.push(request);
    return { success: true, message: "Request submitted successfully." };
  }

  findRequestById(requestId) {
    return this.requests.find(r => r.requestId === requestId);
  }

  getRequestsByUser(userId) {
    return this.requests.filter(r => r.requester.userId === userId);
  }

  getAllRequests() {
    return this.requests;
  }

  // --- WORKFLOW METHODS ---
  reviewRequest(requestId, officerId) {
    const req = this.findRequestById(requestId);
    const officer = this.findUserById(officerId);
    if (!req || !officer || officer.userType !== "Service Officer") return "Error: Invalid request or user is not a Service Officer.";
    
    if (req.reviewRequest(officerId)) return "Request reviewed successfully.";
    return "Error: Cannot review request in its current state.";
  }

  assignTechnician(requestId, officerId, techId) {
    const req = this.findRequestById(requestId);
    const officer = this.findUserById(officerId);
    const tech = this.findUserById(techId);

    if (!officer || officer.userType !== "Service Officer") return "Error: Only Service Officers can assign technicians.";
    if (!tech || tech.userType !== "Technician") return "Error: Invalid Technician ID.";
    
    if (req.assignTechnician(techId)) return `Technician ${tech.getFullName()} assigned successfully.`;
    return "Error: Cannot assign technician at this stage.";
  }

  startWork(requestId, techId) {
    const req = this.findRequestById(requestId);
    if (req.startWork(techId)) return "Work started. Status: In Progress.";
    return "Error: Only the assigned technician can start work, and status must be 'Assigned'.";
  }

  resolveRequest(requestId, techId, notes) {
    const req = this.findRequestById(requestId);
    if (req.resolveRequest(techId, notes)) return "Request resolved successfully.";
    return "Error: Only the assigned technician can resolve work.";
  }

  closeRequest(requestId, officerId) {
    const req = this.findRequestById(requestId);
    const officer = this.findUserById(officerId);

    if (!officer || officer.userType !== "Service Officer") return "Error: Only Service Officers can close requests.";
    
    if (req.closeRequest(officerId)) return "Request verified and closed.";
    return "Error: Request must be Resolved before it can be closed.";
  }

  cancelRequest(requestId, userId) {
    const req = this.findRequestById(requestId);
    if (req.requester.userId !== userId) return "Error: You can only cancel your own requests.";
    if (req.cancelRequest(userId)) return "Request cancelled successfully.";
    return "Error: Cannot cancel. Only 'Submitted' requests can be cancelled.";
  }

  // --- SEARCH, FILTER, SORT (Task 7) ---
  searchAndFilter({ searchText, category, status, priority, technicianId, sortBy }) {
    let results = [...this.requests];

    if (searchText) {
      const lower = searchText.toLowerCase();
      results = results.filter(r => r.requestId.toLowerCase().includes(lower) || r.title.toLowerCase().includes(lower));
    }
    if (category) results = results.filter(r => r.category === category);
    if (status) results = results.filter(r => r.status === status);
    if (priority) results = results.filter(r => r.priority === priority);
    if (technicianId) results = results.filter(r => r.assignedTechnician === technicianId);

    if (sortBy === "date") {
      results.sort((a, b) => new Date(a.history[0].dateTime) - new Date(b.history[0].dateTime));
    } else if (sortBy === "priority") {
      const priorityOrder = { "Urgent": 4, "High": 3, "Normal": 2, "Low": 1 };
      results.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    return results;
  }
}

module.exports = ServiceRequestManager;