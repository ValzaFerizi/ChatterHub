const { logAction, getLogs, getUserLogs } = require('../services/auditService');

const getAllLogs = async (req, res) => {
  try {
    const logs = await getLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLogsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await getUserLogs(Number(userId));
    res.status(200).json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAllLogs, getLogsForUser, logAction };