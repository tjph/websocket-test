<template>
    <v-container>
      <v-row>
        <v-col>
          <!-- Low Inventory Alerts -->
          <v-alert
            v-for="(alert, index) in lowInventoryAlerts"
            :key="`low-${index}`"
            type="warning"
            class="mb-4"
            closable
            @click:close="dismissLowInventoryAlert(index)"
          >
            Low Inventory: {{ alert.store }} - {{ alert.model }} ({{ alert.inventory }} left)
          </v-alert>
  
          <!-- High Inventory Alerts -->
          <v-alert
            v-for="(alert, index) in highInventoryAlerts"
            :key="`high-${index}`"
            type="info"
            class="mb-4"
            closable
            @click:close="dismissHighInventoryAlert(index)"
          >
            High Inventory: {{ alert.store }} - {{ alert.model }} ({{ alert.inventory }} units)
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import type { Message } from '@/composables/useWebSocketStore';
  import { useWebSocketStore } from '@/composables/useWebSocketStore';
  
  const { messages } = useWebSocketStore();
  
  const lowInventoryAlerts = ref<Message[]>([]);
  const highInventoryAlerts = ref<Message[]>([]);
  
  const addLowInventoryAlert = (message: Message) => {
    if (message.inventory < 5) {
      lowInventoryAlerts.value.push(message);
    }
  };
  
  const removeLowInventoryAlert = (message: Message) => {
    const alertIndex = lowInventoryAlerts.value.findIndex(
      alert => alert.store === message.store && alert.model === message.model
    );
    if (alertIndex !== -1) {
      lowInventoryAlerts.value.splice(alertIndex, 1);
    }
  };
  
  const addHighInventoryAlert = (message: Message) => {
    if (message.inventory > 90) {
      highInventoryAlerts.value.push(message);
    }
  };
  
  const removeHighInventoryAlert = (message: Message) => {
    const alertIndex = highInventoryAlerts.value.findIndex(
      alert => alert.store === message.store && alert.model === message.model
    );
    if (alertIndex !== -1) {
      highInventoryAlerts.value.splice(alertIndex, 1);
    }
  };
  
  const dismissLowInventoryAlert = (index: number) => {
    lowInventoryAlerts.value.splice(index, 1);
  };
  
  const dismissHighInventoryAlert = (index: number) => {
    highInventoryAlerts.value.splice(index, 1);
  };
  
  watchEffect(() => {
    messages.forEach((message) => {
      const existingLowAlert = lowInventoryAlerts.value.find(
        alert => alert.store === message.store && alert.model === message.model
      );
  
      const existingHighAlert = highInventoryAlerts.value.find(
        alert => alert.store === message.store && alert.model === message.model
      );
  
      if (message.inventory < 5) {
        if (!existingLowAlert) {
          addLowInventoryAlert(message);
        }
        if (existingHighAlert) {
          removeHighInventoryAlert(message);
        }
      } else if (message.inventory > 90) {
        if (!existingHighAlert) {
          addHighInventoryAlert(message);
        }
        if (existingLowAlert) {
          removeLowInventoryAlert(message);
        }
      } else {
        if (existingLowAlert) {
          removeLowInventoryAlert(message);
        }
        if (existingHighAlert) {
          removeHighInventoryAlert(message);
        }
      }
    });
  });
  </script>
  