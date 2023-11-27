var contador = 1;

function agregarCiclo() {
    $.ajax({
        url: '/ttareas',
        type: 'GET',
        success: function (response) {
            console.log(response);
            var nuevoCiclo = $(
                '<div class="row nuevo-ciclo" id="todo' + contador + '">' +
                '<div class="form-group col-md-4 col-sm-6" id="ttarea' + contador + '">' +
                '<label class="form-label" for="tipo_tarea' + contador + '">Seleccione el tipo de protocolo:</label> ' +
                '<select name="tipo_tarea' + contador + '"  id="tipo_tarea' + contador + '" class="select2">' +
                '<option value="">Seleccione una opción</option>' +
                generateOptions(response) +
                '</select>' +
                '</div>' +
                '<div class="form-group col-md-4 col-sm-6" id="periodicidad' + contador + '">' +
                '<label class="form-label" for="periodo' + contador + '">Seleccione periodicidad:</label>' +
                '<select name="periodo' + contador + '"  id="periodo' + contador + '" class="select2" >' +
                '<option value="">Seleccione una opción</option>' +
                '<option value="Diario">Diario</option>' +
                '<option value="Semanal">Semanal</option>' +
                '<option value="Mensual">Mensual</option>' +
                '<option value="Anual">Anual</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group col-md-2 col-sm-6 tipo-periodo" id="tipo_periodo_d' + contador + '" style="display: none;">' +
                '<label class="form-label">Seleccione un ciclo:</label>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="todos_los_dias' + contador + '" value="Todos los días">' +
                '<label for="todos_los_dias' + contador + '">Todos los días</label>' +
                '</div>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="cnd' + contador + '" value="CND">' +
                '<label for="cnd' + contador + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="" id="">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;días</label>' +
                '</div>' +
                '</div>' +
                '<div class="form-group col-md-2 col-sm-6 tipo-periodo" id="tipo_periodo_s' + contador + '" style="display: none;">' +
                '<label class="form-label">Seleccione un ciclo:</label>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="todas_las_semanas' + contador + '" value="Todas las semanas">' +
                '<label for="todas_las_semanas' + contador + '">Todas las semanas</label>' +
                '</div>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="cns' + contador + '" value="CNS">' +
                '<label for="cns' + contador + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="" id="">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;semanas</label>' +
                '</div>' +
                '</div>' +
                '<div class="form-group col-md-2 col-sm-6 tipo-periodo" id="tipo_periodo_m' + contador + '" style="display: none;">' +
                '<label class="form-label">Seleccione un ciclo:</label>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="todos_los_meses' + contador + '" value="Todos los meses">' +
                '<label for="todos_los_meses' + contador + '">Todos los meses</label>' +
                '</div>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="cnm' + contador + '" value="CNM">' +
                '<label for="cnm' + contador + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="" id="">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;meses</label>' +
                '</div>' +
                '</div>' +
                '<div class="form-group col-md-2 col-sm-6 tipo-periodo" id="tipo_periodo_a' + contador + '" style="display: none;">' +
                '<label class="form-label">Seleccione un ciclo:</label>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="todos_los_anos' + contador + '" value="Todos los años">' +
                '<label for="todos_los_anos' + contador + '">Todos los años</label>' +
                '</div>' +
                '<div class="radio">' +
                '<input type="radio" name="optionsRadios' + contador + '" id="cna' + contador + '" value="CNA">' +
                '<label for="cna' + contador + '">Cada&nbsp;' +
                '<input class="form-control" min="1" style="width: 60px; display: inline-block; z-index: 1;" type="number" name="" id="">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;años</label>' +
                '</div>' +
                '</div>' +
                '<div class="form-group col-md-1 col-sm-6 d-flex align-items-center justify-content-center">'+
                '<label class="form-label" id="buscar" style="color: aliceblue;">.</label>'+
                '<a href="#" type="button" class="btn btn-inline btn-danger btn-sm ladda-button eliminar-ciclo" data-contador="' + contador + '"><i class="fa fa-minus"></i></a>' +
                '</div>'+
                '</div>'

            );

            var $periodoSelect = nuevoCiclo.find("#periodo" + contador);
            var $tipoPeriodoD = nuevoCiclo.find("#tipo_periodo_d" + contador);
            var $tipoPeriodoS = nuevoCiclo.find("#tipo_periodo_s" + contador);
            var $tipoPeriodoM = nuevoCiclo.find("#tipo_periodo_m" + contador);
            var $tipoPeriodoA = nuevoCiclo.find("#tipo_periodo_a" + contador);

            $periodoSelect.change(function () {
                var selectedPeriodo = $(this).val();

                nuevoCiclo.find('.tipo-periodo').hide();

                if (selectedPeriodo === "Semanal") {
                    $tipoPeriodoS.show();
                } else if (selectedPeriodo === "Mensual") {
                    $tipoPeriodoM.show();
                } else if (selectedPeriodo === "Anual") {
                    $tipoPeriodoA.show();
                } else if (selectedPeriodo === "Diario") {
                    $tipoPeriodoD.show();
                }
            });

            var $tipoTareaSelect = nuevoCiclo.find("[name^='tipo_tarea']");
            $tipoTareaSelect.change(function () {
                var tipoTareaSeleccionado = $(this).val();
                $("#a_ciclo").prop('disabled', !tipoTareaSeleccionado);
            });

            $("#contenedor-ciclos").append(nuevoCiclo);

            nuevoCiclo.find(".select2").select2();

            contador++;

            nuevoCiclo.find(".eliminar-ciclo").click(function () {
                var cicloAEliminar = $(this).data("contador");
                $("#todo" + cicloAEliminar).remove();
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function generateOptions(response) {
    var options = '';
    response.forEach(function (tarea) {
        options += '<option value="' + tarea.Id + '">' + tarea.Descripcion + ' - ' + tarea.Abreviacion + '</option>';
    });
    return options;
}

function verificarHabilitacionControles() {
    var nombreCiclo = $('#nombre').val();
    var tipoEquipoSeleccionado = $('#tipo_equipo').val();

    $('#tipo_tarea').prop('disabled', !nombreCiclo || !tipoEquipoSeleccionado);

    $('#periodo').prop('disabled', !nombreCiclo || !tipoEquipoSeleccionado);

    $('#crear').prop('disabled', !nombreCiclo || !tipoEquipoSeleccionado);

        if (!nombreCiclo || !tipoEquipoSeleccionado) {
        $(".nuevo-ciclo").remove();
    }
}

$(document).ready(function () {

    $("#tipo_tarea").change(function () {
        var tipoTareaSeleccionado = $(this).val();
        $("#a_ciclo").prop('disabled', !tipoTareaSeleccionado);
    });

    $('#nombre, #tipo_equipo').on('input change', function () {
        verificarHabilitacionControles();
    });

    $("#a_ciclo").on("click", function(){
        $("#a_ciclo").prop('disabled', true);
        agregarCiclo()
        verificarHabilitacionControles();
    });

    $("#periodo").change(function () {
        var selectedOption = $(this).val();

        $("#tipo_periodo_d, #tipo_periodo_s, #tipo_periodo_m, #tipo_periodo_a").hide();

        if (selectedOption === "Diario") {
            $("#tipo_periodo_d").show();
        } else if (selectedOption === "Semanal") {
            $("#tipo_periodo_s").show();
        } else if (selectedOption === "Mensual") {
            $("#tipo_periodo_m").show();
        } else if (selectedOption === "Anual") {
            $("#tipo_periodo_a").show();
        }
    });

    $("#borrar").on("click", function () {
        location.reload();
    });
    
    $('#crear').on('click', function () {
        var nombre = $('#nombre').val();
        var tipo_equipo = $('#tipo_equipo').val();
        var tipo_tarea = $('#tipo_tarea').val();
        var periodo = $('#periodo').val();
    
        var base = {
            nombre: nombre,
            tipo_equipo: tipo_equipo
        };
    
        var dato1 = {
            tipo_tarea: tipo_tarea,
            periodo: periodo
        };

        var radioSeleccionado = $('input[name=optionsRadios]:checked');

        if (radioSeleccionado.length > 0) {
            
            var inputNumero = radioSeleccionado.closest('.radio').find('input[type=number]');
            var valorInput = parseFloat(inputNumero.val());

            if (!isNaN(valorInput)) {
                dato1.periodicidad = valorInput + '-' + radioSeleccionado.val();
            } else {
                dato1.periodicidad = radioSeleccionado.val();
            }
        } else {
            dato1.periodicidad = periodicidad;
        }

        var dato2 = [];

        $(".nuevo-ciclo").each(function () {
            var contador = $(this).find("[name^='tipo_tarea']").data("contador");

            var cicloData = {
                tipo_tarea: $(this).find("[name^='tipo_tarea']").val(),
                periodo: $(this).find("[name^='periodo']").val(),
                periodicidad: obtenerPeriodicidad($(this)),
            };
            dato2.push(cicloData);
        });

        $.ajax({
            url: '/crear',
            type: 'POST',
            data: {
                base,
                dato1,
                dato2
            },
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    function obtenerPeriodicidad(elemento) {
        var selectedOption = elemento.find("[name^='periodo']").val();

        if (selectedOption === "Diario") {
            return obtenerPeriodoDiario(elemento);
        } else if (selectedOption === "Semanal") {
            return obtenerPeriodoSemanal(elemento);
        } else if (selectedOption === "Mensual") {
            return obtenerPeriodoMensual(elemento);
        } else if (selectedOption === "Anual") {
            return obtenerPeriodoAnual(elemento);
        }

        return null;
    }

    function obtenerPeriodoDiario(elemento) {
        var radioSeleccionado = elemento.find("[name^='optionsRadios']:checked");
    
        if (radioSeleccionado.val() === "Todos los días") {
            return "Todos los días";
        } else if (radioSeleccionado.val() === "CND") {
            var inputNumero = radioSeleccionado.closest('.radio').find('input[type=number]');
            var valorInput = parseFloat(inputNumero.val());
    
            if (!isNaN(valorInput)) {
                return valorInput +"-"+radioSeleccionado.val();
            }
        }
    
        return null;
    }  
    
    function obtenerPeriodoSemanal(elemento) {
        var radioSeleccionado = elemento.find("[name^='optionsRadios']:checked");
    
        if (radioSeleccionado.val() === "Todas las semanas") {
            return "Todas las semanas";
        } else if (radioSeleccionado.val() === "CNS") {
            var inputNumero = radioSeleccionado.closest('.radio').find('input[type=number]');
            var valorInput = parseFloat(inputNumero.val());
    
            if (!isNaN(valorInput)) {
                return valorInput +"-"+radioSeleccionado.val();
            }
        }
    
        return null;
    }
    
    function obtenerPeriodoMensual(elemento) {
        var radioSeleccionado = elemento.find("[name^='optionsRadios']:checked");
    
        if (radioSeleccionado.val() === "Todos los meses") {
            return "Todos los meses";
        } else if (radioSeleccionado.val() === "CNM") {
            var inputNumero = radioSeleccionado.closest('.radio').find('input[type=number]');
            var valorInput = parseFloat(inputNumero.val());
    
            if (!isNaN(valorInput)) {
                return valorInput +"-"+radioSeleccionado.val();
            }
        }
    
        return null;
    }
    
    function obtenerPeriodoAnual(elemento) {
        var radioSeleccionado = elemento.find("[name^='optionsRadios']:checked");
    
        if (radioSeleccionado.val() === "Todos los años") {
            return "Todos los años";
        } else if (radioSeleccionado.val() === "CNA") {
            var inputNumero = radioSeleccionado.closest('.radio').find('input[type=number]');
            var valorInput = parseFloat(inputNumero.val());
    
            if (!isNaN(valorInput)) {
                return valorInput +"-"+radioSeleccionado.val();
            }
        }
    
        return null;
    }
    
});

