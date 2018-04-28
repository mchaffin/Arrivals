$(document).ready(function(){

    /////// FIREBASE  ///////
    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyCT8cB3B8sQ3inRKAHnUMOKi1_zjtTN0QE",
    authDomain: "arrivals-f1f29.firebaseapp.com",
    databaseURL: "https://arrivals-f1f29.firebaseio.com",
    projectId: "arrivals-f1f29",
    storageBucket: "arrivals-f1f29.appspot.com",
    messagingSenderId: "40377829727"
    };

    firebase.initializeApp(config);
    
    var dataArrivals = firebase.database();
    
    // Initial Values
    var trainName = "";
    var destiNation = "";
    var freQuency = 0;
    var firstTrainTime = 0;
    var nextTrainTime = 0;
      
    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    dataArrivals.ref().on("child_added", function(childSnapshot) {
    
    // Log out snapshot
    console.log(childSnapshot.val().tname);
    console.log(childSnapshot.val().dest);
    console.log(childSnapshot.val().freq);
    console.log(childSnapshot.val().nexttrain);

    // Append to table 
    $("table tbody").append("<tr><td><input type='checkbox' name='record'></td><td>" + childSnapshot.val().tname +
        "</td><td>" + childSnapshot.val().dest +
        "</td><td>" + childSnapshot.val().freq +
        "</td><td>" + childSnapshot.val().nexttrain + 
        "</td></tr>");
            
    // Handle the errors
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
    });

    // Get last added train    
    dataArrivals.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    // Change the HTML to reflect
    $("#name-display").text(snapshot.val().tname);
    $("#email-display").text(snapshot.val().dest);
    $("#age-display").text(snapshot.val().freq);
    $("#comment-display").text(snapshot.val().nexttrain);
    });

    /////// EVENT ACTIONS  ///////
    // Capture Button Click
    $("#add-train").on("click", function(event) {
        event.preventDefault();
   
        // Don't forget to provide initial data to your Firebase database.
        trainName = $("#tname-input").val().trim();
        destiNation = $("#dest-input").val().trim();
        freQuency = $("#freq-input").val().trim();
        firstTrainTime = $("#ftt-input").val().trim();
        nextTrainTime = nextArrival();
        console.log("NextTrainTime: "+nextTrainTime);
    
        // Push values to Firebase
        dataArrivals.ref().push({    
            tname: trainName,
            dest: destiNation,
            freq: freQuency,
            firsttrain: firstTrainTime,
            nexttrain: nextTrainTime,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // Clear form
        $('#addTrainCard')[0].reset();
    });
    
    // Add table rows
    $(".add-row").on("click", function(){
        event.preventDefault();

        var tname = $("#tname").val().trim();
        var dest = $("#dest").val().trim();
        var freq = $("#freq").val().trim();
        var ftt = $("#ftt").val().trim();
        var ntt = nextArrival();
        console.log("NextTrain: "+ntt);
        // Clear form
        $('#addTrain')[0].reset();

        // Push values to Firebase
        dataArrivals.ref().push({    
            tname: tname,
            dest: dest,
            freq: freq,
            firsttrain: ftt,
            //nexttrain: ntt,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });
    
    // Find and remove selected table rows
    $(".delete-row").click(function(){
        $("table tbody").find('input[name="record"]').each(function(){
            if($(this).is(":checked")){
                $(this).parents("tr").remove();
            }
        });
        // Add code to delete trains from Firebase
    });

    ///////  TIME FUNCTIONS  ///////
    function nextArrival(){ 
        // Frequency Time
        var tFrequency = 30;

        // First Time is 00:00 AM
        var firstTime = "00:00";

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log("FirstTimeConverted: "+firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
        return nextTrain;
    }

});    