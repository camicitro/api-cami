const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie } = require('./schemas/movies')


const app = express()
app.use(express.json())

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})


//recuperar una pelicula por id 
app.get('/movies/:id', (req, res) => {
    const {id} = req.params
    const movie = movies.find(movie => movie.id == id )
    if (movie) {
        return res.json(movie)
    } else {
        res.status(404).json({ message: "Movie not found" })
    }
})

//recuperar todas las peliculas
app.get('/movies', (req, res) =>{
    const {genre} = req.query 
    if(genre){
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase()) //como genre es un array hay que ver si esta ese genero ahi
            // haciendolo asi en vez de usando includes no tiene que coincidir exacto lo de minusculas y mayusculas
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

//crear una pelicula
app.post('/movies', (req, res) => {
    
    const result = validateMovie(req.body)
    
    if(result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const { title, year, duration, genre } = req.body
    const newMovie = {
        id: crypto.randomUUID(), //UUID: identificador unico universal
        title, 
        year,
        duration,
        genre
        //si hemos validado correctamente, aca en vez de indicar cada atributo, podemos poner:
        // ...result.data
    }

    //esto no es REST pq guardamos estado de app en memoria:
    movies.push(newMovie)

    res.status(201).json(newMovie)
})