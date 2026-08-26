/**
 * Pure math for the hand-signed monogram: turns a sampled centerline into a
 * calligraphic stroke (per-point widths) plus a pacing table that makes the
 * writing animation move like a hand instead of a plotter.
 *
 * DOM-free by design — the SVG path sampling lives in the component; this
 * module is unit-tested against synthetic polylines.
 */

export type Pt = { x: number; y: number };

export type Mark = {
  P: Pt[]; // centerline points (apex-rounded)
  S: number[]; // cumulative arc length per point
  W: number[]; // stroke width per point
  TH: number[]; // smoothed tangent angle per point (unwrapped)
  TT: number[]; // normalised time at each point — the pacing table
  total: number;
  n: number;
};

/** The traced monogram, one unbroken gesture (1200×1000 design space). */
export const SEGS = [
  "M 340 495 C 420 300 540 165 596 136",
  "M 596 136 C 622 124 626 160 621 210 C 617 262 630 322 652 326",
  "M 652 326 C 686 330 792 168 832 140",
  "M 832 140 C 848 130 850 168 843 225 C 822 400 776 640 742 790 C 733 833 718 878 706 898",
  "M 138 688 C 340 566 600 470 792 464",
  "M 792 464 C 952 460 1038 506 1032 572 C 1024 664 932 800 824 872 C 776 903 722 912 706 898",
] as const;

/** Traversal order; segments 5 and 4 run reversed to keep the gesture unbroken. */
export const ROUTE: ReadonlyArray<{ seg: number; rev?: boolean }> = [
  { seg: 0 },
  { seg: 1 },
  { seg: 2 },
  { seg: 3 },
  { seg: 5, rev: true },
  { seg: 4, rev: true },
];

export const STEP = 2.5; // arc-length sampling step the component must use

const NIB = (42 * Math.PI) / 180;
// Near-monoline, matched to the original vectorized monogram: the source
// mark is a felt-tip signature (~18 design units wide, subtle variation),
// not a calligraphic brush. The pressure model below still decides WHERE
// the stroke breathes; this band decides how much.
// Calibrated pixel-for-pixel against monogram-ivory.svg: with this band the
// rendered stroke's width distribution (p10/median/p75 as a share of mark
// width) matches the original's within a few percent.
const W_MAX = 29;
const W_MIN = 12;
const ROUND_WIN = 30; // apex rounding falloff radius (arc units)
const ROUND_ITERS = 34;
const GRAD_LIMIT = 0.55; // max |dW/ds| — steeper reads as a neck-down
// Ends match the original: full-width round-capped stops with only a short
// pen-down settle — never a taper to a point.
const END_WIN = 22;
const END_FLOOR = 0.78;

export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function boxSmooth(arr: number[], win: number, passes: number): number[] {
  const n = arr.length;
  let cur = arr;
  for (let p = 0; p < passes; p++) {
    const out = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      let sum = 0,
        c = 0;
      for (let j = i - win; j <= i + win; j++) {
        sum += cur[clamp(j, 0, n - 1)];
        c++;
      }
      out[i] = sum / c;
    }
    cur = out;
  }
  return cur;
}

/** Menger curvature through three points k samples apart. */
export function curvatureAt(P: Pt[], i: number, k: number): number {
  const n = P.length;
  const a = P[clamp(i - k, 0, n - 1)],
    b = P[i],
    c = P[clamp(i + k, 0, n - 1)];
  const ab = Math.hypot(b.x - a.x, b.y - a.y);
  const bc = Math.hypot(c.x - b.x, c.y - b.y);
  const ca = Math.hypot(a.x - c.x, a.y - c.y);
  if (ab < 1e-6 || bc < 1e-6 || ca < 1e-6) return 0;
  const area2 = Math.abs(
    (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)
  );
  return (2 * area2) / (ab * bc * ca);
}

const arcLengths = (P: Pt[]): number[] => {
  const S = [0];
  for (let i = 1; i < P.length; i++)
    S[i] = S[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y);
  return S;
};

/**
 * Round the tight turn tips: weighted Laplacian relaxation centered on each
 * apex (local curvature maximum) with cosine falloff. A blend-mask smooth
 * dents the outline at its mask boundaries; relaxation cannot, because the
 * weight field is continuous and every iteration is a tiny move.
 */
export function roundApexes(
  raw: Pt[],
  winU = ROUND_WIN,
  iters = ROUND_ITERS
): Pt[] {
  let P = raw.map((p) => ({ x: p.x, y: p.y }));
  const n = P.length;
  const kk = Math.max(1, Math.round(6 / STEP));
  const S0 = arcLengths(P);
  const K0 = boxSmooth(
    P.map((_, i) => curvatureAt(P, i, kk)),
    kk,
    1
  );
  const apexes: number[] = [];
  for (let i = 2; i < n - 2; i++) {
    if (K0[i] > 0.02 && K0[i] >= K0[i - 1] && K0[i] >= K0[i + 1]) {
      if (!apexes.length || S0[i] - S0[apexes[apexes.length - 1]] > 30)
        apexes.push(i);
      else if (K0[i] > K0[apexes[apexes.length - 1]])
        apexes[apexes.length - 1] = i;
    }
  }
  const wgt = new Array<number>(n).fill(0);
  for (const ai of apexes)
    for (let i = 0; i < n; i++) {
      const d = Math.abs(S0[i] - S0[ai]);
      if (d < winU) wgt[i] = Math.max(wgt[i], smoothstep(1 - d / winU));
    }
  for (let t = 0; t < iters; t++) {
    const R = P.map((p) => ({ x: p.x, y: p.y }));
    for (let i = 1; i < n - 1; i++) {
      const l = 0.5 * wgt[i];
      if (l <= 0) continue;
      R[i].x = P[i].x + l * (0.5 * (P[i - 1].x + P[i + 1].x) - P[i].x);
      R[i].y = P[i].y + l * (0.5 * (P[i - 1].y + P[i + 1].y) - P[i].y);
    }
    P = R;
  }
  return P;
}

