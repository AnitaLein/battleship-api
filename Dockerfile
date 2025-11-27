# Use Node.js LTS version as the base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS app
RUN npm run build
# Prune dev deps
RUN npm prune --production

# Expose the port on which your app will run
EXPOSE 8080

# Start the NestJS app
CMD ["npm", "run", "start:prod"]
