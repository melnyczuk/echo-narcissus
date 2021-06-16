from fire import Fire  # type: ignore
from repose import Repose
from repose.adapters import Coco, CocoDataset
from torch.utils.data import DataLoader


class CLI:
    def __init__(self: "CLI"):
        Fire(self)

    def train(
        self: "CLI",
        batch: int = 100,
        epochs: int = 1,
        samples: str = None,
        train: str = None,
        weights: str = None,
        workers: int = 1,
    ) -> None:
        repose = Repose(Coco.LENGTH)
        train_loader = DataLoader(
            CocoDataset(train),
            batch_size=batch,
            num_workers=workers,
        )
        repose.train(train_loader, epochs, save_path=samples)
        repose.save(weights)
        output = Coco.from_tensor(repose.generate())
        print(f"{output=}")

    def test(self: "CLI", weights: str = None) -> None:
        repose = Repose.load(weights)
        output = Coco.from_tensor(repose.generate())
        print(f"{output=}")


if __name__ == "__main__":
    CLI()
