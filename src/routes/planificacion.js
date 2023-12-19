const express = require('express');
const router = express.Router();
const pool = require('../database');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('../lib/auth');
const { authRole} = require('../lib/rol');

router.get('/ciclos', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{

    try {
        // const ciclo_table= await pool.query("SELECT ciclo_id AS ID, ciclo_nombre AS NOMBRE, ciclo_tipotarea AS TTAREA, ciclo_tipoperiodo AS TPERIODO, ciclo_periodo AS PERIODO, ciclo_mantencion AS MANTENCION FROM Ciclos");
        const tareas = await pool.query("Select Id, Descripcion, Abreviacion FROM TipoProtocolo;");
        const tequipo = await pool.query("Select Id, Descripcion FROM TipoEquipo;");
        res.render('planificacion/ciclos', {
            tareas:tareas,
            tequipo: tequipo
        });
    } catch (err) {
        console.log(err);
    }

});

router.get('/ciclos_tequipo', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{

    try {
        const tequipo = await pool.query("Select Id, Descripcion FROM TipoEquipo;");
        res.json(tequipo);
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

router.post('/verificarNombre', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    const { nombre } = req.body;

    try {
        const resultado = await pool.query("SELECT COUNT(*) AS existe FROM Ciclos WHERE ciclo_nombre = ?;", [nombre]);
        res.json({ existe: resultado[0].existe > 0 });
    } catch (err) {
        console.log(err);
        res.json({ existe: false, error: err.message });
    }
});

router.post('/crear', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    const { base, dato1, dato2 } = req.body;
    const nombre = base.nombre;
    const tipo_equipo = base.tipo_equipo;

    var datofinal = [];  

    if (dato2 === undefined) {
        const arrayDato1 = [dato1.tipo_tarea, dato1.periodo, dato1.periodicidad];
        datofinal.push(arrayDato1);
    } else {
        const arrayDato1 = [dato1.tipo_tarea, dato1.periodo, dato1.periodicidad];
        const arrayDato2 = dato2.map((elementoDato2) => {
            return [elementoDato2.tipo_tarea, elementoDato2.periodo, elementoDato2.periodicidad];
        });

        const resultadoarray = [arrayDato1, ...arrayDato2];
        datofinal = [...datofinal, ...resultadoarray]; // Utilizamos spread operator para aplanar el array
    }

    try {
        const insert =  await pool.query("INSERT INTO Ciclos (ciclo_nombre, ciclo_tipo_equipo) VALUES (?,?);", [nombre, tipo_equipo], async (err, result) => {
            if (err) {
                console.log(err);
            } else {
                const new_id = result.insertId;
                const resultadoFinalConID = datofinal.map(subarray => [new_id, ...subarray]);

                for (const subarray of resultadoFinalConID) {
                    const [new_id, tipo_tarea, periodicidad, periodo] = subarray;

                    try {
                        const resultadoInsert = await pool.query(
                            "INSERT INTO Ciclos_detalle (c_detalle_id, c_detalle_ttarea, c_detalle_periodicidad, c_detalle_periodo) VALUES (?,?,?,?)",
                            [new_id, tipo_tarea, periodicidad, periodo]
                        );

                    } catch (error) {
                        console.error("Error al insertar en Ciclos_detalle:", error);
                    }
                }

                res.send("ok");
            }
        });

    } catch (err) {
        console.log(err);
    }
});

router.get('/lista_ciclos', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    try {
        
        const lista = await pool.query(
            "SELECT\n" +
            "	C.ciclo_id AS ID,\n" +
            "	C.ciclo_nombre AS NOMBRE, \n" +
            "	TE.Descripcion AS TIPO\n" +
            "FROM\n" +
            "	Ciclos C\n" +
            "	INNER JOIN TipoEquipo TE ON TE.Id = C.ciclo_tipo_equipo;");

        res.render('planificacion/lista_ciclos', {
            lista: lista
        });

    } catch (error) {
        
        console.log(error);

    }

});

router.post('/eliminar_ciclo/:Id', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    
    try {
        const {Id} = req.params;

        const borrar_detalle = await pool.query("DELETE FROM Ciclos_detalle WHERE c_detalle_id IN (?);", [Id]);
        const borrar_ciclo = await pool.query("DELETE FROM Ciclos WHERE ciclo_id IN (?);", [Id]);

        res.send("ok");
    } catch (error) {
        console.log(error);
    }
});

