const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require('./SpecialisedRequests');

class ServiceRequestFactory {
  static createFromData(data, userObject) {
    const commonData = { requestId: data.requestId, requester: userObject, title: data.title, description: data.description, location: data.location, priority: data.priority };
    if (data.requestType === "ICTSupportRequest") return new ICTSupportRequest(commonData, "Unknown", "Unknown", "Unknown", "Unknown");
    if (data.requestType === "MaintenanceRequest") return new MaintenanceRequest(commonData, "Unknown", "Unknown", "Unknown", "Unknown");
    if (data.requestType === "CleaningRequest") return new CleaningRequest(commonData, "Unknown", "Unknown", "Unknown", "Unknown");
    throw new Error("Unknown request type.");
  }
}
module.exports = ServiceRequestFactory;