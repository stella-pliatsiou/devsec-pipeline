pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Snyk Security Scan') {
            agent { label 'docker' }
            steps {
                sh 'snyk test'
            }
        }
        stage('SonarQube Analysis') {
            agent { label 'docker' }
            steps {
                sh 'sonar-scanner'
            }
        }
        stage('Semgrep Scan') {
            agent { label 'docker' }
            steps {
                sh 'semgrep --config auto .'
            }
        }
        stage('Trufflehog Secret Scan') {
            agent { label 'docker' }
            steps {
                sh 'trufflehog git file://. --only-verified'
            }
        }
        stage('Dynamic Scan with Nmap') {
            agent { label 'docker' }
            steps {
                sh 'nmap -sV localhost'
            }
        }
        stage('Dynamic Scan with SQLMap') {
            agent { label 'docker' }
            steps {
                sh 'sqlmap -u "http://localhost:3000" --batch'
            }
        }
        stage('Dynamic Scan with OWASP ZAP') {
            agent { label 'docker' }
            steps {
                sh 'zap-baseline.py -t http://localhost:3000 -r zap_report.html'
            }
        }
    }
}
