var table;
var table1;

$(document).ready(function () {

    table = $('#lista_ciclo').DataTable({
        "dom": '<"toolbar">frtp',
        'select': {
            'style': 'single'
        },
        "bInfo": true,
        "iDisplayLength": 8,
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ".",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            "select" : {
                "rows" : {
                    "_" : "Has seleccionado %d filas",
                    "0" : "Click en una fila para seleccionar",
                    "1" : "Has seleccionado 1 fila"
                }
            }
        }
    });

    $("div.toolbar").append($(".dataTables_filter"));

    $('#lista_ciclo tbody').on('click', 'tr', function () {
        $('#lista_ciclo tbody tr').removeClass('selected');
        $(this).addClass('selected');
    
        var data = table.row(this).data();
        var idCiclo = data[0];
    
        $.ajax({
            url: '/obtenerDetallesCiclo/' + idCiclo,
            type: 'GET',
            success: function (data) {
                
                $('#tabla_detalle tbody').empty();
    
                data.forEach(function (detalle) {
                    $('#tabla_detalle tbody').append(
                        '<tr>' +
                        '<td>' + detalle.NOMBRE + '</td>' +
                        '<td>' + detalle.TIPO_ABREVIADO + '</td>' +
                        '<td>' + detalle.PERIODICIDAD + '</td>' +
                        '<td>' + detalle.PERIODO + '</td>' +
                        '</tr>'
                    );
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
    
    table1 = $('#tabla_detalle').DataTable({
        "dom": '<"detalle">rt',
        'select': {
            'style': 'single'
        },
        "bInfo": true,
        "iDisplayLength": 8,
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ".",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            "select" : {
                "rows" : {
                    "_" : "Has seleccionado %d filas",
                    "0" : "Click en una fila para seleccionar",
                    "1" : "Has seleccionado 1 fila"
                }
            }
        }
    });

    $("div.detalle").html('<button id="boton-editar" class="btn btn-inline btn-warning btn-sm ladda-button"><i class="fa fa-edit"></i></button>'+
    '<button id="boton-eliminar" class="btn btn-inline btn-danger btn-sm ladda-button"><i class="fa fa-trash"></i></button>'+
    '<button id="boton-duplicar" class="btn btn-inline btn-secondary btn-sm ladda-button float-right">Duplicar</button>');

    $('#boton-editar').on('click', function () {
        var selectedRows = table.rows({ selected: true });
        
        if (selectedRows.count() !== 1) {
            swal("¡SAPMA!", "Debes seleccionar exactamente una fila para editar.", "error");
        } else {
            var idCiclo = table.row('.selected').data()[0];
        
            $.ajax({
                url: '/edit_ciclo/' + idCiclo,
                type: 'GET',
                success: function (data) {
       
                    $('#act_nombre').val(data.ciclo[0].NOMBRE);
        
                    var selectTipoEquipo = $('#act_tipo_equipo');
                    selectTipoEquipo.empty();
        
                    data.tequipo.forEach(function (tipo) {
                        var option = $('<option>', {
                            value: tipo.Id,
                            text: tipo.Descripcion
                        });
        
                        if (tipo.Id === data.ciclo[0].IDTE) {
                            option.prop('selected', true);
                        }
        
                        selectTipoEquipo.append(option);
                    });
        
                    $('#informacion').empty();
        
                    data.ciclo.forEach(function (fila, index) {
                        var row = $('<div class="row"></div>');
        
                        var selectTTAREA = $('<select class="form-control ttarea"></select>');

                        var selectPeriodo = $('<select class="form-control periodo"></select>');
        
                        data.prot.forEach(function (protocolo) {
                            var optionTTAREA = $('<option>', {
                                value: protocolo.ID,
                                text: protocolo.TIPO_ABREVIACION
                            });
        
                            if (protocolo.ID === fila.IDTP) {
                                optionTTAREA.prop('selected', true);
                            }
        
                            selectTTAREA.append(optionTTAREA);
                        });
        
                        var periodos = ['Diario', 'Semanal', 'Mensual', 'Anual'];
        
                        periodos.forEach(function (periodo) {
                            var optionPeriodo = $('<option>', {
                                value: periodo,
                                text: periodo
                            });
        
                            if (periodo === fila.PERIODO) {
                                optionPeriodo.prop('selected', true);
                            }
        
                            selectPeriodo.append(optionPeriodo);
                        });
        
                        row.append('<div class="col-md-4 col-sm-6"><label class="form-label">Tipo de protocolo</label></div>');
                        row.find('.col-md-4:last-child').append(selectTTAREA);
        
                        row.append('<div class="col-md-4 col-sm-6"><label class="form-label">Periodicidad</label></div>');
                        row.find('.col-md-4:last-child').append(selectPeriodo);

                        selectPeriodo.on('change', function () {
                            
                            tipoPeriodoOptions.empty();
                        
                            var nuevoTipoPeriodoOptions = getTipoPeriodoOptions(selectPeriodo.val(), index);
                            tipoPeriodoOptions.replaceWith(nuevoTipoPeriodoOptions);
                            tipoPeriodoOptions = nuevoTipoPeriodoOptions; 
                            
                        });
                        

                        var tipoPeriodoOptions = getTipoPeriodoOptions(fila.PERIODO, index, fila.CICLO);

                        row.append(tipoPeriodoOptions);

                       var deleteButton = $('<div class="form-group col-md-1 col-sm-6 d-flex align-items-center justify-content-center">'+
                        '<label class="form-label" id="buscar" style="color: aliceblue;">.</label>'+
                        '<a href="#" type="button" class="btn btn-inline btn-danger btn-sm ladda-button delete-button"><i class="fa fa-minus"></i></a>'+
                        '</div>');

                        deleteButton.on('click', function() {
                            row.remove();
                        });

                        row.append(deleteButton);
        
                        $('#informacion').append(row);
        
                        if (index < data.ciclo.length - 1) {
                            $('#informacion').append('<br>');
                        }
                    });

                    $('#edit_ciclo').modal('show');
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    function getTipoPeriodoOptions(periodo, index, ciclo) {
        var tipoPeriodoOptions = $('<div class="tipo-periodo-options row"></div>');
        var tipoPeriodoId = 'tipo_periodo_' + periodo.toLowerCase().charAt(0) + index;
        tipoPeriodoOptions.attr('id', tipoPeriodoId);
        tipoPeriodoOptions.addClass('form-group col-md-3 col-sm-6');

        if (periodo === 'Diario') {

            if (ciclo === 'TLD'){
            var radioTodosLosDias = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_dias' + index + '" value="TLD" checked>' +
                '<label for="todos_los_dias' + index + '">Todos los días</label>' +
                '</div>');

            var radioCadaNDias = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cnd' + index + '" value="CND">' +
                '<label for="cnd' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;días</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosDias);
            tipoPeriodoOptions.append(radioCadaNDias);
                
            } else if ( !isNaN(ciclo)) {

            var radioTodosLosDias = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_dias' + index + '" value="TLD">' +
                '<label for="todos_los_dias' + index + '">Todos los días</label>' +
                '</div>');

            var radioCadaNDias = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cnd' + index + '" value="CND" checked>' +
                '<label for="cnd' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '" value="'+ciclo+'">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;días</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosDias);
            tipoPeriodoOptions.append(radioCadaNDias);

            } else {

            var radioTodosLosDias = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_dias' + index + '" value="TLD">' +
                '<label for="todos_los_dias' + index + '">Todos los días</label>' +
                '</div>');

            var radioCadaNDias = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cnd' + index + '" value="CND">' +
                '<label for="cnd' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;días</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosDias);
            tipoPeriodoOptions.append(radioCadaNDias);

            }
            

        } else if (periodo === 'Semanal') {

            if (ciclo === 'TLS'){

            var radioTodosLasSemanas = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todas_las_semanas' + index + '" value="TLS" checked>' +
                '<label for="todas_las_semanas' + index + '">Todos las semanas</label>' +
                '</div>');

            var radioCadaNSemanas = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cns' + index + '" value="CNS">' +
                '<label for="cns' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;semanas</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLasSemanas);
            tipoPeriodoOptions.append(radioCadaNSemanas);

            } else if ( !isNaN(ciclo)) {

            var radioTodosLasSemanas = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todas_las_semanas' + index + '" value="TLS">' +
                '<label for="todas_las_semanas' + index + '">Todos las semanas</label>' +
                '</div>');

            var radioCadaNSemanas = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cns' + index + '" value="CNS" checked>' +
                '<label for="cns' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '" value"'+ciclo+'">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;semanas</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLasSemanas);
            tipoPeriodoOptions.append(radioCadaNSemanas);

            } else{

            var radioTodosLasSemanas = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todas_las_semanas' + index + '" value="TLS">' +
                '<label for="todas_las_semanas' + index + '">Todos las semanas</label>' +
                '</div>');

            var radioCadaNSemanas = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cns' + index + '" value="CNS">' +
                '<label for="cns' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;semanas</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLasSemanas);
            tipoPeriodoOptions.append(radioCadaNSemanas);
            }

        } else if (periodo === 'Mensual') {

            if (ciclo === 'TLM'){

            var radioTodosLosMeses = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_meses' + index + '" value="TLM" checked>' +
                '<label for="todos_los_meses' + index + '">Todos los meses</label>' +
                '</div>');

            var radioCadaNMeses = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cnm' + index + '" value="CNM">' +
                '<label for="cnm' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;meses</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosMeses);
            tipoPeriodoOptions.append(radioCadaNMeses);

            } else if (!isNaN(ciclo)){

            var radioTodosLosMeses = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_meses' + index + '" value="TLM">' +
                '<label for="todos_los_meses' + index + '">Todos los meses</label>' +
                '</div>');

            var radioCadaNMeses = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cnm' + index + '" value="CNM" checked>' +
                '<label for="cnm' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '" value="'+ciclo+'">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;meses</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosMeses);
            tipoPeriodoOptions.append(radioCadaNMeses);

            } else {

            var radioTodosLosMeses = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_meses' + index + '" value="TLM">' +
                '<label for="todos_los_meses' + index + '">Todos los meses</label>' +
                '</div>');

            var radioCadaNMeses = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cnm' + index + '" value="CNM">' +
                '<label for="cnm' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;meses</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosMeses);
            tipoPeriodoOptions.append(radioCadaNMeses);

            }


        } else if (periodo === 'Anual') {

            if (ciclo === 'TLA'){

            var radioTodosLosAnos = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_anos' + index + '" value="TLA" checked>' +
                '<label for="todos_los_anos' + index + '">Todos los años</label>' +
                '</div>');

            var radioCadaNAnos = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cna' + index + '" value="CNA">' +
                '<label for="cna' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;años</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosAnos);
            tipoPeriodoOptions.append(radioCadaNAnos);

            } else if (!isNaN(ciclo)){

            var radioTodosLosAnos = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_anos' + index + '" value="TLA">' +
                '<label for="todos_los_anos' + index + '">Todos los años</label>' +
                '</div>');

            var radioCadaNAnos = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cna' + index + '" value="CNA" checked>' +
                '<label for="cna' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '" value="'+ciclo+'">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;años</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosAnos);
            tipoPeriodoOptions.append(radioCadaNAnos);

            } else {

            var radioTodosLosAnos = $('<label class="form-label"></label><div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="todos_los_anos' + index + '" value="TLA">' +
                '<label for="todos_los_anos' + index + '">Todos los años</label>' +
                '</div>');

            var radioCadaNAnos = $('<div class="radio">' +
                '<input type="radio" name="optionsRadios' + index + '" id="cna' + index + '" value="CNA">' +
                '<label for="cna' + index + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="d' + index + '" id="d' + index + '">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;años</label>' +
                '</div>');

            tipoPeriodoOptions.append(radioTodosLosAnos);
            tipoPeriodoOptions.append(radioCadaNAnos);

            }

        }

        return tipoPeriodoOptions;
    }

    function manejarCambioPeriodo(selectPeriodo) {
        var row = selectPeriodo.closest('.row');
        var index = $('.row').index(row);
    
        var tipoPeriodoOptions = getTipoPeriodoOptions(selectPeriodo.val(), index);
        row.find('.tipo-periodo-options').replaceWith(tipoPeriodoOptions);
    }
    
    $('#informacion').on('change', '.periodo', function () {
        manejarCambioPeriodo($(this));
    });
    
    function agregarFila() {
        event.preventDefault();
    
        $.ajax({
            url: '/agregar_fila',
            type: 'GET',
            success: function (data) {
                var row = $('<div class="row"></div>');
                var selectTTAREA = $('<select class="form-control ttarea"></select>');
                var selectPeriodo = $('<select class="form-control periodo"></select>');
    
                data.prot.forEach(function (tarea) {
                    var optionTTAREA = $('<option>', {
                        value: tarea.ID,
                        text: tarea.TIPO_ABREVIACION
                    });
    
                    selectTTAREA.append(optionTTAREA);
                });
    
                var periodos = ['Diario', 'Semanal', 'Mensual', 'Anual'];
    
                selectPeriodo.append('<option disabled selected>Seleccione periodicidad</option>');
    
                periodos.forEach(function (periodo) {
                    var optionPER = $('<option>', {
                        value: periodo,
                        text: periodo
                    });
    
                    selectPeriodo.append(optionPER);
                });
    
                row.append('<br>');
                row.append('<div class="col-md-4 col-sm-6"><label class="form-label">Tipo de protocolo</label></div>');
                row.find('.col-md-4:last-child').append(selectTTAREA);
    
                row.append('<div class="col-md-4 col-sm-6"><label class="form-label">Periodicidad</label></div>');
                row.find('.col-md-4:last-child').append(selectPeriodo);
    
                var tipoPeriodoOptions = getTipoPeriodoOptions('', 0); // Asegúrate de proporcionar los valores adecuados aquí
                row.append(tipoPeriodoOptions);
    
                var deleteButton = $('<div class="form-group col-md-1 col-sm-6 d-flex align-items-center justify-content-center">' +
                    '<label class="form-label" style="color: aliceblue;">.</label>' +
                    '<a href="#" type="button" class="btn btn-inline btn-danger btn-sm ladda-button delete-button"><i class="fa fa-minus"></i></a>' +
                    '</div>');
    
                deleteButton.on('click', function () {
                    row.remove();
                });
    
                row.append(deleteButton);
    
                $('#informacion').append(row);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
    
    $('#agrega_fila').on('click', agregarFila);

    $('#boton-eliminar').on('click', function () {
        
        var selectedRows = table.rows({selected: true});
		
        if (selectedRows.count() != 1) {
			swal("¡SAPMA!", "Debes seleccionar al menos una fila para eliminar.", "error");
		} else {

        var idRegistro = table.row('.selected').data()[0];

        swal({
        title: "¿Desea eliminar este ciclo?",
        text: "Esto NO eliminará las tareas planificadas.",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false      
        },function(isConfirm) {
            if(isConfirm){
                $.ajax({
                    url: "/eliminar_ciclo/"+idRegistro,
                    type: 'POST',
                    beforeSend: function(){
                        swal({
                            title: "Eliminando",
                            text: "Espere un momento por favor...",
                            imageUrl:"/img/Spinner-1s-200px2.gif",
                            showConfirmButton: false,
                            allowOutsideClick: false
                        });
                    }
                }).done(function(data){
                    swal({
                        title: "¡SAPMA!",
                        text: "Ciclo eliminado correctamente",
                        type: "success",
                        confirmButtonText: "Aceptar",
                        allowOutsideClick: false
                    });	
                    setTimeout(function () {
                        location.reload();
                    }, 1000);	
                })
            }
        });	
		}	
       
    });
    
});	