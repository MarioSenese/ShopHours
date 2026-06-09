/**
 * constant.js - dati statici (nessuna dipendenza)
 */

export const DAYS = [
  { key: "monday", label: "Lunedì", abbr: "LUN", short: "Lun" },
  { key: "tuesday", label: "Martedì", abbr: "MAR", short: "Mar" },
  { key: "wednesday", label: "Mercoledì", abbr: "MER", short: "Mer" },
  { key: "thursday", label: "Giovedì", abbr: "GIO", short: "Gio" },
  { key: "friday", label: "Venerdì", abbr: "VEN", short: "Ven" },
  { key: "saturday", label: "Sabato", abbr: "SAB", short: "Sab" },
  { key: "sunday", label: "Domenica", abbr: "DOM", short: "Dom" },
];

export const PRESETS = {
  standard: {
    monday: {
      open: true,
      slots: [
        { from: "09:00", to: "13:00" },
        { from: "15:30", to: "19:30" },
      ],
    },
    tuesday: {
      open: true,
      slots: [
        { from: "09:00", to: "13:00" },
        { from: "15:30", to: "19:30" },
      ],
    },
    wednesday: {
      open: true,
      slots: [
        { from: "09:00", to: "13:00" },
        { from: "15:30", to: "19:30" },
      ],
    },
    thursday: {
      open: true,
      slots: [
        { from: "09:00", to: "13:00" },
        { from: "15:30", to: "19:30" },
      ],
    },
    friday: {
      open: true,
      slots: [
        { from: "09:00", to: "13:00" },
        { from: "15:30", to: "19:30" },
      ],
    },
    saturday: { open: true, slots: [{ from: "09:00", to: "13:00" }] },
    sunday: { open: false, slots: [] },
  },
  restaurant: {
    monday: { open: false, slots: [] },
    tuesday: {
      open: true,
      slots: [
        { from: "12:00", to: "14:30" },
        { from: "19:00", to: "23:30" },
      ],
    },
    wednesday: {
      open: true,
      slots: [
        { from: "12:00", to: "14:30" },
        { from: "19:00", to: "23:30" },
      ],
    },
    thursday: {
      open: true,
      slots: [
        { from: "12:00", to: "14:30" },
        { from: "19:00", to: "23:30" },
      ],
    },
    friday: {
      open: true,
      slots: [
        { from: "12:00", to: "14:30" },
        { from: "19:00", to: "23:30" },
      ],
    },
    saturday: {
      open: true,
      slots: [
        { from: "12:00", to: "15:00" },
        { from: "19:00", to: "23:30" },
      ],
    },
    sunday: { open: true, slots: [{ from: "12:00", to: "15:00" }] },
  },
  pharmacy: {
    monday: {
      open: true,
      slots: [
        { from: "08:30", to: "13:00" },
        { from: "15:30", to: "20:00" },
      ],
    },
    tuesday: {
      open: true,
      slots: [
        { from: "08:30", to: "13:00" },
        { from: "15:30", to: "20:00" },
      ],
    },
    wednesday: {
      open: true,
      slots: [
        { from: "08:30", to: "13:00" },
        { from: "15:30", to: "20:00" },
      ],
    },
    thursday: {
      open: true,
      slots: [
        { from: "08:30", to: "13:00" },
        { from: "15:30", to: "20:00" },
      ],
    },
    friday: {
      open: true,
      slots: [
        { from: "08:30", to: "13:00" },
        { from: "15:30", to: "20:00" },
      ],
    },
    saturday: { open: true, slots: [{ from: "08:30", to: "13:00" }] },
    sunday: { open: false, slots: [] },
  },
  gym: {
    monday: { open: true, slots: [{ from: "06:00", to: "22:00" }] },
    tuesday: { open: true, slots: [{ from: "06:00", to: "22:00" }] },
    wednesday: { open: true, slots: [{ from: "06:00", to: "22:00" }] },
    thursday: { open: true, slots: [{ from: "06:00", to: "22:00" }] },
    friday: { open: true, slots: [{ from: "06:00", to: "22:00" }] },
    saturday: { open: true, slots: [{ from: "08:00", to: "20:00" }] },
    sunday: { open: true, slots: [{ from: "09:00", to: "14:00" }] },
  },
  office: {
    monday: { open: true, slots: [{ from: "09:00", to: "18:00" }] },
    tuesday: { open: true, slots: [{ from: "09:00", to: "18:00" }] },
    wednesday: { open: true, slots: [{ from: "09:00", to: "18:00" }] },
    thursday: { open: true, slots: [{ from: "09:00", to: "18:00" }] },
    friday: { open: true, slots: [{ from: "09:00", to: "17:00" }] },
    saturday: { open: false, slots: [] },
    sunday: { open: false, slots: [] },
  },
};

export const SCHEMA_DAY = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};
