FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/git-service .

FROM alpine:latest

RUN apk --no-cache add ca-certificates git

WORKDIR /root/

COPY --from=builder /app/git-service .

EXPOSE 8001

CMD ["./git-service"]

