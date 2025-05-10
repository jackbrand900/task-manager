# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
