pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Deploy Juice Shop') {
      steps {
        bat 'docker-compose -f docker-compose.test.yml up -d --build'
      }
    }
    stage('ZAP Scan') {
      steps {
        bat 'docker run --rm -v %cd%\\zap-reports:/zap/wrk owasp/zap2docker-stable zap-baseline.py -t http://host.docker.internal:3000 -r zap-report.html'
      }
    }
    stage('Nmap & SQLMap') {
      steps {
        bat 'docker run --rm instrumentisto/nmap -p- --open -oN nmap.txt host.docker.internal'
        bat 'docker run --rm sqlmapproject/sqlmap -u "http://host.docker.internal:3000/rest/products/search?q=1" --batch --output-dir=C:\\tmp\\sqlmap || exit 0'
      }
    }
    stage('Archive Reports') {
      steps {
        archiveArtifacts artifacts: 'zap-reports/**, nmap.txt, C:\\tmp\\sqlmap\\**', allowEmptyArchive: true
      }
    }
    post {
      always {
        bat 'docker-compose -f docker-compose.test.yml down'
      }
    }
  }
}
