FROM linuxserver/ffmpeg

ARG VERSION
ARG MODULE
ARG ROOT_CP
ENV WEB_UI_PORT="8265" SERVER_PORT="8266" NODE_PORT="8267" PUID="1000" PGID="1000" UMASK="002" TZ="Etc/UTC" HOME="/home/Tdarr"
RUN mkdir -p \
        /app \
        /logs \
        /temp \
        "${HOME}" && \
    useradd -u ${PUID} -U -d ${HOME} -s /bin/false Tdarr && \
    usermod -G users Tdarr && \
    mkdir -p /app/$MODULE  && \
    apt-get update && apt-get install -y curl unzip && \
    if uname -m | grep -q x86; then \
        curl -o /tmp/$MODULE.zip -L \
        "https://tdarrs.s3.us-west-000.backblazeb2.com/versions/$VERSION/linux_x64/$MODULE.zip" ; \
    fi \
    && \
    if uname -m | grep -q aarch64; then \
        curl -o /tmp/$MODULE.zip -L \
        "https://tdarrs.s3.us-west-000.backblazeb2.com/versions/$VERSION/linux_arm64/$MODULE.zip" ; \
    fi \
    && \
    if uname -m | grep -q armv7l; then \
        curl -o /tmp/$MODULE.zip -L \
        "https://tdarrs.s3.us-west-000.backblazeb2.com/versions/$VERSION/linux_arm/$MODULE.zip" ; \
    fi

RUN unzip -q /tmp/$MODULE.zip -d /app/$MODULE -x *.exe

COPY $ROOT_CP/ /
EXPOSE ${NODE_PORT}
EXPOSE ${WEB_UI_PORT}
EXPOSE ${SERVER_PORT}
ENTRYPOINT ["/init"]