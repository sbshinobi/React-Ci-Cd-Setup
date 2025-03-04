pipeline {
    agent any
    options {
        skipDefaultCheckout(true)
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout Code') {
            steps {
                // Fixed lowercase 'checkout' command
                checkout scm
            }
        }
        stage('Build') {
            agent {
                docker {
                    // Use valid Node.js image tag (example: 20-alpine3.20)
                    image 'node:20-alpine3.20'
                    // Avoid running as root unless necessary
                    args '-u node --shm-size=1gb'
                    reuseNode true
                }
            }
            environment {
                // Custom cache/temp directories to control space usage
                npm_config_cache = 'npm_cache'
                TEMP = 'tmp'
            }
            steps {
                sh '''
                    # Verify workspace structure
                    ls -al
                    
                    # Use clean npm install
                    npm ci --no-audit --prefer-offline
                    
                    # Build with cleanup
                    npm run build
                    
                    # Clean cache after build
                    rm -rf npm_cache tmp
                '''
            }
            post {
                always {
                    // Clean Docker container after build
                    script {
                        docker image prune -f
                    }
                }
            }
        }
    }
}