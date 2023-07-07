import logger from "../utils/logger.js";

// Fallback middleware for undefined paths
const invalidPathHandler = (req, res, next) => {
      res.status(404).send('Not Found')
      logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
}

export default invalidPathHandler