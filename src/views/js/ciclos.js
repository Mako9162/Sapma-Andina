function actualizarOpciones() {
  // Limpiar las opciones actuales
  $('#opciones-adicionales').empty();
  $('#otras-opciones-adicionales').empty();

  // Iterar sobre los checkboxes seleccionados
  $('.ttarea-checkbox:checked').each(function () {
      var label = $("label[for='" + $(this).attr('id') + "']").text(); // Obtener el contenido de la etiqueta asociada al checkbox

      // Agregar el título con el contenido de la etiqueta
      $('#opciones-adicionales').append('<label class="form-label">' + label + '</label>');

      // Agregar checkboxes para las opciones "Diario", "Semanal", "Mensual", y "Anual"
      var opciones = ["Diario", "Semanal", "Mensual", "Anual"];
      opciones.forEach(function (opcion) {
          $('#opciones-adicionales').append(
              '<div class="checkbox-bird green">' +
              '<input type="checkbox" name="' + label + '-opciones" id="' + label + '-' + opcion + '" value="' + opcion + '" class="ttarea-checkbox">' +
              '<label for="' + label + '-' + opcion + '">' + opcion + '</label>' +
              '</div>'
          );
      });

      // Manejar el cambio en los checkboxes adicionales
      $('input[name="' + label + '-opciones"]').change(function () {
          // Desmarcar los otros checkboxes dentro del mismo grupo
          $('input[name="' + label + '-opciones"]').not(this).prop('checked', false);

          // Limpiar las opciones adicionales
          $('#otras-opciones-adicionales').empty();

          // Verificar la opción seleccionada y cargar opciones adicionales según sea necesario
          var opcionSeleccionada = $(this).val();
          if (opcionSeleccionada === "Diario") {
              // Opción "Diario" seleccionada, agregar las opciones correspondientes
              $('#otras-opciones-adicionales').append(
                  '<label class="form-label">Seleccione una opción:</label>' +
                  '<div class="checkbox-bird green">' +
                  '<input type="checkbox" id="' + label + '-todos-los-dias" value="Todos los días" class="ttarea-checkbox">' +
                  '<label for="' + label + '-todos-los-dias">Todos los días</label>' +
                  '</div>' +
                  '<div class="checkbox-bird green">' +
                  '<input type="checkbox" id="' + label + '-cada-n-dias" value="Cada n días" class="ttarea-checkbox">' +
                  '<label for="' + label + '-cada-n-dias">Cada <input type="number" id="' + label + '-cada-n-dias-input" min="1"> días</label>' +
                  '</div>'
              );
          }
          // Puedes agregar más condiciones según las opciones que desees manejar

          // ¡Ajusta según tus necesidades!
      });
  });
}

