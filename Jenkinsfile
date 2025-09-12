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
                    sonar-scanner \
                    -Dsonar.projectKey=devsec-pipeline \
                    -Dsonar.sources=/usr/src \
                     -Dsonar.host.url=https://vigilant-waddle-p9v9jqr9vgpcrw4-9000.app.github.dev/ \
                     -Dsonar.login=$SONAR_USER \
                     -Dsonar.password=$SONAR_PASS \
                     -Dsonar.organization=stella-pliatsiou \
                     -Dsonar.projectKey=stella-pliatsiou_devsec-pipeline
                    '''
                    }
                }
            }
        }

        stage('Snyk Scan') {
            steps {
                script {
                        // Pull του Snyk image
                        sh 'docker pull snyk/snyk-cli:docker'

                        // Εκτέλεση Snyk scan
                        sh '''
                        echo "Checking if package.json exists:"
                        ls -l /project
                        docker run --rm \
                            -e SNYK_TOKEN=${SNYK_TOKEN} \
                            -v /var/jenkins_home/workspace/devsec-pipeline/app \
                            snyk/snyk-cli:docker test --file=/project/package.json
                        '''
                }
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

        stage('Start App for Dynamic Analysis') {
            steps {
                sh 'node app.js &'
            }
        }

        stage('ZAP Scan') {
            steps {
                sh '''
                # ZAP baseline scan
                docker run --rm -v $WORKSPACE:/zap/wrk:rw owasp/zap2docker-stable zap-baseline.py -t http://host.docker.internal:3000 -r zap_report.html

                # SQLmap example
                docker run --rm --network host sqlmapproject/sqlmap -u "http://host.docker.internal:3000/user?id=1" --batch

                # Nmap example
                docker run --rm --network host instrumentisto/nmap -p 3000 host.docker.internal
                '''
            }
        }

        stage('Reports') {
            steps {
                archiveArtifacts artifacts: '**/zap_report.html', allowEmptyArchive: true
            }
        }
    }
}
