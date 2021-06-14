from dataclasses import dataclass
from enum import Enum
from typing import List


class MsgType(Enum):
    OK = "OK"
    ERROR = "ERROR"
    SETTINGS = "SETTINGS"
    POSE = "POSE"
    IMAGE = "IMAGE"


@dataclass(eq=True, frozen=True)
class Settings:
    host: str
    port: int
    model_dir: str


@dataclass(eq=True, frozen=True)
class PoseKeyPoint:
    x: float
    y: float
    score: float
    name: str


@dataclass(eq=True, frozen=True)
class Pose:
    "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/README.md#pose-estimation"  # noqa: E501
    score: float
    keypoints: List[PoseKeyPoint]

    def __init__(self: "Pose", score=None, keypoints=None):
        object.__setattr__(self, "score", score)
        object.__setattr__(
            self,
            "keypoints",
            [PoseKeyPoint(**kp) for kp in keypoints],
        )
