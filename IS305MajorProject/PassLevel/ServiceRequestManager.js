class ServiceRequestManager {
  constructor() {
    this.users = [];
    this.requests = [];
  }

  registerUser(user) {
    // Check for duplicate User ID
    const existingUser = this.users.find(u => u.userId === user.userId);
    if (existingUser) {
      return { success: false, message: "Error: User ID already exists." };
    }

    const validationError = user.validate();
    if (validationError) {
      return { success: false, message: `Error: ${validationError}` };
    }

    this.users.push(user);
    return { success: true, message: "User added successfully." };
  }

  findUserById(userId) {
    return this.users.find(u => u.userId === userId);
  }

  submitRequest(request) {
    // Check for duplicate Request ID
    const existingRequest = this.requests.find(r => r.requestId === request.requestId);
    if (existingRequest) {
      return { success: false, message: "Error: Request ID already exists." };
    }

    const validationError = request.validate();
    if (validationError) {
      return { success: false, message: `Error: ${validationError}` };
    }

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

  updateRequest(requestId, userId, changes) {
    const request = this.findRequestById(requestId);
    if (!request) return { success: false, message: "Request not found." };
    
    // Security check: ensure only the creator can update
    if (request.requester.userId !== userId) {
      return { success: false, message: "Error: You can only update your own requests." };
    }
    
    if (request.status === "Cancelled") {
       return { success: false, message: "Error: Cannot update a cancelled request." };
    }

    request.updateDetails(changes);
    return { success: true, message: "Request updated successfully." };
  }

  cancelRequest(requestId, userId) {
    const request = this.findRequestById(requestId);
    if (!request) return { success: false, message: "Request not found." };

    // Security check: ensure only the creator can cancel
    if (request.requester.userId !== userId) {
      return { success: false, message: "Error: You can only cancel your own requests." };
    }

    if (request.status === "Cancelled") {
      return { success: false, message: "Error: Request is already cancelled." };
    }

    request.cancelRequest();
    return { success: true, message: "Request cancelled successfully." };
  }

  searchRequests(searchText) {
    const lowerSearch = searchText.toLowerCase();
    return this.requests.filter(r => 
      r.title.toLowerCase().includes(lowerSearch) || 
      r.description.toLowerCase().includes(lowerSearch) ||
      r.category.toLowerCase().includes(lowerSearch)
    );
  }

  getRequestSummaryByStatus() {
    const summary = {};
    this.requests.forEach(r => {
      if (!summary[r.status]) summary[r.status] = 0;
      summary[r.status]++;
    });
    return summary;
  }
}

module.exports = ServiceRequestManager;