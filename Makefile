LATFORM=linux/amd64,linux/arm64,linux/arm/v7
VERSION=2.00.12
USERNAME=haveagitgat

build-server:
	docker buildx build -f ./Dockerfile -t ${USERNAME}/tdarr_acc:dev --build-arg VERSION=$(VERSION) --build-arg MODULE=Tdarr_Server --build-arg ROOT_CP=root_server --platform ${PLATFORM} --push .
build-node:
	docker buildx build -f ./Dockerfile -t ${USERNAME}/tdarr_node_acc:dev --build-arg VERSION=$(VERSION) --build-arg MODULE=Tdarr_Node --build-arg ROOT_CP=root_node --platform ${PLATFORM} --push .