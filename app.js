// Using express
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {

    // Validate requests
    const { error } = validateCourse(req.body); // result.error

    // If invalid, return 400 - Bad request
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the give ID was not found');
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    // If not exists, return 404
    if (!course) return res.status(404).send('The course with the give ID was not found');

    // Validate requests
    const { error } = validateCourse(req.body); // result.error

    // If invalid, return 400 - Bad request
    if (error) return res.status(400).send(error.details[0].message);

    // Update course
    course.name = req.body.name;

    // Return the updated course
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    // If not exists, return 404
    if (!course) return res.status(404).send('The course with the give ID was not found');

    // Delete the course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}

// Port
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening in port ${port}`));


// Traditional Way
// const http = require('http');

// const server = http.createServer((req, res) => {
//     if (req.url === '/') {
//         res.write('Hello World');
//         res.end();
//     }

//     if (req.url === '/api/courses') {
//         res.write(JSON.stringify([1, 2, 3]));
//         res.end();
//     }
// });

// server.listen(3000);

// console.log('Listening on port 3000...');