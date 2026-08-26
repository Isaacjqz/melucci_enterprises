import { describe, expect, it } from "vitest";
import {
  buildMark,
  roundApexes,
  curvatureAt,
  lengthAtPhase,
  idxAt,
  STEP,
  type Pt,
} from "./signature-mark";

/** Sample a parametric curve at roughly STEP arc-length spacing. */
function sampleCurve(fn: (t: number) => Pt, approxLen: number): Pt[] {
  const n = Math.max(8, Math.ceil(approxLen / STEP));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) pts.push(fn(i / n));
  return pts;
}

// A signature-like test curve: two arcs joined by a straight run, ~1500 units,
// with a genuinely tight hairpin in the middle.
function testPolyline(): Pt[] {
  const a = sampleCurve(
    (t) => ({ x: 200 + 400 * t, y: 600 - 500 * t }),
    640
  );
  const hairpin = sampleCurve((t) => {
    const th = Math.PI * (1 - t);
    return { x: 620 + 22 * Math.cos(th), y: 100 + 22 * Math.sin(th) * -1 + 22 };
  }, 70);
  const b = sampleCurve(
    (t) => ({ x: 642 + 10 * t, y: 122 + 500 * t }),
    500
  );
  return [...a, ...hairpin.slice(1), ...b.slice(1)];
}

describe("buildMark", () => {
  const mark = buildMark(testPolyline());

  it("produces finite, well-formed arrays", () => {
    expect(mark.n).toBe(mark.P.length);
    for (const arr of [mark.S, mark.W, mark.TH, mark.TT]) {
      expect(arr.length).toBe(mark.n);
      for (const v of arr) expect(Number.isFinite(v)).toBe(true);
    }
    expect(mark.total).toBeGreaterThan(1000);
  });

  it("arc length and pacing table are monotonic, pacing normalised 0..1", () => {
    for (let i = 1; i < mark.n; i++) {
      expect(mark.S[i]).toBeGreaterThanOrEqual(mark.S[i - 1]);
      expect(mark.TT[i]).toBeGreaterThanOrEqual(mark.TT[i - 1]);
    }
    expect(mark.TT[0]).toBe(0);
    expect(mark.TT[mark.n - 1]).toBeCloseTo(1, 9);
  });

  it("widths stay within the nib range and ends hold near full width", () => {
    for (const w of mark.W) {
      expect(w).toBeGreaterThan(0);
      expect(w).toBeLessThanOrEqual(29 + 1e-9);
    }
    // Marker-style ends, matched to the original monogram: a short pen-down
    // settle only — the end never drops below ~70% of the nearby body width.
    const at = (L: number) => mark.W[idxAt(mark, L)];
    expect(mark.W[0]).toBeGreaterThan(0.7 * at(30));
    expect(mark.W[mark.n - 1]).toBeGreaterThan(0.7 * at(mark.total - 30));
  });

  it("no neck-downs: |dW/ds| never exceeds the gradient limit mid-stroke", () => {
    for (let i = 1; i < mark.n; i++) {
      const ds = Math.max(1e-6, mark.S[i] - mark.S[i - 1]);
      const grad = (mark.W[i] - mark.W[i - 1]) / ds;
      // the limiter caps INCREASES in both directions of travel at 0.55;
      // the end tapers may descend faster by design, so check rises only
      expect(grad).toBeLessThanOrEqual(0.55 + 1e-6);
    }
  });

  it("pacing slows through the hairpin relative to the straight runs", () => {
    // speed ∝ dS/dTT; compare a mid-straight sample to the hairpin apex
    const speedAt = (L: number) => {
      const i = Math.max(1, idxAt(mark, L));
      const dTT = Math.max(1e-12, mark.TT[i] - mark.TT[i - 1]);
      return (mark.S[i] - mark.S[i - 1]) / dTT;
    };
    // hairpin apex sits near the curve's highest-curvature point
    let apexI = 0;
    let apexK = 0;
    for (let i = 2; i < mark.n - 2; i++) {
      const k = curvatureAt(mark.P, i, 3);
      if (k > apexK) {
        apexK = k;
        apexI = i;
      }
    }
    expect(speedAt(mark.total * 0.25)).toBeGreaterThan(
      speedAt(mark.S[apexI]) * 1.5
    );
  });

  it("lengthAtPhase is monotonic and spans the full stroke", () => {
    let prev = -1;
    for (let u = 0; u <= 1.0001; u += 0.05) {
      const L = lengthAtPhase(mark, Math.min(u, 1));
      expect(L).toBeGreaterThanOrEqual(prev);
      prev = L;
    }
    expect(lengthAtPhase(mark, 0)).toBe(0);
    expect(lengthAtPhase(mark, 1)).toBeCloseTo(mark.total, 6);
  });
});

describe("roundApexes", () => {
  // A smooth vee (continuous tangent everywhere) with a tight rounded tip —
  // splicing straight segments creates corner artifacts no traced path has.
  // tip radius ≈ 12 design units — matches the real mark's tightest apexes
  const vee = (): Pt[] =>
    sampleCurve((t) => {
      const u = 2 * t - 1;
      return { x: 1000 * t, y: 200 + 400 * Math.sqrt(u * u + 0.0004) };
    }, 1900);

  // Relaxation redistributes sample spacing, so measure curvature on an
  // arc-length-uniform resample of each curve, not on raw indices.
  const resample = (P: Pt[], step: number): Pt[] => {
    const out: Pt[] = [P[0]];
    let carry = 0;
    for (let i = 1; i < P.length; i++) {
      let ax = P[i - 1].x, ay = P[i - 1].y;
      const bx = P[i].x, by = P[i].y;
      let seg = Math.hypot(bx - ax, by - ay);
      while (carry + seg >= step) {
        const t = (step - carry) / seg;
        ax += (bx - ax) * t;
        ay += (by - ay) * t;
        out.push({ x: ax, y: ay });
        seg = Math.hypot(bx - ax, by - ay);
        carry = 0;
      }
      carry += seg;
    }
    return out;
  };
  const peak = (P: Pt[]) => {
    const R = resample(P, STEP);
    let m = 0;
    for (let i = 3; i < R.length - 3; i++) m = Math.max(m, curvatureAt(R, i, 3));
    return m;
  };

  it("reduces peak curvature at the tight tip", () => {
    const raw = vee();
    expect(peak(roundApexes(raw))).toBeLessThan(peak(raw) * 0.8);
  });

  it("leaves the line untouched away from the apex", () => {
    const raw = vee();
    const rounded = roundApexes(raw);
    expect(rounded[10].x).toBeCloseTo(raw[10].x, 6);
    expect(rounded[10].y).toBeCloseTo(raw[10].y, 6);
  });
});
