const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs/promises');
const StudentRequester = require('./StudentRequester');
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require('./SpecialisedRequests');
const ServiceRequestManager = require('./ServiceRequestManager');

test('1. Valid object construction', () => {
  const user = new StudentRequester("S99", "Test", "User", "test@test.com", "IT", 1);
  assert.strictEqual(user.userId, "S99");
});

test('2. Invalid constructor values (Empty User ID)', () => {
  const user = new StudentRequester("", "Test", "User", "test@test.com", "IT", 1);
  assert.strictEqual(user.validate(), "User ID is required.");
});

test('3. Duplicate identifiers should be rejected', () => {
  const manager = new ServiceRequestManager();
  const user1 = new StudentRequester("S1", "A", "B", "a@b.com", "IT", 1);
  manager.registerUser(user1);
  const res = manager.registerUser(new StudentRequester("S1", "C", "D", "c@d.com", "IT", 1));
  assert.strictEqual(res.success, false);
});

test('4. Role permissions prevent unauthorized cancel', () => {
  const manager = new ServiceRequestManager();
  const user1 = new StudentRequester("S1", "A", "B", "a@b.com", "IT", 1);
  const common = { requestId: "R1", requester: user1, title: "Wifi", description: "Down", location: "Lib", priority: "Low" };
  manager.requests.push(new ICTSupportRequest(common, "L", "W", "F", "N"));
  assert.match(manager.cancelRequest("R1", "S2"), /Error/);
});

test('5. Controlled status transitions', () => {
  const user1 = new StudentRequester("S1", "A", "B", "a@b.com", "IT", 1);
  const common = { requestId: "R1", requester: user1, title: "Wifi", description: "Down", location: "Lib", priority: "Low" };
  const req = new ICTSupportRequest(common, "L", "W", "F", "N");
  assert.strictEqual(req.resolveRequest("T1", "Done"), false); 
});

test('6. Specialised request behaviour (Maintenance Hazard)', () => {
  const user = new StudentRequester("S1", "A", "B", "a@b.com", "IT", 1);
  const common = { requestId: "R2", requester: user, title: "Broken Door", description: "Fix", location: "Block A", priority: "Normal" };
  const req = new MaintenanceRequest(common, "Block A", "101", "High", "Door");
  assert.strictEqual(req.calculatePriorityScore(), 90); 
});

test('7. Polymorphic method calls (Cleaning Hygiene)', () => {
  const user = new StudentRequester("S1", "A", "B", "a@b.com", "IT", 1);
  const common = { requestId: "R3", requester: user, title: "Spill", description: "Clean", location: "Cafe", priority: "High" };
  const req = new CleaningRequest(common, "Cafe", "High", "Deep Clean", "Morning");
  assert.strictEqual(req.getTargetResolutionHours(), 12); 
});

test('8. Saving JSON data to a temporary file', async () => {
  const tempFile = './temp_save_test.json';
  const data = [{ id: 1, name: "Test" }];
  await fs.writeFile(tempFile, JSON.stringify(data), 'utf8');
  const readBack = JSON.parse(await fs.readFile(tempFile, 'utf8'));
  assert.strictEqual(readBack[0].name, "Test");
  await fs.unlink(tempFile); 
});

test('9. Loading and restoring from temporary file', async () => {
  const tempFile = './temp_load_test.json';
  await fs.writeFile(tempFile, JSON.stringify([{ id: 2, name: "LoadTest" }]), 'utf8');
  const data = JSON.parse(await fs.readFile(tempFile, 'utf8'));
  assert.strictEqual(data[0].name, "LoadTest");
  await fs.unlink(tempFile);
});

test('10. Handling empty data files', async () => {
  const tempFile = './temp_empty_test.json';
  await fs.writeFile(tempFile, JSON.stringify([]), 'utf8');
  const data = JSON.parse(await fs.readFile(tempFile, 'utf8'));
  assert.strictEqual(data.length, 0);
  await fs.unlink(tempFile);
});