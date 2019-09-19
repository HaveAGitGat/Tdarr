FROM alpine:3.10

ENV MONGO_URL=mongodb://mongodb:27017/Tdarr
ENV PORT=8265
ENV ROOT_URL=http://localhost/

RUN \
  apk add --no-cache \
	nodejs \
	unzip && \
  apk add --no-cache --repository="http://dl-cdn.alpinelinux.org/alpine/edge/testing" \
    ffmpeg \
    handbrake \
    handbrake-gtk && \
  wget -O Tdarr.zip https://github.com/HaveAGitGat/Tdarr/releases/download/0.1-pre-alpha/Tdarr-Linux-01-pre-alpha.zip && \
  mkdir -p /app && unzip Tdarr.zip -d /app && \
  rm Tdarr.zip

EXPOSE 8265
WORKDIR /app/Tdarr/bundle
CMD ["node", "main.js"]