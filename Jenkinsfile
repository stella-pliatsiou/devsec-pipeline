pipeline {
    agent any

    environment {
        SNYK_TOKEN = credentials('snyk-token') // το credential που έχεις στο Jenkins
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/stella-pliatsiou/devsec-pipeline.git',
                        credentialsId: '5937ce1d-8203-44e0-8a4a-797403e2649f'
                    ]]
                ])
            }
        }

        stage('Static Analysis - Semgrep') {
            steps {
                powershell '''
                # Force UTF-8 for PowerShell and console
                $OutputEncoding = [System.Text.Encoding]::UTF8
                chcp 65001

                python -m pip install --upgrade pip
                python -m pip install semgrep --upgrade

                # Τρέξε Semgrep και γράψε output σε αρχείο UTF-8
                semgrep --config auto --output semgrep-results.sarif --json || exit 0
                '''
            }
        }

        stage('Static Analysis - Snyk') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8
                chcp 65001

                pip install snyk --upgrade
                snyk auth %SNYK_TOKEN%
                snyk test --json > snyk-results.json || exit 0
                '''
            }
        }

        stage('Secrets Scan - Trufflehog') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8
                chcp 65001

                pip install trufflehog --upgrade
                trufflehog filesystem . --json > trufflehog-results.json || exit 0
                '''
            }
        }

        stage('Dynamic Analysis - Nmap') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8
                chcp 65001

                nmap -oX nmap-results.xml localhost || exit 0
                '''
            }
        }

        stage('Dynamic Analysis - SQLMap') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8
                chcp 65001

                sqlmap -u "http://localhost/vulnerable.php?id=1" --batch --output-dir=sqlmap-results || exit 0
                '''
            }
        }

        stage('Dynamic Analysis - OWASP ZAP') {
            steps {
                powershell '''
                $OutputEncoding = [System.Text.Encoding]::UTF8
                chcp 65001

                zap-cli status || exit 0
                zap-cli quick-scan http://localhost > zap-results.txt || exit 0
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
        failure {
            powershell '''
            Write-Host "⚠️ Some stages failed, but pipeline continued."
            '''
        }
    }
}
