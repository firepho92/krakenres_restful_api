'use strict';

var {Client} = require('pg');
var config = require('../../config/dbconfig');

var client = new Client(config);

client.connect();

module.exports = function (router) {

    router.get('/', function (req, res) {
        client.query('SELECT zonas_id, zonas_nombre FROM zonas', function (error, results) {
            if (error) throw error;
            res.send(results.rows);
        });
    });

    router.post('/', function (req, res) {
        var zona = req.body;

        client.query('INSERT INTO zonas(zonas_nombre) VALUES ($1)', [zona.nombre], function(error, results) {
            if(error) throw error;
            res.send(results);
        });
    });

    router.put('/', function(req, res) {
        var horario = req.body;

        connection.query('UPDATE zonas SET ? WHERE Id = ?', [zona, zona.Id], function(error, results){
            if(error) throw error;
            res.send(results);
        });
    });

    router.delete('/', function(req, res) {
        var zona = req.body;

        connection.query('DELETE FROM zonas WHERE Id = ?', zona.Id, function (error, results, fields) {
          if(error) throw error;
          res.send(results);
        });
    });

};

