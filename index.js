const express = require('express');
const app = express();
const PORT = 3000;

const Datastore = require('nedb');
const studentsDB = new Datastore({ filename: 'students.db', autoload: true });
const mentorsDB = new Datastore({ filename: 'mentors.db', autoload: true });
const opportunitiesDB = new Datastore({ filename: 'opportunities.db', autoload: true });

app.use(express.json());

// Insert initial opportunities to opportunitiesDB
const initialOpportunities = [
    { title: 'Career Advice Session', category: 'Career Advice' },
    { title: 'Resume Review Workshop', category: 'Resume Review' },
    { title: 'Mock Interview Event', category: 'Mock Interview' }
];

initialOpportunities.forEach(opportunity => {
    opportunitiesDB.insert(opportunity, (err, doc) => {
        if (err) {
            console.error('Error inserting opportunity:', err);
        } else {
            console.log('Opportunity inserted successfully:', doc);
        }
    });
});

// Insert initial mentors to mentorsDB
const initialMentors = [
    { name: 'Mentor 1', category: 'Career Advice' },
    { name: 'Mentor 2', category: 'Resume Review' },
    { name: 'Mentor 3', category: 'Mock Interview' }
];

initialMentors.forEach(mentor => {
    mentorsDB.insert(mentor, (err, doc) => {
        if (err) {
            console.error('Error inserting mentor:', err);
        } else {
            console.log('Mentor inserted successfully:', doc);
        }
    });
});

// Student login route
app.post('/student/login', (req, res) => {
    const { username, password } = req.body;
    studentsDB.findOne({ username, password }, (err, student) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (student) {
                res.json({ message: 'Student logged in successfully' });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    });
});

// Mentor login route
app.post('/mentor/login', (req, res) => {
    const { username, password } = req.body;
    mentorsDB.findOne({ username, password }, (err, mentor) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (mentor) {
                res.json({ message: 'Mentor logged in successfully' });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    });
});

// Admin login route
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'adminpassword') {
        res.json({ message: 'Admin logged in successfully' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Route for viewing coaching opportunities
app.get('/coaching-opportunities', (req, res) => {
    opportunitiesDB.find({}, (err, opportunities) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(opportunities);
        }
    });
});

// Route for adding coaching opportunities
app.post('/coaching-opportunities', (req, res) => {
    const newOpportunity = req.body;
    opportunitiesDB.insert(newOpportunity, (err, opportunity) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(opportunity);
        }
    });
});

// Route for modifying coaching opportunities
app.put('/coaching-opportunities/:id', (req, res) => {
    const opportunityId = req.params.id;
    const updatedOpportunity = req.body;
    opportunitiesDB.update({ _id: opportunityId }, { $set: updatedOpportunity }, {}, (err, numUpdated) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (numUpdated === 0) {
                res.status(404).json({ error: 'Opportunity not found' });
            } else {
                res.json({ message: 'Opportunity updated successfully' });
            }
        }
    });
});

// Route for deleting coaching opportunities
app.delete('/coaching-opportunities/:id', (req, res) => {
    const opportunityId = req.params.id;
    opportunitiesDB.remove({ _id: opportunityId }, {}, (err, numRemoved) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (numRemoved === 0) {
                res.status(404).json({ error: 'Opportunity not found' });
            } else {
                res.json({ message: 'Opportunity deleted successfully' });
            }
        }
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Mentor Guru application!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
