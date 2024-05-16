var table1;

$(document).ready(function () {

    function initDataTable() {
        var checkTogglePressed = false;
      
        table1 = $('#tabla_prot').DataTable({
            "createdRow": function (row, data, dataIndex) {
                if (data[10] === "SOP") {
                    $('td:eq(10)', row).text("Sistema Operativo");
                } else if (data[10] === "SC") {
                    $('td:eq(10)', row).text("No Aplica");
                } else if (data[10] === "SSR") {
                    $('td:eq(10)', row).text("Sistema sin revisar");
                } else if (data[10] === "SOCO"){
                    $('td:eq(10)', row).text("Sist. operativo con obs.");
                } else if (data[10] === "SFS"){
                  $('td:eq(10)', row).text("Sist. fuera de serv.");
                } else if (data[10] === "SNO"){
                  $('td:eq(10)', row).text("Sist. no operativo");
                }
    
                if (data[15] === "SOP") {
                  $('td:eq(15)', row).text("Sistema Operativo");
                } else if (data[15] === "SC") {
                    $('td:eq(15)', row).text("No Aplica");
                } else if (data[15] === "SSR") {
                    $('td:eq(15)', row).text("Sistema sin revisar");
                } else if (data[15] === "SOCO"){
                    $('td:eq(15)', row).text("Sist. operativo con obs.");
                } else if (data[15] === "SFS"){
                  $('td:eq(15)', row).text("Sist. fuera de serv.");
                } else if (data[15] === "SNO"){
                  $('td:eq(15)', row).text("Sist. no operativo");
                }
    
                var cellText = $('td:eq(11)', row).text();
                var cellTextEA = $('td:eq(15)', row).text();
                var cellTextTA = $('td:eq(13)', row).text();
    
                if (!(data[10] == "SOP" || data[15] == "SOP" || data[15] == "")) {
                    var titleText = 'Estado del equipo anterior: '+'\n' + cellTextEA + '\n' + 
                    'Tarea anterior: ' + cellTextTA + '\n' +
                    'Fecha anterior: ' + data[14];
                    $('td:eq(11)', row).attr('title', titleText).html('<span class="alerta">⚠️</span> '+ cellText);
                }
              },
            "select": {
                "style": "multi"
            },
          "dom": 'Bf<"toolbar">rtip',
          "searching": true,
          "lengthChange": false,
          "colReorder": true,
          "buttons": [
            {
              "extend": "excelHtml5",
              "text": '<i class="fa fa-file-excel-o"></i>',
              "title": "TareasRechazadas",
              "titleAttr": "Exportar a Excel",
              "className": "btn btn-rounded btn-success",
              "exportOptions": {
                "columns": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,],
              },
              customize: function (xlsx) {
                const sheet = xlsx.xl.worksheets["sheet1.xml"];
                $("row:first c", sheet).attr("s", "47");
              },
            },
          ],
          initComplete: function () {
          $(".toolbar").html(`
                  <style>
                  #parentFilter, #infoFilter, #subInfoFilter {
                    float: left;
                    margin-left: 10px;
                  }
  
                  #parentSelect, #infoSelect, #subInfoSelect{
                    height: 38px;
                    width: 200px;
                    border: 1px solid rgb(227, 227, 227);
                    border-radius: 4px;
                  }
  
                  #clearFilters {
                    float: left;
                    margin-left: 10px;
                    height: 38px;
                    line-height: 36px;
                    padding: 0 12px;
                    cursor: pointer;
                  }
  
                  @media (max-width: 100px) {
                  #parentFilter,
                  #infoFilter,
                  #subInfoFilter {
                      float: none;
                      margin-left: 0;
                  }
  
                  #parentSelect,
                  #infoSelect,
                  #subInfoSelect {
                      width: 100%;
                  }
                  }
                  </style>			
                  <div>
                      <div id="parentFilter">
                          <select id="parentSelect" width: 50%;>
                          </select>
                      </div>
                      <div id="infoFilter">
                          <select id="infoSelect" width: 50%;>
                          </select>
                      </div>
                      <div id="subInfoFilter">
                          <select id="subInfoSelect" width: 50%;">
                          </select>
                      </div>
                      <button id="seleccionar" type="button" class="btn btn-inline btn-warning ladda-button">Seleccionar</i></button>
                      <button id="deseleccionar" type="button" class="btn btn-inline btn-warning ladda-button" hidden="true">Anular selección</i></button>
                      <button id="clearFilters" type="button" class="btn btn-inline btn-danger btn-sm ladda-button"><i class="fa fa-filter"></i></button>
                  </div>
                `);
          },
          "bDestroy": true,
          "scrollX": true,
          "bInfo": true,
          "iDisplayLength": 15,
          "autoWidth": false,
          "language": {
              "sProcessing": "Procesando...",
              "sLengthMenu": "Mostrar _MENU_ registros",
              "sZeroRecords": "No se encontraron resultados",
              "sEmptyTable": "Sin infomación",
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
  
        }).on("select.dt deselect.dt", function (e, dt, type, indexes) {
          var count = table1.rows({ selected: true }).count();
          if (!checkTogglePressed) {
            if (count > 0) {
              $("#pdfs").prop("disabled", false);
            } else {
              $("#pdfs").prop("disabled", true);
            }
    
            if (count === 1) {
              $("#pdfs1").prop("hidden", false);
              $("#pdfs").prop("hidden", true);
            } else if (count > 1) {
              $("#pdfs").prop("hidden", false);
              $("#pdfs1").prop("hidden", true);
            } else {
              $("#pdfs").prop("hidden", true);
              $("#pdfs1").prop("hidden", true);
            }
          }
        }).columns.adjust();
  
        $('#parentSelect').append('<option value="" selected disabled>Seleccione una gerencia</option>');
        $('#infoSelect').append('<option value="" selected disabled>Seleccione un área</option>');
        $('#subInfoSelect').append('<option value="" selected disabled>Seleccione un sector</option>');
        
        table1.column(5).data().unique().sort().each(function(value, index) {
          $('#parentSelect').append(
          '<option value="' + value + '">' + value + '</option>');
        });
  
        $('#parentSelect').on('change', function(e) {
          var selectedValue = $(this).val();
          table1.column(5).search(selectedValue).draw();
  
          $('#infoSelect').empty();
          $('#infoSelect').append('<option value="" selected disabled>Seleccione un área</option>');
          table1.column(6, {search: 'applied'}).data().unique().sort().each(function(value, index) {
              $('#infoSelect').append('<option value="' + value + '">' + value + '</option>');
          });
        });
  
        $('#infoSelect').on('change', function(e) {
          var selectedParentValue = $('#parentSelect').val();
          var selectedInfoValue = $(this).val(); 
      
          table1.column(5).search(selectedParentValue).column(6).search(selectedInfoValue).draw();
      
          $('#subInfoSelect').empty(); 
          $('#subInfoSelect').append('<option value="" selected disabled>Seleccione un sector</option>');
          table1.column(7, {search: 'applied'}).data().unique().sort().each(function(value, index) {
              $('#subInfoSelect').append('<option value="' + value + '">' + value + '</option>');
          });
        });
  
        $('#subInfoSelect').on('change', function(e) {
          var selectedParentValue = $('#parentSelect').val();
          var selectedInfoValue = $('#infoSelect').val(); 
          var selectedSubInfoValue = $(this).val();
  
          table1.column(5).search(selectedParentValue);
          table1.column(6).search(selectedInfoValue);
          table1.column(7).search("^" + selectedSubInfoValue + "$", true, false);
  
          table1.draw();
        });
  
        $('#clearFilters').on('click', function() {
          $('#parentSelect').empty();
          $('#parentSelect').append('<option value="" selected disabled>Seleccione una gerencia</option>');
          table1.column(5).data().unique().sort().each(function(value, index) {
            $('#parentSelect').append(
            '<option value="' + value + '">' + value + '</option>');
          });
          $('#infoSelect').empty();
          $('#infoSelect').append('<option value="" selected disabled>Seleccione un área</option>');
          $('#subInfoSelect').empty(); 
          $('#subInfoSelect').append('<option value="" selected disabled>Seleccione un sector</option>');
          table1.search('').columns().search('').draw();
          return false;
        });
  
        table1.on('user-select', function (e, dt, type, cell, originalEvent) {
            var rowIndex = cell.index().row;
            var rowData = table1.row(rowIndex).data();
            
            if (rowData[18] === "") {
                e.preventDefault();
            }
        });
  
        var filasSeleccionadasPorSeleccionar = []; 
  
        $('#seleccionar').on('click', function () {
            var filasSeleccionadasPorSeleccionar = table1.rows(function (idx, data, node) {
                return data[18] !== "";
            }).indexes(); 
            
            var filasFiltradasSeleccionadas = table1.rows({ search: 'applied' }).indexes().filter(function(index) {
                return filasSeleccionadasPorSeleccionar.indexOf(index) !== -1;
            });
            
            table1.rows(filasFiltradasSeleccionadas).select();
        
            $('#seleccionar').prop('hidden', true);
            $('#deseleccionar').prop('hidden', false);
        });
        
        $('#deseleccionar').on('click', function () {
            var filasSeleccionadasPorSeleccionar = table1.rows(function (idx, data, node) {
                return data[18] !== "";
            }).indexes(); 
            
            var filasFiltradasSeleccionadas = table1.rows({ search: 'applied' }).indexes().filter(function(index) {
                return filasSeleccionadasPorSeleccionar.indexOf(index) !== -1;
            });
            
            table1.rows(filasFiltradasSeleccionadas).deselect();
  
            $('#seleccionar').prop('hidden', false);
            $('#deseleccionar').prop('hidden', true);
        });     
    }
    
    initDataTable(); 

    $("#mensaje").on("click", function () {

        var fechaActual = new Date();
        var dia = fechaActual.getDate(); 
        var mes = fechaActual.getMonth() + 1; 
        var ano = fechaActual.getFullYear();
        var date = dia + "-" + mes + "-" + ano;

        var idt= [];

        var data = table1.rows({selected: true}).nodes();

        if(!data.length){
            swal("Error", "Debe seleccionar al menos una fila","error");
            return;
        }

        $.each(data, function (index, value) {
            var rowData = [];
            var valor0 = table1.row(value).data()[0]; 
            var valor13 = table1.row(value).data()[16]; 
            var obs = $(value).find("td").eq(17).find("input").val(); 
            rowData.push(valor0);
            rowData.push(valor13 + " " + date + " OBS: " + obs + " |"); 
            idt.push(rowData); 
        });

        swal({
            title: "¡SAPMA!",
            text: "¿Desea agregar observación?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false      
            }, function(isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url: "/mensajerech",
                        type: "POST", 	 	
                        data: {
                            idt                            
                        },
                        beforeSend: function() {
                            swal({
                            title: "Agregado comentarios",
                            text: "Espere un momento por favor...",
                            imageUrl:"/img/Spinner-1s-200px2.gif",
                            showConfirmButton: false,
                            allowOutsideClick: false
                            });
                        }
                        }).done(function (data) {
                            swal({
                                title: "¡SAPMA!",
                                text: "Comentarios agregados",
                                type: "success",
                                confirmButtonText: "Aceptar",
                                allowOutsideClick: false
                            });	
                            setTimeout(function () {
                                location.reload();
                            }, 1000);				
                    });
                } else {
                    swal("¡SAPMA!", "Observación descartada", "error");
                }
            }
                    
        );		
    });

    $("#aprob").on("click", function () {

        var fechaActual = new Date();
        var dia = fechaActual.getDate(); 
        var mes = fechaActual.getMonth() + 1; 
        var ano = fechaActual.getFullYear();
        var date = dia + "-" + mes + "-" + ano;

        var idt= [];

        var data = table1.rows({selected: true}).nodes();

        if(!data.length){
            swal("Error", "Debe seleccionar al menos una fila para aprobar","error");
            return;
        }

        $.each(data, function (index, value) {
            var rowData = [];
            var valor0 = table1.row(value).data()[0]; 
            var valor13 = table1.row(value).data()[16]; 
            var obs = $(value).find("td").eq(17).find("input").val(); 
            rowData.push(valor0);
            rowData.push(valor13 + " " + date + " OBS: " + obs + " |"); 
            idt.push(rowData); 
        });

        swal({
            title: "¡SAPMA!",
            text: "¿Desea aprobar estas tareas?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false      
            }, function(isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url: "/aprorech",
                        type: "POST", 	 	
                        data: {
                            idt           
                        },
                        beforeSend: function() {
                            swal({
                            title: "Aprobando",
                            text: "Espere un momento por favor...",
                            imageUrl:"/img/Spinner-1s-200px2.gif",
                            showConfirmButton: false,
                            allowOutsideClick: false
                            });
                        }
                        }).done(function (data) {
                        swal({
                            title: "¡SAPMA!",
                            text: "Tareas aprobadas",
                            type: "success",
                            confirmButtonText: "Aceptar",
                            allowOutsideClick: false
                        });	
                        setTimeout(function () {
                            location.reload();
                        }, 1000);	                        
                    }); 
                } else {
                    swal("¡SAPMA!", "Tareas no aprobadas", "error");
                }
            }
            
        );		
    });

    $("#pdfs").on("click", function () {
        var rows_selected = table1.rows({selected: true}).data();
        var idpdf = [];
        var codigo = [];
        $.each(rows_selected, function (index, value) {
            idpdf.push(value[0]);
        });
  
        $.each(rows_selected, function (index, value) {
            codigo.push(value[4]);
        });
  
        $.ajax({
          url: "/pdfs",
          type: "POST",
          data: {
              idpdf,
              codigo
          },
          beforeSend: function() {
              swal({
              title: "Generando PDFs",
              text: "Espere un momento por favor...",
              imageUrl:"/img/Spinner-1s-200px2.gif",
              showConfirmButton: false,
              allowOutsideClick: false
              });
          }
        }).done(function (data) {
          swal({
              title: "PDFs Generados",
              text: "Se han agregado los PDFs a un archivo comprimido",
              type: "success",
              confirmButtonText: "Aceptar",
              allowOutsideClick: false
          }, function (isConfirm) {
              if (isConfirm) {
                window.location.href = "/archivo";
              }
          });
        });
    });
  
    $("#pdfs1").on("click", function () {
        var rows_selected = table1.rows({selected: true}).data();
        var idpdf = [];
        var codigo= [];
        $.each(rows_selected, function (index, value) {
            idpdf.push(value[0]);
        });

        $.each(rows_selected, function (index, value) {
            codigo.push(value[4]);
        });
        window.location.href = "/archivo/" + idpdf + "/" + codigo;		
    });
});

