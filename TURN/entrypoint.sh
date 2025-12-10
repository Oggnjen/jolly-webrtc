#!/bin/sh
set -e

# Generate minimal turnserver.conf from env vars
cat > /tmp/turnserver.conf <<EOF
listening-port=3478
tls-listening-port=5349
external-ip=${EXTERNAL_IP}
realm=${TURN_REALM:-yourdomain.com}

# Static user from env
user=${TURN_USER}:${TURN_PASSWORD}

# Security & relay
no-loopback-peers
no-multicast-peers
min-port=49152
max-port=65535

# Optional: log to stdout (good for Docker)
log-file=stdout
EOF

# Validate required env vars
if [ -z "$EXTERNAL_IP" ] || [ -z "$TURN_USER" ] || [ -z "$TURN_PASSWORD" ]; then
  echo "ERROR: EXTERNAL_IP, TURN_USER, and TURN_PASSWORD must be set."
  exit 1
fi

# Start coturn with generated config
exec turnserver -c /tmp/turnserver.conf --no-stdout-log --simple-log