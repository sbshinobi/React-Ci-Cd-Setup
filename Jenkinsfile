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
                checkout(scm)  // Fixed syntax: checkout(scm) instead of "Checkout scm"
            }
        }
        stage('Build') {
            agent {
                docker {
                    // Use valid Node.js image (verify tags at https://hub.docker.com/_/node)
                    image 'node:20-alpine'  // Simplified valid tag
                    args '-u root --shm-size=1gb'  // Run as root temporarily for debugging
                    reuseNode true
                }
            }
            environment {
                // Use relative paths for temp/cache
                npm_config_cache = 'npm_cache'
                TEMP = 'tmp'
            }
            steps {
                sh '''
                    # Debug workspace
                    echo "Workspace path: ${WORKSPACE}"
                    ls -al
                    
                    # Install dependencies
                    npm install --no-audit --prefer-offline
                    
                    # Build
                    npm run build
                    
                    # Cleanup
                    rm -rf npm_cache tmp
                '''
            }
            post {
                always {
                    cleanWs(
                        cleanWhenAborted: true,
                        cleanWhenFailure: true,
                        deleteDirs: true
                    )
                }
            }
        }
    }
}