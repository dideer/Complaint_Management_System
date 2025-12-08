<<<<<<< HEAD
# Complaint Management System - DevOps Project

## Setup & Run

### Docker Compose (Recommended)
\`\`\`bash
docker-compose up
\`\`\`
Access: http://localhost:3000

### Manual Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Error Budget Policy
- **Acceptable Downtime**: 99.5% uptime (3.6 hours/month)
- **RTO**: 30 minutes
- **RPO**: 5 minutes

## Git Workflow
- Feature branches: `feature/complaint-xxx`
- Commit format: `[TYPE] message` (feat, fix, test, docs)
- PR required before merge to main

## Testing
\`\`\`bash
npm test          # Unit tests
npm run test:integration  # Integration tests
\`\`\`

## CI/CD
GitHub Actions runs automatically on push/PR.
\`\`\`
Human: I want to update my files. currently my application doesn't have tests. I want to add tests to my existing applications with jest and supertest

a nd generate test for unit and integration tests
Answer should include:
1. Configuration files needed for Jest
2. Create test folder structure
3. Unit Tests for MySQL database operations
4. Unit Tests for API endpoints
5. Integration Tests that test the whole flow
6. Test coverage report generation

Answer should update existing files if necessary and create new test files.

Answer should be complete and ready to implement.
```

I'll add comprehensive Jest and Supertest testing to your application. Here's the complete setup:

## Step-by-Step Solution

1. **Update package.json** with Jest and test scripts
2. **Create Jest configuration file**
3. **Create test folder structure**
4. **Write unit tests** for database operations
5. **Write unit tests** for API endpoints
6. **Write integration tests** for complete flows
7. **Setup test utilities** and fixtures
8. **Generate coverage reports**

---

### /home/ishimwe-didier/Complaint_Management_System/package.json

Update with test dependencies and scripts.

````json
// filepath: /home/ishimwe-didier/Complaint_Management_System/package.json
{
  "name": "complaint-management-system",
  "version": "1.0.0",
  "description": "DevOps Complaint Management System",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest --coverage --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=tests/unit --coverage",
    "test:integration": "jest --testPathPattern=tests/integration --runInBand",
    "test:all": "jest --testPathPattern=tests --runInBand --coverage",
    "lint": "eslint .",
    "coverage:report": "jest --coverage --collectCoverageFrom='*.js' --collectCoverageFrom='!node_modules/**'"
  },
  "keywords": ["complaint", "devops"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "dotenv": "^16.3.1",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.50.0"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "index.js",
      "!node_modules/**"
    ]
  }
}
````

---

### /home/ishimwe-didier/Complaint_Management_System/jest.config.js

Jest configuration file.

````javascript
// filepath: /home/ishimwe-didier/Complaint_Management_System/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'index.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true
};
````

---

### /home/ishimwe-didier/Complaint_Management_System/tests/setup.js

Test setup and environment configuration.

````javascript
// filepath: /home/ishimwe-didier/Complaint_Management_System/tests/setup.js
require('dotenv').config({ path: '.env.test' });

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
process.env.DB_NAME = process.env.DB_NAME || 'complaints_db_test';
process.env.PORT = process.env.PORT || 3001;

// Global test timeout
jest.setTimeout(30000);
````

---

### /home/ishimwe-didier/Complaint_Management_System/.env.test

Test environment variables.

````env
// filepath: /home/ishimwe-didier/Complaint_Management_System/.env.test
NODE_ENV=test
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=complaints_db_test
````

---

### /home/ishimwe-didier/Complaint_Management_System/tests/fixtures/complaint.fixture.js

Test data fixtures.

````javascript
// filepath: /home/ishimwe-didier/Complaint_Management_System/tests/fixtures/complaint.fixture.js
const validComplaint = {
  title: 'Network Down',
  description: 'Internet connection is not working',
  category: 'IT',
  priority: 'High'
};

const invalidComplaint = {
  title: '',
  description: '',
  category: 'Invalid',
  priority: 'Invalid'
};

