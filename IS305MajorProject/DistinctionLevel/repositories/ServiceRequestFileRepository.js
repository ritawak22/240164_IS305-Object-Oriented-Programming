const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, '../data/serviceRequests.json');

class ServiceRequestFileRepository {
  async loadAll() {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') { await this.saveAll([]); return []; }
      throw new Error("Error reading requests data file.");
    }
  }
  async saveAll(requests) {
    const plainData = requests.map(req => req.toJSON());
    await fs.writeFile(filePath, JSON.stringify(plainData, null, 2), 'utf8');
  }
  async findByRequester(userId) {
    const reqs = await this.loadAll();
    return reqs.filter(r => r.requesterId === userId);
  }
  async findByTechnician(techId) {
    const reqs = await this.loadAll();
    return reqs.filter(r => r.assignedTechnicianId === techId);
  }
  async update(requestId, changes) {
    const reqs = await this.loadAll();
    const index = reqs.findIndex(r => r.requestId === requestId);
    if (index !== -1) {
      reqs[index] = { ...reqs[index], ...changes };
      await this.saveAll(reqs);
      return true;
    }
    return false;
  }
}
module.exports = ServiceRequestFileRepository;