pipeline {
    agent any

    environment {
        SNYK_TOKEN = credentials('SNYK_TOKEN')  // Αν έχεις αποθηκεύσει το secret στο Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Static Analysis - Semgrep') {
            steps {
                powershell '''
                pip install --upgrade pip
                pip install semgrep
                semgrep --config auto --output semgrep-results.sarif
                '''
            }
        }

        stage('Static Analysis - Snyk') {
            steps {
                powershell '''
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
                docker run --rm -v "${PWD}:/src" trufflesecurity/trufflehog:latest filesystem --path /src || echo "Trufflehog scan failed"
                '''
            }
        }

        stage('Dynamic Analysis - Nmap') {
            steps {
                powershell '''
                choco install nmap -y
                nmap -sV localhost || echo "Nmap scan failed"
                '''
            }
        }

        stage('Dynamic Analysis - SQLMap') {
            steps {
                powershell '''
                pip install sqlmap
                sqlmap -u "http://localhost/vulnerable-endpoint" --batch || echo "SQLMap scan failed"
                '''
            }
        }

        stage('Dynamic Analysis - OWASP ZAP') {
            steps {
                powershell '''
                docker run -v "${PWD}:/zap/wrk/:rw" owasp/zap2docker-stable zap-baseline.py -t http://localhost:8080 || echo "ZAP scan failed"
                '''
            }
        }
    }

    post {
        always {
            powershell 'echo "Pipeline finished (reports generated)."'
        }
        success {
            powershell 'echo "✅ Build succeeded!"'
        }
        failure {
            powershell 'echo "❌ Build failed!"'
        }
    }
}
//      # -------