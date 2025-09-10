pipeline {
    agent any

    environment {
        SNYK_TOKEN = credentials('SNYK_TOKEN') // Jenkins credential
        SONAR_TOKEN = credentials('SONAR_TOKEN') // Jenkins credential
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Scan') {
            steps {
                sh '''
                    docker run --rm \
                    --add-host=host.docker.internal:host-gateway \
                    -e SONAR_HOST_URL=https://vigilant-waddle-p9v9jqr9vgpcrw4-9000.app.github.dev/ \
                    -e SONAR_TOKEN=squ_169c2a5eb9bd06e6941a1aec79a09315e0a6db3b \
                    -v /var/jenkins_home/workspace/Pipeline:/usr/src \
                    sonarsource/sonar-scanner-cli \
                    -Dsonar.projectKey=devsec-pipeline \
                    -Dsonar.sources=/usr/src
                '''
            }
        }

        stage('Snyk Scan') {
            steps {
                sh '''
                    docker run --rm \
                    -e SNYK_TOKEN=$SNYK_TOKEN \
                    -v $PWD:/app \
                    snyk/snyk-cli:2 test /app
                '''
            }
        }

        stage('Semgrep Scan') {
            steps {
                sh '''
                    docker run --rm \
                    -v $PWD:/src \
                    returntocorp/semgrep semgrep --config=p/ci /src
                '''
            }
        }

        stage('TruffleHog Scan') {
            steps {
                sh '''
                    docker run --rm \
                    -v $PWD:/repo \
                    trufflesecurity/trufflehog git https://github.com/stella-pliatsiou/devsec-pipeline.git
                '''
            }
        }

        stage('ZAP Scan') {
            steps {
                sh '''
                    docker run --rm \
                    -v $PWD:/zap/wrk \
                    -t owasp/zap2docker-weekly zap-baseline.py \
                    -t http://host.docker.internal:8000 \
                    -r zap_report.html
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/zap_report.html', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
