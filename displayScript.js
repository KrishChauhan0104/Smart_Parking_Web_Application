document.addEventListener("DOMContentLoaded", function () {
   
    var formDataJSON = localStorage.getItem("formData");

    
    var formData = JSON.parse(formDataJSON);

   
    var displayDiv = document.getElementById("display");
    displayDiv.innerHTML = "<p><strong>Slot:</strong> " + formData.slot + "</p>" +
                          "<p><strong>Vehicle Number:</strong> " + formData.vehicleNumber + "</p>" +
                          "<p><strong>Entry Time:</strong> " + formData.entryTime + "</p>";
});
