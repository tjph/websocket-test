<template>
  <v-container>
    <!-- Filter Section -->
    <v-row class="mb-5">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedStore"
          :items="storeOptions"
          label="Filter by Store"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedModel"
          :items="modelOptions"
          label="Filter by Model"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="inventoryThreshold"
          label="Inventory Less Than"
          variant="outlined"
          type="number"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="filteredMessages"
      :items-per-page="25"
      class="elevation-1"
    >
      <template v-slot:item.inventory="{ item }">
        <span :style="getInventoryColor(item.inventory)">{{ item.inventory }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWebSocketStore } from '@/composables/useWebSocketStore';

const { messages } = useWebSocketStore();

const selectedStore = ref<string | null>(null);
const selectedModel = ref<string | null>(null);
const inventoryThreshold = ref<number | null>(null);

const headers = ref([
  { title: 'Store', key: 'store', sortable: true },
  { title: 'Model', key: 'model', sortable: true },
  { title: 'Inventory', key: 'inventory', sortable: true },
]);

const storeOptions = computed(() => {
  return [...new Set(messages.map(msg => msg.store))].sort();
});

const modelOptions = computed(() => {
  return [...new Set(messages.map(msg => msg.model))].sort();
});

const filteredMessages = computed(() => {
  return messages.filter(msg => {
    const storeMatch = selectedStore.value ? msg.store === selectedStore.value : true;
    const modelMatch = selectedModel.value ? msg.model === selectedModel.value : true;
    const inventoryMatch = inventoryThreshold.value !== null ? msg.inventory < inventoryThreshold.value : true;
    return storeMatch && modelMatch && inventoryMatch;
  });
});

const getInventoryColor = (inventory: number) => {
  if (inventory < 5) {
    return 'color: red;';
  } else if (inventory > 90) {
    return 'color: green;';
  } else {
    return 'color: black;';
  }
};
</script>

