FROM node:13.12.0 as build-deps

ARG ENVIROMENT=staging
ENV ENVIROMENTBUILD=$ENVIROMENT

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./

# build the react app
RUN CI=true yarn test --passWithNoTests
RUN yarn build-${ENVIROMENTBUILD}


FROM nginx:1.17.9
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
