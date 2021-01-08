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
    if(!course) return res.status(404).send('The course with the given id was not found')
    res.send(course)
})

// Post request to create a new course
app.post('/api/courses', (req, res)=>{

     //validation using Joi package
     const {error} = validateCourse(req.body)
    
     if (error) return res.status(400).send(error.details[0].message)
         // 400 bad request
         
        

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

// Update a course
app.put('api/courses/:id', (req,res)=>{

    //Look up course
    // If course doesn't exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)  return res.status(404).send('The course with the given ID was not found.')
        
       
    
    // Validate entry data
    //If invalid, return 400 - bad request
    const {error} = validateCourse(req.body)

    // 400 bad request
    if (error) return res.status(400).send(error.details[0].message)
        

    // Update course
    course.name = req.body.name

    // Return the updated course
    res.send(course)
})

const validateCourse = course => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course)
}

// DELETE:

app.delete('/api/courses/:id', (req,res)=>{
    // Look up course
    // If it doesn't exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('The course with the given id was not found')

    //Delete it
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    // Return deleted course
    res.send(course)
})

//Port
const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`)
})