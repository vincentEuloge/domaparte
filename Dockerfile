FROM node:14.16.1-alpine3.13 AS development
LABEL name 'Domaparte Web App'

RUN apk update && apk upgrade

RUN mkdir /app/
WORKDIR /app/

FROM development AS install

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY  /src/ /app/src/
COPY  /static/ /app/static/

# FROM install AS lint

# COPY .eslintrc.json /app/.eslintrc.json
# COPY tsconfig.json /app/tsconfig.json
# COPY .eslint.gitlab.format.js /app/.eslint.gitlab.format.js

# CMD npm run lint

FROM install AS build

COPY  rollup.config.js /app/rollup.config.js

RUN npm run build

FROM build AS production

EXPOSE 3000
ENTRYPOINT ["npm","start"]