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
export default createVuetify( {
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
        },
      },
      light: {
        dark: false,
        colors: {
        },
      }
    },
  },
  defaults: {
    VBtn: {
      density: 'compact',
      height: '40px'
    },
    VBtnToggle: {
      density: 'compact'
    },
    VAlert: {
      density: 'compact'
    },
    VBanner: {
      density: 'compact'
    },
    VTextField: {
      density: 'compact'
    },
    VTextarea: {
      density: 'compact'
    },
    VSelect: {
      density: 'compact'
    },
    VAutocomplete: {
      density: 'compact'
    },
    VCombobox: {
      density: 'compact',
      delimiters: [',']
    },
    VFileInput: {
      density: 'compact'
    },
    VCheckbox: {
      density: 'compact'
    },
    VRadio: {
      density: 'compact'
    },
    VRadioGroup: {
      density: 'compact'
    },
    VSwitch: {
      density: 'compact'
    },
    VSlider: {
      density: 'compact'
    },
    VRangeSlider: {
      density: 'compact'
    },
    VToolbar: {
      density: 'compact'
    },
    VTabs: {
      density: 'compact'
    },
    VBreadcrumbs: {
      density: 'compact'
    },
    VPagination: {
      density: 'compact'
    },
    VDataTable: {
      density: 'compact'
    },
    VDataTableServer: {
      density: 'compact'
    },
    VTimeline: {
      density: 'compact'
    },
    VTimelineItem: {
    },
    VAvatar: {
      density: 'compact'
    },
    VIcon: {
    },
    VRating: {
      density: 'compact'
    }
  },
} )