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
    console.log('here');
    var collections = await getGpu();
    var model = { gpus: collections };
    response.render('index', model);
});

application.get('/new-collection', (request, response) => {
    response.render('new-collection');
});

application.post('/new-collection', async (request, response) => {
    console.log('here post');
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

application.get('/edit/:_Id', async (request, response) => {
    
    console.log('id params: ', request.params._Id);
     var id = request.params._Id;
     var check = id.replace(/:/g, "");
     console.log('check: ', check);
     console.log('id before string: ', id);
    // var id = '595e4e4193103c066610789b';
     var gpu = await Gpu.find({_id: check});
     console.log('id:: ', id);
     console.log('gpu: ', gpu);
     var model = {gpu: gpu};
    response.render('edit', model);
});

application.post('/edit/:_id', async (request, response) => {
    
    var id = request.params._id
    console.log('id 2: ', id);
    var check = id.replace(/:/g, "");
    // var id = '595e4e4193103c066610789b';
    await Gpu.updateOne({_id: check},
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
    console.log('id: ', id);
    var result = await Gpu.deleteOne({ _id: id });
    response.redirect('/');
});

application.listen(3000);



