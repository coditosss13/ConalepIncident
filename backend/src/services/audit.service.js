const fs = require('fs');
const path = require('path');

class AuditService {
  constructor() {
    this.logsDir = path.join(__dirname, '..', '..', 'logs');
    this.logFile = path.join(this.logsDir, 'security-audit.log');
  }

  async record(event, payload = {}) {
    try {
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }

      const line = JSON.stringify({
        timestamp: new Date().toISOString(),
        event,
        ...payload
      });

      await fs.promises.appendFile(this.logFile, `${line}\n`, 'utf8');
    } catch (error) {
      // No interrumpir la operación principal por fallas de logging.
      console.error('Audit log error:', error.message);
    }
  }
}

module.exports = new AuditService();
