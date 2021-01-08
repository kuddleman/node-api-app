const Joi = require('joi')
const express = require('express')
const app = express()

// This is middleware
app.use(express.json())

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]

app.get('/', (req, res)=>{
    res.send('Hello World')
})

app.get('/api/courses', (req, res)=>{
    res.send(courses)
})

app.get('/api/courses/:id',( req, res )=>{
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) res.status(404).send('The course with the given id was not found')
    res.send(course)
})

// Post request to create a new course
app.post('/api/courses', (req, res)=>{

     //validation using Joi package
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    const result = schema.validate(req.body)
    
   
    if (result.error) {
        // 400 bad request
        res.status(400).send(result.error.details[0].message)
        return
    }

// create new course object
    const course = {
        id: courses.length + 1,
        // read the name from the body of the request
        name: req.body.name
    }
    courses.push(course)
    // when the server creates a new object, it should return the new 
    // resource in the body of the response. 
    res.send(course)
})

//Port
const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`)
})