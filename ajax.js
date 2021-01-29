$(document).ready(function() {

    $("#login_form").on("submit", function( event ) {
        event.preventDefault();
        let username = $("#username").val();
        let password = $("#pass").val();
        $.ajax({
            type: "POST",
            url: "/login",
            data: {username:username, password:password},
            success: function(response) {
                sendLocalDataToServer();
                alert("zalogowano");
            },
            error: function(response) {
                alert("złe dane");
            }
        })
    });

    $("#register_form").on("submit", function( event ) {
        event.preventDefault();
        let username = $("#usernameReg").val();
        let password = $("#passReg").val();
        $.ajax({
            type: "POST",
            url: "/register",
            data: {username:username, password:password},
            success: function(response) {
                alert("rejestracja przebiegła pomyślnie");
            },
            error: function(response) {
                alert(response.responseText);
            }
        })
    });
    
    
    // CREATE
    $("#survey_form").on("submit", function( event ) {
        event.preventDefault();
        let animal = $("#animals").val();
        let feelings = $("#feelings").val();
        let quantity = $("#quantity").val();
        $.ajax({
            type: "POST",
            url: "/survey",
            data: {animal:animal,quantity:quantity,feelings:feelings},
            success: function(data) {
                alert('Wysłano ankiete.');
            },
            error: function(err){
                alert("zaloguj się aby wysłać");
            }
        })
    });
    
    // Save data locally
    $("#save_locally").click(function (event){
        let form_data = $("#survey_form").serialize();
        var survey = QueryStringToJSON(form_data);
        addObjectToStore('surveys', survey);
    })
    
    function QueryStringToJSON(queryString) {            
        var pairs = queryString.split('&');
        
        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
    
        return JSON.parse(JSON.stringify(result));
    }
    
    $("#get_results_offline").click(function (event) {
        event.preventDefault();
        readData('surveys', function() {console.log("successfuly read.");});
    
        // Create table with results
        $("#offline_results").html("");
        var table = '';
        if (typeof global_results !== 'undefined') {
            table += '<table class="table table-stripped">';
            table += '<thead class="thead-light"><tr>';
            // thead
            for(var heading in global_results[0]){
                table += '<th>' + heading + '</th>';
            }
            table += '</tr></thead>';
            table += '<tbody>';
            // tbody
            for(var i = 0; i < global_results.length; i++){
                table += '<tr>';
                for(var field in global_results[i]){
                    table += '<td>' + global_results[i][field] + '</td>';
                }
                table += '</tr>';
            }
            table += '</tbody>';
            table += '</table>';
        }
        $("#offline_results").append(table);
    });
    
    
    $("#draw_chart").click(function (event){
        $.ajax({
            type: "GET",
            url: "/analytics_data",
            success: function(data) {
                draw_charts(data);
            },
            error: function(){
                alert('Nie udalo sie uzyskać danych z serwera.');
            }
        })
    
        function draw_charts(data) {
            // Question 1
            var ctx = document.getElementById("chart01").getContext("2d");
            ctx.clearRect(0, 0, 800, 400);
            var values01 = ['dog', 'duck', 'cat', 'hedgehog','squirrel'];
            var data01 = [0,0,0,0,0];
        
            // count answers for chart01
            for (var i = 0; i < values01.length; i++){
                for(var j = 0; j < data.length; j++){
                    if(data[j].animal == values01[i]){
                        data01[i]+=data[j].quantity;
                    }
                }
            }
            var chart01 = new Chart(ctx, {
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
                draw_charts(data);
            },
            error: function(){
                alert('Nie udalo sie uzyskać danych z serwera.');
            }
        })
    
        function draw_charts(data) {
            // Question 2
            var ctx = document.getElementById("chart02").getContext("2d");
            ctx.clearRect(0, 0, 800, 400);
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
            var chart01 = new Chart(ctx, {
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
    }
    
    })
    
});


