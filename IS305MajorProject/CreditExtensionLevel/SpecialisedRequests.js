const ServiceRequest = require('./ServiceRequest');

class ICTSupportRequest extends ServiceRequest {
  constructor(commonData, deviceType, systemName, faultType, networkImpact) {
    super(commonData.requestId, commonData.requester, commonData.title, commonData.description, commonData.location, "ICT Support", commonData.priority);
    this.deviceType = deviceType;
    this.systemName = systemName;
    this.faultType = faultType;
    this.networkImpact = networkImpact;
  }

  // Method Overriding
  getRequestSummary() {
    return `
[ICT SUPPORT REQUEST]
ID: ${this.requestId} | Status: ${this.status} | Priority: ${this.priority}
Title: ${this.title}
Requester: ${this.requester.getFullName()}
Device: ${this.deviceType} | System: ${this.systemName}
Fault: ${this.faultType} | Network Impact: ${this.networkImpact}
Description: ${this.description}`;
  }
}

class MaintenanceRequest extends ServiceRequest {
  constructor(commonData, building, roomNumber, hazardLevel, equipmentAffected) {
    super(commonData.requestId, commonData.requester, commonData.title, commonData.description, commonData.location, "Facilities Maintenance", commonData.priority);
    this.building = building;
    this.roomNumber = roomNumber;
    this.hazardLevel = hazardLevel;
    this.equipmentAffected = equipmentAffected;
  }

  getRequestSummary() {
    return `
[MAINTENANCE REQUEST]
ID: ${this.requestId} | Status: ${this.status} | Priority: ${this.priority}
Title: ${this.title}
Requester: ${this.requester.getFullName()}
Location: ${this.building}, Room: ${this.roomNumber}
Hazard Level: ${this.hazardLevel} | Equipment: ${this.equipmentAffected}
Description: ${this.description}`;
  }
}

class CleaningRequest extends ServiceRequest {
  constructor(commonData, cleaningArea, hygieneRisk, serviceType, preferredTime) {
    super(commonData.requestId, commonData.requester, commonData.title, commonData.description, commonData.location, "Cleaning and Sanitation", commonData.priority);
    this.cleaningArea = cleaningArea;
    this.hygieneRisk = hygieneRisk;
    this.serviceType = serviceType;
    this.preferredTime = preferredTime;
  }

  getRequestSummary() {
    return `
[CLEANING REQUEST]
ID: ${this.requestId} | Status: ${this.status} | Priority: ${this.priority}
Title: ${this.title}
Requester: ${this.requester.getFullName()}
Area: ${this.cleaningArea} | Hygiene Risk: ${this.hygieneRisk}
Service Type: ${this.serviceType} | Preferred Time: ${this.preferredTime}
Description: ${this.description}`;
  }
}

module.exports = { ICTSupportRequest, MaintenanceRequest, CleaningRequest };