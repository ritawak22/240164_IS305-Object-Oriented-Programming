# 240164_IS305-Object-Oriented-Programming


# Campus Service Request Management System

## 1. Problem Statement
Students and staff currently report campus issues via phone calls or handwritten notes, making it difficult to track responsibility and progress. This system provides a console-based application to log, assign, and track campus service requests.

## 2. Objectives & Scope
- Allow students and staff to register and submit ICT, Maintenance, or Cleaning requests.
- Allow Service Officers to review, assign, and close requests.
- Allow Technicians to update progress and resolve requests.
- Persist all data (users, requests, history, audit logs) to JSON files.

## 3. Actors & Roles
- **Requester (Student/Staff):** Can submit, view, and cancel their own requests.
- **Service Officer:** Can review, assign Technicians, and close resolved requests.
- **Technician:** Can start work and resolve assigned requests.

## 4. Requirements
### Functional Requirements
- Validated user registration.
- Role-based access control for status changes.
- Persistence using `fs/promises` (no database).
- Automated reports and audit logging.

### Non-Functional Requirements
- The application must be console-based using Node.js.
- Data must survive application restarts.

## 5. User Stories
1. *As a Student, I want to submit a request so that campus staff know about a problem.*
2. *As a Service Officer, I want to assign a Technician so the issue gets fixed.*
3. *As a Technician, I want to mark a request as Resolved so the officer knows the work is done.*

## 6. Design & Architecture
The system uses a layered architecture:
- **Domain Classes:** `User`, `ServiceRequest`, and their subclasses.
- **Repositories:** Handle raw JSON file reading/writing (`UserFileRepository`, `AuditFileRepository`).
- **Manager:** Handles business logic and state transitions.
- **Factory:** Rebuilds objects from JSON data.

## 7. How to Run
1. Open terminal in the `DistinctionLevel` folder.
2. Run `node CampusServiceApp.js`.
3. Use IDs `S1`, `O1`, or `T1` to log in.
4. Run tests using `node --test tests.js`.

## 8. Test Evidence
After running the test,  `pass 10, fail 0` 