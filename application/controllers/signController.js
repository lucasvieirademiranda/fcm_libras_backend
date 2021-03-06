var express = require('express');

var signService = require('../services/signService');
var videoService = require('../services/videoService');

var router = express.Router();

router.get('/find/:id', function(request, response) {

    var id = parseInt(request.params.id, 10);

    signService.find(id, function(error, data) {

        if (error)
        {
            response.status(error.code)
                    .send(error);

            return;
        }

        response.status(200)
                .send(data);

    });

});

router.get('/list', function(request, response) {

    signService.list(function(error, data) {

        if(error)
        {
            response.status(error.code)
                    .send(error);

            return;
        }
        
        response.status(200)
                .send(data);

    });

});

router.post('/create', function(request, response) {

    var file = request.files.file;

    var categories = JSON.parse(request.body.categories)
                         .map((category) => { return category.value; });

    var sign = {
        sign: request.body.sign,
        comments: request.body.comments,
        file_name: '',
        video_path: '',
        categories: categories
    };

    videoService.upload(file, function(error, data) {

        if (error)
        {
            response.status(error.code)
                    .send(error);

            return;
        }

        sign.file_name = file.name;
        sign.video_path = data.path;

        signService.create(sign, function(error, data) {

            if (error)
            {
                response.status(error.code)
                        .send(error);
    
                return;
            }
    
            response.status(200)
                    .send(data);
    
        });

    });

});

router.patch('/edit', function(request, response) {

    var file = request.files ? request.files.file : null;

    var categories = JSON.parse(request.body.categories)
                         .map((category) => { return category.value; });

    var sign = {
        id: parseInt(request.body.id, 10),
        sign: request.body.sign,
        comments: request.body.comments,
        file_name: request.body.file_name,
        video_path: request.body.video_path,
        categories: categories
    };

    if (file)
    {
        videoService.delete(sign.video_path, function(error, data) {

            if (error)
            {
                response.status(error.code)
                        .send(error);
    
                return;
            }

            videoService.upload(file, function(error, data) {

                if (error)
                {
                    response.status(error.code)
                            .send(error);
        
                    return;
                }
        
                sign.file_name = file.name;
                sign.video_path = data.path;
        
                signService.edit(sign, function(error, data) {
        
                    if (error)
                    {
                        response.status(error.code)
                                .send(error);
            
                        return;
                    }
            
                    response.status(200)
                            .send(data);
            
                });
        
            });

        });

    }
    else
    {
        signService.edit(sign, function(error, data) {
    
            if (error)
            {
                response.status(error.code)
                        .send(error);
    
                return;
            }
    
            response.status(200)
                    .send(data);
    
        });
    }

});

router.delete('/remove/:id', function(request, response) {

    var id = parseInt(request.params.id, 10);

    signService.find(id, function(error, data) {
        
        if (error)
        {
            response.status(error.code)
                    .send(error);

            return;
        }

        videoService.delete(data.video_path, function(error, data) {

            if (error)
            {
                response.status(error.code)
                        .send(error);
    
                return;
            }

            signService.remove(id, function(error, data) {

                if (error)
                {
                    response.status(error.code)
                            .send(error);
        
                    return;
                }
        
                response.status(200)
                        .send(data);
        
            });

        });

    })

});

router.get('/searchBySign/:sign', function(request, response) {

    var sign = request.params.sign;

    signService.searchBySign(sign, function(error, data) {

        if (error)
        {
            response.status(error.code)
                    .send(error);

            return;
        }

        response.status(200)
                .send(data);

    });

});

router.get('/searchByCategory/:category', function(request, response) {

    var category = request.params.category;

    signService.searchByCategory(category, function(error, data) {

        if (error)
        {
            response.status(error.code)
                    .send(error);

            return;
        }

        response.status(200)
                .send(data);

    });

});

router.get('/download/:id', function(request, response) {

    var id = parseInt(request.params.id, 10);

    signService.find(id, function(error, data) {

        if (error)
        {
            response.status(error.code)
                    .send(error);

            return;
        }

        response.status(200)
                .download(data.video_path, data.file_name);

    });

});

module.exports = router;