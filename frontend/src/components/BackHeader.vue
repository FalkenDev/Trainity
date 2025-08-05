<template>
  <div
    class="d-flex justify-space-between align-center px-5 py-3"
    @click="routeTo"
  >
    <v-btn
      color="grey-darken-4"
      density="compact"
      icon
      size="40"
      variant="flat"
      @click="emit('close')"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <h1 class="text-h5">
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
        <!-- A slot to use in other pages -->
        <template v-if="$slots.menuAppend">
          <slot name="menuAppend" />
        </template>
      </v-menu>
    </v-btn>
    <div
      v-else
      style="width: 40px"
    />
  </div>
</template>
<script lang="ts" setup>
import router from "@/router";

const props = defineProps<{
  title: string;
  showMenu?: boolean;
  routeTo?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const routeTo = () => {
  if (props.routeTo) {
    router.push(props.routeTo);
  }
};
</script>
