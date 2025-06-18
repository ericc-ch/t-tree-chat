FROM oven/bun:alpine AS builder
WORKDIR /app

COPY ./package.json ./bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM alpine:latest AS runner
ARG PB_VERSION=0.28.3
WORKDIR /app

RUN apk add --no-cache unzip
RUN apk add --no-cache ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /app
RUN rm /tmp/pb.zip

COPY --from=builder /app/pb_public ./pb_public

EXPOSE 8080

CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8080"]
