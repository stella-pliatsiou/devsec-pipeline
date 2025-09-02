pipeline {
  agent any
  environment {
    IMAGE = "myapp:${env.GIT_COMMIT}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps {
        sh 'docker build -t ${IMAGE} .'
      }
    }
    stage('Deploy to test') {
      steps {
        sh 'docker run -d --name test-app -p 3000:3000 ${IMAGE} || true'
        sleep 8
      }
    }
    stage('Nmap scan') {
      steps {
        sh 'docker run --rm instrumentisto/nmap -sV -p- 127.0.0.1 -oN nmap-results.txt || true'
        archiveArtifacts artifacts: 'nmap-results.txt'
      }
    }
    stage('ZAP full scan') {
      steps {
        sh "docker run --rm -v ${env.WORKSPACE}:/zap/wrk/:rw owasp/zap2docker-stable zap-baseline.py -t http://host.docker.internal:3000 -r zap_report.html || true"
        archiveArtifacts artifacts: 'zap_report.html'
      }
    }
    stage('sqlmap') {
      steps {
        sh "docker run --rm -v ${env.WORKSPACE}:/zap/wrk/:rw sqlmapproject/sqlmap -u \"http://host.docker.internal:3000/search?q=1\" --batch --output-dir=/zap/wrk/sqlmap || true"
        archiveArtifacts artifacts: 'sqlmap/**'
      }
    }
  }
  post {
    always {
      sh 'docker rm -f test-app || true'
    }
  }
}