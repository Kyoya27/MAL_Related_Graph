var express = require('express')
var cors = require('cors')
const fs = require('fs')
const request = require('request');
const AnimeRelated = require('./AnimeRelated');
var app = express()

const issue2options = {
  origin: true,
  methods: ["POST"],
  credentials: true,
  maxAge: 3600
};

let rawTokens = fs.readFileSync('token.json');
let tokens = JSON.parse(rawTokens);

/*app.use(cors())
app.get('https://api.myanimelist.net/v2/anime/30230?fields=id,title,start_date,related_anime,related_manga', function (req, res, next) {
  console.log('Server running at http://127.0.0.1:1337/');
  res.json({msg: 'This is CORS-enabled for all origins!'})
})*/

const adjacencyRelatedList = new Map();
url_before_id = "https://api.myanimelist.net/v2/anime/"
url_after_id = "?fields=id,title,start_date,related_anime,related_manga"


function extract_related_set(animeNow){
    let related_length = animeNow['related_anime'].length;
	let related_set = new Set();
    for (var i = 0; i < related_length; i++) {
    	related_set.add(animeNow['related_anime'][i]['node']['id'])
    }
    return related_set;
}

function api_get_related(id) {
    return new Promise((resolve, reject) => {
        request({
		  url: url_before_id+id+url_after_id,
		  headers: {
		     'Authorization': 'Bearer '+tokens['mal_bearer_token']
		  },
		  rejectUnauthorized: false
		}, function(err, res) {
		      if (err) reject(err);
		      if (res.statusCode != 200) {
                  reject('Invalid status code <' + response.statusCode + '>');
              }
              let animeNow = JSON.parse(res.body);
        	  let related_set = extract_related_set(animeNow);
              resolve(related_set);
		});
    });
}

async function get_related(anime_id) {
	console.log('node:', anime_id);
	const related_set = await api_get_related(anime_id);
	adjacencyRelatedList.set(anime_id, related_set);
  
	for (let related_id of adjacencyRelatedList.get(anime_id)) {
  		if(!adjacencyRelatedList.has(related_id))await get_related(related_id);
  	}
	console.log(adjacencyRelatedList)
  
}

get_related(24405);