FROM node:lts-alpine AS builder
WORKDIR /app

RUN npm i -g corepack
RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM alpine:latest AS runner
ARG PB_VERSION=0.28.3
WORKDIR /app

RUN apk add --no-cache unzip
RUN apk add --no-cache ca-certificates

# Copy pocketbase from locally installed binary
# remember to remove the binary from .dockerignore if you want to do this
# COPY ./pocketbase /app/pocketbase

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /app
RUN rm /tmp/pb.zip

# Enable these when you have migrations / hooks
# COPY --from=builder /app/pb_hooks ./pb_hooks
# COPY --from=builder /app/pb_migrations ./pb_migrations
COPY --from=builder /app/pb_public ./pb_public

EXPOSE 8080

CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8080"]