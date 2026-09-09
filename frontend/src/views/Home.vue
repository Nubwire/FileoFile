<template>
  <div class="marketing-page">
    <v-app-bar app flat class="marketing-nav" height="76">
      <v-container class="d-flex align-center py-0" style="max-width: 1200px;">
        <img src="/logo.png" alt="FileoFile" class="nav-logo" />
        <v-spacer />
        <a href="#features" class="nav-link d-none d-sm-inline">Features</a>
        <a href="#security" class="nav-link d-none d-sm-inline">Security</a>
        <v-btn
          v-if="!authStore.isAuthenticated"
          color="primary"
          variant="outlined"
          to="/login"
          class="ml-4"
        >
          Login
        </v-btn>
        <v-btn v-else color="primary" to="/dashboard" class="ml-4">
          Dashboard
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Hero -->
    <section class="hero">
      <v-container style="max-width: 1200px;">
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="hero-headline">
              Every policy, claim and client file — filed where it belongs.
            </h1>
            <p class="hero-sub">
              FileoFile gives insurance brokers, agencies and underwriters a secure,
              organized home for every document, so nothing gets lost in an inbox
              or a desktop folder again.
            </p>
            <div class="d-flex flex-wrap ga-3 mt-6">
              <v-btn size="large" color="primary" to="/login">
                Get started
              </v-btn>
              <v-btn size="large" variant="outlined" color="primary" href="#features">
                See how it works
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center mt-8 mt-md-0">
            <svg viewBox="0 0 420 380" class="hero-illustration" xmlns="http://www.w3.org/2000/svg">
              <rect x="70" y="40" width="230" height="290" rx="6" fill="#F7F4EC" stroke="#C7BFAE" stroke-width="1.5" transform="rotate(-4 185 185)" />
              <rect x="100" y="20" width="230" height="290" rx="6" fill="#FFFDF8" stroke="#C7BFAE" stroke-width="1.5" transform="rotate(3 215 165)" />
              <path d="M55 120C55 111.716 61.7157 105 70 105H150C158 105 162 108 168 114L182 128H345C353.284 128 360 134.716 360 143V295C360 303.284 353.284 310 345 310H70C61.7157 310 55 303.284 55 295V120Z" fill="#D9B776" stroke="#232A33" stroke-width="2.5" />
              <path d="M55 143H360" stroke="#232A33" stroke-width="2.5" />
              <rect x="90" y="165" width="130" height="16" rx="2" fill="#FFFDF8" />
              <rect x="90" y="192" width="90" height="10" rx="2" fill="#FFFDF8" opacity="0.85" />
              <g transform="translate(255 235) rotate(-10)">
                <rect x="-58" y="-24" width="116" height="48" rx="4" fill="none" stroke="#B23A2E" stroke-width="3" />
                <text x="0" y="6" text-anchor="middle" font-family="Roboto Slab, serif" font-weight="700" font-size="16" fill="#B23A2E">FILED</text>
              </g>
            </svg>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Trust strip -->
    <section class="trust-strip">
      <v-container style="max-width: 1200px;">
        <v-row>
          <v-col cols="12" sm="4" class="d-flex align-center trust-item">
            <v-icon color="primary" class="mr-3">mdi-lock-outline</v-icon>
            <span>Encrypted document storage</span>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-center trust-item">
            <v-icon color="primary" class="mr-3">mdi-folder-check-outline</v-icon>
            <span>Organized by client and policy</span>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-center trust-item">
            <v-icon color="primary" class="mr-3">mdi-cloud-outline</v-icon>
            <span>Access from any browser</span>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <v-container style="max-width: 1200px;">
        <h2 class="section-heading text-center mb-10">
          Built for how brokerages actually work
        </h2>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="index-card feature-card pa-6">
              <v-icon size="36" color="secondary">mdi-file-search-outline</v-icon>
              <h3 class="feature-title mt-4">File it once, find it forever</h3>
              <p class="feature-text">
                Upload a document and it stays put — attached to the right client
                and policy, ready to pull up the moment you need it again.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="index-card feature-card pa-6">
              <v-icon size="36" color="secondary">mdi-briefcase-outline</v-icon>
              <h3 class="feature-title mt-4">No more folder guesswork</h3>
              <p class="feature-text">
                Documents are organized the way brokers think about their book of
                business, not buried in generic shared drive folders.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="index-card feature-card pa-6">
              <v-icon size="36" color="secondary">mdi-devices</v-icon>
              <h3 class="feature-title mt-4">Your files, wherever you are</h3>
              <p class="feature-text">
                FileoFile runs in the browser. Log in from the office, a client
                site, or home, and your filing cabinet comes with you.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Security -->
    <section id="security" class="security">
      <v-container style="max-width: 1200px;">
        <v-row align="center">
          <v-col cols="12" md="6">
            <h2 class="section-heading">Security your clients' records deserve</h2>
            <p class="feature-text mb-4">
              Insurance files carry sensitive personal and financial information.
              FileoFile stores every document encrypted, with access limited to
              the accounts you authorize.
            </p>
            <ul class="security-list">
              <li>Encrypted storage for every uploaded file</li>
              <li>Per-account access — nothing is shared by default</li>
              <li>Built on Cloudflare's secure cloud infrastructure</li>
            </ul>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center mt-8 mt-md-0">
            <span class="stamp-badge stamp-badge-lg">Secure by default</span>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Login CTA, deliberately placed further down the page -->
    <section class="login-cta">
      <v-container style="max-width: 1200px;" class="text-center">
        <h2 class="section-heading">Already filing with us?</h2>
        <p class="feature-text mb-6">Sign in to pick up right where you left off.</p>
        <v-btn size="x-large" color="primary" to="/login">
          Log in to your account
        </v-btn>
      </v-container>
    </section>

    <footer class="marketing-footer">
      <v-container style="max-width: 1200px;" class="d-flex flex-column flex-sm-row align-center justify-space-between">
        <div class="d-flex align-center">
          <img src="/logo.png" alt="FileoFile" class="footer-logo" />
        </div>
        <div class="footer-meta">
          <a href="/login" class="nav-link">Login</a>
          <span class="mx-2">·</span>
          <span>© {{ year }} FileoFile</span>
        </div>
      </v-container>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const year = new Date().getFullYear();
