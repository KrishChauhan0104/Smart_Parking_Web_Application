$(document).ready(function() {
    var bookedSlots = [];

    $("#bookingForm").submit(function(event) {
        event.preventDefault();

        var selectedSlotID = $("#slot").val();

        if (bookedSlots.includes(selectedSlotID)) {
            var index = bookedSlots.indexOf(selectedSlotID);
            bookedSlots.splice(index, 1);
            $("#" + selectedSlotID).removeClass("booked");
        } else {
            $("#" + selectedSlotID).addClass("booked");
            bookedSlots.push(selectedSlotID);
        }
    });
});

function submitForm() {
    var selectedSlot = $("#slot").val();
    var vehicleNumber = $("#Vehicle").val();
    var entryTime = $("#Time").val();

    var formData = {
        slot: selectedSlot,
        vehicleNumber: vehicleNumber,
        entryTime: entryTime
    };

    var formDataJSON = JSON.stringify(formData);
    localStorage.setItem("formData", formDataJSON);

    window.location.href = "displayData.html";

    return false;
}

