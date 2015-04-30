/* Funciones para consulata a Base de datos MYSQL  */

exports.SQL_SELECT = function(req, res){
    var query = connection.query("SELECT * FROM "+ _tableName + " LIMIT 0, 10000",
        function (err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query "+ err);
            } 
            else{
                console.log("GET request : /load whit query " + "'" + query.sql + "'");
                res.end(JSON.stringify(rows));
            }
        }
    );
}
exports.SQL_SELECT_ID = function(req, res){
    var id = req.params.id;
    var query = connection.query("SELECT * FROM "+ _tableName + " WHERE id=?",id ,
        function (err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query " + err);
            }
            else{
                console.log("GET request by id: /load/id whit query " + "'" + query.sql + "'");
                console.log(JSON.stringify(rows));
                res.end(JSON.stringify(rows[0]));
            }
        }
    );
}
exports.SQL_INSERT = function(req, res){
    console.log(req.body);
    var input = JSON.parse(JSON.stringify(req.body)); 
    var data = {
        Nombre   : input.Nombre,
        Apellido : input.Apellido,
        Edad     : input.Edad      
    };
    var query = connection.query("INSERT INTO "+ _tableName +" SET ?",data ,
        function(err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query "+ err);
            }
            else{
                console.log("POST request : /load whit query " + "'" + query.sql + "'");
                res.end(JSON.stringify(rows));
            }
        }
    );
}
exports.SQL_UPDATE_ID = function(req, res){
    console.log(req.body);
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var data = {
        Nombre   : input.Nombre,
        Apellido : input.Apellido,
        Edad     : input.Edad      
    };

    var query = connection.query("UPDATE "+_tableName+" SET ? WHERE id= ?",[data,id],
        function(err,rows){
            if(err){
                console.log("Problem with MySQL Query "+ err);
            }
            else{
                console.log("PUT request : /load/id whit query " + "'" + query.sql + "'");
                res.end(JSON.stringify(rows));
            }
        }
    );
}
exports.SQL_DELETE_ID = function(req, res){
    var id = req.params.id;
    console.log(id);
    var query = connection.query("Delete FROM "+_tableName+" WHERE id=?",id,
        function (err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query "+ err);
            }
            else{
                console.log("DELETE request by id: /load/id whit query " + "'" + query.sql + "'");
                res.end(JSON.stringify(rows));
            }
        }
    );
}

/* Mensaje de Arranque de Servidor */
exports.MsjServer = function(){
    console.log("It's Started on PORT 3000");
}