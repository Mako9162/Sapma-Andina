const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { authRole} = require('../lib/rol');

router.get('/ciclos', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{

    try {
        const ciclo_table= await pool.query("SELECT ciclo_id AS ID, ciclo_nombre AS NOMBRE, ciclo_tipotarea AS TTAREA, ciclo_tipoperiodo AS TPERIODO, ciclo_periodo AS PERIODO, ciclo_mantencion AS MANTENCION FROM Ciclos");
        const tareas = await pool.query("Select Id, Descripcion, Abreviacion FROM TipoProtocolo;");
        const tequipo = await pool.query("Select Id, Descripcion FROM TipoEquipo;");
        res.render('planificacion/ciclos', {
            ciclo_table:ciclo_table,
            tareas:tareas,
            tequipo: tequipo
        });
    } catch (err) {
        console.log(err);
    }

});

router.get('/ttareas', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    try {
        const ttareas = await pool.query("Select Id, Descripcion, Abreviacion FROM TipoProtocolo;");
        res.json(ttareas);  // Envía directamente el array sin anidarlo en un objeto
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al obtener los datos.' });
    }
});

router.post('/crear', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    console.log(req.body);
        
});

router.get('/plan', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{
    const {Id_Cliente} = req.user;
    const gerencias= await pool.query('SELECT vcgas_idGerencia, vcgas_gerenciaN FROM VIEW_ClienteGerAreSec WHERE vcgas_idCliente = '+Id_Cliente+' GROUP BY vcgas_idGerencia ');
    const ciclo= await pool.query("SELECT ciclo_id AS ID, ciclo_nombre AS NOMBRE, ciclo_tipotarea AS TTAREA, ciclo_tipoperiodo AS TPERIODO, ciclo_periodo AS PERIODO, ciclo_mantencion AS MANTENCION FROM Ciclos");
    res.render('planificacion/planificar', 

        {
            gerencias: gerencias,
            ciclo: ciclo
        }
    );
});

router.get('/get_datapla', function(request, response, next){

    const type = request.query.type;

    const search_query = request.query.parent_value;

    if(type == 'load_areass')

    {
        var query = `
        SELECT DISTINCT vcgas_idArea AS Id, vcgas_areaN AS Data FROM VIEW_equiposCteGerAreSec
        WHERE vcgas_idGerencia = '${search_query}'
        ORDER BY vcgas_areaN ASC
        `;
    }

    if(type == 'load_sectoress')

    {
        var query = `
        SELECT DISTINCT vcgas_idSector AS Id, vcgas_sectorN AS Data FROM VIEW_equiposCteGerAreSec
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

router.post('/buscar_plan', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {

    const {gerencia, area, sector, equipo} = req.body;

    try {

        if(gerencia>0 && !area && !sector && !equipo){

            const ger_equi = await pool.query("SELECT\n" +
            "	E.Id AS ID,\n" +
            "	E.Codigo AS CODIGO,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "   CE.equipo_ciclo AS CICLO\n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo \n" +
            "   INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "WHERE\n" +
            "	G.Id = ?", [gerencia]);

            if(!ger_equi){
                res.json({title: "Sin Información."});
            }else{
                res.json(ger_equi);
            }

        }else if(gerencia>0 && area>0 && !sector && !equipo){

            const area_equi = await pool.query("SELECT\n" +
            "	E.Id AS ID,\n" +
            "	E.Codigo AS CODIGO,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "   CE.equipo_ciclo AS CICLO\n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo \n" +
            "   INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "WHERE\n" +
            "	A.Id = ?", [area]);
 
            if(!area_equi){
                res.json({title: "Sin Información."});
            }else{
                res.json(area_equi);
            }

        }else if(gerencia>0 && area >0 && sector>0 && !equipo){
            
            const sec_equi = await pool.query("SELECT\n" +
            "	E.Id AS ID,\n" +
            "	E.Codigo AS CODIGO,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "   CE.equipo_ciclo AS CICLO\n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo \n" +
            "   INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "WHERE\n" +
            "	E.Id_Sector = ?", [sector]);
            
            if(!sec_equi){
                res.json({title: "Sin Información."});
            }else{
                res.json(sec_equi);
            }

        }else if(equipo>0 && area >0 && sector>0 && equipo>0){

            const equi_equi = await pool.query("SELECT\n" +
            "	E.Id AS ID,\n" +
            "	E.Codigo AS CODIGO,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "   CE.equipo_ciclo AS CICLO\n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo \n" +
            "   INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "WHERE\n" +
            "	E.Id = ?", [equipo]);
            
            if(!equi_equi){
                res.json({title: "Sin Información."});
            }else{
                res.json(equi_equi);
            }
        } 

    } catch (err) {

        console.log(err);

    }
});

router.post('/asigna_ciclo', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    const {ciclo, idsSeleccionados } = req.body;

    await pool.query("UPDATE Ciclo_equipos SET equipo_ciclo = ? WHERE equipo_id IN (?);", [ciclo, idsSeleccionados], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log('ok');
        }
    });
    
});

module.exports = router;

