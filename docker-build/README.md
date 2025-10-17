# Docker Build

This directory contains the Docker build configuration for Tdarr.

## Prerequisites

- Docker with buildx support
- Docker registry access (for pushing images)

## Configuration

Build configuration is defined in:
- `Makefile` - Build targets and commands
- `Makefile.vars` - Registry, username, and tag configuration

## Example Make Commands

```bash
cd docker-build

# Set the DATE variable
export DATE=$(date +"%Y_%m_%dT%H_%M_%Sz")

# Build base image (multi-arch)
make build-base-all-arch DATE=$DATE USE_PROD_PACKAGES=true PUSH_IMAGES=false

# Build server image (multi-arch)
make build-be-all-arch TAG=dev DATE=$DATE USE_PROD_PACKAGES=true PUSH_IMAGES=false

# Build node image (multi-arch)
make build-node-all-arch TAG=dev DATE=$DATE USE_PROD_PACKAGES=true PUSH_IMAGES=false

# Push base image (only for x64 builds)
make push-base DATE=$DATE USE_PROD_PACKAGES=true
```

> Set `PUSH_IMAGES=true` when you want the multi-arch targets to push directly to the registry.

## Important Variables

- `DATE` - Required timestamp variable (format: `YYYY_MM_DDTHH_MM_SSz`)
- `USE_PROD_PACKAGES` - Set to `true` for production builds, `false` for dev packages
- `TAG` - Docker image tag (default: `dev`)
- `PLATFORMS` - Target platforms (default: `linux/amd64,linux/arm64`)

## BUILD_BASE Configuration

To build a new base image or use an existing one, set `BUILD_BASE` in the appropriate file:

**Workflow builds:**
- `.github/workflows/build.yml` (`setup-env-vars` job): Set `BUILD_BASE=true` (build new) or `BUILD_BASE=false` (use existing)
- `docker-build/Makefile`: Update `FIXED_BASE_TAG` to the version to use when `BUILD_BASE=false`

**Local builds:**
- `docker-build/Makefile`: Toggle `BUILD_BASE` between `true` (build new) or `false` (use existing)
- `docker-build/Makefile`: Set `FIXED_BASE_TAG` to the version to use when `BUILD_BASE=false`

The base image tag is automatically computed based on `BUILD_BASE` and passed to the Dockerfile.
