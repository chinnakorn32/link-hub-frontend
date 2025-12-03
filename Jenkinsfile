pipeline {
    agent any

    environment {
        IMAGE = "link-hub-frontend"
        TAG = "${BUILD_NUMBER}"
        HTTP_PORT = "80"
        HTTPS_PORT = "443"
        CONTAINER = "link-hub-frontend"
        SSL_CERT_PATH = "/etc/nginx/ssl/cloudflare-origin-cert.pem"
        SSL_KEY_PATH = "/etc/nginx/ssl/cloudflare-origin-key.pem"
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

        stage('Run New Container with SSL') {
            steps {
                sh """
                docker run -d \
                    --name ${CONTAINER} \
                    -p ${HTTP_PORT}:80 \
                    -p ${HTTPS_PORT}:443 \
                    -v ${SSL_CERT_PATH}:/etc/nginx/ssl/cloudflare-origin-cert.pem:ro \
                    -v ${SSL_KEY_PATH}:/etc/nginx/ssl/cloudflare-origin-key.pem:ro \
                    ${IMAGE}:${TAG}
                """
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment Success!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
