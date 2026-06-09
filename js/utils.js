/**
 * Funzioni pure - dipende solo da constant.js
 * Nessuno stato globale: tutto passa per argomenti.
 */

import { DAYS, SCHEMA_DAY } from "./constants.js";

// Deep clone di una configurazione, per non mutare i preset
export function cloneSchedule(s) {
  const out = [];
  Object.keys(s).forEach((k) => {
    out[k] = { open: s[k].open, slots: s[k].slots.map((sl) => ({ ...sl })) };
  });
  return out;
}

// Restituisce un array di messaggi d'errore per le fasce di un giorno
export function validateSlots(slots) {
  const errors = [];
  for (let i = 0; i < slots.length; i++) {
    const a = slots[i];
    if (a.from >= a.to)
      errors.push(`Fascia ${i + 1}: l'orario di apertura è dopo la chiusura`);
    for (let j = i + 1; j < slots.length; j++) {
      const b = slots[j];
      if (a.from < b.to && b.from < a.to) {
        errors.push(`Fasce ${i + 1} e ${j + 1} si sovrappongono`);
      }
    }
  }
  return errors;
}

// "HH:MM" -> minuti dalla mezzanotte
export function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Costruisce il payload { giorno: slots | false } - usato da JSON e anteprima
export function buildPayload(schedule) {
  const out = {};
  DAYS.forEach(({ key }) => {
    const d = schedule[key];
    out[key] = d.open ? d.slots : false;
  });
  return out;
}

/**
 * ---- Export in vari formati ----
 */

export function getJSON(schedule) {
  return JSON.stringify(buildPayload(schedule), null, 2);
}

export function getSchemaOrg(schedule) {
  const specs = [];
  DAYS.forEach(({ key }) => {
    const d = schedule[key];
    if (!d.open) return;
    d.slots.forEach((slot) => {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${SCHEMA_DAY[key]}`,
        opens: slot.from,
        closes: slot.to,
      });
    });
  });
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      openingHoursSpecification: specs,
    },
    null,
    2,
  );
}

export function getText(schedule) {
  return DAYS.map(({ key, label }) => {
    const d = schedule[key];
    if (!d.open) return `${label}: Chiuso`;
    return `${label}: ${d.slots.map((s) => `${s.from}-${s.to}`).join(", ")}`;
  }).join("\n");
}

// Forza il download di un contenuto testuale come file
export function downloadText(content, filename, mime = "text/plain") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  a.click();
}
