"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import {
  SEGS,
  ROUTE,
  STEP,
  buildMark,
  idxAt,
  lengthAtPhase,
  clamp,
  smoothstep,
  type Mark,
  type Pt,
} from "@/lib/signature-mark";

/**
 * The signature hero: ink particles assemble a quill, the quill writes the
 * monogram in one unbroken stroke, then disintegrates into the dots that
 * settle as the wordmark. Plays on EVERY page load (Isaac's call — this is
 * the site's introduction); tap/scroll/key skips; prefers-reduced-motion
 * renders the finished frame with no animation. A scroll cue fades in once
 * the wordmark settles.
 *
 * Server-rendered markup is the complete FINAL state (wordmark, tagline h1,
 * rule visible) so no-JS visitors and search engines always get the content;
 * the effect only dims it when a play is actually about to start.
 */

// Timeline (ms): assemble · settle · write · descend/dissolve · letters land
const T_ASM = 1650;
const T_SETTLE = 140;
const T_WRITE = 2300;
const T_DESC = 1750;
const WS = T_ASM + T_SETTLE;
const WE = WS + T_WRITE;
const DUR = WE + T_DESC + 1550;
const EMIT_FROM = 0.2;
const EMIT_TO = 0.74;
const FLIGHT = 980;
const LAND_FRAC = 0.6;

// quill.png design space: 560×470, nib tip at (31,442)
const QNX = 31;
const QNY = 442;

const easeIO = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const f1 = (v: number) => Math.round(v * 10) / 10;

type Particle = {
  lx: number; ly: number; r: number; g: number; b: number; a: number;
  aStart: number; aDur: number;
  origDx: number; origDy: number; origBow: number;
  t0: number; lands: boolean;
  tgt: { el: HTMLSpanElement; x: number; y: number } | null;
  from: Pt | null;
  dur: number; bow: number; driftA: number; driftD: number; sz: number;
};

