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

    });

    // Firebase watcher .on("child_added"
    database.ref().on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();

        // Console.loging the last user's data
        console.log("Train Name: " + sv.name);
        console.log("Destination: " + sv.destination);
        console.log("First Train Time: " + sv.firstTrainTime);
        console.log("Frequency: " + sv.frequency);

        // Change the HTML to reflect
        // var nameTD = $("<td>");
        // nameTD.text(sv.name);
        // console.log(nameTD);

        var displayRow = "<tr><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>Placeholder 1</td><td>Placeholder2</td></tr>";

        // var destinationTD = $("<td>")
        // destinationTD.text(sv.destination);
        // var frequencyTD = $("<td>");
        // frequencyTD.text(sv.frequency);
        // var arrivalTD = $("<td>");
        // arrivalTD.text("Placeholder 1");
        // var minutesTD = $("<td>");
        // minutesTD.text("Placeholder 2");

        // var displayRow = $("<tr>");
        // displayRow.append(nameTD + destinationTD + frequencyTD + arrivalTD + minutesTD);
        $("tbody").append(displayRow);

        console.log(displayRow);
        // console.log(nameTD);


      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });









});