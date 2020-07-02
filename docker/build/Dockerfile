FROM lsiobase/ubuntu:bionic as buildstage

# common env
ENV \
 DEBIAN_FRONTEND="noninteractive" \
 MAKEFLAGS="-j4" \
 LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib/

# versions
ENV \
 AOM=v1.0.0 \
 CCEXTRACTOR=0.88 \
 FDKAAC=2.0.1 \
 FFMPEG=4.3 \
 FONTCONFIG=2.13.92 \
 FREETYPE=2.9.1 \
 FRIBIDI=1.0.8 \
 KVAZAAR=1.3.0 \
 LAME=3.100 \
 LIBASS=0.14.0 \
 LIBDRM=2.4.100 \
 LIBVA=2.6.0 \
 LIBVDPAU=1.2 \
 LIBVIDSTAB=1.1.0 \
 LIBVMAF=master \
 NVCODEC=n9.1.23.1 \
 OGG=1.3.4 \
 OPENCOREAMR=0.1.5 \
 OPENJPEG=2.3.1 \
 OPUS=1.3 \
 THEORA=1.1.1 \
 VORBIS=1.3.6 \
 VPX=1.8.2 \
 X265=3.2.1 \
 XVID=1.3.7 

RUN \
 echo "**** install build packages ****" && \
 apt-get update && \ 
 apt-get install -y \
	autoconf \
	automake \
	bzip2 \
	ca-certificates \
	cmake \
	curl \
	diffutils \
	doxygen \
	g++ \
	gcc \
	git \
	gperf \
	libcurl4-gnutls-dev \
	libexpat1-dev \
	libxext-dev \
	libgcc-7-dev \
	libgomp1 \
	libpciaccess-dev \
	libssl-dev \
	libtesseract-dev \
	libleptonica-dev \
	liblzma-dev \
	libtool \
	libv4l-dev \
	libx11-dev \
	libxcb-shm0-dev \
	libxml2-dev \
	make \
	nasm \
	ninja-build \
	perl \
	pkg-config \
	python \
	python3 \
	python3-pip\
	python3-setuptools \
	python3-wheel \
	tesseract-ocr \
	x11proto-xext-dev \
	xserver-xorg-dev \
	yasm \
	zlib1g-dev && \
        pip3 install meson

# compile 3rd party libs
RUN \
 echo "**** grabbing aom ****" && \
 mkdir -p /tmp/aom && \
 git clone \
	--branch ${AOM} \
	--depth 1 https://aomedia.googlesource.com/aom \
	/tmp/aom
RUN \
 echo "**** compiling aom ****" && \
 cd /tmp/aom && \
 rm -rf \
	CMakeCache.txt \
	CMakeFiles && \
 mkdir -p \
	aom_build && \
 cd aom_build && \
 cmake \
	-DBUILD_STATIC_LIBS=0 .. && \
 make && \
 make install
RUN \
 echo "**** grabbing fdk-aac ****" && \
 mkdir -p /tmp/fdk-aac && \
 curl -Lf \
	https://github.com/mstorsjo/fdk-aac/archive/v${FDKAAC}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/fdk-aac
RUN \
 echo "**** compiling fdk-aac ****" && \
 cd /tmp/fdk-aac && \
 autoreconf -fiv && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing ffnvcodec ****" && \
 mkdir -p /tmp/ffnvcodec && \
 git clone \
        --branch ${NVCODEC} \
        --depth 1 https://git.videolan.org/git/ffmpeg/nv-codec-headers.git \
        /tmp/ffnvcodec
RUN \
 echo "**** compiling ffnvcodec ****" && \
 cd /tmp/ffnvcodec && \
 make install
RUN \
 echo "**** grabbing freetype ****" && \
 mkdir -p /tmp/freetype && \
 curl -Lf \
	https://download.savannah.gnu.org/releases/freetype/freetype-${FREETYPE}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/freetype
RUN \
 echo "**** compiling freetype ****" && \
 cd /tmp/freetype && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing fontconfig ****" && \
 mkdir -p /tmp/fontconfig && \
 curl -Lf \
	https://www.freedesktop.org/software/fontconfig/release/fontconfig-${FONTCONFIG}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/fontconfig
