const express = require("express");
const http = require("http");
const request = require("request");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const sql = require("mssql");
const fs = require("fs-extra");

const app = express().use(cors());
const dbConfig = {
  user: "GOA\\ian.baguio",
  server: ".",
  database: "GraphQLTutorial"
};

const schema = buildSchema(`
    type Query {
        players(offset: Int = 0, limit:Int = 10): [Player]
        player(id:ID!): Player
        ranking(rank:String!): [Ranking]
        rankings: [Ranking]
    }

    type Player {
        player_id: ID
        name_first: String
        name_list: String
        hand: String
        birthdate: String
        country: String
    }

    type Ranking {
        ranking_date: String
        rank: String
        player: String
        playerinfo: Player
        points: String
    }
`);

// const schema = buildSchema(`
//     type Query {
//         users: [User]
//         user(id:Int!): User
//         companies: [Company]
//         company(id:ID!): Company
//     }

//     type User {
//         id: Int
//         firstName: String
//         age: Int
//         companyId: Int
//         company: [Company]
//     }

//     type Company {
//         companyId: Int
//         name: String
//         description: String
//     }
// `);

// const root = {
//   players: args => {
//     return query(`SELECT * FROM players LIMIT ${args.offset}, ${args.limit}`);
//   },
//   player: args => {
//     return query(`SELECT * FROM players WHERE id='${args.id}'`);
//   },
//   rankings: args => {
//     return query(
//       `SELECT r.date, r.rank, r.points,
//                 p.id, p.first_name, p.last_name, p.hand, p.birthday, p.country
//         FROM players AS p
//         LEFT JOIN rankings AS r
//         ON p.id=r.player
//         WHERE r.rank=${args.rank}`
//     ).then(rows =>
//       rows.map(result => {
//         return {
//           date: result.date,
//           points: result.points,
//           rank: result.rank,
//           player: {
//             id: result.id,
//             first_name: result.first_name,
//             last_name: result.last_name,
//             hand: result.hand,
//             birthday: result.birthday,
//             country: result.country
//           }
//         };
//       })
//     );
//   }
// };


const root = {
    players: args => {
        let players = JSON.parse(fs.readFileSync('Player.json', 'utf-8'));
        
        players = players.slice(args.offset, args.offset + args.limit);

        return players
    },
    player: args => {
        let players = JSON.parse(fs.readFileSync('Player.json', 'utf-8'));
        let player = players.filter(x => x.player_id == args.id)[0];

        return player
    },
    ranking: args => {
        let rankings = JSON.parse(fs.readFileSync('Ranking.json', 'utf-8'));
        let players = JSON.parse(fs.readFileSync('Player.json', 'utf-8'));

        rankings = rankings.filter(x => x.rank == args.rank);

        rankings.map(x => {x.playerinfo = players.filter(y => y.player_id == x.player)[0]})

        return rankings
    },
    rankings: args => {
      let rankings = JSON.parse(fs.readFileSync('Ranking.json', 'utf-8'));
      let players = JSON.parse(fs.readFileSync('Player.json', 'utf-8'));
      rankings.map(x => {x.playerinfo = players.filter(y => y.player_id == x.player)[0]});

      return rankings;
    }
}

// const root = {
//   users: args => {
//     let users = JSON.parse(fs.readFileSync('db.json', 'utf-8')).users;
//     let companies = JSON.parse(fs.readFileSync('db.json', 'utf-8')).companies;
//     users.map(x => {x.company = companies.filter(y => y.companyId == x.companyId)})
//     console.log(users);
//     return users;
//   },

//   user: args => {
//     let users = JSON.parse(fs.readFileSync('db.json', 'utf-8')).users;
//     let companies = JSON.parse(fs.readFileSync('db.json', 'utf-8')).companies;
//     users.map(x => {x.company = companies.filter(y => y.companyId == x.companyId)});
//     let user = users.filter(x => x.id == args.id);
//     return user[0];
//   },
//   companies: args => {
//       let companies = JSON.parse(fs.readFileSync('db.json', 'utf-8')).companies;
//       return companies;
//   },
//   company: args => {
//       let companies = JSON.parse(fs.readFileSync('db.json', 'utf-8')).companies;
//       let company = companies.filter(x => x.companyId == args.id)
//       return company[0]
//   }
// };

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4201, err => {
  if (err) {
    return console.log(err);
  }

  return console.log("GraphQL Express API listening on port 4201");
});


function query(sqlQuery) {
  sql
    .connect(dbConfig)
    .then(pool => {
      return pool.request().query(sqlQuery);
    })
    .catch(err => {
      console.log("ERROR:  " + err);
    });

  sql.close();
}

async function requestJson(link){
    return new Promise((resolve, reject) => {
        request(link, (error, response, body) => {
            resolve(body);
        });
    });
}
