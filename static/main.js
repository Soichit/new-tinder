$(function(){

    var index = 0;
    var retreivedData;
    var foodLength;
    var jsonName;
    var availableFood = [];

    window.onload = function() {
        document.getElementById("dislike").onclick = disliked;
        document.getElementById("like").onclick = liked;
        getData();
    };

    $.get("/ping", function(data){
        if(data.error == "true"){
            $("#results").prepend("<div class='alert alert-danger'><strong>Error!</strong> "+ data.message +"</div>");
        }
    }, "json")

    function getData() {
        $.get("getFoodStack", function(data){
            retreivedData = data;
            foodLength = data.result.length;
            console.log(data);
        }, "json")
        .done(function() {
            getAllFoods();
            disliked();
        })
    }

    function getAllFoods() {
        for (var i = 0; i < foodLength; i++) {
            availableFood.push(i);
        }
        console.log(availableFood);
    }

    function setFoodInfo() {
        jsonData = retreivedData.result[index];
        jsonUrl = jsonData[1];
        jsonPrice = jsonData[2];
        jsonName = jsonData[4];

        document.getElementById("foodName").innerHTML = jsonName;
        document.getElementById("foodPrice").innerHTML = jsonPrice;
        document.getElementById("foodImage").src = jsonUrl;
    }
    

    function disliked() {      
        if (availableFood.length == 0) { //size - 1
            document.getElementById("foodName").innerHTML = "----";
            document.getElementById("foodPrice").innerHTML = "";
            document.getElementById("foodImage").src = 'static/img/empty.jpg';
        } else {
            document.getElementById("youMatched").innerHTML = "";
            removeIndex = Math.floor(Math.random() * availableFood.length); //random # between 0 and availableFood.length
            index = availableFood[removeIndex];
            console.log(index);
            availableFood.splice(removeIndex, 1);
            console.log(availableFood);
            setFoodInfo();
        }
    }

    function liked() {
        if (availableFood.length > 0) {
            document.getElementById("youMatched").innerHTML = "It's a Match! ...with " + jsonName;
        }
    }

})