router.get('/obtenerDetallesCiclo/:Id', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    
    try {
     
        const {Id} = req.params
        const detallesCiclo = await pool.query(
            "SELECT\n" +
            "	C.ciclo_id AS ID,\n" +
            "	C.ciclo_nombre AS NOMBRE,\n" +
            "	TE.Descripcion AS TIPO_EQUIPO,\n" +
            "	TP.ID AS IDTP,\n" +
            "	CONCAT( TP.Descripcion, ' - ', TP.Abreviacion ) AS TIPO_ABREVIADO,\n" +
            "	CD.c_detalle_periodicidad AS PERIODICIDAD,\n" +
            "	CD.c_detalle_periodo AS PERIODO \n" +
            "FROM\n" +
            "	Ciclos_detalle CD\n" +
            "	INNER JOIN Ciclos C ON C.ciclo_id = CD.c_detalle_id\n" +
            "	INNER JOIN TipoProtocolo TP ON TP.Id = CD.c_detalle_ttarea \n" +
            "	INNER JOIN TipoEquipo TE ON TE.Id =  C.ciclo_tipo_equipo\n" +
            "WHERE\n" +
            "	C.ciclo_id = ?;",[Id]
        );
        res.json(detallesCiclo);  
    } catch (error) {
       
        console.log(error);
        res.status(500).send("Error al obtener detalles del ciclo.");
    }
});

router.get('/edit_ciclo/:Id', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{
    
    try {
        const {Id} = req.params;

        const ciclo = await pool.query("SELECT\n" +
        "	C.ciclo_id AS ID,\n" +
        "	C.ciclo_nombre AS NOMBRE,\n" +
        "	TE.Id AS IDTE,\n" +
        "	TE.Descripcion AS TIPO_EQUIPO,\n" +
        "	TP.Id AS IDTP,\n" +
        "	CONCAT(TP.Descripcion,' - ',TP.Abreviacion) AS TTAREA,\n" +
        "	CD.c_detalle_periodicidad AS PERIODO,\n" +
        "	CD.c_detalle_periodo AS CICLO \n" +
        "FROM\n" +
        "	Ciclos C\n" +
        "	INNER JOIN Ciclos_detalle CD ON CD.c_detalle_id = C.ciclo_id\n" +
        "	INNER JOIN TipoEquipo TE ON TE.Id = C.ciclo_tipo_equipo\n" +
        "	INNER JOIN TipoProtocolo TP ON TP.Id = CD.c_detalle_ttarea\n" +
        "WHERE\n" +
        "	C.ciclo_id = ?", [Id]);

        const tequipo = await pool.query("Select Id, Descripcion FROM TipoEquipo;");
        const prot = await pool.query("Select Id AS ID, CONCAT(Descripcion,' - ',Abreviacion) AS TIPO_ABREVIACION FROM TipoProtocolo;");

        res.json({
            ciclo,
            tequipo,
            prot
        });
    } catch (error) {
        console.log(error);    
    }

});

router.post('/eliminar_fila', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{

    const {idDetalle, tareaDetalle, periodicidadDetalle, periodoDetalle} = req.body;

    try {
        const prot = await pool.query(
            "SELECT Id FROM TipoProtocolo WHERE CONCAT(Descripcion, ' - ', Abreviacion) = ?",
            [tareaDetalle]
        );

        const tarea = prot[0].Id;

        const borrar = await pool.query("DELETE \n" +
        "FROM\n" +
        "	Ciclos_detalle \n" +
        "WHERE\n" +
        "	c_detalle_id = ? \n" +
        "	AND c_detalle_ttarea = ?\n" +
        "	AND c_detalle_periodicidad = ? \n" +
        "	AND c_detalle_periodo = ?;", [idDetalle, tarea, periodicidadDetalle, periodoDetalle] );

        res.send("ok");

    } catch (error) {
        console.log(error);
    }
});

router.post('/editar_fila', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{
    const {id_fila, tareaDetalle_fila, periodicidadDetalle_fila, periodoDetalle_fila,tipo_protocolo, periodicidad, periodo } = req.body;

    try {
        const prot = await pool.query(
            "SELECT Id FROM TipoProtocolo WHERE CONCAT(Descripcion, ' - ', Abreviacion) = ?",
            [tareaDetalle_fila]
        );

        const tarea = prot[0].Id;

        const act = await pool.query(
            "UPDATE Ciclos_detalle SET c_detalle_ttarea = ?, c_detalle_periodicidad = ?, c_detalle_periodo = ? WHERE c_detalle_id = ? AND c_detalle_ttarea = ? AND c_detalle_periodicidad = ? AND c_detalle_periodo = ?",
            [tipo_protocolo, periodicidad, periodo, id_fila, tarea, periodicidadDetalle_fila, periodoDetalle_fila]
          );
          
        res.send("ok");
    } catch (error) {
       console.log(error); 
    }
  
});

