pipeline {
    agent none
    environment {
        MY_VAR = 'my value'
    }
    
    // Correct options
    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        skipDefaultCheckout(false)
    }
    
    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
                
                sh '''
                    echo "Current workspace contents:"
                    pwd
                    ls -la
                '''
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
                    # Debug workspace
                    echo "Workspace path: ${WORKSPACE}"
                    ls -al
                   
                    # Create cache directories if they don't exist
                    mkdir -p npm_cache tmp
                   
                    # Install dependencies
                    npm install --no-audit --prefer-offline
                   
                    # Build project
                    npm run build
                   
                    # Cleanup temporary files
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
    
    // Workspace cleanup moved to post block
    post {
        always {
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true)
        }
        
        failure {
            echo "Pipeline failed"
        }
    }
}