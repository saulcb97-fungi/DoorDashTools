/**
 * AM Floor-Ready Quest — App logic
 * v2: XSS-safe, A11y, modern clipboard, debounced saves, flow bug fixed
 */
(function(){
  "use strict";

  const LS_KEY = "amFloorReadyQuest.v2";
  const {
    badges, conceptCards, memoryPairs, quizQuestions, dojoItems,
    cases, campaignCopy, flowCorrect, roleplays, sliders, practiceFor
  } = window.TRAINING_DATA;

  // ============================================================
  //  Helpers — escape, debounce, shuffle
  // ============================================================
  function esc(str){
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function debounce(fn, ms){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function shuffle(arr){
    const a = [...arr];
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ============================================================
  //  State + persistence
  // ============================================================
  let state = {
    xp: 0,
    awards: {},
    checks: {},
    profile: {},
    sliders: {},
    quizIndex: 0,
    quizScore: 0,
    quizAnswered: false,
    memory: {moves:0, matches:0, first:null, second:null, lock:false},
    flow: null,
    flowSolved: false
  };

  function load(){
    try {
      const raw = localStorage.getItem(LS_KEY);
      if(raw) state = Object.assign(state, JSON.parse(raw));
    } catch(e){ console.warn("Load failed:", e); }
  }

  function save(){
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch(e){ console.warn("Save failed:", e); }
  }

  const saveDebounced = debounce(save, 250);

  // ============================================================
  //  Toast + Modal (with focus trap + Esc to close)
  // ============================================================
  function toast(msg){
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 1600);
  }

  let lastFocusedBeforeModal = null;
  function showModal(title, body){
    lastFocusedBeforeModal = document.activeElement;
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").textContent = body;
    const modal = document.getElementById("modal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => document.getElementById("closeModal").focus());
  }

  function closeModal(){
    const modal = document.getElementById("modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if(lastFocusedBeforeModal && lastFocusedBeforeModal.focus){
      lastFocusedBeforeModal.focus();
    }
  }

  // ============================================================
  //  XP, levels, awards
  // ============================================================
  function award(id, points, label){
    if(state.awards[id]) return;
    state.awards[id] = {points, label, at: new Date().toISOString()};
    state.xp += points;
    save();
    updateStats();
    toast("+" + points + " XP · " + label);
  }

  function levelName(xp){
    if(xp >= 900) return "Floor Ready";
    if(xp >= 700) return "Closer";
    if(xp >= 500) return "Campaign Builder";
    if(xp >= 320) return "Consultative AM";
    if(xp >= 180) return "Researcher";
    if(xp >= 80) return "Navigator";
    return "Rookie";
  }

  function checklistPct(){
    const total = document.querySelectorAll("[data-check]").length || 1;
    const done = Object.values(state.checks).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }

  function sliderScore(){
    const vals = sliders.map(s => Number(state.sliders[s[0]] || 0));
    if(vals.every(v => v === 0)) return 0;
    return Math.round(vals.reduce((a,b) => a+b, 0) / vals.length);
  }

  function progressPct(){
    const xpPct = Math.min(100, Math.round(state.xp / 9.5));
    const checkPct = checklistPct();
    const scorePct = sliderScore();
    return Math.round((xpPct * 0.50) + (checkPct * 0.20) + (scorePct * 0.30));
  }

  function updateStats(){
    document.getElementById("xpStat").textContent = state.xp;
    document.getElementById("levelStat").textContent = levelName(state.xp);
    const pct = progressPct();
    document.getElementById("readyStat").textContent = pct + "%";
    document.getElementById("progressText").textContent = pct + "%";
    document.getElementById("progressBar").style.width = pct + "%";
    document.getElementById("progressBar").setAttribute("aria-valuenow", pct);
    renderBadges();
    updateReadiness();
  }

  function renderBadges(){
    const wall = document.getElementById("badgeWall");
    wall.innerHTML = badges.map(b => {
      const unlocked = state.xp >= b.min;
      return `<span class="badge ${unlocked ? "unlocked" : ""}" role="listitem" aria-label="${esc(b.label)}${unlocked ? " desbloqueado" : ", requiere " + b.min + " XP"}">
        <span aria-hidden="true">${esc(b.icon)}</span><span>${esc(b.label)}</span><small>${b.min} XP</small>
      </span>`;
    }).join("");
  }

  // ============================================================
  //  Profile
  // ============================================================
  function initProfile(){
    const fields = ["amName","cohort","personalGoal"];
    fields.forEach(id => {
      const el = document.getElementById(id);
      el.value = state.profile[id] || "";
      el.addEventListener("input", () => {
        state.profile[id] = el.value;
        saveDebounced();
      });
    });
    document.getElementById("saveProfile").addEventListener("click", () => {
      fields.forEach(id => state.profile[id] = document.getElementById(id).value);
      save();
      award("profile", 20, "Perfil guardado");
    });
  }

  // ============================================================
  //  Concept flashcards
  // ============================================================
  function renderConceptDeck(){
    const deck = document.getElementById("conceptDeck");
    deck.innerHTML = conceptCards.map((c, i) => `
      <div class="flip-card" tabindex="0" role="button" aria-pressed="false" data-card="${i}" aria-label="Flashcard: ${esc(c.front)}. Activá para voltear.">
        <div class="flip-inner">
          <div class="flip-front">
            <span class="corner">Tap para voltear</span>
            <strong>${esc(c.front)}</strong>
            <span class="mini">${esc(c.sub)}</span>
          </div>
          <div class="flip-back">
            <span class="corner">Aplicación</span>
            <p>${esc(c.back)}</p>
          </div>
        </div>
      </div>
    `).join("");

    deck.querySelectorAll(".flip-card").forEach(card => {
      const flip = () => {
        card.classList.toggle("flipped");
        card.setAttribute("aria-pressed", card.classList.contains("flipped"));
        award("concept-" + card.dataset.card, 6, "Flashcard revisada");
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", e => {
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();
          flip();
        }
      });
    });

    document.getElementById("flipAllBtn").addEventListener("click", () => {
      document.querySelectorAll("#conceptDeck .flip-card").forEach(c => {
        c.classList.add("flipped");
        c.setAttribute("aria-pressed", "true");
      });
      award("concept-all", 24, "Deck completo");
    });
  }

  // ============================================================
  //  Memory game
  // ============================================================
  function startMemory(){
    state.memory = {moves:0, matches:0, first:null, second:null, lock:false};
    const cards = [];
    memoryPairs.forEach((p, idx) => {
      cards.push({pair:idx, text:p[0], type:"tool"});
      cards.push({pair:idx, text:p[1], type:"use"});
    });
    const board = document.getElementById("memoryBoard");
    board.innerHTML = shuffle(cards).map((c, i) => `
      <button class="mem-card" data-index="${i}" data-pair="${c.pair}" data-type="${c.type}" data-text="${esc(c.text)}" aria-label="Carta oculta ${i+1}. Activá para revelar.">
        ?
      </button>
    `).join("");
    document.getElementById("memoryMoves").textContent = "0";
    document.getElementById("memoryMatches").textContent = "0";
    board.querySelectorAll(".mem-card").forEach(btn => btn.addEventListener("click", onMemoryClick));
    save();
  }

  function onMemoryClick(e){
    const card = e.currentTarget;
    if(state.memory.lock || card.classList.contains("matched") || card.classList.contains("revealed")) return;
    card.classList.add("revealed");
    card.textContent = card.dataset.text;
    card.setAttribute("aria-label", "Carta revelada: " + card.dataset.text);

    if(state.memory.first === null){
      state.memory.first = card.dataset.index;
      return;
    }
    state.memory.second = card.dataset.index;
    state.memory.moves++;
    document.getElementById("memoryMoves").textContent = state.memory.moves;

    const first = document.querySelector(`.mem-card[data-index="${state.memory.first}"]`);
    const second = card;

    if(first.dataset.pair === second.dataset.pair && first.dataset.type !== second.dataset.type){
      first.classList.add("matched");
      second.classList.add("matched");
      state.memory.matches++;
      document.getElementById("memoryMatches").textContent = state.memory.matches;
      award("memory-pair-" + first.dataset.pair, 10, "Match de recursos");
      state.memory.first = null;
      state.memory.second = null;
      if(state.memory.matches === memoryPairs.length){
        award("memory-complete", 60, "Memoria completada");
        showModal("Memoria completada", "Terminaste el mapa de herramientas. Buen indicador: ya no estás pensando solo en features, sino en dónde encontrar evidencia.");
      }
    } else {
      state.memory.lock = true;
      setTimeout(() => {
        first.classList.remove("revealed");
        second.classList.remove("revealed");
        first.textContent = "?";
        second.textContent = "?";
        first.setAttribute("aria-label", "Carta oculta. Activá para revelar.");
        second.setAttribute("aria-label", "Carta oculta. Activá para revelar.");
        state.memory.first = null;
        state.memory.second = null;
        state.memory.lock = false;
      }, 850);
    }
    save();
  }

  // ============================================================
  //  Sprint Quiz
  // ============================================================
  function renderQuiz(){
    const q = quizQuestions[state.quizIndex];
    state.quizAnswered = false;
    document.getElementById("quizCounter").textContent = `Pregunta ${state.quizIndex + 1}/${quizQuestions.length}`;
    document.getElementById("quizScore").textContent = state.quizScore;
    document.getElementById("quizQuestion").textContent = q.q;
    const fb = document.getElementById("quizFeedback");
    fb.style.display = "none";
    fb.textContent = "";
    const answers = document.getElementById("quizAnswers");
    answers.innerHTML = q.answers.map((a, i) => `<button class="answer" data-answer="${i}">${esc(a)}</button>`).join("");
    answers.querySelectorAll(".answer").forEach(btn => {
      btn.addEventListener("click", () => answerQuiz(Number(btn.dataset.answer)));
    });
  }

  function answerQuiz(i){
    if(state.quizAnswered) return;
    state.quizAnswered = true;
    const q = quizQuestions[state.quizIndex];
    const buttons = document.querySelectorAll("#quizAnswers .answer");
    buttons.forEach((b, idx) => {
      if(idx === q.correct) b.classList.add("correct");
      if(idx === i && idx !== q.correct) b.classList.add("wrong");
      b.disabled = true;
    });
    const fb = document.getElementById("quizFeedback");
    fb.style.display = "block";
    if(i === q.correct){
      state.quizScore++;
      award("quiz-q-" + state.quizIndex, 14, "Sprint Quiz correcto");
      fb.innerHTML = `<strong>Correcto.</strong> ${esc(q.why)}`;
    } else {
      award("quiz-attempt-" + state.quizIndex, 3, "Intento de Sprint Quiz");
      fb.innerHTML = `<strong>No todavía.</strong> ${esc(q.why)}`;
    }
    document.getElementById("quizScore").textContent = state.quizScore;
    save();
  }

  function nextQuiz(){
    if(state.quizIndex < quizQuestions.length - 1){
      state.quizIndex++;
      renderQuiz();
    } else {
      award("quiz-complete", 70, "Sprint Quiz completado");
      showModal("Quiz completado", `Resultado: ${state.quizScore}/${quizQuestions.length}. Repetí las preguntas falladas como entrenamiento, no como castigo.`);
    }
    save();
  }

  function restartQuiz(){
    state.quizIndex = 0;
    state.quizScore = 0;
    save();
    renderQuiz();
  }

  // ============================================================
  //  Rejection Dojo
  // ============================================================
  function renderDojo(){
    const rows = document.getElementById("dojoRows");
    rows.innerHTML = dojoItems.map((item, idx) => `
      <div class="dojo-row">
        <div class="rejection"><span class="tag red">Mx says</span><br>${esc(item.rejection)}</div>
        <select data-dojo="${idx}" aria-label="Respuesta para objeción ${idx + 1}">
          <option value="">Elegí acción recomendada</option>
          ${item.options.map((o,i) => `<option value="${i}">${esc(o)}</option>`).join("")}
        </select>
        <span class="result-dot" id="dojoDot${idx}" aria-live="polite">?</span>
      </div>
    `).join("");
  }

  function checkDojo(){
    let correct = 0;
    dojoItems.forEach((item, idx) => {
      const val = document.querySelector(`[data-dojo="${idx}"]`).value;
      const dot = document.getElementById("dojoDot" + idx);
      dot.classList.remove("ok","bad");
      if(Number(val) === item.correct){
        correct++;
        dot.textContent = "✓";
        dot.classList.add("ok");
        award("dojo-" + idx, 14, "Objeción resuelta");
      } else {
        dot.textContent = "×";
        dot.classList.add("bad");
      }
    });
    const fb = document.getElementById("dojoFeedback");
    fb.style.display = "block";
    fb.innerHTML = `<strong>Resultado:</strong> ${correct}/${dojoItems.length}. ${correct === dojoItems.length ? "Excelente: estás respondiendo con diagnóstico, no con presión." : "Revisá las filas marcadas. La respuesta más fuerte casi siempre valida, pregunta y aterriza un next step."}`;
    if(correct === dojoItems.length) award("dojo-complete", 70, "Rejection Dojo completado");
  }

  // ============================================================
  //  Score Cards
  // ============================================================
  function renderCases(){
    const grid = document.getElementById("caseGrid");
    grid.innerHTML = cases.map((c, idx) => `
      <div class="scenario-card" tabindex="0" role="button" aria-pressed="false" data-case="${idx}" aria-label="Caso ${esc(c.name)}. Activá para ver recomendación.">
        <div class="scenario-inner">
          <div class="scenario-front">
            <span class="score-chip" aria-label="Score ${esc(c.score)}">${esc(c.score)}</span>
            <div class="restaurant">${esc(c.name)}</div>
            <div>${c.tags.map(t => `<span class="tag honey">${esc(t)}</span>`).join("")}</div>
            <div class="facts">
              ${c.facts.map(f => `<div class="fact"><span aria-hidden="true">•</span><span>${esc(f)}</span></div>`).join("")}
            </div>
            <small>Tap para ver recomendación</small>
          </div>
          <div class="scenario-back">
            <span class="tag teal">${esc(c.backTitle)}</span>
            <div class="facts">
              ${c.back.map(f => `<div class="fact"><span aria-hidden="true">→</span><span>${esc(f)}</span></div>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `).join("");

    grid.querySelectorAll(".scenario-card").forEach(card => {
      const flip = () => {
        card.classList.toggle("flipped");
        card.setAttribute("aria-pressed", card.classList.contains("flipped"));
        award("case-" + card.dataset.case, 12, "Score card revisada");
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", e => {
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();
          flip();
        }
      });
    });
  }

  // ============================================================
  //  Campaign Lab
  // ============================================================
  function buildCampaign(){
    const goal = document.getElementById("campaignGoal").value;
    const context = document.getElementById("campaignContext").value;
    const merchant = document.getElementById("campaignMerchant").value;
    const base = campaignCopy[goal];
    if(!base) return;

    let primary = base.primary;
    let guardrail = "Guardrail: confirmar presupuesto, ventana de revisión y métrica clara antes de activar.";

    if(context === "missingPhotos"){
      guardrail = "Guardrail: antes de gastar, resolvé fotos/descripciones de los items clave. Tráfico sin conversión no es estrategia.";
      if(goal !== "conversion") primary += " después de photos/menu cleanup";
    } else if(context === "dashpass"){
      guardrail = "Guardrail: si ya hay DashPass, evitá recomendar una promo que duplique un beneficio similar sin explicar valor incremental.";
    } else if(context === "busyDinner"){
      guardrail = "Guardrail: protegé dinner. Usá dayparting para no romper operación.";
      primary = "Dayparted campaign for slower hours";
    } else if(context === "budgetConcern"){
      guardrail = "Guardrail: arrancá con presupuesto controlado, prueba acotada y métrica clara.";
    } else if(context === "greatReviews"){
      guardrail = "Guardrail: buenas reviews hacen más defendible empujar visibilidad, pero igual validá capacidad.";
    } else if(context === "lowOps"){
      guardrail = "Guardrail: Operation Quality primero. No aumentes demanda sobre una experiencia rota.";
      primary = "Operational fix first, campaign second";
    }

    const box = document.getElementById("campaignRec");
    box.innerHTML = `
      <span class="tag red">${esc(merchant)}</span>
      <div class="rec-title">${esc(base.title)}: ${esc(primary)}</div>
      <ul class="rec-list">
        <li><span><b>Por qué:</b> ${esc(base.why)}</span></li>
        <li><span><b>Riesgo:</b> ${esc(base.risk)}</span></li>
        <li><span><b>Guardrail:</b> ${esc(guardrail)}</span></li>
        <li><span><b>Pregunta de discovery:</b> ${esc(base.question)}</span></li>
        <li><span><b>Next step sugerido:</b> confirmar objetivo, presupuesto/limitación, owner y fecha de revisión.</span></li>
      </ul>
    `;
    award("campaign-build", 40, "Campaign Lab usado");
  }

  // ============================================================
  //  Call Flow Builder — bug fixed
  // ============================================================
  function initFlow(){
    // Si no hay flow guardado, generar uno desordenado.
    // Si hay flow guardado, respetarlo (incluso si está resuelto).
    if(!state.flow || !Array.isArray(state.flow) || state.flow.length !== flowCorrect.length){
      state.flow = shuffleUntilDifferent();
      state.flowSolved = false;
    }
    renderFlow();
  }

  function shuffleUntilDifferent(){
    let attempt = shuffle(flowCorrect);
    let tries = 0;
    while(JSON.stringify(attempt) === JSON.stringify(flowCorrect) && tries < 10){
      attempt = shuffle(flowCorrect);
      tries++;
    }
    return attempt;
  }

  function renderFlow(){
    const list = document.getElementById("flowList");
    list.innerHTML = state.flow.map((step, idx) => `
      <div class="flow-step">
        <span class="flow-num" aria-hidden="true">${idx+1}</span>
        <strong>${esc(step)}</strong>
        <span class="flow-actions">
          <button class="icon-btn" data-up="${idx}" aria-label="Mover paso '${esc(step)}' hacia arriba">↑</button>
          <button class="icon-btn" data-down="${idx}" aria-label="Mover paso '${esc(step)}' hacia abajo">↓</button>
        </span>
      </div>
    `).join("");
    list.querySelectorAll("[data-up]").forEach(b => b.addEventListener("click", () => {
      const i = Number(b.dataset.up);
      if(i > 0){
        [state.flow[i-1], state.flow[i]] = [state.flow[i], state.flow[i-1]];
        save();
        renderFlow();
      }
    }));
    list.querySelectorAll("[data-down]").forEach(b => b.addEventListener("click", () => {
      const i = Number(b.dataset.down);
      if(i < state.flow.length - 1){
        [state.flow[i+1], state.flow[i]] = [state.flow[i], state.flow[i+1]];
        save();
        renderFlow();
      }
    }));
  }

  function reshuffleFlow(){
    state.flow = shuffleUntilDifferent();
    state.flowSolved = false;
    save();
    renderFlow();
    const fb = document.getElementById("flowFeedback");
    fb.style.display = "none";
    fb.textContent = "";
  }

  function checkFlow(){
    let correct = 0;
    state.flow.forEach((s, i) => { if(s === flowCorrect[i]) correct++; });
    const fb = document.getElementById("flowFeedback");
    fb.style.display = "block";
    fb.innerHTML = `<strong>${correct}/${flowCorrect.length} pasos en posición correcta.</strong> ${correct === flowCorrect.length ? "Excelente. La estructura protege la experiencia del merchant y la calidad de la llamada." : "Tip: no presentes producto antes de discovery; no cierres sin owner, timeline y nota."}`;
    award("flow-check", 20, "Call Flow revisado");
    if(correct === flowCorrect.length){
      award("flow-perfect", 80, "Call Flow perfecto");
      state.flowSolved = true;
      save();
    }
  }

  // ============================================================
  //  Roleplay
  // ============================================================
  function renderRoleplay(){
    const sel = document.getElementById("roleplaySelect");
    sel.innerHTML = roleplays.map((r, i) => `<option value="${i}">${esc(r.title)}</option>`).join("");
    sel.addEventListener("change", updateRoleplay);
    updateRoleplay();
  }

  function updateRoleplay(){
    const idx = Number(document.getElementById("roleplaySelect").value || 0);
    const r = roleplays[idx];
    document.getElementById("roleplayTopic").textContent = r.topic;
    document.getElementById("roleplayDifficulty").textContent = r.difficulty;
    document.getElementById("merchantLine").textContent = r.merchant;
    const opts = document.getElementById("responseOptions");
    opts.innerHTML = r.options.map((o, i) => `<button class="response-btn" data-r="${idx}" data-o="${i}">${esc(o.text)}</button>`).join("");
    const fb = document.getElementById("roleplayFeedback");
    fb.style.display = "none";
    fb.textContent = "";
    opts.querySelectorAll(".response-btn").forEach(btn => btn.addEventListener("click", () => {
      const opt = r.options[Number(btn.dataset.o)];
      opts.querySelectorAll(".response-btn").forEach(b => b.disabled = true);
      if(opt.best){
        btn.classList.add("best");
        award("roleplay-" + idx, 28, "Roleplay correcto");
      } else {
        btn.classList.add("miss");
        const bestIndex = r.options.findIndex(x => x.best);
        opts.querySelector(`[data-o="${bestIndex}"]`).classList.add("best");
        award("roleplay-attempt-" + idx, 5, "Roleplay intentado");
      }
      fb.style.display = "block";
      fb.innerHTML = `<strong>${opt.best ? "Buena elección." : "Revisá el enfoque."}</strong> ${esc(opt.why)}`;
    }));
  }

  // ============================================================
  //  Readiness sliders — debounced save
  // ============================================================
  function renderSliders(){
    const grid = document.getElementById("sliderGrid");
    grid.innerHTML = sliders.map(([id, label, desc]) => `
      <div class="slider-card">
        <div class="slider-head"><span>${esc(label)}</span><span id="val-${id}">${state.sliders[id] || 0}</span></div>
        <input type="range" min="0" max="100" step="5" value="${state.sliders[id] || 0}" data-slider="${id}" aria-label="${esc(label)}: ${esc(desc)}">
        <small>${esc(desc)}</small>
      </div>
    `).join("");

    let hasAwardedTouch = false;
    grid.querySelectorAll("[data-slider]").forEach(sl => {
      sl.addEventListener("input", () => {
        state.sliders[sl.dataset.slider] = Number(sl.value);
        document.getElementById("val-" + sl.dataset.slider).textContent = sl.value;
        saveDebounced();
        if(!hasAwardedTouch){
          award("scorecard-touch", 25, "Readiness scorecard usado");
          hasAwardedTouch = true;
        }
        updateStats();
      });
    });
    updateReadiness();
  }

  function updateReadiness(){
    const score = sliderScore();
    const scoreEl = document.getElementById("readinessScore");
    if(scoreEl) scoreEl.textContent = score;
    const text = document.getElementById("readinessText");
    const list = document.getElementById("priorityList");
    if(!text || !list) return;
    if(score === 0){
      text.textContent = "Mové los sliders para ver tu diagnóstico.";
      list.innerHTML = "";
      return;
    }
    if(score >= 85) text.textContent = "Listo para floor con monitoreo normal. Tu foco ahora es consistencia, no más teoría.";
    else if(score >= 70) text.textContent = "Casi listo. Necesitás práctica dirigida en los puntos más bajos antes de tomar volumen completo.";
    else if(score >= 50) text.textContent = "Nesting recomendado. Hay base, pero todavía existen riesgos visibles en llamadas reales.";
    else text.textContent = "No entrar a floor sin coaching intensivo. El riesgo no es solo ventas: es confianza del merchant y QA.";
    const ranked = sliders
      .map(([id, label, desc]) => ({id, label, desc, val: Number(state.sliders[id] || 0)}))
      .sort((a,b) => a.val - b.val)
      .slice(0, 3);
    list.innerHTML = ranked.map(r => `<li><b>${esc(r.label)}:</b> ${r.val}/100. Práctica sugerida: ${esc(practiceFor[r.id] || "práctica dirigida.")}</li>`).join("");
  }

  // ============================================================
  //  Checklist
  // ============================================================
  function initChecks(){
    document.querySelectorAll("[data-check]").forEach(ch => {
      ch.checked = !!state.checks[ch.dataset.check];
      ch.addEventListener("change", () => {
        state.checks[ch.dataset.check] = ch.checked;
        save();
        if(ch.checked) award("check-" + ch.dataset.check, 8, "Checklist completado");
        updateStats();
      });
    });
  }

  // ============================================================
  //  Report generation + modern clipboard
  // ============================================================
  function generateReport(){
    const ranked = sliders
      .map(([id, label]) => ({label, val: Number(state.sliders[id] || 0)}))
      .sort((a,b) => a.val - b.val);
    const low = ranked.slice(0, 3).map(x => `${x.label} (${x.val}/100)`).join(", ");
    const high = ranked.slice(-3).reverse().map(x => `${x.label} (${x.val}/100)`).join(", ");
    const checksDone = Object.values(state.checks).filter(Boolean).length;
    const totalChecks = document.querySelectorAll("[data-check]").length;
    const name = document.getElementById("amName").value || "AM";
    const cohort = document.getElementById("cohort").value || "N/A";
    const goal = document.getElementById("personalGoal").value || "N/A";
    const report = [
      `AM Floor-Ready Quest - Coaching Handoff`,
      `AM: ${name}`,
      `Cohort: ${cohort}`,
      `Meta personal: ${goal}`,
      ``,
      `XP: ${state.xp}`,
      `Nivel: ${levelName(state.xp)}`,
      `Readiness general: ${progressPct()}%`,
      `Scorecard autoevaluado: ${sliderScore()}%`,
      `Checklist: ${checksDone}/${totalChecks}`,
      ``,
      `Fortalezas más altas: ${high || "Sin datos"}`,
      `Prioridades de coaching: ${low || "Sin datos"}`,
      ``,
      `Fortaleza observada por el AM: ${document.getElementById("strengthNote").value || "Pendiente"}`,
      `Fricción / tema para coaching: ${document.getElementById("frictionNote").value || "Pendiente"}`,
      `Próxima acción: ${document.getElementById("nextActionNote").value || "Pendiente"}`,
      ``,
      `Lectura sugerida para TL: usar este resultado junto con QA, shadowing y desempeño real. El score no reemplaza observación de llamadas.`
    ].join("\n");
    document.getElementById("reportBox").value = report;
    award("report-generated", 30, "Reporte generado");
  }

  async function copyReport(){
    const box = document.getElementById("reportBox");
    if(!box.value){
      toast("Generá el reporte primero");
      return;
    }
    try {
      await navigator.clipboard.writeText(box.value);
      toast("Reporte copiado");
    } catch(e) {
      box.focus();
      box.select();
      box.setSelectionRange(0, 99999);
      try {
        const ok = document.execCommand && document.execCommand("copy");
        toast(ok ? "Reporte copiado" : "Copialo manualmente con Ctrl+C");
      } catch {
        toast("Copialo manualmente con Ctrl+C");
      }
    }
  }

  function resetSliders(){
    state.sliders = {};
    save();
    renderSliders();
    updateStats();
  }

  function resetAll(){
    if(!confirm("¿Resetear todo el progreso de este navegador?")) return;
    localStorage.removeItem(LS_KEY);
    location.reload();
  }

  // ============================================================
  //  Bindings
  // ============================================================
  function bind(){
    document.getElementById("newMemory").addEventListener("click", startMemory);
    document.getElementById("nextQuiz").addEventListener("click", nextQuiz);
    document.getElementById("restartQuiz").addEventListener("click", restartQuiz);
    document.getElementById("checkDojo").addEventListener("click", checkDojo);
    document.getElementById("shuffleCases").addEventListener("click", () => {
      cases.sort(() => Math.random() - 0.5);
      renderCases();
      award("cases-shuffled", 8, "Casos mezclados");
    });
    document.getElementById("buildCampaign").addEventListener("click", buildCampaign);
    document.getElementById("checkFlow").addEventListener("click", checkFlow);
    document.getElementById("reshuffleFlow").addEventListener("click", reshuffleFlow);
    document.getElementById("resetSliders").addEventListener("click", resetSliders);
    document.getElementById("generateReport").addEventListener("click", generateReport);
    document.getElementById("copyReport").addEventListener("click", copyReport);
    document.getElementById("resetAll").addEventListener("click", resetAll);
    document.getElementById("printBtn").addEventListener("click", () => window.print());
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("modal").addEventListener("click", e => {
      if(e.target.id === "modal") closeModal();
    });
    document.addEventListener("keydown", e => {
      if(e.key === "Escape"){
        const modal = document.getElementById("modal");
        if(modal.classList.contains("open")) closeModal();
      }
    });
  }

  // ============================================================
  //  Init
  // ============================================================
  function init(){
    load();
    initProfile();
    renderConceptDeck();
    startMemory();
    renderQuiz();
    renderDojo();
    renderCases();
    initFlow();
    renderRoleplay();
    renderSliders();
    initChecks();
    bind();
    updateStats();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
