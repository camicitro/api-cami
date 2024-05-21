const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: "Movie title must be a string",
        required_error: "Movie title is required"
    }), 
    year: z.number().int().min(1900).max(2024),
    duration: z.number().int().positive(),
    genre: z.array(
        z.enum(['Accion', 'Familiar', 'Fantasia', 'Terror', 'Comedia', 'Romance', 'Aventura', 'Drama', 'Ciencia ficcion'])
    )
})

function validateMovie(object) {
    return movieSchema.safeParse(object) //safeParse devuelve un objeto result q dice si hay error o si hay datos
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object) //partial hace que todas las propiedades sean opcionales
    
}

module.exports = {
    validateMovie,
    validatePartialMovie
}