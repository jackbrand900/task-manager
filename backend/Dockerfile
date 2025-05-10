# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy all backend code into the container
COPY . .

# Expose backend port
EXPOSE 5000

# Run the backend server
CMD ["node", "index.js"]
