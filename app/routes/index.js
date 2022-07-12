var express = require('express');
var router = express.Router();
var formidable = require('formidable')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', (req, res) => {

  let form = new formidable.IncomingForm({
    uploadDir: 'C:/Users/bruno/Documents/GitHub/HCODE/5-JS-Projeto-Dogbox/app/upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {
    res.json({
      files
    })
  })

})

module.exports = router;
