FROM gradle:8.14-jdk17 AS builder
WORKDIR /home/gradle/project

COPY build.gradle settings.gradle /home/gradle/project/

RUN gradle dependencies --no-daemon || true

COPY --chown=gradle:gradle . .
RUN gradle bootJar -x test --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /home/gradle/project/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/app.jar"]