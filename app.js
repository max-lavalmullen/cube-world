(function () {
  "use strict";

  const SCREEN_SIZE = 132;
  const SIMULATION_STEP = 0.05;
  const MAX_FURNITURE = 6;
  const GROUND_Y = 108;
  const LCD_STEP = 2;
  const LCD_FRAME_RATE = 6;
  const IDLE_SLEEP_SECONDS = 240;
  const AUTO_OFF_SECONDS = 300;
  const TUMBLE_SECONDS = 0.8;
  const MOTION_THRESHOLD = 18;
  const DEFAULT_RNG_SEED = 48612;
  const STORAGE_KEY = "cube.world.save";
  const STORAGE_VERSION = 1;
  const SAVE_INTERVAL_SECONDS = 4;

  const LCD_POSES = {
    idle: [
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 7, 2],
          [0, -2, -6, 3],
        ],
        legs: [
          [0, 8, 4, 18],
          [0, 8, -4, 18],
        ],
      },
      {
        head: { x: 0, y: -13 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 6, 3],
          [0, -2, -7, 2],
        ],
        legs: [
          [0, 8, 3, 18],
          [0, 8, -5, 18],
        ],
      },
    ],
    look: [
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 8, -4],
          [0, -2, -6, 3],
        ],
        legs: [
          [0, 8, 4, 18],
          [0, 8, -4, 18],
        ],
      },
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 7, -2],
          [0, -2, -7, 2],
        ],
        legs: [
          [0, 8, 4, 18],
          [0, 8, -4, 18],
        ],
      },
    ],
    walk: [
      {
        head: { x: 0, y: -13 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 9, 3],
          [0, -2, -6, 0],
        ],
        legs: [
          [0, 8, 7, 18],
          [0, 8, -3, 16],
        ],
      },
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 5, 0],
          [0, -2, -9, 3],
        ],
        legs: [
          [0, 8, 3, 16],
          [0, 8, -7, 18],
        ],
      },
    ],
    wave: [
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 10, -12],
          [0, -2, -8, 2],
        ],
        legs: [
          [0, 8, 4, 18],
          [0, 8, -4, 18],
        ],
      },
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 8, -9],
          [0, -2, -8, 2],
        ],
        legs: [
          [0, 8, 4, 18],
          [0, 8, -4, 18],
        ],
      },
    ],
    sit: [
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 7],
        arms: [
          [0, -2, 6, 3],
          [0, -2, -7, 2],
        ],
        legs: [
          [0, 8, 7, 12],
          [7, 12, 12, 12],
          [0, 8, -7, 12],
        ],
      },
    ],
    dance: [
      {
        head: { x: 0, y: -13 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 9, -11],
          [0, -2, -9, -6],
        ],
        legs: [
          [0, 8, 8, 18],
          [0, 8, -2, 18],
        ],
      },
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 7, -6],
          [0, -2, -9, -11],
        ],
        legs: [
          [0, 8, 3, 18],
          [0, 8, -8, 18],
        ],
      },
    ],
    sleep: [
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 6, 2],
          [0, -2, -7, 2],
        ],
        legs: [
          [0, 8, 8, 12],
          [0, 8, -8, 12],
        ],
      },
    ],
    tumble: [
      {
        head: { x: 0, y: -14 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 10, 0],
          [0, -2, -10, 1],
        ],
        legs: [
          [0, 8, 8, 18],
          [0, 8, -8, 18],
        ],
      },
      {
        head: { x: 0, y: -13 },
        torso: [0, -8, 0, 8],
        arms: [
          [0, -2, 8, 5],
          [0, -2, -9, -2],
        ],
        legs: [
          [0, 8, 10, 15],
          [0, 8, -6, 19],
        ],
      },
    ],
    hang: [
      {
        head: { x: 0, y: -10 },
        torso: [0, -4, 0, 10],
        arms: [
          [0, -4, 7, -16],
          [0, -4, -7, -16],
        ],
        legs: [
          [0, 10, 4, 18],
          [0, 10, -4, 18],
        ],
      },
      {
        head: { x: 0, y: -9 },
        torso: [0, -4, 0, 10],
        arms: [
          [0, -4, 6, -15],
          [0, -4, -6, -15],
        ],
        legs: [
          [0, 10, 5, 18],
          [0, 10, -5, 18],
        ],
      },
    ],
  };

  const FURNITURE_SLOTS = [
    { x: 24, y: 28 },
    { x: 66, y: 26 },
    { x: 106, y: 28 },
    { x: 28, y: 66 },
    { x: 68, y: 66 },
    { x: 106, y: 68 },
  ];

  const FURNITURE_TYPES = {
    chair: { label: "Chair", affordance: "rest", icon: "SEAT" },
    bed: { label: "Bed", affordance: "rest", icon: "REST" },
    toy: { label: "Toy", affordance: "play", icon: "PLAY" },
    plant: { label: "Plant", affordance: "inspect", icon: "LEAF" },
    console: { label: "Console", affordance: "play", icon: "GAME" },
    lamp: { label: "Lamp", affordance: "inspect", icon: "LAMP" },
  };

  const CHARACTER_THEMES = {
    stick: {
      prop: "stick",
      obstacle: "bar",
    },
    dog: {
      prop: "dog",
      obstacle: "dog",
    },
    rope: {
      prop: "rope",
      obstacle: "rope",
    },
    ball: {
      prop: "ball",
      obstacle: "ball",
    },
    music: {
      prop: "music",
      obstacle: "record",
    },
    weights: {
      prop: "weights",
      obstacle: "stick",
    },
    tool: {
      prop: "tool",
      obstacle: "gopher",
    },
    broom: {
      prop: "broom",
      obstacle: "buzz",
    },
  };

  const PERSONALITIES = {
    slim: {
      label: "Slim",
      series: "Series 1",
      description: "Interacts with a stick",
      theme: "stick",
      shellGlow: "#9e76dc",
      shellDeep: "#6338a7",
      gameName: "Pull Up",
      gameType: "pullup",
      restBias: 0.72,
      socialBias: 0.18,
      playBias: 0.24,
      curiosityBias: 0.44,
    },
    scoop: {
      label: "Scoop",
      series: "Series 1",
      description: "Dog lover",
      theme: "dog",
      shellGlow: "#f6a242",
      shellDeep: "#cf6423",
      gameName: "Keep Away",
      gameType: "keepaway",
      restBias: 0.34,
      socialBias: 0.9,
      playBias: 0.52,
      curiosityBias: 0.56,
    },
    dodger: {
      label: "Dodger",
      series: "Series 1",
      description: "Enjoys kicking the ball",
      theme: "ball",
      shellGlow: "#ef5a4d",
      shellDeep: "#b72a27",
      gameName: "Bounce",
      gameType: "bounce",
      restBias: 0.22,
      socialBias: 0.68,
      playBias: 0.95,
      curiosityBias: 0.72,
    },
    whip: {
      label: "Whip",
      series: "Series 1",
      description: "Enjoys rope tricks",
      shellGlow: "#f2d73d",
      shellDeep: "#c39712",
      gameName: "Jump Rope",
      gameType: "jumprope",
      restBias: 0.22,
      socialBias: 0.68,
      playBias: 0.95,
      curiosityBias: 0.72,
    },
    mic: {
      label: "Mic",
      series: "Series 2",
      description: "Loves music",
      theme: "music",
      shellGlow: "#e667cc",
      shellDeep: "#a33186",
      gameName: "Spin Off",
      gameType: "spinoff",
      restBias: 0.16,
      socialBias: 0.82,
      playBias: 0.9,
      curiosityBias: 0.54,
    },
    hans: {
      label: "Hans",
      series: "Series 2",
      description: "Enjoys working out",
      theme: "weights",
      shellGlow: "#7dc2ef",
      shellDeep: "#3578b5",
      gameName: "Kick-a-Stick",
      gameType: "kickastick",
      restBias: 0.48,
      socialBias: 0.4,
      playBias: 0.68,
      curiosityBias: 0.28,
    },
    handy: {
      label: "Handy",
      series: "Series 2",
      description: "Fixes everything",
      theme: "tool",
      shellGlow: "#5e89d8",
      shellDeep: "#244c96",
      gameName: "Go Go Gopher",
      gameType: "gogogopher",
      restBias: 0.28,
      socialBias: 0.52,
      playBias: 0.5,
      curiosityBias: 0.78,
    },
    dusty: {
      label: "Dusty",
      series: "Series 2",
      description: "Keeps things clean",
      theme: "broom",
      shellGlow: "#9ad773",
      shellDeep: "#5d9a36",
      gameName: "Buzz Off",
      gameType: "buzzoff",
      restBias: 0.2,
      socialBias: 0.58,
      playBias: 0.28,
      curiosityBias: 0.96,
    },
  };

  const CAST_BEHAVIORS = {
    slim: {
      favoriteFurniture: "lamp",
      partnerKeys: ["scoop", "hans"],
      role: "watchful",
    },
    scoop: {
      favoriteFurniture: "plant",
      partnerKeys: ["slim", "dodger"],
      role: "friendly",
    },
    dodger: {
      favoriteFurniture: "toy",
      partnerKeys: ["whip", "hans", "scoop"],
      role: "showoff",
    },
    whip: {
      favoriteFurniture: "console",
      partnerKeys: ["dodger", "mic", "slim"],
      role: "performer",
    },
    mic: {
      favoriteFurniture: "console",
      partnerKeys: ["whip", "dusty", "scoop"],
      role: "jammer",
    },
    hans: {
      favoriteFurniture: "chair",
      partnerKeys: ["slim", "dodger"],
      role: "coach",
    },
    handy: {
      favoriteFurniture: "lamp",
      partnerKeys: ["dusty", "mic"],
      role: "helper",
    },
    dusty: {
      favoriteFurniture: "plant",
      partnerKeys: ["handy", "mic"],
      role: "caretaker",
    },
  };

  const INITIAL_WORLD = [
    { name: "Slim", personality: "slim", furniture: ["chair", "lamp"] },
    { name: "Scoop", personality: "scoop", furniture: ["bed", "plant"] },
    { name: "Dodger", personality: "dodger", furniture: ["chair", "toy"] },
    { name: "Whip", personality: "whip", furniture: ["chair", "console"] },
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function finiteNumber(value, fallback) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function createRng(seed) {
    let state = seed >>> 0;
    function next() {
      state += 0x6d2b79f5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    next.getState = function getState() {
      return state >>> 0;
    };
    next.setState = function setState(value) {
      state = (Number.isFinite(value) ? value : seed) >>> 0;
    };
    return next;
  }

  function pickFrom(list, rng) {
    return list[Math.floor(rng() * list.length)];
  }

  function distance(aX, aY, bX, bY) {
    const dx = bX - aX;
    const dy = bY - aY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function normalizeVector(dx, dy) {
    const length = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);
    return {
      x: dx / length,
      y: dy / length,
      length: length,
    };
  }

  function offsetToward(source, target, radius) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);
    return {
      x: target.x - (dx / length) * radius,
      y: target.y - (dy / length) * radius,
    };
  }

  function shortGameLabel(gameName) {
    return gameName.replace(/\s+/g, " ");
  }

  function snapLcd(value, step) {
    const grid = step || LCD_STEP;
    return Math.round(value / grid) * grid;
  }

  function createGameState(profile) {
    return {
      state: "idle",
      themeKey: profile.theme,
      gameName: profile.gameName,
      gameType: profile.gameType,
      score: 0,
      highScore: 0,
      displayTimer: 0,
      playerY: 0,
      playerVelocity: 0,
      obstacleX: SCREEN_SIZE + 16,
      obstacleY: 0,
      obstacleVariant: 0,
      playerX: 42,
      markerX: 26,
      markerDir: 1,
      targetX: 66,
      targetWidth: 18,
      targetLane: 0,
      misses: 0,
      cooldown: 0,
      armed: true,
      flashTimer: 0,
      blink: 0,
    };
  }

  class CubeWorldApp {
    constructor() {
      this.rng = createRng(DEFAULT_RNG_SEED);
      this.cubes = [];
      this.agents = [];
      this.selectedCubeId = null;
      this.cardRefs = new Map();
      this.columns = 2;
      this.idCounters = {
        cube: 0,
        agent: 0,
        furniture: 0,
      };
      this.worldTime = 0;
      this.lastFrame = performance.now();
      this.accumulator = 0;
      this.activePicker = null;
      this.audioContext = null;
      this.storage = this.resolveStorage();
      this.persistenceReady = false;
      this.persistDirty = false;
      this.persistTimer = 0;
      this.dom = {
        worldStage: document.getElementById("world-stage"),
        addCubeTrigger: document.getElementById("add-cube-trigger"),
        addFurnitureTrigger: document.getElementById("add-furniture-trigger"),
        resetWorldTrigger: document.getElementById("reset-world-trigger"),
        cubePicker: document.getElementById("cube-picker"),
        furniturePicker: document.getElementById("furniture-picker"),
        cubeOptionGrid: document.getElementById("cube-option-grid"),
        furnitureOptionGrid: document.getElementById("furniture-option-grid"),
      };
    }

    start() {
      this.renderPickerOptions();
      this.bindEvents();
      if (!this.restoreSavedWorld()) {
        this.seedWorld();
      }
      this.persistenceReady = true;
      this.renderWorldShell();
      this.render();
      if (!this.storage || !this.cubes.length) {
        this.persistDirty = false;
      } else {
        this.saveWorld(true);
      }
      window.requestAnimationFrame(this.frame.bind(this));
    }

    resolveStorage() {
      try {
        const storage = window.localStorage;
        const probeKey = STORAGE_KEY + ".probe";
        storage.setItem(probeKey, "1");
        storage.removeItem(probeKey);
        return storage;
      } catch (error) {
        return null;
      }
    }

    renderPickerOptions() {
      this.dom.cubeOptionGrid.innerHTML = Object.entries(PERSONALITIES)
        .map(([key, personality]) => {
          return [
            '<button class="option-card" type="button" data-personality="' + key + '">',
            '<div class="swatch" style="--shell-glow:' + personality.shellGlow + ";--shell-deep:" + personality.shellDeep + '">■</div>',
            "<strong>" + personality.label + "</strong>",
            "<span>" + personality.series + "</span>",
            "<span>" + shortGameLabel(personality.gameName) + "</span>",
            "</button>",
          ].join("");
        })
        .join("");

      this.dom.furnitureOptionGrid.innerHTML = Object.entries(FURNITURE_TYPES)
        .map(([key, furniture]) => {
          return [
            '<button class="option-card" type="button" data-furniture="' + key + '">',
            '<div class="furniture-icon">' + furniture.icon + "</div>",
            "<strong>" + furniture.label + "</strong>",
            "<span>" + furniture.affordance + "</span>",
            "</button>",
          ].join("");
        })
        .join("");
    }

    bindEvents() {
      this.dom.addCubeTrigger.addEventListener("click", (event) => {
        event.stopPropagation();
        this.togglePicker("cube");
      });

      this.dom.addFurnitureTrigger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!this.selectedCubeId) {
          return;
        }
        this.togglePicker("furniture");
      });

      if (this.dom.resetWorldTrigger) {
        this.dom.resetWorldTrigger.addEventListener("click", (event) => {
          event.stopPropagation();
          this.resetWorld();
        });
      }

      this.dom.cubeOptionGrid.addEventListener("click", (event) => {
        const button = event.target.closest("[data-personality]");
        if (!button) {
          return;
        }
        this.addCube({
          name: this.nextCharacterName(button.dataset.personality),
          personalityKey: button.dataset.personality,
          starterFurniture: ["chair"],
        });
        this.hidePickers();
      });

      this.dom.furnitureOptionGrid.addEventListener("click", (event) => {
        const button = event.target.closest("[data-furniture]");
        if (!button || !this.selectedCubeId) {
          return;
        }
        this.addFurniture(this.selectedCubeId, button.dataset.furniture);
        this.hidePickers();
      });

      document.addEventListener("click", (event) => {
        if (
          event.target.closest(".picker-panel") ||
          event.target.closest(".dock-button") ||
          event.target.closest(".cube-shell")
        ) {
          return;
        }
        this.hidePickers();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          this.hidePickers();
        } else if (event.shiftKey && event.key.toLowerCase() === "r") {
          event.preventDefault();
          this.resetWorld();
        }
      });

      window.addEventListener("pagehide", () => {
        this.saveWorld(true);
      });

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.saveWorld(true);
        }
      });
    }

    togglePicker(name) {
      this.activePicker = this.activePicker === name ? null : name;
      this.syncPickers();
    }

    hidePickers() {
      this.activePicker = null;
      this.syncPickers();
    }

    syncPickers() {
      const cubeOpen = this.activePicker === "cube";
      const furnitureOpen = this.activePicker === "furniture";
      this.dom.cubePicker.classList.toggle("hidden", !cubeOpen);
      this.dom.furniturePicker.classList.toggle("hidden", !furnitureOpen);
      this.dom.cubePicker.setAttribute("aria-hidden", cubeOpen ? "false" : "true");
      this.dom.furniturePicker.setAttribute("aria-hidden", furnitureOpen ? "false" : "true");
      this.dom.addFurnitureTrigger.disabled = !this.selectedCubeId;
    }

    seedWorld() {
      INITIAL_WORLD.forEach((entry) => {
        this.addCube({
          name: entry.name,
          personalityKey: entry.personality,
          starterFurniture: entry.furniture,
          skipRender: true,
        });
      });
      this.selectedCubeId = this.cubes[0] ? this.cubes[0].id : null;
    }

    restoreSavedWorld() {
      if (!this.storage) {
        return false;
      }

      try {
        const raw = this.storage.getItem(STORAGE_KEY);
        if (!raw) {
          return false;
        }
        const snapshot = JSON.parse(raw);
        if (!this.restoreSnapshot(snapshot)) {
          this.storage.removeItem(STORAGE_KEY);
          return false;
        }
        return true;
      } catch (error) {
        try {
          this.storage.removeItem(STORAGE_KEY);
        } catch (removeError) {
          // Ignore broken storage cleanup.
        }
        return false;
      }
    }

    nextCharacterName(personalityKey) {
      const personality = PERSONALITIES[personalityKey];
      const count = this.cubes.filter((cube) => cube.personalityKey === personalityKey).length + 1;
      return count === 1 ? personality.label : personality.label + " " + count;
    }

    makeId(prefix) {
      this.idCounters[prefix] += 1;
      return prefix + "-" + this.idCounters[prefix];
    }

    buildSnapshotId(rawId, prefix, seenIds, counters) {
      const pattern = new RegExp("^" + prefix + "-(\\d+)$");
      if (typeof rawId === "string" && pattern.test(rawId) && !seenIds[prefix].has(rawId)) {
        const numericPart = Number(rawId.match(pattern)[1]);
        counters[prefix] = Math.max(counters[prefix], numericPart);
        seenIds[prefix].add(rawId);
        return rawId;
      }

      let nextId = null;
      do {
        counters[prefix] += 1;
        nextId = prefix + "-" + counters[prefix];
      } while (seenIds[prefix].has(nextId));
      seenIds[prefix].add(nextId);
      return nextId;
    }

    normalizeGameState(savedGame, personality) {
      const game = createGameState(personality);
      if (!savedGame || typeof savedGame !== "object") {
        return game;
      }

      const states = ["idle", "boot", "ready", "highscore", "active", "gameover"];
      if (states.includes(savedGame.state)) {
        game.state = savedGame.state;
      }

      game.score = Math.max(0, Math.round(finiteNumber(savedGame.score, 0)));
      game.highScore = Math.max(game.score, Math.round(finiteNumber(savedGame.highScore, 0)));
      game.displayTimer = clamp(finiteNumber(savedGame.displayTimer, 0), 0, 6);
      game.playerY = clamp(finiteNumber(savedGame.playerY, 0), -42, 22);
      game.playerVelocity = clamp(finiteNumber(savedGame.playerVelocity, 0), -220, 220);
      game.obstacleX = clamp(finiteNumber(savedGame.obstacleX, SCREEN_SIZE + 16), -32, SCREEN_SIZE + 42);
      game.obstacleY = clamp(finiteNumber(savedGame.obstacleY, 0), -12, GROUND_Y);
      game.obstacleVariant = clamp(Math.round(finiteNumber(savedGame.obstacleVariant, 0)), 0, 4);
      game.playerX = clamp(finiteNumber(savedGame.playerX, 42), 12, 120);
      game.markerX = clamp(finiteNumber(savedGame.markerX, 26), 12, 120);
      game.markerDir = Number(savedGame.markerDir) < 0 ? -1 : 1;
      game.targetX = clamp(finiteNumber(savedGame.targetX, 66), 20, 112);
      game.targetWidth = clamp(finiteNumber(savedGame.targetWidth, 18), 8, 28);
      game.targetLane = Number(savedGame.targetLane) === 1 ? 1 : 0;
      game.misses = Math.max(0, Math.round(finiteNumber(savedGame.misses, 0)));
      game.cooldown = clamp(finiteNumber(savedGame.cooldown, 0), 0, 4);
      game.armed = savedGame.armed !== false;
      game.flashTimer = clamp(finiteNumber(savedGame.flashTimer, 0), 0, 2);
      game.blink = clamp(finiteNumber(savedGame.blink, 0), 0, 1);
      return game;
    }

    normalizeSequence(sequence, cubeIds) {
      if (!Array.isArray(sequence)) {
        return [];
      }

      const poses = Object.keys(LCD_POSES);
      const effects = [null, "rest", "play", "social", "inspect", "wander", "help", "protect"];
      const sides = ["left", "right", "top", "bottom"];

      return sequence
        .slice(0, 16)
        .map((step) => {
          if (!step || typeof step !== "object") {
            return null;
          }

          if (step.type === "move") {
            return {
              type: "move",
              x: clamp(finiteNumber(step.x, 66), 8, 124),
              y: clamp(finiteNumber(step.y, 72), 8, 124),
              label: typeof step.label === "string" ? step.label : "walking",
              speed: step.speed == null ? undefined : clamp(finiteNumber(step.speed, 34), 16, 120),
              started: Boolean(step.started),
            };
          }

          if (step.type === "switchCube" && cubeIds.has(step.cubeId)) {
            return {
              type: "switchCube",
              cubeId: step.cubeId,
              x: clamp(finiteNumber(step.x, 66), 8, 124),
              y: clamp(finiteNumber(step.y, 72), 8, 124),
              label: typeof step.label === "string" ? step.label : "crossing over",
              started: Boolean(step.started),
              pulses: Array.isArray(step.pulses)
                ? step.pulses
                    .filter((pulse) => {
                      return pulse && cubeIds.has(pulse.cubeId) && sides.includes(pulse.side);
                    })
                    .map((pulse) => {
                      return {
                        cubeId: pulse.cubeId,
                        side: pulse.side,
                        amount: clamp(finiteNumber(pulse.amount, 0), 0, 1),
                      };
                    })
                : undefined,
            };
          }

          if (step.type === "wait") {
            return {
              type: "wait",
              remaining: clamp(finiteNumber(step.remaining, 0.6), 0, 8),
              pose: poses.includes(step.pose) ? step.pose : "idle",
              effect: effects.includes(step.effect) ? step.effect : null,
              label: typeof step.label === "string" ? step.label : "waiting",
              started: Boolean(step.started),
              pulses: Array.isArray(step.pulses)
                ? step.pulses
                    .filter((pulse) => {
                      return pulse && cubeIds.has(pulse.cubeId) && sides.includes(pulse.side);
                    })
                    .map((pulse) => {
                      return {
                        cubeId: pulse.cubeId,
                        side: pulse.side,
                        amount: clamp(finiteNumber(pulse.amount, 0), 0, 1),
                      };
                    })
                : undefined,
            };
          }

          return null;
        })
        .filter(Boolean);
    }

    restoreSnapshot(snapshot) {
      if (
        !snapshot ||
        snapshot.version !== STORAGE_VERSION ||
        !Array.isArray(snapshot.cubes) ||
        !Array.isArray(snapshot.agents)
      ) {
        return false;
      }

      const counters = { cube: 0, agent: 0, furniture: 0 };
      const seenIds = {
        cube: new Set(),
        agent: new Set(),
        furniture: new Set(),
      };
      const cubes = snapshot.cubes
        .map((savedCube, index) => {
          if (!savedCube || !PERSONALITIES[savedCube.personalityKey]) {
            return null;
          }

          const personalityKey = savedCube.personalityKey;
          const personality = PERSONALITIES[personalityKey];
          const cubeId = this.buildSnapshotId(savedCube.id, "cube", seenIds, counters);
          const cube = {
            id: cubeId,
            name: typeof savedCube.name === "string" && savedCube.name.trim() ? savedCube.name : personality.label,
            personalityKey: personalityKey,
            shellGlow: personality.shellGlow,
            shellDeep: personality.shellDeep,
            furniture: [],
            gridX: 0,
            gridY: 0,
            powerOn: savedCube.powerOn !== false,
            sleepingAnimation: Boolean(savedCube.sleepingAnimation),
            idleSeconds: clamp(finiteNumber(savedCube.idleSeconds, 0), 0, AUTO_OFF_SECONDS + 60),
            blindAmount: clamp(finiteNumber(savedCube.blindAmount, 0), 0, 1),
            edgePulse: {
              left: clamp(finiteNumber((savedCube.edgePulse || {}).left, 0), 0, 1),
              right: clamp(finiteNumber((savedCube.edgePulse || {}).right, 0), 0, 1),
              top: clamp(finiteNumber((savedCube.edgePulse || {}).top, 0), 0, 1),
              bottom: clamp(finiteNumber((savedCube.edgePulse || {}).bottom, 0), 0, 1),
            },
            soundOn: Boolean(savedCube.soundOn),
            pulseTimer: clamp(finiteNumber(savedCube.pulseTimer, 0), 0, 1),
            motion: {
              nudgeX: clamp(finiteNumber((savedCube.motion || {}).nudgeX, 0), -12, 12),
              nudgeY: clamp(finiteNumber((savedCube.motion || {}).nudgeY, 0), -12, 12),
              tiltX: clamp(finiteNumber((savedCube.motion || {}).tiltX, 0), -7, 7),
              tiltY: clamp(finiteNumber((savedCube.motion || {}).tiltY, 0), -7, 7),
              dirX: clamp(finiteNumber((savedCube.motion || {}).dirX, 0), -1, 1),
              dirY: clamp(finiteNumber((savedCube.motion || {}).dirY, 0), -1, 1),
              tumbleTimer: clamp(finiteNumber((savedCube.motion || {}).tumbleTimer, 0), 0, TUMBLE_SECONDS),
            },
            game: this.normalizeGameState(savedCube.game, personality),
          };

          cube.furniture = Array.isArray(savedCube.furniture)
            ? savedCube.furniture
                .slice(0, MAX_FURNITURE)
                .map((item, furnitureIndex) => {
                  if (!item || !FURNITURE_TYPES[item.type]) {
                    return null;
                  }
                  const slot = FURNITURE_SLOTS[furnitureIndex];
                  return {
                    id: this.buildSnapshotId(item.id, "furniture", seenIds, counters),
                    type: item.type,
                    x: clamp(finiteNumber(item.x, slot.x), 14, 118),
                    y: clamp(finiteNumber(item.y, slot.y), 18, 112),
                  };
                })
                .filter(Boolean)
            : [];

          return cube;
        })
        .filter(Boolean);

      if (!cubes.length) {
        return false;
      }

      const cubeIds = new Set(cubes.map((cube) => cube.id));
      const agents = snapshot.agents
        .map((savedAgent) => {
          if (
            !savedAgent ||
            !PERSONALITIES[savedAgent.personalityKey] ||
            !cubeIds.has(savedAgent.homeCubeId)
          ) {
            return null;
          }

          const currentCubeId = cubeIds.has(savedAgent.currentCubeId)
            ? savedAgent.currentCubeId
            : savedAgent.homeCubeId;
          return {
            id: this.buildSnapshotId(savedAgent.id, "agent", seenIds, counters),
            name:
              typeof savedAgent.name === "string" && savedAgent.name.trim()
                ? savedAgent.name
                : this.getCubeName(cubes, savedAgent.homeCubeId),
            personalityKey: savedAgent.personalityKey,
            homeCubeId: savedAgent.homeCubeId,
            currentCubeId: currentCubeId,
            x: clamp(finiteNumber(savedAgent.x, 66), 8, 124),
            y: clamp(finiteNumber(savedAgent.y, 88), 16, 116),
            facing: Number(savedAgent.facing) < 0 ? -1 : 1,
            stride: clamp(finiteNumber(savedAgent.stride, 0), 0, 999),
            bob: clamp(finiteNumber(savedAgent.bob, 0), 0, 999),
            tumbleAngle: clamp(finiteNumber(savedAgent.tumbleAngle, 0), -Math.PI * 2, Math.PI * 2),
            currentPose: LCD_POSES[savedAgent.currentPose] ? savedAgent.currentPose : "idle",
            currentActivity:
              typeof savedAgent.currentActivity === "string" ? savedAgent.currentActivity : "idling",
            sequence: this.normalizeSequence(savedAgent.sequence, cubeIds),
            needs: {
              rest: clamp(finiteNumber((savedAgent.needs || {}).rest, 0.2), 0, 1),
              social: clamp(finiteNumber((savedAgent.needs || {}).social, 0.2), 0, 1),
              play: clamp(finiteNumber((savedAgent.needs || {}).play, 0.2), 0, 1),
              explore: clamp(finiteNumber((savedAgent.needs || {}).explore, 0.2), 0, 1),
            },
          };
        })
        .filter(Boolean);

      this.cubes = cubes;
      this.agents = agents;
      this.columns = 2;
      this.idCounters = {
        cube: Math.max(counters.cube, Math.round(finiteNumber((snapshot.idCounters || {}).cube, 0))),
        agent: Math.max(counters.agent, Math.round(finiteNumber((snapshot.idCounters || {}).agent, 0))),
        furniture: Math.max(counters.furniture, Math.round(finiteNumber((snapshot.idCounters || {}).furniture, 0))),
      };
      this.relayout();

      this.cubes.forEach((cube) => {
        if (this.agents.some((agent) => agent.homeCubeId === cube.id)) {
          return;
        }

        const personality = PERSONALITIES[cube.personalityKey];
        this.agents.push({
          id: this.makeId("agent"),
          name: cube.name,
          personalityKey: cube.personalityKey,
          homeCubeId: cube.id,
          currentCubeId: cube.id,
          x: 66,
          y: 88,
          facing: 1,
          stride: 0,
          bob: 0,
          tumbleAngle: 0,
          currentPose: "idle",
          currentActivity: "idling",
          sequence: [],
          needs: {
            rest: clamp(0.2 + personality.restBias * 0.15, 0, 1),
            social: clamp(0.2 + personality.socialBias * 0.1, 0, 1),
            play: clamp(0.22 + personality.playBias * 0.1, 0, 1),
            explore: clamp(0.22 + personality.curiosityBias * 0.1, 0, 1),
          },
        });
      });

      this.selectedCubeId = cubeIds.has(snapshot.selectedCubeId) ? snapshot.selectedCubeId : this.cubes[0].id;
      this.worldTime = Math.max(0, finiteNumber(snapshot.worldTime, 0));
      this.persistTimer = 0;
      this.persistDirty = false;

      if (this.rng.setState) {
        this.rng.setState(Number(snapshot.rngState));
      }

      return true;
    }

    getCubeName(cubes, cubeId) {
      const cube = cubes.find((entry) => entry.id === cubeId);
      return cube ? cube.name : "Cube";
    }

    serializeCube(cube) {
      return {
        id: cube.id,
        name: cube.name,
        personalityKey: cube.personalityKey,
        furniture: cube.furniture.map((item) => {
          return {
            id: item.id,
            type: item.type,
            x: item.x,
            y: item.y,
          };
        }),
        powerOn: cube.powerOn,
        sleepingAnimation: cube.sleepingAnimation,
        idleSeconds: cube.idleSeconds,
        blindAmount: cube.blindAmount,
        edgePulse: {
          left: cube.edgePulse.left,
          right: cube.edgePulse.right,
          top: cube.edgePulse.top,
          bottom: cube.edgePulse.bottom,
        },
        soundOn: cube.soundOn,
        pulseTimer: cube.pulseTimer,
        motion: {
          nudgeX: cube.motion.nudgeX,
          nudgeY: cube.motion.nudgeY,
          tiltX: cube.motion.tiltX,
          tiltY: cube.motion.tiltY,
          dirX: cube.motion.dirX,
          dirY: cube.motion.dirY,
          tumbleTimer: cube.motion.tumbleTimer,
        },
        game: {
          state: cube.game.state,
          themeKey: cube.game.themeKey,
          gameName: cube.game.gameName,
          gameType: cube.game.gameType,
          score: cube.game.score,
          highScore: cube.game.highScore,
          displayTimer: cube.game.displayTimer,
          playerY: cube.game.playerY,
          playerVelocity: cube.game.playerVelocity,
          obstacleX: cube.game.obstacleX,
          obstacleY: cube.game.obstacleY,
          obstacleVariant: cube.game.obstacleVariant,
          playerX: cube.game.playerX,
          markerX: cube.game.markerX,
          markerDir: cube.game.markerDir,
          targetX: cube.game.targetX,
          targetWidth: cube.game.targetWidth,
          targetLane: cube.game.targetLane,
          misses: cube.game.misses,
          cooldown: cube.game.cooldown,
          armed: cube.game.armed,
          flashTimer: cube.game.flashTimer,
          blink: cube.game.blink,
        },
      };
    }

    serializeAgent(agent) {
      return {
        id: agent.id,
        name: agent.name,
        personalityKey: agent.personalityKey,
        homeCubeId: agent.homeCubeId,
        currentCubeId: agent.currentCubeId,
        x: agent.x,
        y: agent.y,
        facing: agent.facing,
        stride: agent.stride,
        bob: agent.bob,
        tumbleAngle: agent.tumbleAngle,
        currentPose: agent.currentPose,
        currentActivity: agent.currentActivity,
        sequence: agent.sequence.map((step) => {
          const savedStep = {
            type: step.type,
            label: step.label,
            started: Boolean(step.started),
          };
          if (step.type === "move") {
            savedStep.x = step.x;
            savedStep.y = step.y;
            savedStep.speed = step.speed;
          } else if (step.type === "switchCube") {
            savedStep.cubeId = step.cubeId;
            savedStep.x = step.x;
            savedStep.y = step.y;
          } else if (step.type === "wait") {
            savedStep.remaining = step.remaining;
            savedStep.pose = step.pose;
            savedStep.effect = step.effect;
          }
          if (Array.isArray(step.pulses) && step.pulses.length > 0) {
            savedStep.pulses = step.pulses.map((pulse) => {
              return {
                cubeId: pulse.cubeId,
                side: pulse.side,
                amount: pulse.amount,
              };
            });
          }
          return savedStep;
        }),
        needs: {
          rest: agent.needs.rest,
          social: agent.needs.social,
          play: agent.needs.play,
          explore: agent.needs.explore,
        },
      };
    }

    snapshotWorld() {
      return {
        version: STORAGE_VERSION,
        savedAt: Date.now(),
        worldTime: this.worldTime,
        selectedCubeId: this.selectedCubeId,
        idCounters: {
          cube: this.idCounters.cube,
          agent: this.idCounters.agent,
          furniture: this.idCounters.furniture,
        },
        rngState: this.rng.getState ? this.rng.getState() : null,
        cubes: this.cubes.map((cube) => this.serializeCube(cube)),
        agents: this.agents.map((agent) => this.serializeAgent(agent)),
      };
    }

    saveWorld(force) {
      if (!this.storage || !this.persistenceReady || (!force && !this.persistDirty)) {
        return;
      }

      try {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(this.snapshotWorld()));
        this.persistDirty = false;
        this.persistTimer = 0;
      } catch (error) {
        // Ignore storage write failures and keep the sim running.
      }
    }

    resetWorld() {
      if (!window.confirm("Reset this cube world back to the default lineup?")) {
        return;
      }

      this.cubes = [];
      this.agents = [];
      this.selectedCubeId = null;
      this.columns = 2;
      this.idCounters = {
        cube: 0,
        agent: 0,
        furniture: 0,
      };
      this.worldTime = 0;
      this.accumulator = 0;
      this.lastFrame = performance.now();
      this.persistTimer = 0;
      this.persistDirty = false;
      this.activePicker = null;
      if (this.rng.setState) {
        this.rng.setState(DEFAULT_RNG_SEED);
      }
      this.hidePickers();
      this.seedWorld();
      this.renderWorldShell();
      this.render();
      if (this.storage) {
        try {
          this.storage.removeItem(STORAGE_KEY);
        } catch (error) {
          // Ignore storage cleanup failures.
        }
      }
      this.persistDirty = true;
      this.saveWorld(true);
    }

    addCube(options) {
      const personalityKey = options.personalityKey || "slim";
      const personality = PERSONALITIES[personalityKey];
      const cube = {
        id: this.makeId("cube"),
        name: options.name,
        personalityKey: personalityKey,
        shellGlow: personality.shellGlow,
        shellDeep: personality.shellDeep,
        furniture: [],
        gridX: 0,
        gridY: 0,
        powerOn: true,
        sleepingAnimation: false,
        idleSeconds: 0,
        blindAmount: 0,
        edgePulse: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        soundOn: false,
        pulseTimer: 0,
        motion: {
          nudgeX: 0,
          nudgeY: 0,
          tiltX: 0,
          tiltY: 0,
          dirX: 0,
          dirY: 0,
          tumbleTimer: 0,
        },
        game: createGameState(personality),
      };

      const agent = {
        id: this.makeId("agent"),
        name: options.name,
        personalityKey: personalityKey,
        homeCubeId: cube.id,
        currentCubeId: cube.id,
        x: 66 + (this.rng() * 8 - 4),
        y: 88 + (this.rng() * 8 - 4),
        facing: this.rng() > 0.5 ? 1 : -1,
        stride: 0,
        bob: 0,
        tumbleAngle: 0,
        currentPose: "idle",
        currentActivity: "idling",
        sequence: [],
        needs: {
          rest: clamp(0.18 + this.rng() * 0.25 + personality.restBias * 0.15, 0, 1),
          social: clamp(0.18 + this.rng() * 0.2 + personality.socialBias * 0.1, 0, 1),
          play: clamp(0.2 + this.rng() * 0.22 + personality.playBias * 0.1, 0, 1),
          explore: clamp(0.2 + this.rng() * 0.22 + personality.curiosityBias * 0.1, 0, 1),
        },
      };

      this.cubes.push(cube);
      this.agents.push(agent);
      (options.starterFurniture || []).forEach((type) => this.addFurniture(cube.id, type, true));
      this.relayout();
      if (!this.selectedCubeId) {
        this.selectedCubeId = cube.id;
      }

      if (!options.skipRender) {
        this.renderWorldShell();
        this.render();
      }

      this.persistDirty = true;
      if (this.persistenceReady && !options.skipRender) {
        this.saveWorld(true);
      }
    }

    addFurniture(cubeId, type, skipRender) {
      const cube = this.getCube(cubeId);
      if (!cube || !FURNITURE_TYPES[type] || cube.furniture.length >= MAX_FURNITURE) {
        return;
      }

      const slot = FURNITURE_SLOTS[cube.furniture.length];
      cube.furniture.push({
        id: this.makeId("furniture"),
        type: type,
        x: slot.x,
        y: slot.y,
      });

      if (!skipRender) {
        this.renderWorldShell();
        this.render();
      }

      this.persistDirty = true;
      if (this.persistenceReady && !skipRender) {
        this.saveWorld(true);
      }
    }

    relayout() {
      const columns = Math.max(2, Math.ceil(Math.sqrt(this.cubes.length)));
      this.cubes.forEach((cube, index) => {
        cube.gridX = index % columns;
        cube.gridY = Math.floor(index / columns);
      });
      this.columns = columns;
    }

    getCube(cubeId) {
      return this.cubes.find((cube) => cube.id === cubeId) || null;
    }

    getResident(cubeId) {
      return this.agents.find((agent) => agent.homeCubeId === cubeId) || null;
    }

    getAgentsInCube(cubeId) {
      return this.agents.filter((agent) => agent.currentCubeId === cubeId);
    }

    getNeighbors(cubeId) {
      const cube = this.getCube(cubeId);
      if (!cube) {
        return [];
      }
      return this.cubes.filter((candidate) => {
        if (candidate.id === cube.id) {
          return false;
        }
        const dx = Math.abs(candidate.gridX - cube.gridX);
        const dy = Math.abs(candidate.gridY - cube.gridY);
        return dx + dy === 1;
      });
    }

    findNextHop(fromCubeId, toCubeId) {
      if (fromCubeId === toCubeId) {
        return this.getCube(toCubeId);
      }

      const visited = new Set([fromCubeId]);
      const queue = [{ id: fromCubeId, firstHop: null }];

      while (queue.length > 0) {
        const current = queue.shift();
        const neighbors = this.getNeighbors(current.id).filter((neighbor) => {
          return neighbor.powerOn && !neighbor.sleepingAnimation;
        });
        for (const neighbor of neighbors) {
          if (visited.has(neighbor.id)) {
            continue;
          }
          const firstHop = current.firstHop || neighbor;
          if (neighbor.id === toCubeId) {
            return firstHop;
          }
          visited.add(neighbor.id);
          queue.push({ id: neighbor.id, firstHop: firstHop });
        }
      }

      return null;
    }

    selectCube(cubeId) {
      this.selectedCubeId = cubeId;
      this.syncPickers();
      this.render();
    }

    wakeCube(cube) {
      cube.powerOn = true;
      cube.sleepingAnimation = false;
      cube.idleSeconds = 0;
      cube.game.state = "boot";
      cube.game.displayTimer = 0.7;
      cube.motion.tumbleTimer = 0;
      cube.motion.nudgeX = 0;
      cube.motion.nudgeY = 0;
      cube.motion.tiltX = 0;
      cube.motion.tiltY = 0;
      this.playTone(cube, 660, 0.05);
    }

    touchCube(cube) {
      if (!cube || !cube.powerOn) {
        return false;
      }
      cube.idleSeconds = 0;
      cube.sleepingAnimation = false;
      return true;
    }

    putCubeToSleep(cube) {
      cube.sleepingAnimation = true;
      cube.game.state = "idle";
      cube.game.displayTimer = 0;
      cube.motion.tumbleTimer = 0;
      this.getAgentsInCube(cube.id).forEach((agent) => {
        agent.sequence = [];
        agent.currentPose = "sleep";
        agent.currentActivity = "sleeping";
      });
    }

    jostleCube(cubeId, dx, dy) {
      const cube = this.getCube(cubeId);
      if (!cube) {
        return;
      }

      this.selectCube(cubeId);
      const direction = normalizeVector(dx, dy);
      cube.motion.dirX = direction.x;
      cube.motion.dirY = direction.y;
      cube.motion.tumbleTimer = TUMBLE_SECONDS;
      cube.motion.nudgeX = clamp(dx * 0.11, -10, 10);
      cube.motion.nudgeY = clamp(dy * 0.11, -10, 10);
      cube.motion.tiltX = clamp(direction.y * -6.5, -7, 7);
      cube.motion.tiltY = clamp(direction.x * 7, -7, 7);

      if (!cube.powerOn) {
        return;
      }

      cube.idleSeconds = 0;
      cube.sleepingAnimation = false;
      this.getAgentsInCube(cube.id).forEach((agent, index) => {
        const distanceFactor = 18 + index * 6;
        agent.sequence = [
          {
            type: "move",
            x: clamp(agent.x + direction.x * distanceFactor, 12, 120),
            y: clamp(agent.y + direction.y * distanceFactor, 18, 112),
            label: "tumbling",
            speed: 72,
          },
          {
            type: "wait",
            remaining: 0.35 + this.rng() * 0.2,
            pose: "tumble",
            effect: null,
            label: "tumbling",
          },
        ];
        agent.tumbleAngle = Math.atan2(direction.y, direction.x);
      });
      this.persistDirty = true;
      this.saveWorld(true);
    }

    setEdgePulse(cubeId, side, amount) {
      const cube = this.getCube(cubeId);
      if (!cube || !side) {
        return;
      }
      cube.edgePulse[side] = Math.max(cube.edgePulse[side], amount || 1);
    }

    directionToSide(directionX, directionY) {
      if (directionX > 0) {
        return "right";
      }
      if (directionX < 0) {
        return "left";
      }
      if (directionY > 0) {
        return "bottom";
      }
      return "top";
    }

    oppositeSide(side) {
      return {
        left: "right",
        right: "left",
        top: "bottom",
        bottom: "top",
      }[side];
    }

    frame(timestamp) {
      const delta = Math.min((timestamp - this.lastFrame) / 1000, 0.1);
      this.lastFrame = timestamp;
      this.accumulator += delta;

      while (this.accumulator >= SIMULATION_STEP) {
        this.simulate(SIMULATION_STEP);
        this.accumulator -= SIMULATION_STEP;
      }

      this.render();
      window.requestAnimationFrame(this.frame.bind(this));
    }

    simulate(dt) {
      this.worldTime += dt;
      this.cubes.forEach((cube) => this.advanceCube(cube, dt));
      this.agents.forEach((agent) => {
        const cube = this.getCube(agent.currentCubeId);
        if (!cube || !cube.powerOn || cube.sleepingAnimation || cube.game.state !== "idle") {
          return;
        }
        this.advanceNeeds(agent, dt);
        this.advanceAgent(agent, dt);
      });

      if (this.persistenceReady && this.storage && this.cubes.length > 0) {
        this.persistDirty = true;
        this.persistTimer += dt;
        if (this.persistTimer >= SAVE_INTERVAL_SECONDS) {
          this.saveWorld(false);
        }
      }
    }

    advanceCube(cube, dt) {
      cube.pulseTimer = Math.max(0, cube.pulseTimer - dt);
      cube.motion.tumbleTimer = Math.max(0, cube.motion.tumbleTimer - dt);
      cube.motion.nudgeX *= 0.88;
      cube.motion.nudgeY *= 0.88;
      cube.motion.tiltX *= 0.9;
      cube.motion.tiltY *= 0.9;
      Object.keys(cube.edgePulse).forEach((side) => {
        cube.edgePulse[side] = Math.max(0, cube.edgePulse[side] - dt * 2.4);
      });
      const game = cube.game;
      game.cooldown = Math.max(0, game.cooldown - dt);
      game.flashTimer = Math.max(0, game.flashTimer - dt);

      const occupants = this.getAgentsInCube(cube.id).length;
      const blindTarget = occupants > 0 ? 0 : 1;
      const blindDelta = blindTarget > cube.blindAmount ? dt * 2.8 : dt * 2.1;
      if (Math.abs(blindTarget - cube.blindAmount) < blindDelta) {
        cube.blindAmount = blindTarget;
      } else {
        cube.blindAmount += blindTarget > cube.blindAmount ? blindDelta : -blindDelta;
      }

      if (cube.powerOn) {
        cube.idleSeconds += dt;
        if (!cube.sleepingAnimation && cube.idleSeconds >= IDLE_SLEEP_SECONDS) {
          this.putCubeToSleep(cube);
        }

        if (cube.idleSeconds >= AUTO_OFF_SECONDS) {
          cube.powerOn = false;
          cube.sleepingAnimation = false;
          cube.game.state = "idle";
          return;
        }
      }

      if (game.state === "boot" || game.state === "highscore" || game.state === "gameover") {
        game.displayTimer -= dt;
        if (game.displayTimer <= 0) {
          game.state = "idle";
        }
        return;
      }

      if (game.state === "active") {
        this.updateMiniGame(cube, dt);
      }
    }

    prepareMiniGame(cube) {
      const game = cube.game;
      game.score = 0;
      game.playerY = 0;
      game.playerVelocity = 0;
      game.playerX = 42;
      game.obstacleX = SCREEN_SIZE + 16;
      game.obstacleY = 0;
      game.obstacleVariant = Math.floor(this.rng() * 3);
      game.markerX = 26;
      game.markerDir = this.rng() > 0.5 ? 1 : -1;
      game.targetX = 46 + this.rng() * 42;
      game.targetWidth = 18;
      game.targetLane = 0;
      game.misses = 0;
      game.cooldown = 0;
      game.armed = true;
      game.flashTimer = 0;

      if (game.gameType === "keepaway") {
        game.obstacleX = SCREEN_SIZE + 10;
        game.obstacleY = this.rng() > 0.5 ? 1 : 0;
      } else if (game.gameType === "bounce") {
        game.obstacleX = 82;
        game.obstacleY = 22;
      } else if (game.gameType === "jumprope") {
        game.obstacleX = SCREEN_SIZE + 20;
      } else if (game.gameType === "spinoff") {
        game.targetX = 50 + this.rng() * 34;
        game.targetWidth = 20;
      } else if (game.gameType === "kickastick") {
        game.obstacleX = SCREEN_SIZE + 20;
        game.obstacleY = GROUND_Y - 16;
      } else if (game.gameType === "gogogopher") {
        game.obstacleVariant = Math.floor(this.rng() * 3);
        game.cooldown = 0.55;
        game.armed = false;
      } else if (game.gameType === "buzzoff") {
        game.obstacleX = SCREEN_SIZE + 20;
        game.obstacleY = this.rng() > 0.5 ? 44 : 72;
      }
    }

    startMiniGame(cube) {
      this.prepareMiniGame(cube);
      cube.game.state = "active";
    }

    finishMiniGame(cube, kind) {
      const game = cube.game;
      game.highScore = Math.max(game.highScore, game.score);
      game.state = "gameover";
      game.displayTimer = 1.2;
      game.flashTimer = 0.55;
      this.playTone(cube, kind === "score" ? 880 : 180, kind === "score" ? 0.045 : 0.09, kind === "score" ? "square" : "sawtooth");
    }

    updateMiniGame(cube, dt) {
      const game = cube.game;

      if (game.gameType === "pullup") {
        game.playerVelocity += 170 * dt;
        game.playerY = clamp(game.playerY + game.playerVelocity * dt, -38, 18);
        if (game.playerY < -30 && game.armed) {
          game.score += 1;
          game.armed = false;
          this.playTone(cube, 880, 0.04);
        }
        if (game.playerY > -8) {
          game.armed = true;
        }
        if (game.playerY >= 14) {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "keepaway") {
        game.obstacleX -= 66 * dt;
        if (game.obstacleX < 32 && game.obstacleX > 16 && game.obstacleY === game.targetLane) {
          this.finishMiniGame(cube, "fail");
          return;
        }
        if (game.obstacleX <= -16) {
          game.score += 1;
          game.obstacleX = SCREEN_SIZE + 16 + this.rng() * 18;
          game.obstacleY = this.rng() > 0.5 ? 1 : 0;
          this.playTone(cube, 820, 0.04);
        }
        return;
      }

      if (game.gameType === "bounce") {
        game.playerVelocity += 186 * dt;
        game.obstacleY += game.playerVelocity * dt;
        if (game.obstacleY >= GROUND_Y - 8) {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "jumprope") {
        game.playerVelocity += 190 * dt;
        game.playerY = Math.min(0, game.playerY + game.playerVelocity * dt);
        if (game.playerY >= 0) {
          game.playerY = 0;
          game.playerVelocity = 0;
        }

        game.obstacleX -= (48 + game.score * 1.4) * dt;
        if (game.obstacleX < -16) {
          game.score += 1;
          game.obstacleX = SCREEN_SIZE + 18 + this.rng() * 26;
          game.obstacleVariant = Math.floor(this.rng() * 3);
          this.playTone(cube, 880, 0.045);
        }

        const playerFront = 45;
        const obstacleRange = 10 + game.obstacleVariant * 2;
        const jumpingLow = game.playerY > -14;
        if (
          game.obstacleX < playerFront + obstacleRange &&
          game.obstacleX > playerFront - obstacleRange &&
          jumpingLow
        ) {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "spinoff") {
        game.markerX += game.markerDir * (50 + game.score * 1.8) * dt;
        if (game.markerX >= 108) {
          game.markerX = 108;
          game.markerDir = -1;
        }
        if (game.markerX <= 24) {
          game.markerX = 24;
          game.markerDir = 1;
        }
        return;
      }

      if (game.gameType === "kickastick") {
        game.obstacleX -= (74 + game.score * 1.5) * dt;
        if (game.obstacleX <= 28) {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "gogogopher") {
        if (!game.armed && game.cooldown <= 0) {
          game.armed = true;
          game.cooldown = 0.95;
          game.obstacleVariant = Math.floor(this.rng() * 3);
        } else if (game.armed && game.cooldown <= 0) {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "buzzoff") {
        game.obstacleX -= (82 + game.score * 1.6) * dt;
        if (game.obstacleX <= -16) {
          this.finishMiniGame(cube, "fail");
        }
      }
    }

    controlMiniGame(cube) {
      const game = cube.game;

      if (game.gameType === "pullup") {
        game.playerVelocity = -96;
        this.playTone(cube, 430, 0.04);
        return;
      }

      if (game.gameType === "keepaway") {
        game.targetLane = game.targetLane === 0 ? 1 : 0;
        this.playTone(cube, 520, 0.03);
        return;
      }

      if (game.gameType === "bounce") {
        if (game.obstacleY > GROUND_Y - 26 && game.playerVelocity > 0) {
          game.playerVelocity = -110;
          game.score += 1;
          this.playTone(cube, 880, 0.04);
        } else {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "jumprope") {
        if (game.playerY === 0) {
          game.playerVelocity = -88;
          this.playTone(cube, 430, 0.04);
        }
        return;
      }

      if (game.gameType === "spinoff") {
        if (Math.abs(game.markerX - game.targetX) <= game.targetWidth / 2) {
          game.score += 1;
          game.targetX = 42 + this.rng() * 50;
          game.targetWidth = clamp(game.targetWidth - 1, 10, 20);
          this.playTone(cube, 900, 0.04);
        } else {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "kickastick") {
        if (game.obstacleX <= 60 && game.obstacleX >= 40) {
          game.score += 1;
          game.obstacleX = SCREEN_SIZE + 18 + this.rng() * 22;
          this.playTone(cube, 860, 0.04);
        } else {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "gogogopher") {
        if (game.armed) {
          game.score += 1;
          game.armed = false;
          game.cooldown = 0.45;
          this.playTone(cube, 840, 0.04);
        } else {
          this.finishMiniGame(cube, "fail");
        }
        return;
      }

      if (game.gameType === "buzzoff") {
        if (game.obstacleX <= 68 && game.obstacleX >= 42) {
          game.score += 1;
          game.obstacleX = SCREEN_SIZE + 18 + this.rng() * 26;
          game.obstacleY = this.rng() > 0.5 ? 44 : 72;
          this.playTone(cube, 820, 0.04);
        } else {
          this.finishMiniGame(cube, "fail");
        }
      }
    }

    pressControl(cube) {
      const game = cube.game;
      cube.pulseTimer = 0.16;

      if (!cube.powerOn) {
        this.wakeCube(cube);
        return;
      }

      this.touchCube(cube);

      if (game.state === "idle") {
        this.prepareMiniGame(cube);
        game.state = "ready";
        this.playTone(cube, 520, 0.05);
        return;
      }

      if (game.state === "ready" || game.state === "highscore" || game.state === "gameover") {
        this.startMiniGame(cube);
        this.playTone(cube, 720, 0.05);
        return;
      }

      if (game.state === "active") {
        this.controlMiniGame(cube);
      }
    }

    pressSound(cube) {
      if (!this.touchCube(cube)) {
        return;
      }
      cube.soundOn = !cube.soundOn;
      cube.pulseTimer = 0.2;
      this.playTone(cube, cube.soundOn ? 780 : 260, 0.05);
    }

    pressHighScore(cube) {
      if (!this.touchCube(cube)) {
        return;
      }
      cube.game.state = "highscore";
      cube.game.displayTimer = 1.6;
      cube.pulseTimer = 0.16;
      this.playTone(cube, 610, 0.05);
    }

    handleCubeButton(cubeId, action) {
      const cube = this.getCube(cubeId);
      if (!cube) {
        return;
      }

      this.selectCube(cubeId);

      if (action === "control") {
        this.pressControl(cube);
      } else if (action === "sound") {
        this.pressSound(cube);
      } else if (action === "highscore") {
        this.pressHighScore(cube);
      }

      this.persistDirty = true;
      this.saveWorld(true);
    }

    playTone(cube, frequency, duration, type) {
      if (!cube.soundOn && frequency !== 780 && frequency !== 260) {
        return;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }

      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      oscillator.type = type || "square";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.03;
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(this.audioContext.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration);
    }

    advanceNeeds(agent, dt) {
      const personality = PERSONALITIES[agent.personalityKey];
      const sameCubeCount = this.getAgentsInCube(agent.currentCubeId).length;

      agent.needs.rest = clamp(agent.needs.rest + dt * (0.02 + personality.restBias * 0.03), 0, 1);
      agent.needs.play = clamp(agent.needs.play + dt * (0.015 + personality.playBias * 0.024), 0, 1);
      agent.needs.explore = clamp(agent.needs.explore + dt * (0.013 + personality.curiosityBias * 0.026), 0, 1);
      agent.needs.social = clamp(
        agent.needs.social + dt * (sameCubeCount > 1 ? 0.004 : 0.018 + personality.socialBias * 0.02),
        0,
        1
      );
    }

    advanceAgent(agent, dt) {
      if (agent.sequence.length === 0) {
        agent.sequence = this.chooseSequence(agent);
      }

      const step = agent.sequence[0];
      if (!step) {
        agent.currentPose = "idle";
        agent.currentActivity = "idling";
        return;
      }

      if (!step.started) {
        step.started = true;
        if (step.pulses) {
          step.pulses.forEach((pulse) => {
            this.setEdgePulse(pulse.cubeId, pulse.side, pulse.amount);
          });
        }
      }

      if (step.type === "move") {
        const speed = step.speed || 34;
        const travel = speed * dt;
        const remaining = distance(agent.x, agent.y, step.x, step.y);
        agent.currentPose = "walk";
        agent.currentActivity = step.label;
        agent.stride += dt * 10;
        agent.facing = step.x >= agent.x ? 1 : -1;

        if (remaining <= travel) {
          agent.x = step.x;
          agent.y = step.y;
          agent.sequence.shift();
        } else {
          agent.x += ((step.x - agent.x) / remaining) * travel;
          agent.y += ((step.y - agent.y) / remaining) * travel;
        }
        return;
      }

      if (step.type === "switchCube") {
        agent.currentCubeId = step.cubeId;
        agent.x = step.x;
        agent.y = step.y;
        agent.currentPose = "walk";
        agent.currentActivity = step.label;
        agent.sequence.shift();
        return;
      }

      if (step.type === "wait") {
        step.remaining -= dt;
        agent.currentPose = step.pose;
        agent.currentActivity = step.label;
        agent.bob += dt * 4;
        this.satisfyNeed(agent, step.effect, dt);
        if (step.remaining <= 0) {
          agent.sequence.shift();
        }
      }
    }

    satisfyNeed(agent, effect, dt) {
      if (effect === "rest") {
        agent.needs.rest = clamp(agent.needs.rest - dt * 0.36, 0, 1);
      } else if (effect === "play") {
        agent.needs.play = clamp(agent.needs.play - dt * 0.34, 0, 1);
        agent.needs.social = clamp(agent.needs.social - dt * 0.05, 0, 1);
      } else if (effect === "social") {
        agent.needs.social = clamp(agent.needs.social - dt * 0.38, 0, 1);
        agent.needs.play = clamp(agent.needs.play - dt * 0.06, 0, 1);
      } else if (effect === "inspect") {
        agent.needs.explore = clamp(agent.needs.explore - dt * 0.32, 0, 1);
      } else if (effect === "wander") {
        agent.needs.explore = clamp(agent.needs.explore - dt * 0.18, 0, 1);
      } else if (effect === "help") {
        agent.needs.explore = clamp(agent.needs.explore - dt * 0.24, 0, 1);
        agent.needs.social = clamp(agent.needs.social - dt * 0.18, 0, 1);
      } else if (effect === "protect") {
        agent.needs.social = clamp(agent.needs.social - dt * 0.22, 0, 1);
        agent.needs.explore = clamp(agent.needs.explore - dt * 0.12, 0, 1);
      }
    }

    chooseSequence(agent) {
      const personality = PERSONALITIES[agent.personalityKey];
      const castBehavior = CAST_BEHAVIORS[agent.personalityKey];
      const currentCube = this.getCube(agent.currentCubeId);
      const otherAgents = this.getAgentsInCube(agent.currentCubeId).filter((other) => other.id !== agent.id);
      const neighbors = this.getNeighbors(agent.currentCubeId).filter((cube) => {
        return cube.powerOn && !cube.sleepingAnimation;
      });
      const plans = [];

      const addPlan = (score, steps) => {
        plans.push({
          score: score + this.rng() * 0.1,
          steps: steps,
        });
      };

      const restFurniture = currentCube.furniture.filter((item) => {
        return FURNITURE_TYPES[item.type].affordance === "rest";
      });
      if (restFurniture.length > 0) {
        const target = this.pickFavoriteFurniture(restFurniture, castBehavior.favoriteFurniture);
        addPlan(
          agent.needs.rest * (1.15 + personality.restBias),
          this.buildFurniturePlan(agent, target, "rest")
        );
      }

      const playFurniture = currentCube.furniture.filter((item) => {
        return FURNITURE_TYPES[item.type].affordance === "play";
      });
      if (playFurniture.length > 0) {
        const target = this.pickFavoriteFurniture(playFurniture, castBehavior.favoriteFurniture);
        addPlan(
          agent.needs.play * (1.05 + personality.playBias),
          this.buildFurniturePlan(agent, target, "play")
        );
      }

      const inspectFurniture = currentCube.furniture.filter((item) => {
        return FURNITURE_TYPES[item.type].affordance === "inspect";
      });
      if (inspectFurniture.length > 0) {
        const target = this.pickFavoriteFurniture(inspectFurniture, castBehavior.favoriteFurniture);
        addPlan(
          agent.needs.explore * (0.9 + personality.curiosityBias),
          this.buildFurniturePlan(agent, target, "inspect")
        );
      }

      this.addSignaturePlans(agent, currentCube, otherAgents, neighbors, addPlan);

      if (otherAgents.length > 0) {
        const targetAgent = pickFrom(otherAgents, this.rng);
        addPlan(agent.needs.social * (1.0 + personality.socialBias), this.buildChatPlan(agent, targetAgent));
      }

      if (neighbors.length > 0) {
        const neighbor = pickFrom(neighbors, this.rng);
        addPlan(
          agent.needs.social * (0.55 + personality.socialBias) +
            agent.needs.explore * (0.4 + personality.curiosityBias * 0.8),
          this.buildVisitPlan(agent, currentCube, neighbor)
        );
        addPlan(
          agent.needs.social * (0.35 + personality.socialBias * 0.55),
          this.buildWavePlan(currentCube, neighbor)
        );
      }

      if (currentCube.soundOn) {
        addPlan(0.42 + agent.needs.play * (0.4 + personality.playBias), this.buildDancePlan());
      }

      if (agent.currentCubeId !== agent.homeCubeId) {
        const hop = this.findNextHop(agent.currentCubeId, agent.homeCubeId);
        if (hop) {
          addPlan(0.34 + agent.needs.rest * 0.4 + (1 - personality.curiosityBias) * 0.22, this.buildVisitPlan(agent, currentCube, hop));
        }
      }

      addPlan(0.18 + agent.needs.explore * (0.45 + personality.curiosityBias * 0.4), this.buildWanderPlan());
      addPlan(0.1 + personality.restBias * 0.08, this.buildIdlePlan());

      plans.sort((a, b) => b.score - a.score);
      return plans[0].steps;
    }

    pickFavoriteFurniture(items, favoriteType) {
      const preferred = items.find((item) => item.type === favoriteType);
      return preferred || pickFrom(items, this.rng);
    }

    findCastTarget(currentCube, otherAgents, neighbors, personalityKey) {
      const localAgent = otherAgents.find((agent) => agent.personalityKey === personalityKey);
      if (localAgent) {
        return {
          agent: localAgent,
          cube: currentCube,
          local: true,
        };
      }

      const neighboringCube = neighbors.find((cube) => {
        const resident = this.getResident(cube.id);
        return resident && resident.personalityKey === personalityKey;
      });

      if (!neighboringCube) {
        return null;
      }

      return {
        agent: this.getResident(neighboringCube.id),
        cube: neighboringCube,
        local: false,
      };
    }

    getFurnitureAnchor(cube, preferredTypes) {
      const preferred = cube.furniture.find((item) => preferredTypes.includes(item.type));
      if (preferred) {
        return { x: preferred.x, y: preferred.y };
      }

      if (cube.furniture[0]) {
        return { x: cube.furniture[0].x, y: cube.furniture[0].y };
      }

      return { x: 66, y: 74 };
    }

    buildTransferSteps(fromCube, toCube) {
      const directionX = toCube.gridX - fromCube.gridX;
      const directionY = toCube.gridY - fromCube.gridY;
      const fromSide = this.directionToSide(directionX, directionY);
      const toSide = this.oppositeSide(fromSide);
      const exitPoint = {
        x: directionX > 0 ? 124 : directionX < 0 ? 8 : 66,
        y: directionY > 0 ? 124 : directionY < 0 ? 8 : 72,
      };
      const entryPoint = {
        x: directionX > 0 ? 8 : directionX < 0 ? 124 : 66,
        y: directionY > 0 ? 10 : directionY < 0 ? 124 : 72,
      };

      return [
        { type: "move", x: exitPoint.x, y: exitPoint.y, label: "heading out" },
        {
          type: "wait",
          remaining: 0.24 + this.rng() * 0.08,
          pose: "look",
          effect: null,
          label: "at edge",
          pulses: [{ cubeId: fromCube.id, side: fromSide, amount: 1 }],
        },
        {
          type: "switchCube",
          cubeId: toCube.id,
          x: entryPoint.x,
          y: entryPoint.y,
          label: "crossing over",
          pulses: [
            { cubeId: fromCube.id, side: fromSide, amount: 1 },
            { cubeId: toCube.id, side: toSide, amount: 1 },
          ],
        },
        {
          type: "wait",
          remaining: 0.18 + this.rng() * 0.08,
          pose: "look",
          effect: null,
          label: "arriving",
          pulses: [{ cubeId: toCube.id, side: toSide, amount: 0.85 }],
        },
      ];
    }

    buildMeetPlan(agent, targetPoint, pose, effect, label, duration) {
      return [
        {
          type: "move",
          x: targetPoint.x,
          y: targetPoint.y,
          label: "walking",
        },
        {
          type: "wait",
          remaining: duration,
          pose: pose,
          effect: effect,
          label: label,
        },
      ];
    }

    buildVisitAndActPlan(agent, fromCube, toCube, targetPoint, pose, effect, label, duration, cooldownPose) {
      const steps = this.buildTransferSteps(fromCube, toCube);
      steps.push({
        type: "move",
        x: targetPoint.x,
        y: targetPoint.y,
        label: "walking",
      });
      steps.push({
        type: "wait",
        remaining: duration,
        pose: pose,
        effect: effect,
        label: label,
      });
      if (cooldownPose) {
        steps.push({
          type: "wait",
          remaining: 0.55 + this.rng() * 0.25,
          pose: cooldownPose,
          effect: effect,
          label: "lingering",
        });
      }
      return steps;
    }

    buildSlimPetsDogPlan(agent, target) {
      if (target.local) {
        return this.buildMeetPlan(
          agent,
          offsetToward({ x: agent.x, y: agent.y }, { x: target.agent.x, y: target.agent.y }, 12),
          "wave",
          "social",
          "petting dog",
          1.25 + this.rng() * 0.35
        );
      }

      return this.buildVisitAndActPlan(
        agent,
        this.getCube(agent.currentCubeId),
        target.cube,
        this.getFurnitureAnchor(target.cube, ["bed", "plant"]),
        "wave",
        "social",
        "petting dog",
        1.3 + this.rng() * 0.35,
        "look"
      );
    }

    buildScoopFetchStickPlan(agent, target) {
      const performFetch = (targetPoint) => {
        const fetchPoint = {
          x: targetPoint.x < 66 ? 104 : 24,
          y: clamp(targetPoint.y, 40, 94),
        };
        return [
          { type: "move", x: targetPoint.x, y: targetPoint.y, label: "walking" },
          { type: "wait", remaining: 0.45 + this.rng() * 0.15, pose: "wave", effect: "social", label: "fetching" },
          { type: "move", x: fetchPoint.x, y: fetchPoint.y, label: "running" },
          { type: "move", x: targetPoint.x, y: targetPoint.y, label: "returning" },
          { type: "wait", remaining: 0.8 + this.rng() * 0.3, pose: "wave", effect: "play", label: "returning stick" },
        ];
      };

      if (target.local) {
        return performFetch(offsetToward({ x: agent.x, y: agent.y }, { x: target.agent.x, y: target.agent.y }, 12));
      }

      return this.buildTransferSteps(this.getCube(agent.currentCubeId), target.cube).concat(
        performFetch(this.getFurnitureAnchor(target.cube, ["lamp", "chair"]))
      );
    }

    buildBallChallengePlan(agent, target) {
      const performChallenge = (point) => {
        const sidePoint = {
          x: point.x < 66 ? point.x + 22 : point.x - 22,
          y: clamp(point.y + 6, 42, 96),
        };
        return [
          { type: "move", x: point.x, y: point.y, label: "walking" },
          { type: "wait", remaining: 0.9 + this.rng() * 0.25, pose: "dance", effect: "play", label: "showing off" },
          { type: "move", x: sidePoint.x, y: sidePoint.y, label: "circling" },
          { type: "wait", remaining: 0.7 + this.rng() * 0.2, pose: "look", effect: "social", label: "challenging" },
        ];
      };

      if (target.local) {
        return performChallenge(offsetToward({ x: agent.x, y: agent.y }, { x: target.agent.x, y: target.agent.y }, 14));
      }

      return this.buildTransferSteps(this.getCube(agent.currentCubeId), target.cube).concat(
        performChallenge(this.getFurnitureAnchor(target.cube, ["toy", "chair"]))
      );
    }

    buildRopeShowPlan(agent, target) {
      const showPoint = target.local
        ? offsetToward({ x: agent.x, y: agent.y }, { x: target.agent.x, y: target.agent.y }, 18)
        : this.getFurnitureAnchor(target.cube, ["console", "chair"]);
      const steps = target.local ? [] : this.buildTransferSteps(this.getCube(agent.currentCubeId), target.cube);
      return steps.concat([
        { type: "move", x: showPoint.x, y: showPoint.y, label: "walking" },
        { type: "wait", remaining: 1.2 + this.rng() * 0.35, pose: "dance", effect: "play", label: "showing tricks" },
        { type: "wait", remaining: 0.7 + this.rng() * 0.2, pose: "wave", effect: "social", label: "showing tricks" },
      ]);
    }

    buildJamSessionPlan(agent, target) {
      const jamPoint = target
        ? target.local
          ? offsetToward({ x: agent.x, y: agent.y }, { x: target.agent.x, y: target.agent.y }, 16)
          : this.getFurnitureAnchor(target.cube, ["console", "lamp"])
        : { x: 68, y: 68 };
      const steps = target && !target.local ? this.buildTransferSteps(this.getCube(agent.currentCubeId), target.cube) : [];
      return steps.concat([
        { type: "move", x: jamPoint.x, y: jamPoint.y, label: "walking" },
        { type: "wait", remaining: 1.25 + this.rng() * 0.35, pose: "dance", effect: "social", label: "jamming" },
        { type: "wait", remaining: 0.7 + this.rng() * 0.25, pose: "dance", effect: "play", label: "jamming" },
      ]);
    }

    buildWorkoutPlan(agent, target) {
      const workoutPoint = target.local
        ? offsetToward({ x: agent.x, y: agent.y }, { x: target.agent.x, y: target.agent.y }, 16)
        : this.getFurnitureAnchor(target.cube, ["chair", "toy"]);
      const steps = target.local ? [] : this.buildTransferSteps(this.getCube(agent.currentCubeId), target.cube);
      return steps.concat([
        { type: "move", x: workoutPoint.x, y: workoutPoint.y, label: "walking" },
        { type: "wait", remaining: 1.0 + this.rng() * 0.35, pose: "hang", effect: "play", label: "training" },
        { type: "wait", remaining: 0.8 + this.rng() * 0.2, pose: "wave", effect: "social", label: "coaching" },
      ]);
    }

    buildRepairPlan(agent, targetCube) {
      const repairPoint = this.getFurnitureAnchor(targetCube, ["lamp", "console", "chair"]);
      return this.buildVisitAndActPlan(
        agent,
        this.getCube(agent.currentCubeId),
        targetCube,
        repairPoint,
        "look",
        "help",
        "repairing",
        1.15 + this.rng() * 0.3,
        "wave"
      );
    }

    buildTidyPlan(agent, targetCube) {
      const firstPoint = this.getFurnitureAnchor(targetCube, ["plant", "lamp", "chair"]);
      const secondPoint = {
        x: clamp(firstPoint.x + (firstPoint.x < 66 ? 26 : -26), 20, 112),
        y: clamp(firstPoint.y + 6, 34, 98),
      };
      return this.buildTransferSteps(this.getCube(agent.currentCubeId), targetCube).concat([
        { type: "move", x: firstPoint.x, y: firstPoint.y, label: "walking" },
        { type: "wait", remaining: 0.8 + this.rng() * 0.2, pose: "look", effect: "help", label: "tidying" },
        { type: "move", x: secondPoint.x, y: secondPoint.y, label: "walking" },
        { type: "wait", remaining: 0.75 + this.rng() * 0.2, pose: "look", effect: "help", label: "tidying" },
      ]);
    }

    buildGuardPlan(agent, targetCube) {
      const fromCube = this.getCube(agent.currentCubeId);
      const directionX = targetCube.gridX - fromCube.gridX;
      const directionY = targetCube.gridY - fromCube.gridY;
      const edgePoint = {
        x: directionX > 0 ? 118 : directionX < 0 ? 12 : 66,
        y: directionY > 0 ? 118 : directionY < 0 ? 20 : 72,
      };
      return [
        { type: "move", x: edgePoint.x, y: edgePoint.y, label: "moving to edge" },
        {
          type: "wait",
          remaining: 1.0 + this.rng() * 0.25,
          pose: "look",
          effect: "protect",
          label: "keeping watch",
          pulses: [
            { cubeId: fromCube.id, side: this.directionToSide(directionX, directionY), amount: 0.85 },
            { cubeId: targetCube.id, side: this.oppositeSide(this.directionToSide(directionX, directionY)), amount: 0.7 },
          ],
        },
      ];
    }

    addSignaturePlans(agent, currentCube, otherAgents, neighbors, addPlan) {
      const personality = PERSONALITIES[agent.personalityKey];
      const localClutter = currentCube.furniture.length;
      const loudNeighbor = neighbors.find((cube) => cube.soundOn);

      if (agent.personalityKey === "slim") {
        const scoopTarget = this.findCastTarget(currentCube, otherAgents, neighbors, "scoop");
        if (scoopTarget) {
          addPlan(
            0.92 + agent.needs.social * 0.35 + agent.needs.explore * 0.12,
            this.buildSlimPetsDogPlan(agent, scoopTarget)
          );
        }
        const hansTarget = this.findCastTarget(currentCube, otherAgents, neighbors, "hans");
        if (hansTarget) {
          addPlan(0.56 + agent.needs.social * 0.16 + agent.needs.rest * 0.1, this.buildWorkoutPlan(agent, hansTarget));
        }
      } else if (agent.personalityKey === "scoop") {
        const slimTarget = this.findCastTarget(currentCube, otherAgents, neighbors, "slim");
        if (slimTarget) {
          addPlan(
            0.98 + agent.needs.social * 0.3 + agent.needs.play * 0.18,
            this.buildScoopFetchStickPlan(agent, slimTarget)
          );
        }
      } else if (agent.personalityKey === "dodger") {
        const ballTarget =
          this.findCastTarget(currentCube, otherAgents, neighbors, "whip") ||
          this.findCastTarget(currentCube, otherAgents, neighbors, "hans");
        if (ballTarget) {
          addPlan(
            0.86 + agent.needs.play * 0.32 + agent.needs.social * 0.12,
            this.buildBallChallengePlan(agent, ballTarget)
          );
        }
      } else if (agent.personalityKey === "whip") {
        const showTarget =
          this.findCastTarget(currentCube, otherAgents, neighbors, "dodger") ||
          this.findCastTarget(currentCube, otherAgents, neighbors, "mic");
        if (showTarget) {
          addPlan(
            0.84 + agent.needs.play * 0.3 + agent.needs.social * 0.14,
            this.buildRopeShowPlan(agent, showTarget)
          );
        }
      } else if (agent.personalityKey === "mic") {
        const jamTarget =
          this.findCastTarget(currentCube, otherAgents, neighbors, "whip") ||
          this.findCastTarget(currentCube, otherAgents, neighbors, "dusty");
        if (jamTarget || currentCube.soundOn || loudNeighbor) {
          addPlan(
            0.8 + agent.needs.play * 0.26 + agent.needs.social * 0.24 + (currentCube.soundOn ? 0.18 : 0),
            this.buildJamSessionPlan(agent, jamTarget)
          );
        }
      } else if (agent.personalityKey === "hans") {
        const trainee =
          this.findCastTarget(currentCube, otherAgents, neighbors, "slim") ||
          this.findCastTarget(currentCube, otherAgents, neighbors, "dodger");
        if (trainee) {
          addPlan(
            0.82 + agent.needs.play * 0.18 + agent.needs.social * 0.12,
            this.buildWorkoutPlan(agent, trainee)
          );
        }
        const watchCube = neighbors.find((cube) => this.getAgentsInCube(cube.id).length === 0) || neighbors[0];
        if (watchCube) {
          addPlan(0.34 + agent.needs.explore * 0.12, this.buildGuardPlan(agent, watchCube));
        }
      } else if (agent.personalityKey === "handy") {
        const dustyTarget = this.findCastTarget(currentCube, otherAgents, neighbors, "dusty");
        const repairCube =
          (dustyTarget && !dustyTarget.local && dustyTarget.cube) ||
          neighbors.find((cube) => cube.furniture.some((item) => item.type === "lamp" || item.type === "console")) ||
          neighbors.find((cube) => cube.furniture.length >= 3);
        if (repairCube) {
          addPlan(
            0.8 + agent.needs.explore * 0.24 + agent.needs.social * 0.14,
            this.buildRepairPlan(agent, repairCube)
          );
        }
      } else if (agent.personalityKey === "dusty") {
        const tidyCube =
          neighbors.find((cube) => cube.furniture.length >= 3) ||
          (this.findCastTarget(currentCube, otherAgents, neighbors, "handy") || {}).cube ||
          neighbors.find((cube) => cube.soundOn);
        if (tidyCube) {
          addPlan(
            0.78 + agent.needs.explore * 0.2 + agent.needs.social * 0.12 + localClutter * 0.02,
            this.buildTidyPlan(agent, tidyCube)
          );
        }
      }

      if (personality.socialBias > 0.7 && loudNeighbor) {
        addPlan(0.42 + agent.needs.social * 0.16, this.buildGuardPlan(agent, loudNeighbor));
      }
    }

    buildFurniturePlan(agent, furniture, effect) {
      const target = offsetToward({ x: agent.x, y: agent.y }, { x: furniture.x, y: furniture.y }, 8);
      return [
        { type: "move", x: target.x, y: target.y, label: "moving" },
        {
          type: "wait",
          remaining: 2 + this.rng() * 1.5,
          pose: effect === "rest" ? "sit" : effect === "play" ? "dance" : "look",
          effect: effect,
          label: "lingering",
        },
      ];
    }

    buildChatPlan(agent, targetAgent) {
      const destination = offsetToward(
        { x: agent.x, y: agent.y },
        { x: targetAgent.x + targetAgent.facing * 2, y: targetAgent.y },
        12
      );
      return [
        { type: "move", x: destination.x, y: destination.y, label: "walking" },
        { type: "wait", remaining: 1.6 + this.rng(), pose: "wave", effect: "social", label: "chatting" },
      ];
    }

    buildVisitPlan(agent, fromCube, toCube) {
      const directionX = toCube.gridX - fromCube.gridX;
      const directionY = toCube.gridY - fromCube.gridY;
      const fromSide = this.directionToSide(directionX, directionY);
      const toSide = this.oppositeSide(fromSide);
      const exitPoint = {
        x: directionX > 0 ? 124 : directionX < 0 ? 8 : 66,
        y: directionY > 0 ? 124 : directionY < 0 ? 8 : 72,
      };
      const entryPoint = {
        x: directionX > 0 ? 8 : directionX < 0 ? 124 : 66,
        y: directionY > 0 ? 10 : directionY < 0 ? 124 : 72,
      };
      const interior = this.pickInteriorPoint();
      return [
        { type: "move", x: exitPoint.x, y: exitPoint.y, label: "heading out" },
        {
          type: "wait",
          remaining: 0.24 + this.rng() * 0.08,
          pose: "look",
          effect: null,
          label: "at edge",
          pulses: [{ cubeId: fromCube.id, side: fromSide, amount: 1 }],
        },
        {
          type: "switchCube",
          cubeId: toCube.id,
          x: entryPoint.x,
          y: entryPoint.y,
          label: "crossing over",
          pulses: [
            { cubeId: fromCube.id, side: fromSide, amount: 1 },
            { cubeId: toCube.id, side: toSide, amount: 1 },
          ],
        },
        {
          type: "wait",
          remaining: 0.18 + this.rng() * 0.08,
          pose: "look",
          effect: null,
          label: "arriving",
          pulses: [{ cubeId: toCube.id, side: toSide, amount: 0.85 }],
        },
        { type: "move", x: interior.x, y: interior.y, label: "walking" },
        { type: "wait", remaining: 0.9 + this.rng(), pose: "look", effect: "wander", label: "looking" },
      ];
    }

    buildWavePlan(fromCube, neighbor) {
      const directionX = neighbor.gridX - fromCube.gridX;
      const directionY = neighbor.gridY - fromCube.gridY;
      const fromSide = this.directionToSide(directionX, directionY);
      const toSide = this.oppositeSide(fromSide);
      return [
        {
          type: "move",
          x: directionX > 0 ? 118 : directionX < 0 ? 12 : 66,
          y: directionY > 0 ? 118 : directionY < 0 ? 20 : 72,
          label: "moving to edge",
        },
        {
          type: "wait",
          remaining: 1.05 + this.rng() * 0.25,
          pose: "wave",
          effect: "social",
          label: "waving",
          pulses: [
            { cubeId: fromCube.id, side: fromSide, amount: 0.9 },
            { cubeId: neighbor.id, side: toSide, amount: 0.9 },
          ],
        },
      ];
    }

    buildDancePlan() {
      return [
        { type: "wait", remaining: 1.5 + this.rng() * 1.2, pose: "dance", effect: "play", label: "dancing" },
      ];
    }

    buildWanderPlan() {
      const point = this.pickInteriorPoint();
      return [
        { type: "move", x: point.x, y: point.y, label: "wandering" },
        { type: "wait", remaining: 0.7 + this.rng() * 1.2, pose: "look", effect: "wander", label: "lingering" },
      ];
    }

    buildIdlePlan() {
      return [{ type: "wait", remaining: 0.7 + this.rng(), pose: "idle", effect: null, label: "idle" }];
    }

    pickInteriorPoint() {
      return {
        x: 18 + this.rng() * 96,
        y: 26 + this.rng() * 82,
      };
    }

    renderWorldShell() {
      document.documentElement.style.setProperty("--world-columns", String(this.columns));
      this.cardRefs.clear();
      this.dom.worldStage.innerHTML = "";

      this.cubes.forEach((cube) => {
        const shell = document.createElement("article");
        shell.className = "cube-shell";
        shell.style.setProperty("--shell-glow", cube.shellGlow);
        shell.style.setProperty("--shell-deep", cube.shellDeep);
        let pointerStart = null;
        shell.innerHTML = [
          '<button class="side-button" type="button" data-action="highscore" title="High score" aria-label="High score"></button>',
          '<div class="side-label">high score</div>',
          '<div class="cube-face">',
          '<div class="screen-bezel"><canvas class="cube-screen" width="' + SCREEN_SIZE + '" height="' + SCREEN_SIZE + '"></canvas></div>',
          '<div class="front-labels"><span>sound</span><span>on / stick game / game control</span></div>',
          '<div class="front-controls">',
          '<button class="front-button sound-button" type="button" data-action="sound" title="Sound" aria-label="Sound"></button>',
          '<button class="front-button control-button" type="button" data-action="control" title="On / Stick Game / Game Control" aria-label="On / Stick Game / Game Control"></button>',
          "</div>",
          "</div>",
        ].join("");

        shell.addEventListener("pointerdown", (event) => {
          if (event.target.closest("[data-action]")) {
            return;
          }
          pointerStart = { x: event.clientX, y: event.clientY };
          if (shell.setPointerCapture) {
            shell.setPointerCapture(event.pointerId);
          }
        });

        shell.addEventListener("pointerup", (event) => {
          if (!pointerStart || event.target.closest("[data-action]")) {
            return;
          }
          const dx = event.clientX - pointerStart.x;
          const dy = event.clientY - pointerStart.y;
          pointerStart = null;
          if (Math.hypot(dx, dy) >= MOTION_THRESHOLD) {
            this.jostleCube(cube.id, dx, dy);
            return;
          }
          this.selectCube(cube.id);
          this.touchCube(this.getCube(cube.id));
          if (shell.releasePointerCapture) {
            shell.releasePointerCapture(event.pointerId);
          }
        });

        shell.addEventListener("pointercancel", () => {
          pointerStart = null;
        });

        shell.querySelectorAll("[data-action]").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.stopPropagation();
            this.handleCubeButton(cube.id, button.dataset.action);
          });
        });

        this.dom.worldStage.appendChild(shell);
        this.cardRefs.set(cube.id, {
          shell: shell,
          canvas: shell.querySelector("canvas"),
          soundButton: shell.querySelector(".sound-button"),
          controlButton: shell.querySelector(".control-button"),
          sideButton: shell.querySelector(".side-button"),
        });
      });
    }

    render() {
      this.syncPickers();
      this.cubes.forEach((cube) => {
        const refs = this.cardRefs.get(cube.id);
        if (!refs) {
          return;
        }

        refs.shell.classList.toggle("selected", cube.id === this.selectedCubeId);
        refs.shell.classList.toggle("asleep", cube.sleepingAnimation);
        refs.shell.classList.toggle("off", !cube.powerOn);
        refs.soundButton.classList.toggle("active", cube.soundOn);
        refs.controlButton.classList.toggle("active", cube.pulseTimer > 0 || cube.game.state === "active");
        refs.sideButton.classList.toggle("active", cube.game.state === "highscore");
        refs.shell.style.setProperty("--nudge-x", cube.motion.nudgeX.toFixed(2) + "px");
        refs.shell.style.setProperty("--nudge-y", cube.motion.nudgeY.toFixed(2) + "px");
        refs.shell.style.setProperty("--tilt-x", cube.motion.tiltX.toFixed(2) + "deg");
        refs.shell.style.setProperty("--tilt-y", cube.motion.tiltY.toFixed(2) + "deg");
        this.drawCube(refs.canvas.getContext("2d"), cube);
      });
    }

    drawCube(context, cube) {
      const game = cube.game;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);
      context.fillStyle = "#d7deca";
      context.fillRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);

      context.strokeStyle = "rgba(39, 45, 39, 0.07)";
      context.lineWidth = 1;
      for (let line = 10; line < SCREEN_SIZE; line += 10) {
        context.beginPath();
        context.moveTo(line, 0);
        context.lineTo(line, SCREEN_SIZE);
        context.stroke();
        context.beginPath();
        context.moveTo(0, line);
        context.lineTo(SCREEN_SIZE, line);
        context.stroke();
      }

      if (!cube.powerOn) {
        return;
      }

      if (cube.sleepingAnimation) {
        this.drawSleepScreen(context, cube);
        return;
      }

      if (game.state === "boot") {
        this.drawDigits(context, "888", 44, 74, 28);
        return;
      }

      if (game.state === "ready") {
        this.drawReadyScreen(context, cube);
        return;
      }

      if (game.state === "highscore") {
        this.drawDigits(context, "HI", 18, 40, 18);
        this.drawDigits(context, String(game.highScore).padStart(2, "0"), 46, 84, 30);
        return;
      }

      if (game.state === "active" || game.state === "gameover") {
        this.drawGame(context, cube);
        return;
      }

      this.drawWorldScreen(context, cube);
    }

    drawReadyScreen(context, cube) {
      this.drawMiniGame(context, cube, true);
      this.drawDigits(context, "00", 76, 30, 18);
      context.beginPath();
      context.moveTo(90, 60);
      context.lineTo(110, 66);
      context.lineTo(90, 72);
      context.closePath();
      context.fillStyle = "#20251f";
      context.fill();
    }

    drawGame(context, cube) {
      this.drawMiniGame(context, cube, false);
      this.drawDigits(context, String(cube.game.score).padStart(2, "0"), 84, 22, 18);
      if (cube.game.state === "gameover") {
        this.drawDigits(context, "NO", 20, 34, 16);
      }
    }

    drawMiniGame(context, cube, isReady) {
      const game = cube.game;

      if (game.gameType === "pullup") {
        context.beginPath();
        context.moveTo(24, 28);
        context.lineTo(108, 28);
        context.strokeStyle = "#20251f";
        context.lineWidth = 3;
        context.stroke();
        this.drawGameRunner(context, 66, 70, game.playerY - 16, cube.game.themeKey, "hang");
        return;
      }

      if (game.gameType === "keepaway") {
        this.drawKeepAwayScene(context, game, isReady);
        return;
      }

      if (game.gameType === "bounce") {
        context.strokeStyle = "#20251f";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(12, GROUND_Y);
        context.lineTo(120, GROUND_Y);
        context.stroke();
        this.drawGameRunner(context, 42, GROUND_Y, 0, cube.game.themeKey, "idle");
        this.drawBall(context, 72, isReady ? 60 : game.obstacleY);
        return;
      }

      if (game.gameType === "jumprope") {
        context.strokeStyle = "#20251f";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(10, GROUND_Y);
        context.lineTo(SCREEN_SIZE - 8, GROUND_Y);
        context.stroke();
        this.drawGameRunner(context, 44, GROUND_Y, isReady ? 0 : game.playerY, cube.game.themeKey);
        this.drawObstacle(context, isReady ? 96 : game.obstacleX, GROUND_Y, cube.game.themeKey, game.obstacleVariant);
        return;
      }

      if (game.gameType === "spinoff") {
        this.drawSpinOffScene(context, game, isReady);
        return;
      }

      if (game.gameType === "kickastick") {
        context.strokeStyle = "#20251f";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(12, GROUND_Y);
        context.lineTo(120, GROUND_Y);
        context.stroke();
        this.drawGameRunner(context, 40, GROUND_Y, 0, cube.game.themeKey, "walk");
        this.drawKickStick(context, isReady ? 86 : game.obstacleX, GROUND_Y);
        return;
      }

      if (game.gameType === "gogogopher") {
        this.drawGopherScene(context, game, isReady);
        return;
      }

      if (game.gameType === "buzzoff") {
        this.drawBuzzScene(context, game, isReady);
      }
    }

    drawKeepAwayScene(context, game, isReady) {
      const heldY = game.targetLane === 0 ? 52 : 82;
      const dogY = (isReady ? 0 : game.obstacleY) === 0 ? 52 : 82;
      const dogX = isReady ? 92 : game.obstacleX;
      this.drawDigits(context, "--", 14, 26, 12);
      context.beginPath();
      context.moveTo(12, 44);
      context.lineTo(120, 44);
      context.moveTo(12, 74);
      context.lineTo(120, 74);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      context.stroke();
      this.drawDogHead(context, dogX, dogY);
      context.beginPath();
      context.arc(28, heldY, 5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(23, heldY);
      context.lineTo(33, heldY);
      context.stroke();
    }

    drawSpinOffScene(context, game, isReady) {
      const markerX = isReady ? 32 : game.markerX;
      const targetX = isReady ? 74 : game.targetX;
      const targetWidth = isReady ? 20 : game.targetWidth;
      context.beginPath();
      context.arc(66, 70, 28, 0, Math.PI * 2);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2.4;
      context.stroke();
      context.beginPath();
      context.moveTo(targetX - targetWidth / 2, 32);
      context.lineTo(targetX + targetWidth / 2, 32);
      context.stroke();
      context.beginPath();
      context.moveTo(markerX, 40);
      context.lineTo(markerX, 100);
      context.stroke();
      this.drawMusicNote(context, 94, 34);
    }

    drawGopherScene(context, game, isReady) {
      const holes = [28, 66, 104];
      context.strokeStyle = "#20251f";
      context.lineWidth = 2.4;
      holes.forEach((x) => {
        context.beginPath();
        context.ellipse(x, 96, 12, 5, 0, 0, Math.PI * 2);
        context.stroke();
      });
      const activeIndex = isReady ? 1 : game.obstacleVariant;
      if (isReady || game.armed) {
        this.drawGopher(context, holes[activeIndex], 82);
      }
      this.drawHammer(context, 112, 44);
    }

    drawBuzzScene(context, game, isReady) {
      const bugX = isReady ? 88 : game.obstacleX;
      const bugY = isReady ? 52 : game.obstacleY;
      this.drawBug(context, bugX, bugY);
      context.beginPath();
      context.moveTo(50, 30);
      context.lineTo(50, 96);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      context.stroke();
      this.drawBroom(context, 44, 76);
    }

    drawBall(context, x, y) {
      context.beginPath();
      context.arc(x, y, 8, 0, Math.PI * 2);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2.4;
      context.stroke();
    }

    drawKickStick(context, x, groundY) {
      context.beginPath();
      context.moveTo(x - 10, groundY - 12);
      context.lineTo(x + 10, groundY - 18);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2.4;
      context.stroke();
    }

    drawDogHead(context, x, y) {
      context.save();
      context.translate(x, y);
      context.beginPath();
      context.arc(0, 0, 6, 0, Math.PI * 2);
      context.moveTo(-4, -4);
      context.lineTo(-8, -9);
      context.moveTo(4, -4);
      context.lineTo(8, -9);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      context.stroke();
      context.restore();
    }

    drawGopher(context, x, y) {
      context.save();
      context.translate(x, y);
      context.beginPath();
      context.arc(0, 0, 7, 0, Math.PI * 2);
      context.moveTo(-4, -7);
      context.lineTo(-2, -12);
      context.moveTo(4, -7);
      context.lineTo(2, -12);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      context.stroke();
      context.restore();
    }

    drawHammer(context, x, y) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 10, y + 18);
      context.moveTo(x - 6, y - 2);
      context.lineTo(x + 4, y - 8);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2.4;
      context.stroke();
    }

    drawBug(context, x, y) {
      context.save();
      context.translate(x, y);
      context.beginPath();
      context.arc(0, 0, 4, 0, Math.PI * 2);
      context.moveTo(-7, -4);
      context.lineTo(-2, -1);
      context.moveTo(7, -4);
      context.lineTo(2, -1);
      context.moveTo(-7, 4);
      context.lineTo(-2, 1);
      context.moveTo(7, 4);
      context.lineTo(2, 1);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      context.stroke();
      context.restore();
    }

    drawWorldScreen(context, cube) {
      const occupants = this.getAgentsInCube(cube.id).slice().sort((a, b) => a.y - b.y);
      context.fillStyle = "rgba(32, 37, 31, 0.1)";
      context.fillRect(0, SCREEN_SIZE - 20, SCREEN_SIZE, 20);
      cube.furniture.forEach((item) => this.drawFurniture(context, item));
      occupants.forEach((agent) => this.drawAgent(context, agent));
      if (cube.soundOn) {
        this.drawMusicNote(context, 112, 18);
      }
      this.drawBlind(context, cube.blindAmount);
      this.drawEdgePulses(context, cube);
    }

    drawSleepScreen(context, cube) {
      const occupants = this.getAgentsInCube(cube.id).slice().sort((a, b) => a.y - b.y);
      context.fillStyle = "rgba(32, 37, 31, 0.08)";
      context.fillRect(0, SCREEN_SIZE - 22, SCREEN_SIZE, 22);
      cube.furniture.forEach((item) => this.drawFurniture(context, item));
      occupants.forEach((agent, index) => {
        const originalPose = agent.currentPose;
        agent.currentPose = "sleep";
        this.drawAgent(context, agent);
        agent.currentPose = originalPose;
        this.drawSleepGlyph(context, Math.min(112, agent.x + 12 + index * 8), Math.max(18, agent.y - 26));
      });
      this.drawBlind(context, cube.blindAmount);
      this.drawEdgePulses(context, cube);
    }

    drawEdgePulses(context, cube) {
      const drawPulse = (side, value) => {
        if (value <= 0) {
          return;
        }
        context.save();
        context.strokeStyle = "rgba(32, 37, 31, " + (0.18 + value * 0.55) + ")";
        context.lineWidth = 4;
        context.beginPath();
        if (side === "left") {
          context.moveTo(2, 48);
          context.lineTo(2, 84);
        } else if (side === "right") {
          context.moveTo(SCREEN_SIZE - 2, 48);
          context.lineTo(SCREEN_SIZE - 2, 84);
        } else if (side === "top") {
          context.moveTo(48, 2);
          context.lineTo(84, 2);
        } else if (side === "bottom") {
          context.moveTo(48, SCREEN_SIZE - 2);
          context.lineTo(84, SCREEN_SIZE - 2);
        }
        context.stroke();
        context.restore();
      };

      drawPulse("left", cube.edgePulse.left);
      drawPulse("right", cube.edgePulse.right);
      drawPulse("top", cube.edgePulse.top);
      drawPulse("bottom", cube.edgePulse.bottom);
    }

    drawBlind(context, amount) {
      if (amount <= 0) {
        return;
      }

      context.save();
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      const depth = snapLcd(18 + 86 * clamp(amount, 0, 1), 9);
      context.fillStyle = "rgba(215, 222, 202, 0.94)";
      context.fillRect(10, 12, SCREEN_SIZE - 20, depth - 8);
      for (let y = 18; y <= depth; y += 9) {
        context.beginPath();
        context.moveTo(12, y);
        context.lineTo(SCREEN_SIZE - 12, y);
        context.stroke();
      }
      context.beginPath();
      context.moveTo(SCREEN_SIZE / 2, 6);
      context.lineTo(SCREEN_SIZE / 2, Math.min(depth, 18));
      context.stroke();
      context.restore();
    }

    getLcdFrameIndex(seed, speed) {
      const frameSpeed = speed || 1;
      return Math.floor(this.worldTime * LCD_FRAME_RATE * frameSpeed + seed) % 64;
    }

    getPoseFrame(poseKey, frameIndex) {
      const frames = LCD_POSES[poseKey] || LCD_POSES.idle;
      return frames[frameIndex % frames.length];
    }

    drawFigureFrame(context, x, y, poseKey, facing, prop, frameSeed, rotation) {
      const frameIndex = this.getLcdFrameIndex(frameSeed || 0, poseKey === "walk" ? 1.2 : 1);
      const pose = this.getPoseFrame(poseKey, frameIndex);
      const snappedX = snapLcd(x);
      const snappedY = snapLcd(y);

      context.save();
      context.translate(snappedX, snappedY);
      context.scale(facing || 1, 1);
      if (poseKey === "sleep") {
        context.rotate(-Math.PI / 2);
        context.translate(0, 8);
      } else if (poseKey === "tumble" && rotation) {
        context.rotate(rotation);
      }
      context.strokeStyle = "#20251f";
      context.fillStyle = "#20251f";
      context.lineWidth = 2;
      context.lineCap = "square";

      context.beginPath();
      context.arc(snapLcd(pose.head.x), snapLcd(pose.head.y), 6, 0, Math.PI * 2);
      context.stroke();

      context.beginPath();
      context.moveTo(snapLcd(pose.torso[0]), snapLcd(pose.torso[1]));
      context.lineTo(snapLcd(pose.torso[2]), snapLcd(pose.torso[3]));
      pose.arms.forEach((arm) => {
        context.moveTo(snapLcd(arm[0]), snapLcd(arm[1]));
        context.lineTo(snapLcd(arm[2]), snapLcd(arm[3]));
      });
      pose.legs.forEach((leg) => {
        context.moveTo(snapLcd(leg[0]), snapLcd(leg[1]));
        context.lineTo(snapLcd(leg[2]), snapLcd(leg[3]));
      });
      context.stroke();

      this.drawProp(context, prop);
      context.restore();
    }

    drawFurniture(context, furniture) {
      context.save();
      context.translate(snapLcd(furniture.x), snapLcd(furniture.y));
      context.strokeStyle = "#20251f";
      context.fillStyle = "#20251f";
      context.lineWidth = 2.3;

      if (furniture.type === "chair") {
        context.beginPath();
        context.moveTo(-8, -4);
        context.lineTo(6, -4);
        context.lineTo(6, 6);
        context.moveTo(-6, -12);
        context.lineTo(-6, -4);
        context.lineTo(4, -4);
        context.stroke();
      } else if (furniture.type === "bed") {
        context.strokeRect(-12, -6, 24, 12);
        context.strokeRect(-10, -4, 8, 6);
      } else if (furniture.type === "toy") {
        context.beginPath();
        context.arc(0, 0, 8, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.moveTo(-6, 0);
        context.lineTo(6, 0);
        context.moveTo(0, -6);
        context.lineTo(0, 6);
        context.stroke();
      } else if (furniture.type === "plant") {
        context.strokeRect(-4, 4, 8, 7);
        context.beginPath();
        context.arc(-3, 0, 4, 0, Math.PI * 2);
        context.arc(3, -3, 4, 0, Math.PI * 2);
        context.arc(0, -7, 5, 0, Math.PI * 2);
        context.stroke();
      } else if (furniture.type === "console") {
        context.strokeRect(-12, -6, 24, 12);
        context.strokeRect(-7, -2, 14, 4);
      } else if (furniture.type === "lamp") {
        context.beginPath();
        context.moveTo(-7, -8);
        context.lineTo(7, -8);
        context.lineTo(4, -14);
        context.lineTo(-4, -14);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(0, -8);
        context.lineTo(0, 10);
        context.stroke();
      }

      context.restore();
    }

    drawAgent(context, agent) {
      const personality = PERSONALITIES[agent.personalityKey];
      const theme = CHARACTER_THEMES[personality.theme];
      const poseKey = LCD_POSES[agent.currentPose] ? agent.currentPose : agent.currentPose === "look" ? "look" : "idle";
      this.drawFigureFrame(
        context,
        agent.x,
        agent.y,
        poseKey,
        agent.facing,
        theme.prop,
        Number(agent.id.split("-")[1]) || 0,
        agent.tumbleAngle
      );
    }

    drawProp(context, prop) {
      if (prop === "stick") {
        context.beginPath();
        context.moveTo(10, -6);
        context.lineTo(16, 9);
        context.stroke();
      } else if (prop === "ball") {
        context.beginPath();
        context.arc(12, 0, 4, 0, Math.PI * 2);
        context.stroke();
      } else if (prop === "rope") {
        context.beginPath();
        context.arc(10, 1, 6, -Math.PI / 3, Math.PI / 1.2);
        context.stroke();
      } else if (prop === "dog") {
        this.drawDogHead(context, 11, 3);
      } else if (prop === "music") {
        this.drawMusicNote(context, 8, -2);
      } else if (prop === "weights") {
        context.beginPath();
        context.moveTo(8, 0);
        context.lineTo(18, 0);
        context.moveTo(9, -4);
        context.lineTo(9, 4);
        context.moveTo(17, -4);
        context.lineTo(17, 4);
        context.stroke();
      } else if (prop === "tool") {
        this.drawHammer(context, 10, -2);
      } else if (prop === "broom") {
        this.drawBroom(context, 10, 2);
      }
    }

    drawMusicNote(context, x, y) {
      context.save();
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + 10);
      context.lineTo(x + 8, y + 6);
      context.lineTo(x + 8, y - 4);
      context.stroke();
      context.beginPath();
      context.arc(x - 2, y + 11, 3, 0, Math.PI * 2);
      context.arc(x + 6, y + 7, 3, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    drawSleepGlyph(context, x, y) {
      context.save();
      context.fillStyle = "#20251f";
      context.font = 'bold 12px "Trebuchet MS", sans-serif';
      context.fillText("Z", x, y);
      context.font = 'bold 9px "Trebuchet MS", sans-serif';
      context.fillText("z", x + 8, y - 8);
      context.fillText("z", x + 14, y - 14);
      context.restore();
    }

    drawGameRunner(context, x, groundY, offsetY, themeKey, poseKey) {
      this.drawFigureFrame(
        context,
        x,
        groundY + offsetY,
        poseKey || "walk",
        1,
        CHARACTER_THEMES[themeKey].prop,
        0,
        0
      );
    }

    drawObstacle(context, x, groundY, themeKey, variant) {
      context.save();
      context.translate(x, groundY);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2.4;
      const obstacle = CHARACTER_THEMES[themeKey].obstacle;
      if (obstacle === "ball") {
        context.beginPath();
        context.arc(0, -6, 6 + variant, 0, Math.PI * 2);
        context.stroke();
      } else if (obstacle === "rope") {
        context.beginPath();
        context.moveTo(-10, -16);
        context.quadraticCurveTo(0, -28 - variant * 2, 10, -16);
        context.stroke();
      } else if (obstacle === "dog") {
        this.drawDogHead(context, 0, -8);
      } else if (obstacle === "record") {
        context.beginPath();
        context.arc(0, -8, 8, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(0, -8, 2, 0, Math.PI * 2);
        context.stroke();
      } else if (obstacle === "gopher") {
        this.drawGopher(context, 0, -8);
      } else if (obstacle === "buzz") {
        this.drawBug(context, 0, -8);
      } else {
        context.beginPath();
        context.moveTo(-8, -14 - variant * 2);
        context.lineTo(8, -14 - variant * 2);
        context.stroke();
      }
      context.restore();
    }

    drawBroom(context, x, y) {
      context.beginPath();
      context.moveTo(x, y - 10);
      context.lineTo(x, y + 10);
      context.moveTo(x - 5, y + 8);
      context.lineTo(x + 5, y + 8);
      context.moveTo(x - 5, y + 11);
      context.lineTo(x + 5, y + 11);
      context.strokeStyle = "#20251f";
      context.lineWidth = 2;
      context.stroke();
    }

    drawDigits(context, text, x, y, size) {
      context.save();
      context.fillStyle = "#20251f";
      context.font = "bold " + size + 'px "Trebuchet MS", sans-serif';
      context.fillText(text, x, y);
      context.restore();
    }
  }

  const app = new CubeWorldApp();
  app.start();
})();