RUN \
 echo "**** compiling fontconfig ****" && \
 cd /tmp/fontconfig && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install 
RUN \
 echo "**** grabbing fribidi ****" && \
 mkdir -p /tmp/fribidi && \
 curl -Lf \
	https://github.com/fribidi/fribidi/archive/v${FRIBIDI}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/fribidi
RUN \
 echo "**** compiling fribidi ****" && \
 cd /tmp/fribidi && \
 ./autogen.sh && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make -j 1 && \
 make install
RUN \
 echo "**** grabbing kvazaar ****" && \
 mkdir -p /tmp/kvazaar && \
 curl -Lf \
	https://github.com/ultravideo/kvazaar/archive/v${KVAZAAR}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/kvazaar
RUN \
 echo "**** compiling kvazaar ****" && \
 cd /tmp/kvazaar && \
 ./autogen.sh && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing lame ****" && \
 mkdir -p /tmp/lame && \
 curl -Lf \
	http://downloads.sourceforge.net/project/lame/lame/3.100/lame-${LAME}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/lame
RUN \
 echo "**** compiling lame ****" && \
 cd /tmp/lame && \
 cp \
	/usr/share/automake-1.15/config.guess \
	config.guess && \
 cp \
        /usr/share/automake-1.15/config.sub \
        config.sub && \
 ./configure \
	--disable-frontend \
	--disable-static \
	--enable-nasm \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing libass ****" && \
 mkdir -p /tmp/libass && \
 curl -Lf \
	https://github.com/libass/libass/archive/${LIBASS}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/libass
RUN \
 echo "**** compiling libass ****" && \
 cd /tmp/libass && \
 ./autogen.sh && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing libdrm ****" && \
 mkdir -p /tmp/libdrm && \
 curl -Lf \
	https://dri.freedesktop.org/libdrm/libdrm-${LIBDRM}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/libdrm
RUN \
 echo "**** compiling libdrm ****" && \
 cd /tmp/libdrm && \
 ./configure \
        --disable-static \
        --enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing libva ****" && \
 mkdir -p /tmp/libva && \
 curl -Lf \
	https://github.com/intel/libva/archive/${LIBVA}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/libva
RUN \
 echo "**** compiling libva ****" && \
 cd /tmp/libva && \
 ./autogen.sh && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing libvdpau ****" && \
 mkdir -p /tmp/libvdpau && \
 git clone \
	--branch libvdpau-${LIBVDPAU} \
	--depth 1 https://gitlab.freedesktop.org/vdpau/libvdpau.git \
	/tmp/libvdpau
RUN \
 echo "**** compiling libvdpau ****" && \
 cd /tmp/libvdpau && \
 ./autogen.sh && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing vmaf ****" && \
 mkdir -p /tmp/vmaf && \
 git clone \
        --branch ${LIBVMAF} \
        https://github.com/Netflix/vmaf.git \
        /tmp/vmaf
RUN \
 echo "**** compiling libvmaf ****" && \
 cd /tmp/vmaf/libvmaf && \
 meson build --buildtype release && \
 ninja -vC build && \
 ninja -vC build install
RUN \
 echo "**** grabbing ogg ****" && \
 mkdir -p /tmp/ogg && \
 curl -Lf \
	http://downloads.xiph.org/releases/ogg/libogg-${OGG}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/ogg
RUN \
 echo "**** compiling ogg ****" && \
 cd /tmp/ogg && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing opencore-amr ****" && \
 mkdir -p /tmp/opencore-amr && \
 curl -Lf \
	http://downloads.sourceforge.net/project/opencore-amr/opencore-amr/opencore-amr-${OPENCOREAMR}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/opencore-amr
RUN \
 echo "**** compiling opencore-amr ****" && \
 cd /tmp/opencore-amr && \
 ./configure \
	--disable-static \
	--enable-shared  && \
 make && \
 make install
