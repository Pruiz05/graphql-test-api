const User = require('../models/User')
const bcryptjs = require('bcryptjs')

// Resolver
const resolvers = {
  Query: {
    obtenerCursos: () => "Hello World"
  },
  Mutation: {
    newUser: async (_, {input}) => {

      const { email, password } = input
      
      console.log(input)
      // revisar si el usuario esta reistrdo
      const userExist = await User.findOne({
        email
      })

      if(userExist) {
        throw new Error('El Usuario ya está registrado.')
      }
      
      // hashear pass
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        // guardar en db
        const user = new User(input)

        user.save()

        return user;

      } catch (error) {
        console.log(error)
      }
    }
  }
};

module.exports = resolvers;
