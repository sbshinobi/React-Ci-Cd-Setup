pipeline {
    agent none
    
    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }
        stage('Take approval'){
            agent any
            steps{
                input 'Should we deploy?'
            }
        }
        stage('Build') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-user root --shm-size=1gb'
                }
            }
            steps {
                sh '''
                    npm install --no-audit --prefer-offline
                    npm run build
                '''
            }
        }
        
        stage('Deploy') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root --shm-size=1gb'
                }
            }
            environment {
                VERCEL_TOKEN = credentials('vercel-token')
            }
            steps {
                sh '''
                    npm install -g vercel
                    vercel deploy --yes --token=$VERCEL_TOKEN
                '''
            }
        }
        stage('Cleanup') {
            agent any
            steps {
                cleanWs(
                    cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true
                )
            }
        }
    }
    
    post {
       
        failure {
            echo "Pipeline failed"
        }
    }
}