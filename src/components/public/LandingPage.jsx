import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useClub } from '../../context/ClubContext';
import { Modal } from '../layout/Modal';
import { UserPlus, Info, ShieldCheck, Mail, KeyRound, Briefcase, ChevronDown, Brain, Cpu, Network, Layers, Code2, Zap, Sparkles, Terminal, GitBranch, Database, Eye, Bot } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   CANVAS: CODE RAIN + PARTICLE SYSTEM
   ═══════════════════════════════════════════════════════════════ */
function MatrixCodeRain({ opacity = 0.12 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, columns, drops;

    const chars = 'AXION01αβγδηθλμξπφψωΔΣΩ∇∂∫≈≠∞√∑∏⊗⊕∀∃∈∉∩∪⊂⊃⊆⊇⊥∥∠∡∟⌈⌉⌊⌋ABCDEFGHIJKLMNOPqrstuvwxyz{}[]<>/\\|!@#$%^&*()+-=_~`\'"?:;,.0123456789';

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      columns = Math.floor(w / 16);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = '14px JetBrains Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 16;
        const y = drops[i] * 16;

        // Color gradient: cyan → lavender → emerald
        const hue = 170 + Math.sin(Date.now() * 0.001 + i * 0.1) * 50;
        const alpha = 0.4 + Math.random() * 0.5;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
        ctx.fillText(char, x, y);

        // Lead character glow
        if (Math.random() > 0.95) {
          ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`;
          ctx.shadowBlur = 12;
          ctx.fillStyle = `hsla(${hue}, 100%, 85%, 1)`;
          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;
        }

        if (drops[i] * 16 > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.4 + Math.random() * 0.3;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING PARTICLE SYSTEM (Interactive)
   ═══════════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * (w || window.innerWidth);
        this.y = Math.random() * (h || window.innerHeight);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.hue = 180 + Math.random() * 60;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      update(t) {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.02;
          this.vx += dx * force;
          this.vy += dy * force;
        }

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Wrap
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;

        this.alpha = 0.2 + Math.sin(t * this.pulseSpeed + this.pulsePhase) * 0.3;
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.alpha})`;
        ctx.fill();
      }
    }

    let particles = [];
    const PARTICLE_COUNT = Math.min(120, Math.floor(window.innerWidth / 12));

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    }

    resize();
    window.addEventListener('resize', resize);

    function handleMouse(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', handleMouse);

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      t++;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(t);
        particles[i].draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(190, 60%, 55%, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MORPHING SVG BLOB
   ═══════════════════════════════════════════════════════════════ */
function MorphBlob({ size = 400, color1 = '#06b6d4', color2 = '#8b5cf6', delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{ position: 'absolute', filter: 'blur(60px)', opacity: 0.25, pointerEvents: 'none' }}
      initial={{ rotate: 0, scale: 0.8 }}
      animate={{ rotate: 360, scale: [0.8, 1.1, 0.9, 1.05, 0.8] }}
      transition={{ rotate: { duration: 40, repeat: Infinity, ease: 'linear' }, scale: { duration: 12, repeat: Infinity, ease: 'easeInOut', delay } }}
    >
      <defs>
        <linearGradient id={`blob-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <motion.path
        fill={`url(#blob-grad-${delay})`}
        animate={{
          d: [
            'M45.1,-56.3C57.4,-47.8,65.6,-32.7,69.3,-16.3C73,0.1,72.3,17.9,64.7,31.5C57.1,45.1,42.6,54.5,27.1,60.4C11.6,66.3,-5,68.7,-20.4,64.6C-35.8,60.5,-49.9,50,-58.8,36C-67.6,22,-71.1,4.5,-67.4,-10.9C-63.7,-26.3,-52.8,-39.7,-39.7,-48C-26.7,-56.4,-11.5,-59.7,2.9,-63.2C17.2,-66.7,32.8,-64.8,45.1,-56.3Z',
            'M41.5,-52.2C53.8,-42.1,63.5,-28.8,67.8,-13.7C72.1,1.4,71,18.4,63.7,33.1C56.4,47.8,42.9,60.2,27.4,66.2C11.9,72.1,-5.5,71.6,-22.3,66.5C-39.1,61.5,-55.2,52,-63.2,38.2C-71.2,24.5,-71.1,6.5,-66.2,-9.1C-61.4,-24.7,-51.9,-37.8,-40,-47.6C-28.1,-57.4,-14,-63.8,0.6,-64.5C15.2,-65.3,29.3,-62.3,41.5,-52.2Z',
            'M38.4,-46.8C49.8,-38.2,58.5,-25.3,63,-10.4C67.5,4.5,67.8,21.5,60.1,34.3C52.4,47.2,36.7,56,20.3,60.5C3.8,65.1,-13.4,65.4,-28.5,59.5C-43.5,53.6,-56.4,41.5,-63.4,26.6C-70.4,11.6,-71.6,-6.3,-65.5,-20.8C-59.3,-35.3,-45.8,-46.4,-32.2,-54.4C-18.5,-62.4,-4.7,-67.3,5.8,-74.1C16.2,-80.8,27,-55.3,38.4,-46.8Z',
            'M45.1,-56.3C57.4,-47.8,65.6,-32.7,69.3,-16.3C73,0.1,72.3,17.9,64.7,31.5C57.1,45.1,42.6,54.5,27.1,60.4C11.6,66.3,-5,68.7,-20.4,64.6C-35.8,60.5,-49.9,50,-58.8,36C-67.6,22,-71.1,4.5,-67.4,-10.9C-63.7,-26.3,-52.8,-39.7,-39.7,-48C-26.7,-56.4,-11.5,-59.7,2.9,-63.2C17.2,-66.7,32.8,-64.8,45.1,-56.3Z',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TYPING TEXT EFFECT
   ═══════════════════════════════════════════════════════════════ */
function TypingText({ texts, className, style }) {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(target.substring(0, charIndex + 1));
          if (charIndex + 1 === target.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          } else {
            setCharIndex(charIndex + 1);
          }
        } else {
          setCurrentText(target.substring(0, charIndex));
          if (charIndex === 0) {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          } else {
            setCharIndex(charIndex - 1);
          }
        }
      },
      isDeleting ? 30 : 70
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span className={className} style={style}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ borderRight: '2px solid var(--cyan-accent)', marginLeft: '2px', display: 'inline-block', height: '1em', verticalAlign: 'text-bottom' }}
      />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED SECTION WRAPPER
   ═══════════════════════════════════════════════════════════════ */
function ScrollReveal({ children, direction = 'up', delay = 0, className, style }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const variants = {
    up: { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -80 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1 } },
    rotate: { hidden: { opacity: 0, rotateY: 45, scale: 0.8 }, visible: { opacity: 1, rotateY: 0, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, perspective: '1200px' }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEURAL NETWORK VISUALIZATION
   ═══════════════════════════════════════════════════════════════ */
function NeuralNetViz() {
  const layers = [4, 6, 8, 6, 3];
  const width = 500;
  const height = 300;
  const layerSpacing = width / (layers.length + 1);

  const nodes = [];
  const edges = [];

  layers.forEach((count, li) => {
    const x = (li + 1) * layerSpacing;
    const nodeSpacing = height / (count + 1);
    const layerNodes = [];
    for (let ni = 0; ni < count; ni++) {
      const y = (ni + 1) * nodeSpacing;
      const id = `${li}-${ni}`;
      layerNodes.push({ id, x, y, li, ni });
      nodes.push({ id, x, y, li, ni });
    }
    if (li > 0) {
      const prevLayerNodes = nodes.filter(n => n.li === li - 1);
      layerNodes.forEach(to => {
        prevLayerNodes.forEach(from => {
          edges.push({ from, to, key: `${from.id}-${to.id}` });
        });
      });
    }
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
      {edges.map((edge, i) => (
        <motion.line
          key={edge.key}
          x1={edge.from.x} y1={edge.from.y}
          x2={edge.to.x} y2={edge.to.y}
          stroke="rgba(6,182,212,0.15)"
          strokeWidth={0.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: i * 0.005, ease: 'easeOut' }}
        />
      ))}
      {edges.filter((_, i) => i % 4 === 0).map((edge, i) => (
        <motion.circle
          key={`pulse-${edge.key}`}
          r={1.5}
          fill="#06b6d4"
          initial={{ opacity: 0 }}
          animate={{
            cx: [edge.from.x, edge.to.x],
            cy: [edge.from.y, edge.to.y],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 2,
            delay: (i * 0.03) % 3 + 1,
            repeat: Infinity,
            repeatDelay: (i % 5) * 0.8 + 2,
            ease: 'easeInOut',
          }}
        />
      ))}
      {nodes.map((node, i) => (
        <motion.g key={node.id}>
          <motion.circle
            cx={node.x} cy={node.y}
            r={5}
            fill="rgba(6,182,212,0.3)"
            stroke="rgba(6,182,212,0.6)"
            strokeWidth={1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + node.li * 0.2 + node.ni * 0.05, ease: 'backOut' }}
          />
          {i % 2 === 0 && (
            <motion.circle
              cx={node.x} cy={node.y}
            r={5}
            fill="transparent"
            stroke="rgba(6,182,212,0.4)"
            strokeWidth={1}
            animate={{ r: [5, 12, 5], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, delay: (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          )}
        </motion.g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING TECH ICON
   ═══════════════════════════════════════════════════════════════ */
function FloatingIcon({ icon: Icon, x, y, size = 32, delay = 0 }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x, top: y,
        width: size + 24,
        height: size + 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        background: 'rgba(6,182,212,0.06)',
        border: '1px solid rgba(6,182,212,0.12)',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'none',
      }}
      animate={{
        y: [0, -15, 0, 10, 0],
        rotate: [0, 5, -3, 2, 0],
        opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
      }}
      transition={{
        duration: 8 + delay * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <Icon size={size} strokeWidth={1.2} color="rgba(6,182,212,0.5)" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GLITCH TEXT EFFECT
   ═══════════════════════════════════════════════════════════════ */
function GlitchText({ text, tag: Tag = 'h2', style }) {
  return (
    <Tag style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{ position: 'relative', zIndex: 2 }}>{text}</span>
      <motion.span
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0,
          color: '#06b6d4', opacity: 0.5,
          clipPath: 'inset(0 0 0 0)',
          zIndex: 1,
        }}
        animate={{
          clipPath: [
            'inset(0% 0% 85% 0%)',
            'inset(40% 0% 30% 0%)',
            'inset(80% 0% 0% 0%)',
            'inset(10% 0% 60% 0%)',
            'inset(0% 0% 85% 0%)',
          ],
          x: [-2, 2, -1, 1, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'steps(5)' }}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0,
          color: '#8b5cf6', opacity: 0.4,
          clipPath: 'inset(0 0 0 0)',
          zIndex: 1,
        }}
        animate={{
          clipPath: [
            'inset(80% 0% 0% 0%)',
            'inset(20% 0% 50% 0%)',
            'inset(0% 0% 70% 0%)',
            'inset(60% 0% 10% 0%)',
            'inset(80% 0% 0% 0%)',
          ],
          x: [2, -2, 1, -1, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'steps(5)', delay: 0.1 }}
      >
        {text}
      </motion.span>
    </Tag>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(value, 10);
    const step = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   TERMINAL BLOCK
   ═══════════════════════════════════════════════════════════════ */
function TerminalBlock() {
  const lines = [
    { prompt: true, text: 'axion init --project neural-engine', delay: 0 },
    { prompt: false, text: '⚡ Initializing AXION workspace...', delay: 0.8, color: '#94a3b8' },
    { prompt: false, text: '✓ Loading PyTorch 2.4 + CUDA 12.3', delay: 1.4, color: '#10b981' },
    { prompt: false, text: '✓ Mounting transformers hub v4.41', delay: 2.0, color: '#10b981' },
    { prompt: false, text: '✓ Neural architecture search ready', delay: 2.6, color: '#10b981' },
    { prompt: false, text: '⚡ Compiling inference pipeline...', delay: 3.2, color: '#f59e0b' },
    { prompt: false, text: '🚀 Environment ready. 4 GPUs detected.', delay: 4.0, color: '#06b6d4' },
    { prompt: true, text: 'axion train --model gpt-axion-7b', delay: 5.0 },
    { prompt: false, text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ 72% | ETA: 3h 14m', delay: 5.8, color: '#8b5cf6' },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(6,182,212,0.15)',
      borderRadius: '16px',
      padding: '0',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.78rem',
      lineHeight: 1.8,
      maxWidth: '560px',
      width: '100%',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>
      {/* Title Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f43f5e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '0.7rem' }}>axion@gpu-cluster ~ </span>
      </div>
      {/* Lines */}
      <div style={{ padding: '16px 20px' }}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: line.delay, ease: 'easeOut' }}
          >
            {line.prompt ? (
              <span>
                <span style={{ color: '#10b981' }}>❯</span>{' '}
                <span style={{ color: '#e2e8f0' }}>{line.text}</span>
              </span>
            ) : (
              <span style={{ color: line.color || '#94a3b8' }}> {line.text}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL PROGRESS INDICATOR
   ═══════════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #f59e0b)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 100,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
export function LandingPage() {
  const { data, setIsAdminLoginOpen, submitJoinRequest } = useClub();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    submitJoinRequest({ name: regName, email: regEmail, password: regPassword, department: regDepartment });
    setShowJoinModal(false);
    setRegName(''); setRegEmail(''); setRegPassword(''); setRegDepartment('');
  };

  // Domain/tech cards data
  const techCards = [
    { icon: Brain, title: 'Deep Learning', desc: 'Neural architectures, CNNs, RNNs, Transformers, and attention mechanisms', color: '#06b6d4' },
    { icon: Bot, title: 'Large Language Models', desc: 'GPT, LLaMA, fine-tuning, RLHF, prompt engineering & RAG pipelines', color: '#8b5cf6' },
    { icon: Eye, title: 'Computer Vision', desc: 'Object detection, segmentation, GANs, diffusion models & 3D reconstruction', color: '#10b981' },
    { icon: Cpu, title: 'MLOps & Infra', desc: 'Training pipelines, model serving, Kubernetes, GPU clusters & optimization', color: '#f59e0b' },
    { icon: Network, title: 'Reinforcement Learning', desc: 'Multi-agent systems, policy gradients, game AI & robotics control', color: '#f43f5e' },
    { icon: Database, title: 'Data Engineering', desc: 'Feature stores, streaming pipelines, vector databases & data governance', color: '#0ea5e9' },
  ];

  const stats = [
    { value: '150', suffix: '+', label: 'Active Members' },
    { value: '42', suffix: '', label: 'AI Projects' },
    { value: '200', suffix: '+', label: 'Learning Hours' },
    { value: '15', suffix: '', label: 'Research Papers' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 0%, #0c1426 0%, #020617 50%, #000000 100%)',
      color: '#f8fafc',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <ScrollProgress />
      <MatrixCodeRain opacity={0.08} />
      <ParticleField />

      {/* ═══════ SECTION 1: HERO ═══════ */}
      <motion.section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          padding: '0 24px',
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        {/* Morphing blobs */}
        <MorphBlob size={500} color1="#06b6d4" color2="#0ea5e9" delay={0} />
        <MorphBlob size={400} color1="#8b5cf6" color2="#a855f7" delay={3} />
        <div style={{ position: 'absolute', top: '15%', right: '10%' }}>
          <MorphBlob size={300} color1="#f59e0b" color2="#f43f5e" delay={6} />
        </div>

        {/* Floating tech icons */}
        <FloatingIcon icon={Brain} x="8%" y="15%" size={28} delay={0} />
        <FloatingIcon icon={Cpu} x="85%" y="20%" size={24} delay={1} />
        <FloatingIcon icon={Code2} x="12%" y="70%" size={22} delay={2} />
        <FloatingIcon icon={Terminal} x="80%" y="65%" size={26} delay={3} />
        <FloatingIcon icon={GitBranch} x="50%" y="10%" size={20} delay={1.5} />
        <FloatingIcon icon={Layers} x="90%" y="45%" size={24} delay={4} />
        <FloatingIcon icon={Network} x="5%" y="45%" size={26} delay={2.5} />

        {/* Logo + Title */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', zIndex: 20, position: 'relative' }}
        >
          {/* Logo */}
          <motion.div
            style={{ position: 'relative', display: 'inline-block', marginBottom: '32px' }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={data.branding.logoUrl || '/axion_logo.jpg'}
              alt="AXION Logo"
              style={{
                width: '130px', height: '130px',
                borderRadius: '50%', objectFit: 'cover',
                boxShadow: '0 0 60px rgba(6,182,212,0.35), 0 0 120px rgba(6,182,212,0.1)',
                border: '2px solid rgba(6,182,212,0.2)',
              }}
            />
            {/* Orbiting ring 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-16px',
                borderRadius: '50%', border: '1px dashed rgba(6,182,212,0.25)',
                pointerEvents: 'none',
              }}
            />
            {/* Orbiting ring 2 */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-30px',
                borderRadius: '50%', border: '1px dashed rgba(139,92,246,0.15)',
                pointerEvents: 'none',
              }}
            />
            {/* Orbiting dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: '-16px', pointerEvents: 'none' }}
            >
              <div style={{
                width: '8px', height: '8px',
                background: '#06b6d4',
                borderRadius: '50%',
                position: 'absolute', top: '0', left: '50%',
                transform: 'translateX(-50%)',
                boxShadow: '0 0 10px #06b6d4',
              }} />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlitchText
              text={data.branding.clubName}
              tag="h1"
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                fontWeight: 900,
                letterSpacing: '-0.06em',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 40%, #8b5cf6 70%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
              }}
            />
          </motion.div>

          {/* Subtitle with typing effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: '20px', fontSize: '1.15rem', color: '#94a3b8', maxWidth: '650px', margin: '20px auto 0' }}
          >
            <span style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>{'> '}</span>
            <TypingText
              texts={[
                'Pioneering artificial intelligence research.',
                'Building next-gen neural architectures.',
                'Exploring the frontiers of machine learning.',
                'Training transformers on custom datasets.',
                'Deploying AI at scale with cutting-edge infra.',
              ]}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.95rem', color: '#cbd5e1' }}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 15px 40px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowJoinModal(true)}
              style={{
                padding: '16px 44px',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #06b6d4, #0ea5e9, #2563eb)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(6,182,212,0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <Sparkles size={18} />
              <span style={{ position: 'relative', zIndex: 2 }}>Join AXION</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAboutModal(true)}
              style={{
                padding: '16px 44px',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Info size={18} />
              Explore More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          style={{
            position: 'absolute', bottom: '40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={20} color="#475569" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════ SECTION 2: STATS COUNTER ═══════ */}
      <section style={{
        padding: '100px 24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <ScrollReveal direction="up">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {stats.map((stat, i) => (
              <ScrollReveal key={i} direction="scale" delay={i * 0.15}>
                <div style={{
                  textAlign: 'center',
                  padding: '36px 24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(6,182,212,0.1)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(12px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Glow accent */}
                  <div style={{
                    position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
                    width: '80px', height: '80px',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    fontSize: '2.8rem', fontWeight: 900,
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                  }}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════ SECTION 3: WHAT WE DO — TECH CARDS ═══════ */}
      <section style={{
        padding: '80px 24px 120px',
        position: 'relative',
        zIndex: 10,
      }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.15)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#06b6d4',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Research Domains
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px',
            }}>
              What We Build
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Our members work across the full spectrum of AI — from theoretical research to production systems.
            </p>
          </div>
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {techCards.map((card, i) => (
            <ScrollReveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02, borderColor: `${card.color}33` }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: '32px 28px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(12px)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: '-30px', right: '-30px',
                  width: '100px', height: '100px',
                  background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '14px',
                  background: `${card.color}12`,
                  border: `1px solid ${card.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <card.icon size={24} color={card.color} strokeWidth={1.5} />
                </div>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  marginBottom: '10px',
                  letterSpacing: '-0.02em',
                }}>{card.title}</h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                }}>{card.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════ SECTION 4: NEURAL NET + TERMINAL ═══════ */}
      <section style={{
        padding: '80px 24px 120px',
        position: 'relative',
        zIndex: 10,
      }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.15)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#8b5cf6',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Under The Hood
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px',
            }}>
              The AXION Engine
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Visualizing the neural pathways that power our research infrastructure.
            </p>
          </div>
        </ScrollReveal>

        <div style={{
          display: 'flex',
          gap: '40px',
          maxWidth: '1100px',
          margin: '0 auto',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <ScrollReveal direction="left" delay={0.2}>
            <div style={{
              padding: '40px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(6,182,212,0.1)',
              borderRadius: '24px',
              backdropFilter: 'blur(8px)',
              minWidth: '320px',
            }}>
              <NeuralNetViz />
              <p style={{
                textAlign: 'center', marginTop: '20px',
                fontSize: '0.8rem', color: '#475569',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                model.layers: [4, 6, 8, 6, 3] — real-time inference
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.4}>
            <TerminalBlock />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ SECTION 5: JOIN CTA ═══════ */}
      <section style={{
        padding: '120px 24px 80px',
        position: 'relative',
        zIndex: 10,
      }}>
        <ScrollReveal direction="scale">
          <div style={{
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto',
            padding: '64px 40px',
            background: 'rgba(6,182,212,0.04)',
            border: '1px solid rgba(6,182,212,0.12)',
            borderRadius: '32px',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background glow */}
            <motion.div
              animate={{
                background: [
                  'radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.12) 0%, transparent 70%)',
                  'radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)',
                  'radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.12) 0%, transparent 70%)',
                ],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            />

            <Zap size={40} color="#f59e0b" style={{ marginBottom: '20px' }} />
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#f8fafc',
              marginBottom: '16px',
            }}>
              Ready to Shape the Future?
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '500px',
              margin: '0 auto 36px',
            }}>
              Join a community of builders, researchers, and engineers pushing the boundaxion of what's possible with AI.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(6,182,212,0.35)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowJoinModal(true)}
              style={{
                padding: '18px 52px',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #06b6d4, #0ea5e9, #2563eb)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 12px 35px rgba(6,182,212,0.3)',
              }}
            >
              <UserPlus size={20} />
              Apply Now
            </motion.button>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{
        padding: '40px 24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <motion.button
          whileHover={{ color: '#94a3b8' }}
          onClick={() => setIsAdminLoginOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#334155',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={14} />
          Sign In
        </motion.button>
        <p style={{ color: '#1e293b', fontSize: '0.75rem', marginTop: '12px' }}>
          © {new Date().getFullYear()} {data.branding.clubName} — {data.branding.tagline}
        </p>
      </footer>

      {/* ═══════ JOIN MODAL ═══════ */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Apply to Join"
        subtitle="Submit a request to become a member of AXION."
      >
        <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="form-input"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="maya@student.edu"
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Create Password *</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                minLength={4}
              />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              You will use this password to log in after your request is approved.
            </span>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department / Track</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
                placeholder="e.g. Computer Vision"
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Submit Join Request
          </button>
        </form>
      </Modal>

      {/* ═══════ ABOUT MODAL ═══════ */}
      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About Us"
        subtitle="Learn more about our mission and club."
      >
        <div style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            {data.cmsPages?.about?.heading}
          </h3>
          <p style={{ marginBottom: '20px' }}>
            {data.cmsPages?.about?.narrative}
          </p>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Our Mission</h4>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(data.cmsPages?.mission?.points || []).map((pt, i) => (
              <li key={i}>
                <strong>{pt.title}:</strong> {pt.desc}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
