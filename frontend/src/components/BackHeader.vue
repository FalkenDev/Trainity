<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Trainity.
  -
  - Trainity is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Trainity. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <div
    class="d-flex justify-space-between align-center px-5 pb-3 border-b-sm"
    style="padding-top: calc(12px + env(safe-area-inset-top, 0px))"
  >
    <div :style="showSave ? 'width: 73px' : 'width: 40px'">
      <v-btn
        color="transparent"
        density="compact"
        icon
        size="40"
        variant="flat"
        @click="handleClick"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>
    <h1 class="text-h5">
      {{ title }}
    </h1>
    <v-btn v-if="showSave" color="primary" density="compact" variant="flat" @click="$emit('save')">
      {{ $t('common.save') }}
    </v-btn>
    <v-btn v-if="showMenu" color="grey-darken-4" density="compact" icon size="40" variant="flat">
      <v-icon>mdi-menu</v-icon>
      <v-menu activator="parent">
        <!-- A slot to use in other pages -->
        <template v-if="$slots.menuAppend">
          <slot name="menuAppend" />
        </template>
      </v-menu>
    </v-btn>
    <div v-if="!showSave && !showMenu" style="width: 40px" />
  </div>
</template>
<script lang="ts" setup>
import router from '@/router'

const props = defineProps<{
  title: string
  showMenu?: boolean
  showSave?: boolean
  routeTo?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
}>()

const routeTo = () => {
  if (props.routeTo) {
    router.push(props.routeTo)
  }
}

const handleClick = () => {
  if (props.routeTo) {
    routeTo()
  } else {
    emit('close')
  }
}
</script>
