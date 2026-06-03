@'
const SectionRepository = require('../repositories/section.repository');

const SectionController = {
  async createSection(req, res) {
    try {
      const { formId } = req.params;
      const section = await SectionRepository.createSection(formId, req.body);

      return res.status(201).json({
        message: 'Section created successfully',
        data: section
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to create section',
        error: error.message
      });
    }
  },

  async getSectionsByForm(req, res) {
    try {
      const { formId } = req.params;
      const sections = await SectionRepository.findSectionsByForm(formId);

      return res.status(200).json({
        message: 'Sections fetched successfully',
        data: sections
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch sections',
        error: error.message
      });
    }
  },

  async updateSection(req, res) {
    try {
      const { sectionId } = req.params;
      const updatedSection = await SectionRepository.updateSection(sectionId, req.body);

      return res.status(200).json({
        message: 'Section updated successfully',
        data: updatedSection
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to update section',
        error: error.message
      });
    }
  },

  async deleteSection(req, res) {
    try {
      const { sectionId } = req.params;
      await SectionRepository.deleteSection(sectionId);

      return res.status(200).json({
        message: 'Section deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to delete section',
        error: error.message
      });
    }
  }
};

module.exports = SectionController;
'@ | Set-Content backend\src\controllers\section.controller.js