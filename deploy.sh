###################################################################
#                                                                 #
#                    Start of Kubenetes Update                    #
#                                                                 #
#                         Namespace: web                          #
#                                                                 #
###################################################################


# update sea-mengxin-ml
docker build -t mengxin891029/sea-mengxin-ml:latest -t mengxin891029/sea-mengxin-ml:$GIT_SHA -f ./docker-images/sea/Dockerfile ./docker-images/sea
docker push mengxin891029/sea-mengxin-ml:$GIT_SHA
docker push mengxin891029/sea-mengxin-ml:latest
kubectl apply -f k8s/web/sea-mengxin-ml
kubectl set image --namespace web deployments/sea-mengxin-ml-deployment sea-mengxin-ml=mengxin891029/sea-mengxin-ml:$GIT_SHA


# update chat-mengxin-ml
docker build -t mengxin891029/chat-mengxin-ml:latest -t mengxin891029/chat-mengxin-ml:$GIT_SHA -f ./docker-images/chat/Dockerfile ./docker-images/chat
docker push mengxin891029/chat-mengxin-ml:$GIT_SHA
docker push mengxin891029/chat-mengxin-ml:latest
kubectl apply -f k8s/web/chat-mengxin-ml
kubectl set image --namespace web deployments/chat-mengxin-ml-deployment chat-mengxin-ml=mengxin891029/chat-mengxin-ml:$GIT_SHA


# update tunnel-mengxin-ml
docker build -t mengxin891029/tunnel-mengxin-ml:latest -t mengxin891029/tunnel-mengxin-ml:$GIT_SHA -f ./docker-images/tunnel/Dockerfile ./docker-images/tunnel
docker push mengxin891029/tunnel-mengxin-ml:$GIT_SHA
docker push mengxin891029/tunnel-mengxin-ml:latest
kubectl apply -f k8s/web/tunnel-mengxin-ml
kubectl set image --namespace web deployments/tunnel-mengxin-ml-deployment tunnel-mengxin-ml=mengxin891029/tunnel-mengxin-ml:$GIT_SHA


# update httpbin-mengxin-ml
kubectl apply -f k8s/web/httpbin-mengxin-ml


# update mongo-express-mengxin-ml
kubectl apply -f k8s/web/mongo-express-mengxin-ml


# update jupyter-mengxin-ml
docker build -t mengxin891029/jupyter-mengxin-ml:latest -t mengxin891029/jupyter-mengxin-ml:$GIT_SHA -f ./docker-images/jupyter/Dockerfile ./docker-images/jupyter
docker push mengxin891029/jupyter-mengxin-ml:$GIT_SHA
docker push mengxin891029/jupyter-mengxin-ml:latest
kubectl apply -f k8s/web/jupyter-mengxin-ml
kubectl set image --namespace web deployments/jupyter-mengxin-ml-deployment jupyter-mengxin-ml=mengxin891029/jupyter-mengxin-ml:$GIT_SHA

# update general kubernetes namespace: web
kubectl apply -f k8s/web






###################################################################
#                                                                 #
#                    Start of Kubenetes Update                    #
#                                                                 #
#                         Namespace: tcp                          #
#                                                                 #
###################################################################


# update ssl-mengxin-ml-keyless
docker build -t mengxin891029/keyless:latest -t mengxin891029/keyless:$GIT_SHA -f ./docker-images/keyless/Dockerfile ./docker-images/keyless
docker push mengxin891029/keyless:$GIT_SHA
docker push mengxin891029/keyless:latest
kubectl apply -f k8s/tcp/ssl-mengxin-ml-keyless
kubectl set image --namespace tcp deployments/ssl-mengxin-ml-keyless-deployment ssl-mengxin-ml=mengxin891029/keyless:$GIT_SHA


# update common-storage-nfs
kubectl apply -f k8s/tcp/common-storage-nfs


# update mengxin-sea1-test-vm
kubectl apply -f k8s/tcp/mengxin-sea1-test-vm


# update mongo-mengxin-ml
kubectl apply -f k8s/tcp/mongo-mengxin-ml


# update redis-mengxin-ml
kubectl apply -f k8s/tcp/redis-mengxin-ml


# update general kubernetes namespace: tcp
kubectl apply -f k8s/tcp