from fire import Fire  # type: ignore


class CLI:
    def __init__(self: "CLI"):
        Fire(self)


if __name__ == "__main__":
    CLI()
