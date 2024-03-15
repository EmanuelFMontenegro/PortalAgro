FROM node:18.18.2-alpine
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install -g @angular/cli@16.2.9

RUN npm install -g npm@10.5.0
RUN npm install 
#&& npm audit fix --force

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app
#RUN npm run build --prod
#RUN npm install --save-dev https-proxy-agent
#RUN npm install leaflet @types/leaflet
#RUN npm audit fix --force

RUN npm run build 
#RUN ng serve
# Expose the port the app runs on
EXPOSE 4200

# Start the application
CMD ["ng", "serve", "--host", "0.0.0.0"]
#CMD ["npm", "start"]
