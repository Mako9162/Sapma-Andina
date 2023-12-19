var table;
var table1;

$(document).ready(function() {

    var date1 = document.querySelector('#inicial_plan');
    var date2 = document.querySelector('#final_plan');

    table1 = $('#tabla_verificar').DataTable({
        "dom": 'rtp',
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

    date1.addEventListener('change', function() {
        date2.min = this.value;
    });	

    function _(element)
    {
        return document.getElementById(element); 
    }

    function fetch_data(parent_element, child_element, type) {
        fetch('/get_datapla?type=' + type + '&parent_value=' + parent_element.value + '').then(function(response) {
            return response.json();
        }).then(function(responseData) {
            var html = '';

            if (type == 'load_areass') {
                html = '<option value="">Seleccione un área</option>';
                for (var count = 0; count < responseData.length; count++) {
                    html += '<option value="' + responseData[count][0] + '">' + responseData[count][1] + '</option>';
                }

                _('area').innerHTML = html;
                _('sector').innerHTML = '<option value="">Seleccione un sector</option>';
                _('equipo').innerHTML = '<option value="">Seleccione un equipo</option>';

            } else if (type == 'load_sectoress') {
                html = '<option value="">Seleccione un sector</option>';
                for (var count = 0; count < responseData.length; count++) {
                    html += '<option value="' + responseData[count][0] + '">' + responseData[count][1] + '</option>';
                }

                _('sector').innerHTML = html;
                _('equipo').innerHTML = '<option value="">Seleccione un equipo</option>';

            } else if (type == 'load_equiposs') {
                html = '<option value="">Seleccione un equipo</option>';
                for (var count = 0; count < responseData.length; count++) {
                    html += '<option value="' + responseData[count][0] + '">' + responseData[count][1] + '</option>';
                }

                _('equipo').innerHTML = html;
            }
        });
    }

    _('gerencia').onchange = function(){		
        fetch_data(_('gerencia'), _('area'), 'load_areass');
    };

    _('area').onchange = function(){
        fetch_data(_('area'), _('sector'), 'load_sectoress');
    };

    _('sector').onchange = function(){
        fetch_data(_('sector'), _('equipo'), 'load_equiposs');
    };

    function initDataTable() {
        table = $('#tabla_plan').DataTable({
            "searching": true,
            "lengthChange": false,
            "colReorder": true,
            'select': {
                'style': 'multi'
            },
            "dom": 'f<"botones">rtip',
            "bDestroy": true, 	
            "bInfo": true,
            "iDisplayLength": 10,
            "autoWidth": true,
            "scrollY": true, 
            "language": {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible",
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

        $("div.botones").html('<button id="seleccionar" class="btn btn-inline btn-secondary btn-sm">Seleccionar</button>'
        )

        $('#seleccionar').on('click', function () {
            var visibleRows = table.rows({ search: 'applied' }).nodes();
    
            if (table.rows({ selected: true }).count() > 0) {
                table.rows().deselect();
            } else {
                table.rows(visibleRows).select();
            }
        });
    
    }

    initDataTable();

    $('#filtrar').click(function () {
        var gerencia = $('#gerencia').val();
        var area = $('#area').val();
        var sector = $('#sector').val();
        var equipo = $('#equipo').val();
    
        var data = {
            gerencia: gerencia,
            area: area,
            sector: sector,
            equipo: equipo
        };
    
        swal({
            title: "Cargando",
            text: "Espere un momento por favor...",
            imageUrl: "/img/Spinner-1s-200px2.gif",
            showConfirmButton: false,
            allowOutsideClick: false
        });
    
        $.ajax({
            url: '/buscar_plan',
            type: 'POST',
            data: data
        }).done(function (data) {
            swal.close();
    
            if ($.fn.DataTable.isDataTable('#tabla_plan')) {
                table.clear().destroy();
            }
    
            $('#tabla_plan tbody').empty();
    
            data.forEach(function (item) {
                var ciclo = item.CICLO !== null ? item.CICLO : "Sin ciclo asignado";
                $('#tabla_plan tbody').append(`
                    <tr>
                        <td>${item.ID}</td>
                        <td>${item.CODIGO}</td>
                        <td hidden="true">${item.IDTP}</td>
                        <td>${item.TIPO}</td>
                        <td>${item.GER}</td>
                        <td>${item.AREA}</td>
                        <td>${item.SECTOR}</td>
                        <td>${ciclo}</td>
                    </tr>
                `);
            });
    
            initDataTable();
        });
    });

    $('#planificar').on('click', function () {

        var filasSeleccionadas = table.rows({ selected: true }).count();

        if (filasSeleccionadas > 0 ){
            $('#planificacion').modal('show');
        }else{
            swal("Error", "Debe seleccionar uno o varios equipos planificar", "error");
        }
    });

    $('#planificaion').on('hidden.bs.modal', function (e) {

    });

    $('#verificar').on('click', function () {
        var fecha1 = $('#inicial_plan').val();
        var fecha2 = $('#final_plan').val();
    
        if (!fecha1 || !fecha2) {
            swal("Error", "Ingrese ambas fechas.", "error");
            return;
        }
        
        var filasSeleccionadas = table.rows({ selected: true }).data();
        var idsSeleccionados = filasSeleccionadas.toArray().map(function(row) {
            return row[0]; 
        });
        var fecha_inicial = $('#inicial_plan').val();
        var fecha_final = $('#final_plan').val();
        
        var data = {
            idsSeleccionados,
            fecha_inicial,
            fecha_final
        }
    
        $.ajax({
            url: '/verificar',
            type: 'POST',
            data: data,
            success: function(response) {
                if (response && response.length > 0) {
                    $('#tabla_verificar tbody').empty();
    
                    response.forEach(function(tarea) {

                        var fechaFormateada = new Date(tarea.FECHA).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });

                        var row = '<tr>' +
                            '<td>' + tarea.ID + '</td>' +
                            '<td>' + tarea.EQUIPO + '</td>' +
                            '<td>' + fechaFormateada + '</td>' +
                            '<td>' + tarea.ESTADO + '</td>' +
                            '<td>' + tarea.TECNICO + '</td>' +
                            '</tr>';
                        $('#tabla_verificar tbody').append(row);
                    });
                } 

                $('#verificar_tareas').modal('show');
            },
            error: function(error) {
                console.log('Error en la solicitud AJAX:', error);
            }
        });
    });

    $('#verificar_tareas').on('hidden.bs.modal', function () {
        $('#tabla_verificar tbody').empty();
    });

    $('#cancelar_ver').on('click', function () {
        $('#verificar_tareas').modal('hide');
    });

    $('#configuracion').on('click', function () {
        $('#configurar').modal('show');
    });

    $('#actvariable').on('click', function () {
        var nuevoMaximo = $('#maximo').val();
        
        var data = {nuevoMaximo}

        swal({
            title: "¡SAPMA!",
            text: "¿Desea actualizar el máximo de tareas por día?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false      
            },function(isConfirm) {
                if(isConfirm){
                    $.ajax({
                        url: '/actualizamaximo',
                        type: 'POST',
                        data: data
                    }).done(function(data){
                        swal({
                            title: "¡SAPMA!",
                            text: "Máximo actualizado correctamente",
                            type: "success",
                            confirmButtonText: "Aceptar",
                            allowOutsideClick: false
                        });	
                        $('#maximo').val('');
                        $('#configurar').modal('hide');
                        setTimeout(function () {
                            location.reload();
                        }, 1000);	
                    })
                }
            });	
    });
    
    $('#ir').on('click', function () {
        $('#crear_plan').prop('disabled', false);
        $('#verificar_tareas').modal('hide');
    });

});