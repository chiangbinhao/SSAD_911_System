from channels.generic.websockets import WebsocketDemultiplexer

from .models import ReportBinding

class Demultiplexer(WebsocketDemultiplexer):
    consumers = {
        "report": ReportBinding.consumer,
    }

    groups = ["binding.gui"]