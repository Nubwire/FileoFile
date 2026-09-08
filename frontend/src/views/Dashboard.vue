<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app permanent>
      <v-list>
        <v-list-item>
          <img src="/logo.png" alt="fileofile" class="sidebar-logo" />
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-item to="/" active-class="primary--text">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item to="/documents" active-class="primary--text">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Documents</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="error" @click="logout">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer />
      <v-chip>
        {{ authStore.user?.name || 'User' }}
      </v-chip>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Total Documents</v-card-title>
              <v-card-text class="text-h3">{{ stats.total }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Recent Uploads</v-card-title>
              <v-card-text class="text-h3">{{ stats.recent }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Storage Used</v-card-title>
              <v-card-text class="text-h3">{{ stats.storage }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Recent Documents</v-card-title>
              <v-list>
                <v-list-item v-for="doc in recentDocuments" :key="doc.id">
                  <v-list-item-icon>
                    <v-icon>mdi-file-document</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ doc.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ doc.file_name }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip small>{{ formatSize(doc.file_size) }}</v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const drawer = ref(true);
const stats = ref({ total: 0, recent: 0, storage: '0 MB' });
const recentDocuments = ref([]);

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

async function logout() {
  await authStore.logout();
  router.push('/login');
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    const docs = await response.json();
    recentDocuments.value = docs.slice(0, 5);
    stats.value.total = docs.length;
    stats.value.recent = docs.filter(d => {
      const date = new Date(d.created_at);
      return date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }).length;
    const totalBytes = docs.reduce((sum, d) => sum + (d.file_size || 0), 0);
    stats.value.storage = formatSize(totalBytes);
  } catch (error) {
    console.error('Failed to fetch documents:', error);
  }
});
</script>

<style scoped>
.sidebar-logo {
  max-width: 160px;
  width: 100%;
  height: auto;
  display: block;
  margin: 8px 0;
}
</style>
