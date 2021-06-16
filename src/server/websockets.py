import asyncio
from asyncio.events import AbstractEventLoop
from dataclasses import asdict, dataclass
from typing import Any, Optional

from repose import Repose
from repose.adapters import Coco
from websockets import server as WsServer

from ..services.pose_matcher import PoseMatcher
from .messages import Msg, MsgType


@dataclass(eq=True, frozen=True)
class Settings:
    host: str
    port: int
    model_dir: str
    weights: str


default_settings = Settings(
    host="127.0.0.1",
    port=4242,
    model_dir="data",
    weights="weights",
)

pose_matcher = PoseMatcher()


@dataclass
class Server:
    repose: Repose
    settings: Settings = default_settings
    event_loop: AbstractEventLoop = asyncio.get_event_loop()

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
        existing_settings = asdict(self.settings)
        combined_settings = {**existing_settings, **new_settings}
        self.settings = Settings(**combined_settings)
        return

    def __init__(self: "Server", **settings) -> None:
        self.set_settings(**settings)
        self.repose = Repose.load(self.settings.weights)

    async def __handler(
        self: "Server",
        websocket: WsServer.WebSocketServerProtocol,
        path: str,
    ) -> None:
        async for data in websocket:
            msg = Msg.load(data)
            print(f"'{path}' => {msg.type.value}")
            coro = self.__route(msg)
            task = self.event_loop.create_task(coro)
            if result := await task:
                await websocket.send(result.dump())
        return

    async def __route(self: "Server", msg: Msg) -> Optional[Msg]:
        if msg.type == MsgType.OK:
            return None

        if msg.type == MsgType.POSE:
            if pose_matcher.match_pose(Coco(**msg.data)):
                new_pose = Coco.from_tensor(self.repose.generate())
                return Msg(type=MsgType.POSE, data=new_pose.to_json())
            else:
                return None

        if msg.type == MsgType.SETTINGS:
            self.set_settings(**msg.data)
            return Msg(type=MsgType.OK)

        return Msg(type=MsgType.ERROR, data={"message": "unexpected type"})


if __name__ == "__main__":
    server = Server()
    server.run()