// $(document).ready(function () {
//     table = $('#tabla_prot').DataTable({
//         'columnDefs': [
//             {
//                 'targets': 0,
//                 'checkboxes': {
//                     'selectRow': true
//                 }
//             }, 
//             { 
//                 "targets": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], 
//                 "className": "miClase" 
//             },
//             { 	
//                 "width": "60px", 
//                 "targets": 2 
//             },
//             { 	
//                 "width": "130px", 
//                 "targets": 5 
//             },
//             { 	
//                 "width": "200px", 
//                 "targets": 13 
//             }
//         ],
//         'select': {
//             'style': 'multi'
//         },
//         "dom": 'Bf<"filters">rtip',
//         "searching": true,
//         "lengthChange": false,
//         "colReorder": true,
//         "buttons": [
//         {
//             "extend": 'excelHtml5',
//             "text": '<i class="fa fa-file-excel-o"></i>',
//             "title": 'SAPMA',
//             "titleAttr": 'Exportar a Excel',
//             "className": 'btn btn-rounded btn-success',
//             "exportOptions": {
//             "columns": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13]
//             },
//             customize: function(xlsx) {
//             const sheet = xlsx.xl.worksheets['sheet1.xml'];
//                 $('row:first c', sheet).attr('s', '47');
//             }
//         }],
//         initComplete: function() {
//         $('.filters').html(`
//             <style>
//             #parentFilter {
//             float: left;
//             margin-left: 15px;
//             }

