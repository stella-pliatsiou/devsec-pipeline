pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/stella-pliatsiou/devsec-pipeline.git'
            }
        }

        stage('Static Analysis - Semgrep') {
            steps {
                sh '''
                    pip install semgrep
                    semgrep --config auto --output semgrep-results.sarif || true
                '''
            }
        }

        stage('Static Analysis - Snyk') {
            steps {
                sh '''
                    npm install -g snyk snyk-to-html
                    cd vulnerable-app
                    npm install
                    snyk auth $SNYK_TOKEN
                    snyk test --json | snyk-to-html -o ../snyk-report.html || true
                '''
            }
        }

        stage('Secrets Scan - Trufflehog') {
            steps {
                sh '''
                    docker run --rm -v "$WORKSPACE:/src" trufflesecurity/trufflehog:latest filesystem --path /src || true
                '''
            }
        }

        stage('Dynamic Analysis - Nmap') {
            steps {
                sh '''
                    nmap -sV localhost || true
                '''
            }
        }

        stage('Dynamic Analysis - SQLMap') {
            steps {
                sh '''
                    sqlmap -u "http://localhost/vulnerable-endpoint" --batch || true
                '''
            }
        }

        stage('Dynamic Analysis - OWASP ZAP') {
            steps {
                sh '''
                    docker run -v "$WORKSPACE:/zap/wrk/:rw" owasp/zap2docker-stable zap-baseline.py -t http://localhost:8080 || true
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished (reports generated).'
        }
        success {
            echo '✅ Build successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
