<img width="1500" alt="Ninetails' banner" src="https://user-images.githubusercontent.com/86574651/147876286-e0f179a9-b456-4c82-b672-380c0a30da3f.png">

<p align="center">
  <img src="https://img.shields.io/github/v/release/mystpi/ninetails?style=for-the-badge">
  <img src="https://img.shields.io/github/languages/top/mystpi/ninetails?color=yellow&style=for-the-badge">
  <img src="https://img.shields.io/github/downloads/mystpi/ninetails/total?style=for-the-badge">
  <br>
  <a href="https://www.producthunt.com/posts/ninetails?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ninetails" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=322567&theme=light" alt="Ninetails - A private, fast, and beautiful web browser | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>

Ninetails is a private, fast, and beautiful web browser that's created with Electron and styled with Tailwind CSS. Enjoy a clean and unique experience while surfing the web.

In this age where many browsers track their users, it's nice to have a break from telemetry and browse privately. Ninetails never collects any data, and is 100% telemetry free!

New things are constantly being added to Ninetails, so be on the lookout for new releases. You can view some features and fixes that are in the works on [this board](https://github.com/MystPi/ninetails/projects/1).

## Screenshots
![image](https://user-images.githubusercontent.com/86574651/158018722-68023be6-b8a4-43b8-b1c9-16bdf886c744.png)

![image](https://user-images.githubusercontent.com/86574651/158018748-45ddc408-30b9-4baf-8ee0-4cad28fdbd48.png)

## Development
```bash
# Clone the repo
git clone https://github.com/MystPi/ninetails.git
cd ninetails

# Install the dependencies
npm install

# Start the app
npm run dev
# This runs `npm start` and `npm run tailwind` concurrently
```

## Building the app
```bash
# Clone the repo
git clone https://github.com/MystPi/ninetails.git
cd ninetails

# Install the dependencies
npm install

# Make the app
npm run make

# The built app should be located at `./out/make/{filetype}/{architecture}/{filename}.{filetype}`
# Eg. `./out/make/deb/arm64/ninetails_1.0.0_arm64.deb`
```

## The Android app has been discontinued
You can still download the last version, but Ninetails desktop is recommended.
