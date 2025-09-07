pipeline {
    agent any

    environment {
        SNYK_TOKEN = credentials('SNYK_TOKEN')  // Secret για Snyk
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
                # Χρησιμοποιούμε UTF-8 encoding για να αποφύγουμε Unicode σφάλματα
                $OutputEncoding = [System.Text.Encoding]::UTF8

                python -m pip install --upgrade pip
                python -m pip install semgrep --upgrade

                # Εκτέλεση Semgrep
                semgrep --config auto --output semgrep-results.sarif
                '''
            }
        }

        stage('Static Analysis - Snyk') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8

                npm install -g snyk
                cd vulnerable-app
                snyk auth $env:SNYK_TOKEN
                snyk test --json || echo "Snyk test failed"
                npm install -g snyk-to-html
                snyk test --json | snyk-to-html -o snyk-report.html
                '''
            }
        }

        stage('Secrets Scan - Trufflehog') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8

                docker run --rm -v "${PWD}:/src" trufflesecurity/trufflehog:latest filesystem --path /src || echo "Trufflehog scan failed"
                '''
            }
        }

        stage('Dynamic Analysis - Nmap') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8

                choco install nmap -y
                nmap -sV localhost || echo "Nmap scan failed"
                '''
            }
        }

        stage('Dynamic Analysis - SQLMap') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8

                python -m pip install sqlmap --upgrade
                sqlmap -u "http://localhost/vulnerable-endpoint" --batch || echo "SQLMap scan failed"
                '''
            }
        }

        stage('Dynamic Analysis - OWASP ZAP') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8

                docker run -v "${PWD}:/zap/wrk/:rw" owasp/zap2docker-stable zap-baseline.py -t http://localhost:8080 || echo "ZAP scan failed"
                '''
            }
        }
    }

    post {
        always {
            powershell '$OutputEncoding = [System.Text.Encoding]::UTF8; echo "Pipeline finished (reports generated)."'
        }
        success {
            powershell 'echo "✅ Build succeeded!"'
        }
        failure {
            powershell 'echo "❌ Build failed!"'
        }
    }
}
