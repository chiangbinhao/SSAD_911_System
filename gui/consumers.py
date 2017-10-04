from channels.generic.websockets import WebsocketDemultiplexer

from .models import ReportBinding

class Demultiplexer(WebsocketDemultiplexer):
    consumers = {
        "intval": ReportBinding.consumer,
    }

    groups = ["binding.gui"]