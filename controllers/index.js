'use strict';

module.exports = function (router) {


    router.get('/', function (req, res) {
        var MySQLEvents = require('mysql-events');
        var dsn = {
          host:     'localhost',
          user:     'krakenres_client',
          password: 'auza23364773',
        };
        var mysqlEventWatcher = MySQLEvents(dsn);
        var usuariosWatcher = mysqlEventWatcher.add(
          'krakenres.usuarios.Id',
          function (oldRow, newRow, event) {
             //row inserted 
            if (oldRow === null) {
              console.log('fila agregada');
            }
         
             //row deleted 
            if (newRow === null) {
                console.log('fila borrada');
            }
         
             //row updated 
            if (oldRow !== null && newRow !== null) {
              //update code goes here 
            }
         
            //detailed event information 
            //console.log(event) 
          }
        );
        res.send('Escuchando cambios en tabla usuarios');

    });

};
/*module.exports = function (router) {
    router.get('/', function (req, res) {
        
    });
    
}*/