$(document).ready(function () {
  $('.ttarea-checkbox').change(function () {
      actualizarOpciones();
  });
});



  // $('.periodicidad-checkbox').prop('disabled', true);

  // $('#nombre, input[type="checkbox"]').change(function() {
  //     var nombre = $('#nombre').val();
  //     var tareasSeleccionadas = $('input[type="checkbox"]:checked').length > 0;

  //     $('.periodicidad-checkbox').prop('disabled', !(nombre && tareasSeleccionadas));
  // });

  // $('.periodicidad-checkbox').change(function() {
  //     if ($(this).is(':checked')) {
  //        // Deselecciona los demás checkboxes de periodo
  //         $('.periodicidad-checkbox').not(this).prop('checked', false);

  //         var id= $(this).val();

  //         if (id === "diario" ){
  //           $('#mantenciondia').show();
  //           $('#perdia').show();
  //           $('#cdiario').prop('checked', false);
  //           $('#cdiarion').prop('checked', false);
  //         }else{
  //           $('#perdia').hide();
  //           $('#mantenciondia').hide();
  //           $('#cdiario').prop('checked', false);
  //           $('#cdiarion').prop('checked', false);
  //         }

  //         if (id === "semanal" ){
  //           $('#mantencionsemana').show();
  //           $('#persemana').show();
  //           $('#csemana').prop('checked', false);
  //           $('#csemanan').prop('checked', false);
  //         }else{
  //           $('#mantencionsemana').hide();
  //           $('#persemana').hide();
  //           $('#csemana').prop('checked', false);
  //           $('#csemanan').prop('checked', false);
  //         }

  //         if (id === "mensual" ){
  //           $('#mantencionmes').show();
  //           $('#permes').show();
  //           $('#cmes').prop('checked', false);
  //           $('#cmesn').prop('checked', false);
  //         }else{
  //           $('#mantencionmes').hide();
  //           $('#permes').hide();
  //           $('#cmes').prop('checked', false);
  //           $('#cmesn').prop('checked', false);
  //         }

  //         if (id === "anual" ){
  //           $('#mantencionano').show();
  //           $('#perano').show();
  //           $('#cano').prop('checked', false);
  //         }else{
  //           $('#mantencionano').hide();
  //           $('#perano').hide();
  //           $('#cano').prop('checked', false);
  //         }
  //     }
  // });

  // $('#perdia input[type="checkbox"]').on('change', function() {
  //     $('#perdia input[type="checkbox"]').not(this).prop('checked', false);
  // });

  // $('#persemana input[type="checkbox"]').on('change', function() {
  //     $('#persemana input[type="checkbox"]').not(this).prop('checked', false);
  // });

  // $('#permes input[type="checkbox"]').on('change', function() {
  //     $('#permes input[type="checkbox"]').not(this).prop('checked', false);
  // });

  // $('#borrar').on('click', function(){
  //     $('#nombre').val('');
  //     $('#ttarea input[type="checkbox"]').prop('checked', false);
  //     $('.periodicidad-checkbox').prop('checked', false);
  //     $('.periodicidad-checkbox').prop('disabled', true);
  //     $('#cano').prop('checked', false);
  //     $('#cmes').prop('checked', false);
  //     $('#cmesn').prop('checked', false);
  //     $('#csemana').prop('checked', false);
  //     $('#csemanan').prop('checked', false);
  //     $('#cdiario').prop('checked', false);
  //     $('#cdiarion').prop('checked', false);
  //     $('#mandia').prop('checked', false);
  //     $('#mansemana').prop('checked', false);
  //     $('#manmes').prop('checked', false);
  //     $('#manano').prop('checked', false);
  //     $('#mdia').val('');
  //     $('#msemana').val('');
  //     $('#mmes').val('');
  //     $('#mano').val('');
  //     $('#ndia').val('')
  //     $('#nsem').val('')
  //     $('#nmes').val('')
  //     $('#mantenciondia').hide();
  //     $('#mantencionsemana').hide();
  //     $('#mantencionmes').hide();
  //     $('#mantencionano').hide();
  //     $('#perdia').hide();
  //     $('#persemana').hide();
  //     $('#permes').hide();
  //     $('#perano').hide();
  // }); 

  // $('#crear').on('click', function(){
  //     var nombre = $('#nombre').val();
  //     var ttarea = [];
  //     var periodo = [];
        
  //     // Itera sobre los checkboxes de ttarea seleccionados y agrega sus valores al array
  //     $(".ttarea-checkbox:checked").each(function(){
  //         ttarea.push($(this).val());
  //     });

  //     // Itera sobre los checkboxes de periodicidad seleccionados y agrega sus valores al array
  //     $(".periodicidad-checkbox:checked").each(function(){
  //        periodo.push($(this).val());
  //     });

  //         // Lógica adicional para enviar información específica basada en checkboxes de periodicidad
  //     var perdia = {};

  //     if (periodo.includes("diario")) { // Si el checkbox diario está seleccionado
  //       if ($('#cdiario').is(':checked')) {
  //           perdia.cicloDiario = 'TD';
  //       } else if ($('#cdiarion').is(':checked')) {
  //           perdia.cicloDiario = 'CND';
  //           perdia.nDias = $('#ndia').val();
  //       }
  //       // Agrega más lógica según sea necesario para otros campos específicos de la periodicidad diaria
  //     }

  //     var persemana= {};

  //     if (periodo.includes("semanal")) {
  //       if ($('#csemana').is(':checked')) {
  //         persemana.cicloSemana = 'TS';
  //       } else if ($('#csemanan').is(':checked')) {
  //         persemana.cicloSemana = 'CNS';
  //         persemana.nSemana = $('#nsem').val();
  //       }
  //     }

  //     var permes= {};

  //     if (periodo.includes("mensual")) {
  //       if ($('#cmes').is(':checked')) {
  //         permes.cicloMes = 'TS';
  //       } else if ($('#cmesn').is(':checked')) {
  //         permes.cicloMes = 'CNM';
  //         permes.nMes = $('#nmes').val();
  //       }
  //     }

  //     var perano= {};

  //     if (periodo.includes("anual")) {
  //       if ($('#cano').is(':checked')) {
  //         perano.cicloAno = 'TA';
  //       } 
  //     }

  //     var mantencion = []

  //     if ($('#mandia').is(':checked')) {
  //         var valorMdia = $('#mdia').val();
  //         mantencion.push(valorMdia);
  //     }

  //     if ($('#mansemana').is(':checked')) {
  //         var valorMsemana = $('#msemana').val();
  //         mantencion.push(valorMsemana);
  //     }

  //     if ($('#manmes').is(':checked')) {
  //         var valorMmes = $('#mmes').val();
  //         mantencion.push(valorMmes);
  //     }

  //     if ($('#manano').is(':checked')) {
  //         var valorMano = $('#mano').val();
  //         mantencion.push(valorMano);
  //     }
        
  //     var data = {
  //       nombre:nombre,
  //       ttarea: ttarea,
  //       periodo:periodo,
  //       perdia: perdia,
  //       persemana: persemana,
  //       permes: permes,
  //       perano: perano,
  //       mantencion: mantencion
  //     };

  //     $.ajax({
  //         url:'/crear',
  //         type:'POST',
  //         data: data
  //     });
  // });