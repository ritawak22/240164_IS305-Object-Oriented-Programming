const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, '../data/auditLog.json');

class AuditFileRepository {
  async loadAll() {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') { await this.saveAll([]); return []; }
      throw new Error("Error reading audit log file: " + err.message);
    }
  }
  async saveAll(logs) {
    await fs.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf8');
  }
  async log(actorId, action, requestId, description, outcome) {
    const logs = await this.loadAll();
    logs.push({
      auditId: `AUD-${logs.length + 1}`,
      actorId, action, requestId, description,
      dateTime: new Date().toISOString(), outcome
    });
    await this.saveAll(logs);
  }
}
module.exports = AuditFileRepository;