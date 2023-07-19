const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { authRole} = require('../lib/rol');

router.get('/new_plan', isLoggedIn, authRole(['Plan', 'Admincli']), async (req,res) =>{
    const {Id_Cliente} = req.user;
    const gerencias= await pool.query('SELECT vcgas_idGerencia, vcgas_gerenciaN FROM VIEW_ClienteGerAreSec WHERE vcgas_idCliente = '+Id_Cliente+' GROUP BY vcgas_idGerencia ');
    res.render('planificacion/planificar', 
        {
            gerencias: gerencias
        }
    );
});

router.get('/get_datapla', function(request, response, next){

    const type = request.query.type;

    const search_query = request.query.parent_value;
    console.log(search_query);

    if(type == 'load_areass')
    {
        var query = `
        SELECT DISTINCT vcgas_idArea AS Id, vcgas_areaN AS Data FROM VIEW_ClienteGerAreSec 
        WHERE vcgas_idGerencia = '${search_query}' 
        ORDER BY vcgas_areaN ASC
        `;
    }

    if(type == 'load_sectoress')
    {
        var query = `
        SELECT DISTINCT vcgas_idSector AS Id, vcgas_sectorN AS Data FROM VIEW_ClienteGerAreSec 
        WHERE vcgas_idArea = '${search_query}' 
        ORDER BY vcgas_sectorN ASC
        `;
    }

    if(type == 'load_equiposs')
    {
        var query = `
        SELECT DISTINCT vce_idEquipo AS Id, vce_codigo AS Data FROM VIEW_equiposCteGerAreSec 
        WHERE vcgas_idSector = '${search_query}' 
        ORDER BY vce_codigo ASC
        `;
    }


    pool.query(query, function(error, data){

        const data_arr = [];

        data.forEach(function(row){
            data_arr.push([row.Id, row.Data]);
        });

        response.json(data_arr);

    });

});

module.exports = router;