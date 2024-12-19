# ReactJS + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Tech used:
 ReactTS, Redux, Taildwind, Lodash, React-toastify, AOS animation

## Start Project:
### Start Backend:
- Run file docker compose: docker-compose up -d
- Create database like file initDB.sql in project
- Need to set up connect mysql with username: root and password: 1234
- Open Backend file by IntelliJ IDEA CE then run the following services:
+ api-gateway
+ blog-service
+ identity-service
+ location-service
+ media-service
+ profile-service
+ review-service

#### Swagger service
- identity-service: http:localhost:8080/identity/swagger-ui/index.html
- profile-service: http:localhost:8081/profile/swagger-ui/index.html
- blog-service: http:localhost:8082/blog/swagger-ui/index.html
- location-service: http:localhost:8084/location/swagger-ui/index.html
- trip-service: http:localhost:8085/trip/swagger-ui/index.html
- review-service http:localhost:8086/review/swagger-ui/index.html

### Start Frontend:
 npm install --> npm run dev