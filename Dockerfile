# define base image
FROM node:latest

# make the directory (and parent directories if required via -p flag)
RUN mkdir -p /usr/app/
# set working directory within the container
WORKDIR /usr/app
# copy package.json into working directory
COPY package.json /usr/app
# install dependencies within container
RUN npm install
# copy everything from current directory into working directory
COPY . /usr/app/

# expose the port on which the app runs
EXPOSE 9090
# provide default command for container
CMD [ "npm", "start" ]  