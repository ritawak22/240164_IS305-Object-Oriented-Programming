const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const StudentRequester = require("./StudentRequester");
const StaffRequester = require("./StaffRequester");
const ServiceOfficer = require("./ServiceOfficer");
const Technician = require("./Technician");
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require("./SpecialisedRequests");
const ServiceRequestManager = require("./ServiceRequestManager");

const rl = readline.createInterface({ input, output });
const manager = new ServiceRequestManager();

// Seed some initial users so you can test immediately
manager.registerUser(new StudentRequester("S1", "Rita", "Wak", "rita@dwu.ac.pg", "IT", 2));
manager.registerUser(new ServiceOfficer("O1", "Officer", "John", "john@dwu.ac.pg", "ICT"));
manager.registerUser(new Technician("T1", "Tech", "Dave", "dave@dwu.ac.pg", "Hardware"));
function generateId(prefix, array) { return `${prefix}-${array.length + 1}`; }

async function main() {
  let running = true;

  while (running) {
    console.log(`
========================================
    CAMPUS SERVICE REQUEST SYSTEM
========================================
--- QUICK LOGIN FOR TESTING ---
Student Requester : S1
Service Officer   : O1
Technician        : T1
-------------------------------
Type 'new' to register a new user
Type 'exit' to quit
========================================`);

    const loginId = await rl.question("Enter your User ID to login: ");
    
    if (loginId.toLowerCase() === 'exit') break;

    // --- NEW: REGISTER USER OPTION ---
    if (loginId.toLowerCase() === 'new') {
      console.log("\n--- Register New User ---");
      const newId = await rl.question("Enter new User ID: ");
      const fName = await rl.question("Enter First Name: ");
      const lName = await rl.question("Enter Last Name: ");
      const email = await rl.question("Enter Email: ");
      console.log("Types: 1. Student, 2. Staff, 3. Service Officer, 4. Technician");
      const typeChoice = await rl.question("Select User Type (1-4): ");

      let newUser;
      if (typeChoice === "1") newUser = new StudentRequester(newId, fName, lName, email, "General", 1);
      else if (typeChoice === "2") newUser = new StaffRequester(newId, fName, lName, email, "General");
      else if (typeChoice === "3") newUser = new ServiceOfficer(newId, fName, lName, email, "General");
      else if (typeChoice === "4") newUser = new Technician(newId, fName, lName, email, "General");
      else {
        console.log("Invalid type.");
        continue;
      }

      console.log(manager.registerUser(newUser).message);
      continue; 
    }

    const currentUser = manager.findUserById(loginId);
    if (!currentUser) {
      console.log("User not found. Please try again.");
      continue;
    }

    console.log(`\nWelcome, ${currentUser.getFullName()} (${currentUser.userType})`);
    let loggedIn = true;

    // ... (Keep the REST of the while(loggedIn) loop exactly as it was)
    // (The Student menu, Officer menu, and Technician menu)

    while (loggedIn) {
      // STUDENT / STAFF MENU
      if (currentUser.userType === "Student" || currentUser.userType === "Staff") {
        console.log(`
--- REQUESTER MENU ---
1. Submit ICT Request
2. Submit Maintenance Request
3. Submit Cleaning Request
4. View My Requests
5. Cancel a Request
6. Logout
        `);
        const choice = await rl.question("Select option: ");

        if (choice === "6") { loggedIn = false; break; }

        if (["1", "2", "3"].includes(choice)) {
          const requestId = generateId("REQ", manager.getAllRequests());
          const title = await rl.question("Title: ");
          const desc = await rl.question("Description: ");
          const loc = await rl.question("Location: ");
          const prio = await rl.question("Priority (Low, Normal, High, Urgent): ");

          const commonData = { requestId, requester: currentUser, title, description: desc, location: loc, priority: prio };
          let newReq;

          if (choice === "1") {
            const dev = await rl.question("Device Type: ");
            const sys = await rl.question("System Name: ");
            const fault = await rl.question("Fault Type: ");
            const net = await rl.question("Network Impact (Yes/No): ");
            newReq = new ICTSupportRequest(commonData, dev, sys, fault, net);
          } else if (choice === "2") {
            const bld = await rl.question("Building: ");
            const room = await rl.question("Room Number: ");
            const haz = await rl.question("Hazard Level: ");
            const eq = await rl.question("Equipment Affected: ");
            newReq = new MaintenanceRequest(commonData, bld, room, haz, eq);
          } else if (choice === "3") {
            const area = await rl.question("Cleaning Area: ");
            const hyg = await rl.question("Hygiene Risk: ");
            const serv = await rl.question("Service Type: ");
            const time = await rl.question("Preferred Time: ");
            newReq = new CleaningRequest(commonData, area, hyg, serv, time);
          }

          console.log(manager.submitRequest(newReq).message);
        } 
        else if (choice === "4") {
          const myReqs = manager.getRequestsByUser(currentUser.userId);
          myReqs.forEach(r => console.log(r.getRequestSummary()));
        }
        else if (choice === "5") {
          const reqId = await rl.question("Enter Request ID to cancel: ");
          console.log(manager.cancelRequest(reqId, currentUser.userId));
        }
      } 
      
      // SERVICE OFFICER MENU
      else if (currentUser.userType === "Service Officer") {
        console.log(`
--- OFFICER MENU ---
1. Review Request
2. Assign Technician
3. Close Resolved Request
4. View All Requests
5. Logout
        `);
        const choice = await rl.question("Select option: ");

        if (choice === "5") { loggedIn = false; break; }

        if (choice === "1") {
          const reqId = await rl.question("Enter Request ID to Review: ");
          console.log(manager.reviewRequest(reqId, currentUser.userId));
        } else if (choice === "2") {
          const reqId = await rl.question("Enter Request ID to Assign: ");
          const techId = await rl.question("Enter Technician ID: ");
          console.log(manager.assignTechnician(reqId, currentUser.userId, techId));
        } else if (choice === "3") {
          const reqId = await rl.question("Enter Request ID to Close: ");
          console.log(manager.closeRequest(reqId, currentUser.userId));
        } else if (choice === "4") {
          manager.getAllRequests().forEach(r => console.log(r.getRequestSummary()));
        }
      } 
      
      // TECHNICIAN MENU
      else if (currentUser.userType === "Technician") {
        console.log(`
--- TECHNICIAN MENU ---
1. View My Assigned Requests
2. Start Work on Request
3. Resolve Request
4. Logout
        `);
        const choice = await rl.question("Select option: ");

        if (choice === "4") { loggedIn = false; break; }

        if (choice === "1") {
          const myTasks = manager.getAllRequests().filter(r => r.assignedTechnician === currentUser.userId);
          myTasks.forEach(r => console.log(r.getRequestSummary()));
        } else if (choice === "2") {
          const reqId = await rl.question("Enter Request ID to start: ");
          console.log(manager.startWork(reqId, currentUser.userId));
        } else if (choice === "3") {
          const reqId = await rl.question("Enter Request ID to resolve: ");
          const notes = await rl.question("Resolution notes: ");
          console.log(manager.resolveRequest(reqId, currentUser.userId, notes));
        }
      }
    }
  }
  rl.close();
}
main();