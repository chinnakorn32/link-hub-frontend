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

        stage('Build Docker Image') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    sh 'docker build -t link-hub-frontend:latest .'
                }
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
                    -p 80:80 \
                    -p 443:443 \
                    -v /var/ssl:/etc/nginx/ssl \
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