# build stage
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:alpine
# copy frontend build
COPY --from=build /app/dist /usr/share/nginx/html

# copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# expose both HTTP and HTTPS
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
