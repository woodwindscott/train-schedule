$(document).ready(function() {

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAIKCoJznGEi8NAtVmnaxNKFx2dCabK8sw",
        authDomain: "train-schedule-b5b0c.firebaseapp.com",
        databaseURL: "https://train-schedule-b5b0c.firebaseio.com",
        projectId: "train-schedule-b5b0c",
        storageBucket: "",
        messagingSenderId: "219750289053",
        appId: "1:219750289053:web:2afe0f70971937d4"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    // Initial Values
    var name = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";
    var nextTrain = "";
    var minutesTillTrain = "";

    // This function will render the display of the train timetable - whenever the page is loaded or the refresh button is clicked.
    function renderTrains() {

      // Firebase watcher .on("child_added")
      database.ref().on("child_added", function(snapshot) {
        
          // storing the snapshot.val() in a variable for convenience
          var sv = snapshot.val();

          trainCalculations (sv.firstTrainTime, sv.frequency, sv.dateAdded);

          var lastUpdated = moment();
          // console.log(moment(lastUpdated).format("MMMM Do YYYY, h:mm:ss a"));
          $("#last-update").text(moment(lastUpdated).format("MMMM Do YYYY, h:mm a"));

          var displayRow = $("<tr>");
          var nameTD = $("<td>");
          nameTD.text(sv.name);

          var destinationTD = $("<td>")
          destinationTD.text(sv.destination);

          var frequencyTD = $("<td>");
          frequencyTD.text(sv.frequency);

          var arrivalTD = $("<td>");
          arrivalTD.text(nextTrain);

          var minutesTD = $("<td>");
          minutesTD.text(minutesTillTrain);

          displayRow.append(nameTD, destinationTD, frequencyTD, arrivalTD, minutesTD);
          $("tbody").append(displayRow);

        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });

    }

    function trainCalculations (firstTrain, trainFrequency, dateAdded) {

        // Determines if the train was added today or on an earlier date - ie. is it already running?
        var dayAdded = moment(dateAdded).format("MM/DD");
        var today = moment().format("MM/DD");

        var firstDeparture = moment(firstTrain, "HH:mm");
        var isRunning = moment().diff(moment(firstDeparture), "minutes");

        // If the train is already running (either added on a previous day or the train has started today), follow this script
        if (dayAdded !== today || isRunning >= 0) {

            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    
            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    
            // Time apart (remainder)
            var tRemainder = diffTime % trainFrequency;
    
            // Minute Until Train
            minutesTillTrain = trainFrequency - tRemainder;
    
            // Next Train
            nextTrain = moment().add(minutesTillTrain, "minutes").format("hh:mm A");

        // If the train was added today and has not yet departed
        } else {

            // Minute Until first departure of the train (converted to a positive integer)
            minutesTillTrain = isRunning * -1;
            
             // Next Train (Original Departure Time)
             nextTrain = moment(firstDeparture).format("hh:mm A");

        }
  
    }

    // Upon the load of the page, this function will display the timetable

    $("tbody").empty();
    renderTrains();

    // Capture Button Click
    $("#submit-train").on("click", function(event) {
      event.preventDefault();

      // Grabbed values from text boxes
      name = $("#train-name").val().trim();
      destination = $("#destination").val().trim();
      firstTrainTime = $("#first-train").val().trim();
      frequency = $("#frequency").val().trim();

      // Clears the values in text boxes
      $("#train-name").val("");
      $("#destination").val("");
      $("#first-train").val("");
      $("#frequency").val("");

      // Code for handling the push
      database.ref().push({
        name: name,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      //Whenever a new train is added, the timetable will be updated
      $("tbody").empty();
      renderTrains();

    });

    // This will allow the user to refresh the train timetable
    $("#refresh").on("click", function(event) {
     
      event.preventDefault();

      // This will refresh the train timetable
      $("tbody").empty();
      renderTrains();

    });

});