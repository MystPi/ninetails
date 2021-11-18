# ninetails
A fun and simple little web browser made with Electron

## Development
```bash
# Clone the repo
git clone https://github.com/MystPi/ninetails.git
cd ninetails

# Install the dependencies
npm install

# Start the app
npm start
```

## HELP WANTED!
I would like to distribute Ninetails to as many platforms as possible. Currently, I only have access to an arm64 Linux machine so I can only build for arm64 Linux. Please follow the steps below to add your platform/architecture to the releases!

```bash
# Clone the repo
git clone https://github.com/MystPi/ninetails.git
cd ninetails

# Install the dependencies
npm install

# Make the app
npm run make

# Submit a PR adding the file located at `ninetails/out/make/{filetype}/{architecture}/` to the `releases` directory.
```
Thank you, it helps a lot!
