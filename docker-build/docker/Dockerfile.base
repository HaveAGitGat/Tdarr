FROM lsiobase/ubuntu:noble

ENV \
    LIBVA_DRIVERS_PATH="/usr/lib/x86_64-linux-gnu/dri" \
    LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu" \
    NVIDIA_DRIVER_CAPABILITIES="compute,video,utility" \
    NVIDIA_VISIBLE_DEVICES="all" \
    HANDBRAKE="1.10.2" \
    FFMPEGVERSION="7.1.2-1"

ENV WEB_UI_PORT="8265" SERVER_PORT="8266" NODE_PORT="8267" PUID="1000" PGID="1000" UMASK="002" TZ="Etc/UTC" HOME="/home/Tdarr"
# ========================================================================================
#                                   Install dependencies
# ========================================================================================
RUN apt-get update &&  \
    apt-get install -y \
    software-properties-common \
    curl \
    git \
    trash-cli && \
    mkdir -p \
    /app \
    /logs \
    /temp \
    "${HOME}" && \
    # ========================================================================================
    #                                   Install Nodejs 22.x
    # ========================================================================================
    curl -s https://deb.nodesource.com/setup_22.x | bash && apt install nodejs -y && node -v && \
    apt-get update && \
    apt-get install -y unzip wget comskip \
    # for apprise
    pipx && \
    pipx install apprise && \
    ln -s /root/.local/bin/apprise /usr/local/bin/apprise && \
    # ========================================================================================
    #                                   Install MkvToolNIX
    # ========================================================================================
    wget -O /usr/share/keyrings/gpg-pub-moritzbunkus.gpg https://mkvtoolnix.download/gpg-pub-moritzbunkus.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/gpg-pub-moritzbunkus.gpg] https://mkvtoolnix.download/ubuntu/ noble main" | tee /etc/apt/sources.list.d/mkvtoolnix.download.list && \
    echo "deb-src [arch=amd64 signed-by=/usr/share/keyrings/gpg-pub-moritzbunkus.gpg] https://mkvtoolnix.download/ubuntu/ noble main" | tee -a /etc/apt/sources.list.d/mkvtoolnix.download.list && \
    apt-get update && apt-get install -y mkvtoolnix && \
    # ========================================================================================
    #                                   Install CCExtractor
    # ========================================================================================
    apt-get install -y \
    libgpac-dev \
    libglew-dev \
    libglfw3-dev \
    cmake \
    gcc \
    libcurl4-gnutls-dev \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    clang \
    libclang-dev && \
    git clone https://github.com/CCExtractor/ccextractor.git && \
    cd ccextractor/linux && \
    git checkout 35e73c1c90ce3ca69394d3523836bb1cdec28f11 && \
    ./build -without-rust && \
    mv ./ccextractor /usr/bin/ccextractor && \
    cd / && rm -rf /ccextractor && \
    # ========================================================================================
    #                                   Install Jellyfin FFmpeg
    # ========================================================================================
    ARCH="$(dpkg --print-architecture)"; \
    wget https://github.com/jellyfin/jellyfin-ffmpeg/releases/download/v${FFMPEGVERSION}/jellyfin-ffmpeg7_${FFMPEGVERSION}-noble_${ARCH}.deb && \
    apt install -y \
    ./jellyfin-ffmpeg7_${FFMPEGVERSION}-noble_${ARCH}.deb && \
    rm -rf ./jellyfin-ffmpeg7_${FFMPEGVERSION}-noble_${ARCH}.deb && \
    ln -s /usr/lib/jellyfin-ffmpeg/ffmpeg /usr/local/bin/ffmpeg && \
    ln -s /usr/lib/jellyfin-ffmpeg/ffmpeg /usr/local/bin/tdarr-ffmpeg && \
    # ========================================================================================
    #                               Install intel media packages
    # ========================================================================================
    if uname -m | grep -q x86; then \
    # Setup Intel Package Repository for noble
    add-apt-repository -y ppa:kobuk-team/intel-graphics && \
    apt-get update && \
    # Install Intel compute related packages
    apt install -y \
    libze-intel-gpu1 \
    libze1 \
    intel-metrics-discovery \
    intel-opencl-icd \
    clinfo \
    intel-gsc \
    # Install Intel media related packages
    intel-media-va-driver-non-free \
    libmfx-gen1 \
    libvpl2 \
    libvpl-tools \
    libva2 \
    libva-glx2 \
    va-driver-all \
    vainfo \
    # Install Mesa packages
    libegl-mesa0 \
    libegl1 \
    libegl1-mesa-dev \
    libgbm1 \
    libgl1-mesa-dev \
    libgl1-mesa-dri \
    libglapi-mesa \
    libgles2-mesa-dev \
    libglx-mesa0 \
    libigdgmm12 \
    libxatracker2 \
    mesa-va-drivers \
    mesa-vdpau-drivers \
    mesa-vulkan-drivers \
    hwinfo && \
    # =========================================================================================
    #                               Install HandBrake dependencies
    # =========================================================================================
    apt-get install -y \
    autoconf \
    automake \
    build-essential \
    cmake \
    git \
    libass-dev \
    libbz2-dev \
    libfontconfig-dev \
    libfreetype-dev \
    libfribidi-dev \
    libharfbuzz-dev \
    libjansson-dev \
    liblzma-dev \
    libmp3lame-dev \
    libnuma-dev \
    libogg-dev \
    libopus-dev \
    libsamplerate0-dev \
    libspeex-dev \
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
    tar \
    zlib1g-dev \
    curl \
    libssl-dev \
    clang \
    # QSV dependencies
    libva-dev \
    libdrm-dev && \
    # Install Rust (required for libdovi)
    curl https://sh.rustup.rs -sSf | sh -s -- -y --profile minimal --default-toolchain stable && \
    . "${HOME}/.cargo/env" && \
    cargo install cargo-c && \
    rustup target add x86_64-pc-windows-gnu && \
    # =========================================================================================
    #                                   Install HandBrake
    # =========================================================================================
    rm -rdf /tmp/handbrake && \
    mkdir -p /tmp/handbrake && \
    git clone \
    --branch ${HANDBRAKE} \
    --depth 1 https://github.com/HandBrake/HandBrake.git \
    /tmp/handbrake && \
    cd /tmp/handbrake && \
    ./configure \
    --enable-qsv \
    --enable-nvdec \
    --enable-libdovi \
    --enable-x265 \
    --disable-gtk \
    --launch-jobs=14 \
    --launch \
    --force && \
    make --directory=build install && \
    cp /tmp/handbrake/build/HandBrakeCLI /usr/local/bin/HandBrakeCLI && \
    cd / && rm -rdf /tmp/handbrake/ ; \
    fi && \
    # If ARM architecture, install handbrake from apt
    if uname -m | grep -q aarch64; then \
    apt-get install -y handbrake-cli && \
    echo "ffmpeg installed above" ; \
    fi && \
    # If ARMv7l architecture, install handbrake from apt
    if uname -m | grep -q armv7l; then \
    apt-get install -y handbrake-cli && \
    echo "ffmpeg installed above" ; \
    fi && \
    # ========================================================================================
    #                             Cleanup Unused Packages
    # ========================================================================================
    # Important: Don't add auto-remove, as it will remove some dependencies
    trash-empty && \
    apt-get purge -y \
    git \
    pipx \
    libgpac-dev \
    libglew-dev \
    libglfw3-dev \
    cmake \
    gcc \
    libcurl4-gnutls-dev \
    libtesseract-dev \
    libleptonica-dev \
    libclang-dev && \
    # If we built HandBrake from source on x86, drop those extra build deps too
    if uname -m | grep -q x86; then \
    apt-get purge -y \
    libegl1-mesa-dev \
    libgl1-mesa-dev \
    libgles2-mesa-dev \
    libass-dev \
    libbz2-dev \
    libfontconfig-dev \
    libfreetype-dev \
    libfribidi-dev \
    libharfbuzz-dev \
    libjansson-dev \
    liblzma-dev \
    libmp3lame-dev \
    libnuma-dev \
    libogg-dev \
    libopus-dev \
    libsamplerate0-dev \
    libspeex-dev \
    libtheora-dev \
    libturbojpeg0-dev \
    libvorbis-dev \
    libx264-dev \
    libxml2-dev \
    libvpx-dev \
    zlib1g-dev \
    libssl-dev \
    libva-dev \
    libdrm-dev && \
    # remove rust toolchain installed via rustup (cargo, rustup)
    rm -rdf "$HOME/.cargo" "$HOME/.rustup" ; \
    fi && \
    # Final apt cache & index cleanup
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*.deb /root/.cache/*