pipeline {
    agent any

    environment {
        IMAGE = "link-hub-frontend"
        TAG = "${BUILD_NUMBER}"
        PORT = "3001"
        CONTAINER = "link-hub-frontend"
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/chinnakorn32/link-hub-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE}:${TAG} -t ${IMAGE}:latest ."
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                if [ \$(docker ps -aq -f name=${CONTAINER}) ]; then
                    docker stop ${CONTAINER} || true
                    docker rm ${CONTAINER} || true
                fi
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh """
                docker run -d \
                    --name ${CONTAINER} \
                    -p ${PORT}:80 \
                    ${IMAGE}:${TAG}
                """
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment Success!"
            sh "docker system prune -f"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
