<template>
  <v-container fluid fill-height class="login-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="10" rounded="lg">
          <v-card-title class="text-center text-h4 font-weight-bold mb-4">
            fileofile
          </v-card-title>
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
                Already have an account? <a href="#" @click.prevent="isRegister = false">Sign in</a>
              </template>
              <template v-else>
                Don't have an account? <a href="#" @click.prevent="isRegister = true">Sign up</a>
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
    router.push('/');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>
