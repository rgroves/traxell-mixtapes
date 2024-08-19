# Traxell Mixtapes

This project was originally built for [Jason Lengstorf's](https://www.learnwithjason.dev/) [Web Dev Challenge Hackathon (E-comm Edition)](https://www.learnwithjason.dev/blog/web-dev-challenge-hackathon-algolia).

## Idea

The goal of the hackathon was to build out an e-commerce site (with a twist) using technology from [Algolia](https://www.algolia.com/) - "the one-stop shop for AI search."

My idea was to build a music e-comm site. The twist to this site is that the "shopping cart" is limited to a mixtape in size. A shopper would go into the experience knowing that they have a 60-minute mixtape to fill (a 30 minute A-Side and 30 minute B-Side). They'll have to choose a name for their mix and carefully [curate the perfect selection of songs](https://www.youtube.com/watch?v=wV7ORIKMCa8&t=26s).

## Overview

- You have a (virtual) 60 minute cassette tape
- You need to craft your perfect A-Side and B-Side
- You start by searching for and selecting your initial track with search powered by [Algolia](https://www.algolia.com/doc/)
- [Algolia powered recommendations](https://www.algolia.com/doc/guides/algolia-recommend/overview/) will be made for the next track based on the last selected track
- You can choose from the recommendations or search for another
- Complete until the entire cassette is filled
- Purchase your tracks

## MVP Ideas

- Guests (non-authenticated) can build and view mixtapes, but cannot save mixtapes.
- Users (authenticated) can build, view, and save mixtapes.
- [x] Music selection limited to sampling from only one genre / time-period of music to limit data for the demo
- [x] Mock purchasability
- [x] Easter 🥚🥚🥚🥚? Of course.

## Future Possibilities

- Wider music selection
- Edit mixtapes
- Allow shopper to switch between mixtape lengths: 60-minute, 90-minute, and 120-minute.
- Compare two mixtapes
- Create mixtape from existing
- Music library integration
- Music Platform integrations
