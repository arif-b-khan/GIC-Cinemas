FROM node:20 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

FROM nginx:alpine

# Copy the built files to the nginx directory
# Adjust the path to match your actual output directory
COPY --from=build /app/dist/frontend-v1/browser /usr/share/nginx/html

# Create a simple nginx config if you don't have one
RUN echo 'server { \
            listen 80; \
            server_name localhost; \
            root /usr/share/nginx/html; \
            index index.html; \
            location / { \
                try_files $uri $uri/ /index.html; \
            } \
        }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
