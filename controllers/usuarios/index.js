'use strict';

var {Client} = require('pg');
var config = require('../../config/dbconfig');
var crypto = require('crypto');

var client = new Client(config);

client.connect();

module.exports = function (router) {

    router.get('/', function (req, res) {
    var usuario = req.body;
    
        client.query('SELECT usuarios.nombres, usuarios.apellidos FROM usuarios', (err, results) => {
            if(err){
                console.log(err.stack);
            }else{
                res.send(results.rows);
            }
        });
    });

    router.post('/', function (req, res) {
        var usuario = req.body;
        var salt = crypto.randomBytes(128).toString('base64');
        var hash = hashPassword(salt, usuario.password);

        usuario.password = hash.toString('hex');
        usuario.salt = salt;

        client.query('INSERT INTO usuarios(nombres, apellidos, usuario, password, salt, status, logged) VALUES($1, $2, $3, $4, $5, $6, $7)', [usuario.nombres, usuario.apellidos, usuario.usuario, usuario.password, usuario.salt, usuario.status, usuario.logged], (err, results) => {
            if(err){
                console.log(err.stack);
            }else{
                res.send(results);
            }
        });

    });

    router.put('/', function(req, res) {
        var usuario = req.body;

        client.query('UPDATE usuarios SET $1 WHERE Id = $2', [usuario, usuario.Id], function(error, results, fields){
            if(error) throw error;
            res.send(results);
        });
    });

    router.delete('/', function(req, res) {
        var usuario = req.body;

        connection.query('DELETE FROM usuarios WHERE Id = ?', usuario.Id, function (error, results, fields) {
          if(error) throw error;
          res.send(results);
        });
    });

    router.post('/login', function(req, res) {
        var usuario = req.body;
        client.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario.usuario], function(error, results) {
            if(error) throw error;
            if(results.rows.length === 0){
            res.send("Error, intente de nuevo");
            }else{
                var salted_password = hashPassword(results.rows[0].salt, usuario.password);
                var user = results.rows[0];
                if(salted_password === user.password){
                    client.query('UPDATE usuarios SET logged=$1 WHERE usuarios_id = $2', [1, user.usuarios_id], function(error, results){
                        if(error) throw error;
                        delete user.password;
                        delete user.salt;
                        delete user.logged;
                        res.send(user);
                    });   
                }else{
                res.send(false);
                }
            }
        })
        });

    router.post('/logout', function(req, res) {
        var usuario = req.body;

        client.query('UPDATE usuarios SET logged = 0 WHERE usuarios_id = $1', [usuario.id], function(error, results){
            if(error) throw error;
            res.send(results);
        });  
    });

    router.get('/isLogged', function(req, res) {

        client.query('SELECT usuarios_id, nombres, apellidos, usuario, status FROM usuarios WHERE logged=1', function(error, results){
            if(error) throw error;
            if(results.rows.length == 0){
                res.send(false);
            }else{
                res.send(results.rows[0]);
            }
        });  
    });

    router.get('/cajeros', function(req, res) {
        
        client.query('SELECT Id, nombre, usuario, inicio, status, dias FROM usuarios WHERE puesto=1', function(error, results){
            if(error) throw error;
            res.send(results.rows);
        });  
    });

    router.get('/:Id', function (req, res) {
        var usuario = req.params;
        connection.query('SELECT usuarios.nombre, puestos.puesto, status.status_name, usuarios.dias FROM usuarios INNER JOIN puestos ON usuarios.puesto = puestos.Id INNER JOIN status ON usuarios.status = status.Id WHERE usuarios.Id=?', usuario.Id, function (error, results) {
            if (error) throw error;
            if(results.length != 0){
                res.send(results[0]);
            }else{
                res.send(false);
            }
        });
    });

};

function hashPassword(salt, password) {
  var hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

  return hash.toString('hex');
}
