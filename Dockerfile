# build stage
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:alpine
COPY --from=build /app/dist /var/www/link-hub/dist
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]