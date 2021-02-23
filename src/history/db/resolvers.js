const cursos = [
  {
    titulo: "JavaScript Moderno Guía Definitiva Construye +10 Proyectos",
    tecnologia: "JavaScript ES6",
  },
  {
    titulo: "React – La Guía Completa: Hooks Context Redux MERN +15 Apps",
    tecnologia: "React",
  },
  {
    titulo: "Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s",
    tecnologia: "Node.js",
  },
  {
    titulo: "ReactJS Avanzado – FullStack React GraphQL y Apollo",
    tecnologia: "React",
  },
];

// Resolver
const resolvers = {
  Query: {
    //?  _: objeto que contiene los resultados obtenidos por el resolver
    //? argumentos enviados
    //? context:
    //? info: info sobre la consulta actual
    obtenerCursos: (_, { input }, ctx, info) => {
      console.log(input);

      console.log({
        context: ctx
      })
      const result = cursos.filter(
        (curso) => curso.tecnologia === input.tecnologia
      );
      return result;
    },
    // obtenerTecnologia: () => cursos
  },
};

module.exports = resolvers;
