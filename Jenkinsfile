pipeline {
    agent any

    environment {
        SNYK_TOKEN = credentials('snyk-token')  // Βάλε το όνομα του secret από Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/stella-pliatsiou/devsec-pipeline.git'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {   // Το όνομα που έδωσες στο Jenkins → SonarQube servers
                    script {
                        def scannerHome = tool 'SonarScanner'  // Το όνομα από Manage Jenkins → Tools
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=devsec-pipeline \
                            -Dsonar.sources=.
                        """
                    }
                }
            }
        }

        stage('Snyk Scan') {
            steps {
                sh """
                    snyk auth ${SNYK_TOKEN}
                    snyk test || true
                """
            }
        }

        stage('Semgrep Scan') {
            steps {
                sh """
                    semgrep --config=auto . || true
                """
            }
        }

        stage('TruffleHog Scan') {
            steps {
                sh """
                    trufflehog git https://github.com/stella-pliatsiou/devsec-pipeline.git --json || true
                """
            }
        }

        stage('ZAP Scan') {
            steps {
                sh 'docker build -t vulnerable-app ./vulnerable-app'
                sh 'docker run -d --name vulnerable-app -p 3000:3000 vulnerable-app'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/*.html', allowEmptyArchive: true
        }
    }
}
