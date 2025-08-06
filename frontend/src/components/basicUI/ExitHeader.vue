<template>
  <div
    class="d-flex justify-space-between align-center px-5 py-3"
    @click="routeTo"
  >
    <v-btn
      v-if="showMenu"
      color="grey-darken-4"
      density="compact"
      icon
      size="40"
      variant="flat"
      :loading="isLoading"
      @click.stop="emit('close')"
    >
      <template v-if="!isLoading">
        <v-icon>mdi-arrow-left</v-icon>
      </template>
    </v-btn>
    <h1 class="text-h6">
      {{ title }}
    </h1>
    <v-btn
      v-if="showMenu"
      color="grey-darken-4"
      density="compact"
      icon
      size="40"
      variant="flat"
    >
      <v-icon>mdi-menu</v-icon>
      <v-menu activator="parent">
        <template v-if="$slots.menuAppend">
          <slot name="menuAppend" />
        </template>
      </v-menu>
    </v-btn>
  </div>
</template>
<script lang="ts" setup>
import router from "@/router";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const props = defineProps<{
  title: string;
  showMenu?: boolean;
  routeTo?: string;
  isLoading?: boolean;
}>();

const routeTo = () => {
  if (props.routeTo) {
    router.push(props.routeTo);
  }
};
</script>
