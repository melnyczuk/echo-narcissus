import asyncio
import json
from asyncio.events import AbstractEventLoop
from dataclasses import dataclass
from typing import Any, Optional

import websockets
from websockets.server import WebSocketServerProtocol


@dataclass
class Settings:
    host: str = "127.0.0.1"
    port: int = 4242
    model_dir: str = "data"


@dataclass
class Result:
    data: Optional[str] = None
    error: Optional[str] = None

    def dump(self: "Result") -> str:
        return json.dumps(self.__dict__)


class Server(object):
    settings: Settings
    event_loop: AbstractEventLoop

    def run(self: "Server") -> None:
        start = websockets.serve(
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
        print(f"Settings: {self.settings}")
        return

    def __init__(self: "Server", **settings: Any) -> None:
        self.settings = Settings(**settings)
        self.event_loop = asyncio.get_event_loop()
        return

    async def __handler(
        self: "Server",
        websocket: WebSocketServerProtocol,
        path: str,
    ):
        data = await websocket.recv()
        print(f"{path=} => {data=}")
        result = Result(data="OK")
        await websocket.send(result.dump())
        return


if __name__ == "__main__":
    server = Server()
    server.run()
