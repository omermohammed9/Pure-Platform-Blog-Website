const sqlite3 = require('sqlite3');


const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});
    db.run(
    `ALTER table posts ADD COLUMN  editedAt INTEGER`
    , (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "posts" created successfully.');
        }
    }
)
db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
})