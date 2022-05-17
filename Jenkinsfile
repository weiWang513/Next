pipeline {
    agent any
    // environment {
    //     def tag = 'master-jenkins'
    //     def namespace = tag.toLowerCase()
    // }
    // agent{
    //    node{
    //      label 'slave-pipeline'
    //   }
    // }
    stages {
        stage('Package') {
            steps {
                // sh 'mvn clean install -Dmaven.test.skip=true'
                // BRANCH_NAME=$(sh "git symbolic-ref --short -q HEAD")

                sh "chmod +x ./make.sh"
                sh "./make.sh package"
            }
        }
        stage('Build') {
            steps {
              sh "./make.sh build"
            }
        }

         stage('Deploy') {
            steps {
                sh "./make.sh deploy"
            }
        }
    }
}
