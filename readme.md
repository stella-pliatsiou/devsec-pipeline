# DevSecOps Automated Pipeline

This project demonstrates an automated **DevSecOps pipeline** with:

- Git Hooks (`pre-commit` with Trufflehog)
- GitLab CI (`.gitlab-ci.yml`)
- Jenkins Pipeline (`Jenkinsfile`)
- Dockerized environment (`docker-compose.yml`)
- Static analysis: Snyk, SonarQube, Semgrep
- Secret scanning: Trufflehog
- Dynamic analysis: Nmap, SQLMap, OWASP ZAP

## Run the vulnerable app

```bash
docker-compose up --build
```

Then open: [http://localhost:3000](http://localhost:3000)

