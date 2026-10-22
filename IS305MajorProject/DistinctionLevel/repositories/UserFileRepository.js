const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, '../data/users.json');

class UserFileRepository {
  async loadAll() {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') { await this.saveAll([]); return []; }
      throw new Error("Error reading user data file.");
    }
  }
  async saveAll(users) {
    const plainData = users.map(u => u.toJSON());
    await fs.writeFile(filePath, JSON.stringify(plainData, null, 2), 'utf8');
  }
  async create(user) {
    const users = await this.loadAll();
    users.push(user.toJSON());
    await this.saveAll(users);
  }
  async findById(userId) {
    const users = await this.loadAll();
    return users.find(u => u.userId === userId);
  }
}
module.exports = UserFileRepository;