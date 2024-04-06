require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')
const url_list = {}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.use(bodyParser.urlencoded({extended : false}))

app.post('/api/shorturl', function(req,res){
  let original_URL = null

  if (URL.canParse(req.body.url)) {
    original_URL = new URL(req.body.url) 
  } else {
    console.log('Not valid URL')
    res.json({ error: 'invalid url' })
    return -1
  }
  
  dns.lookup(original_URL.hostname, (err, address, family)=>{
    if (err) {
      //console.log(err)
      res.json({ error: 'invalid url' })
      return -1
    } else {
      short_url = Object.keys(url_list).length + 1 
      url_list[short_url] = original_URL.toString()
      console.log(url_list)
  
      res.json({ 
        original_url : original_URL.toString(), 
        short_url : short_url
      })  
    } 
  })  
})

app.get('/api/shorturl/:url_number', function(req,res){
  original_url = url_list[req.params.url_number]

  if (original_url) {
    console.log(original_url)
    res.redirect(original_url)
  } else {
    console.log('Shortcut not available')
    res.redirect('/')
  }
})