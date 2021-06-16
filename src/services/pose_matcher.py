from dataclasses import dataclass
from typing import Optional

from repose.adapters.coco import Coco

existing_pose = None


# placeholder code until logic for matching poses is worked out
@dataclass
class PoseMatcher:
    pose: Optional[Coco] = None

    def match_pose(self: "PoseMatcher", new_pose: Coco) -> bool:
        if self.pose is None:
            self.pose = new_pose
            return True
        else:
            return False
