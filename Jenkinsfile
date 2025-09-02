pipeline {
  agent any
  environment {
    IMAGE = "myorg/devsecops-demo:${env.GIT_COMMIT ?: 'latest'}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Deploy Juice Shop') {
      steps {
        sh 'docker-compose -f docker-compose.test.yml up -d --build'
      }
    }
    stage('ZAP Scan') {
      steps {
        sh '''
          mkdir -p zap-reports
          docker run --rm -v $(pwd)/zap-reports:/zap/wrk/:Z owasp/zap2docker-stable zap-baseline.py -t http://juice:3000 -r zap-report.html
        '''
      }
    }
    stage('Nmap & SQLMap') {
      steps {
        sh 'docker run --rm instrumentisto/nmap -p- --open -oN nmap.txt juice'
        sh 'docker run --rm sqlmapproject/sqlmap -u "http://juice:3000/rest/products/search?q=1" --batch --output-dir=/tmp/sqlmap || true'
      }
    }
    stage('Archive Reports') {
      steps {
        archiveArtifacts artifacts: 'zap-reports/**, nmap.txt, **/sqlmap/*.log', allowEmptyArchive: true
      }
    }
  }
  post {
    always {
      sh 'docker-compose -f docker-compose.test.yml down'
    }
  }
}
