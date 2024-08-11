const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
const port = 3000;
const db = new sqlite3.Database('database/database.db');

app.use(express.json());
app.use(cors());

const insertUserQuery = `INSERT INTO posts (name, post, date) VALUES (?, ?, ?)`;

//POST Request to add data to DB
app.post('/add/posts', async (req, res) => {
    const { name, post, date = Date.now() } = req.body;
    try {
        await new Promise((resolve, reject) => {
            db.run(insertUserQuery, [name, post, date], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.send('Done, the values are inserted into the database');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while inserting the values into the database');
    }
});

app.get('/posts', (req, res) => {
    console.log(req.body);
    db.all('SELECT * FROM posts', (error, rows) => {
        if (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving the users');
        } else {
            console.log(rows);
            res.send(rows);
        }
    });
});

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { post, editedAt = Date.now() } = req.body;

    try {
        // Fetch the existing record to get the name
        const existingRecord = await new Promise((resolve, reject) => {
            db.get('SELECT name FROM posts WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!existingRecord) {
            return res.status(404).send('Record not found');
        }

        const { name } = existingRecord;

        await new Promise((resolve, reject) => {
            db.run('UPDATE posts SET name = ?, post = ?, editedAt = ? WHERE id = ?', [name, post, editedAt, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        res.send('Done, the record is updated in the database');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the record in the database');
    }
});
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Read id from the URL parameters
    try {
        // Check if the record exists
        const recordExists = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(!!row);
                }
            });
        });

        if (!recordExists) {
            return res.status(404).send('Record not existed or already deleted');
        }

        // Proceed to delete the record
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        res.send('Done, the record is deleted from the database');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while deleting the record from the database');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// import express from 'express';
// import sqlite3 from 'sqlite3';
// import cors from 'cors';
//
//
// const app = express();
// const port = 3000;
// const db = new sqlite3.Database('database/database.db');
//
// app.use(express.json());
// app.use(cors());
//
// const insertUserQuery = `INSERT INTO posts (name, post, date) VALUES (?, ?, ?) `;
//
// app.post('/add/posts', async (req, res) => {
//     const { name, post, date=Date.now() } = req.body;
//     try {
//         await new Promise((resolve, reject) => {
//             db.run(insertUserQuery, [name, post, date], function (err) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//         res.send('Done, the values are inserted into the database');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while inserting the values into the database');
//     }
// });
//
// app.get('/posts', (req, res) => {
//     console.log(req.body);
//     db.all('SELECT * FROM posts', (error, rows) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('An error occurred while retrieving the users');
//         } else {
//             console.log(rows);
//             res.send(rows);
//         }
//     });
// });
//
//
// app.put('/update/:id', async (req, res) => {
//     const { id } = req.params;
//     const { post } = req.body;
//
//     try {
//         // Fetch the existing record to get the name
//         const existingRecord = await new Promise((resolve, reject) => {
//             db.get('SELECT name FROM posts WHERE id = ?', [id], (err, row) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(row);
//                 }
//             });
//         });
//
//         if (!existingRecord) {
//             return res.status(404).send('Record not found');
//         }
//
//         const { name } = existingRecord;
//
//         await new Promise((resolve, reject) => {
//             db.run('UPDATE posts SET name = ?, post = ? WHERE id = ?', [name, post, id], function (err) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//
//         res.send('Done, the record is updated in the database');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while updating the record in the database');
//     }
// });


// app.put('/update/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, post } = req.body;
//     try {
//         await new Promise((resolve, reject) => {
//             db.run('UPDATE posts SET name = ?, post = ? WHERE id = ?', [name, post, id], function (err) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//         res.send('Done, the record is updated in the database');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while updating the record in the database');
//     }
// });

// app.delete('/delete/:id', async (req, res) => {
//     const { id } = req.params; // Read id from the URL parameters
//     try {
//         // Check if the record exists
//         const recordExists = await new Promise((resolve, reject) => {
//             db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(!!row);
//                 }
//             });
//         });
//
//         if (!recordExists) {
//             return res.status(404).send('Record not existed or already deleted');
//         }
//
//         // Proceed to delete the record
//         await new Promise((resolve, reject) => {
//             db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//
//         res.send('Done, the record is deleted from the database');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while deleting the record from the database');
//     }
// });
//
//
// app.listen(port, () => {
//     console.log(`http://localhost:${port}`);
// });
