# PlaceGuesser

Open the app [here](https://placeguesser.vercel.app/).

### Description 

I wrote this application since I really like geography games. The basic idea is that you get images from random places around the world and you have to guess where it is on the map, the closer you get the more points you get.

This is inspired from Geuguessr but instead of using streetview I am using images from places on Google maps. I find the idea of using map images instead of streetview very interesting. First of all the images have basically a global coverage, instead streetview is not available in all countries around the globe. Also with photos you get to see a lot of places and panoramas that you would not be able to see from the street.

This web app is developed with Angular as a Frontend framework with Material for the UI. In the backend I use Express Js with Supabase for the database to store all places around the world, and to handle authenticaion. I am using Google Map APIs to get the photos of a place and for the embedded interactive map. The app is developed to be responsive so that it is mobile friendly.

Tech stack: Frontend : Angular, Material. Backend: Node.js, Express, Supabase, PostgreSQL