//             #parentSelect {
//             height: 38px;
//             width: 100%;
//             border: 1px solid rgb(227, 227, 227);
//             border-radius: 4px;
//             }

//             #infoFilter {
//             float: left;
//             margin-left: 15px;
//             }

//             #infoSelect {
//             height: 38px;
//             width: 100%;
//             border: 1px solid rgb(227, 227, 227);
//             border-radius: 4px;
//             }

//             #subInfoFilter {
//             float: left;
//             margin-left: 15px;
//             }

//             #subInfoSelect {
//             height: 38px;
//             width: 100%;
//             border: 1px solid rgb(227, 227, 227);
//             border-radius: 4px;
//             }

//             @media (max-width: 768px) {
//             #parentFilter,
//             #infoFilter,
//             #subInfoFilter {
//                 float: none;
//                 margin-left: 0;
//             }

//             #parentSelect,
//             #infoSelect,
//             #subInfoSelect {
//                 width: 100%;
//             }
//             </style>			
//             <div>
//                 <div id="parentFilter">
//                     <select id="parentSelect" width: 50%;>
//                     </select>
//                 </div>
//                 <div id="infoFilter">
//                     <select id="infoSelect" width: 50%;>
//                     </select>
//                 </div>
//                 <div id="subInfoFilter">
//                     <select id="subInfoSelect" width: 50%;">
//                     </select>
//                 </div>
//             </div>
//         `);
//         },
//         "bDestroy": true, 	
//         "scrollX": true,
//         "bInfo": true,
//         "fixedColumns":   {
//             "leftColumns": 6//Le indico que deje fijas solo las 2 primeras columnas
//         },
//         "iDisplayLength": 20,
//         "autoWidth": true,
//         "language": {
//             "sProcessing": "Procesando...",
//             "sLengthMenu": "Mostrar _MENU_ registros",
//             "sZeroRecords": "No se encontraron resultados",
//             "sEmptyTable": "Ningún dato disponible en esta tabla",
//             "sInfo": "Mostrando un total de _TOTAL_ registros",
//             "sInfoEmpty": "Mostrando un total de 0 registros",
//             "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
//             "sInfoPostFix": "",
//             "sSearch": "Buscar:",
//             "sUrl": "",
//             "sInfoThousands": ".",
//             "sLoadingRecords": "Cargando...",
//             "oPaginate": {
//                 "sFirst": "Primero",
//                 "sLast": "Último",
//                 "sNext": "Siguiente",
//                 "sPrevious": "Anterior"
//             },
//             "oAria": {
//                 "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
//                 "sSortDescending": ": Activar para ordenar la columna de manera descendente"
//             },
//             "select" : {
//                 "rows" : {
//                     "_" : "Has seleccionado %d filas",
//                     "0" : "Click en una fila para seleccionar",
//                     "1" : "Has seleccionado 1 fila"
//                 }
//             }
//         },
//     }).on( 'select.dt deselect.dt', function ( e, dt, type, indexes ) {	
//         var count = table.rows( { selected: true } ).count();
//         if (count > 0) {
//              $('#aprob').prop('disabled', false);
//              $('#aprobb').prop('disabled', false);
//              $('#aproba').prop('disabled', false);
//              $('#aprobd').prop('disabled', false);
//              $('#aprobe').prop('disabled', false);
//              $('#rechazo').prop('disabled', false);
//         } else {
//              $('#aprob').prop('disabled', true);
//              $('#aprobb').prop('disabled', true);
//              $('#aproba').prop('disabled', true);
//              $('#aprobd').prop('disabled', true);
//                 $('#aprobe').prop('disabled', true);
//              $('#rechazo').prop('disabled', true);
//         }