</script>

<style scoped>
.marketing-page {
  background-color: #EFEAE0;
}

.marketing-nav {
  background-color: #EFEAE0 !important;
  border-bottom: 1px solid #C7BFAE;
}

.nav-logo {
  height: 52px;
  width: auto;
}

.footer-logo {
  height: 40px;
  width: auto;
}

.nav-link {
  color: #232A33;
  text-decoration: none;
  font-weight: 500;
  margin-left: 24px;
}

.nav-link:hover {
  color: #B23A2E;
}

.hero {
  padding: 96px 0 64px;
}

.hero-headline {
  font-family: 'Roboto Slab', Georgia, serif;
  font-weight: 800;
  font-size: 2.6rem;
  line-height: 1.15;
  color: #232A33;
  max-width: 20ch;
}

.hero-sub {
  font-size: 1.1rem;
  color: #232A33;
  opacity: 0.85;
  max-width: 48ch;
  margin-top: 20px;
}

.hero-illustration {
  width: 100%;
  max-width: 380px;
  height: auto;
}

.trust-strip {
  border-top: 1px solid #C7BFAE;
  border-bottom: 1px solid #C7BFAE;
  padding: 24px 0;
  background-color: #F7F4EC;
}

.trust-item {
  font-weight: 500;
  color: #232A33;
  justify-content: center;
}

.features {
  padding: 88px 0;
}

.section-heading {
  font-family: 'Roboto Slab', Georgia, serif;
  font-weight: 700;
  font-size: 2rem;
  color: #232A33;
}

.feature-card {
  height: 100%;
}

.feature-title {
  font-family: 'Roboto Slab', Georgia, serif;
  font-size: 1.15rem;
  color: #232A33;
}

.feature-text {
  color: #232A33;
  opacity: 0.85;
  line-height: 1.6;
}

.security {
  padding: 88px 0;
  background-color: #F7F4EC;
  border-top: 1px solid #C7BFAE;
  border-bottom: 1px solid #C7BFAE;
}

.security-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-list li {
  padding: 8px 0 8px 28px;
  position: relative;
  color: #232A33;
  opacity: 0.9;
}

.security-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #B23A2E;
  font-weight: 700;
}

.stamp-badge-lg {
  font-size: 1.3rem;
  padding: 14px 28px;
  border-width: 3px;
  transform: rotate(-6deg);
}

.login-cta {
  padding: 96px 0;
}

.marketing-footer {
  border-top: 1px solid #C7BFAE;
  padding: 32px 0;
}

.footer-meta {
  color: #232A33;
  opacity: 0.75;
  font-size: 0.9rem;
  margin-top: 16px;
}

@media (min-width: 600px) {
  .footer-meta {
    margin-top: 0;
  }
}
</style>
