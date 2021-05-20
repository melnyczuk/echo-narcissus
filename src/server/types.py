from dataclasses import dataclass
from enum import Enum
from typing import List


class MsgType(Enum):
    OK = "OK"
    ERROR = "ERROR"
    SETTINGS = "SETTINGS"
    POSE = "POSE"
    IMAGE = "IMAGE"


@dataclass
class Settings:
    host: str = "127.0.0.1"
    port: int = 4242
    model_dir: str = "data"


@dataclass
class PoseKeyPoint:

    x: float
    y: float
    score: float
    name: str


@dataclass
class Pose:
    "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/README.md#pose-estimation"  # noqa: E501
    score: float
    keypoints: List[PoseKeyPoint]