//         if (count === 1) {
//             $("#pdfs1").prop("hidden", false);
//             $("#pdfs").prop("hidden", true);
//         } else if (count > 1) {
//             $("#pdfs").prop("hidden", false);
//             $("#pdfs1").prop("hidden", true);
//         } else {
//             $("#pdfs").prop("hidden", true);
//             $("#pdfs1").prop("hidden", true);
//         }
//     }).columns.adjust();

//     var parentValues = table.column(6).data().unique();
//     parentValues.sort();
//     $('#parentFilter select').append('<option value="">Seleccione una gerencia</option>');
//     parentValues.each(function(value) {
//         $('#parentFilter select').append('<option value="' + value + '">' + value + '</option>');
//         table.on('draw.dt', function() {
//             table.rows().deselect();
//         });
//     });
//     $('#parentFilter select').on('change', function() {
//         var selectedParent = $(this).val();
//         if (!selectedParent) {
//             table.search('').columns().search('').draw();
//             $('#infoFilter select').empty();
//             $('#subInfoFilter select').empty();
//             return;
//         }
//         table.column(6).search(selectedParent).draw();
//         $('#infoFilter select').empty();
//         $('#subInfoFilter select').empty();
//         var infoValues = table
//             .column(7)
//             .data()
//             .filter(function(value, index) {
//                 return table.column(6).data()[index] === selectedParent;
//             })
//             .unique();
//         infoValues.sort();
//         $('#infoFilter select').append('<option value="">Selecciones un área</option>');
//         infoValues.each(function(value) {
//             $('#infoFilter select').append('<option value="' + value + '">' + value + '</option>');
//         });
//         table.on('draw.dt', function() {
//             table.rows().deselect();
//         });
//     });
//     $('#infoFilter select').on('change', function() {
//         var selectedInfo = $(this).val();
//         if (!selectedInfo) {
//             table.column(6).search($('#parentFilter select').val()).draw();
//             $('#subInfoFilter select').empty();
//             return;
//         }
//         table.column(7).search(selectedInfo).draw();
//         $('#subInfoFilter select').empty();
//         var subInfoValues = table
//             .column(8)
//             .data()
//             .filter(function(value, index) {
//                 return (
//                     table.column(6).data()[index] === $('#parentFilter select').val() &&
//                     table.column(7).data()[index] === selectedInfo
//                 );
//             })
//             .unique();
//         subInfoValues.sort();				
//         subInfoValues.each(function(value) {
//             $('#subInfoFilter select').append('<option value="' + value + '">' + value + '</option>');
//         });
//         table.on('draw.dt', function() {
//             table.rows().deselect();
//         });
//     });
//     $('#subInfoFilter select').on('change', function() {
//         var selectedSubInfo = $(this).val();
//         if (!selectedSubInfo) {
//             table.column(7).search($('#infoFilter select').val()).draw();
//             return;
//         }
//         table.column(8).search(selectedSubInfo).draw();
//         table.on('draw.dt', function() {
//             table.rows().deselect();
//         });
//     });	

