var table;
var table1;


$(document).ready(function() {

    var year = new Date().getFullYear();

    for (var i = 0; i < 2; i++) {
        $('#ano1').append('<option value="' + (year + i) + '">' + (year + i) + '</option>');
        $('#ano2').append('<option value="' + (year + i) + '">' + (year + i) + '</option>');
    }

    // var date1 = document.querySelector('#inicial_plan');
    // var date2 = document.querySelector('#final_plan');

    // table1 = $('#tabla_verificar').DataTable({
    //     "searching": true,
    //     "lengthChange": false,
    //     "colReorder": true,
    //     "dom": 'frtip',
    //     "bDestroy": true, 	
    //     "bInfo": true,
    //     "iDisplayLength": 10,
    //     "autoWidth": true,
    //     "scrollY": true, 
    //     "language": {
    //         "sProcessing": "Procesando...",
    //         "sLengthMenu": "Mostrar _MENU_ registros",
    //         "sZeroRecords": "No se encontraron resultados",
    //         "sEmptyTable": "Ningún dato disponible en esta tabla",
    //         "sInfo": "Mostrando un total de _TOTAL_ registros",
    //         "sInfoEmpty": "Mostrando un total de 0 registros",
    //         "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    //         "sInfoPostFix": "",
    //         "sSearch": "Buscar:",
    //         "sUrl": "",
    //         "sInfoThousands": ".",
    //         "sLoadingRecords": "Cargando...",
    //         "oPaginate": {
    //             "sFirst": "Primero",
    //             "sLast": "Último",
    //             "sNext": "Siguiente",
    //             "sPrevious": "Anterior"
    //         },
    //         "oAria": {
    //             "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
    //             "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    //         },
    //         "select" : {
    //             "rows" : {
    //                 "_" : "Has seleccionado %d filas",
    //                 "0" : "Click en una fila para seleccionar",
    //                 "1" : "Has seleccionado 1 fila"
    //             }
    //         }
    //     }
    // });

    // date1.addEventListener('change', function() {
    //     date2.min = this.value;
    // });	

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
                        <td hidden="true">${item.IDCICLO}</td>
                        <td>${ciclo}</td>
                        <td hidden="true"><a>Ver tareas</a></td>
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

    // $('#planificacion').on('hidden.bs.modal', function (e) {
    //     $('#inicial_plan').val('');
    //     $('#final_plan').val('');
    //     $('#tecnico').val('').trigger('change');
    //     $('#div_tecnico').hide();
    //     $('#crear_plan').prop('disabled', true);
    // });    

    // $('#verificar').on('click', function () {
    //     var fecha1 = $('#inicial_plan').val();
    //     var fecha2 = $('#final_plan').val();
    
    //     if (!fecha1 || !fecha2) {
    //         swal("Error", "Ingrese ambas fechas.", "error");
    //         return;
    //     }

    //     var filasSeleccionadas = table.rows({ selected: true }).data();
    //     var idsSeleccionados = filasSeleccionadas.toArray().map(function(row) {
    //         return row[0]; 
    //     });
    //     var fecha_inicial = $('#inicial_plan').val();
    //     var fecha_final = $('#final_plan').val();
        
    //     var data = {
    //         idsSeleccionados,
    //         fecha_inicial,
    //         fecha_final
    //     }
    
    //     $.ajax({
    //         url: '/verificar',
    //         type: 'POST',
    //         data: data,
    //         success: function(response) {
    //             if (response && response.length > 0) {
    //                 $('#tabla_verificar tbody').empty();
    
    //                 response.forEach(function(tarea) {

    //                     var fechaFormateada = new Date(tarea.FECHA).toLocaleDateString('es-ES', {
    //                         day: '2-digit',
    //                         month: '2-digit',
    //                         year: 'numeric'
    //                     });

    //                     var row = '<tr>' +
    //                         '<td>' + tarea.ID + '</td>' +
    //                         '<td>' + tarea.EQUIPO + '</td>' +
    //                         '<td>' + fechaFormateada + '</td>' +
    //                         '<td>' + tarea.ESTADO + '</td>' +
    //                         '<td>' + tarea.TECNICO + '</td>' +
    //                         '</tr>';
    //                     $('#tabla_verificar tbody').append(row);
    //                 });
    //             } 

    //             $('#verificar_tareas').modal('show');
    //         },
    //         error: function(error) {
    //             console.log('Error en la solicitud AJAX:', error);
    //         }
    //     });
    // });

    // $('#cancelar_ver').on('click', function () {
    //     $('#verificar_tareas').modal('hide');
    // });

    // $('#ir').on('click', function () {
    //     $('#crear_plan').prop('disabled', false);
    //     $('#div_tecnico').show();
    //     $('#verificar_tareas').modal('hide');
    // });

    $('#crear_plan').on('click', function () {

        const date1 = $('#date1').val();
        const ano1 = $('#ano1').val();
        const date2 = $('#date2').val();
        const ano2 = $('#ano2').val();
        const tecnico = $('#tecnico').val();
    
        if (!date1 || !ano1 || !date2 || !ano2) {
            swal("Error", "Ingrese ambas fechas y años.", "error");
            return;
        }

        const fecha1 = new Date(`${ano1}-${date1}`);
        const fecha2 = new Date(`${ano2}-${date2}`);

        if (fecha2 < fecha1) {
            swal("Error", "La primera fecha no puede ser mayor que la segunda.", "error");
            return;
        }

        if(!tecnico){
            swal("Error", "Debe seleccionar un técnico para planificar.", "error");
            return;
        }

        const filasSeleccionadas = table.rows({ selected: true }).data();
        const valoresColumnas = filasSeleccionadas.toArray().map(function(row) {
            return {
                ID:row[0],
                CICLO:row[7]
            }; 
        });
        
        const data = {
            date1,
            ano1,
            date2,
            ano2,
            tecnico,
            valoresColumnas
        }

        $.ajax({
            url: '/verificar_tareas',
            type: 'POST',
            data:data,
            beforeSend: function() {
                swal({
                    title: "Verificando",
                    text: "Espere un momento por favor...",
                    imageUrl: "/img/Spinner-1s-200px2.gif",
                    showConfirmButton: false,
                    allowOutsideClick: false
                });
            }
        }).done(function(response){
            if (response === "cuenta_positiva"){
                swal({
                    title: "Existen tareas en el periodo seleccionado",
                    text: "¿Desea continuar con la planificación?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "Si",
                    cancelButtonText: "No",
                    closeOnConfirm: false 
                }, function (isConfirm){
                    if(isConfirm){
                        $.ajax({
                        url: '/verificar_tareas1',
                        type: 'POST',
                        data:data,
                        beforeSend: function() {
                            swal({
                                title: "Verificando",
                                text: "Espere un momento por favor...",
                                imageUrl: "/img/Spinner-1s-200px2.gif",
                                showConfirmButton: false,
                                allowOutsideClick: false
                            });
                        }
                        }).done(function(response){
                            if(response === "positiva"){
                                swal({
                                    title: "Ya existen tareas para algunos equipos seleccionados en las fechas a planificar",
                                    text: "¿Desea continuar con la planificación?",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonClass: "btn-primary",
                                    confirmButtonText: "Si",
                                    cancelButtonText: "No",
                                    closeOnConfirm: false 
                                }, function (isConfirm){
                                    if(isConfirm){
                                        $.ajax({
                                            url: '/verificar_tareas2',
                                            type: 'POST',
                                            data:data,
                                            beforeSend: function() {
                                                swal({
                                                    title: "Verificando",
                                                    text: "Espere un momento por favor...",
                                                    imageUrl: "/img/Spinner-1s-200px2.gif",
                                                    showConfirmButton: false,
                                                    allowOutsideClick: false
                                                });
                                            }
                                        }).done(function(response){
                                            if(response ==="pasado"){
                                                swal({
                                                    title: "Ya existen las tareas maximas diarias para algunas fechas a planificar",
                                                    text: "¿Desea continuar con la planificación?",
                                                    type: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonClass: "btn-primary",
                                                    confirmButtonText: "Si",
                                                    cancelButtonText: "No",
                                                    closeOnConfirm: false 
                                                }, function(isConfirm){
                                                    if(isConfirm){
                                                        $.ajax({
                                                            url: '/crear_plan',
                                                            type: 'POST',
                                                            data:data,
                                                            beforeSend: function() {
                                                                swal({
                                                                    title: "Planificando",
                                                                    text: "Espere un momento por favor...",
                                                                    imageUrl: "/img/Spinner-1s-200px2.gif",
                                                                    showConfirmButton: false,
                                                                    allowOutsideClick: false
                                                                });
                                                            }
                                                        }).done(function (response) {
                                                            if (response === "ok") {
                                                                swal({
                                                                    title: "Tareas Creadas",
                                                                    type: "success",
                                                                    confirmButtonText: "Aceptar",
                                                                    allowOutsideClick: false
                                                                }, function (isConfirm) {
                                                                    if (isConfirm) {
                                                                        location.reload();
                                                                    }
                                                                });
                                                            } else {
                                                                swal("Error", "No se pudo crear las tareas", "error");
                                                            }
                                                        }).fail(function (jqXHR, textStatus, errorThrown) {
                                                            console.error("Error en la llamada AJAX:", textStatus, errorThrown);
                                                            swal("Error", "Hubo un problema al comunicarse con el servidor", "error");
                                                        }); 
                                                    }
                                                })

                                            }else if(response ==="no pasado"){
                                                $.ajax({
                                                    url: '/crear_plan',
                                                    type: 'POST',
                                                    data:data,
                                                    beforeSend: function() {
                                                        swal({
                                                            title: "Planificando",
                                                            text: "Espere un momento por favor...",
                                                            imageUrl: "/img/Spinner-1s-200px2.gif",
                                                            showConfirmButton: false,
                                                            allowOutsideClick: false
                                                        });
                                                    }
                                                }).done(function (response) {
                                                    if (response === "ok") {
                                                        swal({
                                                            title: "Tareas Creadas",
                                                            type: "success",
                                                            confirmButtonText: "Aceptar",
                                                            allowOutsideClick: false
                                                        }, function (isConfirm) {
                                                            if (isConfirm) {
                                                                location.reload();
                                                            }
                                                        });
                                                    } else {
                                                        swal("Error", "No se pudo crear las tareas", "error");
                                                    }
                                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                                    console.error("Error en la llamada AJAX:", textStatus, errorThrown);
                                                    swal("Error", "Hubo un problema al comunicarse con el servidor", "error");
                                                }); 
                                            }
                                        })
                                    }
                                })
                            }else if(response === "negativa"){
                                $.ajax({
                                    url: '/verificar_tareas2',
                                    type: 'POST',
                                    data:data,
                                    beforeSend: function() {
                                        swal({
                                            title: "Verificando",
                                            text: "Espere un momento por favor...",
                                            imageUrl: "/img/Spinner-1s-200px2.gif",
                                            showConfirmButton: false,
                                            allowOutsideClick: false
                                        });
                                    }
                                }).done(function(response){
                                    if(response ==="pasado"){
                                        swal({
                                            title: "Ya existen las tareas maximas diarias para algunas fechas a planificar",
                                            text: "¿Desea continuar con la planificación?",
                                            type: "warning",
                                            showCancelButton: true,
                                            confirmButtonClass: "btn-primary",
                                            confirmButtonText: "Si",
                                            cancelButtonText: "No",
                                            closeOnConfirm: false 
                                        }, function(isConfirm){
                                            if(isConfirm){
                                                $.ajax({
                                                    url: '/crear_plan',
                                                    type: 'POST',
                                                    data:data,
                                                    beforeSend: function() {
                                                        swal({
                                                            title: "Planificando",
                                                            text: "Espere un momento por favor...",
                                                            imageUrl: "/img/Spinner-1s-200px2.gif",
                                                            showConfirmButton: false,
                                                            allowOutsideClick: false
                                                        });
                                                    }
                                                }).done(function (response) {
                                                    if (response === "ok") {
                                                        swal({
                                                            title: "Tareas Creadas",
                                                            type: "success",
                                                            confirmButtonText: "Aceptar",
                                                            allowOutsideClick: false
                                                        }, function (isConfirm) {
                                                            if (isConfirm) {
                                                                location.reload();
                                                            }
                                                        });
                                                    } else {
                                                        swal("Error", "No se pudo crear las tareas", "error");
                                                    }
                                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                                    console.error("Error en la llamada AJAX:", textStatus, errorThrown);
                                                    swal("Error", "Hubo un problema al comunicarse con el servidor", "error");
                                                }); 
                                            }
                                        })

                                    }else if(response ==="no pasado"){
                                        $.ajax({
                                            url: '/crear_plan',
                                            type: 'POST',
                                            data:data,
                                            beforeSend: function() {
                                                swal({
                                                    title: "Planificando",
                                                    text: "Espere un momento por favor...",
                                                    imageUrl: "/img/Spinner-1s-200px2.gif",
                                                    showConfirmButton: false,
                                                    allowOutsideClick: false
                                                });
                                            }
                                        }) .done(function (response) {
                                            if (response === "ok") {
                                                swal({
                                                    title: "Tareas Creadas",
                                                    type: "success",
                                                    confirmButtonText: "Aceptar",
                                                    allowOutsideClick: false
                                                }, function (isConfirm) {
                                                    if (isConfirm) {
                                                        location.reload();
                                                    }
                                                });
                                            } else {
                                                swal("Error", "No se pudo crear las tareas", "error");
                                            }
                                        }).fail(function (jqXHR, textStatus, errorThrown) {
                                            console.error("Error en la llamada AJAX:", textStatus, errorThrown);
                                            swal("Error", "Hubo un problema al comunicarse con el servidor", "error");
                                        });
                                    }
                                })
                            }
                        });
                    }
                }
                );
            }else if(response === "cuenta_negativa"){
                $.ajax({
                    url: '/verificar_tareas1',
                    type: 'POST',
                    data:data,
                    beforeSend: function() {
                        swal({
                            title: "Verificando",
                            text: "Espere un momento por favor...",
                            imageUrl: "/img/Spinner-1s-200px2.gif",
                            showConfirmButton: false,
                            allowOutsideClick: false
                        });
                    }
                }).done(function(response){
                    if(response === "positiva"){
                        swal({
                            title: "Ya existen tareas para algunos equipos seleccionados en las fechas a planificar",
                            text: "¿Desea continuar con la planificación?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-primary",
                            confirmButtonText: "Si",
                            cancelButtonText: "No",
                            closeOnConfirm: false 
                        }, function (isConfirm){
                            if(isConfirm){
                                $.ajax({
                                    url: '/verificar_tareas2',
                                    type: 'POST',
                                    data:data,
                                    beforeSend: function() {
                                        swal({
                                            title: "Verificando",
                                            text: "Espere un momento por favor...",
                                            imageUrl: "/img/Spinner-1s-200px2.gif",
                                            showConfirmButton: false,
                                            allowOutsideClick: false
                                        });
                                    }
                                })
                            }
                        })
                    }else if(response === "negativa"){
                        $.ajax({
                            url: '/verificar_tareas2',
                            type: 'POST',
                            data:data,
                            beforeSend: function() {
                                swal({
                                    title: "Verificando",
                                    text: "Espere un momento por favor...",
                                    imageUrl: "/img/Spinner-1s-200px2.gif",
                                    showConfirmButton: false,
                                    allowOutsideClick: false
                                });
                            }
                        }).done(function(response){
                            if(response ==="pasado"){
                                swal({
                                    title: "Ya existen las tareas maximas diarias para algunas fechas a planificar",
                                    text: "¿Desea continuar con la planificación?",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonClass: "btn-primary",
                                    confirmButtonText: "Si",
                                    cancelButtonText: "No",
                                    closeOnConfirm: false 
                                }, function(isConfirm){
                                    if(isConfirm){
                                        $.ajax({
                                            url: '/crear_plan',
                                            type: 'POST',
                                            data:data,
                                            beforeSend: function() {
                                                swal({
                                                    title: "Planificando",
                                                    text: "Espere un momento por favor...",
                                                    imageUrl: "/img/Spinner-1s-200px2.gif",
                                                    showConfirmButton: false,
                                                    allowOutsideClick: false
                                                });
                                            }
                                        }) .done(function (response) {
                                            if (response === "ok") {
                                                swal({
                                                    title: "Tareas Creadas",
                                                    type: "success",
                                                    confirmButtonText: "Aceptar",
                                                    allowOutsideClick: false
                                                }, function (isConfirm) {
                                                    if (isConfirm) {
                                                        location.reload();
                                                    }
                                                });
                                            } else {
                                                swal("Error", "No se pudo crear las tareas", "error");
                                            }
                                        }).fail(function (jqXHR, textStatus, errorThrown) {
                                            console.error("Error en la llamada AJAX:", textStatus, errorThrown);
                                            swal("Error", "Hubo un problema al comunicarse con el servidor", "error");
                                        });
                                    }
                                })

                            }else if(response ==="no pasado"){
                                $.ajax({
                                    url: '/crear_plan',
                                    type: 'POST',
                                    data:data,
                                    beforeSend: function() {
                                        swal({
                                            title: "Planificando",
                                            text: "Espere un momento por favor...",
                                            imageUrl: "/img/Spinner-1s-200px2.gif",
                                            showConfirmButton: false,
                                            allowOutsideClick: false
                                        });
                                    }
                                }) .done(function (response) {
                                    if (response === "ok") {
                                        swal({
                                            title: "Tareas Creadas",
                                            type: "success",
                                            confirmButtonText: "Aceptar",
                                            allowOutsideClick: false
                                        }, function (isConfirm) {
                                            if (isConfirm) {
                                                location.reload();
                                            }
                                        });
                                    } else {
                                        swal("Error", "No se pudo crear las tareas", "error");
                                    }
                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                    console.error("Error en la llamada AJAX:", textStatus, errorThrown);
                                    swal("Error", "Hubo un problema al comunicarse con el servidor", "error");
                                });
                            }
                        })
                    }
                });
            }
        })
        
    });

});