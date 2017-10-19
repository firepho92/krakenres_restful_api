'use strict';

var mysql = require('mysql');
var config = require('../../config/dbconfig');
var crypto = require('crypto');

var connection = mysql.createConnection(config);

connection.connect();

module.exports = function (router) {

    router.get('/', function (req, res) {
        connection.query('SELECT usuarios.nombre, puestos.puesto, status.status_name, usuarios.dias FROM usuarios INNER JOIN puestos ON usuarios.puesto = puestos.Id INNER JOIN status ON usuarios.status = status.Id', function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    });

    router.post('/', function (req, res) {
        var usuario = req.body;

        function hashPassword(password) {
            var salt = crypto.randomBytes(128).toString('base64');
            var hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
            return hash.toString('hex');
        }
        usuario.password = hashPassword(usuario.password);

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

};
