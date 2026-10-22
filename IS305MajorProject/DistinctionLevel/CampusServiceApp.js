const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const StudentRequester = require("./StudentRequester");
const ServiceOfficer = require("./ServiceOfficer");
const Technician = require("./Technician");
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require("./SpecialisedRequests");
const ServiceRequestManager = require("./ServiceRequestManager");
const UserFileRepository = require("./repositories/UserFileRepository");
const ServiceRequestFileRepository = require("./repositories/ServiceRequestFileRepository");
const AuditFileRepository = require("./repositories/AuditFileRepository");
const RequestHistoryRepository = require("./repositories/RequestHistoryRepository");
const ServiceRequestFactory = require("./ServiceRequestFactory");

const rl = readline.createInterface({ input, output });
const manager = new ServiceRequestManager();
const userRepo = new UserFileRepository();
const reqRepo = new ServiceRequestFileRepository();
const auditRepo = new AuditFileRepository();
const historyRepo = new RequestHistoryRepository();

async function initializeData() {
  try {
    console.log("Loading data from files...");
    const users = await userRepo.loadAll();
    users.forEach(u => {
      if (u.userType === "Student") manager.registerUser(new StudentRequester(u.userId, u.firstName, u.lastName, u.email, "Prog", 1));
      if (u.userType === "Service Officer") manager.registerUser(new ServiceOfficer(u.userId, u.firstName, u.lastName, u.email, "Section"));
      if (u.userType === "Technician") manager.registerUser(new Technician(u.userId, u.firstName, u.lastName, u.email, "Tech"));
    });

    const requestsData = await reqRepo.loadAll();
    requestsData.forEach(data => {
      const user = manager.findUserById(data.requesterId);
      if (user) manager.submitRequest(ServiceRequestFactory.createFromData(data, user));
    });

    if (manager.users.length === 0) {
      manager.registerUser(new StudentRequester("S1", "Rita", "Wak", "rita@dwu.ac.pg", "IT", 2));
      manager.registerUser(new ServiceOfficer("O1", "Officer", "John", "john@dwu.ac.pg", "ICT"));
      manager.registerUser(new Technician("T1", "Tech", "Dave", "dave@dwu.ac.pg", "Hardware"));
      await userRepo.saveAll(manager.users);
    }
  } catch (err) {
    console.error("CRITICAL ERROR LOADING DATA:", err.message);
  }
}

// Helper to save all history and audit logs whenever a change happens
async function saveState(actorId, action, requestId, description) {
    await reqRepo.saveAll(manager.requests);
    
    // Save all request histories to requestHistory.json
    const allHistories = manager.requests.map(r => ({ requestId: r.requestId, history: r.getHistoryData() }));
    await historyRepo.saveAll(allHistories);
    
    // Log to auditLog.json
    await auditRepo.log(actorId, action, requestId, description, "SUCCESS");
}

async function main() {
  await initializeData();
  let running = true;

  while (running) {
    console.log(`\n--- LOGIN (S1, O1, T1) | 'exit' to quit ---`);
    const loginId = await rl.question("Enter User ID: ");
    if (loginId.toLowerCase() === 'exit') break;

    const currentUser = manager.findUserById(loginId);
    if (!currentUser) { console.log("User not found."); continue; }

    console.log(`\nWelcome, ${currentUser.getFullName()}`);
    let loggedIn = true;

    while (loggedIn) {
      if (currentUser.userType === "Student" || currentUser.userType === "Staff") {
        console.log(`\n1. Submit Request | 2. View My Requests | 3. Cancel | 4. Logout`);
        const choice = await rl.question("Select: ");
        if (choice === "4") { loggedIn = false; break; }
        
        if (choice === "1") {
            const requestId = `REQ-${manager.getAllRequests().length + 1}`;
            const title = await rl.question("Title: ");
            const desc = await rl.question("Desc: ");
            const loc = await rl.question("Loc: ");
            const prio = await rl.question("Priority (Low/Normal/High/Urgent): ");
            const common = { requestId, requester: currentUser, title, description: desc, location: loc, priority: prio };
            const newReq = new ICTSupportRequest(common, "Laptop", "Win", "Fault", "Yes");
            const res = manager.submitRequest(newReq);
            if(res.success) await saveState(currentUser.userId, "REQUEST_CREATED", requestId, "New request submitted");
            console.log(res.message);
        }
        if(choice === "2") manager.getRequestsByUser(currentUser.userId).forEach(r => console.log(r.getRequestSummary()));
        if(choice === "3") {
            const id = await rl.question("Req ID: ");
            const res = manager.cancelRequest(id, currentUser.userId);
            if(res.includes("success")) await saveState(currentUser.userId, "REQUEST_CANCELLED", id, "Request cancelled");
            console.log(res);
        }
      } 
      else if (currentUser.userType === "Service Officer") {
        console.log(`\n1. Review | 2. Assign Tech | 3. Close | 4. Reports | 5. Polymorphic Demo | 6. Logout`);
        const choice = await rl.question("Select: ");
        if (choice === "6") { loggedIn = false; break; }
        
        if (choice === "1") {
           const id = await rl.question("Req ID: ");
           const res = manager.reviewRequest(id, currentUser.userId);
           if(res.includes("success")) await saveState(currentUser.userId, "REVIEW", id, "Officer reviewed request");
           console.log(res);
        }
        if (choice === "2") {
           const id = await rl.question("Req ID: ");
           const tech = await rl.question("Tech ID: ");
           const res = manager.assignTechnician(id, currentUser.userId, tech);
           if(res.includes("success")) await saveState(currentUser.userId, "ASSIGN", id, `Assigned to ${tech}`);
           console.log(res);
        }
        if (choice === "3") {
           const id = await rl.question("Req ID: ");
           const res = manager.closeRequest(id, currentUser.userId);
           if(res.includes("success")) await saveState(currentUser.userId, "CLOSE", id, "Request closed");
           console.log(res);
        }
        if (choice === "4") console.log(manager.generateReports());
        
        if (choice === "5") {
            // TASK 1: EXACT POLYMORPHISM LOOP REQUIRED BY INSTRUCTIONS
            console.log("\n--- Polymorphic Demonstration ---");
            for (const request of manager.getAllRequests()) {
                console.log(request.getRequestSummary());
                console.log(`Priority Score: ${request.calculatePriorityScore()}`);
                console.log(`Target Hours: ${request.getTargetResolutionHours()}`);
                console.log("---");
            }
        }
      } 
      else if (currentUser.userType === "Technician") {
        console.log(`\n1. Start Work | 2. Resolve | 3. Logout`);
        const choice = await rl.question("Select: ");
        if (choice === "3") { loggedIn = false; break; }
        
        if (choice === "1") {
           const id = await rl.question("Req ID: ");
           const res = manager.startWork(id, currentUser.userId);
           if(res.includes("success")) await saveState(currentUser.userId, "START_WORK", id, "Work started");
           console.log(res);
        }
        if (choice === "2") {
           const id = await rl.question("Req ID: ");
           const notes = await rl.question("Notes: ");
           const res = manager.resolveRequest(id, currentUser.userId, notes);
           if(res.includes("success")) await saveState(currentUser.userId, "RESOLVE", id, notes);
           console.log(res);
        }
      }
    }
  }
  rl.close();
}
main();