FROM alpine:latest

RUN apk add --no-cache coturn

# Add entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3478/udp 3478/tcp 5349/tcp 49152-65535/udp

# Use the wrapper
ENTRYPOINT ["/entrypoint.sh"]