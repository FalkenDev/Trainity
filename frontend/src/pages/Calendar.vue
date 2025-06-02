<template>
    <v-sheet>
        <v-calendar ref="calendar" v-model="mockCalendarData"></v-calendar>
    </v-sheet>
</template>
<script lang="ts" setup>
const mockCalendarData = [
    {
        name: 'Workout 1',
        start: '2023-10-01',
        end: '2023-10-01',
        color: 'primary',
    },
    {
        name: 'Workout 2',
        start: '2023-10-02',
        end: '2023-10-02',
        color: 'secondary',
    },
];
</script>