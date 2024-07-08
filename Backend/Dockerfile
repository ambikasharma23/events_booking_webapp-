FROM node:20-alpine

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Expose the port the app runs on.
EXPOSE 3001

# Define the command to run the app.
CMD ["npm", "start"]
