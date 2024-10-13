const rateLimit = require('express-rate-limit');

const limit = rateLimit({
    window: 1 * 60 * 1000,
    max: 30,
    message: 'Anda melakukan banyak request data yang sangat banyak dalam waktu singkat...'
})

module.exports = limit