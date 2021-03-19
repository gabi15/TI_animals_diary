function draw_clear_chart(canvas_name) {
    // Question 1
    var ctx = document.getElementById(canvas_name).getContext("2d");
    var values01 = ['dog', 'duck', 'cat', 'hedgehog','squirrel'];
    var data01 = [0,0,0,0,0];

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pieski', 'Kaczki', 'Kotki', 'Jeżyki', 'Wiewióry'],
            datasets: [{
                label: 'Ilość',
                data: data01,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize:1
                    }
                }]
            }
        }
    });
    return chart;
}

$(document).ready(function() {
    let empty_chart1;
    let empty_chart2;


    $.ajax({ url: "/analytics_data",
        context: document.body,
        success: function(){
            empty_chart1=draw_clear_chart("chart01");
            empty_chart2=draw_clear_chart("chart02");
        }
    });



$("#draw_chart").click(function (event){
    $.ajax({
        type: "GET",
        url: "/analytics_data",
        success: function(data) {
            draw_charts(data,empty_chart1);
        },
        error: function(){
            alert('Nie udalo sie uzyskać danych z serwera.');
        }
    })

    function draw_charts(data,chart_to_update) {
        console.log("aaa");
        // Question 1
        var values01 = ['dog', 'duck', 'cat', 'hedgehog','squirrel'];
        var data01 = [0,0,0,0,0];
        console.log(chart_to_update);
    
        // count answers for chart01
        for (var i = 0; i < values01.length; i++){
            for(var j = 0; j < data.length; j++){
                if(data[j].animal == values01[i]){
                    data01[i]+=data[j].quantity;
                }
            }
        }
        chart_to_update.data.datasets[0].data = data01;
        chart_to_update.update()

}

})

$("#chart2_form").on("submit", function( event ) {
    event.preventDefault();
    let date = $("#date").val();
    $.ajax({
        type: "POST",
        url: "/analytics_daily",
        data:{
            date:date
        },
        success: function(data) {
            draw_charts(data, empty_chart2);
        },
        error: function(){
            alert('Nie udalo sie uzyskać danych z serwera.');
        }
    })

    function draw_charts(data, chart_to_update) {
        // Question 2
        var values01 = ['dog', 'duck', 'cat', 'hedgehog', 'squirrel'];
        var data01 = [0,0,0,0,0];
    
        // count answers for chart02
        for (var i = 0; i < values01.length; i++){
            for(var j = 0; j < data.length; j++){
                if(data[j].animal == values01[i]){
                    data01[i]+=data[j].quantity;
                }
            }
        }
        chart_to_update.data.datasets[0].data = data01;
        chart_to_update.update();

    }

})

});