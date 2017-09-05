
const express    = require('express');
const app        = express();                
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();
const port 	   = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(logger('dev'));


require('./router')(router);
app.use('/api/suri', router);


app.listen(port, function () {
    console.log('Server listening at port %d', `port`);
});