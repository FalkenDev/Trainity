/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#ABFF1A',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF0000',
          textPrimary: '#FFFFFF',
          textSecondary: '#A1A1A1',
          cardBg: '#15181E',
          background: '#0C0E12',
          iconBackground: '#304d00ff',
          borderColor: '#474747',
          weekDayBg: '#242424',
          avatarBg: '#3d462d',
        },
      },
      light: {
        dark: false,
        colors: {
          primary: '#4CAF50',
          secondary: '#607D8B',
          accent: '#2196F3',
          error: '#E53935',
          textPrimary: '#212121',
          textSecondary: '#757575',
          cardBg: '#FFFFFF',
          background: '#EAEDED',
          iconBackground: '#E8F5E9',
          borderColor: '#D5D8DC',
          weekDayBg: '#F5F5F5',
          avatarBg: '#C8E6C9',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      density: 'compact',
      height: '40px',
    },
    VBtnToggle: {
      density: 'compact',
    },
    VAlert: {
      density: 'compact',
    },
    VBanner: {
      density: 'compact',
    },
    VTextField: {},
    VTextarea: {
      density: 'compact',
    },
    VSelect: {
      density: 'compact',
    },
    VAutocomplete: {
      density: 'compact',
    },
    VCombobox: {
      density: 'compact',
      delimiters: [','],
    },
    VFileInput: {
      density: 'compact',
    },
    VCheckbox: {
      density: 'compact',
    },
    VRadio: {
      density: 'compact',
    },
    VRadioGroup: {
      density: 'compact',
    },
    VSwitch: {
      density: 'compact',
    },
    VSlider: {
      density: 'compact',
    },
    VRangeSlider: {
      density: 'compact',
    },
    VToolbar: {
      density: 'compact',
    },
    VTabs: {
      density: 'compact',
    },
    VBreadcrumbs: {
      density: 'compact',
    },
    VPagination: {
      density: 'compact',
    },
    VDataTable: {
      density: 'compact',
    },
    VDataTableServer: {
      density: 'compact',
    },
    VTimeline: {
      density: 'compact',
    },
    VTimelineItem: {},
    VAvatar: {
      density: 'compact',
    },
    VRating: {
      density: 'compact',
    },
  },
})
