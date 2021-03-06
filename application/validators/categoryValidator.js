var express = require('express');
var router = express.Router();

router.use('/create', function(request, response, next) {

    request.checkBody('name', 'Você deve informar um nome!').notEmpty();
    request.checkBody('name', 'O nome deve possuir no máximo 250 caracteres!').isLength({ min: 0, max: 250 });

    request.checkBody('comments', 'Você deve informar um comentário!').notEmpty();
    request.checkBody('comments', 'O comentário deve possuir no máximo 4000 caracteres!').isLength({ min: 0, max: 4000 });

    var errors = request.validationErrors();

    if (errors)
    {
        response.status(400)
                .send(errors);

        return;
    }

    next();

});

router.use('/edit', function(request, response, next) {

    request.checkBody('name', 'Você deve informar um nome!').notEmpty();
    request.checkBody('name', 'O nome deve possuir no máximo 250 caracteres!').isLength({ min: 0, max: 250 });

    request.checkBody('comments', 'Você deve informar um comentário!').notEmpty();
    request.checkBody('comments', 'O comentário deve possuir no máximo 4000 caracteres!').isLength({ min: 0, max: 4000 });

    var errors = request.validationErrors();

    if (errors)
    {
        response.status(400)
                .send(errors);

        return;
    }

    next();

});

module.exports = router;