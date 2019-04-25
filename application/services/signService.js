var signRepository = require('../repositories/signRepository');
var signCategoryRepository = require('../repositories/signCategoryRepository');

var async = require('async');

exports.search = (sign, done) => {

    signRepository.search(sign, done);

};

exports.find = (id, done) => {

    signRepository.find(id, done);

};

exports.list = (done) => {

    signRepository.list(done);

};

exports.create = (data, done) => {

    async.waterfall([

        function(done) {

            signRepository.findByName(data.sign, done);

        },
        function(sign, done)
        {
            if (sign)
            {
                done({
                    code: 422,
                    message: "O sinal informado já existe na base de dados!!"
                }, null);

                return;
            }

            signRepository.insert(data, done);
        },
        function (sign, done)
        {
            
            signCategoryRepository.insertAll({ 
                idSign: sign.id,
                categories: data.categories
            }, () => { done(null, sign); });

        }
    ], function(error, result) {

        if (error)
        {
            done(error, null);
            return;
        }

        console.log(result);

        done(null, result);

    });

};

exports.edit = (data, done) => {

    async.waterfall([

        function(done) {

            signRepository.find(data.id, done);

        },
        function(sign, done)
        {
            if (sign && sign.id != data.id)
            {
                done({
                    code: 422,
                    message: "O sinal informado já existe na base de dados!!"
                }, null);

                return;
            }

            signRepository.update(data, done);
        },
        function(sign, done)
        {
            signCategoryRepository.deleteAll(sign.id, () => { done(null, sign); });
        },
        function(sign, done)
        {
            signCategoryRepository.insertAll({
                idSign: sign.id,
                categories: data.categories
            }, () => { done(null, sign); });
        }

    ], function(error, result) {

        if (error)
        {
            done(error, null);
            return;
        }

        done(null, result);

    });

};

exports.remove = (id, done) => {

    signCategoryRepository.deleteAll(id, function(error, data) {

        if (error)
        {
            done(error, null);
            return;
        }

        signRepository.delete(id, done);

    });
};