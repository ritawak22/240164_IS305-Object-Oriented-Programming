const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, '../data/requestHistory.json');

class RequestHistoryRepository {
  async loadAll() {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') { await this.saveAll([]); return []; }
      throw new Error("Error reading request history file: " + err.message);
    }
  }
  async saveAll(historyData) {
    await fs.writeFile(filePath, JSON.stringify(historyData, null, 2), 'utf8');
  }
}
module.exports = RequestHistoryRepository;