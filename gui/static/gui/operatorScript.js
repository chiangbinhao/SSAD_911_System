window.addEventListener('load',function(){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB1Vj3dEqjSUukuDpbkNkA7di9CvUJ1nZ4&libraries=places&callback=activatePlacesSearch';
    document.body.appendChild(script);
});

function activatePlacesSearch(){
    var options = {
        componentRestrictions: {country: "SG"}
    };

    var input = document.getElementById("address");
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        sessionStorage.setItem('lat', place.geometry.location.lat());
        sessionStorage.setItem('lng', place.geometry.location.lng());
        appendTitle();
    });
}

function changeButtonText(){
    var submitButton = document.getElementById("submitButton");
    if (document.getElementById("crisis").checked) {
        submitButton.innerHTML = "Submit";
    } else {
        submitButton.innerHTML = "Save";
    }
    showCasulty(document.getElementById("crisis").checked);
}

function showCasulty(bool){
    if (bool) {
        document.getElementById('casualtyDiv').style.display = 'block';
    } else {
        document.getElementById('casualtyDiv').style.display = 'none';
    }
}

function validateNric() {
    var nric = document.getElementById('identity').value;

    if (nric.length != 9) {
        if(nric.length === 0){
    	    return;
    	} else {
    	    document.getElementById('identity').value = "";
            alert("Invalid NRIC/FIN \"" + nric.toUpperCase() + "\" Please retype");
            document.getElementById('identity').focus();
            return;
    	}
    }

	nric = nric.toUpperCase();

    var i,
    icArray = [];
    for(i = 0; i < 9; i++) {
        icArray[i] = nric.charAt(i);
    }

    icArray[1] = parseInt(icArray[1], 10) * 2;
    icArray[2] = parseInt(icArray[2], 10) * 7;
    icArray[3] = parseInt(icArray[3], 10) * 6;
    icArray[4] = parseInt(icArray[4], 10) * 5;
    icArray[5] = parseInt(icArray[5], 10) * 4;
    icArray[6] = parseInt(icArray[6], 10) * 3;
    icArray[7] = parseInt(icArray[7], 10) * 2;

    var weight = 0;
    for(i = 1; i < 8; i++) {
        weight += icArray[i];
    }

   	var offset = (icArray[0] == "T" || icArray[0] == "G") ? 4:0;
    var temp = (offset + weight) % 11;

    var st = ["J","Z","I","H","G","F","E","D","C","B","A"];
    var fg = ["X","W","U","T","R","Q","P","N","M","L","K"];

    var theAlpha;
    if (icArray[0] == "S" || icArray[0] == "T") { theAlpha = st[temp]; }
    else if (icArray[0] == "F" || icArray[0] == "G") { theAlpha = fg[temp]; }

    if(icArray[8] != theAlpha) {
    	document.getElementById('identity').value = "";
        alert("Invalid NRIC/FIN \"" + nric.toUpperCase() + "\" Please retype");
        document.getElementById('identity').focus();
    }
}

function detectOthers() {
    var choice = document.getElementById("category").value;
    if(choice == "Others") {
        document.getElementById('categoryDiv').style.display = 'block';
    }
    else {
        document.getElementById('categoryDiv').style.display = 'none';
        document.getElementById('otherCategory').value = "";
    }

}

function appendTitle() {
    var category = document.getElementById('category').value;
    var time = onTimeChange('timeInput');
    var location = document.getElementById('address').value;

    if(category != "" && time != "" && location != "") {
        if(category == "Others") {
            var otherCategory = document.getElementById('otherCategory').value;
            document.getElementById('title').value = otherCategory + " @ " + location + " @ " + time;
        }
        else {
            document.getElementById('title').value = category + " @ " + location + " @ " + time;
        }
    }
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("identity").value = "";
    document.getElementById("category").value = "";
    document.getElementById("otherCategory").value = "";
    document.getElementById("categoryDiv").style.display = 'none';
    document.getElementById("address").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("green").checked = true;
    document.getElementById("casualty").value = "0";
    getDateTimeNow();
}

function onTimeChange(timeInput) {
  var inputEle = document.getElementById(timeInput);
  var timeSplit = inputEle.value.split(':'),
    hours,
    minutes,
    meridian;
  hours = timeSplit[0];
  minutes = timeSplit[1];
  if (hours > 12) {
    meridian = 'PM';
    hours -= 12;
  } else if (hours < 12) {
    meridian = 'AM';
    if (hours == 0) {
      hours = 12;
    }
  } else {
    meridian = 'PM';
  }
  return (hours + ':' + minutes + ' ' + meridian);
}

window.setTimeout(function() {
    $(".alert").fadeTo(1500, 0).slideUp(1500, function(){
        $(this).remove();
    });
}, 5000);

$(document).on('submit','#operator_form',function(e){
    e.preventDefault();
    var cat = document.getElementById("category").value;
    if (cat == "Others") {
        cat = document.getElementById("otherCategory").value;
        if(cat == "")
        {
            document.getElementById("otherCategory").focus();
            return alert("Please fill in Other Category")
        }
    }
    var opId = document.getElementById("opId").innerText;
    opId = opId.split('ator ')[1];
    opId = opId.split(' ')[0];
    var inputLat = sessionStorage.getItem('lat');
    var inputLng = sessionStorage.getItem('lng');
    var inputTime = document.getElementById("timeInput").value;
    var inputDate = document.getElementById("dateInput").value;
    var casualtyInput = document.getElementById("casualty").value;
    $.ajax({
        type:'POST',
        url:'/gui/operator/' + opId + '/create/report/',
        data:{
            name: $('#name').val(),
            identity: $('#identity').val(),
            date: inputDate,
            time: inputTime,
            category: cat,
            address: $('#address').val(),
            title: $('#title').val(),
            description: $('#description').val(),
            priority: document.forms.operator_form.priority.value,
            casualty: casualtyInput,
            operatorId: opId,
            lat: inputLat,
            lng: inputLng,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        success:function(){
            location.reload();
            $('html, body').animate({ scrollTop: 0 }, 0);
        }
    });
});

function getDateTimeNow() {
    var date = moment().format('YYYY-MM-DD');
    var time = moment().format();
    document.getElementById('dateInput').value = date;
    document.getElementById('timeInput').value = time.slice(11,16);
}

$(document).ready(function(){
    getDateTimeNow();
});


