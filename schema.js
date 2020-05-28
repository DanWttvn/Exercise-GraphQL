const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLSkipDirective
} = require("graphql")

// Data
const customers = [
	{id: "1", name: "JohnDoe", email: "jd@gmail.com", age: 54},
	{id: "2", name: "Steve M", email: "steve@gmail.com", age: 14},
	{id: "3", name: "Sara W", email: "sara@gmail.com", age: 54},
]

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
const RootQuery= new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
				// Hradcoded find in the DB
				for (let i = 0; i < customers.length; i++) {
					if(customers[i].id == args.id) {
						return customers[i]
					}
				}
            }
        },
        
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
	db(how) {
		what
	}
}
}

*/