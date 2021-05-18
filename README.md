# Echo & Narcissus

Orchestrating improvisational dance scores through [MoveNet Lightning](https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/3) & [PoseGAN](https://github.com/AliaksandrSiarohin/pose-gan).

![](https://upload.wikimedia.org/wikipedia/commons/9/9c/John_William_Waterhouse_-_Echo_and_Narcissus_-_Google_Art_Project.jpg)

Architecture: https://miro.com/app/board/o9J_lDs3wGc=/ \
PoseGAN paper: https://arxiv.org/abs/2006.12712

## Development

This project uses both [yarn](https://yarnpkg.com/) and [pipenv](https://pipenv.pypa.io/) \
Running the main electron app will start the python server

| command | description |
| --- | --- |
| `yarn install` | install the dependencies<br>(note: also runs `pipenv install`) |
| `pipenv install` | install python dependencies |
| `pipenv install --dev` | install python dev dependencies |
| `yarn start` | start the main electron app |
| `yarn dev`   | run the app in dev mode<br>(note: files in `src/client/public` will not update) |
| `pipenv run cli` | run the python services individually using the cli <br> (note: running this will print further usage) |

Checks for both TS and Python can be run using:
| command | description |
| --- | --- |
| `yarn format` | run prettier |
| `pipenv run format` | run black |
| `yarn lint` | run eslint |
| `yarn lint:fix` | run eslint and apply fixes |
| `pipenv run lint` | run flake8 |
| `pipenv run sort` | run isort |
| `yarn typecheck` | run typescript type checks |
| `pipenv run typecheck` | run mypy type checks |

A pre-commit hook will run all checks before you can push 🤷‍♀️ (sorry not sorry)
