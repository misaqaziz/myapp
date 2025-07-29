# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript project
RUN npm run build

# Expose port (adjust if your app runs on another port)
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
