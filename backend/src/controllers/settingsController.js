const { Settings } = require('../models');

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findAll();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const [setting, created] = await Settings.findOrCreate({
      where: { key },
      defaults: { value, description: key }
    });
    if (!created) await setting.update({ value });
    res.status(200).json({ message: 'Setting u përditësua', key, value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSetting };