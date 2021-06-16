import json
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable

from websockets.typing import Data


class MsgType(Enum):
    OK = "OK"
    ERROR = "ERROR"
    SETTINGS = "SETTINGS"
    POSE = "POSE"
    IMAGE = "IMAGE"


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
