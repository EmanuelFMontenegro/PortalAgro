

FROM node:18.18.2-alpine AS build
# Set the working directory inside the container

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@11.0.7
RUN npm install ngx-spinner
COPY . /app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN npm run build 
#--output-path=dist

FROM nginx:1.16.0-alpine

COPY --from=build /app/dist/portal-productores/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


#COPY nginx.conf /etc/nginx/nginx.conf
#COPY --from=build /code/dist/portal-productores/ /usr/share/nginx/html


# Start the application
#CMD ["ng", "serve","--disable-host-check"]
#CMD ["npm", "start"]


#EXPOSE 4200
#EXPOSE 80

# Start the application
#CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
#CMD ["npm", "start"]

#CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
#CMD ["npm", "start"]
