const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const User = require("./User");
const ServiceRequest = require("./ServiceRequest");
const ServiceRequestManager = require("./ServiceRequestManager");

const rl = readline.createInterface({ input, output });
const manager = new ServiceRequestManager();

// Helper to generate simple IDs (e.g., USR-1, REQ-1)
function generateId(prefix, array) {
  return `${prefix}-${array.length + 1}`;
}

async function main() {
  let running = true;

  while (running) {
    console.log(`
========================================
    CAMPUS SERVICE REQUEST SYSTEM
========================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
========================================`);

    const choice = await rl.question("Select an option (1-10): ");

    switch (choice) {
      case "1":
        console.log("\n--- Register User ---");
        const userId = await rl.question("Enter User ID: ");
        const firstName = await rl.question("Enter First Name: ");
        const lastName = await rl.question("Enter Last Name: ");
        const email = await rl.question("Enter Email: ");
        const userType = await rl.question("Enter User Type (Student/Staff): ");
        
        const newUser = new User(userId, firstName, lastName, email, userType);
        const regResult = manager.registerUser(newUser);
        console.log(regResult.message);
        break;

      case "2":
        console.log("\n--- Submit Request ---");
        const requesterId = await rl.question("Enter your User ID: ");
        const user = manager.findUserById(requesterId);
        if (!user) {
          console.log("Error: User not found. Please register first.");
          break;
        }
        
        const requestId = generateId("REQ", manager.getAllRequests());
        const title = await rl.question("Enter Request Title: ");
        const description = await rl.question("Enter Description: ");
        const location = await rl.question("Enter Campus Location: ");
        console.log("Categories: ICT Support, Facilities Maintenance, Cleaning and Sanitation, General Campus Service");
        const category = await rl.question("Enter Category: ");
        console.log("Priorities: Low, Normal, High, Urgent");
        const priority = await rl.question("Enter Priority: ");

        const newReq = new ServiceRequest(requestId, user, title, description, location, category, priority);
        const reqResult = manager.submitRequest(newReq);
        console.log(reqResult.message);
        if (reqResult.success) console.log(`Your Request ID is: ${requestId}`);
        break;

      case "3":
        const viewId = await rl.question("Enter Request ID: ");
        const reqToView = manager.findRequestById(viewId);
        if (reqToView) console.log(reqToView.getRequestSummary());
        else console.log("Request not found.");
        break;

      case "4":
        const myId = await rl.question("Enter your User ID: ");
        const myReqs = manager.getRequestsByUser(myId);
        if (myReqs.length === 0) console.log("No requests found.");
        else myReqs.forEach(r => console.log(r.getRequestSummary()));
        break;

      case "5":
        const allReqs = manager.getAllRequests();
        if (allReqs.length === 0) console.log("No requests in system.");
        else allReqs.forEach(r => console.log(r.getRequestSummary()));
        break;

      case "6":
        console.log("\n--- Update Request ---");
        const updateReqId = await rl.question("Enter Request ID to update: ");
        const updateUserId = await rl.question("Enter your User ID (for security): ");
        
        const newTitle = await rl.question("Enter new Title (or press Enter to skip): ");
        const newDesc = await rl.question("Enter new Description (or press Enter to skip): ");
        
        const changes = {};
        if (newTitle.trim() !== "") changes.title = newTitle;
        if (newDesc.trim() !== "") changes.description = newDesc;

        const updateResult = manager.updateRequest(updateReqId, updateUserId, changes);
        console.log(updateResult.message);
        break;

      case "7":
        console.log("\n--- Cancel Request ---");
        const cancelReqId = await rl.question("Enter Request ID to cancel: ");
        const cancelUserId = await rl.question("Enter your User ID (for security): ");
        
        const cancelResult = manager.cancelRequest(cancelReqId, cancelUserId);
        console.log(cancelResult.message);
        break;

      case "8":
        const searchTxt = await rl.question("Enter search term: ");
        const searchResults = manager.searchRequests(searchTxt);
        if (searchResults.length === 0) console.log("No matching requests found.");
        else searchResults.forEach(r => console.log(r.getRequestSummary()));
        break;

      case "9":
        const summary = manager.getRequestSummaryByStatus();
        console.log("\n--- Request Summary By Status ---");
        for (const status in summary) {
          console.log(`${status}: ${summary[status]}`);
        }
        break;

      case "10":
        console.log("Exiting system. Goodbye!");
        running = false;
        break;

      default:
        console.log("Invalid option. Please choose 1-10.");
    }
  }

  rl.close();
}

main();