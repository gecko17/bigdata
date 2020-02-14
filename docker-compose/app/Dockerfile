# Base image (lowest layer, contains OS files and node.js)
# For details, see https://hub.docker.com/_/node/ and 
# https://github.com/nodejs/docker-node
FROM node:11-alpine

# Set the working directory to /app
WORKDIR /app

# Copy your app sources into the container at /app
ADD index.js /app
ADD package.json /app

# Install any needed packages specified in requirements.txt
RUN npm install

#Add Volume
VOLUME /app/data

# Make port 80 available to the world outside this container
EXPOSE 3000

# Run app.py when the container launches
CMD ["node", "index.js"]
