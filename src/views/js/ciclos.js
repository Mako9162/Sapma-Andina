$(document).ready(function() {
    
  // Al cargar la página, deshabilita las selecciones de periodo
  $('.periodicidad-checkbox').prop('disabled', true);

  // Cuando se cambia el valor del campo de nombre o las selecciones de tarea
  $('#nombre, input[type="checkbox"]').change(function() {
      // Verifica si el campo de nombre no está vacío y al menos una tarea está seleccionada
      var nombre = $('#nombre').val();
      var tareasSeleccionadas = $('input[type="checkbox"]:checked').length > 0;

      var condicionesCumplidas = nombre && tareasSeleccionadas;

      // Habilita o deshabilita el botón según las condiciones
      $('#crear').prop('disabled', !condicionesCumplidas);
      
      // Habilita o deshabilita las selecciones de periodo en función de las condiciones
      $('.periodicidad-checkbox').prop('disabled', !(nombre && tareasSeleccionadas));
  });

  // Cuando se selecciona un checkbox de periodo, deselecciona los demás
  $('.periodicidad-checkbox').change(function() {
      if ($(this).is(':checked')) {
         // Deselecciona los demás checkboxes de periodo
          $('.periodicidad-checkbox').not(this).prop('checked', false);

          var id= Number($(this).val());

          if (id === 1 ){
            $('#mantenciondia').show();
            $('#perdia').show();
            $('#cdiario').prop('checked', false);
            $('#cdiarion').prop('checked', false);
          }else{
            $('#perdia').hide();
            $('#mantenciondia').hide();
            $('#cdiario').prop('checked', false);
            $('#cdiarion').prop('checked', false);
          }

          if (id === 2 ){
            $('#mantencionsemana').show();
            $('#persemana').show();
            $('#csemana').prop('checked', false);
            $('#csemanan').prop('checked', false);
          }else{
            $('#mantencionsemana').hide();
            $('#persemana').hide();
            $('#csemana').prop('checked', false);
            $('#csemanan').prop('checked', false);
          }

          if (id === 3 ){
            $('#mantencionmes').show();
            $('#permes').show();
            $('#cmes').prop('checked', false);
            $('#cmesn').prop('checked', false);
          }else{
            $('#mantencionmes').hide();
            $('#permes').hide();
            $('#cmes').prop('checked', false);
            $('#cmesn').prop('checked', false);
          }

          if (id === 4 ){
            $('#mantencionano').show();
            $('#perano').show();
            $('#cano').prop('checked', false);
          }else{
            $('#mantencionano').hide();
            $('#perano').hide();
            $('#cano').prop('checked', false);
          }
      }
  });

  $('#perdia input[type="checkbox"]').on('change', function() {
      $('#perdia input[type="checkbox"]').not(this).prop('checked', false);
  });

  $('#persemana input[type="checkbox"]').on('change', function() {
      $('#persemana input[type="checkbox"]').not(this).prop('checked', false);
  });

  $('#permes input[type="checkbox"]').on('change', function() {
      $('#permes input[type="checkbox"]').not(this).prop('checked', false);
  });

  $('#borrar').on('click', function(){
      $('#nombre').val('');
      $('#ttarea input[type="checkbox"]').prop('checked', false);
      $('.periodicidad-checkbox').prop('checked', false);
      $('.periodicidad-checkbox').prop('disabled', true);
      $('#cano').prop('checked', false);
      $('#cmes').prop('checked', false);
      $('#cmesn').prop('checked', false);
      $('#csemana').prop('checked', false);
      $('#csemanan').prop('checked', false);
      $('#cdiario').prop('checked', false);
      $('#cdiarion').prop('checked', false);
      $('#mandia').prop('checked', false);
      $('#mansemana').prop('checked', false);
      $('#manmes').prop('checked', false);
      $('#manano').prop('checked', false);
      $('#mdia').val('');
      $('#msemana').val('');
      $('#mmes').val('');
      $('#mano').val('');
      $('#ndia').val('')
      $('#nsem').val('')
      $('#nmes').val('')
      $('#mantenciondia').hide();
      $('#mantencionsemana').hide();
      $('#mantencionmes').hide();
      $('#mantencionano').hide();
      $('#perdia').hide();
      $('#persemana').hide();
      $('#permes').hide();
      $('#perano').hide();
  }); 

  $('#crear').on('click', function(){
      var nombre = $('#nombre').val();
      var ttarea = [];
      var periodo = [];
        
      // Itera sobre los checkboxes de ttarea seleccionados y agrega sus valores al array
      $(".ttarea-checkbox:checked").each(function(){
          ttarea.push($(this).val());
      });

      // Itera sobre los checkboxes de periodicidad seleccionados y agrega sus valores al array
      $(".periodicidad-checkbox:checked").each(function(){
         periodo.push($(this).val());
      });

          // Lógica adicional para enviar información específica basada en checkboxes de periodicidad
      var perdia = {};

      if (periodo.includes("1")) { // Si el checkbox diario está seleccionado
        if ($('#cdiario').is(':checked')) {
            perdia.cicloDiario = 'TD';
        } else if ($('#cdiarion').is(':checked')) {
            perdia.cicloDiario = 'CND';
            perdia.nDias = $('#ndia').val();
        }
        // Agrega más lógica según sea necesario para otros campos específicos de la periodicidad diaria
      }

      var persemana= {};

      if (periodo.includes("2")) {
        if ($('#csemana').is(':checked')) {
          persemana.cicloSemana = 'TS';
        } else if ($('#csemanan').is(':checked')) {
          persemana.cicloSemana = 'CNS';
          persemana.nSemana = $('#nsem').val();
        }
      }

      var permes= {};

      if (periodo.includes("3")) {
        if ($('#cmes').is(':checked')) {
          permes.cicloMes = 'TS';
        } else if ($('#cmesn').is(':checked')) {
          permes.cicloMes = 'CNM';
          permes.nMes = $('#nmes').val();
        }
      }

      var perano= {};

      if (periodo.includes("4")) {
        if ($('#cano').is(':checked')) {
          perano.cicloAno = 'TA';
        } 
      }

      var mantencion = []

      if ($('#mandia').is(':checked')) {
          var valorMdia = $('#mdia').val();
          mantencion.push(valorMdia);
      }

      if ($('#mansemana').is(':checked')) {
          var valorMsemana = $('#msemana').val();
          mantencion.push(valorMsemana);
      }

      if ($('#manmes').is(':checked')) {
          var valorMmes = $('#mmes').val();
          mantencion.push(valorMmes);
      }

      if ($('#manano').is(':checked')) {
          var valorMano = $('#mano').val();
          mantencion.push(valorMano);
      }
        
      var data = {
        nombre:nombre,
        ttarea: ttarea,
        periodo:periodo,
        perdia: perdia,
        persemana: persemana,
        permes: permes,
        perano: perano,
        mantencion: mantencion
      };

      $.ajax({
          url:'/crear',
          type:'POST',
          data: data
      });
  });

});
