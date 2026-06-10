import { DAYS, PRESETS, SCHEMA_DAY } from "./constants.js";
import {
  cloneSchedule,
  validateSlots,
  timeToMinutes,
  buildPayload,
  getJSON,
  getSchemaOrg,
  getText,
  downloadText,
} from "./utils.js";

// -- Stato applicativo (single source of truth) --
let schedule = cloneSchedule(PRESETS.standard);
let exceptions = [
  { id: 1, date: "2025-12-25", label: "Natale - Chiuso" },
  { id: 1, date: "2025-01-01", label: "Capodanno - Chiuso" },
];
let excIdCounter = 10;
let copySourceDay = null;

// -- Validazione globale --
function globalValidate() {}

// -- Render princiaple --
const todayIdx = (new Date().getDay() + 6) % 7; // 0=monday

function render() {
  const list = document.getElementById("daysList");
  list.innerHTML = "";

  DAYS.forEach(({ key, label, abbr }, idx) => {
    const day = schedule[key];
    // console.log(key, day, label, abbr, idx, day.slots);
    const errors = day.open ? validateSlots(day.slots) : [];
    const isToday = idx === todayIdx;

    const li = document.createElement("li");
    li.className =
      "day-row" +
      (day.open ? "" : " is-closed") +
      (isToday ? " is-today" : "") +
      (errors.length ? " has-error" : "");
    li.setAttribute("aria-label", label);

    // Day name col
    const dayCol = document.createElement("div");
    dayCol.className = "day-col";
    dayCol.innerHTML = `
        <div class="day-name">${label}${isToday ? '<span class="today-pip" title="Oggi" aria-label="oggi"></span>' : ""}</div>
        <div class="day-abbr">${abbr}</div>
    `;

    // Slots col
    const slotsCol = document.createElement("div");
    slotsCol.className = "slots-col";
    slotsCol.setAttribute("role", "group");
    slotsCol.setAttribute("aria-label", `Fasce orare ${label}`);

    if (day.open) {
      day.slots.forEach((slot, i) => {
        const slotErrors = validateSlots([slot]);
        const hasErr = slot.from >= slot.to;
        const slotEl = document.createElement("div");
        slotEl.className = "slot";
        const errId = `err-${key}-${i}`;
        slotEl.innerHTML = `
                <span class="slot-idx" aria-hidden="true">${i + 1}</span>
                <div class="time-pair ${hasErr ? "err" : ""}">
                    ${hasErr ? `<span class="err-tip" id="${errId}" role="alert">Orario non valido; l'apertura deve precedere la chiusura</span>` : ""}
                    <input type="time" class="time-input" value="${slot.from}"
                        aria-label="${label} fascia ${i + 1} apertura"
                        ${hasErr ? `aria-invalid="true" aria-describedby="${errId}"` : ""}
                        data-day="${key}" data-slot="${i}" data-field="from"
                    />
                    <span class="time-sep" aria-hidden="true">-</span>
                    <input type="time" class="time-input" value="${slot.to}"
                        aria-label="${label} fascia ${i + 1} chiusura"
                        ${hasErr ? `aria-invalid="true" aria-describedby="${errId}"` : ""}
                        data-day="${key}" data-slot="${i}" data-field="to"
                    />
                </div>
                <button class="slot-del" title="Rimuovi fascia" aria-label="Rimuovi fascia ${i + 1} di ${label}"
                    data-key="${key}" data-slot="${i}">x</button>
            `;
        slotsCol.appendChild(slotEl);
      });

      if (day.slots.length < 3) {
        const addBtn = document.createElement("button");
        addBtn.className = "add-slot-btn";
        addBtn.setAttribute("data-day", key);
        addBtn.setAttribute(
          "aria-label",
          `Aggiungi fascia oraria per ${label}`,
        );
        addBtn.textContent = "+ Aggiungi fascia";
        slotsCol.appendChild(addBtn);
      }

      //   Copy day link
      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-day-btn";
      copyBtn.setAttribute("data-day", key);
      copyBtn.setAttribute(
        "aria-label",
        `Copia orari di ${label} su altri giorni`,
      );
      copyBtn.innerHTML = `<span style="font-size: 11px">⎘</span> Copia su...`;
      slotsCol.appendChild(copyBtn);
    } else {
      const cl = document.createElement("div");
      cl.className = "closed-label";
      cl.setAttribute("aria-label", `${label} chiuso`);
      cl.textContent = "Chiuso";
      slotsCol.appendChild(cl);
    }

    // Toggle col
    const toggleCol = document.createElement("div");
    toggleCol.className = "toggle-col";
    const togId = `tog-${key}`;
    toggleCol.innerHTML = `
        <label class="toggle" for="${togId}" title="${day.open ? "Aperto" : "Chiuso"}">
            <input type="checkbox" id="${togId}" ${day.open ? "checked" : ""}
                data-day="${key}"
                aria-label="${label}: ${day.open ? "aperto" : "chiuso"}"
            />
            <span class="trk" aria-hidden="true"></span>
        </label>
    `;

    li.appendChild(dayCol);
    li.appendChild(slotsCol);
    li.appendChild(toggleCol);
    list.appendChild(li);
  });

  bindDayEvents();
  renderExceptions();
  renderJSON();
  updateStatus();
  globalValidate();
}

// -- Render eccezioni --
function renderExceptions() {
  const ul = document.getElementById("excList");
  ul.innerHTML = "";
  exceptions.forEach((exc) => {
    const li = document.createElement("li");
    li.className = "exc-row";
    li.setAttribute("data-id", exc.id);

    // Build input via DOM API so user-supplied text can never be interpreted as HTML
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "exc-date-input";
    dateInput.value = exc.date;
    dateInput.setAttribute("aria-label", "Data eccezione");
    dateInput.dataset.id = exc.id;
    dateInput.dataset.field = "date";

    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.className = "exc-label-input";
    labelInput.value = exc.label; // .value is safe - never parsed as markup
    labelInput.placeholder = "Descrizione (es. Chiuso per ferie)";
    labelInput.setAttribute("aria-label", "Descrizione eccezione");
    labelInput.dataset.id = exc.id;
    labelInput.dataset.field = "label";

    const delBtn = document.createElement("button");
    delBtn.className = "exc-del";
    delBtn.dataset.id = exc.id;
    delBtn.setAttribute("aria-label", "Rimuovi eccezione");
    delBtn.textContent = "x";

    li.append(dateInput, labelInput, delBtn);
    ul.appendChild(li);
  });

  // Events
  ul.querySelectorAll(".exc-date-input, .exc-label-input").forEach((inpt) => {
    inpt.addEventListener("change", (e) => {
      const id = parseInt(e.target.dataset.id);
      const field = e.target.dataset.field;
      const exc = exceptions.find((x) => x.id === id);
      if (exc) exc[field] = e.target.value;
    });
  });
  ul.querySelectorAll(".exc-del").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      exceptions = exceptions.filter((x) => x.id !== id);
      renderExceptions();
      toast("Eccezione rimossa", "🗑");
    });
  });
}

// -- Eventi giorno --
function bindDayEvents() {
  // Time change
  document.querySelectorAll(".time-input").forEach((inp) => {
    inp.addEventListener("change", (e) => {
      const { day, slot, field } = e.target.dataset;
      schedule[day].slots[parseInt(slot)][field] = e.target.value;
      console.log(schedule[day]);
      render();
    });
  });

  // Add slot
  document.querySelectorAll(".add-slot-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const key = e.target.dataset.day;
      const last = schedule[key].slots;
      const newFrom = last.length ? last[last.length - 1].to : "09:00";
      schedule[key].slots.push({ from: newFrom, to: "20:00" });
      render();
    });
  });

  // Remove slot
  document.querySelectorAll(".slot-del").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const { key, slot } = e.target.dataset;
      console.log("day", key);
      console.log("slot", slot);
      console.log(e.target.dataset);
      schedule[key].slots.splice(parseInt(slot), 1);
      render();
    });
  });

  // Toggle open/closed
  document.querySelectorAll(".toggle input").forEach((chk) => {
    chk.addEventListener("change", (e) => {
      const key = e.target.dataset.day;
      schedule[key].open = e.target.checked;
      if (e.target.checked && schedule[key].slots.length === 0) {
        schedule[key].slots = [{ from: "09:00", to: "18:00" }];
      }
      render();
    });
  });

  //  Copy day
  document.querySelectorAll(".copy-day-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      copySourceDay = e.currentTarget.dataset.day;
      showCopyPopup(e.currentTarget);
    });
  });
}

// -- Popup copia giorno --
let copyTriggerEl = null;

function closeCopyPupup() {
  const popup = document.getElementById("copyPopup");

  if (!popup.classList.contains("show")) return;
  popup.classList.remove("show");
  popup.setAttribute("aria-hidden", "true");

  //   Return focus to the element that opened the popup
  if (copyTriggerEl) {
    copyTriggerEl.focus();
    copyTriggerEl = null;
  }
}

function showCopyPopup(anchor) {
  const popup = document.getElementById("copyPopup");
  copyTriggerEl = anchor;
  popup.innerHTML = "";

  const header = document.createElement("div");
  header.style.cssText =
    "padding: 8px 16px 16px; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: var(--t3); border-bottom: 1px solid var(--border); margin-bottom: 4px;";
  header.textContent = "Copia orari su...";
  popup.appendChild(header);

  const targets = [
    { key: "all", label: "Tutti i giorni", sub: "Lunedì → Domenica" },
    { key: "weekdays", label: "Giorni feriali", sub: "Lun → Ven" },
    { key: "weekend", label: "Weekend", sub: "Sab → Dom" },
    ...DAYS.filter((d) => d.key !== copySourceDay).map((d) => ({
      key: d.key,
      label: d.label,
      sub: d.abbr,
    })),
  ];

  const options = [];
  targets.forEach((t) => {
    const opt = document.createElement("div");
    opt.className = "copy-option";
    opt.setAttribute("role", "button");
    opt.setAttribute("tabindex", "0");
    opt.setAttribute("aria-label", `Copia su ${t.label}`);

    const wrap = document.createElement("div");
    const lbl = document.createElement("div");
    lbl.className = "copy-option-label";
    lbl.textContent = t.label;
    const sub = document.createElement("div");
    sub.className = "copy-option-sub";
    sub.textContent = t.sub;
    wrap.append(lbl, sub);
    opt.appendChild(wrap);

    opt.addEventListener("click", () => {
      applyDayCopy(copySourceDay, t.key);
      closeCopyPupup();
    });

    opt.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        opt.click();
      } else if (e.key === "Escape") {
        closeCopyPupup();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const i = options.indexOf(opt);
        (options[i + 1] || options[0]).focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const i = options.indexOf(opt);
        (options[i - 1] || options[options.length - 1]).focus();
      }
    });
    options.push(opt);
    popup.appendChild(opt);
  });

  const rect = anchor.getBoundingClientRect();
  popup.style.top = rect.bottom + 6 + window.scrollY + "px";
  popup.style.left = rect.left + "px";
  popup.classList.add("show");

  //   Move focus into the popup for keyboard & screen-reader user
  if (options[0]) options[0].focus();
}

function applyDayCopy(src, target) {
  const slots = schedule[src].slots.map((s) => ({ ...s }));
  const open = schedule[src].open;

  let affected = [];
  if (target === "all") {
    affected = DAYS.map((d) => d.key).filter((k) => k !== src);
  } else if (target === "weekdays") {
    affected = ["monday", "tuesday", "wednesday", "thursday", "friday"].filter(
      (k) => k !== src,
    );
  } else if (target === "weekend") {
    affected = ["saturday", "sunday"].filter((k) => k !== src);
  } else {
    affected = [target];
  }

  affected.forEach((k) => {
    schedule[k].open = open;
    schedule[k].slots = slots.map((s) => ({ ...s }));
  });

  const srcMeta = DAYS.find((d) => d.key === src);
  toast(
    `Orari di ${srcMeta.label} copiati su ${affected.length} giorn${affected.length === 1 ? "o" : "i"}`,
    "⎘",
  );
  render();
}

// -- Chiusura popup --
document.addEventListener("click", () => {
  const popup = document.getElementById("copyPopup");
  if (popup.classList.contains("show")) {
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
    copyTriggerEl = null;
  }
});

// Close popup on Escape from anywhere
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCopyPupup();
});

// -- Preset --
document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.preset;
    if (PRESETS[key]) {
      schedule = cloneSchedule(PRESETS[key]);
      document
        .querySelectorAll(".preset-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
      console.log(btn.textContent);
      toast(`Preset ${btn.textContent} applicato`, "⚡");
    }
  });
});

// Preset attivo all'avvio: 'Negozio std' (standard)
document
  .querySelector('.preset-btn[data-preset="standard"]')
  ?.classList.add("active");

// -- Aggiungi eccezione --
document.getElementById("excAddBtn").addEventListener("click", () => {
  excIdCounter++;
  const today = new Date().toISOString().split("T")[0];
  exceptions.push({ id: excIdCounter, date: today, label: "Chiuso" });
  renderExceptions();
});

//  -- Stato live --
function updateStatus() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("clockEl").textContent = `${h}:${m}`;

  const dayIdx = (now.getDay() + 6) % 7;
  const dayKey = DAYS[dayIdx].key;
  const dayLabel = DAYS[dayIdx].label;
  const day = schedule[dayKey];
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const chip = document.getElementById("liveChip");
  const liveLabel = document.getElementById("liveLabel");
  const statusNow = document.getElementById("statusNow");
  const statusSub = document.getElementById("statusSub");
  const nextChange = document.getElementById("nextChange");

  if (!day.open || day.slots.length === 0) {
    chip.className = "live-chip closed";
    liveLabel.textContent = "Chiuso";
    statusNow.textContent = "Chiuso";
    statusNow.className = "status-now closed-txt";
    statusSub.textContent = `${dayLabel} - nessuna fascia`;
    nextChange.textContent = "Orario di apertura domani";
    return;
  }

  let isOpen = false;
  let currentSlot = null;
  let nextEvent = null;

  for (const slot of day.slots) {
    const fromMin = timeToMinutes(slot.from);
    const toMin = timeToMinutes(slot.to);
    if (nowMin >= fromMin && nowMin < toMin) {
      isOpen = true;
      currentSlot = slot;
      // Next close
      nextEvent = { type: "close", time: slot.to };
      break;
    }
    // upcoming slot
    if (nowMin < fromMin && !nextEvent) {
      nextEvent = { type: "open", time: slot.from };
    }
  }

  if (isOpen) {
    chip.className = "live-chip open";
    liveLabel.textContent = "Aperto";
    statusNow.textContent = "Aperto ora";
    statusNow.className = "status-now open-txt";
    statusSub.textContent = `Fino alle ${currentSlot.to}`;
    nextChange.textContent = nextEvent ? `Chiude alle ${nextEvent.time}` : `-`;
  } else {
    chip.className = "live-chip closed";
    liveLabel.textContent = "Chiuso";
    statusNow.textContent = "Chiuso";
    statusNow.className = "status-now closed-txt";
    statusSub.textContent = dayLabel;
    nextChange.textContent = nextEvent
      ? `Apre alle ${nextEvent.time}`
      : "Nessun'altra apertura oggi";
  }
}

// -- Anteprima JSON --
function renderJSON() {
  const raw = JSON.stringify(buildPayload(schedule), null, 2);
  const html = raw
    .replace(/("[\w]+")\s*:/g, '<span class="jk">$1</span>:')
    .replace(/:\s*("[\d:]+")([,\n]|$)/g, ': <span class="js">$1</span>$2')
    .replace(/:\s*(false)/g, ': <span class="jb">$1</span>')
    .replace(/([{}\[\],])/g, '<span class="jp">$1</span>');

  document.getElementById("jsonPre").innerHTML = html;
}

// -- Export --
document.getElementById("expJson").addEventListener("click", () => {
  downloadText(getJSON(schedule), "shophours.json", "application/json");
  toast("JSON scaricato", "{ }");
});

document.getElementById("expSchema").addEventListener("click", () => {
  downloadText(
    getSchemaOrg(schedule),
    "shophours-schema.json",
    "application/json",
  );
  toast("Schema.org scaricato", "🔍");
});

document.getElementById("expText").addEventListener("click", () => {
  downloadText(getText(schedule), "orari.txt");
  toast("Testo scaricato", "📄");
});

// -- Salva --
document.getElementById("saveBtn").addEventListener("click", () => {
  const btn = document.getElementById("saveBtn");
  btn.textContent = "✓ Salvato";
  btn.style.background = "var(--ok)";
  setTimeout(() => {
    ((btn.textContent = "Salva"), (btn.style.background = "var(--accent)"));
  }, 2000);
  toast("Configurazione salvata", "✓");
});

// -- Toast --
let toastTimer = null;
function toast(msg, icon = "✓") {
  console.log(msg, icon);
  const el = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  document.getElementById("toastIcon").textContent = icon;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2500);
}

// CLOCK
setInterval(updateStatus, 30000);

// INIT
render();
