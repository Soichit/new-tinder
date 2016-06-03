$(function(){

    var index = 0;
    var jsonData;
    var foodLength = 0;

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
            console.log(data);
            jsonData = data.result[index];
            foodLength = data.result.length;
            jsonUrl = jsonData[1];
            jsonName = jsonData[4];
            jsonPrice = jsonData[2];

            document.getElementById("foodName").innerHTML = jsonName;
            document.getElementById("foodPrice").innerHTML = jsonPrice;
            document.getElementById("foodImage").src = jsonUrl;
        }, "json")
    }
    

    function disliked() {
        console.log(index);
        document.getElementById("youMatched").innerHTML = "";
        if (index >= foodLength - 1) { //size - 1
            document.getElementById("foodName").innerHTML = "----";
            document.getElementById("foodPrice").innerHTML = "";
            document.getElementById("foodImage").src = 'static/img/empty.jpg';
        } else {
            index++;
            getData();
        }
    }

    function liked() {
        if (index < foodLength - 1) {
            getData();
            document.getElementById("youMatched").innerHTML = "It's a Match! ...with " + jsonName;
        }
    }

})





