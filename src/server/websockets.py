import os
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
    model_dir: Optional[str] = None


@dataclass
class Server:
    repose: Repose
    settings: Settings = Settings()
    pose_matcher: PoseMatcher = PoseMatcher()
    event_loop: AbstractEventLoop = asyncio.get_event_loop()

    def run(self: "Server") -> None:
        host = os.getenv("WEBSOCKETS_HOST", "127.0.0.1")
        port = os.getenv("WEBSOCKETS_PORT", 4242)
        start = WsServer.serve(self.__handler, host, port)
        self.event_loop.run_until_complete(start)
        print(f"WS server: {host=} {port=}")
        self.event_loop.run_forever()
        return

    def set_settings(self: "Server", **new_settings: Any) -> None:
        existing_settings = self.settings
        combined_settings = {**asdict(existing_settings), **new_settings}
        self.settings = Settings(**combined_settings)
        if self.settings.model_dir != existing_settings.model_dir:
            print(f"WS server: loading new models '{self.settings.model_dir}'")
            self.repose = Repose.load(self.settings.model_dir)
        return

    def __init__(self: "Server", **settings: Any) -> None:
        self.set_settings(**settings)

    async def __handler(
        self: "Server",
        websocket: WsServer.WebSocketServerProtocol,
        path: str,
    ) -> None:
        async for data in websocket:
            msg = Msg.load(data)
            coro = self.__route(msg)
            task = self.event_loop.create_task(coro)
            if result := await task:
                await websocket.send(result.dump())
        return

    async def __route(self: "Server", msg: Msg) -> Optional[Msg]:
        if msg.type == MsgType.OK:
            return None

        if msg.type == MsgType.POSE:
            if self.pose_matcher.match_pose(Coco(**msg.data)):
                print("WS server: generating new pose")
                new_pose = Coco.from_tensor(self.repose.generate())
                return Msg(type=MsgType.POSE, data=new_pose.to_json())
            return None

        if msg.type == MsgType.SETTINGS:
            print("WS server: updating settings")
            self.set_settings(**msg.data)
            return Msg(type=MsgType.OK)

        return Msg(type=MsgType.ERROR, data={"message": "unexpected type"})


if __name__ == "__main__":
    server = Server()
    server.run()
