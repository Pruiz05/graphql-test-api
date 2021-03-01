const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const CreateToken = (user, secret, expiresIn) => {
  const { id, email, name, lastname } = user;
  return jwt.sign({ id, email, name, lastname }, secret, { expiresIn });
};

// Resolver
const resolvers = {
  Query: {
    // obtenerCursos: () => "Hello World",
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.SECRET_TOKEN);
      return userId;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});

        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProductByID: async (_, { id }) => {
      try {
        const product = await Product.findById(id);

        if (!product) {
          throw new Error("El producto consultado no existe");
        }

        return product;
      } catch (error) {}
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});

      return clients;
      } catch (error) {
        console.log(error)
      }
    },
    getClientByVendor: async (_, {}, context) => {
      try {
        const clients = await Client.find({vendor: context.user.id.toString()});
        return clients;
      } catch (error) {
        console.log(error)
      }
    },
    getClientById: async(_, { id }, context) => {
      try {
        const client = await Client.findById(id);

        if (!client) {
          throw new Error("El cliente consultado no existe");
        }

        if (client.vendor.toString() !== context.user.id) {
          throw new Error('No autorizado para esta información')
        }

        return client;
      } catch (error) {
        console.log(error)
      }
    }
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      console.log(input);
      // revisar si el usuario esta reistrdo
      const userExist = await User.findOne({
        email,
      });

      if (userExist) {
        throw new Error("El Usuario ya está registrado.");
      }

      // hashear pass
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        // guardar en db
        const user = new User(input);

        user.save();

        return user;
      } catch (error) {
        console.log(error);
      }
    },
    userAuthentication: async (_, { input }) => {
      // try {
      //
      const { email, password } = input;

      // validar si el usuario existe
      const userExist = await User.findOne({
        email,
      });

      if (!userExist) {
        throw new Error("El usuario no existe");
      }

      // validar si el password es correcti
      const correctPassword = await bcryptjs.compare(
        password,
        userExist.password
      );
      if (!correctPassword) {
        throw new Error("Usuario y/o Contraseña incorrectos.");
      }
      // Crear token
      return {
        token: CreateToken(userExist, process.env.SECRET_TOKEN, "24h"),
      };

      // } catch (error) {}
    },
    newProduct: async (_, { input }) => {
      try {
        const newProduct = new Product(input);

        // save in bd
        const result = await newProduct.save();

        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      try {
        let product = await Product.findById(id);

        if (!product) {
          throw new Error("El producto consultado no existe");
        }

        product = await Product.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return product;
      } catch (error) {
        console.log(error);
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        let product = await Product.findById(id);

        if (!product) {
          throw new Error("El producto consultado no existe");
        }

        await Product.findOneAndDelete( {_id: id});

        return "Producto eliminado";
      } catch (error) {
        console.log(error)
      }
    },
    newClient: async (_, {input}, context) => {
      try {
        const { email } = input
        const client = await Client.findOne({email});

        if (client) {
          throw new Error('El Correo ya existe');
        }

        const newClient = new Client(input);

        newClient.vendor = context.user.id;

        const result =  await newClient.save();

        return result;

      } catch (error) {
        console.log(error)
      }
    },
    updateClient: async (_, { id, input }, context) => {
      try {
        console.log(input)
        let client = await Client.findById(id);

        if (!client) {
          throw new Error("El cliente consultado no existe");
        }

        // verificar si el vendedor es que edita
        if (client.vendor.toString() !== context.user.id) {
          throw new Error('No autorizado para esta información')
        }

        client = await Client.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return client;
      } catch (error) {
        console.log(error)
      }
    },
    deleteClient: async(_, {id}, context) => {
      try {
        
        const client = await Client.findById(id);

        if (!client) {
          throw new Error('El Cliente no existe');
        }

        // verificar si el vendedor es que edita
        if (client.vendor.toString() !== context.user.id) {
          throw new Error('No autorizado para esta información')
        }

        await Client.findOneAndDelete({_id: id});

        return 'Cliente Eliminado exitosamente';

      } catch (error) {
        console.log(error)
      }
    }
  },
};

module.exports = resolvers;
