import jenkins.model.*
import hudson.security.*

def instance = Jenkins.getInstance()

println "--> Creating admin user"

// Ορισμός realm
def hudsonRealm = new HudsonPrivateSecurityRealm(false)
hudsonRealm.createAccount("admin", "admin123")
instance.setSecurityRealm(hudsonRealm)

// Ορισμός δικαιωμάτων (full access για admin)
def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(false)
instance.setAuthorizationStrategy(strategy)

instance.save()
