const mongoose = require('mongoose')
require('dotenv').config({path: '.env'})

const config = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}


const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, config);

        console.log('DB connected!')
    } catch (e) {
        console.log('Error al conectar con la base de datos')
        console.log(e)
        process.exit(1)
    }
}

module.exports = ConnectDB;