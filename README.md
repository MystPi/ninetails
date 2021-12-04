# Ninetails

![Ninetails banner](https://user-images.githubusercontent.com/86574651/143719384-d3effe33-9f91-4da8-8a6a-01c7fb615062.png)


## Development
```bash
# Clone the repo
git clone https://github.com/MystPi/ninetails.git
cd ninetails

# Install the dependencies
npm install

# Start the app
npm start

# Before making changes involving Tailwind CSS, you should run
npm run tailwind
# to make Tailwind watch for changes
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

## Note about the Android version
The mobile version of Ninetails is completely different from the normal version, and it's source code isn't even in this repo. However, the mobile version will still be released in this repo since it doesn't have anywhere else *to* be released.
