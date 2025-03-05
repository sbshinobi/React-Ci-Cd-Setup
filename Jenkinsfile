pipeline {
    agent none
    environment {
        MY_VAR = 'my value'
    }
    
    // Add global options for workspace cleanup and timeout
    options {
        // Explicitly clean workspace before and after build
        cleanWs()
        // Add a global timeout to prevent hung builds
        timeout(time: 30, unit: 'MINUTES')
        // Prevent concurrent builds of this pipeline
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            agent any
            steps {
                // Explicit checkout with error handling
                script {
                    try {
                        checkout scm
                    } catch (Exception e) {
                        echo "Checkout failed: ${e.getMessage()}"
                        error "Unable to checkout source code"
                    }
                }
                
                // Debug information
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
                // Enhanced build steps with error handling
                script {
                    try {
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
                    } catch (Exception e) {
                        echo "Build failed: ${e.getMessage()}"
                        error "Build stage failed"
                    }
                }
            }
            
            // Post-build cleanup
            post {
                always {
                    sh 'rm -rf node_modules'
                }
                success {
                    echo "Build completed successfully"
                }
                failure {
                    echo "Build failed"
                }
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
                // Securely reference Vercel token from Jenkins credentials
                VERCEL_TOKEN = credentials('vercel-token')
            }
            steps {
                // Enhanced deployment with error handling
                script {
                    try {
                        sh '''
                            # Install Vercel CLI
                            npm install -g vercel
                            
                            # Verify Vercel token is available (but don't print it)
                            if [ -z "$VERCEL_TOKEN" ]; then
                                echo "Vercel token is not set"
                                exit 1
                            fi
                            
                            # Deploy to Vercel
                            vercel deploy --token=$VERCEL_TOKEN --yes
                        '''
                    } catch (Exception e) {
                        echo "Deployment failed: ${e.getMessage()}"
                        error "Deployment stage failed"
                    }
                }
            }
            
            // Post-deployment actions
            post {
                success {
                    echo "Deployment completed successfully"
                }
                failure {
                    echo "Deployment failed"
                }
                always {
                    // Additional cleanup
                    sh 'rm -rf ~/.vercel'
                }
            }
        }
    }
    
    // Global post-pipeline actions
    post {
        always {
            // Ensure workspace is cleaned up
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true)
        }
        
        failure {
            // Optional: send notifications
            echo "Pipeline failed. Consider adding email or Slack notifications."
        }
    }
}