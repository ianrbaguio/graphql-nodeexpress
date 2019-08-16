var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express().use(cors());
const fs = require('fs-extra');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/players", (req, res, next) => {
    let players = JSON.parse(fs.readFileSync('Player.json', 'utf-8'));

    res.send(players);
})

app.get("/player", (req,res,next) => {
    let id = req.query.id;
    let players = JSON.parse(fs.readFileSync('Player.json', 'utf-8'));
    let player = players.filter(x => x.player_id == id);

    res.send(player);
})

app.get("/rankings", (req,res,next) => {
    let rankings = JSON.parse(fs.readFileSync('Ranking.json', 'utf-8'));

    res.send(rankings)
})

app.get("/ranking", (req,res,next) => {
    let rank = req.query.rank;
    let rankings = JSON.parse(fs.readFileSync('Ranking.json', 'utf-8'));
    let ranking = rankings.filter(x => x.rank == rank);

    res.send(ranking);
})

app.listen(3000, () => {
    console.log("REST Server is running on port 3000");
});