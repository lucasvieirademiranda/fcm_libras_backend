var express = require('express');
var router = express.Router();

router.use('/create', function(request, response, next) {

    request.checkBody('sign', 'Você deve informar o sinal!').notEmpty();
    request.checkBody('sign', 'O sinal deve possuir no máximo 250 caracteres!').isLength({ min: 0, max: 250 });

    request.checkBody('comments', 'Você deve informar uma observação sobre o sinal!').notEmpty();
    request.checkBody('comments', 'A observação deve possuir no máximo 4000 caracteres!').isLength({ min: 0, max: 4000 });

    request.checkBody('categories', 'Você deve informar uma ou mais categorias!').notEmpty();

    var errors = request.validationErrors();

    if (!request.files)
    {
        errors.push({
            location: 'body',
            msg: 'Você deve informar um arquivo!',
            param: 'file',
            value: '',
        });
    }

    if (errors)
    {
        response.status(400)
                .send(errors);

        return;
    }

    next();

});

router.use('/edit', function(request, response, next) {

    request.checkBody('sign', 'Você deve informar o sinal!').notEmpty();
    request.checkBody('sign', 'O sinal deve possuir no máximo 250 caracteres!').isLength({ min: 0, max: 250 });

    request.checkBody('comments', 'Você deve informar uma observação sobre o sinal!').notEmpty();
    request.checkBody('comments', 'A observação deve possuir no máximo 4000 caracteres!').isLength({ min: 0, max: 4000 });

    request.checkBody('categories', 'Você deve informar uma ou mais categorias!').notEmpty();

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