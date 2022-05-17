#!/bin/bash -ex
export aws_url='441272919721.dkr.ecr.ap-northeast-1.amazonaws.com'

case ${1} in
    package)
        export namespace=${2}
        export CI=false
        rm -rf node_modules yarn.lock package-lock.json
        yarn install
        if [ $namespace == green ]
            then
                yarn && yarn build:green
        else
                yarn && yarn build
        fi

    ;;
    build)
         export namespace=${2}
         export imageTag=${3}
         export project=$(basename $(pwd))
         mv nginx_pro.conf nginx.conf
         # 登录
         aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${aws_url}
         docker build -t ${aws_url}/${namespace}:${project}-${imageTag} .
         docker push ${aws_url}/${namespace}:${project}-${imageTag}
    ;;
    deploy)
        export namespace=${2}
        export imageTag=${3}
        export project=$(basename $(pwd))
        export HELM_EXPERIMENTAL_OCI=1
        aws ecr get-login-password  --region ap-northeast-1 | helm registry login  --username AWS   --password-stdin ${aws_url}
        helm pull oci://${aws_url}/${project} --version 0.1.0
        release=$(helm list -n ${namespace}|grep ${project}|cut -f 1)
        if [ -z ${release} ]
          then
                helm install ./${project}-0.1.0.tgz -name=${project}-${namespace} --set image.repository=${aws_url}/${namespace} --set image.tag=${project}-${imageTag}  --namespace=${namespace} --generate-name
        else
                if [ $namespace == green ]
                    then
                        helm upgrade  ${release} ./${project}-0.1.0.tgz --namespace=$namespace --set replicaCount=1 --set image.tag=${project}-${imageTag} --set image.repository=${aws_url}/${namespace} --set affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms[0].matchExpressions[0].key=env,affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms[0].matchExpressions[0].operator=In,affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms[0].matchExpressions[0].values={pro-spot}
                        kubectl get pods  -n $namespace | grep ${project}  |awk  '{print $1}'|xargs kubectl delete pods -n $namespace
                        kubectl delete hpa -n green ${project}
                else 
                        helm upgrade  ${release} ./${project}-0.1.0.tgz --namespace=$namespace  --set image.tag=${project}-${imageTag} --set image.repository=${aws_url}/${namespace}
                        kubectl get pods  -n $namespace | grep ${project}  |awk  '{print $1}'|xargs kubectl delete pods -n $namespace
                fi
        fi
    ;;

esac
