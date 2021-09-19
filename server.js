const express = require('express');
const  { graphqlHTTP }  = require('express-graphql');
const {
GraphQLSchema,
GraphQLObjectType,
GraphQLString,
GraphQLList,
GraphQLNonNull,
GraphQLInt
} = require('graphql');
const app = express();

const authors = [
    {id:1,name:"John Elia"},
    {id:2,name:"Mirza Ghalib"},
    {id:3,name:"Allam Iqbal"},
];

const books = [
    { id: 1, name: "SHAYAD", authorId: 1 },
    { id: 2, name: "DEWAAN E GHALIB", authorId: 2 },
    { id: 3, name: "SHYAD 2", authorId: 1 },
    { id: 4, name: "SHIKA", authorId: 3 },
    { id: 5, name: "ISHQIA", authorId: 2 },
    { id: 6, name: "PARIZAAD", authorId: 2 },
    { id: 7, name: "JAWAB E SHIKWA", authorId: 3 },
    { id: 8, name: "SAYYAN SUPER START", authorId: 3 },
];


const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represent a book written by author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represent a author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => 
            {
               return  books.filter(book => book.authorId === author.id)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    description: "This is Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: "a books",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parents, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List of books",
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of Authoer",
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: "a Author",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parents, args) => authors.find(author => author.id === args.id)
        }
    })
});

const RootMutation = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "Add a book",
            args:{
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authors
                }
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "Add a author",
            args:{
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name,
                }
                authors.push(author);
                return author;
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});

app.use('/graphql',graphqlHTTP({
    graphiql:true,
    schema
}));
app.listen(5005,()=>console.log("Yo! server is running"));