class ServiceRequestManager {
  constructor() { this.users = []; this.requests = []; }

  registerUser(user) {
    if (this.users.find(u => u.userId === user.userId)) return { success: false, message: "Error: User ID exists." };
    this.users.push(user);
    return { success: true, message: "User added successfully." };
  }
  findUserById(userId) { return this.users.find(u => u.userId === userId); }

  submitRequest(request) {
    if (this.requests.find(r => r.requestId === request.requestId)) return { success: false, message: "Error: Request ID exists." };
    this.requests.push(request);
    return { success: true, message: "Request submitted successfully." };
  }
  findRequestById(requestId) { return this.requests.find(r => r.requestId === requestId); }
  getRequestsByUser(userId) { return this.requests.filter(r => r.requester.userId === userId); }
  getAllRequests() { return this.requests; }

  reviewRequest(requestId, officerId) {
    const req = this.findRequestById(requestId);
    const officer = this.findUserById(officerId);
    if (!req) return "Error: Request not found.";
    if (!officer || officer.userType !== "Service Officer") return "Error: User is not a Service Officer.";
    if (req.reviewRequest(officerId)) return "Request reviewed successfully.";
    return "Error: Cannot review request in its current state.";
  }
  assignTechnician(requestId, officerId, techId) {
    const req = this.findRequestById(requestId); const officer = this.findUserById(officerId); const tech = this.findUserById(techId);
    if (!req) return "Error: Request not found.";
    if (!officer || officer.userType !== "Service Officer") return "Error: Only Service Officers can assign technicians.";
    if (!tech || tech.userType !== "Technician") return "Error: Invalid Technician ID.";
    if (req.assignTechnician(techId)) return `Technician ${tech.getFullName()} assigned successfully.`;
    return "Error: Cannot assign technician at this stage.";
  }
  startWork(requestId, techId) {
    const req = this.findRequestById(requestId);
    if (!req) return "Error: Request not found.";
    if (req.startWork(techId)) return "Work started. Status: In Progress.";
    return "Error: Only the assigned technician can start work, and status must be 'Assigned'.";
  }
  resolveRequest(requestId, techId, notes) {
    const req = this.findRequestById(requestId);
    if (!req) return "Error: Request not found.";
    if (req.resolveRequest(techId, notes)) return "Request resolved successfully.";
    return "Error: Only the assigned technician can resolve work.";
  }
  closeRequest(requestId, officerId) {
    const req = this.findRequestById(requestId); const officer = this.findUserById(officerId);
    if (!req) return "Error: Request not found.";
    if (!officer || officer.userType !== "Service Officer") return "Error: User is not a Service Officer.";
    if (req.closeRequest(officerId)) return "Request verified and closed.";
    return "Error: Request must be Resolved before it can be closed.";
  }
  cancelRequest(requestId, userId) {
    const req = this.findRequestById(requestId);
    if (!req) return "Error: Request not found.";
    if (req.requester.userId !== userId) return "Error: You can only cancel your own requests.";
    if (req.cancelRequest(userId)) return "Request cancelled successfully.";
    return "Error: Cannot cancel. Only 'Submitted' requests can be cancelled.";
  }

  generateReports() {
    return {
      byStatus: this.requests.reduce((acc, req) => { acc[req.status] = (acc[req.status] || 0) + 1; return acc; }, {}),
      byCategory: this.requests.reduce((acc, req) => { acc[req.category] = (acc[req.category] || 0) + 1; return acc; }, {}),
      urgent: this.requests.filter(r => r.priority === "Urgent").length,
      byTechnician: this.requests.filter(r => r.assignedTechnician).reduce((acc, req) => { acc[req.assignedTechnician] = (acc[req.assignedTechnician] || 0) + 1; return acc; }, {})
    };
  }
}
module.exports = ServiceRequestManager;