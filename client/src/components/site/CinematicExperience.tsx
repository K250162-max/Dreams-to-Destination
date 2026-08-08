import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function CinematicLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const alreadyShown =
      sessionStorage.getItem("d2d-cinematic-loader") === "shown";

    if (reducedMotion || alreadyShown) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const startedAt = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const elapsed = time - startedAt;
      const value = Math.min(
        100,
        Math.round((elapsed / 1550) * 100)
      );

      setProgress(value);

      if (value < 100) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      sessionStorage.setItem("d2d-cinematic-loader", "shown");
    }, 1900);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="status"
          aria-label="Loading cinematic experience"
        >
          <div className="loader-space">
            <span />
            <i />
            <b />
          </div>

          <motion.div
            className="loader-route"
            initial={{ scale: 0.78, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="loader-orbit">
              <span />
            </div>

            <strong>D</strong>
            <em>→</em>
            <strong>D</strong>
          </motion.div>

          <p>Mapping your next destination</p>

          <div className="loader-progress">
            <span style={{ width: `${progress}%` }} />
          </div>

          <small>
            {progress.toString().padStart(2, "0")} · INITIALIZING GLOBAL ROUTES
          </small>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/*
|--------------------------------------------------------------------------
| Magnetic Buttons
|--------------------------------------------------------------------------
|
| Adds a subtle magnetic movement to selected buttons.
| The normal browser cursor remains enabled.
|
*/

function MagneticInteractions() {
  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const selector =
      ".primary-button, .nav-cta, .outline-button, .text-button, .hero-text-link";

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );

    const cleanups = elements.map((element) => {
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        element.style.translate = `${x * 0.13}px ${y * 0.13}px`;
      };

      const leave = () => {
        element.style.translate = "0 0";
      };

      const ripple = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();

        const node = document.createElement("span");

        node.className = "magnetic-ripple";

        node.style.left = `${event.clientX - rect.left}px`;
        node.style.top = `${event.clientY - rect.top}px`;

        element.appendChild(node);

        window.setTimeout(() => {
          node.remove();
        }, 750);
      };

      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", leave);
      element.addEventListener("pointerdown", ripple);

      return () => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", leave);
        element.removeEventListener("pointerdown", ripple);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}


/*
|--------------------------------------------------------------------------
| Ambient Sound
|--------------------------------------------------------------------------
*/

function AmbientSoundControl() {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(true);

  const audioRef = useRef<{
    context: AudioContext;
    master: GainNode;
    sources: AudioScheduledSourceNode[];
  } | null>(null);

  const start = async () => {
    const AudioContextClass = window.AudioContext;

    if (!AudioContextClass) {
      setSupported(false);
      return;
    }

    try {
      const context = new AudioContextClass();

      await context.resume();

      const master = context.createGain();

      master.gain.setValueAtTime(
        0.0001,
        context.currentTime
      );

      master.gain.exponentialRampToValueAtTime(
        0.028,
        context.currentTime + 1.4
      );

      master.connect(context.destination);

      const filter = context.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.value = 310;
      filter.Q.value = 0.75;

      filter.connect(master);

      const oscillatorA = context.createOscillator();

      oscillatorA.type = "sine";
      oscillatorA.frequency.value = 55;

      const oscillatorB = context.createOscillator();

      oscillatorB.type = "sine";
      oscillatorB.frequency.value = 82.5;

      const oscillatorGain = context.createGain();

      oscillatorGain.gain.value = 0.16;

      oscillatorA.connect(oscillatorGain);
      oscillatorB.connect(oscillatorGain);

      oscillatorGain.connect(filter);

      const noiseBuffer = context.createBuffer(
        1,
        context.sampleRate * 2,
        context.sampleRate
      );

      const noise = noiseBuffer.getChannelData(0);

      for (let index = 0; index < noise.length; index += 1) {
        noise[index] =
          (Math.random() * 2 - 1) * 0.22;
      }

      const noiseSource =
        context.createBufferSource();

      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseGain = context.createGain();

      noiseGain.gain.value = 0.12;

      noiseSource.connect(noiseGain);
      noiseGain.connect(filter);

      oscillatorA.start();
      oscillatorB.start();
      noiseSource.start();

      audioRef.current = {
        context,
        master,
        sources: [
          oscillatorA,
          oscillatorB,
          noiseSource,
        ],
      };

      setEnabled(true);
    } catch {
      setSupported(false);
    }
  };

  const stop = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.master.gain.cancelScheduledValues(
      audio.context.currentTime
    );

    audio.master.gain.setValueAtTime(
      Math.max(audio.master.gain.value, 0.0001),
      audio.context.currentTime
    );

    audio.master.gain.exponentialRampToValueAtTime(
      0.0001,
      audio.context.currentTime + 0.35
    );

    window.setTimeout(() => {
      audio.sources.forEach((source) => {
        try {
          source.stop();
        } catch {
          // Source may already be stopped.
        }
      });

      void audio.context.close();
    }, 390);

    audioRef.current = null;

    setEnabled(false);
  };

  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      audio?.sources.forEach((source) => {
        try {
          source.stop();
        } catch {
          // Source may already be stopped.
        }
      });

      if (audio) {
        void audio.context.close();
      }
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;

      if (!audio) return;

      if (document.hidden) {
        void audio.context.suspend();
      } else {
        void audio.context.resume();
      }
    };

    document.addEventListener(
      "visibilitychange",
      onVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        onVisibility
      );
    };
  }, []);

  if (!supported) {
    return null;
  }

  return (
    <button
      className={`ambient-control${
        enabled ? " ambient-control--active" : ""
      }`}
      type="button"
      onClick={() =>
        enabled ? stop() : void start()
      }
      aria-pressed={enabled}
      aria-label={
        enabled
          ? "Turn ambient sound off"
          : "Turn ambient sound on"
      }
    >
      <span>
        {enabled ? (
          <Volume2 size={16} />
        ) : (
          <VolumeX size={16} />
        )}
      </span>

      <small>Ambient</small>

      {enabled && <AudioLines size={14} />}
    </button>
  );
}


/*
|--------------------------------------------------------------------------
| Motion Visibility Controller
|--------------------------------------------------------------------------
*/

function MotionVisibilityController() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".hero-section, .journey-marquee, .section, .scene-portal, .site-footer"
      )
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "motion-paused",
            !entry.isIntersecting
          );
        });
      },
      {
        rootMargin: "180px 0px",
        threshold: 0.01,
      }
    );

    targets.forEach((target) => {
      observer.observe(target);
    });

    const onVisibility = () => {
      document.documentElement.classList.toggle(
        "page-hidden",
        document.hidden
      );
    };

    document.addEventListener(
      "visibilitychange",
      onVisibility
    );

    onVisibility();

    return () => {
      observer.disconnect();

      document.removeEventListener(
        "visibilitychange",
        onVisibility
      );

      document.documentElement.classList.remove(
        "page-hidden"
      );

      targets.forEach((target) => {
        target.classList.remove("motion-paused");
      });
    };
  }, []);

  return null;
}


/*
|--------------------------------------------------------------------------
| Cinematic Experience
|--------------------------------------------------------------------------
*/

export function CinematicExperience() {
  return (
    <>
      <CinematicLoader />

      {/* Custom cinematic cursor REMOVED.
          Normal browser cursor is now used. */}

      <MagneticInteractions />

      <AmbientSoundControl />

      <MotionVisibilityController />
    </>
  );
}