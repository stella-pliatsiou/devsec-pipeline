pipeline {
    agent any

    environment {
        SONARQUBE = 'SonarQube' // Το όνομα που έδωσες στο Jenkins για SonarQube
        SNYK_TOKEN = credentials('SNYK_TOKEN') // Αν έχεις προσθέσει το Snyk token στο Jenkins credentials
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/stella-pliatsiou/devsec-pipeline.git'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv(SONARQUBE) {
                    sh 'sonar-scanner -Dsonar.projectKey=devsec-pipeline -Dsonar.sources=.'
                }
            }
        }

        stage('Snyk Scan') {
            steps {
                sh 'docker run --rm -e SNYK_TOKEN=$SNYK_TOKEN -v $PWD:/app snyk/snyk:docker test'
            }
        }

        stage('Semgrep Scan') {
            steps {
                sh 'docker run --rm -v $PWD:/src returntocorp/semgrep semgrep --config=p/ci'
            }
        }

        stage('TruffleHog Scan') {
            steps {
                sh 'docker run --rm -v $PWD:/code trufflesecurity/trufflehog git https://github.com/stella-pliatsiou/devsec-pipeline.git'
            }
        }

        stage('ZAP Scan') {
            steps {
                sh 'docker run --rm -v $PWD/reports:/zap/wrk -t owasp/zap2docker-stable zap-baseline.py -t http://host.docker.internal:8080'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*.*', allowEmptyArchive: true
        }
    }
}
