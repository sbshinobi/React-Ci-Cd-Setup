pipeline {
    agent none  // Change to none since stages have their own agents
    environment {
        MY_VAR = 'my value'
    }
    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }
       
        stage('Build') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root --shm-size=1gb'
                }
            }
            environment {
                npm_config_cache = 'npm_cache'
                TEMP = 'tmp'
            }
            steps {
                sh '''
                    echo "Workspace path: ${WORKSPACE}"
                    ls -al
                   
                    npm install --no-audit --prefer-offline
                    npm run build
                   
                    rm -rf npm_cache tmp
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
                // Add Vercel token if needed
                VERCEL_TOKEN = credentials('vercel-token')
            }
            steps {
                sh '''
                    npm install -g vercel
                    vercel deploy --token=$VERCEL_TOKEN
                '''
            }
        }
    }
}