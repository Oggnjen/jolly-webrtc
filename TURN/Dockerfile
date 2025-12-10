# Dockerfile
FROM alpine:latest

# Install coturn and clean up
RUN apk add --no-cache coturn

# Create directory for logs and certs (optional)
RUN mkdir -p /var/log/turnserver /etc/coturn/certs

# Expose STUN/TURN ports
# - 3478: STUN/TURN (UDP/TCP)
# - 5349: STUN/TURN over TLS (TCP)
# - 49152-65535: TURN relay ports (UDP/TCP)
EXPOSE 3478/udp 3478/tcp 5349/tcp 49152-65535/udp 49152-65535/tcp

# Copy configuration file
COPY turnserver.conf /etc/turnserver.conf

# Default command
CMD ["turnserver", "-c", "/etc/turnserver.conf", "--no-stdout-log"]