//     $("#aprob").on("click", function () {
//         var idt = [];
//         var obsd = [];
//         var idtobs = []; 
//         var data1 = table.rows({selected: true}).data();
//         $.each(data1, function (index, value) {
//             idt.push(value[0]);
//         });

//         $.each(data1, function (index, value) {
//             idtobs.push(value[14]);
//         });

//         var data = table.rows({selected: true}).nodes();
//         $.each(data, function (index, value) {
//             var obs = $(value).find("td").eq(15).find("input").val();
//             obsd.push(obs);
//         });
//         swal({
//         title: "¡SAPMA!",
//         text: "¿Desea aprobar estas tareas?",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonClass: "btn-primary",
//         confirmButtonText: "Si",
//         cancelButtonText: "No",
//         closeOnConfirm: false      
//             }, function(isConfirm) {
//                 if (isConfirm) {
//                     $.ajax({
//                         url: "/aprorech",
//                         type: "POST", 	 	
//                         data: {
//                             idt,
//                             obsd,
//                             idtobs
                            
//                         }
                        
//                     }); 
//                     swal("¡SAPMA!", "Tareas aprobadas", "success");
//                     setTimeout(function () {
//                         location.reload();
//                     }, 1000);
//                 } else {
//                     swal("¡SAPMA!", "Tareas no aprobadas", "error");
//                 }
//             }
            
