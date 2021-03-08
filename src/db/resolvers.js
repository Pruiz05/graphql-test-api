const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Order = require("../models/Order");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");
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
        console.log(error);
      }
    },
    getClientByVendor: async (_, {}, context) => {
      try {
        const clients = await Client.find({
          vendor: context.user.id.toString(),
        });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClientById: async (_, { id }, context) => {
      try {
        const client = await Client.findById(id);

        if (!client) {
          throw new Error("El cliente consultado no existe");
        }

        if (client.vendor.toString() !== context.user.id) {
          throw new Error("No autorizado para esta información");
        }

        return client;
      } catch (error) {
        console.log(error);
      }
    },
    getOrders: async () => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrdersByVendor: async (_, {}, ctx) => {
      try {
        const orders = await Order.find({ vendor: ctx.user.id });
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrderById: async (_, { id }, ctx) => {
      try {
        const order = await Order.findById(id);

        if (!order) {
          throw new Error("Pedido No encontrado.");
        }

        if (order.vendor.toString() !== ctx.user.id) {
          throw new Error("No tiene las credenciales.");
        }

        return order;
      } catch (error) {
        console.log(error);
      }
    },
    getOrderByState: async (_, { state }, ctx) => {
      try {
        const order = await Order.find({
          vendor: ctx.user.id,
          state,
        });

        if (!order) {
          throw new Error("Pedido No encontrado.");
        }

        return order;
      } catch (error) {
        console.log(error);
      }
    },
    bestClients: async () => {
      try {
        const bestClients = await Order.aggregate([
          { $match: { state: "COMPLETADO" } },
          {
            $group: {
              _id: "$client",
              total: { $sum: "$total" },
            },
          },
          {
            $lookup: {
              from: "clients",
              localField: "_id",
              foreignField: "_id",
              as: "clients",
            },
          },
          {
            $sort: { total: -1 },
          },
        ]);

        console.log(bestClients);

        return bestClients;
      } catch (error) {
        console.log(error);
      }
    },
    bestVendors: async () => {
      try {
        const bestVendors = await Order.aggregate([
          { $match: { state: "COMPLETADO" } },
          {
            $group: {
              _id: "$vendor",
              total: { $sum: "$total" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "vendors",
            },
          },
          {
            $sort: { total: -1 },
          },
        ]);

        console.log(bestVendors);

        return bestVendors;
      } catch (error) {
        console.log(error);
      }
    },
    findProduct: async (_, {text}) => {
      try {
        const products = await Product.find({ $text: { $search: text}})

        if (products.length == 0) {
          return new Error('Producto No encontrado')
        }

        return products
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

        await Product.findOneAndDelete({ _id: id });

        return "Producto eliminado";
      } catch (error) {
        console.log(error);
      }
    },
    newClient: async (_, { input }, context) => {
      try {
        const { email } = input;
        const client = await Client.findOne({ email });

        if (client) {
          throw new Error("El Correo ya existe");
        }

        const newClient = new Client(input);

        newClient.vendor = context.user.id;

        const result = await newClient.save();

        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, context) => {
      try {
        console.log(input);
        let client = await Client.findById(id);

        if (!client) {
          throw new Error("El cliente consultado no existe");
        }

        // verificar si el vendedor es que edita
        if (client.vendor.toString() !== context.user.id) {
          throw new Error("No autorizado para esta información");
        }

        client = await Client.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return client;
      } catch (error) {
        console.log(error);
      }
    },
    deleteClient: async (_, { id }, context) => {
      try {
        const client = await Client.findById(id);

        if (!client) {
          throw new Error("El Cliente no existe");
        }

        // verificar si el vendedor es que edita
        if (client.vendor.toString() !== context.user.id) {
          throw new Error("No autorizado para esta información");
        }

        await Client.findOneAndDelete({ _id: id });

        return "Cliente Eliminado exitosamente";
      } catch (error) {
        console.log(error);
      }
    },
    newOrder: async (_, { input }, context) => {
      try {
        const { client } = input;

        // el cliente existe?
        let clientExist = await Client.findById(client);

        if (!clientExist) {
          throw new Error("El cliente consultado no existe");
        }

        // el cliente pertenece al vendedor
        if (clientExist.vendor.toString() !== context.user.id) {
          throw new Error("No autorizado para esta información");
        }

        // stock disponible
        for await (const element of input.order) {
          const { id } = element;
          const product = await Product.findById(id);

          console.log(product);

          if (element.quantity >= product.stock) {
            throw new Error(
              `El articulo ${product.name} excede la cantidad disponible.`
            );
          } else {
            product.stock = product.stock - element.quantity;
            await product.save();
          }
        }

        // crear nuevo pedido
        const newOrder = new Order(input);

        // asignar vendedor
        newOrder.vendor = context.user.id;

        // guardar en la bd
        const result = await newOrder.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateOrder: async (_, { id, input }, ctx) => {
      try {
        const { client } = input;

        const order = await Order.findById(id);

        // validar si el pedido existe
        if (!order) {
          throw new Error("El pedido consultado no existe");
        }

        // validar si el cliente existe
        const existClient = await Client.findById(client);

        if (!existClient) {
          throw new Error("El cliente no existe");
        }

        // validar si el cliente y el pedido pertenecen al vendedor
        if (existClient.vendor.toString() !== ctx.user.id) {
          throw new Error("No autorizado para esta información");
        }

        // revisar el stock
        for await (const element of input.order) {
          const { id } = element;
          const product = await Product.findById(id);

          console.log(product);

          if (element.quantity >= product.stock) {
            throw new Error(
              `El articulo ${product.name} excede la cantidad disponible.`
            );
          } else {
            product.stock = product.stock - element.quantity;
            await product.save();
          }
        }

        // save
        const result = await Order.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return result;
      } catch (error) {
        console.log(error);
      }
    },
    deleteOrder: async (_, { id }, ctx) => {
      try {
        const order = await Order.findById(id);

        // validar si el pedido existe
        if (!order) {
          throw new Error("El pedido consultado no existe");
        }

        if (order.vendor.toString() !== ctx.user.id) {
          throw new Error("No autorizado para esta información");
        }

        await Order.findByIdAndDelete({ _id: id });

        return "Pedido eliminado satisfacotriamente.";
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;
