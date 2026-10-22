const ServiceRequest = require('./ServiceRequest');

class ICTSupportRequest extends ServiceRequest {
  constructor(commonData, deviceType, systemName, faultType, networkImpact) {
    super(commonData.requestId, commonData.requester, commonData.title, commonData.description, commonData.location, "ICT Support", commonData.priority);
    this.deviceType = deviceType; this.systemName = systemName; this.faultType = faultType; this.networkImpact = networkImpact;
  }
  calculatePriorityScore() { return this.priority === "Urgent" ? 100 : 50; }
  getTargetResolutionHours() { return 4; }
  getRequestSummary() { return `[ICT] ID: ${this.requestId} | ${this.title} | Status: ${this.status}`; }
}

class MaintenanceRequest extends ServiceRequest {
  constructor(commonData, building, roomNumber, hazardLevel, equipmentAffected) {
    super(commonData.requestId, commonData.requester, commonData.title, commonData.description, commonData.location, "Facilities Maintenance", commonData.priority);
    this.building = building; this.roomNumber = roomNumber; this.hazardLevel = hazardLevel; this.equipmentAffected = equipmentAffected;
  }
  calculatePriorityScore() { return this.hazardLevel === "High" ? 90 : 30; }
  getTargetResolutionHours() { return 24; } 
  getRequestSummary() { return `[Maintenance] ID: ${this.requestId} | ${this.title} | Status: ${this.status}`; }
}

class CleaningRequest extends ServiceRequest {
  constructor(commonData, cleaningArea, hygieneRisk, serviceType, preferredTime) {
    super(commonData.requestId, commonData.requester, commonData.title, commonData.description, commonData.location, "Cleaning and Sanitation", commonData.priority);
    this.cleaningArea = cleaningArea; this.hygieneRisk = hygieneRisk; this.serviceType = serviceType; this.preferredTime = preferredTime;
  }
  calculatePriorityScore() { return this.hygieneRisk === "High" ? 80 : 20; }
  getTargetResolutionHours() { return 12; }
  getRequestSummary() { return `[Cleaning] ID: ${this.requestId} | ${this.title} | Status: ${this.status}`; }
}

module.exports = { ICTSupportRequest, MaintenanceRequest, CleaningRequest };