//         );		
//     });

//     $("#aprobb").on("click", function () {
//         var idt = [];
//         var obsd = [];
//         var idtobs = []; 
//         var data1 = table.rows({selected: true}).data();
//         $.each(data1, function (index, value) {
//             idt.push(value[0]);
//         });

//         $.each(data1, function (index, value) {
//             idtobs.push(value[14]);
//         });

//         var data = table.rows({selected: true}).nodes();
//         $.each(data, function (index, value) {
//             var obs = $(value).find("td").eq(15).find("input").val();
//             obsd.push(obs);
//         });
//         swal({
//         title: "¡SAPMA!",
//         text: "¿Desea aprobar estas tareas?",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonClass: "btn-primary",
//         confirmButtonText: "Si",
//         cancelButtonText: "No",
//         closeOnConfirm: false      
//             }, function(isConfirm) {
//                 if (isConfirm) {
//                     $.ajax({
//                         url: "/aprorechb",
//                         type: "POST", 	 	
//                         data: {
//                             idt,
//                             obsd,
//                             idtobs
                            
//                         }
                        
//                     }); 
//                     swal("¡SAPMA!", "Tareas aprobadas", "success");
//                     setTimeout(function () {
//                         location.reload();
//                     }, 1000);
//                 } else {
//                     swal("¡SAPMA!", "Tareas no aprobadas", "error");
//                 }
//             }
            
