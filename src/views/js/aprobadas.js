
var table1;
$(document).ready(function () {

    var date1 = document.querySelector('#date1');
    var date2 = document.querySelector('#date2');
    date1.addEventListener('change', function() {
        date2.min = this.value;
    });	

    function initDataTable() {
        var checkTogglePressed = false;
      
        table1 = $('#tabla_prot').DataTable({
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
              "title": "Tareas",
              "titleAttr": "Exportar a Excel",
              "className": "btn btn-rounded btn-success",
              "exportOptions": {
                "columns": [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13],
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
                      <button id="seleccionar" type="button" class="btn btn-inline btn-secondary ladda-button">Seleccionar todo</i></button>
                      <button id="clearFilters" type="button" class="btn btn-inline btn-danger btn-sm ladda-button"><i class="fa fa-filter"></i></button>
                  </div>
                `);
          },
          "bDestroy": true,
          "scrollX": true,
          "bInfo": true,
          "iDisplayLength": 10,
          "autoWidth": true,
          "fixedColumns":   {
            "leftColumns": 5//Le indico que deje fijas solo las 2 primeras columnas
          },
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

        var rowsSelectable = false;

        table1.on("select", function (e, dt, type, indexes) {
          if (type === "row" && !rowsSelectable) {
            var data = table1.rows(indexes).data().toArray();
            if (data[0][10] === "" ) {
              table1.rows(indexes).deselect();
            }
          }
        });
  
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
  
        $('#seleccionar').on('click', function () {
          if ($(this).text() === 'Borrar selección') {
              table1.rows().deselect(); 
              $(this).text('Seleccionar todo');
          } else {
              table1.rows().deselect(); 
      
              table1.rows({ search: 'applied' }).every(function (rowIdx, tableLoop, rowLoop) {
                  var rowData = this.data();
                  var columna8 = rowData[7]; 
      
                  if (columna8.trim() !== '') { 
                      this.select(); 
                  }
              });
      
              $(this).text('Borrar selección');
          }
      });      
      
    }
  
    initDataTable(); 

    $('#filt').on('click', function() {

        var date1 = $('#date1').val();
        var date2 = $('#date2').val();
        var tarea = $('#tarea').val();

        if ((tarea && (date1 || date2)) || (date1 && date2 && tarea)) {
            swal("Error", "No puede enviar dates y tarea.", "error");
            return;
        }

        if (!date1 && !date2 && !tarea) {
            swal("Error", "Seleccione un rango de fechas o ingrese una tarea.", "error");
            return;
        }

        if ((!date1 && date2) || (date1 && !date2)) {
            swal("Error", "Seleccione ambas fechas.", "error");
            return;
        }

        var data = {
          date1,
          date2,
          tarea
        }
    
        swal({
            title: "Cargando",
            text: "Espere un momento por favor...",
            imageUrl: "/img/Spinner-1s-200px2.gif",
            showConfirmButton: false,
            allowOutsideClick: false
        });
    
        $.ajax({
          url: '/aprobadas',
          type:'POST',
          data:data
        }).done(function(data){

          swal.close();
    
          if ($.fn.DataTable.isDataTable('#tabla_prot')) {
              table1.clear().destroy();
          }
    
          $('#tabla_prot tbody').empty();
    
          data.forEach(function (item) {
            $('#tabla_prot tbody').append(`
                <tr>
                    <td>${item.TAREA}</td>
                    <td>${item.FECHA}</td>
                    <td>${item.ESTADO_TAREA}</td>
                    <td>${item.SERVICIO}</td>
                    <td>${item.CODIGO}</td>
                    <td>${item.GERENCIA}</td>
                    <td>${item.AREA}</td>
                    <td>${item.SECTOR}</td>
                    <td>${item.DETALLE}</td>
                    <td>${item.TECNICA === null ? '': item.TECNICA}</td>
                    <td>${item.ESTADO_EQUIPO === null ? '': item.ESTADO_EQUIPO}</td>
                    <td>${item.OBS_EQUIPO === null ? '': item.OBS_EQUIPO}</td>
                    <td>${item.REPUESTOS === null ? '': item.REPUESTOS}</td>
                    <td>${item.OBS}</td>
                    <td>
                        ${item.ESTADO_EQUIPO !== null ? 
                        `<center><a href="/protocolo/${item.TAREA}" class="btn btn-inline btn-primary btn-sm ladda-button" target="_blank"><i class="fa fa-file-archive-o"></i></a></center>` : ''}
                    </td>
                </tr>
            `);
    
          });
        
          initDataTable();
    
        });

        $('#date1').val('');
        $('#date2').val('');
        $('#tarea').val('');
    
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