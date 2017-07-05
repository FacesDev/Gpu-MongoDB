const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const application = express();
application.engine('mustache', mustacheExpress());
mongoose.connect('mongodb://localhost:27017/GpuApplication');
const Gpu = require('./models/gpu.js');
application.set('views', './views');
application.set('view engine', 'mustache');
application.use(bodyParser.urlencoded());
application.use(express.static(__dirname + '/public'));

async function getGpu() {
    var gpus = await Gpu.find();
    return gpus;
}

application.get('/', async (request, response) => {
    var collections = await getGpu();
    var model = { gpus: collections };
    response.render('index', model);
});

application.get('/new-collection', (request, response) => {
    response.render('new-collection');
});

application.post('/new-collection', async (request, response) => {
    var newGpu = await new Gpu({
        name: request.body.name,
        manufacturer: request.body.manufacturer,
        averageHashRateMhz: request.body.avg,
        peakHashRateMhz: request.body.peak,
        cost: request.body.cost
    });
    var alternates = { nvidia: request.body.nvidia, amd: request.body.amd, other: request.body.other }
    newGpu.alternates.push(alternates);
    newGpu.save();
    response.redirect('/');
});

application.get('/edit/:_id', (request, response) => {
    response.render('edit');
});

application.post('/edit/:_Id', async (request, response) => {
    var id = request.params._Id
   await Gpu.updateOne({ _id: id },
        {
            name: request.body.name,
            manufacturer: request.body.manufacturer,
            averageHashRateMhz: request.body.avg,
            peakHashRateMhz: request.body.peak,
            cost: request.body.cost
        }
    )
    response.redirect('/');
});


application.post('/delete/:_Id', async (request, response) => {
    var id = request.params._Id;
    var result = await Gpu.deleteOne({ _id: id });
    response.redirect('/');
});

application.listen(3000);



