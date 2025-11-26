pipeline {
    agent any

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/chinnakorn32/link-hub-frontend.git',
                    credentialsId: 'd0f2ff5b-bcce-4c7f-b616-15ca853ce22a'
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
                sh 'docker run -d --name link-hub-frontend -p 3001:80 link-hub-frontend:latest'
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
