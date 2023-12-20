# Twitch Overlay!

This is a *Twitch Overlay*. This project uses websockets to connect with Twitch's event subscription service to allow for real time follower notifications. This is/was intended for use in OBS where only a single first-time sign on is necessary per account. This supports quality of life cases such as refresh token handling so on the off chance a broadcast outlasts the lifetime of an auth token, no worries! This is meant to be *uber* customizable, meaning adding html + css with react to make whatever visuals. This simply provides a service as an example on how to sub to Twitch's event sub subscription. Generally, subcriptions to other events, like donations + bits cheered, is trivial.

## Setup

For personal use, this project needs some secrets to work correctly. The exact list can be found in the .env.example file which details precisely what is required. Some of these things are non-trivial like a client-id, client-secret, user access token (for the websocket), and user id for which the overlay is intended. So, plugging in the values into the .env-local file is all that is necessary.

The majority of the actual content code can be found in the src/pages/main directory.


## Demo
Demo of notification pop-up and sound.

https://user-images.githubusercontent.com/78038984/209303063-07fc3771-aa90-48d2-87d8-98b0b2efd110.mp4

