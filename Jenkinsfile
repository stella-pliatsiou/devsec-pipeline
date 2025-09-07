pipeline {
    agent any

    environment {
        SNYK_TOKEN = credentials('snyk-token')  // βάλτο αν έχεις Snyk token
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/stella-pliatsiou/devsec-pipeline.git'
            }
        }

        stage('Static Analysis - Semgrep') {
            steps {
                powershell '''
                    python -m pip install --upgrade pip
                    pip install semgrep
                    semgrep --config=auto .
                '''
            }
        }

        stage('Static Analysis - Snyk') {
            steps {
                powershell '''
                    snyk auth %SNYK_TOKEN%
                    snyk test
                '''
            }
        }

        stage('Secrets Scan - Trufflehog') {
            steps {
                powershell '''
                    pip install truffleHog
                    trufflehog filesystem .
                '''
            }
        }

        stage('Dynamic Analysis - Nmap') {
            steps {
                powershell '''
                    nmap -sV 127.0.0.1
                '''
            }
        }

        stage('Dynamic Analysis - SQLMap') {
            steps {
                powershell '''
                    sqlmap -u "http://localhost/vuln.php?id=1" --batch
                '''
            }
        }

        stage('Dynamic Analysis - OWASP ZAP') {
            steps {
                powershell '''
                    "Εκτέλεσε OWASP ZAP εδώ"
                '''
            }
        }
    }

    post {
        always {
            powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8
                chcp 65001
                Write-Host "Pipeline finished. Reports generated in workspace."
            '''
        }
        success {
            powershell '''
                Write-Host "✅ Pipeline completed successfully!"
            '''
        }
        failure {
            powershell '''
                Write-Host "❌ Pipeline failed. Check logs for errors."
            '''
        }
    }
}
