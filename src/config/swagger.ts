export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'SIEM Dashboard API',
    version: '1.0.0',
    description: 'Backend API for Security Information and Event Management (SIEM) Dashboard',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service health check' },
    { name: 'Alerts', description: 'Security alert logs' },
    { name: 'Dashboard', description: 'Dashboard aggregation' },
    { name: 'Highlighted IPs', description: 'Highlighted IP monitoring' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Check connectivity to PostgreSQL and Elasticsearch',
        responses: {
          200: {
            description: 'All services are up',
            content: {
              'application/json': {
                example: {
                  status: 'healthy',
                  services: { postgres: 'up', elasticsearch: 'up' },
                },
              },
            },
          },
          503: { description: 'One or more services are down' },
        },
      },
    },
    '/alerts': {
      get: {
        tags: ['Alerts'],
        summary: 'Get filtered alert logs',
        description: 'Retrieve security alert logs filtered by department, risk, severity, and date range',
        parameters: [
          { name: 'department', in: 'query', schema: { type: 'string' }, description: 'Filter by department (e.g. Finance, HR)' },
          { name: 'risk', in: 'query', schema: { type: 'string', enum: ['Low', 'Medium', 'High'] }, description: 'Filter by risk level' },
          { name: 'severity', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 3 }, description: 'Filter by severity' },
          { name: 'date_from', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Start date (ISO 8601)' },
          { name: 'date_to', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'End date (ISO 8601)' },
          { name: 'sort_by', in: 'query', schema: { type: 'string', enum: ['timestamp', 'severity'], default: 'timestamp' }, description: 'Sort field' },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Sort order' },
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }, description: 'Results per page' },
        ],
        responses: {
          200: {
            description: 'Successfully fetched alert logs',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Successfully fetched alert logs',
                  meta: { total_data: 10, page: 1, limit: 20 },
                  data: [
                    {
                      timestamp: '2026-06-01T10:01:00Z',
                      source_ip: '185.220.101.5',
                      target_ip: '192.168.20.50',
                      alert_name: 'BROWSER-CHROME CVE-2023-3079 Exploit Attempt',
                      severity: 1,
                    },
                  ],
                },
              },
            },
          },
          400: { description: 'Validation error' },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/dashboard/top-targeted': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get top 5 targeted assets',
        description: 'Retrieve top 5 most attacked internal assets enriched with asset information',
        responses: {
          200: {
            description: 'Successfully fetched top targeted assets',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Successfully fetched top targeted assets',
                  meta: { total_data: 5 },
                  data: [
                    {
                      target_ip: '192.168.20.50',
                      total_attacks: 9,
                      asset_name: 'Web App Client Portal',
                      department: 'IT Operation',
                    },
                  ],
                },
              },
            },
          },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/highlighted-ips': {
      post: {
        tags: ['Highlighted IPs'],
        summary: 'Add highlighted IP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ip_address'],
                properties: {
                  ip_address: { type: 'string', example: '185.220.101.5' },
                  reason: { type: 'string', example: 'Suspicious external attacker' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'IP highlighted successfully' },
          400: { description: 'Validation error' },
          409: { description: 'IP already highlighted' },
          500: { description: 'Internal server error' },
        },
      },
      get: {
        tags: ['Highlighted IPs'],
        summary: 'List all highlighted IPs',
        responses: {
          200: { description: 'Successfully retrieved data' },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/highlighted-ips/{id}': {
      put: {
        tags: ['Highlighted IPs'],
        summary: 'Update highlighted IP',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ip_address: { type: 'string' },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'IP updated successfully' },
          404: { description: 'IP not found' },
          500: { description: 'Internal server error' },
        },
      },
      delete: {
        tags: ['Highlighted IPs'],
        summary: 'Delete highlighted IP',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'IP deleted successfully' },
          404: { description: 'IP not found' },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/highlighted-ips/activity': {
      get: {
        tags: ['Highlighted IPs'],
        summary: 'Get activity from highlighted IPs',
        description: 'Returns alert logs where src_ip matches a highlighted IP',
        responses: {
          200: { description: 'Successfully retrieved data' },
          500: { description: 'Internal server error' },
        },
      },
    },
  },
};