/**
 * Full pipeline: apex rounding → smoothed tangents → curvature-paced speed →
 * pressure-model widths (percentile-normalised) → gradient limiter → curved
 * end tapers → pacing table. The gradient limiter runs BEFORE the end tapers;
 * clamping afterwards straightens the taper curve into a cone.
 */
export function buildMark(raw: Pt[]): Mark {
  const P = roundApexes(raw);
  const n = P.length;
  const S = arcLengths(P);
  const total = S[n - 1];
  const kk = Math.max(1, Math.round(6 / STEP));

  const TH = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const a = P[Math.min(n - 1, i + 1)],
      b = P[Math.max(0, i - 1)];
    TH[i] = Math.atan2(a.y - b.y, a.x - b.x);
  }
  // Unwrap before smoothing — a right-to-left run sits on the ±π seam and a
  // wrapped average flips sign mid-stroke.
  for (let i = 1; i < n; i++) {
    let d = TH[i] - TH[i - 1];
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    TH[i] = TH[i - 1] + d;
  }
  const THs = boxSmooth(TH, kk, 2);

  const K = boxSmooth(
    P.map((_, i) => curvatureAt(P, i, kk)),
    kk,
    1
  );
  // Two-thirds power law: speed scales with the cube root of turn radius.
  const SP = boxSmooth(
    K.map((k) =>
      clamp(Math.pow(Math.min(1 / Math.max(k, 1e-4), 900), 1 / 3) / 9.6, 0.3, 1)
    ),
    Math.round(10 / STEP),
    1
  );

  const RAW = P.map(
    (_, i) =>
      Math.pow(Math.abs(Math.sin(THs[i] - NIB)), 1.35) *
      (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(THs[i]))) *
      (1 - 0.34 * SP[i])
  );
  const SM = boxSmooth(RAW, Math.max(1, Math.round(7 / STEP)), 1);
  // Percentile normalisation: three multiplied factors compress toward the low
  // end, so absolute scale is meaningless — stretch p5..p95 across the nib range.
  const sorted = SM.slice().sort((a, b) => a - b);
  const pct = (q: number) => sorted[clamp(Math.round(q * (n - 1)), 0, n - 1)];
  const lo = pct(0.05),
    span = Math.max(1e-6, pct(0.95) - lo);
  const W = SM.map(
    (v) => W_MIN + (W_MAX - W_MIN) * Math.pow(clamp((v - lo) / span, 0, 1), 0.85)
  );

  // An offset ribbon folds over itself when half-width exceeds the turn
  // radius, and a folded outline leaves pinholes when filled. The apex
  // rounding keeps radii well above half-width everywhere, so this clamp is
  // a safety net that almost never bites — but it makes a fold impossible.
  for (let i = 0; i < n; i++)
    W[i] = Math.min(W[i], 1.8 / Math.max(K[i], 1e-9));
  for (let i = 1; i < n; i++)
    W[i] = Math.min(W[i], W[i - 1] + GRAD_LIMIT * (S[i] - S[i - 1]));
  for (let i = n - 2; i >= 0; i--)
    W[i] = Math.min(W[i], W[i + 1] + GRAD_LIMIT * (S[i + 1] - S[i]));

  const shape = (u: number) =>
    END_FLOOR + (1 - END_FLOOR) * smoothstep(clamp(u, 0, 1));
  for (let i = 0; i < n; i++) {
    let f = 1;
    if (S[i] < END_WIN) f *= shape(S[i] / END_WIN);
    const r = total - S[i];
    if (r < END_WIN) f *= shape(r / END_WIN);
    W[i] *= f;
  }

  const TT = [0];
  for (let i = 1; i < n; i++)
    TT[i] = TT[i - 1] + (S[i] - S[i - 1]) / ((SP[i] + SP[i - 1]) * 0.5);
  for (let i = 0; i < n; i++) TT[i] /= TT[n - 1];

  return { P, S, W, TH: THs, TT, total, n };
}

/** Index of the last point whose arc length is ≤ L (binary search). */
export function idxAt(mark: Mark, L: number): number {
  let lo = 0,
    hi = mark.n - 1;
  while (lo < hi) {
    const m = (lo + hi + 1) >> 1;
    if (mark.S[m] <= L) lo = m;
    else hi = m - 1;
  }
  return lo;
}

/** Arc length reached at normalised phase u, via the pacing table. */
export function lengthAtPhase(mark: Mark, u: number): number {
  u = clamp(u, 0, 1);
  const { TT, S, n } = mark;
  let lo = 0,
    hi = n - 1;
  while (lo < hi) {
    const m = (lo + hi + 1) >> 1;
    if (TT[m] <= u) lo = m;
    else hi = m - 1;
  }
  const j = Math.min(n - 1, lo + 1);
  const span = Math.max(1e-9, TT[j] - TT[lo]);
  return S[lo] + (S[j] - S[lo]) * clamp((u - TT[lo]) / span, 0, 1);
}
