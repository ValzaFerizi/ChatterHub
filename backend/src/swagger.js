const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'ChatterHub API',
    version: '1.0.0',
    description: 'REST API for ChatterHub — forms, sections, questions, and responses.'
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local development server' }
  ],
  tags: [
    { name: 'Forms', description: 'Create and manage forms' },
    { name: 'Sections', description: 'Manage sections within a form' },
    { name: 'Questions', description: 'Manage questions within a form' },
    { name: 'Responses', description: 'Submit and retrieve form responses' }
  ],
  components: {
    schemas: {
      Form: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          ownerId: { type: 'integer', example: 42 },
          title: { type: 'string', example: 'Customer Feedback' },
          description: { type: 'string', example: 'Tell us about your experience.' },
          isPublished: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateFormBody: {
        type: 'object',
        required: ['ownerId', 'title'],
        properties: {
          ownerId: { type: 'integer', example: 42 },
          title: { type: 'string', example: 'Customer Feedback' },
          description: { type: 'string', example: 'Tell us about your experience.' },
          isPublished: { type: 'boolean', example: false }
        }
      },
      UpdateFormBody: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated Form Title' },
          description: { type: 'string', example: 'Updated description.' },
          isPublished: { type: 'boolean', example: true }
        }
      },
      Section: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          formId: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Personal Information' },
          description: { type: 'string', example: 'Please fill in your details.' },
          orderIndex: { type: 'integer', example: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateSectionBody: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Personal Information' },
          description: { type: 'string', example: 'Please fill in your details.' },
          orderIndex: { type: 'integer', example: 0 }
        }
      },
      UpdateSectionBody: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated Section Title' },
          description: { type: 'string', example: 'Updated description.' },
          orderIndex: { type: 'integer', example: 1 }
        }
      },
      QuestionOption: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          questionId: { type: 'integer', example: 3 },
          label: { type: 'string', example: 'Option A' },
          value: { type: 'string', example: 'option_a' },
          orderIndex: { type: 'integer', example: 0 }
        }
      },
      Question: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 3 },
          formId: { type: 'integer', example: 1 },
          sectionId: { type: 'integer', nullable: true, example: 1 },
          label: { type: 'string', example: 'What is your name?' },
          type: {
            type: 'string',
            enum: [
              'short_answer', 'paragraph', 'multiple_choice', 'checkboxes',
              'dropdown', 'file_upload', 'linear_scale', 'multiple_choice_grid',
              'checkbox_grid', 'date', 'time'
            ],
            example: 'short_answer'
          },
          placeholder: { type: 'string', nullable: true, example: 'Enter your name...' },
          helpText: { type: 'string', nullable: true, example: 'Full legal name.' },
          isRequired: { type: 'boolean', example: false },
          orderIndex: { type: 'integer', example: 0 },
          validationRules: { type: 'object', nullable: true },
          options: {
            type: 'array',
            items: { $ref: '#/components/schemas/QuestionOption' }
          }
        }
      },
      CreateQuestionBody: {
        type: 'object',
        required: ['label', 'type'],
        properties: {
          sectionId: { type: 'integer', nullable: true, example: 1 },
          label: { type: 'string', example: 'What is your favourite colour?' },
          type: {
            type: 'string',
            enum: [
              'short_answer', 'paragraph', 'multiple_choice', 'checkboxes',
              'dropdown', 'file_upload', 'linear_scale', 'multiple_choice_grid',
              'checkbox_grid', 'date', 'time'
            ],
            example: 'multiple_choice'
          },
          placeholder: { type: 'string', example: 'Choose one...' },
          helpText: { type: 'string', example: 'Pick the one you like most.' },
          isRequired: { type: 'boolean', example: true },
          orderIndex: { type: 'integer', example: 0 },
          validationRules: { type: 'object', example: {} },
          options: {
            type: 'array',
            items: {
              type: 'object',
              required: ['label', 'value'],
              properties: {
                label: { type: 'string', example: 'Red' },
                value: { type: 'string', example: 'red' },
                orderIndex: { type: 'integer', example: 0 }
              }
            }
          }
        }
      },
      ReorderQuestionsBody: {
        type: 'object',
        required: ['orderedQuestionIds'],
        properties: {
          orderedQuestionIds: {
            type: 'array',
            items: { type: 'integer' },
            example: [3, 1, 2]
          }
        }
      },
      ResponseAnswer: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 10 },
          responseId: { type: 'integer', example: 5 },
          questionId: { type: 'integer', example: 3 },
          value: { type: 'string', example: 'Blue' }
        }
      },
      Response: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 5 },
          formId: { type: 'integer', example: 1 },
          respondentId: { type: 'integer', nullable: true, example: 7 },
          submittedAt: { type: 'string', format: 'date-time' },
          answers: {
            type: 'array',
            items: { $ref: '#/components/schemas/ResponseAnswer' }
          }
        }
      },
      SubmitResponseBody: {
        type: 'object',
        required: ['answers'],
        properties: {
          respondentId: { type: 'integer', nullable: true, example: 7 },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              required: ['questionId', 'value'],
              properties: {
                questionId: { type: 'integer', example: 3 },
                value: { type: 'string', example: 'Blue' }
              }
            }
          }
        }
      },
      SuccessMessage: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' }
        }
      }
    }
  },
  paths: {
    // ─── Forms ───────────────────────────────────────────────────────────────
    '/api/forms': {
      post: {
        tags: ['Forms'],
        summary: 'Create a new form',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateFormBody' }
            }
          }
        },
        responses: {
          201: {
            description: 'Form created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Form created successfully' },
                    data: { $ref: '#/components/schemas/Form' }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      get: {
        tags: ['Forms'],
        summary: 'Get all forms (optionally filter by ownerId)',
        parameters: [
          { name: 'ownerId', in: 'query', schema: { type: 'integer' }, description: 'Filter forms by owner ID' }
        ],
        responses: {
          200: {
            description: 'List of forms',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Forms fetched successfully' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Form' } }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/forms/{formId}': {
      get: {
        tags: ['Forms'],
        summary: 'Get a form by ID',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        responses: {
          200: {
            description: 'Form found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Form fetched successfully' },
                    data: { $ref: '#/components/schemas/Form' }
                  }
                }
              }
            }
          },
          404: { description: 'Form not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Forms'],
        summary: 'Update a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateFormBody' } } }
        },
        responses: {
          200: {
            description: 'Form updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Form updated successfully' },
                    data: { $ref: '#/components/schemas/Form' }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Forms'],
        summary: 'Delete a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        responses: {
          200: { description: 'Form deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    // ─── Sections ─────────────────────────────────────────────────────────────
    '/api/forms/{formId}/sections': {
      post: {
        tags: ['Sections'],
        summary: 'Create a section within a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSectionBody' } } }
        },
        responses: {
          201: {
            description: 'Section created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Section created successfully' },
                    data: { $ref: '#/components/schemas/Section' }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      get: {
        tags: ['Sections'],
        summary: 'Get all sections for a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        responses: {
          200: {
            description: 'List of sections',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Sections fetched successfully' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Section' } }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/sections/{sectionId}': {
      put: {
        tags: ['Sections'],
        summary: 'Update a section',
        parameters: [{ name: 'sectionId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateSectionBody' } } }
        },
        responses: {
          200: {
            description: 'Section updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Section updated successfully' },
                    data: { $ref: '#/components/schemas/Section' }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Sections'],
        summary: 'Delete a section',
        parameters: [{ name: 'sectionId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        responses: {
          200: { description: 'Section deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    // ─── Questions ────────────────────────────────────────────────────────────
    '/api/forms/{formId}/questions': {
      post: {
        tags: ['Questions'],
        summary: 'Create a question (with optional choices) within a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateQuestionBody' } } }
        },
        responses: {
          201: {
            description: 'Question created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Question created successfully' },
                    data: { $ref: '#/components/schemas/Question' }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      get: {
        tags: ['Questions'],
        summary: 'Get all questions for a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        responses: {
          200: {
            description: 'List of questions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Questions fetched successfully' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Question' } }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/questions/{questionId}': {
      put: {
        tags: ['Questions'],
        summary: 'Update a question',
        parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'integer' }, example: 3 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateQuestionBody' } } }
        },
        responses: {
          200: {
            description: 'Question updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Question updated successfully' },
                    data: { $ref: '#/components/schemas/Question' }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Questions'],
        summary: 'Delete a question',
        parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'integer' }, example: 3 }],
        responses: {
          200: { description: 'Question deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/forms/{formId}/questions/reorder': {
      patch: {
        tags: ['Questions'],
        summary: 'Reorder questions within a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ReorderQuestionsBody' } } }
        },
        responses: {
          200: {
            description: 'Questions reordered',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Questions reordered successfully' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Question' } }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },

    // ─── Responses ────────────────────────────────────────────────────────────
    '/api/forms/{formId}/responses': {
      post: {
        tags: ['Responses'],
        summary: 'Submit a response to a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SubmitResponseBody' } } }
        },
        responses: {
          201: {
            description: 'Response submitted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Response submitted successfully' },
                    data: { $ref: '#/components/schemas/Response' }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      get: {
        tags: ['Responses'],
        summary: 'Get all responses for a form',
        parameters: [{ name: 'formId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        responses: {
          200: {
            description: 'List of responses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Responses fetched successfully' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Response' } }
                  }
                }
              }
            }
          },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/responses/{responseId}': {
      get: {
        tags: ['Responses'],
        summary: 'Get a single response by ID',
        parameters: [{ name: 'responseId', in: 'path', required: true, schema: { type: 'integer' }, example: 5 }],
        responses: {
          200: {
            description: 'Response found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Response fetched successfully' },
                    data: { $ref: '#/components/schemas/Response' }
                  }
                }
              }
            }
          },
          404: { description: 'Response not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Responses'],
        summary: 'Delete a response',
        parameters: [{ name: 'responseId', in: 'path', required: true, schema: { type: 'integer' }, example: 5 }],
        responses: {
          200: { description: 'Response deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