//         );		
//     });

//     $("#aproba").on("click", function () {
//         var idt = [];
//         var obsd = [];
//         var idtobs = []; 
//         var data1 = table.rows({selected: true}).data();
//         $.each(data1, function (index, value) {
//             idt.push(value[0]);
//         });

//         $.each(data1, function (index, value) {
//             idtobs.push(value[14]);
//         });

//         var data = table.rows({selected: true}).nodes();
//         $.each(data, function (index, value) {
//             var obs = $(value).find("td").eq(15).find("input").val();
//             obsd.push(obs);
//         });
//         swal({
//         title: "¡SAPMA!",
//         text: "¿Desea aprobar estas tareas?",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonClass: "btn-primary",
//         confirmButtonText: "Si",
//         cancelButtonText: "No",
//         closeOnConfirm: false      
//             }, function(isConfirm) {
//                 if (isConfirm) {
//                     $.ajax({
//                         url: "/aprorecha",
//                         type: "POST", 	 	
//                         data: {
//                             idt,
//                             obsd,
//                             idtobs
                            
//                         }
                        
//                     }); 
//                     swal("¡SAPMA!", "Tareas aprobadas", "success");
//                     setTimeout(function () {
//                         location.reload();
//                     }, 1000);
//                 } else {
//                     swal("¡SAPMA!", "Tareas no aprobadas", "error");
//                 }
//             }
            
//         );		
//     });

//     $("#aprobd").on("click", function () {
//         var idt = [];
//         var obsd = [];
//         var idtobs = []; 
//         var data1 = table.rows({selected: true}).data();
//         $.each(data1, function (index, value) {
//             idt.push(value[0]);
//         });

//         $.each(data1, function (index, value) {
//             idtobs.push(value[14]);
//         });

//         var data = table.rows({selected: true}).nodes();
//         $.each(data, function (index, value) {
//             var obs = $(value).find("td").eq(15).find("input").val();
//             obsd.push(obs);
//         });
//         swal({
//         title: "¡SAPMA!",
//         text: "¿Desea aprobar estas tareas?",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonClass: "btn-primary",
//         confirmButtonText: "Si",
//         cancelButtonText: "No",
//         closeOnConfirm: false      
//             }, function(isConfirm) {
//                 if (isConfirm) {
//                     $.ajax({
//                         url: "/aprorechd",
//                         type: "POST", 	 	
//                         data: {
//                             idt,
//                             obsd,
//                             idtobs
                            
//                         }
                        
//                     }); 
//                     swal("¡SAPMA!", "Tareas aprobadas", "success");
//                     setTimeout(function () {
//                         location.reload();
//                     }, 1000);
//                 } else {
//                     swal("¡SAPMA!", "Tareas no aprobadas", "error");
//                 }
//             }
            
//         );		
//     });

//     $("#aprobe").on("click", function () {
//         var idt = [];
//         var obsd = [];
//         var idtobs = []; 
//         var data1 = table.rows({selected: true}).data();
//         $.each(data1, function (index, value) {
//             idt.push(value[0]);
//         });

