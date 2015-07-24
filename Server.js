// ****** Requerir Dependencias instaladas de node_modules
var mysql      = require("mysql") 
var bodyParser = require("body-parser")
var express    = require("express")
var http       = require("http")
var socket     = require("socket.io")

var app        = express()
var server     = http.createServer(app)
var io         = socket(server)

// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// ***** Importando Modulos Externos */
//var Query      = require("./SQL_Query")

// ****** Variables constantes  
var _tableName = "Contactos"

// ***** Midellwere 
app.use(bodyParser.json())

// ****** Configure MySQL parameters. 
var connection   = mysql.createConnection({ host:"localhost", user:"root", password:"Toor", database:"bd", port:3306 })

connection.connect(
    function(error){
       if(error){
          console.log("Problem with MySQL "+ error)
       }
       else{
          console.log("Connected with Database")
       }
    }
)

// ****** Configure Express Server. Static Files 
app.use(express.static(__dirname + '/Frontend/'))

// app.use('/', express.static('/Frontend_app/'));

app.get('/api', function (req, res) {
    console.log('Express: Conexión en "/api" sirviendo archivo estático...')
    res.sendfile(__dirname +'/Frontend/index_1.html')
})

//  ****** Sirviendo archivo Json API 
// app.get ('/load', Query.SQL_SELECT)
// app.get ('/load/:id', Query.SQL_SELECT_ID)
// app.post ('/load', Query.SQL_INSERT)
// app.put ('/load/:id', Query.SQL_UPDATE_ID)
// app.delete ('/load/:id', Query.SQL_DELETE_ID)

app.get    ('/api3000'    , SQL_SELECT    )
app.get    ('/api3000/:id', SQL_SELECT_ID )
app.post   ('/api3000'    , SQL_INSERT    )
app.put    ('/api3000/:id', SQL_UPDATE_ID )
app.delete ('/api3000/:id', SQL_DELETE_ID )


// /* Funciones para consulata a Base de datos MYSQL */ 
function SQL_SELECT(req, res){
    var query = connection.query("SELECT * FROM ?? LIMIT 0, 10000",[_tableName],
        function (err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query "+ err)
            } 
            else{
                console.log("GET request : /api3000 whit query " + "'" + query.sql + "'")
                res.end(JSON.stringify(rows))
            }
        }
    )
}
function SQL_SELECT_ID(req, res){
    var id = req.params.id
    var query = connection.query("SELECT * FROM ?? WHERE id=?",[_tableName, id],
        function (err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query " + err)
            }
            else{
                console.log("GET request by id: /api3000/id whit query " + "'" + query.sql + "'")
                console.log(JSON.stringify(rows))
                res.end(JSON.stringify(rows[0]))
            }
        }
    )
}
function SQL_INSERT(req, res){
    console.log(req.body)
    var input = JSON.parse(JSON.stringify(req.body)) 
    var data = {
        Nombre   : input.Nombre,
        Apellido : input.Apellido,
        Edad     : input.Edad      
    }
    var query = connection.query("INSERT INTO ?? SET ?",[_tableName, data],
        function(err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query "+ err)
            }
            else{
                console.log("POST request : /api3000 whit query " + "'" + query.sql + "'")
                res.end(JSON.stringify(rows))
            }
        }
    )
}
function SQL_UPDATE_ID(req, res){
    console.log(req.body)
    var input = JSON.parse(JSON.stringify(req.body))
    var id = req.params.id
    var data = {
        Nombre   : input.Nombre,
        Apellido : input.Apellido,
        Edad     : input.Edad      
    }
    var query = connection.query("UPDATE ?? SET ? WHERE id= ?",[_tableName,data,id],
        function(err,rows){
            if(err){
                console.log("Problem with MySQL Query "+ err)
            }
            else{
                console.log("PUT request : /api3000/id whit query " + "'" + query.sql + "'")
                res.end(JSON.stringify(rows))
            }
        }
    )
}
function SQL_DELETE_ID(req, res){
    var id = req.params.id
    console.log(id)
    var query = connection.query("Delete FROM ?? WHERE id=?",[_tableName,id],
        function (err,rows){
            if(err){
                console.log("ERR APP Problem with MySQL Query "+ err)
            }
            else{
                console.log("DELETE request by id: /api3000/id whit query " + "'" + query.sql + "'")
                res.end(JSON.stringify(rows))
            }
        }
    )
}
//  /* Mensaje de Arranque de Servidor */ 
function MsjServer(){
    console.log("It's Started on PORT 3000")
}


// /*  Sockets events con socket.io */ 
io.sockets.on('connection', function (socket){

    console.log('SocketIO: Usuario Conectado...')

    var sendNotification = function (){
        var time = new Date()
        socket.emit('notification', { mensaje: time + ': Nueva notificación enviada desde el servidor.'})  
    }
    var sendNotificationInterval = setInterval(sendNotification, 1000) 

    socket.on('stopNotifications', function () {
            console.log('SocketIO: Notificaciones detenidas por el usuario...')
            clearInterval(sendNotificationInterval)
    })

    socket.on('emit:add', function(data) {
        console.log(data)
        socket.broadcast.emit('emit:add', data);
    })

    socket.on('disconnect', function () {
            console.log('SocketIO: Usuario Desconetado...')
            clearInterval(sendNotificationInterval)
    })
})

server.listen(3000, MsjServer)



//  ********* Otra forma de pasar parametros a Query de SQL **************
/*
var query = connection.query("SELECT * FROM "+ _tableName + " WHERE id='"+id+"' LIMIT 0, 1",function(err,rows){

*/

// *******Busqueda por cualquier otro campo*************

// app.get('/api3000/:Nombre',function (req,res){
//     var id = req.params.Nombre
//     console.log(id)
//     //debugger
//     var query = connection.query("SELECT * FROM "+_tableName+" WHERE Nombre=? LIMIT 0, 1000",[id],function(err,rows){
//         if(err){
//             console.log("Problem with MySQL Query "+ err)
//         }
//         else{
//             console.log(i="I recived a Get request : /load/id ")
//             res.end(JSON.stringify(rows))
//         }
//     })
// })

