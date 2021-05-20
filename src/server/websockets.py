import asyncio
import json
from asyncio.events import AbstractEventLoop
from dataclasses import dataclass, field
from typing import Any, Callable, Optional

from websockets import server as WsServer
from websockets.typing import Data

from .types import MsgType, Settings


@dataclass
class Msg:
    type: MsgType
    data: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self: "Msg") -> None:
        self.type = MsgType(self.type)

    @classmethod
    def load(cls: Callable[..., "Msg"], data: Data) -> "Msg":
        return cls(**json.loads(data))

    def dump(self: "Msg") -> str:
        return json.dumps({"type": self.type.value, "data": self.data})


class Server:
    settings: Settings
    event_loop: AbstractEventLoop

    def run(self: "Server") -> None:
        start = WsServer.serve(
            self.__handler,
            self.settings.host,
            self.settings.port,
        )
        self.event_loop.run_until_complete(start)
        print(f"WS server: {self.settings.host=} {self.settings.port=}")
        self.event_loop.run_forever()
        return

    def set_settings(self: "Server", **new_settings: Any) -> None:
        self.settings = Settings(**new_settings)
        return

    def __init__(self: "Server", **settings: Any) -> None:
        self.settings = Settings(**settings)
        self.event_loop = asyncio.get_event_loop()
        return

    async def __handler(
        self: "Server",
        websocket: WsServer.WebSocketServerProtocol,
        path: str,
    ) -> None:
        async for data in websocket:
            msg = Msg.load(data)
            print(f"'{path}' {msg.type.value} \t => {msg.data}")
            coro = self.__route(msg)
            task = self.event_loop.create_task(coro)
            if result := await task:
                await websocket.send(result.dump())
        return

    async def __route(self: "Server", msg: Msg) -> Optional[Msg]:
        if msg.type == MsgType.OK:
            return None

        if msg.type == MsgType.POSE:
            # handle pose message
            return msg

        if msg.type == MsgType.SETTINGS:
            self.set_settings(**msg.data)
            return Msg(type=MsgType.OK)

        return Msg(type=MsgType.ERROR, data={"message": "unexpected type"})


if __name__ == "__main__":
    server = Server()
    server.run()
