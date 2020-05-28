const axios = require('axios');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLSkipDirective
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


module.exports = new GraphQLSchema({
	query: RootQuery
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

*/