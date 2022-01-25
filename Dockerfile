FROM lsiobase/ubuntu:focal

ARG VERSION
ARG MODULE
ARG ROOT_CP

# hardware env
ENV \
 LIBVA_DRIVERS_PATH="/usr/lib/x86_64-linux-gnu/dri" \
 LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu" \
 NVIDIA_DRIVER_CAPABILITIES="compute,video,utility" \
 NVIDIA_VISIBLE_DEVICES="all" \
 HANDBRAKE=1.3.3

ENV WEB_UI_PORT="8265" SERVER_PORT="8266" NODE_PORT="8267" PUID="1000" PGID="1000" UMASK="002" TZ="Etc/UTC" HOME="/home/Tdarr"

RUN apt-get update &&  \
        apt-get install -y \
            software-properties-common \
            git \
            trash-cli && \
    mkdir -p \
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
        "https://tdarrs.s3.us-west-000.backblazeb2.com/versions/$VERSION/linux_x64/$MODULE.zip" && \
        unzip -q /tmp/$MODULE.zip -d /app/$MODULE -x *.exe && \
        # FFmpeg
        apt install -y wget && \
        wget https://repo.jellyfin.org/releases/server/ubuntu/versions/jellyfin-ffmpeg/4.3.2-1/jellyfin-ffmpeg_4.3.2-1-focal_amd64.deb && \
        apt install -y \
        ./jellyfin-ffmpeg_4.3.2-1-focal_amd64.deb && \
        ln -s /usr/lib/jellyfin-ffmpeg/ffmpeg /usr/local/bin/ffmpeg && \
        # apt-get install -y ffmpeg && \
     
        # Intel deps
        curl -s https://repositories.intel.com/graphics/intel-graphics.key | apt-key add - && \
        echo 'deb [arch=amd64] https://repositories.intel.com/graphics/ubuntu focal main' > /etc/apt/sources.list.d/intel-graphics.list && \
        apt-get update && \
        apt-get install -y --no-install-recommends \
            intel-media-va-driver-non-free \
            vainfo \
            mesa-va-drivers && \

        # HandBrake deps
        apt-get install -y \
            autoconf \
            automake \
            autopoint \
            appstream \
            build-essential \
            cmake \
            git \
            libass-dev \
            libbz2-dev \
            libfontconfig1-dev \
            libfreetype6-dev \
            libfribidi-dev \
            libharfbuzz-dev \
            libjansson-dev \
            liblzma-dev \
            libmp3lame-dev \
            libnuma-dev \
            libogg-dev \
            libopus-dev \
            libsamplerate-dev \
            libspeex-dev \
            libtesseract4 \
            libtheora-dev \
            libtool \
            libtool-bin \
            libturbojpeg0-dev \
            libvorbis-dev \
            libx264-dev \
            libxml2-dev \
            libvpx-dev \
            m4 \
            make \
            meson \
            nasm \
            ninja-build \
            patch \
            pkg-config \
            python \
            tar \
            zlib1g-dev \
            libva-dev \
            libdrm-dev && \

        rm -rdf /tmp/handbrake && \
        mkdir -p /tmp/handbrake && \
        git clone \
            --branch ${HANDBRAKE} \
            --depth 1 https://github.com/HandBrake/HandBrake.git \
            /tmp/handbrake && \
        cd /tmp/handbrake && \
        ./configure \
            --enable-nvenc \
            --enable-qsv \
            --enable-x265 \
            --disable-gtk \
            --launch-jobs=14 \
            --launch \
            --force && \
        make --directory=build install && \
        cp /tmp/handbrake/build/HandBrakeCLI /usr/local/bin/HandBrakeCLI && \
        rm -rdf /tmp/handbrake/ ; \
    fi \
    && \
    if uname -m | grep -q aarch64; then \
        curl -o /tmp/$MODULE.zip -L \
        "https://tdarrs.s3.us-west-000.backblazeb2.com/versions/$VERSION/linux_arm64/$MODULE.zip" && \
        unzip -q /tmp/$MODULE.zip -d /app/$MODULE -x *.exe && \
        apt-get install -y handbrake-cli ffmpeg ; \
    fi \
    && \
    if uname -m | grep -q armv7l; then \
        curl -o /tmp/$MODULE.zip -L \
        "https://tdarrs.s3.us-west-000.backblazeb2.com/versions/$VERSION/linux_arm/$MODULE.zip"  && \
        unzip -q /tmp/$MODULE.zip -d /app/$MODULE -x *.exe && \
        apt-get install -y handbrake-cli ffmpeg ; \
    fi && \
    rm -rdf /tmp/$MODULE.zip && \
    trash-empty

COPY $ROOT_CP/ /
EXPOSE ${NODE_PORT}
EXPOSE ${WEB_UI_PORT}
EXPOSE ${SERVER_PORT}
ENTRYPOINT ["/init"]
