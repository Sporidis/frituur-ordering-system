# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Remove package-lock.json to force a fresh install
RUN rm -f package-lock.json
# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# The NestJS app runs on port 3000 by default
EXPOSE 3000

# Command to run the app in development mode (with hot-reloading)
CMD [ "npm", "run", "start:dev" ]
