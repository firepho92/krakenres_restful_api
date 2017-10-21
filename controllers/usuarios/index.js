'use strict';

var mysql = require('mysql');
var config = require('../../config/dbconfig');
var crypto = require('crypto');

var connection = mysql.createConnection(config);

connection.connect();

module.exports = function (router) {

    router.get('/', function (req, res) {
	var usuario = req.body;
        connection.query('SELECT usuarios.nombre, puestos.puesto, status.status_name, usuarios.dias FROM usuarios INNER JOIN puestos ON usuarios.puesto = puestos.Id INNER JOIN status ON usuarios.status = status.Id', usuario.Id, function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    });

    router.post('/', function (req, res) {
        var usuario = req.body;
        var salt = crypto.randomBytes(128).toString('base64');
        var hash = hashPassword(salt, usuario.password);

        usuario.password = hash.toString('hex');
        usuario.salt = salt;

        console.log('password : ' + usuario.password + " password length: " + usuario.password.length + ', salt: ' + usuario.salt + " salt length: " + usuario.salt.length);

        connection.query('INSERT INTO usuarios SET ?', usuario, function(error, results, fields) {
            if(error) throw error;
            res.send(results);
        });
    });

    router.put('/', function(req, res) {
        var usuario = req.body;

        connection.query('UPDATE usuarios SET ? WHERE Id = ?', [usuario, usuario.Id], function(error, results, fields){
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

      connection.query('SELECT * FROM usuarios WHERE usuario = ?', usuario.usuario, function(error, results, fields) {
        if(error) throw error;
        if(results.length === 0){
          res.send("Error, intente de nuevo");
        }else{
            var salted_password = hashPassword(results[0].salt, usuario.password);
            var user = results[0];
            if(salted_password === user.password){   
                connection.query('UPDATE usuarios SET logged=? WHERE Id = ?', [1, user.Id], function(error, results, fields){
                    if(error) throw error;
                    delete user.password;
                    delete user.salt;
                    delete user.logged;
                    res.send(user);
                });   
            }else{
            res.send("Error intente de nuevo.");
            }
        }
      })
    });

    router.post('/logout', function(req, res) {
        var usuario = req.body;

        connection.query('UPDATE usuarios SET logged=? WHERE Id = ?', [0, usuario.Id], function(error, results, fields){
            if(error) throw error;
            res.send(results);
        });  
    });

    router.get('/isLogged', function(req, res) {

        connection.query('SELECT Id, nombre, usuario, inicio, puesto, status, dias FROM usuarios WHERE logged=?', 1, function(error, results, fields){
            if(error) throw error;
            res.send(results[0]);
        });  
    });

    router.get('/cajeros', function(req, res) {
        
        connection.query('SELECT Id, nombre, usuario, inicio, status, dias FROM usuarios WHERE puesto=3', function(error, results, fields){
            if(error) throw error;
            res.send(results);
        });  
    });

    router.get('/:Id', function (req, res) {
        var usuario = req.params;
        console.log(usuario.Id);
        connection.query('SELECT usuarios.nombre, puestos.puesto, status.status_name, usuarios.dias FROM usuarios INNER JOIN puestos ON usuarios.puesto = puestos.Id INNER JOIN status ON usuarios.status = status.Id WHERE usuarios.Id=?', usuario.Id, function (error, results, fields) {
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
