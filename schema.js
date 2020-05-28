const axios = require('axios');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLSkipDirective,
	graphqlSync
} = require("graphql")


/* 
Hardcoded Data
const customers = [
	{id: "1", name: "JohnDoe", email: "jd@gmail.com", age: 54},
	{id: "2", name: "Steve M", email: "steve@gmail.com", age: 14},
	{id: "3", name: "Sara W", email: "sara@gmail.com", age: 54},
]
*/

// Customer Type
const CustomerType = new GraphQLObjectType({
    name:'Customer',
    fields:() => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
				/* Heardcoded find in the DB
				for (let i = 0; i < customers.length; i++) {
					if(customers[i].id == args.id) {
						return customers[i]
					}
				}
				*/
				return axios.get(`http://localhost:3000/customers/${args.id}`)
							.then(res => res.data)
            }
		},
		customers: {
			type: new GraphQLList(CustomerType),
			// doesnt have args cause im not gonna fetch them by the id
			resolve(parentValue, args) {
				// return customers;
				return axios.get(`http://localhost:3000/customers`)
							.then(res => res.data)
			}
		}  
    }
});


// Mutations, the way to edit the data
const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addCustomer: {
			type: CustomerType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)}, // wrapped in nonNull to make it required
				email: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)},
			},
			resolve(parentValue, args) {
				return axios.post(`http://localhost:3000/customers/`, {
					name: args.name,
					email: args.email,
					age: args.age
				}).then(res => res.data)
			}
		},
		deleteCustomer: {
			type: CustomerType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve(parentValue, args) {
				return axios.delete(`http://localhost:3000/customers/${args.id}`)
							.then(res => res.data)
			}
		},
		editCustomer: {
			type: CustomerType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLString)},
				name: {type: GraphQLString}, // wrapped in nonNull to make it required
				email: {type: GraphQLString},
				age: {type: GraphQLInt},
			},
			resolve(parentValue, args) {
				return axios.patch(`http://localhost:3000/customers/${args.id}`, args)
							.then(res => res.data)
			}
		},
	}
})


module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});


// http://localhost:4000/graphql to access

/*
querys:

{
	customer(id:"1") {
		name,
		age
	}
}

{
  customers {
    name,
    age,
    id
  }
}

{
	db(how) {
		what
	}
}
}


mutations:

- post:

mutation {
  addCustomer(name:"Daniela", email:"d@gmail.com", age: 25) {
    id,
    name,
    email
  }
}

mutation {
  editCustomer(id: "1", age: 50) {
    id,
    name,
    age
  }
}
mutation {
	function(how, body) {
		res
	}
}
*/