<template>
  <div class="mx-5">
    <div class="d-flex justify-end py-3">
      <v-btn variant="text">
        Logout
      </v-btn>
    </div>
    <div class="d-flex flex-column align-center justify-center pb-5">
      <v-avatar
        class="mb-4"
        size="100"
        color="primary"
      />
      <h1 class="text-h5 white--text">
        Kasper Falk
      </h1>
    </div>
    <div class="d-flex flex-column ga-5">
      <div>
        <h1 class="text-h6">
          Content
        </h1>
        <v-list class="bg-transparent">
          <v-list-item
            v-for="item in contentList"
            :key="item.title"
            class="px-0"
            :disabled="item.disabled"
            @click="setDialogToOpen(item.type)"
          >
            <v-list-item-title class="d-flex flex-row justify-space-between align-center">
              <p>{{ item.title }}</p>
              <v-icon v-if="item.showArrow">
                mdi-chevron-right
              </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      <div>
        <h1 class="text-h6">
          Preferences
        </h1>
        <v-list class="bg-transparent">
          <v-list-item
            v-for="item in preferencesList"
            :key="item.title"
            class="px-0"
            :disabled="item.disabled"
          >
            <v-list-item-title class="d-flex flex-row justify-space-between align-center">
              <p>{{ item.title }}</p>
              <v-icon v-if="item.showArrow">
                mdi-chevron-right
              </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>
    <v-dialog
      v-model="isExerciseListOpen"
      fullscreen
      transition="slide-y-transition"
      persistent
    >
      <ExerciseList
        @close="isExerciseListOpen = false"
      />
    </v-dialog>
    <v-dialog
      v-model="isSessionListOpen"
      fullscreen
      transition="slide-y-transition"
      persistent
    >
      <SessionList />
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import SessionList from '@/components/Settings/SessionList.vue';

const isExerciseListOpen = ref(false);
const isSessionListOpen = ref(false);

const setDialogToOpen = (type: string) => {
  switch (type) {
    case 'exercises':
      isExerciseListOpen.value = true;
      break;
    case 'sessions':
      isSessionListOpen.value = true;
      break;
    case 'workouts':
      // Handle workouts dialog opening logic here
      break;
    default:
      return
  }
};

const contentList = [
  { title: 'Exercises', showArrow: true, type: 'exercises', disabled: false },
  { title: 'Workouts', showArrow: true, type: 'workouts', disabled: true },
  { title: 'Sessions', showArrow: true, type: 'sessions', disabled: false },
];
const preferencesList  = [
  { title: 'Settings', showArrow: true, disabled: true },
  { title: 'Account', showArrow: true, disabled: true  },
  { title: 'Appearance', showArrow: true, disabled: true   },
  { title: 'Units', showArrow: true, disabled: true   },
  { title: 'Language', showArrow: true, disabled: true   },
  { title: 'Help', showArrow: true, disabled: true   }
];
</script>