router.post('/actualizar', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    const {id, nombre, tipo_equipo} = req.body;

    try {
        const act = await pool.query("UPDATE Ciclos SET ciclo_nombre = ?, ciclo_tipo_equipo = ?   WHERE ciclo_id = ?;", [nombre, tipo_equipo, id]);
        res.send("ok");
    } catch (error) {
        console.log(error);
    }
});

router.post('/insert_fila', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    const { id, tipo_protocolo, periodicidad, periodo } = req.body;

    try {

        const totalIdsOtraTabla = await pool.query('SELECT COUNT(DISTINCT Id) AS count FROM TipoProtocolo;');
        const totalIdsIngresados = await pool.query('SELECT COUNT(DISTINCT c_detalle_ttarea) AS count FROM Ciclos_detalle WHERE c_detalle_id = ?;', [id]);

        if (totalIdsIngresados[0].count >= totalIdsOtraTabla[0].count) {
            return res.status(400).json({ error: 'Se han ingresado todos los items permitidos para este ciclo.' });
        }

        const existeId = await pool.query('SELECT COUNT(*) AS count FROM Ciclos_detalle WHERE c_detalle_id = ? AND c_detalle_ttarea = ?', [id, tipo_protocolo]);

        if (existeId[0].count > 0) {
            return res.status(400).json({ error: 'Este item ya existe en el ciclo' });
        }

        await pool.query('INSERT INTO Ciclos_detalle (c_detalle_id, c_detalle_ttarea, c_detalle_periodicidad, c_detalle_periodo) VALUES (?, ?, ?, ?)', 
        [id, tipo_protocolo, periodicidad, periodo]);

        res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

router.post('/duplicar', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    const { id_duplicar, nombre, tipo_equipo } = req.body;

    try {
        const antiguo = await pool.query("SELECT\n" +
            "c_detalle_ttarea AS IDTP,\n" +
            "c_detalle_periodicidad AS PERIODICIDAD,\n" +
            "c_detalle_periodo AS PERIODO\n" +
            "FROM\n" +
            "Ciclos_detalle CD\n" +
            "WHERE\n" +
            "CD.c_detalle_id = ?;", [id_duplicar]);

        const nuevo = await pool.query("INSERT INTO Ciclos (ciclo_nombre, ciclo_tipo_equipo) VALUES (?,?);", [nombre, tipo_equipo]);

        const new_id = nuevo.insertId;

        const nuevoArray = antiguo.map(fila => [new_id, fila.IDTP, fila.PERIODICIDAD, fila.PERIODO]);

        const nuevo_antiguo = await pool.query(
            "INSERT INTO Ciclos_detalle (c_detalle_id, c_detalle_ttarea, c_detalle_periodicidad, c_detalle_periodo) VALUES ?",
            [nuevoArray]
        );

        res.send("ok");

    } catch (error) {
        console.log(error);
    }
});

router.get('/equipos_plan', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{
    
    const {Id_Cliente} = req.user;
    
    const gerencias= await pool.query('SELECT vcgas_idGerencia, vcgas_gerenciaN FROM VIEW_ClienteGerAreSec WHERE vcgas_idCliente = '+Id_Cliente+' GROUP BY vcgas_idGerencia ');
    
    const ciclo= await pool.query("SELECT\n" +
    "ciclo_id AS ID,\n" +
    "ciclo_nombre AS NOMBRE,\n" +
    "ciclo_tipo_equipo AS TTEQUIPO\n" +
    "FROM\n" +
    "Ciclos;");
    res.render('planificacion/asignacion_equipos', 

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
            "	TP.Id AS IDTP,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "	C.ciclo_nombre AS CICLO \n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo\n" +
            "	INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "	LEFT JOIN Ciclos C ON C.ciclo_id = CE.equipo_ciclo\n" +
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
            "	TP.Id AS IDTP,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "	C.ciclo_nombre AS CICLO \n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo\n" +
            "	INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "	LEFT JOIN Ciclos C ON C.ciclo_id = CE.equipo_ciclo\n" +
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
            "	TP.Id AS IDTP,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "	C.ciclo_nombre AS CICLO \n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo\n" +
            "	INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "	LEFT JOIN Ciclos C ON C.ciclo_id = CE.equipo_ciclo\n" +
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
            "	TP.Id AS IDTP,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "	C.ciclo_nombre AS CICLO \n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo\n" +
            "	INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "	LEFT JOIN Ciclos C ON C.ciclo_id = CE.equipo_ciclo\n" +
            "WHERE\n" +
            "	E.Id = ?", [equipo]);
            
            if(!equi_equi){
                res.json({title: "Sin Información."});
            }else{
                res.json(equi_equi);
            }

        }else if(!gerencia && !area && !sector && !equipo){

            const equi_equi = await pool.query("SELECT\n" +
            "	E.Id AS ID,\n" +
            "	E.Codigo AS CODIGO,\n" +
            "	TP.Id AS IDTP,\n" +
            "	TP.Descripcion AS TIPO,\n" +
            "	G.Descripcion AS GER,\n" +
            "	A.Descripcion AS AREA,\n" +
            "	S.Descripcion AS SECTOR,\n" +
            "	C.ciclo_nombre AS CICLO \n" +
            "FROM\n" +
            "	Equipos E\n" +
            "	INNER JOIN Sectores S ON S.Id = E.Id_Sector\n" +
            "	INNER JOIN Areas A ON A.Id = S.Id_Area\n" +
            "	INNER JOIN Gerencias G ON G.Id = A.Id_Gerencia\n" +
            "	INNER JOIN TipoEquipo TP ON TP.Id = E.Id_Tipo\n" +
            "	INNER JOIN Ciclo_equipos CE ON CE.equipo_id = E.Id\n" +
            "	LEFT JOIN Ciclos C ON C.ciclo_id = CE.equipo_ciclo;");

            
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

router.post('/detalle_ciclo', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    try {
        const detalle = await pool.query("SELECT ciclo_id AS ID, ciclo_nombre AS DETALLE, ciclo_tipo_equipo AS EQUIPO FROM Ciclos;");

        res.json(detalle);
        
    } catch (error) {
        console.log(error);
    }
});

router.post('/asigna_ciclo', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {
    const info = req.body;

    let idsSeleccionados;
    let idCiclo;

    const transformedInfo = info.map(([idSeleccionado, valorSelect, ciclo]) => ({
        idsSeleccionados: idSeleccionado,
        idCiclo: ciclo
    }));

    try {
        for (const { idsSeleccionados, idCiclo } of transformedInfo) {
            await pool.query("UPDATE Ciclo_equipos SET equipo_ciclo = ? WHERE equipo_id = ?;", [idCiclo, idsSeleccionados]);
        }

        res.send("ok");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/planificacion_equipos', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) =>{
    
    const {Id_Cliente} = req.user;

    const maximo = req.app.locals.maximo;
    
    const gerencias= await pool.query('SELECT vcgas_idGerencia, vcgas_gerenciaN FROM VIEW_ClienteGerAreSec WHERE vcgas_idCliente = '+Id_Cliente+' GROUP BY vcgas_idGerencia ');
    
    const ciclo= await pool.query("SELECT\n" +
    "ciclo_id AS ID,\n" +
    "ciclo_nombre AS NOMBRE,\n" +
    "ciclo_tipo_equipo AS TTEQUIPO\n" +
    "FROM\n" +
    "Ciclos;");
    res.render('planificacion/planificacion_equipos', 

        {
            gerencias: gerencias,
            ciclo: ciclo,
            maximo: maximo
        }
    );
    
});

router.post('/verificar', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {

    const {fecha_inicial, fecha_final, idsSeleccionados} = req.body;

    try {
        
        const verificacion = await pool.query(
        "SELECT\n" +
        "	T.Id AS ID,\n" +
        "	T.Fecha AS FECHA,\n" +
        "	U.Login AS TECNICO,\n" +
        "	E.Descripcion AS ESTADO,\n" +
        "	EQ.Codigo AS EQUIPO,\n" +
        "	P.Descripcion AS PROTOCOLO\n" +
        "FROM\n" +
        "	Tareas T\n" +
        "	INNER JOIN Usuarios U ON U.Id = T.Id_Tecnico\n" +
        "	INNER JOIN Estados E ON E.Id = T.Id_Estado\n" +
        "	INNER JOIN Equipos EQ ON EQ.Id = T.Id_Equipo\n" +
        "	INNER JOIN Protocolos P ON P.Id = T.Id_Protocolo\n" +
        "WHERE\n" +
        "	T.Id_Equipo IN (?)\n" +
        "   AND T.Id_Estado IN (1,2)\n" +
        "	AND T.Fecha BETWEEN ? AND ?;", [idsSeleccionados, fecha_inicial, fecha_final]);

        console.log(verificacion);

        res.json(verificacion);

    } catch (error) {
        console.log(error);
    }

});

router.post('/actualizamaximo', isLoggedIn, authRole(['Plan', 'Admincli']), async (req, res) => {

    const nuevoMaximo = req.body.nuevoMaximo;

    try {

        const dir = path.resolve(__dirname, "../maximo.txt")
        fs.writeFileSync(dir, nuevoMaximo);
        res.send("ok");
        
    } catch (error) {
        
        console.log(error);
        
    }


});


module.exports = router;

