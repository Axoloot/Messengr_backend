FROM node:14.15.0

WORKDIR /app
COPY . .

# Install packages from package-lock.json to preserve integrity
RUN npm i

CMD [ "npm", "run", "start:dev" ]
