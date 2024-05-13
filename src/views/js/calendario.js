$(document).ready(function() {
    $('#calendar').fullCalendar({

        lang: 'es',
        header: {
            left: '',
            center: 'prev, title, next',
            right: 'today agendaDay,agendaTwoDay,agendaWeek,month'
        },
        defaultDate: new Date(),
        editable: true,
        selectable: true,
        eventLimit: 2,
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        events: function(start, end, timezone, callback) {
            $.ajax({
                url: '/tarea_mes', 
                type: 'POST',
                dataType: 'json',
                data: {
                    start: start.format(),
                    end: end.format()
                },
                success: function(doc) {
                    var events = [];
                    $(doc).each(function() {
                        events.push({
                            title: $(this).attr('ID'), 
                            start: $(this).attr('FECHA'), 
                            allDay: true,
                            color: $(this).attr('ESTADO') == 4 ? 'lightgreen' : ''
                        });
                    });
                    callback(events);

                }
            });
        },
        eventClick: function(event, jsEvent, view) {
            $.ajax({
                url: '/resumen_detalle',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: event.title // Envía el ID del evento (la tarea) a tu servidor
                },
                success: function(data) {
                    // Aquí puedes hacer algo con los datos que recibiste del servidor
                    // Por ejemplo, podrías mostrar los datos en un modal o en un div en tu página
                    alert('Tarea: ' + data); // Muestra los datos en un alerta por ahora
                }
            });
        },
    });
});
