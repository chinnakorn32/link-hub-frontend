pipeline {
    agent any

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/chinnakorn32/link-hub-frontend.git',
                    credentialsId: 'bca258ab-2ecb-42f1-80bc-972c99a3c2a5'
            }
        }

        stage('Prepare SSL Certificates') {
            steps {
                sh '''
                mkdir -p ssl
                # Check if SSL files exist, if not create placeholders
                if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
                    echo "Warning: SSL certificates not found in workspace"
                    # Copy from a secure location on the server
                    if [ -f /var/lib/docker/volumes/jenkins-data/_data/workspace/link-hub/link-hub-frontend/ssl/cert.pem ]; then
                        cp /var/lib/docker/volumes/jenkins-data/_data/workspace/link-hub/link-hub-frontend/ssl/cert.pem ssl/
                        cp /var/lib/docker/volumes/jenkins-data/_data/workspace/link-hub/link-hub-frontend/ssl/key.pem ssl/
                    fi
                fi
                ls -la ssl/
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t link-hub-frontend:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    sh '''
                    if [ $(docker ps -aq -f name=link-hub-frontend) ]; then
                        docker stop link-hub-frontend || true
                        docker rm link-hub-frontend || true
                    fi
                    '''
                }
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                docker run -d --name link-hub-frontend \
                    -p 3001:80 \
                    -p 3002:443 \
                    -v ${WORKSPACE}/ssl:/etc/nginx/ssl:ro \
                    link-hub-frontend:latest
                '''
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed! Cleaning up...'
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Deployment successful!'
        }
    }
}
