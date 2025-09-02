# Quickstart — DevSecOps pipeline

## 1) Τοπικά hooks

1. Πρόσθεσε το φάκελο `.githooks/` με τα αρχεία `pre-commit` και `pre-push`.
2. Βάλε τα εκτελέσιμα: `git update-index --add --chmod=+x .githooks/pre-commit` και `.../pre-push`.
3. Ενεργοποίησε τα hooks στο repo: `git config core.hooksPath .githooks`.

## 2) GitLab CI

1. Πρόσθεσε το `.gitlab-ci.yml` από το repo.
2. Στο GitLab: **Settings → CI/CD → Variables** πρόσθεσε:
   - `SNYK_TOKEN`
   - `SONAR_TOKEN`
   - `SONAR_HOST` (π.χ. https://sonarcloud.io ή self-hosted Sonar)
   - `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD`
3. Κάνε push και παρακολούθησε pipeline.

## 3) Jenkins (προαιρετικό)

1. Στήσε Jenkins server (cloud VM ή host) με Docker installed.
2. Δημιούργησε Pipeline job και κόλλησε το `Jenkinsfile`.
3. Configure credentials, plugins (Pipeline, Docker, GitLab plugin) και setup webhook στο GitLab για να triggerάρει Jenkins jobs.

## 4) Target app για testing

- Προτείνω OWASP Juice Shop: `docker run --rm -p 3000:3000 bkimminich/juice-shop`

## Σημαντικές Σημειώσεις

- Όλα τα δυναμικά scans πρέπει να τρέχουν **ΜΟΝΟ** σε περιβάλλοντα που ανήκουν σε εσένα ή έχεις άδεια.
- Αν δεν έχεις WSL/δεν θες να τρέχεις βαριά εργαλεία τ