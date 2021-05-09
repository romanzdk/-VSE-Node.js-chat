const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const wsController = require('./controllers/ws-controller')

// set render engine
app.set('views', './views');
app.set('view engine', 'pug');

//public assets folder
app.use(express.static('public'));

// render index template
app.get('/', (req, res) => {
    res.render('index');
})

// use websocket controller
app.ws('/chat', wsController)

// start server
const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}`))