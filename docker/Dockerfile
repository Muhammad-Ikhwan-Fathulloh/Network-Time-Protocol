FROM debian:stable-slim
RUN apt-get update && apt-get install -y ntp && rm -rf /var/lib/apt/lists/*
COPY ntp.conf /etc/ntp.conf
CMD ["ntpd", "-n"]