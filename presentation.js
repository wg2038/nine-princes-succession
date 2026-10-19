/* ==========================================================================
   THE NINE SONS OF THE DRAGON: INTERACTIVE CONTROLLER
   Manages Reveal.js events, HUD timeline updates, audio effects, and widgets
   ========================================================================== */

// Web Audio API Imperial Resonant Bell Synthesizer (No external sound files required)
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playImperialGong() {
  if (!soundEnabled || !audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  // Deep fundamental gong/bell frequency + harmonic overtone
  const freqs = [174.61, 261.63, 349.23, 523.25]; // F3, C4, F4, C5 (Imperial Pentatonic feel)
  
  freqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = idx === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    
    const decay = 2.5 - idx * 0.4;
    const initialVolume = 0.25 / (idx + 1);
    
    gain.gain.setValueAtTime(initialVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + decay);
  });
}

function playBambooClick() {
  if (!soundEnabled || !audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
  
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(now);
  osc.stop(now + 0.09);
}

// Timeline data for HUD
const slideTimelineMap = {
  0: { year: "1675–1722", era: "Kangxi Era Overview", label: "Prologue" },
  1: { year: "1661–1708", era: "Reign of Emperor Kangxi", label: "The Patriarch & The Root Cause" },
  2: { year: "1708", era: "The 47th Year of Kangxi", label: "The Board: 9 Contenders & 5 Factions" },
  3: { year: "1708 (Autumn)", era: "Saihanba Crisis", label: "Crisis I: The Fall of the Crown Prince" },
  4: { year: "1708 (Winter)", era: "Court Recommendation", label: "The Overplay of the 8th Prince" },
  5: { year: "1712", era: "51st Year of Kangxi", label: "Crisis II: The Final Deposition" },
  6: { year: "1712–1722", era: "The Decade of Shadows", label: "The Master of Stealth: Prince 4" },
  7: { year: "1722 (Winter)", era: "11th Lunar Month", label: "Midnight Succession & The Forgery Myth" },
  8: { year: "1722–1726", era: "Early Yongzheng Era", label: "The Reckoning: Purge & Recompense" },
  9: { year: "1723 Onward", era: "Qing Institutional Reform", label: "The Box Behind the Plaque" },
  10: { year: "Historical Analysis", era: "Lessons on Power", label: "Strategic Takeaways" },
  11: { year: "1735 & Beyond", era: "High Qing Legacy", label: "Epilogue & Q&A" }
};

// Update HUD Display
function updateHUD(slideIndex) {
  const info = slideTimelineMap[slideIndex] || { year: "Qing Dynasty", era: "Imperial Court", label: "Succession" };
  const yearEl = document.getElementById("hud-year-val");
  const eraEl = document.getElementById("hud-era-val");
  const titleEl = document.getElementById("hud-slide-title");

  if (yearEl) yearEl.textContent = info.year;
  if (eraEl) eraEl.textContent = info.era;
  if (titleEl) titleEl.textContent = info.label;
}

// Faction Matrix Data (Slide 3)
const factionData = {
  1: {
    name: "Faction 1: The Broken Heir",
    cn: "二阿哥 · 皇太子党",
    princes: "Crown Prince Yinreng (2nd Prince)",
    allies: "Grand Councillor Songgotu (Hešeri clan), Imperial Guard Commander Tuoba",
    strategy: "Entitlement of Han Confucian Primogeniture. Relied on 33 years as anointed Crown Prince.",
    fatalFlaw: "Arrogance, psychological volatility under relentless surveillance, premature abdication plots.",
    outcome: "Twice deposed (1708, 1712). Died under perpetual house arrest in Xian'an Palace (1725)."
  },
  2: {
    name: "Faction 2: The Eldest & The Scholar",
    cn: "大阿哥与三阿哥",
    princes: "1st Prince Yinzhi (Prince Zhi) & 3rd Prince Yinzhi (Prince Cheng)",
    allies: "Mingju clan connections, Han court scholars, editors of Gujin Tushu Jicheng",
    strategy: "Prince 1 claimed military seniority; Prince 3 cultivated Confucian scholar-bureaucrats.",
    fatalFlaw: "Prince 1 recklessly urged Kangxi to execute Yinreng and used voodoo sorcery, immediately exposed by Prince 3.",
    outcome: "Prince 1 stripped of titles and imprisoned for life (1708). Prince 3 purged by Yongzheng (1730)."
  },
  3: {
    name: "Faction 3: The Stealth Bureaucrats (Future Yongzheng)",
    cn: "四阿哥与十三阿哥 · 隐忍改革派",
    princes: "4th Prince Yinzhen (Future Yongzheng) & 13th Prince Yinxiang",
    allies: "Longkodo (Beijing Gendarmerie), Nian Gengyao (Shaanxi-Sichuan Viceroy)",
    strategy: "'Tao Guang Yang Hui' (Hide brilliance in shadows). Posed as detached Buddhist hermit while solving tax deficits & securing capital chokepoints.",
    fatalFlaw: "Seen as cold, harsh, and friendless ('The Cold-Faced Prince'); had little court popularity.",
    outcome: "VICTORIOUS. Ascended throne in Dec 1722. Yinxiang crowned Iron-Cap Hereditary Prince."
  },
  4: {
    name: "Faction 4: The Aristocratic Masterminds (The 8th Prince Party)",
    cn: "八阿哥、九阿哥、十阿哥 · 八爷党",
    princes: "8th Prince Yinsi ('Virtuous Prince'), 9th Prince Yintang (Financier), 10th Prince Yin'e (Noble Enforcer)",
    allies: "Grand Councillor Tong Guowei, Ma Qi, majority of Manchu nobility and Han scholar officials",
    strategy: "Unrivaled charisma, immense merchant wealth (Prince 9), high-born mother clan nobility (Prince 10).",
    fatalFlaw: "Over-popularity. Terrified Kangxi of a court oligarchy dictating to the imperial throne.",
    outcome: "Crushed by Yongzheng. Renamed to 'Akesina' (Dog) and 'Sesihe' (Pig); died in prison (1726)."
  },
  5: {
    name: "Faction 5: The Grand General",
    cn: "十四阿哥 · 大将军王",
    princes: "14th Prince Yinti (Prince Xun)",
    allies: "Western Expeditionary Army (300,000 troops), allied with 8th Prince faction",
    strategy: "Conferred royal imperial flags as Great General-Commander (抚远大将军王) in Tibetan campaign. Widely viewed as heir.",
    fatalFlaw: "Stationed 1,500 miles away in Northwest frontier when Kangxi died; supply lines held by Nian Gengyao.",
    outcome: "Recalled to Beijing, stripped of military seal, placed under house arrest at Kangxi's Jingling Tomb."
  }
};

function selectFaction(factionId) {
  playBambooClick();
  const data = factionData[factionId];
  if (!data) return;

  // Update tabs
  document.querySelectorAll('.faction-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.faction == factionId);
  });

  // Update mini cards
  document.querySelectorAll('.faction-mini-card').forEach(card => {
    card.classList.toggle('active-card', card.dataset.faction == factionId);
  });

  // Update detail view
  const detailBox = document.getElementById('faction-detail-content');
  if (detailBox) {
    detailBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h3 style="color:var(--text-gold); margin:0;">${data.name}</h3>
        <span style="font-family:var(--font-calligraphy); color:var(--vermilion-bright); font-size:1.1em;">${data.cn}</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:0.88em; line-height:1.5;">
        <div>
          <p><strong style="color:var(--text-gold);">Key Princes:</strong> ${data.princes}</p>
          <p><strong style="color:var(--text-gold);">Key Allies:</strong> ${data.allies}</p>
          <p><strong style="color:var(--text-gold);">Core Strategy:</strong> ${data.strategy}</p>
        </div>
        <div>
          <p><strong style="color:#ff8b8b;">Fatal Weakness:</strong> ${data.fatalFlaw}</p>
          <p><strong style="color:#72e6a7;">Final Historical Fate:</strong> ${data.outcome}</p>
        </div>
      </div>
    `;
  }
}

// Myth Buster Comparison Tabs (Slide 8)
function setMythMode(mode) {
  playBambooClick();
  const tabs = document.querySelectorAll('.myth-tab-btn');
  tabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));

  const mythContent = document.getElementById('myth-dynamic-content');
  if (!mythContent) return;

  if (mode === 'myth') {
    mythContent.innerHTML = `
      <div class="char-transform-box">
        <div>
          <span style="font-size:0.8em; color:var(--text-muted); display:block;">Claimed Original (14th Son):</span>
          <span class="big-char myth-orig">传位十四子</span>
        </div>
        <div style="font-size:2em; color:var(--vermilion); font-weight:bold;">➔</div>
        <div>
          <span style="font-size:0.8em; color:var(--text-muted); display:block;">Claimed Alteration (To 4th Son):</span>
          <span class="big-char myth-fake">传位于四子</span>
        </div>
      </div>
      <p style="font-size:0.85em; color:#ff8b8b; margin-top:8px;">
        <strong>The Popular Legend:</strong> Anti-Yongzheng folk rumor claimed Yinzhen snuck into the bedchamber and added two brushstrokes to turn "十" (Ten) into "于" (To).
      </p>
    `;
  } else if (mode === 'chinese') {
    mythContent.innerHTML = `
      <div class="char-transform-box">
        <div>
          <span style="font-size:0.8em; color:var(--text-muted); display:block;">Qing Imperial Edict Syntax:</span>
          <span class="big-char myth-orig">雍亲王皇四子</span>
        </div>
        <div style="font-size:2em; color:var(--border-gold); font-weight:bold;">≠</div>
        <div>
          <span style="font-size:0.8em; color:var(--text-muted); display:block;">If 14th Son Were Designated:</span>
          <span class="big-char myth-fake">皇十四子</span>
        </div>
      </div>
      <p style="font-size:0.85em; color:var(--text-secondary); margin-top:8px;">
        <strong>Grammatical Impossibility:</strong> Qing imperial wills always wrote "皇某子" (Imperial X Son). If forged, "皇十四子" would become "皇于四子" — total syntactic nonsense in classical Chinese. Furthermore, official Qing writing used traditional "於", not simplified "于"!
      </p>
    `;
  } else if (mode === 'manchu') {
    mythContent.innerHTML = `
      <div class="manchu-script-box" style="text-align:center;">
        <div style="display:flex; justify-content:space-around; align-items:center;">
          <div>
            <div style="font-size:0.75em; color:var(--text-muted);">Manchu: Fourteenth Son</div>
            <div class="manchu-text" style="color:#ff7675; font-size:1.6em; margin:6px 0;">ᠵᡠᠸᠠᠨ ᡩᡠᡳᠴᡳ</div>
            <div style="font-size:0.8em; color:var(--text-muted);">juwan duici</div>
          </div>
          <div style="font-size:2em; color:var(--border-gold);">VS</div>
          <div>
            <div style="font-size:0.75em; color:var(--text-muted);">Manchu: Fourth Son</div>
            <div class="manchu-text" style="color:var(--imperial-yellow); font-size:1.6em; margin:6px 0;">ᡩᡠᡳᠴᡳ</div>
            <div style="font-size:0.8em; color:var(--text-muted);">duici</div>
          </div>
        </div>
      </div>
      <p style="font-size:0.85em; color:#72e6a7; margin-top:8px;">
        <strong>The Definitive Manchu Proof:</strong> Qing imperial edicts were parallel bilingual (Manchu & Chinese). In Manchu script, "14th" is <em>juwan duici</em> while "4th" is simply <em>duici</em>. You cannot forge <em>juwan</em> away without ripping the paper! The preserved Beijing National Archives will clearly reads: <strong>duici jui In Jen</strong> (Prince Yong, Fourth Son Yinzhen).
      </p>
    `;
  }
}

// Secret Plaque Box Reveal (Slide 10)
function toggleSecretBox() {
  playImperialGong();
  const drawer = document.getElementById('secret-box-drawer');
  if (drawer) {
    const isOpened = drawer.classList.contains('opened');
    drawer.classList.toggle('opened', !isOpened);
    const btn = document.getElementById('plaque-action-text');
    if (btn) {
      btn.textContent = isOpened ? "▲ Click Plaque to Inspect Secret Box" : "▼ The Imperial Secret Edict Revealed";
    }
  }
}

// Toggle Sound
function toggleSound() {
  initAudio();
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('hud-sound-btn');
  if (btn) {
    btn.innerHTML = soundEnabled ? '🔔 Sound: ON' : '🔕 Sound: OFF';
    btn.classList.toggle('badge-gold', soundEnabled);
  }
  if (soundEnabled) {
    playImperialGong();
  }
}

// Fullscreen Toggle
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen request error:", err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Modal management
function openModal(id) {
  playBambooClick();
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  playBambooClick();
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Initialize Presentation on Window Load
window.addEventListener('load', () => {
  // Initialize Reveal.js
  Reveal.initialize({
    hash: true,
    slideNumber: 'c/t',
    progress: true,
    controls: true,
    transition: 'fade', // 'slide' | 'fade' | 'convex'
    backgroundTransition: 'fade',
    center: false,
    width: 1200,
    height: 750,
    margin: 0.08,
    plugins: [RevealNotes]
  });

  // Slide changed event
  Reveal.on('slidechanged', event => {
    updateHUD(event.indexh);
    playBambooClick();
  });

  // Initial HUD
  updateHUD(Reveal.getIndices().h);

  // Setup click for plaque
  const plaque = document.getElementById('imperial-plaque-trigger');
  if (plaque) {
    plaque.addEventListener('click', toggleSecretBox);
  }

  // Keyboard shortcut for help modal
  window.addEventListener('keydown', (e) => {
    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      openModal('help-modal');
    }
  });

  // Initialize Faction 1
  selectFaction(1);
  setMythMode('myth');
});
