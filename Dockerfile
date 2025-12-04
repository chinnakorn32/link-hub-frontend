# build stage
FROM node:20 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# SSL (optional)
COPY ssl /etc/nginx/ssl

# copy frontend build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]