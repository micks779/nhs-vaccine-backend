const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, '../data/staff.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create tables if they don't exist
        createTables();
    }
});

// Create necessary tables
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS staff (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_number TEXT UNIQUE,
            directorate TEXT,
            organisation TEXT,
            employee_first_name TEXT,
            employee_last_name TEXT,
            email TEXT,
            vaccinated TEXT DEFAULT 'no',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// Save staff details
function saveStaffDetails(staffData) {
    return new Promise((resolve, reject) => {
        const { 
            employee_number, 
            directorate, 
            organisation,
            employee_first_name,
            employee_last_name,
            email
        } = staffData;
        
        db.run(
            `INSERT OR REPLACE INTO staff (
                employee_number, 
                directorate, 
                organisation,
                employee_first_name,
                employee_last_name,
                email
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                employee_number,
                directorate,
                organisation,
                employee_first_name,
                employee_last_name,
                email
            ],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}

// Update vaccination status
function updateVaccinationStatus(employee_number, status) {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE staff SET vaccinated = ? WHERE employee_number = ?',
            [status, employee_number],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            }
        );
    });
}

// Get staff details by employee number
function getStaffByEmployeeNumber(employee_number) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM staff WHERE employee_number = ?', [employee_number], (err, staff) => {
            if (err) {
                reject(err);
            } else {
                resolve(staff);
            }
        });
    });
}

// Get staff details by email
function getStaffByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM staff WHERE email = ?', [email], (err, staff) => {
            if (err) {
                reject(err);
            } else {
                resolve(staff);
            }
        });
    });
}

// Get all staff
function getAllStaff() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM staff
            ORDER BY employee_last_name, employee_first_name
        `;
        
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Get unique directorates
function getDirectorates() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT DISTINCT directorate 
            FROM staff 
            WHERE directorate IS NOT NULL AND directorate != ''
            ORDER BY directorate
        `;
        
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error fetching directorates:', err);
                reject(err);
            } else {
                const directorates = rows.map(row => row.directorate);
                console.log('Fetched directorates:', directorates);
                resolve(directorates);
            }
        });
    });
}

// Get unique organisations
function getOrganisations() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT DISTINCT organisation 
            FROM staff 
            WHERE organisation IS NOT NULL AND organisation != ''
            ORDER BY organisation
        `;
        
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error fetching organisations:', err);
                reject(err);
            } else {
                const organisations = rows.map(row => row.organisation);
                console.log('Fetched organisations:', organisations);
                resolve(organisations);
            }
        });
    });
}

module.exports = {
    saveStaffDetails,
    updateVaccinationStatus,
    getStaffByEmployeeNumber,
    getStaffByEmail,
    getAllStaff,
    getDirectorates,
    getOrganisations
}; 