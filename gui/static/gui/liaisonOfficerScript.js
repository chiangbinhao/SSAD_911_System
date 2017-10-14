function UpdatePKFunction(pk) {
    jQuery.ajax({
        url: '/lo/' + sessionStorage.getItem('pk') + '/' + sessionStorage.getItem('loId') + '/retrieve/report/' + pk + '/',
        success: function (data) {
            var addclass = 'highlightDiv';
            $('#reportDetails').html(data);
            $('.individualTabContent').removeClass(addclass);
            $('#'+pk).addClass(addclass);
            var itemUrl = $(this)[0].url;
            itemUrl = itemUrl.split('ort/')[1];
            //sessionStorage.setItem('divId', document.getElementById("incidentID").innerHTML.split(': ')[1]);
            sessionStorage.setItem('divId', "C" + (parseInt(pk)-1).toString());
            $("#reportDetails").show();
        }
    });
};

$(function () {
    var ws_path = "/stream/";
    console.log("Connecting to " + ws_path);
    var webSocketBridge = new channels.WebSocketBridge();
    webSocketBridge.connect(ws_path);
    webSocketBridge.listen();
    webSocketBridge.demultiplex('report', function (payload, streamName) {
        // Handle different actions
        if (payload.action == "create") {
            var content = "<div class=\"individualTabContent\" id=\"" + payload.pk + "\"><a onclick='UpdatePKFunction("+ payload.pk + ")' class=\"nav-link\" href=\"#\">" + payload.data.Title + "</a></div>"

            if (payload.data.Priority =="red") {
                $("#redTab").append(content);
                var redcount = $("#redTab div").length;
                $("#redcount").html(redcount);
                // Remove empty message
                $("#redTab .empty").remove();
            }
            if (payload.data.Priority == "yellow") {
                $("#yellowTab").append(content);
                var yellowcount = $("#yellowTab div").length;
                $("#yellowcount").html(yellowcount);
                // Remove empty message
                $("#yellowTab .empty").remove();
            }
            if (payload.data.Priority == "green") {
                $("#greenTab").append(content);
                var greencount = $("#greenTab div").length;
                $("#greencount").html(greencount);
                // Remove empty message
                $("#greenTab .empty").remove();
            }
        } else if (payload.action == "update") {
            $("div[id=" + payload.pk + "]").remove();
            updatecount();
        } else if (payload.action == "delete") {
            $("div[id=" + payload.pk + "]").remove();
        } else {
            console.log("Unknown action " + payload.action);
        }
    });

    // Helpful debugging
    webSocketBridge.socket.addEventListener('open', function () {
        console.log("Connected to notification socket");
    });
    webSocketBridge.socket.addEventListener('close', function () {
        console.log("Disconnected to notification socket");
    });
});

window.setTimeout(function() {
    $(".alert").fadeTo(1500, 0).slideUp(1500, function(){
        $('.alert').hide();
    });
}, 5000);

window.addEventListener('load',function(){
    var url = window.location.href;
    url = url.split('lo/')[1];
    var pk = url.split('/')[0];
    var loId = url.split('/')[1];
    loId = loId.split('/')[0];
    sessionStorage.setItem('pk', pk);
    sessionStorage.setItem('loId', loId);
    if(sessionStorage.getItem('first')) {
        var tabid = sessionStorage.getItem('first');
        $('#reportTabs a[href=\"' + tabid + '\"]').tab('show')
        $(tabid).find('a').first().trigger('click');
        sessionStorage.removeItem('first');
    } else {
        var firstDiv = $("#redTab:first-child").attr("id");
        $('#' + firstDiv).find('a').first().trigger('click');
    }
    updatecount();

});

$(document).on('submit','#lo_noncrisis_button_form',function(e){
    e.preventDefault();
    var incidentid = sessionStorage.getItem('divId');
    $.ajax({
        type:'POST',
        url:'update/report/' + incidentid + '/',
        data:{
            crisis: "n",
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        success:function(data){
            if(data) {
                var strId = "#" + (parseInt(incidentid.split('C')[1]) + 1).toString();
                var id = $(strId).parent().attr("id");
                $(strId).remove();
                var numOfItems = $("#"+id).children().length;
                if(numOfItems == 0) {
                    var li = document.createElement("li");
                    var node = document.createTextNode("There are no " + capitalizeFirstLetter(id.split('Tab')[0]) + " Priority Report available to authenticate.");
                    li.appendChild(node);
                    li.classList.add("empty");
                    var element = document.getElementById(id);
                    element.appendChild(li);
                    $("#reportDetails").hide();
                } else {
                    sessionStorage.setItem('first', '#' + id);
                }
                location.reload();
            }
        }
    });
});

$(document).on('submit','#lo_crisis_button_form',function(e){
    /*e.preventDefault();
    var incidentid = sessionStorage.getItem('divId');
    $.ajax({
        type:'POST',
        url:'update/report/' + incidentid + '/',
        data:{
            crisis: "n",
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        success:function(data){
            if(data) {
                $("#" + (parseInt(incidentid.split('C')[1]) + 1).toString()).remove();
                var firstDiv = $("#" + $("ul#reportTabs li.active").text().replace(/ /g,'').replace(/(\r\n|\n|\r)/gm,"").toLowerCase() + "Tab:first-child").attr("id");
                console.log(firstDiv);
                $('#' + firstDiv).find('a').first().trigger('click');
                $('html, body').animate({ scrollTop: 0 }, 0);
            }
        }
    });*/
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updatecount(){
    var redcount = $("#redTab div").length;
    $("#redcount").html(redcount);
    var yellowcount = $("#yellowTab div").length;
    $("#yellowcount").html(yellowcount);
    var greencount = $("#greenTab div").length;
    $("#greencount").html(greencount);
}