RUN \
 echo "**** grabbing openjpeg ****" && \
 mkdir -p /tmp/openjpeg && \
 curl -Lf \
	https://github.com/uclouvain/openjpeg/archive/v${OPENJPEG}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/openjpeg
RUN \
 echo "**** compiling openjpeg ****" && \
 cd /tmp/openjpeg && \
 rm -Rf \
	thirdparty/libpng/* && \
 curl -Lf \
	https://download.sourceforge.net/libpng/libpng-1.6.37.tar.gz | \
	tar -zx --strip-components=1 -C thirdparty/libpng/ && \
 cmake \
	-DBUILD_STATIC_LIBS=0 \
	-DBUILD_THIRDPARTY:BOOL=ON . && \
 make && \
 make install
RUN \
 echo "**** grabbing opus ****" && \
 mkdir -p /tmp/opus && \
 curl -Lf \
	https://archive.mozilla.org/pub/opus/opus-${OPUS}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/opus
RUN \
 echo "**** compiling opus ****" && \
 cd /tmp/opus && \
 autoreconf -fiv && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing theora ****" && \
 mkdir -p /tmp/theora && \
 curl -Lf \
	http://downloads.xiph.org/releases/theora/libtheora-${THEORA}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/theora
RUN \
 echo "**** compiling theora ****" && \
 cd /tmp/theora && \
 cp \
	/usr/share/automake-1.15/config.guess \
	config.guess && \
 cp \
	/usr/share/automake-1.15/config.sub \
	config.sub && \
 curl -fL \
	'https://gitlab.xiph.org/xiph/theora/-/commit/7288b539c52e99168488dc3a343845c9365617c8.diff' \
	> png.patch && \
 patch ./examples/png2theora.c < png.patch && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing vid.stab ****" && \
 mkdir -p /tmp/vid.stab && \
 curl -Lf \
	https://github.com/georgmartius/vid.stab/archive/v${LIBVIDSTAB}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/vid.stab
RUN \
 echo "**** compiling vid.stab ****" && \
 cd /tmp/vid.stab && \
 cmake \
	-DBUILD_STATIC_LIBS=0 . && \
 make && \
 make install
RUN \
 echo "**** grabbing vorbis ****" && \
 mkdir -p /tmp/vorbis && \
 curl -Lf \
	http://downloads.xiph.org/releases/vorbis/libvorbis-${VORBIS}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/vorbis
RUN \
 echo "**** compiling vorbis ****" && \
 cd /tmp/vorbis && \
 ./configure \
	--disable-static \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing vpx ****" && \
 mkdir -p /tmp/vpx && \
 curl -Lf \
	https://github.com/webmproject/libvpx/archive/v${VPX}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/vpx
RUN \
 echo "**** compiling vpx ****" && \
 cd /tmp/vpx && \
 ./configure \
	--disable-debug \
	--disable-docs \
	--disable-examples \
	--disable-install-bins \
	--disable-static \
	--disable-unit-tests \
	--enable-pic \
	--enable-shared \
	--enable-vp8 \
	--enable-vp9 \
	--enable-vp9-highbitdepth && \
 make && \
 make install
RUN \
 echo "**** grabbing x264 ****" && \
 mkdir -p /tmp/x264 && \
 curl -Lf \
	https://code.videolan.org/videolan/x264/-/archive/master/x264-stable.tar.bz2 | \
	tar -jx --strip-components=1 -C /tmp/x264
RUN \
 echo "**** compiling x264 ****" && \
 cd /tmp/x264 && \
 ./configure \
	--disable-cli \
	--disable-static \
	--enable-pic \
	--enable-shared && \
 make && \
 make install
RUN \
 echo "**** grabbing x265 ****" && \
 mkdir -p /tmp/x265 && \
 curl -Lf \
	https://download.videolan.org/pub/videolan/x265/x265_${X265}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/x265
RUN \
 echo "**** compiling x265 ****" && \
 cd /tmp/x265/build/linux && \
 ./multilib.sh && \
 make -C 8bit install
RUN \
 echo "**** grabbing xvid ****" && \
 mkdir -p /tmp/xvid && \
 curl -Lf \
	https://downloads.xvid.com/downloads/xvidcore-${XVID}.tar.gz | \
	tar -zx --strip-components=1 -C /tmp/xvid
RUN \
 echo "**** compiling xvid ****" && \
 cd /tmp/xvid/build/generic && \
 ./configure && \ 
 make && \
 make install
# ffmpeg build
RUN \
 echo "**** grabbing ffmpeg ****" && \
 mkdir -p /tmp/ffmpeg && \
 echo "https://ffmpeg.org/releases/ffmpeg-${FFMPEG}.tar.bz2" && \
 curl -Lf \
        https://ffmpeg.org/releases/ffmpeg-${FFMPEG}.tar.bz2 | \
        tar -jx --strip-components=1 -C /tmp/ffmpeg
RUN \
 echo "**** compiling ffmpeg ****" && \
 cd /tmp/ffmpeg && \
 ./configure \
	--disable-debug \
	--disable-doc \
	--disable-ffplay \
	--enable-ffprobe \
	--enable-avresample \
	--enable-cuvid \
	--enable-gpl \
	--enable-libaom \
	--enable-libass \
	--enable-libfdk_aac \
	--enable-libfreetype \
	--enable-libkvazaar \
	--enable-libmp3lame \
	--enable-libopencore-amrnb \
	--enable-libopencore-amrwb \
	--enable-libopenjpeg \
	--enable-libopus \
	--enable-libtheora \
	--enable-libv4l2 \
	--enable-libvidstab \
	--enable-libvmaf \
	--enable-libvorbis \
	--enable-libvpx \
	--enable-libxml2 \
	--enable-libx264 \
	--enable-libx265 \
	--enable-libxvid \
	--enable-nonfree \
	--enable-nvdec \
	--enable-nvenc \
	--enable-openssl \
	--enable-shared \
	--enable-small \
	--enable-stripping \
	--enable-vaapi \
	--enable-vdpau \
	--enable-version3 && \
 make && \
 ls /tmp/ffmpeg && \
 make install

# ccextractor build
RUN \
echo "**** grabbing ccextractor ****" && \
mkdir -p /tmp/ccextractor && \
curl -Lf \
        https://github.com/CCExtractor/ccextractor/archive/v${CCEXTRACTOR}.tar.gz | \
        tar -zx --strip-components=1 -C /tmp/ccextractor
RUN \
 echo "**** compiling ccextractor ****" && \
 cd /tmp/ccextractor/linux && \
 ./build_hardsubx
 
# copying executables & library files
RUN \
 echo "**** arrange files ****" && \
 ldconfig && \
 mkdir -p /buildout/usr/local/bin && \
 cp \
	/usr/local/bin/ffmpeg \
	/buildout/usr/local/bin && \
 cp \
	/usr/local/bin/ffprobe \
	/buildout/usr/local/bin && \
 cp \
        /tmp/ccextractor/linux/ccextractor \
        /buildout/usr/local/bin && \
 mkdir -p /buildout/usr/local/lib && \
 ldd /usr/local/bin/ffmpeg \
	| awk '/local/ {print $3}' \
	| xargs -i cp -L {} /buildout/usr/local/lib/ && \
 ldd /tmp/ccextractor/linux/ccextractor \
	| awk '/local/ {print $3}' \
	| xargs -i cp -L {} /buildout/usr/local/lib/ && \
 cp -a \
	/usr/local/lib/libdrm_* \
	/buildout/usr/local/lib/ && \
 mkdir -p /buildout/usr/local/share && \
 cp -r \ 
        /tmp/vmaf/model \
	/buildout/usr/local/share/

# Storage layer consumed downstream
FROM scratch

# set version label
ARG BUILD_DATE
ARG VCS_URL
ARG VENDOR
ARG VERSION

LABEL build_version=""
LABEL maintainer="${VENDOR}"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.build-date="${BUILD_DATE}"
LABEL org.label-schema.vcs-url="https://github.com/${VCS_URL}"
LABEL org.label-schema.vendor="${VENDOR}"
LABEL org.label-schema.version="${VERSION}"

# Add files from buildstage
COPY --from=buildstage /buildout/ /
