//Firebase
var config = {
    apiKey: "AIzaSyACw1ScbYG1PcmWqHv4ZLbGpO4FAK_gwsc",
    authDomain: "train-scheduler-85ce3.firebaseapp.com",
    databaseURL: "https://train-scheduler-85ce3.firebaseio.com",
    projectId: "train-scheduler-85ce3",
    storageBucket: "train-scheduler-85ce3.appspot.com",
    messagingSenderId: "572889680605",
    appId: "1:572889680605:web:3a20a3499b540757d0e934",
    measurementId: "G-3EXD2RQL0G"
};

firebase.initializeApp(config);

//VALUES
var dataRef = firebase.database();
var name = "";
var destination = "";
var time = "";
var frequency = "";
var currentTime = moment(currentTime).format('hh:mm');
var firstTimeConverted;
var clock; 
var date;
var trainName;
var trainDes;
var trainFreq;
var nextTrainTime;
var minutesLeft;
var trainNames = [];
var trainDests = [];
var trainTimes = [];
var trainFreqs = [];

//CALCULATION
function showTrains() {

//time difference = current time - time of first train
var timeDiff = moment().diff(firstTimeConverted, 'minutes');

//timeDiff % frequency = minutes ago
var minutesAgo = timeDiff % trainFreq;

//minutesLeft = frequency - minutesAgo
minutesLeft = trainFreq - minutesAgo;

//currentTime + minutesLeft = time of next train
var nextTrain = moment().add(minutesLeft, "minutes");

//format new time
nextTrainTime = moment(nextTrain).format("hh:mm");

//Train info table 
$("#table-body").append("<tr class='table-row'><td class='table-name'> " + trainName +
" </td><td class='table-desination'> " + trainDes +
" </td><td class='table-frequency'> " + trainFreq + " </td><td class='next-train'> " + nextTrainTime +
" </td><td class='minutes-away'> " + minutesLeft +
" </td></tr>");
};


//updates table
function updateTable() {

//empty table
$("#table-body").empty();

//updates values in table
for (i = 0; i < trainNames.length; i++) {
    firstTimeConverted = moment(trainTimes[i], "hh:mm").subtract(1, "years");
    trainName = trainNames[i]
    trainDes = trainDests[i];
    trainFreq = trainFreqs[i];
    showTrains();
};
};

//button click
$(document).on('click', '#add-train', function(event) {
event.preventDefault();
name = $("#name-input").val().trim();
destination = $("#destination-input").val().trim();
time = $("#time-input").val().trim();
frequency = $("#frequency-input").val().trim();

//push
if(name != '' && destination != '' && time != '' && frequency != '') {
    dataRef.ref().push({
    name: name,
    destination: destination,
    time: time,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    //empty input fields
    $("#name-input").val('');
    $("#destination-input").val('');
    $("#time-input").val('');
    $("#frequency-input").val('');

} else {
    alert("Please fill out all of the fields");
}

});


//child added 
dataRef.ref().on("child_added", function(childSnapshot) {

//pushes value
trainNames.push(childSnapshot.val().name);
trainDests.push(childSnapshot.val().destination);
trainTimes.push(childSnapshot.val().time);
trainFreqs.push(childSnapshot.val().frequency);

updateTable();


//errors
}, function(errorObject) {
console.log("Errors: " + errorObject.code);
});