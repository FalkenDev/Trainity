<template>
  <div class="d-flex flex-column fill-height bg-grey-darken-4">
    <BackHeader
      :title="$t('settings.activities')"
      show-menu
      :loading="isLoading"
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="openCreateDialog">
            <v-list-item-title>{{ $t('activity.createActivity') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div class="flex-grow-1 overflow-y-auto pa-4">
      <v-list v-if="activities.length > 0">
        <v-list-item
          v-for="activity in activities"
          :key="activity.id"
          class="mb-2 bg-grey-darken-3 rounded"
        >
          <template #prepend>
            <v-icon>mdi-{{ getIconName(activity.icon) }}</v-icon>
          </template>
          <v-list-item-title>{{ activity.name }}</v-list-item-title>
          <v-list-item-subtitle v-if="activity.description">
            {{ activity.description }}
          </v-list-item-subtitle>
          <template #append>
            <v-btn
              icon
              size="small"
              variant="text"
              @click="openEditDialog(activity)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(activity)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
      <div
        v-else
        class="text-center text-grey pa-5"
      >
        {{ $t('activity.noActivities') }}
      </div>
    </div>

    <!-- Create/Edit Activity Dialog -->
    <v-dialog
      v-model="isDialogOpen"
      max-width="600"
    >
      <v-card>
        <v-card-title>
          {{ editingActivity ? $t('activity.editActivity') : $t('activity.createActivity') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.name"
              :label="$t('activity.activityName')"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-3"
            />
            <v-textarea
              v-model="formData.description"
              :label="$t('activity.activityDescription')"
              variant="outlined"
              rows="2"
              class="mb-3"
            />
            <v-select
              v-model="formData.icon"
              :items="iconOptions"
              :label="$t('activity.selectIcon')"
              :rules="[rules.required]"
              item-title="label"
              item-value="value"
              variant="outlined"
              class="mb-3"
            >
              <template #prepend-inner>
                <v-icon>mdi-{{ getIconName(formData.icon) }}</v-icon>
              </template>
            </v-select>

            <div class="mb-3">
              <v-checkbox
                v-model="formData.trackDistance"
                :label="$t('activity.trackDistance')"
                hide-details
              />
              <v-checkbox
                v-model="formData.trackPace"
                :label="$t('activity.trackPace')"
                hide-details
              />
              <v-checkbox
                v-model="formData.trackElevation"
                :label="$t('activity.trackElevation')"
                hide-details
              />
              <v-checkbox
                v-model="formData.trackCalories"
                :label="$t('activity.trackCalories')"
                hide-details
              />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="closeDialog"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="isSaving"
            @click="saveActivity"
          >
            {{ $t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="isDeleteDialogOpen"
      max-width="400"
    >
      <v-card>
        <v-card-title>{{ $t('activity.deleteActivity') }}</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ activityToDelete?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="isDeleteDialogOpen = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            :loading="isDeleting"
            @click="deleteActivity"
          >
            {{ $t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useActivityStore } from '@/stores/activity.store';
import { createActivity, updateActivity, deleteActivity as deleteActivityService } from '@/services/activity.service';
import type { Activity, ActivityIcon, CreateActivityDto } from '@/interfaces/Activity.interface';
import { toast } from 'vuetify-sonner';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits<{ close: [] }>();
const activityStore = useActivityStore();

const isLoading = computed(() => activityStore.isLoadingActivities);
const activities = computed(() => activityStore.activities);

const isDialogOpen = ref(false);
const editingActivity = ref<Activity | null>(null);
const formRef = ref();
const isSaving = ref(false);

const isDeleteDialogOpen = ref(false);
const activityToDelete = ref<Activity | null>(null);
const isDeleting = ref(false);

const formData = ref<CreateActivityDto>({
  name: '',
  description: '',
  icon: 'other' as ActivityIcon,
  trackDistance: false,
  trackPace: false,
  trackElevation: false,
  trackCalories: false,
});

const rules = {
  required: (v: string | number | null) => !!v || t('common.required'),
};

const iconOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Walking', value: 'walking' },
  { label: 'Cycling', value: 'cycling' },
  { label: 'Football', value: 'football' },
  { label: 'Swimming', value: 'swimming' },
  { label: 'Kayaking', value: 'kayaking' },
  { label: 'Hiking', value: 'hiking' },
  { label: 'Yoga', value: 'yoga' },
  { label: 'Boxing', value: 'boxing' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Basketball', value: 'basketball' },
  { label: 'Volleyball', value: 'volleyball' },
  { label: 'Skiing', value: 'skiing' },
  { label: 'Skating', value: 'skating' },
  { label: 'Rowing', value: 'rowing' },
  { label: 'Other', value: 'other' },
];

function getIconName(icon: ActivityIcon): string {
  const iconMap: Record<ActivityIcon, string> = {
    running: 'run',
    walking: 'walk',
    cycling: 'bike',
    football: 'soccer',
    swimming: 'swim',
    kayaking: 'kayaking',
    hiking: 'hiking',
    yoga: 'yoga',
    boxing: 'boxing',
    tennis: 'tennis',
    basketball: 'basketball',
    volleyball: 'volleyball',
    skiing: 'skiing',
    skating: 'skating',
    rowing: 'rowing',
    other: 'dots-horizontal',
  };
  return iconMap[icon] || 'dots-horizontal';
}

function openCreateDialog() {
  editingActivity.value = null;
  formData.value = {
    name: '',
    description: '',
    icon: 'other' as ActivityIcon,
    trackDistance: false,
    trackPace: false,
    trackElevation: false,
    trackCalories: false,
  };
  isDialogOpen.value = true;
}

function openEditDialog(activity: Activity) {
  editingActivity.value = activity;
  formData.value = {
    name: activity.name,
    description: activity.description,
    icon: activity.icon,
    trackDistance: activity.trackDistance,
    trackPace: activity.trackPace,
    trackElevation: activity.trackElevation,
    trackCalories: activity.trackCalories,
  };
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
  editingActivity.value = null;
}

async function saveActivity() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isSaving.value = true;
  try {
    if (editingActivity.value) {
      await updateActivity(editingActivity.value.id, formData.value);
      toast.success(t('activity.updated'));
    } else {
      await createActivity(formData.value);
      toast.success(t('activity.created'));
    }
    await activityStore.fetchActivities(true);
    closeDialog();
  } catch (error: unknown) {
    toast.error((error as Error).message || t('activity.failedToCreate'));
  } finally {
    isSaving.value = false;
  }
}

function confirmDelete(activity: Activity) {
  activityToDelete.value = activity;
  isDeleteDialogOpen.value = true;
}

async function deleteActivity() {
  if (!activityToDelete.value) return;

  isDeleting.value = true;
  try {
    await deleteActivityService(activityToDelete.value.id);
    toast.success(t('activity.deleted'));
    await activityStore.fetchActivities(true);
    isDeleteDialogOpen.value = false;
  } catch (error: unknown) {
    toast.error((error as Error).message || t('activity.failedToDelete'));
  } finally {
    isDeleting.value = false;
  }
}
</script>