//         $.each(data1, function (index, value) {
//             idtobs.push(value[14]);
//         });

//         var data = table.rows({selected: true}).nodes();
//         $.each(data, function (index, value) {
//             var obs = $(value).find("td").eq(15).find("input").val();
//             obsd.push(obs);
//         });
//         swal({
//         title: "¡SAPMA!",
//         text: "¿Desea aprobar estas tareas?",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonClass: "btn-primary",
//         confirmButtonText: "Si",
//         cancelButtonText: "No",
//         closeOnConfirm: false      
//             }, function(isConfirm) {
//                 if (isConfirm) {
//                     $.ajax({
//                         url: "/aproreche",
//                         type: "POST", 	 	
//                         data: {
//                             idt,
//                             obsd,
//                             idtobs
                            
//                         }
                        
//                     }); 
//                     swal("¡SAPMA!", "Tareas aprobadas", "success");
//                     setTimeout(function () {
//                         location.reload();
//                     }, 1000);
//                 } else {
//                     swal("¡SAPMA!", "Tareas no aprobadas", "error");
//                 }
//             }
            
//         );		
//     });

//     $("#rechazo").on("click", function () {
//         var idt = [];
//         var idtobs = []; 
//         var obsd = [];
//         var data1 = table.rows({selected: true}).data();
//         $.each(data1, function (index, value) {
//             idt.push(value[0]);
//         });

//         $.each(data1, function (index, value) {
//             idtobs.push(value[14]);
//         });

//         var data = table.rows({selected: true}).nodes();
//         $.each(data, function (index, value) {
//             var obs = $(value).find("td").eq(15).find("input").val();
//             obsd.push(obs);
//         });
//         swal({
//         title: "¡SAPMA!",
//         text: "¿Desea agregar observación?",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonClass: "btn-primary",
//         confirmButtonText: "Si",
//         cancelButtonText: "No",
//         closeOnConfirm: false      
//             }, function(isConfirm) {
//                 if (isConfirm) {
//                     $.ajax({
//                         url: "/mensajerech",
//                         type: "POST", 	 	
//                         data: {
//                             idt,
//                             obsd,
//                             idtobs
                            
//                         }		
//                     });
//                     swal("¡SAPMA!", "observación agregada", "success");
//                     setTimeout(function () {
//                         location.reload();
//                     }, 1000);
//                 } else {
//                     swal("¡SAPMA!", "observación descartada", "error");
//                 }
//             }
            
//         );		


//     });
//     $("#pdfs").on("click", function () {
//         var rows_selected = table.rows({selected: true}).data();
//         var idpdf = [];
//         var codigo = [];
//         $.each(rows_selected, function (index, value) {
//             idpdf.push(value[0]);
//         });

//         $.each(rows_selected, function (index, value) {
//             codigo.push(value[5]);
//         });

//         $.ajax({
//             url: "/pdfs",
//             type: "POST",
//             data: {
//                 idpdf,
//                 codigo
//             },
//             beforeSend: function() {
//                 swal({
//                 title: "Generando PDFs",
//                 text: "Espere un momento por favor...",
//                 imageUrl:"/img/Spinner-1s-200px2.gif",
//                 showConfirmButton: false,
//                 allowOutsideClick: false
//                 });
//             }
//             }).done(function (data) {
//             swal({
//                 title: "PDFs Generados",
//                 text: "Se han agregado los PDFs a un archivo comprimido",
//                 type: "success",
//                 confirmButtonText: "Aceptar",
//                 allowOutsideClick: false
//             }, function (isConfirm) {
//                 if (isConfirm) {
//                 window.location.href = "/archivo";
//                 }
//             });
//             });

//         });
//     $("#pdfs1").on("click", function () {
//         var rows_selected = table.rows({selected: true}).data();
//         var idpdf = [];
//         var codigo= [];
//         $.each(rows_selected, function (index, value) {
//             idpdf.push(value[0]);
//         });

//         $.each(rows_selected, function (index, value) {
//             codigo.push(value[5]);
//         });
//             window.location.href = "/archivo/" + idpdf + "/" + codigo;		
//     });
        

// });
