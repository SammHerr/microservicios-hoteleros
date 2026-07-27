# Etapa 1: compilar el API Gateway
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline

COPY src/ src/

RUN ./mvnw clean package -DskipTests


# Etapa 2: ejecutar el API Gateway
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/target/*.jar application.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "application.jar"]