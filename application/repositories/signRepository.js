var connection = global.connection;

exports.find = (id, done) => {

    var sql = 'SELECT * FROM SIGNS WHERE ID = ? LIMIT 1';

    connection.query(sql, [id], function(error, signs, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            }, null);

            return;
        }

        sql = 'SELECT C.ID, C.NAME FROM CATEGORIES C INNER JOIN SIGNS_CATEGORIES SC ON C.ID = SC.ID_CATEGORY WHERE SC.ID_SIGN = ?';

        connection.query(sql, [id], function(error, categories, fields) {

            if (error)
            {
                done({
                    code: 500,
                    message: "Não foi possível acessar a base de dados!!"
                }, null);
    
                return;
            }

            if  (signs.length > 0)
            {
                var data = {
                    id: signs[0].ID,
                    sign: signs[0].SIGN,
                    comments: signs[0].COMMENTS,
                    file_name: signs[0].FILE_NAME,
                    video_path: signs[0].VIDEO_PATH,
                    categories: []
                };

                if (categories.length > 0)
                {
                    var data2 = categories.map((category) => {
                        return {
                            value: category.ID,
                            label: category.NAME
                        };
                    });
    
                    data.categories = data2;
                }

                done(null, data);
            }
            else
            {
                done(null, null);
            }

        });

    });

};

exports.list = (done) => {

    var sql = 'SELECT * FROM SIGNS';

    connection.query(sql, function(error, results, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            }, null);

            return;
        }

        if (results.length > 0)
        {
            var data = results.map((result) => {

                return {
                    id: result.ID,
                    sign: result.SIGN,
                    comments: result.COMMENTS,
                    file_name: result.FILE_NAME,
                    video_path: result.VIDEO_PATH
                };

            });
    
            done(null, data);
        }
        else
            done(null, []);

    });

};

exports.insert = (sign, done) => {

    var sql = 'INSERT INTO SIGNS (SIGN, COMMENTS, FILE_NAME, VIDEO_PATH) VALUES (?, ?, ?, ?)';

    var data = [
        sign.sign,
        sign.comments,
        sign.file_name,
        sign.video_path
    ];

    connection.query(sql, data, function(error, results, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            });

            return;
        }

        var data = {
            id: results.insertId,
            sign: sign.sign,
            comments: sign.comments,
            file_name: sign.file_name,
            video_path: sign.video_path
        };

        done(null, data);

    });

};

exports.update = (sign, done) => {

    var sql = 'UPDATE SIGNS SET SIGN = ?, COMMENTS = ?, FILE_NAME = ?, VIDEO_PATH = ? WHERE ID = ?';

    var data = [
        sign.sign,
        sign.comments,
        sign.file_name,
        sign.video_path,
        sign.id
    ];

    connection.query(sql, data, function(error, results, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            }, null);

            return;
        }

        var data = {
            id: sign.id,
            sign: sign.sign,
            comments: sign.comments,
            file_name: sign.file_name,
            video_path: sign.video_path
        };

        done(null, data);

    });

};

exports.delete = (id, done) => {

    var sql = 'SELECT * FROM SIGNS WHERE ID = ? LIMIT 1';

    connection.query(sql, [id], function(error, results, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            }, null);

            return;
        }

        var results1 = results;

        var sql = 'DELETE FROM SIGNS WHERE ID = ?';

        connection.query(sql, [id], function(error, results, fields) {

            if (error)
            {
                done({
                    code: 500,
                    message: "Não foi possível acessar a base de dados!!"
                }, null);
    
                return;
            }
    
            var data = {
                id: results1[0].ID,
                sign: results1[0].SIGN,
                comments: results1[0].COMMENTS,
                file_name: results1[0].FILE_NAME,
                video_path: results1[0].VIDEO_PATH
            }
    
            done(null, data);
    
        });

    });

};

exports.searchBySign = (sign, done) => {

    var sql = 'SELECT * FROM SIGNS WHERE UPPER(SIGN) LIKE UPPER(?)'

    connection.query(sql, [sign + "%"], function(error, results, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            }, null);

            return;
        }

        if (results.length > 0)
        {
            var data = results.map((result) => {

                return {
                    id: result.ID,
                    sign: result.SIGN,
                    comments: result.COMMENTS
                };

            });
    
            done(null, data);
        }
        else
            done(null, []);

    });

};

exports.searchByCategory = (category, done) => {

    var sql = `
        SELECT S.ID, S.SIGN, S.COMMENTS FROM SIGNS S 
        INNER JOIN SIGNS_CATEGORIES SC ON S.ID = SC.ID_SIGN
        INNER JOIN CATEGORIES C ON SC.ID_CATEGORY = C.ID
        WHERE UPPER(C.NAME) LIKE UPPER(?) 
        GROUP BY S.ID
    `;

    connection.query(sql, [category + "%"], function(error, results, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            }, null);

            return;
        }

        if (results.length > 0)
        {
            var data = results.map((result) => {

                return {
                    id: result.ID,
                    sign: result.SIGN,
                    comments: result.COMMENTS
                };

            });
    
            done(null, data);
        }
        else
            done(null, []);

    });

};

exports.findByName = (name, done) => {

    var sql = 'SELECT * FROM SIGNS WHERE UPPER(SIGN) = UPPER(?)';

    connection.query(sql, [name], function(error, results, fields) {

        if (error)
        {
            done({
                code: 500,
                message: "Não foi possível acessar a base de dados!!"
            }, null);

            return;
        }

        if (results.length > 0)
        {
            var data = {
                id: results[0].ID,
                sign: results[0].SIGN,
                comments: results[0].COMMENTS,
                file_name: results[0].FILE_NAME,
                video_path: results[0].VIDEO_PATH
            };
    
            done(null, data);
        }
        else
            done(null, null);

    });

};