const complaintWithAllFields = {
  title: 'Payment Processing Error',
  description: 'Unable to process payment for order #12345',
  category: 'Finance',
  priority: 'High'
};

const multipleComplaints = [
  {
    title: 'Login Issue',
    description: 'Cannot login to system',
    category: 'IT',
    priority: 'High'
  },
  {
    title: 'HR Policy Query',
    description: 'Need clarification on leave policy',
    category: 'HR',
    priority: 'Low'
  },
  {
    title: 'Expense Report Pending',
    description: 'Expense report not approved',
    category: 'Finance',
    priority: 'Medium'
  }
];

module.exports = {
  validComplaint,
  invalidComplaint,
  complaintWithAllFields,
  multipleComplaints
};
````

---

### /home/ishimwe-didier/Complaint_Management_System/tests/unit/database.test.js

Unit tests for database operations.

````javascript
// filepath: /home/ishimwe-didier/Complaint_Management_System/tests/unit/database.test.js
const mysql = require('mysql2/promise');
const { validComplaint, complaintWithAllFields } = require('../fixtures/complaint.fixture');

describe('Database Operations - Unit Tests', () => {
  let pool;
  let connection;

  beforeAll(async () => {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    try {
      connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS complaints (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(100),
          priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
          status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      connection.release();
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });

  beforeEach(async () => {
    try {
      const conn = await pool.getConnection();
      await conn.query('TRUNCATE TABLE complaints');
      conn.release();
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  });

  afterAll(async () => {
    try {
      const conn = await pool.getConnection();
      await conn.query('DROP TABLE IF EXISTS complaints');
      conn.release();
      await pool.end();
    } catch (error) {
      console.error('Teardown failed:', error);
    }
  });

  test('should insert a complaint into the database', async () => {
    const conn = await pool.getConnection();
    const { title, description, category, priority } = validComplaint;
    
    const result = await conn.query(
      'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, priority, 'Open']
    );
    
    expect(result[0].affectedRows).toBe(1);
    expect(result[0].insertId).toBeGreaterThan(0);
    conn.release();
  });

  test('should retrieve a complaint by id', async () => {
    const conn = await pool.getConnection();
    const { title, description, category, priority } = validComplaint;
    
    const insertResult = await conn.query(
      'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, priority, 'Open']
    );
    
    const complaintId = insertResult[0].insertId;
    const [complaints] = await conn.query('SELECT * FROM complaints WHERE id = ?', [complaintId]);
    
    expect(complaints).toHaveLength(1);
    expect(complaints[0].id).toBe(complaintId);
    expect(complaints[0].title).toBe(title);
    conn.release();
  });

  test('should update complaint status', async () => {
    const conn = await pool.getConnection();
    const { title, description, category, priority } = validComplaint;
    
    const insertResult = await conn.query(
      'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, priority, 'Open']
    );
    
    const complaintId = insertResult[0].insertId;
    await conn.query('UPDATE complaints SET status = ? WHERE id = ?', ['Resolved', complaintId]);
    
    const [complaints] = await conn.query('SELECT * FROM complaints WHERE id = ?', [complaintId]);
    expect(complaints[0].status).toBe('Resolved');
    conn.release();
  });

  test('should delete a complaint', async () => {
    const conn = await pool.getConnection();
    const { title, description, category, priority } = validComplaint;
    
    const insertResult = await conn.query(
      'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, priority, 'Open']
    );
    
    const complaintId = insertResult[0].insertId;
    await conn.query('DELETE FROM complaints WHERE id = ?', [complaintId]);
    
    const [complaints] = await conn.query('SELECT * FROM complaints WHERE id = ?', [complaintId]);
    expect(complaints).toHaveLength(0);
    conn.release();
  });

  test('should retrieve all complaints', async () => {
    const conn = await pool.getConnection();
    
    for (const complaint of [validComplaint, complaintWithAllFields]) {
      await conn.query(
        'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
        [complaint.title, complaint.description, complaint.category, complaint.priority, 'Open']
      );
    }
    
    const [complaints] = await conn.query('SELECT * FROM complaints');
    expect(complaints).toHaveLength(2);
    conn.release();
  });

  test('should handle database connection errors gracefully', async () => {
    const invalidPool = mysql.createPool({
      host: 'invalid-host',
      user: 'invalid',
      password: 'invalid',
      database: 'invalid',
      connectionLimit: 1,
      waitForConnections: true
    });

    await expect(async () => {
      const conn = await invalidPool.getConnection();
    }).rejects.toThrow();

    await invalidPool.end();
  });

  test('should enforce priority enum constraint', async () => {
    const conn = await pool.getConnection();
    
    try {
      await conn.query(
        'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
        ['Test', 'Test', 'IT', 'InvalidPriority', 'Open']
      );
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    conn.release();
  });
});
````

---

### /home/ishimwe-didier/Complaint_Management_System/tests/unit/api.test.js

Unit tests for API endpoints.

````javascript
// filepath: /home/ishimwe-didier/Complaint_Management_System/tests/unit/api.test.js
const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../index');
const { validComplaint, complaintWithAllFields } = require('../fixtures/complaint.fixture');

describe('API Endpoints - Unit Tests', () => {
  let pool;

  beforeAll(async () => {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    conn.release();
  });

  beforeEach(async () => {
    const conn = await pool.getConnection();
    await conn.query('TRUNCATE TABLE complaints');
    conn.release();
  });

  afterAll(async () => {
    const conn = await pool.getConnection();
    await conn.query('DROP TABLE IF EXISTS complaints');
    conn.release();
    await pool.end();
  });

  describe('GET /api/complaints', () => {
    test('should return empty array when no complaints exist', async () => {
      const response = await request(app)
        .get('/api/complaints')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    test('should return all complaints', async () => {
      const conn = await pool.getConnection();
      
      for (const complaint of [validComplaint, complaintWithAllFields]) {
        await conn.query(
          'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
          [complaint.title, complaint.description, complaint.category, complaint.priority, 'Open']
        );
      }
      
      conn.release();

      const response = await request(app)
        .get('/api/complaints')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('status');
    });

    test('should return complaints sorted by most recent first', async () => {
      const conn = await pool.getConnection();
      
      const complaint1 = await conn.query(
        'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
        ['First', 'Description 1', 'IT', 'Low', 'Open']
      );
      
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const complaint2 = await conn.query(
        'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
        ['Second', 'Description 2', 'IT', 'High', 'Open']
      );
      
      conn.release();

      const response = await request(app)
        .get('/api/complaints')
        .expect(200);

      expect(response.body[0].title).toBe('Second');
      expect(response.body[1].title).toBe('First');
    });
  });

  describe('POST /api/complaints', () => {
    test('should create a new complaint successfully', async () => {
      const response = await request(app)
        .post('/api/complaints')
        .send(validComplaint)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('successfully');
    });

    test('should create complaint with all required fields', async () => {
      const response = await request(app)
        .post('/api/complaints')
        .send(complaintWithAllFields)
        .expect(201);

      const complaints = await request(app).get('/api/complaints');
      expect(complaints.body).toHaveLength(1);
      expect(complaints.body[0].title).toBe(complaintWithAllFields.title);
      expect(complaints.body[0].category).toBe(complaintWithAllFields.category);
      expect(complaints.body[0].priority).toBe(complaintWithAllFields.priority);
      expect(complaints.body[0].status).toBe('Open');
    });

    test('should handle missing required fields', async () => {
      const incompleteComplaint = {
        title: 'Only Title'
      };

      const response = await request(app)
        .post('/api/complaints')
        .send(incompleteComplaint);

      expect(response.status).toBe(500);
    });

    test('should set default status to Open', async () => {
      await request(app)
        .post('/api/complaints')
        .send(validComplaint)
        .expect(201);

      const response = await request(app).get('/api/complaints');
      expect(response.body[0].status).toBe('Open');
    });
  });

  describe('PUT /api/complaints/:id', () => {
    test('should update complaint status successfully', async () => {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
        [validComplaint.title, validComplaint.description, validComplaint.category, validComplaint.priority, 'Open']
      );
      const complaintId = result[0].insertId;
      conn.release();

      const response = await request(app)
        .put(`/api/complaints/${complaintId}`)
        .send({ status: 'Resolved' })
        .expect(200);

      expect(response.body).toHaveProperty('message');

      const getResponse = await request(app).get('/api/complaints');
      expect(getResponse.body[0].status).toBe('Resolved');
    });

    test('should return error for non-existent complaint', async () => {
      const response = await request(app)
        .put('/api/complaints/99999')
        .send({ status: 'Resolved' });

      expect(response.status).toBe(500);
    });

    test('should update to different statuses', async () => {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
        [validComplaint.title, validComplaint.description, validComplaint.category, validComplaint.priority, 'Open']
      );
      const complaintId = result[0].insertId;
      conn.release();

      const statuses = ['In Progress', 'Resolved', 'Closed'];
      
      for (const status of statuses) {
        await request(app)
          .put(`/api/complaints/${complaintId}`)
          .send({ status })
          .expect(200);

        const response = await request(app).get('/api/complaints');
        expect(response.body[0].status).toBe(status);
      }
    });
  });

  describe('DELETE /api/complaints/:id', () => {
    test('should delete complaint successfully', async () => {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO complaints (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)',
        [validComplaint.title, validComplaint.description, validComplaint.category, validComplaint.priority, 'Open']
      );
      const complaintId = result[0].insertId;
      conn.release();

      await request(app)
        .delete(`/api/complaints/${complaintId}`)
        .expect(200);

      const response = await request(app).get('/api/complaints');
      expect(response.body).toHaveLength(0);
    });

    test('should handle deletion of non-existent complaint', async () => {
      const response = await request(app)
        .delete('/api/complaints/99999');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /', () => {
    test('should serve index.html', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Complaint Management');
    });
  });
});
````

---

### /home/ishimwe-didier/Complaint_Management_System/tests/integration/complaint-flow.integration.test.js

Integration tests for complete workflows.

````javascript
// filepath: /home/ishimwe-didier/Complaint_Management_System/tests/integration/complaint-flow.integration.test.js
const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../index');
const { 
  validComplaint, 
  complaintWithAllFields, 
  multipleComplaints 
} = require('../fixtures/complaint.fixture');

describe('Complaint Management Flow - Integration Tests', () => {
  let pool;

  beforeAll(async () => {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    conn.release();
  });

  beforeEach(async () => {
    const conn = await pool.getConnection();
    await conn.query('TRUNCATE TABLE complaints');
    conn.release();
  });

  afterAll(async () => {
    const conn = await pool.getConnection();
    await conn.query('DROP TABLE IF EXISTS complaints');
    conn.release();
    await pool.end();
  });

  test('should complete full complaint lifecycle: Create -> Read -> Update -> Delete', async () => {
    // Step 1: Create complaint
    const createResponse = await request(app)
      .post('/api/complaints')
      .send(validComplaint)
      .expect(201);

    expect(createResponse.body.message).toContain('successfully');

    // Step 2: Read all complaints
    const readAllResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(readAllResponse.body).toHaveLength(1);
    const complaintId = readAllResponse.body[0].id;
    const createdComplaint = readAllResponse.body[0];

    expect(createdComplaint.title).toBe(validComplaint.title);
    expect(createdComplaint.status).toBe('Open');

    // Step 3: Update complaint status
    const updateResponse = await request(app)
      .put(`/api/complaints/${complaintId}`)
      .send({ status: 'In Progress' })
      .expect(200);

    expect(updateResponse.body.message).toContain('successfully');

    // Verify update
    const verifyUpdateResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(verifyUpdateResponse.body[0].status).toBe('In Progress');

    // Step 4: Delete complaint
    const deleteResponse = await request(app)
      .delete(`/api/complaints/${complaintId}`)
      .expect(200);

    expect(deleteResponse.body.message).toContain('successfully');

    // Verify deletion
    const verifyDeleteResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(verifyDeleteResponse.body).toHaveLength(0);
  });

  test('should handle multiple complaints in workflow', async () => {
    // Create multiple complaints
    for (const complaint of multipleComplaints) {
      await request(app)
        .post('/api/complaints')
        .send(complaint)
        .expect(201);
    }

    // Verify all created
    const listResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(listResponse.body).toHaveLength(3);

    // Update each complaint with different status
    const statuses = ['In Progress', 'Resolved', 'Closed'];
    
    for (let i = 0; i < listResponse.body.length; i++) {
      await request(app)
        .put(`/api/complaints/${listResponse.body[i].id}`)
        .send({ status: statuses[i] })
        .expect(200);
    }

    // Verify all updated
    const updatedResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(updatedResponse.body[0].status).toBe('Closed');
    expect(updatedResponse.body[1].status).toBe('Resolved');
    expect(updatedResponse.body[2].status).toBe('In Progress');
  });

  test('should handle concurrent complaint creation', async () => {
    const promises = multipleComplaints.map(complaint =>
      request(app)
        .post('/api/complaints')
        .send(complaint)
    );

    const responses = await Promise.all(promises);

    responses.forEach(response => {
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('successfully');
    });

    const listResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(listResponse.body).toHaveLength(multipleComplaints.length);
  });

  test('should maintain data integrity across operations', async () => {
    // Create complaint
    await request(app)
      .post('/api/complaints')
      .send(complaintWithAllFields)
      .expect(201);

    // Get original data
    const originalResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    const originalComplaint = originalResponse.body[0];
    const complaintId = originalComplaint.id;

    // Verify all fields are preserved
    expect(originalComplaint.title).toBe(complaintWithAllFields.title);
    expect(originalComplaint.description).toBe(complaintWithAllFields.description);
    expect(originalComplaint.category).toBe(complaintWithAllFields.category);
    expect(originalComplaint.priority).toBe(complaintWithAllFields.priority);
    expect(originalComplaint.created_at).toBeDefined();
    expect(originalComplaint.updated_at).toBeDefined();

    // Update and verify integrity
    await request(app)
      .put(`/api/complaints/${complaintId}`)
      .send({ status: 'Resolved' })
      .expect(200);

    const updatedResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    const updatedComplaint = updatedResponse.body[0];

    // Original fields should not change
    expect(updatedComplaint.title).toBe(originalComplaint.title);
    expect(updatedComplaint.description).toBe(originalComplaint.description);
    expect(updatedComplaint.category).toBe(originalComplaint.category);
    expect(updatedComplaint.priority).toBe(originalComplaint.priority);
    // Only status should change
    expect(updatedComplaint.status).toBe('Resolved');
  });

  test('should handle error recovery correctly', async () => {
    // Create valid complaint
    await request(app)
      .post('/api/complaints')
      .send(validComplaint)
      .expect(201);

    // Try invalid operation
    const invalidResponse = await request(app)
      .post('/api/complaints')
      .send({ title: '' }); // Missing required fields

    expect(invalidResponse.status).toBeGreaterThanOrEqual(400);

    // Verify database still has original complaint
    const listResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].title).toBe(validComplaint.title);
  });

  test('should filter complaints by status progression', async () => {
    // Create complaints
    const complaint1 = await request(app)
      .post('/api/complaints')
      .send({ ...validComplaint, title: 'Complaint 1' });

    const complaint2 = await request(app)
      .post('/api/complaints')
      .send({ ...validComplaint, title: 'Complaint 2' });

    // Update statuses
    const allComplaints = await request(app)
      .get('/api/complaints')
      .expect(200);

    await request(app)
      .put(`/api/complaints/${allComplaints.body[0].id}`)
      .send({ status: 'Resolved' });

    await request(app)
      .put(`/api/complaints/${allComplaints.body[1].id}`)
      .send({ status: 'Open' });

    // Verify different statuses
    const finalResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    const openComplaints = finalResponse.body.filter(c => c.status === 'Open');
    const resolvedComplaints = finalResponse.body.filter(c => c.status === 'Resolved');

    expect(openComplaints).toHaveLength(1);
    expect(resolvedComplaints).toHaveLength(1);
  });

  test('should handle bulk operations correctly', async () => {
    // Create all complaints
    const createPromises = multipleComplaints.map(complaint =>
      request(app)
        .post('/api/complaints')
        .send(complaint)
    );

    await Promise.all(createPromises);

    // Get all complaints
    const listResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(listResponse.body).toHaveLength(3);

    // Delete all complaints
    const deletePromises = listResponse.body.map(complaint =>
      request(app)
        .delete(`/api/complaints/${complaint.id}`)
    );

    await Promise.all(deletePromises);

    // Verify all deleted
    const finalResponse = await request(app)
      .get('/api/complaints')
      .expect(200);

    expect(finalResponse.body).toHaveLength(0);
  });
});
````

---

### /home/ishimwe-didier/Complaint_Management_System/tests/integration/api-response.integration.test.js

Integration tests for API response validations.

````javascript
// filepath: /home/ishimwe-didier/Complaint_Management_System/tests/integration/api-response.integration.test.js
const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../index');
const { validComplaint } = require('../fixtures/complaint.fixture');

describe('API Response Validation - Integration Tests', () => {
  let pool;

  beforeAll(async () => {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    conn.release();
  });

  beforeEach(async () => {
    const conn = await pool.getConnection();
    await conn.query('TRUNCATE TABLE complaints');
    conn.release();
  });

  afterAll(async () => {
    const conn = await pool.getConnection();
    await conn.query('DROP TABLE IF EXISTS complaints');
    conn.release();
    await pool.end();
  });

  test('should return proper JSON response format', async () => {
    const response = await request(app)
      .post('/api/complaints')
      .send(validComplaint)
      .expect(201);

    expect(response.type).toMatch(/json/);
    expect(typeof response.body).toBe('object');
  });

  test('should include all required fields in complaint response', async () => {
    await request(app)
      .post('/api/complaints')
      .send(validComplaint)
      .expect(201);

    const response = await request(app)
      .get('/api/complaints')
      .expect(200);

    const requiredFields = ['id', 'title', 'description', 'category', 'priority', 'status', 'created_at'];
    requiredFields.forEach(field => {
      expect(response.body[0]).toHaveProperty(field);
    });
  });

  test('should return correct HTTP status codes', async () => {
    // POST success
    await request(app)
      .post('/api/complaints')
      .send(validComplaint)
      .expect(201);

    const allComplaints = await request(app).get('/api/complaints');
    const complaintId = allComplaints.body[0].id;

    // GET success
    await request(app)
      .get('/api/complaints')
      .expect(200);

    // PUT success
    await request(app)
      .put(`/api/complaints/${complaintId}`)
      .send({ status: 'Resolved' })
      .expect(200);

    // DELETE success
    await request(app)
      .delete(`/api/complaints/${complaintId}`)
      .expect(200);
  });

  test('should include error messages in error responses', async () => {
    const response = await request(app)
      .post('/api/complaints')
      .send({ invalid: 'data' });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
````

---

### /home/ishimwe-didier/Complaint_Management_System/.github/workflows/ci.yml

Updated GitHub Actions with test coverage.

````yaml
// filepath: /home/ishimwe-didier/Complaint_Management_System/.github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: complaints_db_test
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DB_HOST: localhost
          DB_USER: root
          DB_PASSWORD: password
          DB_NAME: complaints_db_test
      
      - name: Generate coverage report
        run: npm run coverage:report
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: false
      
      - name: Build Docker image
        run: docker build -t complaints-app:latest .
      
      - name: Archive test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: coverage/
````

---

### /home/ishimwe-didier/Complaint_Management_System/.gitignore

Updated to include test artifacts.

=======
# Complaint_Management
>>>>>>> b5a3024102655405ecf88be61ffc9371124bf2f9
