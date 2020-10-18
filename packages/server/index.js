const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
  }

  input BookInput {
    title: String!
  }

  type Query {
    books: [Book]!
    randomBooks(max: Int!): [Book]!
  }

  type Mutation {
    addBook(book: BookInput!): Book!
    editBook(id: ID!, book: BookInput!): Book!
  }
`;

let books = [{ id: 1, title: "Keittokirja" }];

const resolvers = {
  Query: {
    books: () => books,
    randomBooks: (_, { max }) => {
      let _arr = [...books];
      return [...Array(max > books.length ? books.length : max)].map(
        () => _arr.splice(Math.floor(Math.random() * _arr.length), 1)[0]
      );
    },
  },
  Mutation: {
    addBook: (_, { book }) => {
      const newBook = {
        id: books.sort((a, b) => b.id - a.id)[0].id + 1,
        ...JSON.parse(JSON.stringify(book)),
      };
      console.log(newBook);
      books = [...books, newBook];
      return newBook;
    },
    editBook: (_, { id, book }) => {
      console.log(id, book);
      let bookToEdit = books.find((b) => b.id === parseInt(id));
      console.log(bookToEdit);
      bookToEdit.title = book.title;
      return bookToEdit;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
