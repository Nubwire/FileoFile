<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app permanent class="app-drawer">
      <v-list>
        <v-list-item>
          <img src="/logo.png" alt="fileofile" class="sidebar-logo" />
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item to="/" active-class="primary--text">
          <v-list-item-icon><v-icon>mdi-view-dashboard</v-icon></v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item to="/documents" active-class="primary--text">
          <v-list-item-icon><v-icon>mdi-folder</v-icon></v-list-item-icon>
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
      <v-toolbar-title>Documents</v-toolbar-title>
      <v-spacer />
      <v-btn color="white" text @click="showUpload = true">
        <v-icon left>mdi-upload</v-icon>
        Upload
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
        <v-row v-if="documents.length > 0">
          <v-col v-for="doc in documents" :key="doc.id" cols="12" sm="6" md="4" lg="3">
            <v-card hover class="index-card">
              <v-card-text>
                <v-icon large color="primary">mdi-file-document</v-icon>
                <div class="text-subtitle-1 font-weight-bold mt-2">{{ doc.title }}</div>
                <div class="text-caption">{{ doc.file_name }}</div>
                <div class="text-caption">{{ formatSize(doc.file_size) }}</div>
                <div class="text-caption">Uploaded: {{ new Date(doc.created_at).toLocaleDateString() }}</div>
              </v-card-text>
              <v-card-actions>
                <v-btn small text color="error" @click="deleteDocument(doc.id)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <div class="empty-state text-center py-12">
              <v-icon size="56" color="secondary">mdi-folder-open-outline</v-icon>
              <div class="text-h6 mt-4 mb-2">No documents filed yet</div>
              <p class="text-body-2 mb-6">Upload your first policy, certificate or client file to get started.</p>
              <v-btn color="primary" @click="showUpload = true">
                <v-icon left>mdi-upload</v-icon>
                Upload a document
              </v-btn>
            </div>
          </v-col>
        </v-row>
        </v-row>

        <!-- Upload Dialog -->
        <v-dialog v-model="showUpload" max-width="500">
          <v-card>
            <v-card-title>Upload Document</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="file"
                label="Select File"
                prepend-icon="mdi-paperclip"
                outlined
              />
              <v-text-field
                v-model="title"
                label="Title"
                outlined
              />
              <v-textarea
                v-model="description"
                label="Description"
                outlined
                rows="3"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="showUpload = false">Cancel</v-btn>
              <v-btn color="primary" @click="uploadDocument" :loading="uploading">
                Upload
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
const documents = ref([]);
const showUpload = ref(false);
const uploading = ref(false);
const file = ref(null);
const title = ref('');
const description = ref('');

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

async function fetchDocuments() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    documents.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch documents:', error);
  }
}

async function uploadDocument() {
  if (!file.value) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('title', title.value || file.value.name);
  formData.append('description', description.value);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formData
    });

    if (response.ok) {
      await fetchDocuments();
      showUpload.value = false;
      file.value = null;
      title.value = '';
      description.value = '';
    }
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    uploading.value = false;
  }
}

async function deleteDocument(id) {
  if (!confirm('Delete this document?')) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    if (response.ok) {
      await fetchDocuments();
    }
  } catch (error) {
    console.error('Delete failed:', error);
  }
}

async function logout() {
  await authStore.logout();
  router.push('/login');
}

onMounted(fetchDocuments);
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
