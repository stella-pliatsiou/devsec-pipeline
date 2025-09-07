pipeline {
    agent any

    environment {
        SNYK_TOKEN = credentials('snyk-token')  // αν χρησιμοποιείς Snyk
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                node {
                    powershell '''
                        Write-Host "Building project..."
                        # εδώ μπορείς να βάλεις το build script σου
                    '''
                }
            }
        }

        stage('Static Code Analysis') {
            steps {
                node {
                    powershell '''
                        Write-Host "Running static code analysis..."
                        # π.χ. npm install & npm run lint
                    '''
                }
            }
        }

        stage('Dynamic Analysis') {
            steps {
                node {
                    powershell '''
                        Write-Host "Running dynamic analysis..."
                        # π.χ. εκτέλεση tests ή Snyk scan
                    '''
                }
            }
        }
    }

    post {
        always {
            node {
                powershell '''
                    Write-Host "Pipeline finished. Cleaning up workspace..."
                    # Προαιρετικά: clean-up commands
                '''
            }
        }

        success {
            node {
                powershell 'Write-Host "✅ Pipeline completed successfully!"'
            }
        }

        failure {
            node {
                powershell 'Write-Host "❌ Pipeline failed. Check logs for details."'
            }
        }
    }
}
