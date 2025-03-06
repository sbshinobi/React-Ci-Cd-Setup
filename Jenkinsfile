pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy to Nginx') {
            steps {
                sh '''
                    sudo rm -rf /var/www/my-project/*
                    sudo cp -r dist/* /var/www/my-project/
                    sudo systemctl reload nginx
                '''
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Deployed to Nginx!'
        }
    }
}