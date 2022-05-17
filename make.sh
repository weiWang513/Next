!/bin/bash -ex
typeset -l namespace
namespace=${2}
tag=${3}

case ${1} in
    package)
        # rm -rf node_modules yarn.lock package-lock.json
        yarn install
        yarn && yarn build:test


        rm -rf ccfox-web-react/
        git clone https://aws-jenkins:-oVG9GkpJQrdKkgzFFx4@gitlab.dsnkm.com/app/ccfox-web-react.git
        cd ccfox-web-react/
        git checkout dev-jenkins
        yarn install
        yarn run build:test
        mv build ../out/contract
        cd ..

    ;;
    build)
         export tag=$(git name-rev --name-only   HEAD|awk -F '/' '{print $3}')
         echo ${tag}
         export tag="dev"
         export namespace=${tag}
         export project=$(basename $(pwd))
         export project=${project%-*}
         mv nginx_dev.conf nginx.conf
         docker login --username=doyouknowfox --password=x3Svp@3!S1jA7V*4v registry-vpc.ap-southeast-1.aliyuncs.com/ccfox/${project}
         docker build -t registry-vpc.ap-southeast-1.aliyuncs.com/ccfox/${project}:${tag} .
         docker push registry-vpc.ap-southeast-1.aliyuncs.com/ccfox/${project}:${tag}
    ;;
    deploy)
        export tag=$(git name-rev --name-only   HEAD|awk -F '/' '{print $3}')
        export tag="dev"
        export namespace=${tag}
        export project=$(basename $(pwd))
        export helm_project=${project%-*}
        release=$(helm ls|grep "${project}"|cut -f 1)
        if [ -z ${release} ]
         then
            helm repo update
            helm install  67212-ccfox_helm/${helm_project}  --name=${project} --set image.tag=${tag} --namespace=${namespace}
        else
            helm repo update
            helm upgrade --namespace=$namespace   ${project} --set image.tag=${tag}  67212-ccfox_helm/${helm_project} --force
            kubectl get pods  -n $namespace | grep ${helm_project}  |awk  '{print $1}'|xargs kubectl delete pods -n $namespace
        fi
    ;;

esac
