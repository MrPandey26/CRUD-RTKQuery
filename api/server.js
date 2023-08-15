import {ApolloServer, gql} from "apollo-server";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"
import {users} from './fakedb.js'
import {randomBytes} from 'crypto'
const typeDefs = gql`
    type User{
        id:ID!
        firstName:String
        lastName:String
        email: String
    }
    type Query {
        users:[User]
        user(id:ID!):User       
    }
    type Mutation {
        createUser(userNew:userInput!):User
        updateUser(id:ID!, update:userInput!): User
        deleteUser(id:ID!): User
    }
    input userInput{
        firstName: String!
        lastName: String!
        email:String!
        
    }
`

const resolvers = {
    Query:{
        users:()=> users,
        user:(_,{id})=> {
            return users.find(user=>user.id === id)
        }
    },
   
    Mutation:{
        createUser:(_,{userNew}) => {
            const id = randomBytes(5).toString('hex')
            users.push({
               id,
                ...userNew
            })
            return users.find(user=>user.id === id)
        },
        updateUser:(_,{id, update}) => {
            const index = users.findIndex(users => users.id === id);

            if(index !== -1){
                const { firstName, lastName, email} = update;
                users[index] = {
                    ...users[index],
                    firstName,
                    lastName,
                    email
                };
                return users[index];

            }

        },
        deleteUser:(_,{id}) => {
            const index = users.findIndex(users => users.id === id);

            if(index !== -1){
                const deleteUser = users.splice(index,1)[0];
                return deleteUser
            }
        }
        
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})





server.listen().then(({url}) => {
    console.log(`🚀  Server ready at: ${url}`);
});