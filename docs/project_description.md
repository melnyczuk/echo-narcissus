# Project Description
## The Myth
Echo and Narcissus is a Greco-Roman myth. Our contemporary telling of it comes from to us from Ovid, who wrote the fable in his *Metamorphoses*<sup>[^1]</sup>. It is a tale of love and loss, but also of fate and feedback. Both Echo and Narcissus are doomed to live trapped within circular logics, within loops of fate that ensnare them. 

Echo, for her part is doomed to a life beyond self-expression relying on the words of others to communicate her desires. Hers is an auditory prison but also a linguistic one. Her only escape is through forms of creative reappropriation of words and phrases that bring to mind the cut-up poetry of William S Burroughs (among others)<sup>[^2]</sup>, the aesthetics of sample culture, and the tape led musical compositions of Steve Reich's *Different Trains*<sup>[^3]</sup>.

Narcissus' trap is visual. The youthful mortal object of Echo's desire, he becomes enraptured, when following Echo's voice through the woods, he stumbles upon a tranquil pool populated by his own reflection. Transfixed he stays, hunched over on the bankside, until the Gods' pity transforms him into the homonymic flower.

## The Project
Echo / Narcissus is a work of digital choreography that, whilst adapting the myth, also reflects it thematically and technically. It consists of a dancer and a computer programme, each watching and responding to the other, each making creative decisions within the confines of their shared feedback loop.

The central figure is a solo dancer lit by a single spot light, transfixed on a screen on the floor at the front of the stage. On this screen are images of the dancer themselves in a variety of poses. Initially, these images will be photographs chosen by the computer, but the eventual goal is to have the computer generate these themselves using a generative adversarial network trained on archival choreography documents<sup>[^4]</sup>.

Each of these images forms the score for the dancer to arrive at in their own time, by whatever means they choose. Sat atop the video screen that the dancer watches is a webcam that feeds the performance back to the computer. Through real-time video analysis, the computer uses a machine learning model to estimate if the dancer's pose matches that of the image<sup>[^5]</sup>. The instant this happens, that the dancer aligns themselves with their own image, triggers the computer to generate a new image to begin the cycle again.

The audience becomes complicit in this tension between the two performs, human and computer. The image from the computer is projected large behind the performance, inviting the audience to anticipate the conclusion of each cycle, waiting for that moment when body and image align. The alignment also triggers the musical score to change key, heightening the atmosphere of a tension waiting to break, only to repeat itself.

<!-- Refs -->
[^1]: https://www.gutenberg.org/files/21765/21765-h/files/Met_I-III.html#bookIII_fableVI
[^2]: https://ubu.com/papers/burroughs_gysin.html
[^3]: https://www.youtube.com/watch?v=1E4Bjt_zVJc
[^4]: https://arxiv.org/abs/1801.00055
[^5]: https://www.tensorflow.org/lite/models/pose_estimation/overview
