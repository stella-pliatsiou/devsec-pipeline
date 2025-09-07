pipeline {
    agent any

    environment {
        // Βάλε εδώ το σωστό ID του Snyk token στο Jenkins Credentials
        SNYK_TOKEN = credentials('snyk-token')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Static Analysis - Semgrep') {
            steps {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    pip install --upgrade pip
                    pip install semgrep
                    semgrep --config=p/ci .
                '''
            }
        }

        stage('Static Analysis - Snyk') {
            steps {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    snyk auth $env:SNYK_TOKEN
                    snyk test
                '''
            }
        }

        stage('Secrets Scan - Trufflehog') {
            steps {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    pip install --upgrade trufflehog
                    trufflehog filesystem --directory . --json
                '''
            }
        }

        stage('Dynamic Analysis - Nmap') {
            steps {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    nmap -sV localhost
                '''
            }
        }

        stage('Dynamic Analysis - SQLMap') {
            steps {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    sqlmap -u "http://localhost/vulnerable.php?id=1" --batch
                '''
            }
        }

        stage('Dynamic Analysis - OWASP ZAP') {
            steps {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    "Εδώ βάζεις το ZAP command line για σκαν"
                '''
            }
        }
    }

    post {
        always {
            node {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    Write-Host "Pipeline finished. Reports generated in workspace."
                '''
            }
        }
        failure {
            node {
                powershell '''
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    chcp 65001
                    Write-Host "⚠️ Some stages failed."
                '''
            }
        }
    }
}
