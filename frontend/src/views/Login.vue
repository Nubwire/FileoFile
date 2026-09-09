<template>
  <v-container fluid fill-height class="login-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6 login-card" rounded="sm">
          <v-card-title class="d-flex justify-center mb-2">
            <img src="/logo.png" alt="fileofile" class="login-logo" />
          </v-card-title>
          <div class="d-flex justify-center mb-4">
            <span class="stamp-badge">Secure Storage</span>
          </div>
          <v-card-subtitle class="text-center text-body-1 mb-6">
            {{ isRegister ? 'Create your account' : 'Sign in to your account' }}
          </v-card-subtitle>

          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
              v-if="isRegister"
              v-model="name"
              label="Name"
              prepend-icon="mdi-account"
              :rules="[rules.required]"
              outlined
              dense
            />

            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-icon="mdi-email"
              :rules="[rules.required, rules.email]"
              outlined
              dense
            />

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              prepend-icon="mdi-lock"
              :rules="[rules.required]"
              outlined
              dense
            />

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
            >
              {{ isRegister ? 'Sign Up' : 'Sign In' }}
            </v-btn>

            <v-divider class="my-4" />

            <p class="text-center text-caption">
              <template v-if="isRegister">
                Already have an account? <a href="#" class="brand-link" @click.prevent="isRegister = false">Sign in</a>
              </template>
              <template v-else>
                Don't have an account? <a href="#" class="brand-link" @click.prevent="isRegister = true">Sign up</a>
              </template>
            </p>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const name = ref('');
const loading = ref(false);
const isRegister = ref(false);

const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'Invalid email'
};

async function handleSubmit() {
  loading.value = true;
  try {
    if (isRegister.value) {
      await authStore.register(email.value, password.value, name.value);
    } else {
      await authStore.login(email.value, password.value);
    }
    router.push('/dashboard');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  background:
    radial-gradient(circle at 25% 15%, rgba(35, 42, 51, 0.07), transparent 55%),
    radial-gradient(circle at 85% 90%, rgba(217, 183, 118, 0.18), transparent 50%),
    #EFEAE0;
  min-height: 100vh;
}

.login-card {
  position: relative;
  overflow: visible;
}

.login-card::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 32px;
  width: 64px;
  height: 12px;
  background-color: #D9B776;
  border-radius: 2px 2px 0 0;
}

.login-logo {
  max-width: 220px;
  width: 100%;
  height: auto;
}

.brand-link {
  color: #232A33;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid #D9B776;
}

.brand-link:hover {
  color: #B23A2E;
}
</style>
