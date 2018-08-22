var express = require('express');
var router = express.Router();
var request = require('request');
const getWordById = 'http://www.acessibilidadebrasil.org.br/libras_3/ajax/getWordById/';

/* GET home page. */
router.get('/', function(req, res, next) {
  signalId = Math.floor(Math.random() * (5823 - 1) + 1);
  request(getWordById + signalId, function (error, response, body) {
    var content = JSON.parse(body);
    console.log(content.data);
    res.render(
      'index',
      {
        title: '1 sinal por dia!',
        word: content.data.palavra,
        description: content.data.acepcao,
        videoUrl: 'http://www.acessibilidadebrasil.org.br/libras_3/public/media/palavras/videos/' + content.data.video
      }
    );
  });
});

router.post('/search', function(req, res, next) {
  console.log("req.body", req.body.word);
  request('http://www.acessibilidadebrasil.org.br/libras_3/ajax/search/palavra/' + req.body.word + '/', function (error, response, body) {
    var content = JSON.parse(body);
    console.log(content.data);
    console.log(content.data[0]);
    if(content.data.length == 0){
      res.render(
        'index',
        {
          title: '1 sinal por dia!',
          word: req.body.word,
          description: 'Não foi encontrada!'
        }
      );
    }

    if(content.data.length == 1){
      res.render(
        'index',
        {
          title: '1 sinal por dia!',
          word: content.data[0].palavra,
          description: content.data[0].acepcao,
          videoUrl: 'http://www.acessibilidadebrasil.org.br/libras_3/public/media/palavras/videos/' + content.data[0].video
        }
      );
    }

    if(content.data.length > 1){
      res.render(
        'index',
        {
          list_words: content.data,
          title: '1 sinal por dia!',
          word: 'Palavras encontradas',
          description: '',
          // videoUrl: 'http://www.acessibilidadebrasil.org.br/libras_3/public/media/palavras/videos/' + content.data[0].video
        }
      );
    }

  });
});

module.exports = router;
