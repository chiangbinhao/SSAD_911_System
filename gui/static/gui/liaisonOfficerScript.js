function UpdatePKFunction(pk) {
    pk = pk
    jQuery.ajax({
        url: '/gui/lo/' + pk,
        success: function (data) {
            $('#DetailView').html(data);
        }
    });
};

$(function () {
    var ws_path = "/stream/";
    console.log("Connecting to " + ws_path);
    var webSocketBridge = new channels.WebSocketBridge();
    webSocketBridge.connect(ws_path);
    webSocketBridge.listen();
    webSocketBridge.demultiplex('intval', function (payload, streamName) {
        // Handle different actions
        if (payload.action == "create") {
            var content = "<li class=\"nav-item\" data-value-id='" + payload.pk + "'>" +
                "<a onclick='UpdatePKFunction("+ payload.pk  + ")' class=\"nav-link\" href=\"#\">" + payload.data.Title + "</a></li>";

            if (payload.data.Priority =="red")
                $("#redreports").prepend(content);
            if (payload.data.Priority == "yellow")
                $("#yellowreports").prepend(content);
            if (payload.data.Priority == "green")
                $("#greenreports").prepend(content);
            // Remove empty message
            $("#reports .empty").remove();
        } else if (payload.action == "update") {
            $("p[data-value-id=" + payload.pk + "] label").text(payload.data.name);
        } else if (payload.action == "delete") {
            $("li[data-value-id=" + payload.pk + "]").remove();
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