export default function HeroSignature() {
  const bandRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLHeadingElement>(null);
  const [state, setState] = useState<"static" | "playing" | "done">("static");

  useEffect(() => {
    const band = bandRef.current, inkc = inkRef.current, fxc = fxRef.current;
    const ruleEl = ruleRef.current, nameEl = nameRef.current, tagEl = tagRef.current;
    if (!band || !inkc || !fxc || !ruleEl || !nameEl || !tagEl) return;
    const inkg = inkc.getContext("2d");
    const fxg = fxc.getContext("2d");
    if (!inkg || !fxg) return;

    let disposed = false;
    let raf = 0;
    let mark: Mark | null = null;
    let particles: Particle[] | null = null;

    // ---- brand colors from the design tokens ----
    const css = getComputedStyle(document.documentElement);
    const inkColor = (css.getPropertyValue("--color-paper-on-dark") || "#ede9e0").trim();
    const inkRgb = (() => {
      const h = inkColor.replace("#", "");
      const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
      const v = parseInt(x, 16);
      return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
    })();

    // ---- layout (recomputed on resize; all stage coords are band px) ----
    let SW = 0, SH = 0, MSf = 0, MX = 0, MY = 0, QS = 0, CS = 1;
    let RULE_Y = 0, NAME_Y = 0, TAG_Y = 0;
    let FIRST_S: Pt = { x: 0, y: 0 }, END_S: Pt = { x: 0, y: 0 };
    let ASM_FROM: Pt = { x: 0, y: 0 }, ASM_CTRL: Pt = { x: 0, y: 0 };
    let DESC: Pt[] = [];
    const toStage = (p: Pt): Pt => ({ x: MX + p.x * MSf, y: MY + p.y * MSf });
    const letters = () =>
      Array.from(nameEl.querySelectorAll<HTMLSpanElement>("span[data-ch]"));

    function layout() {
      const box = band!.getBoundingClientRect();
      SW = box.width;
      SH = box.height;
      const dpr = window.devicePixelRatio || 1;
      // The ink is one filled outline per frame, so native resolution gets
      // full-quality antialiasing from the single fill — no supersampling
      // needed. The particle canvas is transient dust, same treatment.
      const inkScale = Math.min(dpr, 3);
      const fxScale = Math.min(dpr, 3);
      for (const [c, s] of [
        [inkc!, inkScale],
        [fxc!, fxScale],
      ] as const) {
        c.width = Math.round(SW * s);
        c.height = Math.round(SH * s);
        c.style.width = `${SW}px`;
        c.style.height = `${SH}px`;
      }
      inkg!.setTransform(inkScale, 0, 0, inkScale, 0, 0);
      fxg!.setTransform(fxScale, 0, 0, fxScale, 0, 0);

      const portrait = SW / SH < 1;
      MSf = portrait
        ? (SW * 0.86) / 1200
        : Math.min((SH * 0.62) / 1000, (SW * 0.45) / 1200);
      CS = clamp(SW / 1440, 0.45, 1);

      // Fit the wordmark: measure the actual glyph run (first letter's left
      // to last letter's right) — offsetWidth is just the container and
      // scrollWidth cannot see overflow LEFT of a centered flex row.
      let nf = portrait ? 30 : 38;
      nameEl!.style.fontSize = `${nf}px`;
      const sp = letters();
      if (sp.length > 1) {
        const w =
          sp[sp.length - 1].getBoundingClientRect().right -
          sp[0].getBoundingClientRect().left;
        const target = SW * 0.9;
        if (w > target) {
          nf = Math.max(12, (nf * target) / w);
          nameEl!.style.fontSize = `${nf}px`;
        }
      }
      tagEl!.style.fontSize = `${Math.max(11, Math.round(nf * 0.5))}px`;

      const markH = 1000 * MSf;
      const nameH = nf * 1.35;
      const tagH = parseFloat(tagEl!.style.fontSize) * 1.4;
      const gap1 = Math.max(14, markH * 0.03);
      const totalH = markH * 0.93 + gap1 + 1 + 12 + nameH + 10 + tagH;
      // Optical centering: give the block 40% of the free space above and 60%
      // below (true centering reads low, and the glyph's design space carries
      // extra empty room at its top edge that pushes the ink down further).
      MY = Math.max(8, (SH - totalH) * 0.4 - markH * 0.02);
      MX = (SW - 1200 * MSf) / 2;
      RULE_Y = MY + markH * 0.93 + gap1;
      NAME_Y = RULE_Y + 1 + 12;
      TAG_Y = NAME_Y + nameH + 10;
      ruleEl!.style.top = `${f1(RULE_Y)}px`;
      nameEl!.style.top = `${f1(NAME_Y)}px`;
      tagEl!.style.top = `${f1(TAG_Y)}px`;

      QS = 0.8 * MSf;
      if (mark) {
        FIRST_S = toStage(mark.P[0]);
        END_S = toStage(mark.P[mark.n - 1]);
        ASM_FROM = { x: FIRST_S.x + 380 * CS, y: FIRST_S.y - 300 * CS };
        ASM_CTRL = { x: FIRST_S.x + 90 * CS, y: FIRST_S.y - 270 * CS };
        DESC = [
          { x: END_S.x, y: END_S.y },
          { x: END_S.x - 70 * CS, y: END_S.y + 130 * CS },
          { x: SW * 0.39, y: NAME_Y + 64 * CS },
          { x: SW * 0.7, y: NAME_Y + 18 * CS },
        ];
      }
      inkg!.clearRect(0, 0, SW, SH);
      if (mark) buildEdges();
    }

    // ---- sample the traced monogram (needs a live SVG for arc-length) ----
    function sampleMark(): Mark {
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
      document.body.appendChild(svg);
      const raw: Pt[] = [];
      ROUTE.forEach((step, k) => {
        const p = document.createElementNS(ns, "path");
        p.setAttribute("d", SEGS[step.seg]);
        svg.appendChild(p);
        const len = p.getTotalLength();
        const cnt = Math.max(2, Math.ceil(len / STEP));
        for (let j = k === 0 ? 0 : 1; j <= cnt; j++) {
          const u = j / cnt;
          const q = p.getPointAtLength(len * (step.rev ? 1 - u : u));
          raw.push({ x: q.x, y: q.y });
        }
      });
      svg.remove();
      return buildMark(raw);
    }

    // ---- ink as ONE filled outline ----------------------------------------
    // The stroke's left/right edges are offset polylines from the centerline;
    // the ribbon up to arc length L is a single closed path filled once per
    // frame. One fill = one clean antialiased boundary — a stroke assembled
    // from stamped discs has a scalloped union edge and its overdraw
    // saturates AA fringes into visible stairsteps, which is exactly what
    // this replaced. Sub-pixel tapers render faint automatically: that IS
    // antialiasing doing the alpha ramp for us.
    let EL: Pt[] = [], ER: Pt[] = [], SP: Pt[] = [];
    let fullPath: Path2D | null = null;
    let inkDrawnFull = false;
    function buildEdges() {
      const m = mark!;
      EL = []; ER = []; SP = [];
      for (let i = 0; i < m.n; i++) {
        const p = toStage(m.P[i]);
        const h = (m.W[i] / 2) * MSf;
        const dx = Math.cos(m.TH[i]), dy = Math.sin(m.TH[i]);
        SP.push(p);
        EL.push({ x: p.x - dy * h, y: p.y + dx * h });
        ER.push({ x: p.x + dy * h, y: p.y - dx * h });
      }
      fullPath = ribbonPath(m.total);
      inkDrawnFull = false;
    }
    function ribbonPath(L: number): Path2D {
      const m = mark!;
      L = clamp(L, 0, m.total);
      const i = idxAt(m, L);
      const j = Math.min(m.n - 1, i + 1);
      const seg = Math.max(1e-6, m.S[j] - m.S[i]);
      const t = clamp((L - m.S[i]) / seg, 0, 1);
      const lp = (a: Pt, b: Pt): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      const tipL = lp(EL[i], EL[j]);
      const tipC = lp(SP[i], SP[j]);
      const tipW = (m.W[i] + (m.W[j] - m.W[i]) * t) * MSf;
      const th = m.TH[i];
      const path = new Path2D();
      path.moveTo(EL[0].x, EL[0].y);
      for (let k = 1; k <= i; k++) path.lineTo(EL[k].x, EL[k].y);
      path.lineTo(tipL.x, tipL.y);
      // round cap on the moving tip, swept across the direction of travel
      path.arc(tipC.x, tipC.y, Math.max(tipW / 2, 0.05), th + Math.PI / 2, th - Math.PI / 2, true);
      for (let k = i; k >= 0; k--) path.lineTo(ER[k].x, ER[k].y);
      // round cap on the entry too — the original monogram's strokes stop at
      // full width with rounded ends; a flat closure reads as a cut tube
      const th0 = m.TH[0];
      path.arc(
        SP[0].x,
        SP[0].y,
        Math.max((m.W[0] / 2) * MSf, 0.05),
        th0 - Math.PI / 2,
        th0 + Math.PI / 2,
        true
      );
      path.closePath();
      return path;
    }
    function drawInk(L: number | "full") {
      inkg!.clearRect(0, 0, SW, SH);
      inkg!.fillStyle = inkColor;
      inkg!.fill(L === "full" ? fullPath! : ribbonPath(L));
    }

    // ---- pen pose over the timeline ----
    const qbez = (a: Pt, b: Pt, c: Pt, t: number): Pt => {
      const m = 1 - t;
      return {
        x: m * m * a.x + 2 * m * t * b.x + t * t * c.x,
        y: m * m * a.y + 2 * m * t * b.y + t * t * c.y,
      };
    };
    const cubic = (P: Pt[], t: number): Pt => {
      const m = 1 - t, a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
      return {
        x: a * P[0].x + b * P[1].x + c * P[2].x + d * P[3].x,
        y: a * P[0].y + b * P[1].y + c * P[2].y + d * P[3].y,
      };
    };
    const tiltFor = (i: number) => {
      const m = mark!;
      const ux = Math.cos(m.TH[i]), uy = Math.sin(m.TH[i]);
      return clamp(6.5 * (0.82 * uy + 0.34 * ux), -6.5, 6.5);
    };

    function posePen(t: number): { x: number; y: number; rot: number; L?: number; desc?: number } {
      const m = mark!;
      if (t < T_ASM) {
        const u = easeIO(clamp(t / T_ASM, 0, 1));
        const p = qbez(ASM_FROM, ASM_CTRL, FIRST_S, u);
        return { x: p.x, y: p.y, rot: -20 + (tiltFor(0) + 20) * u };
      }
      if (t < WS) {
        const u = (t - T_ASM) / T_SETTLE;
        return { x: FIRST_S.x, y: FIRST_S.y + 1.8 * Math.sin(Math.PI * u), rot: tiltFor(0) };
      }
      if (t < WE) {
        const raw = clamp((t - WS) / T_WRITE, 0, 1);
        const u = 0.35 * raw + 0.65 * smoothstep(raw);
        const L = lengthAtPhase(m, u);
        const i = idxAt(m, L);
        const j = Math.min(m.n - 1, i + 1);
        const seg = Math.max(1e-6, m.S[j] - m.S[i]);
        const k = clamp((L - m.S[i]) / seg, 0, 1);
        const nb = toStage({
          x: m.P[i].x + (m.P[j].x - m.P[i].x) * k,
          y: m.P[i].y + (m.P[j].y - m.P[i].y) * k,
        });
        const bob = Math.sin(u * Math.PI * 4.3) * 1.15;
        return { x: nb.x, y: nb.y, rot: tiltFor(i) + bob, L };
      }
      const raw = clamp((t - WE) / T_DESC, 0, 1);
      const p = cubic(DESC, easeIO(raw));
      return { x: p.x, y: p.y, rot: -4 - 7 * easeIO(raw), desc: raw };
    }

    // ---- particles from the quill's own pixels ----
    async function buildParticles() {
      const img = new Image();
      img.src = "/brand/quill.png";
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const { data } = g.getImageData(0, 0, c.width, c.height);
      const sx = c.width / 560, sy = c.height / 470;
      const G = SW < 600 ? 4 : 3;
      const pts: Array<{ lx: number; ly: number; r: number; g: number; b: number; a: number; key: number }> = [];
      for (let y = 0; y < 470; y += G)
        for (let x = 0; x < 560; x += G) {
          const px = Math.min(c.width - 1, Math.round(x * sx));
          const py = Math.min(c.height - 1, Math.round(y * sy));
          const i = (py * c.width + px) * 4;
          if (data[i + 3] < 60) continue;
          pts.push({
            lx: x, ly: y,
            r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] / 255,
            key: 1 - y / 470 + (Math.random() - 0.5) * 0.14,
          });
        }
      // Erosion is nib-first, so assembly (its time-reverse) completes at the
      // tip exactly as the pen lands.
      pts.sort((a, b) => a.key - b.key);
      const n = pts.length;

      const bandBox = band!.getBoundingClientRect();
      const live = letters().filter((s) => s.getBoundingClientRect().width >= 2);
      const boxes = live.map((s) => {
        const b = s.getBoundingClientRect();
        return { el: s, x: b.left - bandBox.left, y: b.top - bandBox.top, w: b.width, h: b.height };
      });

      particles = pts.map((p, i) => {
        const f = i / (n - 1);
        const aDur = 650 + Math.random() * 350;
        const ang = Math.random() * Math.PI * 2;
        const dist = (180 + Math.random() * 420) * CS;
        const t0 = EMIT_FROM + (EMIT_TO - EMIT_FROM) * f;
        const lands = i % 5 < Math.round(LAND_FRAC * 5);
        let tgt: Particle["tgt"] = null;
        if (lands && boxes.length) {
          const bx = boxes[Math.min(boxes.length - 1, Math.floor(f * boxes.length))];
          tgt = { el: bx.el, x: bx.x + Math.random() * bx.w, y: bx.y + Math.random() * bx.h };
        }
        return {
          lx: p.lx, ly: p.ly, r: p.r, g: p.g, b: p.b, a: p.a,
          aStart: (1 - f) * (T_ASM - aDur - 60) * (0.92 + Math.random() * 0.08),
          aDur,
          origDx: Math.cos(ang) * dist + 170 * CS,
          origDy: Math.sin(ang) * dist - 230 * CS,
          origBow: Math.random() - 0.5,
          t0, lands, tgt, from: null,
          dur: FLIGHT * (0.72 + Math.random() * 0.62),
          bow: Math.random() - 0.5,
          driftA: Math.random() * Math.PI * 2,
          driftD: (70 + Math.random() * 230) * CS,
          sz: (1.7 + Math.random() * 1.4) * Math.max(0.75, CS),
        };
      });
    }

    const attached = (pose: Pt, p: Particle, co: number, si: number): Pt => {
      const ox = (p.lx - QNX) * QS, oy = (p.ly - QNY) * QS;
      return { x: pose.x + ox * co - oy * si, y: pose.y + ox * si + oy * co };
    };

    const progress = new Map<HTMLSpanElement, number>();

    function frame(t: number) {
      fxg!.clearRect(0, 0, SW, SH);
      const pose = posePen(t);
      const rad = (pose.rot * Math.PI) / 180;
      const co = Math.cos(rad), si = Math.sin(rad);

      if (t >= WS && t < WE) {
        drawInk(pose.L!);
        inkDrawnFull = false;
      } else if (t >= WE) {
        if (!inkDrawnFull) {
          drawInk("full");
          inkDrawnFull = true;
        }
      } else {
        inkg!.clearRect(0, 0, SW, SH);
        inkDrawnFull = false;
      }

      const td = t - WE;
      if (td > 0) {
        const r = easeIO(clamp((td - 420) / 560, 0, 1));
        const rw = Math.min(84, SW * 0.2);
        ruleEl!.style.opacity = "1";
        ruleEl!.style.width = `${f1(rw * r)}px`;
        ruleEl!.style.marginLeft = `${f1((-rw / 2) * r)}px`;
      }
      progress.clear();

      const desc = pose.desc ?? -1;
      for (const p of particles!) {
        let x: number, y: number, alpha = p.a, cr = p.r, cg = p.g, cb = p.b, sz = p.sz;
        if (desc < 0) {
          if (t >= p.aStart + p.aDur) {
            const q = attached(pose, p, co, si);
            x = q.x; y = q.y;
          } else if (t > p.aStart) {
            const q = clamp((t - p.aStart) / p.aDur, 0, 1);
            const e = easeIO(q), mm = 1 - e;
            const tg = attached(pose, p, co, si);
            const ox = tg.x + p.origDx, oy = tg.y + p.origDy;
            const dx = tg.x - ox, dy = tg.y - oy;
            const L = Math.hypot(dx, dy) || 1;
            const bw = p.origBow * Math.min(140 * CS, L * 0.5);
            const cx = (ox + tg.x) / 2 + (-dy / L) * bw;
            const cy = (oy + tg.y) / 2 + (dx / L) * bw;
            x = mm * mm * ox + 2 * mm * e * cx + e * e * tg.x;
            y = mm * mm * oy + 2 * mm * e * cy + e * e * tg.y;
            alpha = p.a * clamp(q / 0.14, 0, 1);
          } else continue;
        } else if (desc <= p.t0) {
          const q = attached(pose, p, co, si);
          x = q.x; y = q.y;
        } else {
          if (!p.from) {
            const u0 = easeIO(p.t0);
            const pp = cubic(DESC, u0);
            const rr = ((-4 - 7 * u0) * Math.PI) / 180;
            p.from = attached(pp, p, Math.cos(rr), Math.sin(rr));
          }
          const q = clamp((td - p.t0 * T_DESC) / p.dur, 0, 1);
          const e = easeIO(q), mm = 1 - e;
          if (p.lands && p.tgt) {
            const dx = p.tgt.x - p.from.x, dy = p.tgt.y - p.from.y;
            const L = Math.hypot(dx, dy) || 1;
            const bw = p.bow * Math.min(150 * CS, L * 0.5);
            const cx = (p.from.x + p.tgt.x) / 2 + (-dy / L) * bw;
            const cy = (p.from.y + p.tgt.y) / 2 + (dx / L) * bw - 24 * CS;
            x = mm * mm * p.from.x + 2 * mm * e * cx + e * e * p.tgt.x;
            y = mm * mm * p.from.y + 2 * mm * e * cy + e * e * p.tgt.y;
            cr = p.r + (inkRgb.r - p.r) * e;
            cg = p.g + (inkRgb.g - p.g) * e;
            cb = p.b + (inkRgb.b - p.b) * e;
            // Gone by 86% of the flight, while still moving — a dot that fades
            // at 100% parks on the letter at zero velocity, and a thousand of
            // them parking together reads as a hard stop.
            alpha = p.a * (q > 0.58 ? clamp((0.86 - q) / 0.28, 0, 1) : 1);
            const prev = progress.get(p.tgt.el) ?? 0;
            if (q > prev) progress.set(p.tgt.el, q);
          } else {
            const d = p.driftD * e;
            x = p.from.x + Math.cos(p.driftA) * d;
            y = p.from.y + Math.sin(p.driftA) * d - 40 * CS * e;
            alpha = p.a * clamp(1 - q * 1.25, 0, 1);
            sz = p.sz * (1 - 0.35 * e);
          }
        }
        if (alpha <= 0.01) continue;
        fxg!.globalAlpha = alpha;
        fxg!.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
        fxg!.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
      fxg!.globalAlpha = 1;

      for (const s of letters()) {
        const q = progress.get(s) ?? 0;
        s.style.opacity = String(easeOut(clamp((q - 0.55) / 0.45, 0, 1)));
      }
      tagEl!.style.opacity = String(easeOut(clamp((td - T_DESC - 680) / 800, 0, 1)));
    }

    // ---- finished state (also the reduced-motion / repeat-visit render) ----
    function showFinal() {
      if (!mark) mark = sampleMark();
      layout();
      drawInk("full");
      inkDrawnFull = true;
      fxg!.clearRect(0, 0, SW, SH);
      for (const s of letters()) s.style.opacity = "1";
      tagEl!.style.opacity = "1";
      const rw = Math.min(84, SW * 0.2);
      ruleEl!.style.opacity = "1";
      ruleEl!.style.width = `${f1(rw)}px`;
      ruleEl!.style.marginLeft = `${f1(-rw / 2)}px`;
      setState("done");
    }

    let finished = false;
    function finish() {
      if (finished || disposed) return;
      finished = true;
      cancelAnimationFrame(raf);
      removeSkip();
      showFinal();
    }

    const onSkip = () => finish();
    const skipEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "wheel", "touchmove"];
    const addSkip = () => skipEvents.forEach((e) => window.addEventListener(e, onSkip, { passive: true }));
    const removeSkip = () => skipEvents.forEach((e) => window.removeEventListener(e, onSkip));

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (disposed || !mark) return;
        layout();
        if (finished) showFinal();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    (async () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      mark = sampleMark();
      if (reduced) {
        finished = true;
        showFinal();
        return;
      }

      // Dim the server-rendered final state only now that a play is certain,
      // and arm the skip in the same breath — a tap during font/sprite
      // loading must not fall into a listener gap.
      setState("playing");
      addSkip();
      for (const s of letters()) s.style.opacity = "0";
      tagEl.style.opacity = "0";
      ruleEl.style.opacity = "0";
      ruleEl.style.width = "0px";

      await document.fonts.ready;
      if (disposed || finished) return;
      layout();
      await buildParticles();
      if (disposed || finished) return;
      const t0 = performance.now();
      const loop = () => {
        if (disposed) return;
        const t = performance.now() - t0;
        frame(t);
        if (t < DUR) raf = requestAnimationFrame(loop);
        else finish();
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      removeSkip();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section aria-label="Introduction" data-hero-state={state}>
      <div
        ref={bandRef}
        className="relative min-h-[100svh] overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 78% 64% at 50% 42%, #221e15 0%, var(--color-ink-panel) 62%)",
        }}
      >
        <canvas
          ref={inkRef}
          role="img"
          aria-label={site.name}
          className="absolute left-0 top-0"
        />
        <canvas ref={fxRef} aria-hidden="true" className="absolute left-0 top-0" />
        <div
          ref={ruleRef}
          aria-hidden="true"
          className="hero-text absolute left-1/2 h-px w-[84px] -ml-[42px] bg-brass"
          style={{ top: "61%" }}
        />
        <div
          ref={nameRef}
          aria-hidden="true"
          className="hero-text absolute left-0 flex w-full justify-center whitespace-nowrap font-serif font-medium text-paper-on-dark"
          style={{ fontSize: "clamp(1.35rem, 5.4vw, 2.4rem)", top: "64%" }}
        >
          {site.name.split("").map((ch, i) => (
            <span
              key={i}
              data-ch=""
              className="inline-block tracking-[0.3em]"
              style={ch === " " ? { width: "0.44em" } : undefined}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>
        <h1
          ref={tagRef}
          className="hero-text absolute left-0 w-full text-center font-serif italic tracking-[0.18em] text-paper-on-dark/70"
          style={{
            fontSize: "clamp(0.8rem, 2.6vw, 1.2rem)",
            textIndent: "0.18em",
            top: "71%",
          }}
        >
          {site.hero.heading}
        </h1>
        <button
          type="button"
          aria-label="Scroll to introduction"
          onClick={() => {
            const reduced = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;
            document
              .getElementById("introduction")
              ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
          }}
          className="hero-cue absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-paper-on-dark/60"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.28em]">
            Scroll
          </span>
          <span
            aria-hidden="true"
            className="hero-cue-line block h-7 w-px bg-paper-on-dark/50"
          />
        </button>
      </div>
    </section>
  );
}
