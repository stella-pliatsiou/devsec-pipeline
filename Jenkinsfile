pipeline {
    agent any  // ή agent { label 'windows' } αν θες συγκεκριμένο node

    environment {
        SNYK_TOKEN = credentials('snyk-token')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                powershell 'Write-Host "Building project..."'
            }
        }

        stage('Static Code Analysis') {
            steps {
                powershell 'Write-Host "Running static code analysis..."'
            }
        }

        stage('Dynamic Analysis') {
            steps {
                powershell 'Write-Host "Running dynamic analysis..."'
            }
        }
    }

    post {
        always {
            powershell 'Write-Host "Pipeline finished. Cleaning up workspace..."'
        }
        success {
            powershell 'Write-Host "✅ Pipeline completed successfully!"'
        }
        failure {
            powershell 'Write-Host "❌ Pipeline failed. Check logs for details."'
        }
    }
}
