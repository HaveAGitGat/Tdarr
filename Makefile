version=2.00.12
username=haveagitgat

build-server:
	docker buildx build -f ./Dockerfile -t ${username}/tdarr_acc:dev --build-arg VERSION=$(version) --build-arg MODULE=Tdarr_Server --build-arg ROOT_CP=root_server --platform linux/amd64,linux/arm64,linux/arm/v7 --push .
build-node:
	docker buildx build -f ./Dockerfile -t ${username}/tdarr_node_acc:dev --build-arg VERSION=$(version) --build-arg MODULE=Tdarr_Node --build-arg ROOT_CP=root_node --platform linux/amd64,linux/arm64,linux/arm/v7 --push .