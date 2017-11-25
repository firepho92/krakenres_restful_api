'use strict';

var {Client} = require('pg');
var config = require('../../config/dbconfig');

var client = new Client(config);

client.connect();

module.exports = function (router) {

    router.get('/', function (req, res) {
        client.query('SELECT usuarios.usuarios_id, usuarios.nombres, puestos.puestos_nombre, dia FROM horarios INNER JOIN usuarios ON horarios.usuario = usuarios.usuarios_id INNER JOIN puestos ON horarios.puesto = puestos.puestos_id', function (error, results) {
            if (error) throw error;
            res.send(results);
        });
    });

    router.post('/', function (req, res) {
        var horario = req.body;

        connection.query('INSERT INTO horarios SET ?', horario, function(error, results, fields) {
            if(error) throw error;
            res.send(results);
        });
    });

    router.put('/', function(req, res) {
        var horario = req.body;

        connection.query('UPDATE horarios SET ? WHERE Id = ?', [horario, horario.Id], function(error, results, fields){
            if(error) throw error;
            res.send(results);
        });
    });

    router.delete('/', function(req, res) {
        var horario = req.body;

        connection.query('DELETE FROM horarios WHERE Id = ?', horario.Id, function (error, results, fields) {
          if(error) throw error;
          res.send(results);
        });
    });

    router.post('/by_day', function (req, res) {
        var horario = req.body;
        client.query('SELECT usuarios.usuarios_id, usuarios.nombres, puestos.puestos_nombre, dia FROM horarios INNER JOIN usuarios ON horarios.usuario = usuarios.usuarios_id INNER JOIN puestos ON horarios.puesto = puestos.puestos_id WHERE horarios.dia=$1', [horario.dia], function (error, results) {
            if (error) throw error;
            res.send(results.rows);
        });
    });

};

