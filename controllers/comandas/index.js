'use strict';

var {Client} = require('pg');
var config = require('../../config/dbconfig');

var client = new Client(config);

client.connect();

module.exports = function (router) {

    router.get('/', function (req, res) {
        
        client.query('SELECT comandas.comandas_id, comandas.mesa, usuarios.nombres, comandas.fecha, zonas.zonas_nombre, comandas.status FROM comandas INNER JOIN usuarios ON comandas.mesero = usuarios.usuarios_id INNER JOIN zonas ON comandas.zona = zonas.zonas_id',function (error, results) {
            if (error) throw error;
            res.send(results.rows);
        });
    });

    router.post('/', function (req, res) {
        var comanda = req.body;

        client.query('INSERT INTO comandas(mesa, mesero, status, zona) VALUES($1, $2, $3, $4)', [comanda.mesa, comanda.mesero, 1, comanda.zona], function(error, results) {
            if(error) throw error;
            res.send(results.rows);
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

    router.get('/active', function (req, res) {
        client.query('SELECT comandas.comandas_id, comandas.mesa, usuarios.nombres, comandas.fecha, zonas.zonas_nombre, comandas.status FROM comandas INNER JOIN usuarios ON comandas.mesero = usuarios.usuarios_id INNER JOIN zonas ON comandas.zona = zonas.zonas_id WHERE comandas.status=1 ORDER BY comandas.comandas_id DESC',function (error, results) {
            if (error) throw error;
            res.send(results.rows);
        });
    });

};

//SELECT comandas.comandas_id, comandas.mesa, usuarios.nombres, comandas.fecha, zonas.zonas_nombre, comandas.status,(select producto from pedidos where comanda=comandas.comandas_id AND estado=1) as pedidos FROM comandas INNER JOIN usuarios ON comandas.mesero = usuarios.usuarios_id INNER JOIN zonas ON comandas.zona = zonas.zonas_id WHERE comandas.status=1;