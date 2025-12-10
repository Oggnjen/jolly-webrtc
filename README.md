Command for running TURN server:

docker run -d \
  --network=host \
  -e EXTERNAL_IP="123.45.67.89" \
  -e TURN_USER="webrtc" \
  -e TURN_PASSWORD="supersecret123" \
  -e TURN_REALM="yourdomain.com" \
  --restart unless-stopped \
  coturn-custom
