"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [757],
  {
    6775: function (t, e, i) {
      i.d(e, {
        kL: function () {
          return re;
        },
        zX: function () {
          return Xi;
        },
      });
      var s = i(2454);
      var n = new (class {
        constructor() {
          (this._request = null),
            (this._charts = new Map()),
            (this._running = !1),
            (this._lastDate = void 0);
        }
        _notify(t, e, i, s) {
          const n = e.listeners[s],
            o = e.duration;
          n.forEach((s) =>
            s({
              chart: t,
              initial: e.initial,
              numSteps: o,
              currentStep: Math.min(i - e.start, o),
            })
          );
        }
        _refresh() {
          this._request ||
            ((this._running = !0),
            (this._request = s.r.call(window, () => {
              this._update(),
                (this._request = null),
                this._running && this._refresh();
            })));
        }
        _update(t = Date.now()) {
          let e = 0;
          this._charts.forEach((i, s) => {
            if (!i.running || !i.items.length) return;
            const n = i.items;
            let o,
              a = n.length - 1,
              r = !1;
            for (; a >= 0; --a)
              (o = n[a]),
                o._active
                  ? (o._total > i.duration && (i.duration = o._total),
                    o.tick(t),
                    (r = !0))
                  : ((n[a] = n[n.length - 1]), n.pop());
            r && (s.draw(), this._notify(s, i, t, "progress")),
              n.length ||
                ((i.running = !1),
                this._notify(s, i, t, "complete"),
                (i.initial = !1)),
              (e += n.length);
          }),
            (this._lastDate = t),
            0 === e && (this._running = !1);
        }
        _getAnims(t) {
          const e = this._charts;
          let i = e.get(t);
          return (
            i ||
              ((i = {
                running: !1,
                initial: !0,
                items: [],
                listeners: { complete: [], progress: [] },
              }),
              e.set(t, i)),
            i
          );
        }
        listen(t, e, i) {
          this._getAnims(t).listeners[e].push(i);
        }
        add(t, e) {
          e && e.length && this._getAnims(t).items.push(...e);
        }
        has(t) {
          return this._getAnims(t).items.length > 0;
        }
        start(t) {
          const e = this._charts.get(t);
          e &&
            ((e.running = !0),
            (e.start = Date.now()),
            (e.duration = e.items.reduce(
              (t, e) => Math.max(t, e._duration),
              0
            )),
            this._refresh());
        }
        running(t) {
          if (!this._running) return !1;
          const e = this._charts.get(t);
          return !!(e && e.running && e.items.length);
        }
        stop(t) {
          const e = this._charts.get(t);
          if (!e || !e.items.length) return;
          const i = e.items;
          let s = i.length - 1;
          for (; s >= 0; --s) i[s].cancel();
          (e.items = []), this._notify(t, e, Date.now(), "complete");
        }
        remove(t) {
          return this._charts.delete(t);
        }
      })();
      const o = "transparent",
        a = {
          boolean: (t, e, i) => (i > 0.5 ? e : t),
          color(t, e, i) {
            const n = (0, s.c)(t || o),
              a = n.valid && (0, s.c)(e || o);
            return a && a.valid ? a.mix(n, i).hexString() : e;
          },
          number: (t, e, i) => t + (e - t) * i,
        };
      class r {
        constructor(t, e, i, n) {
          const o = e[i];
          n = (0, s.a)([t.to, n, o, t.from]);
          const r = (0, s.a)([t.from, o, n]);
          (this._active = !0),
            (this._fn = t.fn || a[t.type || typeof r]),
            (this._easing = s.e[t.easing] || s.e.linear),
            (this._start = Math.floor(Date.now() + (t.delay || 0))),
            (this._duration = this._total = Math.floor(t.duration)),
            (this._loop = !!t.loop),
            (this._target = e),
            (this._prop = i),
            (this._from = r),
            (this._to = n),
            (this._promises = void 0);
        }
        active() {
          return this._active;
        }
        update(t, e, i) {
          if (this._active) {
            this._notify(!1);
            const n = this._target[this._prop],
              o = i - this._start,
              a = this._duration - o;
            (this._start = i),
              (this._duration = Math.floor(Math.max(a, t.duration))),
              (this._total += o),
              (this._loop = !!t.loop),
              (this._to = (0, s.a)([t.to, e, n, t.from])),
              (this._from = (0, s.a)([t.from, n, e]));
          }
        }
        cancel() {
          this._active &&
            (this.tick(Date.now()), (this._active = !1), this._notify(!1));
        }
        tick(t) {
          const e = t - this._start,
            i = this._duration,
            s = this._prop,
            n = this._from,
            o = this._loop,
            a = this._to;
          let r;
          if (((this._active = n !== a && (o || e < i)), !this._active))
            return (this._target[s] = a), void this._notify(!0);
          e < 0
            ? (this._target[s] = n)
            : ((r = (e / i) % 2),
              (r = o && r > 1 ? 2 - r : r),
              (r = this._easing(Math.min(1, Math.max(0, r)))),
              (this._target[s] = this._fn(n, a, r)));
        }
        wait() {
          const t = this._promises || (this._promises = []);
          return new Promise((e, i) => {
            t.push({ res: e, rej: i });
          });
        }
        _notify(t) {
          const e = t ? "res" : "rej",
            i = this._promises || [];
          for (let s = 0; s < i.length; s++) i[s][e]();
        }
      }
      s.d.set("animation", {
        delay: void 0,
        duration: 1e3,
        easing: "easeOutQuart",
        fn: void 0,
        from: void 0,
        loop: void 0,
        to: void 0,
        type: void 0,
      });
      const h = Object.keys(s.d.animation);
      s.d.describe("animation", {
        _fallback: !1,
        _indexable: !1,
        _scriptable: (t) =>
          "onProgress" !== t && "onComplete" !== t && "fn" !== t,
      }),
        s.d.set("animations", {
          colors: {
            type: "color",
            properties: ["color", "borderColor", "backgroundColor"],
          },
          numbers: {
            type: "number",
            properties: ["x", "y", "borderWidth", "radius", "tension"],
          },
        }),
        s.d.describe("animations", { _fallback: "animation" }),
        s.d.set("transitions", {
          active: { animation: { duration: 400 } },
          resize: { animation: { duration: 0 } },
          show: {
            animations: {
              colors: { from: "transparent" },
              visible: { type: "boolean", duration: 0 },
            },
          },
          hide: {
            animations: {
              colors: { to: "transparent" },
              visible: { type: "boolean", easing: "linear", fn: (t) => 0 | t },
            },
          },
        });
      class l {
        constructor(t, e) {
          (this._chart = t), (this._properties = new Map()), this.configure(e);
        }
        configure(t) {
          if (!(0, s.i)(t)) return;
          const e = this._properties;
          Object.getOwnPropertyNames(t).forEach((i) => {
            const n = t[i];
            if (!(0, s.i)(n)) return;
            const o = {};
            for (const t of h) o[t] = n[t];
            (((0, s.b)(n.properties) && n.properties) || [i]).forEach((t) => {
              (t !== i && e.has(t)) || e.set(t, o);
            });
          });
        }
        _animateOptions(t, e) {
          const i = e.options,
            s = (function (t, e) {
              if (!e) return;
              let i = t.options;
              if (!i) return void (t.options = e);
              i.$shared &&
                (t.options = i =
                  Object.assign({}, i, { $shared: !1, $animations: {} }));
              return i;
            })(t, i);
          if (!s) return [];
          const n = this._createAnimations(s, i);
          return (
            i.$shared &&
              (function (t, e) {
                const i = [],
                  s = Object.keys(e);
                for (let n = 0; n < s.length; n++) {
                  const e = t[s[n]];
                  e && e.active() && i.push(e.wait());
                }
                return Promise.all(i);
              })(t.options.$animations, i).then(
                () => {
                  t.options = i;
                },
                () => {}
              ),
            n
          );
        }
        _createAnimations(t, e) {
          const i = this._properties,
            s = [],
            n = t.$animations || (t.$animations = {}),
            o = Object.keys(e),
            a = Date.now();
          let h;
          for (h = o.length - 1; h >= 0; --h) {
            const l = o[h];
            if ("$" === l.charAt(0)) continue;
            if ("options" === l) {
              s.push(...this._animateOptions(t, e));
              continue;
            }
            const c = e[l];
            let d = n[l];
            const u = i.get(l);
            if (d) {
              if (u && d.active()) {
                d.update(u, c, a);
                continue;
              }
              d.cancel();
            }
            u && u.duration
              ? ((n[l] = d = new r(u, t, l, c)), s.push(d))
              : (t[l] = c);
          }
          return s;
        }
        update(t, e) {
          if (0 === this._properties.size) return void Object.assign(t, e);
          const i = this._createAnimations(t, e);
          return i.length ? (n.add(this._chart, i), !0) : void 0;
        }
      }
      function c(t, e) {
        const i = (t && t.options) || {},
          s = i.reverse,
          n = void 0 === i.min ? e : 0,
          o = void 0 === i.max ? e : 0;
        return { start: s ? o : n, end: s ? n : o };
      }
      function d(t, e) {
        const i = [],
          s = t._getSortedDatasetMetas(e);
        let n, o;
        for (n = 0, o = s.length; n < o; ++n) i.push(s[n].index);
        return i;
      }
      function u(t, e, i, n = {}) {
        const o = t.keys,
          a = "single" === n.mode;
        let r, h, l, c;
        if (null !== e) {
          for (r = 0, h = o.length; r < h; ++r) {
            if (((l = +o[r]), l === i)) {
              if (n.all) continue;
              break;
            }
            (c = t.values[l]),
              (0, s.g)(c) &&
                (a || 0 === e || (0, s.s)(e) === (0, s.s)(c)) &&
                (e += c);
          }
          return e;
        }
      }
      function g(t, e) {
        const i = t && t.options.stacked;
        return i || (void 0 === i && void 0 !== e.stack);
      }
      function p(t, e, i) {
        const s = t[e] || (t[e] = {});
        return s[i] || (s[i] = {});
      }
      function f(t, e, i, s) {
        for (const n of e.getMatchingVisibleMetas(s).reverse()) {
          const e = t[n.index];
          if ((i && e > 0) || (!i && e < 0)) return n.index;
        }
        return null;
      }
      function m(t, e) {
        const { chart: i, _cachedMeta: s } = t,
          n = i._stacks || (i._stacks = {}),
          { iScale: o, vScale: a, index: r } = s,
          h = o.axis,
          l = a.axis,
          c = (function (t, e, i) {
            return `${t.id}.${e.id}.${i.stack || i.type}`;
          })(o, a, s),
          d = e.length;
        let u;
        for (let g = 0; g < d; ++g) {
          const t = e[g],
            { [h]: i, [l]: o } = t;
          (u = (t._stacks || (t._stacks = {}))[l] = p(n, c, i)),
            (u[r] = o),
            (u._top = f(u, a, !0, s.type)),
            (u._bottom = f(u, a, !1, s.type));
        }
      }
      function x(t, e) {
        const i = t.scales;
        return Object.keys(i)
          .filter((t) => i[t].axis === e)
          .shift();
      }
      function b(t, e) {
        const i = t.controller.index,
          s = t.vScale && t.vScale.axis;
        if (s) {
          e = e || t._parsed;
          for (const t of e) {
            const e = t._stacks;
            if (!e || void 0 === e[s] || void 0 === e[s][i]) return;
            delete e[s][i];
          }
        }
      }
      const _ = (t) => "reset" === t || "none" === t,
        v = (t, e) => (e ? t : Object.assign({}, t));
      class y {
        constructor(t, e) {
          (this.chart = t),
            (this._ctx = t.ctx),
            (this.index = e),
            (this._cachedDataOpts = {}),
            (this._cachedMeta = this.getMeta()),
            (this._type = this._cachedMeta.type),
            (this.options = void 0),
            (this._parsing = !1),
            (this._data = void 0),
            (this._objectData = void 0),
            (this._sharedOptions = void 0),
            (this._drawStart = void 0),
            (this._drawCount = void 0),
            (this.enableOptionSharing = !1),
            (this.supportsDecimation = !1),
            (this.$context = void 0),
            (this._syncList = []),
            this.initialize();
        }
        initialize() {
          const t = this._cachedMeta;
          this.configure(),
            this.linkScales(),
            (t._stacked = g(t.vScale, t)),
            this.addElements();
        }
        updateIndex(t) {
          this.index !== t && b(this._cachedMeta), (this.index = t);
        }
        linkScales() {
          const t = this.chart,
            e = this._cachedMeta,
            i = this.getDataset(),
            n = (t, e, i, s) => ("x" === t ? e : "r" === t ? s : i),
            o = (e.xAxisID = (0, s.v)(i.xAxisID, x(t, "x"))),
            a = (e.yAxisID = (0, s.v)(i.yAxisID, x(t, "y"))),
            r = (e.rAxisID = (0, s.v)(i.rAxisID, x(t, "r"))),
            h = e.indexAxis,
            l = (e.iAxisID = n(h, o, a, r)),
            c = (e.vAxisID = n(h, a, o, r));
          (e.xScale = this.getScaleForId(o)),
            (e.yScale = this.getScaleForId(a)),
            (e.rScale = this.getScaleForId(r)),
            (e.iScale = this.getScaleForId(l)),
            (e.vScale = this.getScaleForId(c));
        }
        getDataset() {
          return this.chart.data.datasets[this.index];
        }
        getMeta() {
          return this.chart.getDatasetMeta(this.index);
        }
        getScaleForId(t) {
          return this.chart.scales[t];
        }
        _getOtherScale(t) {
          const e = this._cachedMeta;
          return t === e.iScale ? e.vScale : e.iScale;
        }
        reset() {
          this._update("reset");
        }
        _destroy() {
          const t = this._cachedMeta;
          this._data && (0, s.u)(this._data, this), t._stacked && b(t);
        }
        _dataCheck() {
          const t = this.getDataset(),
            e = t.data || (t.data = []),
            i = this._data;
          if ((0, s.i)(e))
            this._data = (function (t) {
              const e = Object.keys(t),
                i = new Array(e.length);
              let s, n, o;
              for (s = 0, n = e.length; s < n; ++s)
                (o = e[s]), (i[s] = { x: o, y: t[o] });
              return i;
            })(e);
          else if (i !== e) {
            if (i) {
              (0, s.u)(i, this);
              const t = this._cachedMeta;
              b(t), (t._parsed = []);
            }
            e && Object.isExtensible(e) && (0, s.l)(e, this),
              (this._syncList = []),
              (this._data = e);
          }
        }
        addElements() {
          const t = this._cachedMeta;
          this._dataCheck(),
            this.datasetElementType &&
              (t.dataset = new this.datasetElementType());
        }
        buildOrUpdateElements(t) {
          const e = this._cachedMeta,
            i = this.getDataset();
          let s = !1;
          this._dataCheck();
          const n = e._stacked;
          (e._stacked = g(e.vScale, e)),
            e.stack !== i.stack && ((s = !0), b(e), (e.stack = i.stack)),
            this._resyncElements(t),
            (s || n !== e._stacked) && m(this, e._parsed);
        }
        configure() {
          const t = this.chart.config,
            e = t.datasetScopeKeys(this._type),
            i = t.getOptionScopes(this.getDataset(), e, !0);
          (this.options = t.createResolver(i, this.getContext())),
            (this._parsing = this.options.parsing),
            (this._cachedDataOpts = {});
        }
        parse(t, e) {
          const { _cachedMeta: i, _data: n } = this,
            { iScale: o, _stacked: a } = i,
            r = o.axis;
          let h,
            l,
            c,
            d = (0 === t && e === n.length) || i._sorted,
            u = t > 0 && i._parsed[t - 1];
          if (!1 === this._parsing) (i._parsed = n), (i._sorted = !0), (c = n);
          else {
            c = (0, s.b)(n[t])
              ? this.parseArrayData(i, n, t, e)
              : (0, s.i)(n[t])
              ? this.parseObjectData(i, n, t, e)
              : this.parsePrimitiveData(i, n, t, e);
            const o = () => null === l[r] || (u && l[r] < u[r]);
            for (h = 0; h < e; ++h)
              (i._parsed[h + t] = l = c[h]), d && (o() && (d = !1), (u = l));
            i._sorted = d;
          }
          a && m(this, c);
        }
        parsePrimitiveData(t, e, i, s) {
          const { iScale: n, vScale: o } = t,
            a = n.axis,
            r = o.axis,
            h = n.getLabels(),
            l = n === o,
            c = new Array(s);
          let d, u, g;
          for (d = 0, u = s; d < u; ++d)
            (g = d + i),
              (c[d] = { [a]: l || n.parse(h[g], g), [r]: o.parse(e[g], g) });
          return c;
        }
        parseArrayData(t, e, i, s) {
          const { xScale: n, yScale: o } = t,
            a = new Array(s);
          let r, h, l, c;
          for (r = 0, h = s; r < h; ++r)
            (l = r + i),
              (c = e[l]),
              (a[r] = { x: n.parse(c[0], l), y: o.parse(c[1], l) });
          return a;
        }
        parseObjectData(t, e, i, n) {
          const { xScale: o, yScale: a } = t,
            { xAxisKey: r = "x", yAxisKey: h = "y" } = this._parsing,
            l = new Array(n);
          let c, d, u, g;
          for (c = 0, d = n; c < d; ++c)
            (u = c + i),
              (g = e[u]),
              (l[c] = {
                x: o.parse((0, s.f)(g, r), u),
                y: a.parse((0, s.f)(g, h), u),
              });
          return l;
        }
        getParsed(t) {
          return this._cachedMeta._parsed[t];
        }
        getDataElement(t) {
          return this._cachedMeta.data[t];
        }
        applyStack(t, e, i) {
          const s = this.chart,
            n = this._cachedMeta,
            o = e[t.axis];
          return u({ keys: d(s, !0), values: e._stacks[t.axis] }, o, n.index, {
            mode: i,
          });
        }
        updateRangeFromParsed(t, e, i, s) {
          const n = i[e.axis];
          let o = null === n ? NaN : n;
          const a = s && i._stacks[e.axis];
          s && a && ((s.values = a), (o = u(s, n, this._cachedMeta.index))),
            (t.min = Math.min(t.min, o)),
            (t.max = Math.max(t.max, o));
        }
        getMinMax(t, e) {
          const i = this._cachedMeta,
            n = i._parsed,
            o = i._sorted && t === i.iScale,
            a = n.length,
            r = this._getOtherScale(t),
            h = ((t, e, i) =>
              t && !e.hidden && e._stacked && { keys: d(i, !0), values: null })(
              e,
              i,
              this.chart
            ),
            l = {
              min: Number.POSITIVE_INFINITY,
              max: Number.NEGATIVE_INFINITY,
            },
            { min: c, max: u } = (function (t) {
              const {
                min: e,
                max: i,
                minDefined: s,
                maxDefined: n,
              } = t.getUserBounds();
              return {
                min: s ? e : Number.NEGATIVE_INFINITY,
                max: n ? i : Number.POSITIVE_INFINITY,
              };
            })(r);
          let g, p;
          function f() {
            p = n[g];
            const e = p[r.axis];
            return !(0, s.g)(p[t.axis]) || c > e || u < e;
          }
          for (
            g = 0;
            g < a && (f() || (this.updateRangeFromParsed(l, t, p, h), !o));
            ++g
          );
          if (o)
            for (g = a - 1; g >= 0; --g)
              if (!f()) {
                this.updateRangeFromParsed(l, t, p, h);
                break;
              }
          return l;
        }
        getAllParsedValues(t) {
          const e = this._cachedMeta._parsed,
            i = [];
          let n, o, a;
          for (n = 0, o = e.length; n < o; ++n)
            (a = e[n][t.axis]), (0, s.g)(a) && i.push(a);
          return i;
        }
        getMaxOverflow() {
          return !1;
        }
        getLabelAndValue(t) {
          const e = this._cachedMeta,
            i = e.iScale,
            s = e.vScale,
            n = this.getParsed(t);
          return {
            label: i ? "" + i.getLabelForValue(n[i.axis]) : "",
            value: s ? "" + s.getLabelForValue(n[s.axis]) : "",
          };
        }
        _update(t) {
          const e = this._cachedMeta;
          this.update(t || "default"),
            (e._clip = (function (t) {
              let e, i, n, o;
              return (
                (0, s.i)(t)
                  ? ((e = t.top), (i = t.right), (n = t.bottom), (o = t.left))
                  : (e = i = n = o = t),
                { top: e, right: i, bottom: n, left: o, disabled: !1 === t }
              );
            })(
              (0, s.v)(
                this.options.clip,
                (function (t, e, i) {
                  if (!1 === i) return !1;
                  const s = c(t, i),
                    n = c(e, i);
                  return {
                    top: n.end,
                    right: s.end,
                    bottom: n.start,
                    left: s.start,
                  };
                })(e.xScale, e.yScale, this.getMaxOverflow())
              )
            ));
        }
        update(t) {}
        draw() {
          const t = this._ctx,
            e = this.chart,
            i = this._cachedMeta,
            s = i.data || [],
            n = e.chartArea,
            o = [],
            a = this._drawStart || 0,
            r = this._drawCount || s.length - a,
            h = this.options.drawActiveElementsOnTop;
          let l;
          for (i.dataset && i.dataset.draw(t, n, a, r), l = a; l < a + r; ++l) {
            const e = s[l];
            e.hidden || (e.active && h ? o.push(e) : e.draw(t, n));
          }
          for (l = 0; l < o.length; ++l) o[l].draw(t, n);
        }
        getStyle(t, e) {
          const i = e ? "active" : "default";
          return void 0 === t && this._cachedMeta.dataset
            ? this.resolveDatasetElementOptions(i)
            : this.resolveDataElementOptions(t || 0, i);
        }
        getContext(t, e, i) {
          const n = this.getDataset();
          let o;
          if (t >= 0 && t < this._cachedMeta.data.length) {
            const e = this._cachedMeta.data[t];
            (o =
              e.$context ||
              (e.$context = (function (t, e, i) {
                return (0, s.h)(t, {
                  active: !1,
                  dataIndex: e,
                  parsed: void 0,
                  raw: void 0,
                  element: i,
                  index: e,
                  mode: "default",
                  type: "data",
                });
              })(this.getContext(), t, e))),
              (o.parsed = this.getParsed(t)),
              (o.raw = n.data[t]),
              (o.index = o.dataIndex = t);
          } else
            (o =
              this.$context ||
              (this.$context = (function (t, e) {
                return (0, s.h)(t, {
                  active: !1,
                  dataset: void 0,
                  datasetIndex: e,
                  index: e,
                  mode: "default",
                  type: "dataset",
                });
              })(this.chart.getContext(), this.index))),
              (o.dataset = n),
              (o.index = o.datasetIndex = this.index);
          return (o.active = !!e), (o.mode = i), o;
        }
        resolveDatasetElementOptions(t) {
          return this._resolveElementOptions(this.datasetElementType.id, t);
        }
        resolveDataElementOptions(t, e) {
          return this._resolveElementOptions(this.dataElementType.id, e, t);
        }
        _resolveElementOptions(t, e = "default", i) {
          const n = "active" === e,
            o = this._cachedDataOpts,
            a = t + "-" + e,
            r = o[a],
            h = this.enableOptionSharing && (0, s.j)(i);
          if (r) return v(r, h);
          const l = this.chart.config,
            c = l.datasetElementScopeKeys(this._type, t),
            d = n ? [`${t}Hover`, "hover", t, ""] : [t, ""],
            u = l.getOptionScopes(this.getDataset(), c),
            g = Object.keys(s.d.elements[t]),
            p = l.resolveNamedOptions(u, g, () => this.getContext(i, n), d);
          return (
            p.$shared && ((p.$shared = h), (o[a] = Object.freeze(v(p, h)))), p
          );
        }
        _resolveAnimations(t, e, i) {
          const s = this.chart,
            n = this._cachedDataOpts,
            o = `animation-${e}`,
            a = n[o];
          if (a) return a;
          let r;
          if (!1 !== s.options.animation) {
            const s = this.chart.config,
              n = s.datasetAnimationScopeKeys(this._type, e),
              o = s.getOptionScopes(this.getDataset(), n);
            r = s.createResolver(o, this.getContext(t, i, e));
          }
          const h = new l(s, r && r.animations);
          return r && r._cacheable && (n[o] = Object.freeze(h)), h;
        }
        getSharedOptions(t) {
          if (t.$shared)
            return (
              this._sharedOptions ||
              (this._sharedOptions = Object.assign({}, t))
            );
        }
        includeOptions(t, e) {
          return !e || _(t) || this.chart._animationsDisabled;
        }
        _getSharedOptions(t, e) {
          const i = this.resolveDataElementOptions(t, e),
            s = this._sharedOptions,
            n = this.getSharedOptions(i),
            o = this.includeOptions(e, n) || n !== s;
          return (
            this.updateSharedOptions(n, e, i),
            { sharedOptions: n, includeOptions: o }
          );
        }
        updateElement(t, e, i, s) {
          _(s)
            ? Object.assign(t, i)
            : this._resolveAnimations(e, s).update(t, i);
        }
        updateSharedOptions(t, e, i) {
          t && !_(e) && this._resolveAnimations(void 0, e).update(t, i);
        }
        _setStyle(t, e, i, s) {
          t.active = s;
          const n = this.getStyle(e, s);
          this._resolveAnimations(e, i, s).update(t, {
            options: (!s && this.getSharedOptions(n)) || n,
          });
        }
        removeHoverStyle(t, e, i) {
          this._setStyle(t, i, "active", !1);
        }
        setHoverStyle(t, e, i) {
          this._setStyle(t, i, "active", !0);
        }
        _removeDatasetHoverStyle() {
          const t = this._cachedMeta.dataset;
          t && this._setStyle(t, void 0, "active", !1);
        }
        _setDatasetHoverStyle() {
          const t = this._cachedMeta.dataset;
          t && this._setStyle(t, void 0, "active", !0);
        }
        _resyncElements(t) {
          const e = this._data,
            i = this._cachedMeta.data;
          for (const [a, r, h] of this._syncList) this[a](r, h);
          this._syncList = [];
          const s = i.length,
            n = e.length,
            o = Math.min(n, s);
          o && this.parse(0, o),
            n > s
              ? this._insertElements(s, n - s, t)
              : n < s && this._removeElements(n, s - n);
        }
        _insertElements(t, e, i = !0) {
          const s = this._cachedMeta,
            n = s.data,
            o = t + e;
          let a;
          const r = (t) => {
            for (t.length += e, a = t.length - 1; a >= o; a--) t[a] = t[a - e];
          };
          for (r(n), a = t; a < o; ++a) n[a] = new this.dataElementType();
          this._parsing && r(s._parsed),
            this.parse(t, e),
            i && this.updateElements(n, t, e, "reset");
        }
        updateElements(t, e, i, s) {}
        _removeElements(t, e) {
          const i = this._cachedMeta;
          if (this._parsing) {
            const s = i._parsed.splice(t, e);
            i._stacked && b(i, s);
          }
          i.data.splice(t, e);
        }
        _sync(t) {
          if (this._parsing) this._syncList.push(t);
          else {
            const [e, i, s] = t;
            this[e](i, s);
          }
          this.chart._dataChanges.push([this.index, ...t]);
        }
        _onDataPush() {
          const t = arguments.length;
          this._sync(["_insertElements", this.getDataset().data.length - t, t]);
        }
        _onDataPop() {
          this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]);
        }
        _onDataShift() {
          this._sync(["_removeElements", 0, 1]);
        }
        _onDataSplice(t, e) {
          e && this._sync(["_removeElements", t, e]);
          const i = arguments.length - 2;
          i && this._sync(["_insertElements", t, i]);
        }
        _onDataUnshift() {
          this._sync(["_insertElements", 0, arguments.length]);
        }
      }
      function M(t) {
        const e = t.iScale,
          i = (function (t, e) {
            if (!t._cache.$bar) {
              const i = t.getMatchingVisibleMetas(e);
              let n = [];
              for (let e = 0, s = i.length; e < s; e++)
                n = n.concat(i[e].controller.getAllParsedValues(t));
              t._cache.$bar = (0, s._)(n.sort((t, e) => t - e));
            }
            return t._cache.$bar;
          })(e, t.type);
        let n,
          o,
          a,
          r,
          h = e._length;
        const l = () => {
          32767 !== a &&
            -32768 !== a &&
            ((0, s.j)(r) && (h = Math.min(h, Math.abs(a - r) || h)), (r = a));
        };
        for (n = 0, o = i.length; n < o; ++n)
          (a = e.getPixelForValue(i[n])), l();
        for (r = void 0, n = 0, o = e.ticks.length; n < o; ++n)
          (a = e.getPixelForTick(n)), l();
        return h;
      }
      function k(t, e, i, n) {
        return (
          (0, s.b)(t)
            ? (function (t, e, i, s) {
                const n = i.parse(t[0], s),
                  o = i.parse(t[1], s),
                  a = Math.min(n, o),
                  r = Math.max(n, o);
                let h = a,
                  l = r;
                Math.abs(a) > Math.abs(r) && ((h = r), (l = a)),
                  (e[i.axis] = l),
                  (e._custom = {
                    barStart: h,
                    barEnd: l,
                    start: n,
                    end: o,
                    min: a,
                    max: r,
                  });
              })(t, e, i, n)
            : (e[i.axis] = i.parse(t, n)),
          e
        );
      }
      function w(t, e, i, s) {
        const n = t.iScale,
          o = t.vScale,
          a = n.getLabels(),
          r = n === o,
          h = [];
        let l, c, d, u;
        for (l = i, c = i + s; l < c; ++l)
          (u = e[l]),
            (d = {}),
            (d[n.axis] = r || n.parse(a[l], l)),
            h.push(k(u, d, o, l));
        return h;
      }
      function S(t) {
        return t && void 0 !== t.barStart && void 0 !== t.barEnd;
      }
      function D(t, e, i, s) {
        let n = e.borderSkipped;
        const o = {};
        if (!n) return void (t.borderSkipped = o);
        if (!0 === n)
          return void (t.borderSkipped = {
            top: !0,
            right: !0,
            bottom: !0,
            left: !0,
          });
        const {
          start: a,
          end: r,
          reverse: h,
          top: l,
          bottom: c,
        } = (function (t) {
          let e, i, s, n, o;
          return (
            t.horizontal
              ? ((e = t.base > t.x), (i = "left"), (s = "right"))
              : ((e = t.base < t.y), (i = "bottom"), (s = "top")),
            e ? ((n = "end"), (o = "start")) : ((n = "start"), (o = "end")),
            { start: i, end: s, reverse: e, top: n, bottom: o }
          );
        })(t);
        "middle" === n &&
          i &&
          ((t.enableBorderRadius = !0),
          (i._top || 0) === s
            ? (n = l)
            : (i._bottom || 0) === s
            ? (n = c)
            : ((o[P(c, a, r, h)] = !0), (n = l))),
          (o[P(n, a, r, h)] = !0),
          (t.borderSkipped = o);
      }
      function P(t, e, i, s) {
        var n, o, a;
        return (
          s
            ? ((a = i),
              (t = C((t = (n = t) === (o = e) ? a : n === a ? o : n), i, e)))
            : (t = C(t, e, i)),
          t
        );
      }
      function C(t, e, i) {
        return "start" === t ? e : "end" === t ? i : t;
      }
      function A(t, { inflateAmount: e }, i) {
        t.inflateAmount = "auto" === e ? (1 === i ? 0.33 : 0) : e;
      }
      (y.defaults = {}),
        (y.prototype.datasetElementType = null),
        (y.prototype.dataElementType = null);
      class O extends y {
        parsePrimitiveData(t, e, i, s) {
          return w(t, e, i, s);
        }
        parseArrayData(t, e, i, s) {
          return w(t, e, i, s);
        }
        parseObjectData(t, e, i, n) {
          const { iScale: o, vScale: a } = t,
            { xAxisKey: r = "x", yAxisKey: h = "y" } = this._parsing,
            l = "x" === o.axis ? r : h,
            c = "x" === a.axis ? r : h,
            d = [];
          let u, g, p, f;
          for (u = i, g = i + n; u < g; ++u)
            (f = e[u]),
              (p = {}),
              (p[o.axis] = o.parse((0, s.f)(f, l), u)),
              d.push(k((0, s.f)(f, c), p, a, u));
          return d;
        }
        updateRangeFromParsed(t, e, i, s) {
          super.updateRangeFromParsed(t, e, i, s);
          const n = i._custom;
          n &&
            e === this._cachedMeta.vScale &&
            ((t.min = Math.min(t.min, n.min)),
            (t.max = Math.max(t.max, n.max)));
        }
        getMaxOverflow() {
          return 0;
        }
        getLabelAndValue(t) {
          const e = this._cachedMeta,
            { iScale: i, vScale: s } = e,
            n = this.getParsed(t),
            o = n._custom,
            a = S(o)
              ? "[" + o.start + ", " + o.end + "]"
              : "" + s.getLabelForValue(n[s.axis]);
          return { label: "" + i.getLabelForValue(n[i.axis]), value: a };
        }
        initialize() {
          (this.enableOptionSharing = !0), super.initialize();
          this._cachedMeta.stack = this.getDataset().stack;
        }
        update(t) {
          const e = this._cachedMeta;
          this.updateElements(e.data, 0, e.data.length, t);
        }
        updateElements(t, e, i, n) {
          const o = "reset" === n,
            {
              index: a,
              _cachedMeta: { vScale: r },
            } = this,
            h = r.getBasePixel(),
            l = r.isHorizontal(),
            c = this._getRuler(),
            { sharedOptions: d, includeOptions: u } = this._getSharedOptions(
              e,
              n
            );
          for (let g = e; g < e + i; g++) {
            const e = this.getParsed(g),
              i =
                o || (0, s.k)(e[r.axis])
                  ? { base: h, head: h }
                  : this._calculateBarValuePixels(g),
              p = this._calculateBarIndexPixels(g, c),
              f = (e._stacks || {})[r.axis],
              m = {
                horizontal: l,
                base: i.base,
                enableBorderRadius:
                  !f || S(e._custom) || a === f._top || a === f._bottom,
                x: l ? i.head : p.center,
                y: l ? p.center : i.head,
                height: l ? p.size : Math.abs(i.size),
                width: l ? Math.abs(i.size) : p.size,
              };
            u &&
              (m.options =
                d ||
                this.resolveDataElementOptions(g, t[g].active ? "active" : n));
            const x = m.options || t[g].options;
            D(m, x, f, a), A(m, x, c.ratio), this.updateElement(t[g], g, m, n);
          }
        }
        _getStacks(t, e) {
          const { iScale: i } = this._cachedMeta,
            n = i
              .getMatchingVisibleMetas(this._type)
              .filter((t) => t.controller.options.grouped),
            o = i.options.stacked,
            a = [],
            r = (t) => {
              const i = t.controller.getParsed(e),
                n = i && i[t.vScale.axis];
              if ((0, s.k)(n) || isNaN(n)) return !0;
            };
          for (const s of n)
            if (
              (void 0 === e || !r(s)) &&
              ((!1 === o ||
                -1 === a.indexOf(s.stack) ||
                (void 0 === o && void 0 === s.stack)) &&
                a.push(s.stack),
              s.index === t)
            )
              break;
          return a.length || a.push(void 0), a;
        }
        _getStackCount(t) {
          return this._getStacks(void 0, t).length;
        }
        _getStackIndex(t, e, i) {
          const s = this._getStacks(t, i),
            n = void 0 !== e ? s.indexOf(e) : -1;
          return -1 === n ? s.length - 1 : n;
        }
        _getRuler() {
          const t = this.options,
            e = this._cachedMeta,
            i = e.iScale,
            s = [];
          let n, o;
          for (n = 0, o = e.data.length; n < o; ++n)
            s.push(i.getPixelForValue(this.getParsed(n)[i.axis], n));
          const a = t.barThickness;
          return {
            min: a || M(e),
            pixels: s,
            start: i._startPixel,
            end: i._endPixel,
            stackCount: this._getStackCount(),
            scale: i,
            grouped: t.grouped,
            ratio: a ? 1 : t.categoryPercentage * t.barPercentage,
          };
        }
        _calculateBarValuePixels(t) {
          const {
              _cachedMeta: { vScale: e, _stacked: i },
              options: { base: n, minBarLength: o },
            } = this,
            a = n || 0,
            r = this.getParsed(t),
            h = r._custom,
            l = S(h);
          let c,
            d,
            u = r[e.axis],
            g = 0,
            p = i ? this.applyStack(e, r, i) : u;
          p !== u && ((g = p - u), (p = u)),
            l &&
              ((u = h.barStart),
              (p = h.barEnd - h.barStart),
              0 !== u && (0, s.s)(u) !== (0, s.s)(h.barEnd) && (g = 0),
              (g += u));
          const f = (0, s.k)(n) || l ? g : n;
          let m = e.getPixelForValue(f);
          if (
            ((c = this.chart.getDataVisibility(t)
              ? e.getPixelForValue(g + p)
              : m),
            (d = c - m),
            Math.abs(d) < o)
          ) {
            (d =
              (function (t, e, i) {
                return 0 !== t
                  ? (0, s.s)(t)
                  : (e.isHorizontal() ? 1 : -1) * (e.min >= i ? 1 : -1);
              })(d, e, a) * o),
              u === a && (m -= d / 2);
            const t = e.getPixelForDecimal(0),
              i = e.getPixelForDecimal(1),
              n = Math.min(t, i),
              r = Math.max(t, i);
            (m = Math.max(Math.min(m, r), n)), (c = m + d);
          }
          if (m === e.getPixelForValue(a)) {
            const t = ((0, s.s)(d) * e.getLineWidthForValue(a)) / 2;
            (m += t), (d -= t);
          }
          return { size: d, base: m, head: c, center: c + d / 2 };
        }
        _calculateBarIndexPixels(t, e) {
          const i = e.scale,
            n = this.options,
            o = n.skipNull,
            a = (0, s.v)(n.maxBarThickness, 1 / 0);
          let r, h;
          if (e.grouped) {
            const i = o ? this._getStackCount(t) : e.stackCount,
              l =
                "flex" === n.barThickness
                  ? (function (t, e, i, s) {
                      const n = e.pixels,
                        o = n[t];
                      let a = t > 0 ? n[t - 1] : null,
                        r = t < n.length - 1 ? n[t + 1] : null;
                      const h = i.categoryPercentage;
                      null === a &&
                        (a = o - (null === r ? e.end - e.start : r - o)),
                        null === r && (r = o + o - a);
                      const l = o - ((o - Math.min(a, r)) / 2) * h;
                      return {
                        chunk: ((Math.abs(r - a) / 2) * h) / s,
                        ratio: i.barPercentage,
                        start: l,
                      };
                    })(t, e, n, i)
                  : (function (t, e, i, n) {
                      const o = i.barThickness;
                      let a, r;
                      return (
                        (0, s.k)(o)
                          ? ((a = e.min * i.categoryPercentage),
                            (r = i.barPercentage))
                          : ((a = o * n), (r = 1)),
                        { chunk: a / n, ratio: r, start: e.pixels[t] - a / 2 }
                      );
                    })(t, e, n, i),
              c = this._getStackIndex(
                this.index,
                this._cachedMeta.stack,
                o ? t : void 0
              );
            (r = l.start + l.chunk * c + l.chunk / 2),
              (h = Math.min(a, l.chunk * l.ratio));
          } else
            (r = i.getPixelForValue(this.getParsed(t)[i.axis], t)),
              (h = Math.min(a, e.min * e.ratio));
          return { base: r - h / 2, head: r + h / 2, center: r, size: h };
        }
        draw() {
          const t = this._cachedMeta,
            e = t.vScale,
            i = t.data,
            s = i.length;
          let n = 0;
          for (; n < s; ++n)
            null !== this.getParsed(n)[e.axis] && i[n].draw(this._ctx);
        }
      }
      (O.id = "bar"),
        (O.defaults = {
          datasetElementType: !1,
          dataElementType: "bar",
          categoryPercentage: 0.8,
          barPercentage: 0.9,
          grouped: !0,
          animations: {
            numbers: {
              type: "number",
              properties: ["x", "y", "base", "width", "height"],
            },
          },
        }),
        (O.overrides = {
          scales: {
            _index_: { type: "category", offset: !0, grid: { offset: !0 } },
            _value_: { type: "linear", beginAtZero: !0 },
          },
        });
      class L extends y {
        initialize() {
          (this.enableOptionSharing = !0), super.initialize();
        }
        parsePrimitiveData(t, e, i, s) {
          const n = super.parsePrimitiveData(t, e, i, s);
          for (let o = 0; o < n.length; o++)
            n[o]._custom = this.resolveDataElementOptions(o + i).radius;
          return n;
        }
        parseArrayData(t, e, i, n) {
          const o = super.parseArrayData(t, e, i, n);
          for (let a = 0; a < o.length; a++) {
            const t = e[i + a];
            o[a]._custom = (0, s.v)(
              t[2],
              this.resolveDataElementOptions(a + i).radius
            );
          }
          return o;
        }
        parseObjectData(t, e, i, n) {
          const o = super.parseObjectData(t, e, i, n);
          for (let a = 0; a < o.length; a++) {
            const t = e[i + a];
            o[a]._custom = (0, s.v)(
              t && t.r && +t.r,
              this.resolveDataElementOptions(a + i).radius
            );
          }
          return o;
        }
        getMaxOverflow() {
          const t = this._cachedMeta.data;
          let e = 0;
          for (let i = t.length - 1; i >= 0; --i)
            e = Math.max(e, t[i].size(this.resolveDataElementOptions(i)) / 2);
          return e > 0 && e;
        }
        getLabelAndValue(t) {
          const e = this._cachedMeta,
            { xScale: i, yScale: s } = e,
            n = this.getParsed(t),
            o = i.getLabelForValue(n.x),
            a = s.getLabelForValue(n.y),
            r = n._custom;
          return {
            label: e.label,
            value: "(" + o + ", " + a + (r ? ", " + r : "") + ")",
          };
        }
        update(t) {
          const e = this._cachedMeta.data;
          this.updateElements(e, 0, e.length, t);
        }
        updateElements(t, e, i, s) {
          const n = "reset" === s,
            { iScale: o, vScale: a } = this._cachedMeta,
            { sharedOptions: r, includeOptions: h } = this._getSharedOptions(
              e,
              s
            ),
            l = o.axis,
            c = a.axis;
          for (let d = e; d < e + i; d++) {
            const e = t[d],
              i = !n && this.getParsed(d),
              u = {},
              g = (u[l] = n
                ? o.getPixelForDecimal(0.5)
                : o.getPixelForValue(i[l])),
              p = (u[c] = n ? a.getBasePixel() : a.getPixelForValue(i[c]));
            (u.skip = isNaN(g) || isNaN(p)),
              h &&
                ((u.options =
                  r ||
                  this.resolveDataElementOptions(d, e.active ? "active" : s)),
                n && (u.options.radius = 0)),
              this.updateElement(e, d, u, s);
          }
        }
        resolveDataElementOptions(t, e) {
          const i = this.getParsed(t);
          let n = super.resolveDataElementOptions(t, e);
          n.$shared && (n = Object.assign({}, n, { $shared: !1 }));
          const o = n.radius;
          return (
            "active" !== e && (n.radius = 0),
            (n.radius += (0, s.v)(i && i._custom, o)),
            n
          );
        }
      }
      (L.id = "bubble"),
        (L.defaults = {
          datasetElementType: !1,
          dataElementType: "point",
          animations: {
            numbers: {
              type: "number",
              properties: ["x", "y", "borderWidth", "radius"],
            },
          },
        }),
        (L.overrides = {
          scales: { x: { type: "linear" }, y: { type: "linear" } },
          plugins: { tooltip: { callbacks: { title: () => "" } } },
        });
      class E extends y {
        constructor(t, e) {
          super(t, e),
            (this.enableOptionSharing = !0),
            (this.innerRadius = void 0),
            (this.outerRadius = void 0),
            (this.offsetX = void 0),
            (this.offsetY = void 0);
        }
        linkScales() {}
        parse(t, e) {
          const i = this.getDataset().data,
            n = this._cachedMeta;
          if (!1 === this._parsing) n._parsed = i;
          else {
            let o,
              a,
              r = (t) => +i[t];
            if ((0, s.i)(i[t])) {
              const { key: t = "value" } = this._parsing;
              r = (e) => +(0, s.f)(i[e], t);
            }
            for (o = t, a = t + e; o < a; ++o) n._parsed[o] = r(o);
          }
        }
        _getRotation() {
          return (0, s.t)(this.options.rotation - 90);
        }
        _getCircumference() {
          return (0, s.t)(this.options.circumference);
        }
        _getRotationExtents() {
          let t = s.T,
            e = -s.T;
          for (let i = 0; i < this.chart.data.datasets.length; ++i)
            if (this.chart.isDatasetVisible(i)) {
              const s = this.chart.getDatasetMeta(i).controller,
                n = s._getRotation(),
                o = s._getCircumference();
              (t = Math.min(t, n)), (e = Math.max(e, n + o));
            }
          return { rotation: t, circumference: e - t };
        }
        update(t) {
          const e = this.chart,
            { chartArea: i } = e,
            n = this._cachedMeta,
            o = n.data,
            a =
              this.getMaxBorderWidth() +
              this.getMaxOffset(o) +
              this.options.spacing,
            r = Math.max((Math.min(i.width, i.height) - a) / 2, 0),
            h = Math.min((0, s.m)(this.options.cutout, r), 1),
            l = this._getRingWeight(this.index),
            { circumference: c, rotation: d } = this._getRotationExtents(),
            {
              ratioX: u,
              ratioY: g,
              offsetX: p,
              offsetY: f,
            } = (function (t, e, i) {
              let n = 1,
                o = 1,
                a = 0,
                r = 0;
              if (e < s.T) {
                const h = t,
                  l = h + e,
                  c = Math.cos(h),
                  d = Math.sin(h),
                  u = Math.cos(l),
                  g = Math.sin(l),
                  p = (t, e, n) =>
                    (0, s.p)(t, h, l, !0) ? 1 : Math.max(e, e * i, n, n * i),
                  f = (t, e, n) =>
                    (0, s.p)(t, h, l, !0) ? -1 : Math.min(e, e * i, n, n * i),
                  m = p(0, c, u),
                  x = p(s.H, d, g),
                  b = f(s.P, c, u),
                  _ = f(s.P + s.H, d, g);
                (n = (m - b) / 2),
                  (o = (x - _) / 2),
                  (a = -(m + b) / 2),
                  (r = -(x + _) / 2);
              }
              return { ratioX: n, ratioY: o, offsetX: a, offsetY: r };
            })(d, c, h),
            m = (i.width - a) / u,
            x = (i.height - a) / g,
            b = Math.max(Math.min(m, x) / 2, 0),
            _ = (0, s.n)(this.options.radius, b),
            v = (_ - Math.max(_ * h, 0)) / this._getVisibleDatasetWeightTotal();
          (this.offsetX = p * _),
            (this.offsetY = f * _),
            (n.total = this.calculateTotal()),
            (this.outerRadius = _ - v * this._getRingWeightOffset(this.index)),
            (this.innerRadius = Math.max(this.outerRadius - v * l, 0)),
            this.updateElements(o, 0, o.length, t);
        }
        _circumference(t, e) {
          const i = this.options,
            n = this._cachedMeta,
            o = this._getCircumference();
          return (e && i.animation.animateRotate) ||
            !this.chart.getDataVisibility(t) ||
            null === n._parsed[t] ||
            n.data[t].hidden
            ? 0
            : this.calculateCircumference((n._parsed[t] * o) / s.T);
        }
        updateElements(t, e, i, s) {
          const n = "reset" === s,
            o = this.chart,
            a = o.chartArea,
            r = o.options.animation,
            h = (a.left + a.right) / 2,
            l = (a.top + a.bottom) / 2,
            c = n && r.animateScale,
            d = c ? 0 : this.innerRadius,
            u = c ? 0 : this.outerRadius,
            { sharedOptions: g, includeOptions: p } = this._getSharedOptions(
              e,
              s
            );
          let f,
            m = this._getRotation();
          for (f = 0; f < e; ++f) m += this._circumference(f, n);
          for (f = e; f < e + i; ++f) {
            const e = this._circumference(f, n),
              i = t[f],
              o = {
                x: h + this.offsetX,
                y: l + this.offsetY,
                startAngle: m,
                endAngle: m + e,
                circumference: e,
                outerRadius: u,
                innerRadius: d,
              };
            p &&
              (o.options =
                g ||
                this.resolveDataElementOptions(f, i.active ? "active" : s)),
              (m += e),
              this.updateElement(i, f, o, s);
          }
        }
        calculateTotal() {
          const t = this._cachedMeta,
            e = t.data;
          let i,
            s = 0;
          for (i = 0; i < e.length; i++) {
            const n = t._parsed[i];
            null === n ||
              isNaN(n) ||
              !this.chart.getDataVisibility(i) ||
              e[i].hidden ||
              (s += Math.abs(n));
          }
          return s;
        }
        calculateCircumference(t) {
          const e = this._cachedMeta.total;
          return e > 0 && !isNaN(t) ? s.T * (Math.abs(t) / e) : 0;
        }
        getLabelAndValue(t) {
          const e = this._cachedMeta,
            i = this.chart,
            n = i.data.labels || [],
            o = (0, s.o)(e._parsed[t], i.options.locale);
          return { label: n[t] || "", value: o };
        }
        getMaxBorderWidth(t) {
          let e = 0;
          const i = this.chart;
          let s, n, o, a, r;
          if (!t)
            for (s = 0, n = i.data.datasets.length; s < n; ++s)
              if (i.isDatasetVisible(s)) {
                (o = i.getDatasetMeta(s)), (t = o.data), (a = o.controller);
                break;
              }
          if (!t) return 0;
          for (s = 0, n = t.length; s < n; ++s)
            (r = a.resolveDataElementOptions(s)),
              "inner" !== r.borderAlign &&
                (e = Math.max(e, r.borderWidth || 0, r.hoverBorderWidth || 0));
          return e;
        }
        getMaxOffset(t) {
          let e = 0;
          for (let i = 0, s = t.length; i < s; ++i) {
            const t = this.resolveDataElementOptions(i);
            e = Math.max(e, t.offset || 0, t.hoverOffset || 0);
          }
          return e;
        }
        _getRingWeightOffset(t) {
          let e = 0;
          for (let i = 0; i < t; ++i)
            this.chart.isDatasetVisible(i) && (e += this._getRingWeight(i));
          return e;
        }
        _getRingWeight(t) {
          return Math.max((0, s.v)(this.chart.data.datasets[t].weight, 1), 0);
        }
        _getVisibleDatasetWeightTotal() {
          return (
            this._getRingWeightOffset(this.chart.data.datasets.length) || 1
          );
        }
      }
      (E.id = "doughnut"),
        (E.defaults = {
          datasetElementType: !1,
          dataElementType: "arc",
          animation: { animateRotate: !0, animateScale: !1 },
          animations: {
            numbers: {
              type: "number",
              properties: [
                "circumference",
                "endAngle",
                "innerRadius",
                "outerRadius",
                "startAngle",
                "x",
                "y",
                "offset",
                "borderWidth",
                "spacing",
              ],
            },
          },
          cutout: "50%",
          rotation: 0,
          circumference: 360,
          radius: "100%",
          spacing: 0,
          indexAxis: "r",
        }),
        (E.descriptors = {
          _scriptable: (t) => "spacing" !== t,
          _indexable: (t) => "spacing" !== t,
        }),
        (E.overrides = {
          aspectRatio: 1,
          plugins: {
            legend: {
              labels: {
                generateLabels(t) {
                  const e = t.data;
                  if (e.labels.length && e.datasets.length) {
                    const {
                      labels: { pointStyle: i },
                    } = t.legend.options;
                    return e.labels.map((e, s) => {
                      const n = t.getDatasetMeta(0).controller.getStyle(s);
                      return {
                        text: e,
                        fillStyle: n.backgroundColor,
                        strokeStyle: n.borderColor,
                        lineWidth: n.borderWidth,
                        pointStyle: i,
                        hidden: !t.getDataVisibility(s),
                        index: s,
                      };
                    });
                  }
                  return [];
                },
              },
              onClick(t, e, i) {
                i.chart.toggleDataVisibility(e.index), i.chart.update();
              },
            },
            tooltip: {
              callbacks: {
                title: () => "",
                label(t) {
                  let e = t.label;
                  const i = ": " + t.formattedValue;
                  return (
                    (0, s.b)(e) ? ((e = e.slice()), (e[0] += i)) : (e += i), e
                  );
                },
              },
            },
          },
        });
      class T extends y {
        initialize() {
          (this.enableOptionSharing = !0),
            (this.supportsDecimation = !0),
            super.initialize();
        }
        update(t) {
          const e = this._cachedMeta,
            { dataset: i, data: n = [], _dataset: o } = e,
            a = this.chart._animationsDisabled;
          let { start: r, count: h } = (0, s.q)(e, n, a);
          (this._drawStart = r),
            (this._drawCount = h),
            (0, s.w)(e) && ((r = 0), (h = n.length)),
            (i._chart = this.chart),
            (i._datasetIndex = this.index),
            (i._decimated = !!o._decimated),
            (i.points = n);
          const l = this.resolveDatasetElementOptions(t);
          this.options.showLine || (l.borderWidth = 0),
            (l.segment = this.options.segment),
            this.updateElement(i, void 0, { animated: !a, options: l }, t),
            this.updateElements(n, r, h, t);
        }
        updateElements(t, e, i, n) {
          const o = "reset" === n,
            {
              iScale: a,
              vScale: r,
              _stacked: h,
              _dataset: l,
            } = this._cachedMeta,
            { sharedOptions: c, includeOptions: d } = this._getSharedOptions(
              e,
              n
            ),
            u = a.axis,
            g = r.axis,
            { spanGaps: p, segment: f } = this.options,
            m = (0, s.x)(p) ? p : Number.POSITIVE_INFINITY,
            x = this.chart._animationsDisabled || o || "none" === n;
          let b = e > 0 && this.getParsed(e - 1);
          for (let _ = e; _ < e + i; ++_) {
            const e = t[_],
              i = this.getParsed(_),
              p = x ? e : {},
              v = (0, s.k)(i[g]),
              y = (p[u] = a.getPixelForValue(i[u], _)),
              M = (p[g] =
                o || v
                  ? r.getBasePixel()
                  : r.getPixelForValue(h ? this.applyStack(r, i, h) : i[g], _));
            (p.skip = isNaN(y) || isNaN(M) || v),
              (p.stop = _ > 0 && Math.abs(i[u] - b[u]) > m),
              f && ((p.parsed = i), (p.raw = l.data[_])),
              d &&
                (p.options =
                  c ||
                  this.resolveDataElementOptions(_, e.active ? "active" : n)),
              x || this.updateElement(e, _, p, n),
              (b = i);
          }
        }
        getMaxOverflow() {
          const t = this._cachedMeta,
            e = t.dataset,
            i = (e.options && e.options.borderWidth) || 0,
            s = t.data || [];
          if (!s.length) return i;
          const n = s[0].size(this.resolveDataElementOptions(0)),
            o = s[s.length - 1].size(
              this.resolveDataElementOptions(s.length - 1)
            );
          return Math.max(i, n, o) / 2;
        }
        draw() {
          const t = this._cachedMeta;
          t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis),
            super.draw();
        }
      }
      (T.id = "line"),
        (T.defaults = {
          datasetElementType: "line",
          dataElementType: "point",
          showLine: !0,
          spanGaps: !1,
        }),
        (T.overrides = {
          scales: {
            _index_: { type: "category" },
            _value_: { type: "linear" },
          },
        });
      class R extends y {
        constructor(t, e) {
          super(t, e), (this.innerRadius = void 0), (this.outerRadius = void 0);
        }
        getLabelAndValue(t) {
          const e = this._cachedMeta,
            i = this.chart,
            n = i.data.labels || [],
            o = (0, s.o)(e._parsed[t].r, i.options.locale);
          return { label: n[t] || "", value: o };
        }
        parseObjectData(t, e, i, n) {
          return s.y.bind(this)(t, e, i, n);
        }
        update(t) {
          const e = this._cachedMeta.data;
          this._updateRadius(), this.updateElements(e, 0, e.length, t);
        }
        getMinMax() {
          const t = this._cachedMeta,
            e = {
              min: Number.POSITIVE_INFINITY,
              max: Number.NEGATIVE_INFINITY,
            };
          return (
            t.data.forEach((t, i) => {
              const s = this.getParsed(i).r;
              !isNaN(s) &&
                this.chart.getDataVisibility(i) &&
                (s < e.min && (e.min = s), s > e.max && (e.max = s));
            }),
            e
          );
        }
        _updateRadius() {
          const t = this.chart,
            e = t.chartArea,
            i = t.options,
            s = Math.min(e.right - e.left, e.bottom - e.top),
            n = Math.max(s / 2, 0),
            o =
              (n -
                Math.max(
                  i.cutoutPercentage ? (n / 100) * i.cutoutPercentage : 1,
                  0
                )) /
              t.getVisibleDatasetCount();
          (this.outerRadius = n - o * this.index),
            (this.innerRadius = this.outerRadius - o);
        }
        updateElements(t, e, i, n) {
          const o = "reset" === n,
            a = this.chart,
            r = a.options.animation,
            h = this._cachedMeta.rScale,
            l = h.xCenter,
            c = h.yCenter,
            d = h.getIndexAngle(0) - 0.5 * s.P;
          let u,
            g = d;
          const p = 360 / this.countVisibleElements();
          for (u = 0; u < e; ++u) g += this._computeAngle(u, n, p);
          for (u = e; u < e + i; u++) {
            const e = t[u];
            let i = g,
              s = g + this._computeAngle(u, n, p),
              f = a.getDataVisibility(u)
                ? h.getDistanceFromCenterForValue(this.getParsed(u).r)
                : 0;
            (g = s),
              o && (r.animateScale && (f = 0), r.animateRotate && (i = s = d));
            const m = {
              x: l,
              y: c,
              innerRadius: 0,
              outerRadius: f,
              startAngle: i,
              endAngle: s,
              options: this.resolveDataElementOptions(
                u,
                e.active ? "active" : n
              ),
            };
            this.updateElement(e, u, m, n);
          }
        }
        countVisibleElements() {
          const t = this._cachedMeta;
          let e = 0;
          return (
            t.data.forEach((t, i) => {
              !isNaN(this.getParsed(i).r) &&
                this.chart.getDataVisibility(i) &&
                e++;
            }),
            e
          );
        }
        _computeAngle(t, e, i) {
          return this.chart.getDataVisibility(t)
            ? (0, s.t)(this.resolveDataElementOptions(t, e).angle || i)
            : 0;
        }
      }
      (R.id = "polarArea"),
        (R.defaults = {
          dataElementType: "arc",
          animation: { animateRotate: !0, animateScale: !0 },
          animations: {
            numbers: {
              type: "number",
              properties: [
                "x",
                "y",
                "startAngle",
                "endAngle",
                "innerRadius",
                "outerRadius",
              ],
            },
          },
          indexAxis: "r",
          startAngle: 0,
        }),
        (R.overrides = {
          aspectRatio: 1,
          plugins: {
            legend: {
              labels: {
                generateLabels(t) {
                  const e = t.data;
                  if (e.labels.length && e.datasets.length) {
                    const {
                      labels: { pointStyle: i },
                    } = t.legend.options;
                    return e.labels.map((e, s) => {
                      const n = t.getDatasetMeta(0).controller.getStyle(s);
                      return {
                        text: e,
                        fillStyle: n.backgroundColor,
                        strokeStyle: n.borderColor,
                        lineWidth: n.borderWidth,
                        pointStyle: i,
                        hidden: !t.getDataVisibility(s),
                        index: s,
                      };
                    });
                  }
                  return [];
                },
              },
              onClick(t, e, i) {
                i.chart.toggleDataVisibility(e.index), i.chart.update();
              },
            },
            tooltip: {
              callbacks: {
                title: () => "",
                label: (t) =>
                  t.chart.data.labels[t.dataIndex] + ": " + t.formattedValue,
              },
            },
          },
          scales: {
            r: {
              type: "radialLinear",
              angleLines: { display: !1 },
              beginAtZero: !0,
              grid: { circular: !0 },
              pointLabels: { display: !1 },
              startAngle: 0,
            },
          },
        });
      class z extends E {}
      (z.id = "pie"),
        (z.defaults = {
          cutout: 0,
          rotation: 0,
          circumference: 360,
          radius: "100%",
        });
      class I extends y {
        getLabelAndValue(t) {
          const e = this._cachedMeta.vScale,
            i = this.getParsed(t);
          return {
            label: e.getLabels()[t],
            value: "" + e.getLabelForValue(i[e.axis]),
          };
        }
        parseObjectData(t, e, i, n) {
          return s.y.bind(this)(t, e, i, n);
        }
        update(t) {
          const e = this._cachedMeta,
            i = e.dataset,
            s = e.data || [],
            n = e.iScale.getLabels();
          if (((i.points = s), "resize" !== t)) {
            const e = this.resolveDatasetElementOptions(t);
            this.options.showLine || (e.borderWidth = 0);
            const o = {
              _loop: !0,
              _fullLoop: n.length === s.length,
              options: e,
            };
            this.updateElement(i, void 0, o, t);
          }
          this.updateElements(s, 0, s.length, t);
        }
        updateElements(t, e, i, s) {
          const n = this._cachedMeta.rScale,
            o = "reset" === s;
          for (let a = e; a < e + i; a++) {
            const e = t[a],
              i = this.resolveDataElementOptions(a, e.active ? "active" : s),
              r = n.getPointPositionForValue(a, this.getParsed(a).r),
              h = o ? n.xCenter : r.x,
              l = o ? n.yCenter : r.y,
              c = {
                x: h,
                y: l,
                angle: r.angle,
                skip: isNaN(h) || isNaN(l),
                options: i,
              };
            this.updateElement(e, a, c, s);
          }
        }
      }
      (I.id = "radar"),
        (I.defaults = {
          datasetElementType: "line",
          dataElementType: "point",
          indexAxis: "r",
          showLine: !0,
          elements: { line: { fill: "start" } },
        }),
        (I.overrides = {
          aspectRatio: 1,
          scales: { r: { type: "radialLinear" } },
        });
      class F {
        constructor() {
          (this.x = void 0),
            (this.y = void 0),
            (this.active = !1),
            (this.options = void 0),
            (this.$animations = void 0);
        }
        tooltipPosition(t) {
          const { x: e, y: i } = this.getProps(["x", "y"], t);
          return { x: e, y: i };
        }
        hasValue() {
          return (0, s.x)(this.x) && (0, s.x)(this.y);
        }
        getProps(t, e) {
          const i = this.$animations;
          if (!e || !i) return this;
          const s = {};
          return (
            t.forEach((t) => {
              s[t] = i[t] && i[t].active() ? i[t]._to : this[t];
            }),
            s
          );
        }
      }
      (F.defaults = {}), (F.defaultRoutes = void 0);
      const V = {
        values: (t) => ((0, s.b)(t) ? t : "" + t),
        numeric(t, e, i) {
          if (0 === t) return "0";
          const n = this.chart.options.locale;
          let o,
            a = t;
          if (i.length > 1) {
            const e = Math.max(
              Math.abs(i[0].value),
              Math.abs(i[i.length - 1].value)
            );
            (e < 1e-4 || e > 1e15) && (o = "scientific"),
              (a = (function (t, e) {
                let i =
                  e.length > 3
                    ? e[2].value - e[1].value
                    : e[1].value - e[0].value;
                Math.abs(i) >= 1 &&
                  t !== Math.floor(t) &&
                  (i = t - Math.floor(t));
                return i;
              })(t, i));
          }
          const r = (0, s.z)(Math.abs(a)),
            h = Math.max(Math.min(-1 * Math.floor(r), 20), 0),
            l = {
              notation: o,
              minimumFractionDigits: h,
              maximumFractionDigits: h,
            };
          return Object.assign(l, this.options.ticks.format), (0, s.o)(t, n, l);
        },
        logarithmic(t, e, i) {
          if (0 === t) return "0";
          const n = t / Math.pow(10, Math.floor((0, s.z)(t)));
          return 1 === n || 2 === n || 5 === n
            ? V.numeric.call(this, t, e, i)
            : "";
        },
      };
      var B = { formatters: V };
      function N(t, e) {
        const i = t.options.ticks,
          n =
            i.maxTicksLimit ||
            (function (t) {
              const e = t.options.offset,
                i = t._tickSize(),
                s = t._length / i + (e ? 0 : 1),
                n = t._maxLength / i;
              return Math.floor(Math.min(s, n));
            })(t),
          o = i.major.enabled
            ? (function (t) {
                const e = [];
                let i, s;
                for (i = 0, s = t.length; i < s; i++) t[i].major && e.push(i);
                return e;
              })(e)
            : [],
          a = o.length,
          r = o[0],
          h = o[a - 1],
          l = [];
        if (a > n)
          return (
            (function (t, e, i, s) {
              let n,
                o = 0,
                a = i[0];
              for (s = Math.ceil(s), n = 0; n < t.length; n++)
                n === a && (e.push(t[n]), o++, (a = i[o * s]));
            })(e, l, o, a / n),
            l
          );
        const c = (function (t, e, i) {
          const n = (function (t) {
              const e = t.length;
              let i, s;
              if (e < 2) return !1;
              for (s = t[0], i = 1; i < e; ++i)
                if (t[i] - t[i - 1] !== s) return !1;
              return s;
            })(t),
            o = e.length / i;
          if (!n) return Math.max(o, 1);
          const a = (0, s.A)(n);
          for (let s = 0, r = a.length - 1; s < r; s++) {
            const t = a[s];
            if (t > o) return t;
          }
          return Math.max(o, 1);
        })(o, e, n);
        if (a > 0) {
          let t, i;
          const n = a > 1 ? Math.round((h - r) / (a - 1)) : null;
          for (
            H(e, l, c, (0, s.k)(n) ? 0 : r - n, r), t = 0, i = a - 1;
            t < i;
            t++
          )
            H(e, l, c, o[t], o[t + 1]);
          return H(e, l, c, h, (0, s.k)(n) ? e.length : h + n), l;
        }
        return H(e, l, c), l;
      }
      function H(t, e, i, n, o) {
        const a = (0, s.v)(n, 0),
          r = Math.min((0, s.v)(o, t.length), t.length);
        let h,
          l,
          c,
          d = 0;
        for (
          i = Math.ceil(i),
            o && ((h = o - n), (i = h / Math.floor(h / i))),
            c = a;
          c < 0;

        )
          d++, (c = Math.round(a + d * i));
        for (l = Math.max(a, 0); l < r; l++)
          l === c && (e.push(t[l]), d++, (c = Math.round(a + d * i)));
      }
      s.d.set("scale", {
        display: !0,
        offset: !1,
        reverse: !1,
        beginAtZero: !1,
        bounds: "ticks",
        grace: 0,
        grid: {
          display: !0,
          lineWidth: 1,
          drawBorder: !0,
          drawOnChartArea: !0,
          drawTicks: !0,
          tickLength: 8,
          tickWidth: (t, e) => e.lineWidth,
          tickColor: (t, e) => e.color,
          offset: !1,
          borderDash: [],
          borderDashOffset: 0,
          borderWidth: 1,
        },
        title: { display: !1, text: "", padding: { top: 4, bottom: 4 } },
        ticks: {
          minRotation: 0,
          maxRotation: 50,
          mirror: !1,
          textStrokeWidth: 0,
          textStrokeColor: "",
          padding: 3,
          display: !0,
          autoSkip: !0,
          autoSkipPadding: 3,
          labelOffset: 0,
          callback: B.formatters.values,
          minor: {},
          major: {},
          align: "center",
          crossAlign: "near",
          showLabelBackdrop: !1,
          backdropColor: "rgba(255, 255, 255, 0.75)",
          backdropPadding: 2,
        },
      }),
        s.d.route("scale.ticks", "color", "", "color"),
        s.d.route("scale.grid", "color", "", "borderColor"),
        s.d.route("scale.grid", "borderColor", "", "borderColor"),
        s.d.route("scale.title", "color", "", "color"),
        s.d.describe("scale", {
          _fallback: !1,
          _scriptable: (t) =>
            !t.startsWith("before") &&
            !t.startsWith("after") &&
            "callback" !== t &&
            "parser" !== t,
          _indexable: (t) => "borderDash" !== t && "tickBorderDash" !== t,
        }),
        s.d.describe("scales", { _fallback: "scale" }),
        s.d.describe("scale.ticks", {
          _scriptable: (t) => "backdropPadding" !== t && "callback" !== t,
          _indexable: (t) => "backdropPadding" !== t,
        });
      const W = (t, e, i) =>
        "top" === e || "left" === e ? t[e] + i : t[e] - i;
      function j(t, e) {
        const i = [],
          s = t.length / e,
          n = t.length;
        let o = 0;
        for (; o < n; o += s) i.push(t[Math.floor(o)]);
        return i;
      }
      function $(t, e, i) {
        const s = t.ticks.length,
          n = Math.min(e, s - 1),
          o = t._startPixel,
          a = t._endPixel,
          r = 1e-6;
        let h,
          l = t.getPixelForTick(n);
        if (
          !(
            i &&
            ((h =
              1 === s
                ? Math.max(l - o, a - l)
                : 0 === e
                ? (t.getPixelForTick(1) - l) / 2
                : (l - t.getPixelForTick(n - 1)) / 2),
            (l += n < e ? h : -h),
            l < o - r || l > a + r)
          )
        )
          return l;
      }
      function U(t) {
        return t.drawTicks ? t.tickLength : 0;
      }
      function Y(t, e) {
        if (!t.display) return 0;
        const i = (0, s.O)(t.font, e),
          n = (0, s.K)(t.padding);
        return ((0, s.b)(t.text) ? t.text.length : 1) * i.lineHeight + n.height;
      }
      function K(t, e, i) {
        let n = (0, s.R)(t);
        return (
          ((i && "right" !== e) || (!i && "right" === e)) &&
            (n = ((t) => ("left" === t ? "right" : "right" === t ? "left" : t))(
              n
            )),
          n
        );
      }
      class X extends F {
        constructor(t) {
          super(),
            (this.id = t.id),
            (this.type = t.type),
            (this.options = void 0),
            (this.ctx = t.ctx),
            (this.chart = t.chart),
            (this.top = void 0),
            (this.bottom = void 0),
            (this.left = void 0),
            (this.right = void 0),
            (this.width = void 0),
            (this.height = void 0),
            (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
            (this.maxWidth = void 0),
            (this.maxHeight = void 0),
            (this.paddingTop = void 0),
            (this.paddingBottom = void 0),
            (this.paddingLeft = void 0),
            (this.paddingRight = void 0),
            (this.axis = void 0),
            (this.labelRotation = void 0),
            (this.min = void 0),
            (this.max = void 0),
            (this._range = void 0),
            (this.ticks = []),
            (this._gridLineItems = null),
            (this._labelItems = null),
            (this._labelSizes = null),
            (this._length = 0),
            (this._maxLength = 0),
            (this._longestTextCache = {}),
            (this._startPixel = void 0),
            (this._endPixel = void 0),
            (this._reversePixels = !1),
            (this._userMax = void 0),
            (this._userMin = void 0),
            (this._suggestedMax = void 0),
            (this._suggestedMin = void 0),
            (this._ticksLength = 0),
            (this._borderValue = 0),
            (this._cache = {}),
            (this._dataLimitsCached = !1),
            (this.$context = void 0);
        }
        init(t) {
          (this.options = t.setContext(this.getContext())),
            (this.axis = t.axis),
            (this._userMin = this.parse(t.min)),
            (this._userMax = this.parse(t.max)),
            (this._suggestedMin = this.parse(t.suggestedMin)),
            (this._suggestedMax = this.parse(t.suggestedMax));
        }
        parse(t, e) {
          return t;
        }
        getUserBounds() {
          let {
            _userMin: t,
            _userMax: e,
            _suggestedMin: i,
            _suggestedMax: n,
          } = this;
          return (
            (t = (0, s.B)(t, Number.POSITIVE_INFINITY)),
            (e = (0, s.B)(e, Number.NEGATIVE_INFINITY)),
            (i = (0, s.B)(i, Number.POSITIVE_INFINITY)),
            (n = (0, s.B)(n, Number.NEGATIVE_INFINITY)),
            {
              min: (0, s.B)(t, i),
              max: (0, s.B)(e, n),
              minDefined: (0, s.g)(t),
              maxDefined: (0, s.g)(e),
            }
          );
        }
        getMinMax(t) {
          let e,
            {
              min: i,
              max: n,
              minDefined: o,
              maxDefined: a,
            } = this.getUserBounds();
          if (o && a) return { min: i, max: n };
          const r = this.getMatchingVisibleMetas();
          for (let s = 0, h = r.length; s < h; ++s)
            (e = r[s].controller.getMinMax(this, t)),
              o || (i = Math.min(i, e.min)),
              a || (n = Math.max(n, e.max));
          return (
            (i = a && i > n ? n : i),
            (n = o && i > n ? i : n),
            {
              min: (0, s.B)(i, (0, s.B)(n, i)),
              max: (0, s.B)(n, (0, s.B)(i, n)),
            }
          );
        }
        getPadding() {
          return {
            left: this.paddingLeft || 0,
            top: this.paddingTop || 0,
            right: this.paddingRight || 0,
            bottom: this.paddingBottom || 0,
          };
        }
        getTicks() {
          return this.ticks;
        }
        getLabels() {
          const t = this.chart.data;
          return (
            this.options.labels ||
            (this.isHorizontal() ? t.xLabels : t.yLabels) ||
            t.labels ||
            []
          );
        }
        beforeLayout() {
          (this._cache = {}), (this._dataLimitsCached = !1);
        }
        beforeUpdate() {
          (0, s.C)(this.options.beforeUpdate, [this]);
        }
        update(t, e, i) {
          const { beginAtZero: n, grace: o, ticks: a } = this.options,
            r = a.sampleSize;
          this.beforeUpdate(),
            (this.maxWidth = t),
            (this.maxHeight = e),
            (this._margins = i =
              Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, i)),
            (this.ticks = null),
            (this._labelSizes = null),
            (this._gridLineItems = null),
            (this._labelItems = null),
            this.beforeSetDimensions(),
            this.setDimensions(),
            this.afterSetDimensions(),
            (this._maxLength = this.isHorizontal()
              ? this.width + i.left + i.right
              : this.height + i.top + i.bottom),
            this._dataLimitsCached ||
              (this.beforeDataLimits(),
              this.determineDataLimits(),
              this.afterDataLimits(),
              (this._range = (0, s.D)(this, o, n)),
              (this._dataLimitsCached = !0)),
            this.beforeBuildTicks(),
            (this.ticks = this.buildTicks() || []),
            this.afterBuildTicks();
          const h = r < this.ticks.length;
          this._convertTicksToLabels(h ? j(this.ticks, r) : this.ticks),
            this.configure(),
            this.beforeCalculateLabelRotation(),
            this.calculateLabelRotation(),
            this.afterCalculateLabelRotation(),
            a.display &&
              (a.autoSkip || "auto" === a.source) &&
              ((this.ticks = N(this, this.ticks)),
              (this._labelSizes = null),
              this.afterAutoSkip()),
            h && this._convertTicksToLabels(this.ticks),
            this.beforeFit(),
            this.fit(),
            this.afterFit(),
            this.afterUpdate();
        }
        configure() {
          let t,
            e,
            i = this.options.reverse;
          this.isHorizontal()
            ? ((t = this.left), (e = this.right))
            : ((t = this.top), (e = this.bottom), (i = !i)),
            (this._startPixel = t),
            (this._endPixel = e),
            (this._reversePixels = i),
            (this._length = e - t),
            (this._alignToPixels = this.options.alignToPixels);
        }
        afterUpdate() {
          (0, s.C)(this.options.afterUpdate, [this]);
        }
        beforeSetDimensions() {
          (0, s.C)(this.options.beforeSetDimensions, [this]);
        }
        setDimensions() {
          this.isHorizontal()
            ? ((this.width = this.maxWidth),
              (this.left = 0),
              (this.right = this.width))
            : ((this.height = this.maxHeight),
              (this.top = 0),
              (this.bottom = this.height)),
            (this.paddingLeft = 0),
            (this.paddingTop = 0),
            (this.paddingRight = 0),
            (this.paddingBottom = 0);
        }
        afterSetDimensions() {
          (0, s.C)(this.options.afterSetDimensions, [this]);
        }
        _callHooks(t) {
          this.chart.notifyPlugins(t, this.getContext()),
            (0, s.C)(this.options[t], [this]);
        }
        beforeDataLimits() {
          this._callHooks("beforeDataLimits");
        }
        determineDataLimits() {}
        afterDataLimits() {
          this._callHooks("afterDataLimits");
        }
        beforeBuildTicks() {
          this._callHooks("beforeBuildTicks");
        }
        buildTicks() {
          return [];
        }
        afterBuildTicks() {
          this._callHooks("afterBuildTicks");
        }
        beforeTickToLabelConversion() {
          (0, s.C)(this.options.beforeTickToLabelConversion, [this]);
        }
        generateTickLabels(t) {
          const e = this.options.ticks;
          let i, n, o;
          for (i = 0, n = t.length; i < n; i++)
            (o = t[i]), (o.label = (0, s.C)(e.callback, [o.value, i, t], this));
        }
        afterTickToLabelConversion() {
          (0, s.C)(this.options.afterTickToLabelConversion, [this]);
        }
        beforeCalculateLabelRotation() {
          (0, s.C)(this.options.beforeCalculateLabelRotation, [this]);
        }
        calculateLabelRotation() {
          const t = this.options,
            e = t.ticks,
            i = this.ticks.length,
            n = e.minRotation || 0,
            o = e.maxRotation;
          let a,
            r,
            h,
            l = n;
          if (
            !this._isVisible() ||
            !e.display ||
            n >= o ||
            i <= 1 ||
            !this.isHorizontal()
          )
            return void (this.labelRotation = n);
          const c = this._getLabelSizes(),
            d = c.widest.width,
            u = c.highest.height,
            g = (0, s.E)(this.chart.width - d, 0, this.maxWidth);
          (a = t.offset ? this.maxWidth / i : g / (i - 1)),
            d + 6 > a &&
              ((a = g / (i - (t.offset ? 0.5 : 1))),
              (r =
                this.maxHeight -
                U(t.grid) -
                e.padding -
                Y(t.title, this.chart.options.font)),
              (h = Math.sqrt(d * d + u * u)),
              (l = (0, s.F)(
                Math.min(
                  Math.asin((0, s.E)((c.highest.height + 6) / a, -1, 1)),
                  Math.asin((0, s.E)(r / h, -1, 1)) -
                    Math.asin((0, s.E)(u / h, -1, 1))
                )
              )),
              (l = Math.max(n, Math.min(o, l)))),
            (this.labelRotation = l);
        }
        afterCalculateLabelRotation() {
          (0, s.C)(this.options.afterCalculateLabelRotation, [this]);
        }
        afterAutoSkip() {}
        beforeFit() {
          (0, s.C)(this.options.beforeFit, [this]);
        }
        fit() {
          const t = { width: 0, height: 0 },
            {
              chart: e,
              options: { ticks: i, title: n, grid: o },
            } = this,
            a = this._isVisible(),
            r = this.isHorizontal();
          if (a) {
            const a = Y(n, e.options.font);
            if (
              (r
                ? ((t.width = this.maxWidth), (t.height = U(o) + a))
                : ((t.height = this.maxHeight), (t.width = U(o) + a)),
              i.display && this.ticks.length)
            ) {
              const {
                  first: e,
                  last: n,
                  widest: o,
                  highest: a,
                } = this._getLabelSizes(),
                h = 2 * i.padding,
                l = (0, s.t)(this.labelRotation),
                c = Math.cos(l),
                d = Math.sin(l);
              if (r) {
                const e = i.mirror ? 0 : d * o.width + c * a.height;
                t.height = Math.min(this.maxHeight, t.height + e + h);
              } else {
                const e = i.mirror ? 0 : c * o.width + d * a.height;
                t.width = Math.min(this.maxWidth, t.width + e + h);
              }
              this._calculatePadding(e, n, d, c);
            }
          }
          this._handleMargins(),
            r
              ? ((this.width = this._length =
                  e.width - this._margins.left - this._margins.right),
                (this.height = t.height))
              : ((this.width = t.width),
                (this.height = this._length =
                  e.height - this._margins.top - this._margins.bottom));
        }
        _calculatePadding(t, e, i, s) {
          const {
              ticks: { align: n, padding: o },
              position: a,
            } = this.options,
            r = 0 !== this.labelRotation,
            h = "top" !== a && "x" === this.axis;
          if (this.isHorizontal()) {
            const a = this.getPixelForTick(0) - this.left,
              l = this.right - this.getPixelForTick(this.ticks.length - 1);
            let c = 0,
              d = 0;
            r
              ? h
                ? ((c = s * t.width), (d = i * e.height))
                : ((c = i * t.height), (d = s * e.width))
              : "start" === n
              ? (d = e.width)
              : "end" === n
              ? (c = t.width)
              : "inner" !== n && ((c = t.width / 2), (d = e.width / 2)),
              (this.paddingLeft = Math.max(
                ((c - a + o) * this.width) / (this.width - a),
                0
              )),
              (this.paddingRight = Math.max(
                ((d - l + o) * this.width) / (this.width - l),
                0
              ));
          } else {
            let i = e.height / 2,
              s = t.height / 2;
            "start" === n
              ? ((i = 0), (s = t.height))
              : "end" === n && ((i = e.height), (s = 0)),
              (this.paddingTop = i + o),
              (this.paddingBottom = s + o);
          }
        }
        _handleMargins() {
          this._margins &&
            ((this._margins.left = Math.max(
              this.paddingLeft,
              this._margins.left
            )),
            (this._margins.top = Math.max(this.paddingTop, this._margins.top)),
            (this._margins.right = Math.max(
              this.paddingRight,
              this._margins.right
            )),
            (this._margins.bottom = Math.max(
              this.paddingBottom,
              this._margins.bottom
            )));
        }
        afterFit() {
          (0, s.C)(this.options.afterFit, [this]);
        }
        isHorizontal() {
          const { axis: t, position: e } = this.options;
          return "top" === e || "bottom" === e || "x" === t;
        }
        isFullSize() {
          return this.options.fullSize;
        }
        _convertTicksToLabels(t) {
          let e, i;
          for (
            this.beforeTickToLabelConversion(),
              this.generateTickLabels(t),
              e = 0,
              i = t.length;
            e < i;
            e++
          )
            (0, s.k)(t[e].label) && (t.splice(e, 1), i--, e--);
          this.afterTickToLabelConversion();
        }
        _getLabelSizes() {
          let t = this._labelSizes;
          if (!t) {
            const e = this.options.ticks.sampleSize;
            let i = this.ticks;
            e < i.length && (i = j(i, e)),
              (this._labelSizes = t = this._computeLabelSizes(i, i.length));
          }
          return t;
        }
        _computeLabelSizes(t, e) {
          const { ctx: i, _longestTextCache: n } = this,
            o = [],
            a = [];
          let r,
            h,
            l,
            c,
            d,
            u,
            g,
            p,
            f,
            m,
            x,
            b = 0,
            _ = 0;
          for (r = 0; r < e; ++r) {
            if (
              ((c = t[r].label),
              (d = this._resolveTickFontOptions(r)),
              (i.font = u = d.string),
              (g = n[u] = n[u] || { data: {}, gc: [] }),
              (p = d.lineHeight),
              (f = m = 0),
              (0, s.k)(c) || (0, s.b)(c))
            ) {
              if ((0, s.b)(c))
                for (h = 0, l = c.length; h < l; ++h)
                  (x = c[h]),
                    (0, s.k)(x) ||
                      (0, s.b)(x) ||
                      ((f = (0, s.G)(i, g.data, g.gc, f, x)), (m += p));
            } else (f = (0, s.G)(i, g.data, g.gc, f, c)), (m = p);
            o.push(f), a.push(m), (b = Math.max(f, b)), (_ = Math.max(m, _));
          }
          !(function (t, e) {
            (0, s.Q)(t, (t) => {
              const i = t.gc,
                s = i.length / 2;
              let n;
              if (s > e) {
                for (n = 0; n < s; ++n) delete t.data[i[n]];
                i.splice(0, s);
              }
            });
          })(n, e);
          const v = o.indexOf(b),
            y = a.indexOf(_),
            M = (t) => ({ width: o[t] || 0, height: a[t] || 0 });
          return {
            first: M(0),
            last: M(e - 1),
            widest: M(v),
            highest: M(y),
            widths: o,
            heights: a,
          };
        }
        getLabelForValue(t) {
          return t;
        }
        getPixelForValue(t, e) {
          return NaN;
        }
        getValueForPixel(t) {}
        getPixelForTick(t) {
          const e = this.ticks;
          return t < 0 || t > e.length - 1
            ? null
            : this.getPixelForValue(e[t].value);
        }
        getPixelForDecimal(t) {
          this._reversePixels && (t = 1 - t);
          const e = this._startPixel + t * this._length;
          return (0, s.I)(this._alignToPixels ? (0, s.J)(this.chart, e, 0) : e);
        }
        getDecimalForPixel(t) {
          const e = (t - this._startPixel) / this._length;
          return this._reversePixels ? 1 - e : e;
        }
        getBasePixel() {
          return this.getPixelForValue(this.getBaseValue());
        }
        getBaseValue() {
          const { min: t, max: e } = this;
          return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
        }
        getContext(t) {
          const e = this.ticks || [];
          if (t >= 0 && t < e.length) {
            const i = e[t];
            return (
              i.$context ||
              (i.$context = (function (t, e, i) {
                return (0, s.h)(t, { tick: i, index: e, type: "tick" });
              })(this.getContext(), t, i))
            );
          }
          return (
            this.$context ||
            (this.$context =
              ((i = this.chart.getContext()),
              (n = this),
              (0, s.h)(i, { scale: n, type: "scale" })))
          );
          var i, n;
        }
        _tickSize() {
          const t = this.options.ticks,
            e = (0, s.t)(this.labelRotation),
            i = Math.abs(Math.cos(e)),
            n = Math.abs(Math.sin(e)),
            o = this._getLabelSizes(),
            a = t.autoSkipPadding || 0,
            r = o ? o.widest.width + a : 0,
            h = o ? o.highest.height + a : 0;
          return this.isHorizontal()
            ? h * i > r * n
              ? r / i
              : h / n
            : h * n < r * i
            ? h / i
            : r / n;
        }
        _isVisible() {
          const t = this.options.display;
          return "auto" !== t ? !!t : this.getMatchingVisibleMetas().length > 0;
        }
        _computeGridLineItems(t) {
          const e = this.axis,
            i = this.chart,
            n = this.options,
            { grid: o, position: a } = n,
            r = o.offset,
            h = this.isHorizontal(),
            l = this.ticks.length + (r ? 1 : 0),
            c = U(o),
            d = [],
            u = o.setContext(this.getContext()),
            g = u.drawBorder ? u.borderWidth : 0,
            p = g / 2,
            f = function (t) {
              return (0, s.J)(i, t, g);
            };
          let m, x, b, _, v, y, M, k, w, S, D, P;
          if ("top" === a)
            (m = f(this.bottom)),
              (y = this.bottom - c),
              (k = m - p),
              (S = f(t.top) + p),
              (P = t.bottom);
          else if ("bottom" === a)
            (m = f(this.top)),
              (S = t.top),
              (P = f(t.bottom) - p),
              (y = m + p),
              (k = this.top + c);
          else if ("left" === a)
            (m = f(this.right)),
              (v = this.right - c),
              (M = m - p),
              (w = f(t.left) + p),
              (D = t.right);
          else if ("right" === a)
            (m = f(this.left)),
              (w = t.left),
              (D = f(t.right) - p),
              (v = m + p),
              (M = this.left + c);
          else if ("x" === e) {
            if ("center" === a) m = f((t.top + t.bottom) / 2 + 0.5);
            else if ((0, s.i)(a)) {
              const t = Object.keys(a)[0],
                e = a[t];
              m = f(this.chart.scales[t].getPixelForValue(e));
            }
            (S = t.top), (P = t.bottom), (y = m + p), (k = y + c);
          } else if ("y" === e) {
            if ("center" === a) m = f((t.left + t.right) / 2);
            else if ((0, s.i)(a)) {
              const t = Object.keys(a)[0],
                e = a[t];
              m = f(this.chart.scales[t].getPixelForValue(e));
            }
            (v = m - p), (M = v - c), (w = t.left), (D = t.right);
          }
          const C = (0, s.v)(n.ticks.maxTicksLimit, l),
            A = Math.max(1, Math.ceil(l / C));
          for (x = 0; x < l; x += A) {
            const t = o.setContext(this.getContext(x)),
              e = t.lineWidth,
              n = t.color,
              a = t.borderDash || [],
              l = t.borderDashOffset,
              c = t.tickWidth,
              u = t.tickColor,
              g = t.tickBorderDash || [],
              p = t.tickBorderDashOffset;
            (b = $(this, x, r)),
              void 0 !== b &&
                ((_ = (0, s.J)(i, b, e)),
                h ? (v = M = w = D = _) : (y = k = S = P = _),
                d.push({
                  tx1: v,
                  ty1: y,
                  tx2: M,
                  ty2: k,
                  x1: w,
                  y1: S,
                  x2: D,
                  y2: P,
                  width: e,
                  color: n,
                  borderDash: a,
                  borderDashOffset: l,
                  tickWidth: c,
                  tickColor: u,
                  tickBorderDash: g,
                  tickBorderDashOffset: p,
                }));
          }
          return (this._ticksLength = l), (this._borderValue = m), d;
        }
        _computeLabelItems(t) {
          const e = this.axis,
            i = this.options,
            { position: n, ticks: o } = i,
            a = this.isHorizontal(),
            r = this.ticks,
            { align: h, crossAlign: l, padding: c, mirror: d } = o,
            u = U(i.grid),
            g = u + c,
            p = d ? -c : g,
            f = -(0, s.t)(this.labelRotation),
            m = [];
          let x,
            b,
            _,
            v,
            y,
            M,
            k,
            w,
            S,
            D,
            P,
            C,
            A = "middle";
          if ("top" === n)
            (M = this.bottom - p), (k = this._getXAxisLabelAlignment());
          else if ("bottom" === n)
            (M = this.top + p), (k = this._getXAxisLabelAlignment());
          else if ("left" === n) {
            const t = this._getYAxisLabelAlignment(u);
            (k = t.textAlign), (y = t.x);
          } else if ("right" === n) {
            const t = this._getYAxisLabelAlignment(u);
            (k = t.textAlign), (y = t.x);
          } else if ("x" === e) {
            if ("center" === n) M = (t.top + t.bottom) / 2 + g;
            else if ((0, s.i)(n)) {
              const t = Object.keys(n)[0],
                e = n[t];
              M = this.chart.scales[t].getPixelForValue(e) + g;
            }
            k = this._getXAxisLabelAlignment();
          } else if ("y" === e) {
            if ("center" === n) y = (t.left + t.right) / 2 - g;
            else if ((0, s.i)(n)) {
              const t = Object.keys(n)[0],
                e = n[t];
              y = this.chart.scales[t].getPixelForValue(e);
            }
            k = this._getYAxisLabelAlignment(u).textAlign;
          }
          "y" === e &&
            ("start" === h ? (A = "top") : "end" === h && (A = "bottom"));
          const O = this._getLabelSizes();
          for (x = 0, b = r.length; x < b; ++x) {
            (_ = r[x]), (v = _.label);
            const t = o.setContext(this.getContext(x));
            (w = this.getPixelForTick(x) + o.labelOffset),
              (S = this._resolveTickFontOptions(x)),
              (D = S.lineHeight),
              (P = (0, s.b)(v) ? v.length : 1);
            const e = P / 2,
              i = t.color,
              h = t.textStrokeColor,
              c = t.textStrokeWidth;
            let u,
              g = k;
            if (
              (a
                ? ((y = w),
                  "inner" === k &&
                    (g =
                      x === b - 1
                        ? this.options.reverse
                          ? "left"
                          : "right"
                        : 0 === x
                        ? this.options.reverse
                          ? "right"
                          : "left"
                        : "center"),
                  (C =
                    "top" === n
                      ? "near" === l || 0 !== f
                        ? -P * D + D / 2
                        : "center" === l
                        ? -O.highest.height / 2 - e * D + D
                        : -O.highest.height + D / 2
                      : "near" === l || 0 !== f
                      ? D / 2
                      : "center" === l
                      ? O.highest.height / 2 - e * D
                      : O.highest.height - P * D),
                  d && (C *= -1))
                : ((M = w), (C = ((1 - P) * D) / 2)),
              t.showLabelBackdrop)
            ) {
              const e = (0, s.K)(t.backdropPadding),
                i = O.heights[x],
                n = O.widths[x];
              let o = M + C - e.top,
                a = y - e.left;
              switch (A) {
                case "middle":
                  o -= i / 2;
                  break;
                case "bottom":
                  o -= i;
              }
              switch (k) {
                case "center":
                  a -= n / 2;
                  break;
                case "right":
                  a -= n;
              }
              u = {
                left: a,
                top: o,
                width: n + e.width,
                height: i + e.height,
                color: t.backdropColor,
              };
            }
            m.push({
              rotation: f,
              label: v,
              font: S,
              color: i,
              strokeColor: h,
              strokeWidth: c,
              textOffset: C,
              textAlign: g,
              textBaseline: A,
              translation: [y, M],
              backdrop: u,
            });
          }
          return m;
        }
        _getXAxisLabelAlignment() {
          const { position: t, ticks: e } = this.options;
          if (-(0, s.t)(this.labelRotation))
            return "top" === t ? "left" : "right";
          let i = "center";
          return (
            "start" === e.align
              ? (i = "left")
              : "end" === e.align
              ? (i = "right")
              : "inner" === e.align && (i = "inner"),
            i
          );
        }
        _getYAxisLabelAlignment(t) {
          const {
              position: e,
              ticks: { crossAlign: i, mirror: s, padding: n },
            } = this.options,
            o = t + n,
            a = this._getLabelSizes().widest.width;
          let r, h;
          return (
            "left" === e
              ? s
                ? ((h = this.right + n),
                  "near" === i
                    ? (r = "left")
                    : "center" === i
                    ? ((r = "center"), (h += a / 2))
                    : ((r = "right"), (h += a)))
                : ((h = this.right - o),
                  "near" === i
                    ? (r = "right")
                    : "center" === i
                    ? ((r = "center"), (h -= a / 2))
                    : ((r = "left"), (h = this.left)))
              : "right" === e
              ? s
                ? ((h = this.left + n),
                  "near" === i
                    ? (r = "right")
                    : "center" === i
                    ? ((r = "center"), (h -= a / 2))
                    : ((r = "left"), (h -= a)))
                : ((h = this.left + o),
                  "near" === i
                    ? (r = "left")
                    : "center" === i
                    ? ((r = "center"), (h += a / 2))
                    : ((r = "right"), (h = this.right)))
              : (r = "right"),
            { textAlign: r, x: h }
          );
        }
        _computeLabelArea() {
          if (this.options.ticks.mirror) return;
          const t = this.chart,
            e = this.options.position;
          return "left" === e || "right" === e
            ? { top: 0, left: this.left, bottom: t.height, right: this.right }
            : "top" === e || "bottom" === e
            ? { top: this.top, left: 0, bottom: this.bottom, right: t.width }
            : void 0;
        }
        drawBackground() {
          const {
            ctx: t,
            options: { backgroundColor: e },
            left: i,
            top: s,
            width: n,
            height: o,
          } = this;
          e &&
            (t.save(), (t.fillStyle = e), t.fillRect(i, s, n, o), t.restore());
        }
        getLineWidthForValue(t) {
          const e = this.options.grid;
          if (!this._isVisible() || !e.display) return 0;
          const i = this.ticks.findIndex((e) => e.value === t);
          if (i >= 0) {
            return e.setContext(this.getContext(i)).lineWidth;
          }
          return 0;
        }
        drawGrid(t) {
          const e = this.options.grid,
            i = this.ctx,
            s =
              this._gridLineItems ||
              (this._gridLineItems = this._computeGridLineItems(t));
          let n, o;
          const a = (t, e, s) => {
            s.width &&
              s.color &&
              (i.save(),
              (i.lineWidth = s.width),
              (i.strokeStyle = s.color),
              i.setLineDash(s.borderDash || []),
              (i.lineDashOffset = s.borderDashOffset),
              i.beginPath(),
              i.moveTo(t.x, t.y),
              i.lineTo(e.x, e.y),
              i.stroke(),
              i.restore());
          };
          if (e.display)
            for (n = 0, o = s.length; n < o; ++n) {
              const t = s[n];
              e.drawOnChartArea &&
                a({ x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 }, t),
                e.drawTicks &&
                  a(
                    { x: t.tx1, y: t.ty1 },
                    { x: t.tx2, y: t.ty2 },
                    {
                      color: t.tickColor,
                      width: t.tickWidth,
                      borderDash: t.tickBorderDash,
                      borderDashOffset: t.tickBorderDashOffset,
                    }
                  );
            }
        }
        drawBorder() {
          const {
              chart: t,
              ctx: e,
              options: { grid: i },
            } = this,
            n = i.setContext(this.getContext()),
            o = i.drawBorder ? n.borderWidth : 0;
          if (!o) return;
          const a = i.setContext(this.getContext(0)).lineWidth,
            r = this._borderValue;
          let h, l, c, d;
          this.isHorizontal()
            ? ((h = (0, s.J)(t, this.left, o) - o / 2),
              (l = (0, s.J)(t, this.right, a) + a / 2),
              (c = d = r))
            : ((c = (0, s.J)(t, this.top, o) - o / 2),
              (d = (0, s.J)(t, this.bottom, a) + a / 2),
              (h = l = r)),
            e.save(),
            (e.lineWidth = n.borderWidth),
            (e.strokeStyle = n.borderColor),
            e.beginPath(),
            e.moveTo(h, c),
            e.lineTo(l, d),
            e.stroke(),
            e.restore();
        }
        drawLabels(t) {
          if (!this.options.ticks.display) return;
          const e = this.ctx,
            i = this._computeLabelArea();
          i && (0, s.L)(e, i);
          const n =
            this._labelItems || (this._labelItems = this._computeLabelItems(t));
          let o, a;
          for (o = 0, a = n.length; o < a; ++o) {
            const t = n[o],
              i = t.font,
              a = t.label;
            t.backdrop &&
              ((e.fillStyle = t.backdrop.color),
              e.fillRect(
                t.backdrop.left,
                t.backdrop.top,
                t.backdrop.width,
                t.backdrop.height
              ));
            let r = t.textOffset;
            (0, s.M)(e, a, 0, r, i, t);
          }
          i && (0, s.N)(e);
        }
        drawTitle() {
          const {
            ctx: t,
            options: { position: e, title: i, reverse: n },
          } = this;
          if (!i.display) return;
          const o = (0, s.O)(i.font),
            a = (0, s.K)(i.padding),
            r = i.align;
          let h = o.lineHeight / 2;
          "bottom" === e || "center" === e || (0, s.i)(e)
            ? ((h += a.bottom),
              (0, s.b)(i.text) && (h += o.lineHeight * (i.text.length - 1)))
            : (h += a.top);
          const {
            titleX: l,
            titleY: c,
            maxWidth: d,
            rotation: u,
          } = (function (t, e, i, n) {
            const { top: o, left: a, bottom: r, right: h, chart: l } = t,
              { chartArea: c, scales: d } = l;
            let u,
              g,
              p,
              f = 0;
            const m = r - o,
              x = h - a;
            if (t.isHorizontal()) {
              if (((g = (0, s.S)(n, a, h)), (0, s.i)(i))) {
                const t = Object.keys(i)[0],
                  s = i[t];
                p = d[t].getPixelForValue(s) + m - e;
              } else
                p =
                  "center" === i ? (c.bottom + c.top) / 2 + m - e : W(t, i, e);
              u = h - a;
            } else {
              if ((0, s.i)(i)) {
                const t = Object.keys(i)[0],
                  s = i[t];
                g = d[t].getPixelForValue(s) - x + e;
              } else
                g =
                  "center" === i ? (c.left + c.right) / 2 - x + e : W(t, i, e);
              (p = (0, s.S)(n, r, o)), (f = "left" === i ? -s.H : s.H);
            }
            return { titleX: g, titleY: p, maxWidth: u, rotation: f };
          })(this, h, e, r);
          (0, s.M)(t, i.text, 0, 0, o, {
            color: i.color,
            maxWidth: d,
            rotation: u,
            textAlign: K(r, e, n),
            textBaseline: "middle",
            translation: [l, c],
          });
        }
        draw(t) {
          this._isVisible() &&
            (this.drawBackground(),
            this.drawGrid(t),
            this.drawBorder(),
            this.drawTitle(),
            this.drawLabels(t));
        }
        _layers() {
          const t = this.options,
            e = (t.ticks && t.ticks.z) || 0,
            i = (0, s.v)(t.grid && t.grid.z, -1);
          return this._isVisible() && this.draw === X.prototype.draw
            ? [
                {
                  z: i,
                  draw: (t) => {
                    this.drawBackground(), this.drawGrid(t), this.drawTitle();
                  },
                },
                {
                  z: i + 1,
                  draw: () => {
                    this.drawBorder();
                  },
                },
                {
                  z: e,
                  draw: (t) => {
                    this.drawLabels(t);
                  },
                },
              ]
            : [
                {
                  z: e,
                  draw: (t) => {
                    this.draw(t);
                  },
                },
              ];
        }
        getMatchingVisibleMetas(t) {
          const e = this.chart.getSortedVisibleDatasetMetas(),
            i = this.axis + "AxisID",
            s = [];
          let n, o;
          for (n = 0, o = e.length; n < o; ++n) {
            const o = e[n];
            o[i] !== this.id || (t && o.type !== t) || s.push(o);
          }
          return s;
        }
        _resolveTickFontOptions(t) {
          const e = this.options.ticks.setContext(this.getContext(t));
          return (0, s.O)(e.font);
        }
        _maxDigits() {
          const t = this._resolveTickFontOptions(0).lineHeight;
          return (this.isHorizontal() ? this.width : this.height) / t;
        }
      }
      class Q {
        constructor(t, e, i) {
          (this.type = t),
            (this.scope = e),
            (this.override = i),
            (this.items = Object.create(null));
        }
        isForType(t) {
          return Object.prototype.isPrototypeOf.call(
            this.type.prototype,
            t.prototype
          );
        }
        register(t) {
          const e = Object.getPrototypeOf(t);
          let i;
          (function (t) {
            return "id" in t && "defaults" in t;
          })(e) && (i = this.register(e));
          const n = this.items,
            o = t.id,
            a = this.scope + "." + o;
          if (!o) throw new Error("class does not have id: " + t);
          return (
            o in n ||
              ((n[o] = t),
              (function (t, e, i) {
                const n = (0, s.V)(Object.create(null), [
                  i ? s.d.get(i) : {},
                  s.d.get(e),
                  t.defaults,
                ]);
                s.d.set(e, n),
                  t.defaultRoutes &&
                    (function (t, e) {
                      Object.keys(e).forEach((i) => {
                        const n = i.split("."),
                          o = n.pop(),
                          a = [t].concat(n).join("."),
                          r = e[i].split("."),
                          h = r.pop(),
                          l = r.join(".");
                        s.d.route(a, o, l, h);
                      });
                    })(e, t.defaultRoutes);
                t.descriptors && s.d.describe(e, t.descriptors);
              })(t, a, i),
              this.override && s.d.override(t.id, t.overrides)),
            a
          );
        }
        get(t) {
          return this.items[t];
        }
        unregister(t) {
          const e = this.items,
            i = t.id,
            n = this.scope;
          i in e && delete e[i],
            n &&
              i in s.d[n] &&
              (delete s.d[n][i], this.override && delete s.U[i]);
        }
      }
      var G = new (class {
        constructor() {
          (this.controllers = new Q(y, "datasets", !0)),
            (this.elements = new Q(F, "elements")),
            (this.plugins = new Q(Object, "plugins")),
            (this.scales = new Q(X, "scales")),
            (this._typedRegistries = [
              this.controllers,
              this.scales,
              this.elements,
            ]);
        }
        add(...t) {
          this._each("register", t);
        }
        remove(...t) {
          this._each("unregister", t);
        }
        addControllers(...t) {
          this._each("register", t, this.controllers);
        }
        addElements(...t) {
          this._each("register", t, this.elements);
        }
        addPlugins(...t) {
          this._each("register", t, this.plugins);
        }
        addScales(...t) {
          this._each("register", t, this.scales);
        }
        getController(t) {
          return this._get(t, this.controllers, "controller");
        }
        getElement(t) {
          return this._get(t, this.elements, "element");
        }
        getPlugin(t) {
          return this._get(t, this.plugins, "plugin");
        }
        getScale(t) {
          return this._get(t, this.scales, "scale");
        }
        removeControllers(...t) {
          this._each("unregister", t, this.controllers);
        }
        removeElements(...t) {
          this._each("unregister", t, this.elements);
        }
        removePlugins(...t) {
          this._each("unregister", t, this.plugins);
        }
        removeScales(...t) {
          this._each("unregister", t, this.scales);
        }
        _each(t, e, i) {
          [...e].forEach((e) => {
            const n = i || this._getRegistryForType(e);
            i || n.isForType(e) || (n === this.plugins && e.id)
              ? this._exec(t, n, e)
              : (0, s.Q)(e, (e) => {
                  const s = i || this._getRegistryForType(e);
                  this._exec(t, s, e);
                });
          });
        }
        _exec(t, e, i) {
          const n = (0, s.W)(t);
          (0, s.C)(i["before" + n], [], i),
            e[t](i),
            (0, s.C)(i["after" + n], [], i);
        }
        _getRegistryForType(t) {
          for (let e = 0; e < this._typedRegistries.length; e++) {
            const i = this._typedRegistries[e];
            if (i.isForType(t)) return i;
          }
          return this.plugins;
        }
        _get(t, e, i) {
          const s = e.get(t);
          if (void 0 === s)
            throw new Error('"' + t + '" is not a registered ' + i + ".");
          return s;
        }
      })();
      class J extends y {
        update(t) {
          const e = this._cachedMeta,
            { data: i = [] } = e,
            n = this.chart._animationsDisabled;
          let { start: o, count: a } = (0, s.q)(e, i, n);
          if (
            ((this._drawStart = o),
            (this._drawCount = a),
            (0, s.w)(e) && ((o = 0), (a = i.length)),
            this.options.showLine)
          ) {
            const { dataset: s, _dataset: o } = e;
            (s._chart = this.chart),
              (s._datasetIndex = this.index),
              (s._decimated = !!o._decimated),
              (s.points = i);
            const a = this.resolveDatasetElementOptions(t);
            (a.segment = this.options.segment),
              this.updateElement(s, void 0, { animated: !n, options: a }, t);
          }
          this.updateElements(i, o, a, t);
        }
        addElements() {
          const { showLine: t } = this.options;
          !this.datasetElementType &&
            t &&
            (this.datasetElementType = G.getElement("line")),
            super.addElements();
        }
        updateElements(t, e, i, n) {
          const o = "reset" === n,
            {
              iScale: a,
              vScale: r,
              _stacked: h,
              _dataset: l,
            } = this._cachedMeta,
            c = this.resolveDataElementOptions(e, n),
            d = this.getSharedOptions(c),
            u = this.includeOptions(n, d),
            g = a.axis,
            p = r.axis,
            { spanGaps: f, segment: m } = this.options,
            x = (0, s.x)(f) ? f : Number.POSITIVE_INFINITY,
            b = this.chart._animationsDisabled || o || "none" === n;
          let _ = e > 0 && this.getParsed(e - 1);
          for (let v = e; v < e + i; ++v) {
            const e = t[v],
              i = this.getParsed(v),
              c = b ? e : {},
              f = (0, s.k)(i[p]),
              y = (c[g] = a.getPixelForValue(i[g], v)),
              M = (c[p] =
                o || f
                  ? r.getBasePixel()
                  : r.getPixelForValue(h ? this.applyStack(r, i, h) : i[p], v));
            (c.skip = isNaN(y) || isNaN(M) || f),
              (c.stop = v > 0 && Math.abs(i[g] - _[g]) > x),
              m && ((c.parsed = i), (c.raw = l.data[v])),
              u &&
                (c.options =
                  d ||
                  this.resolveDataElementOptions(v, e.active ? "active" : n)),
              b || this.updateElement(e, v, c, n),
              (_ = i);
          }
          this.updateSharedOptions(d, n, c);
        }
        getMaxOverflow() {
          const t = this._cachedMeta,
            e = t.data || [];
          if (!this.options.showLine) {
            let t = 0;
            for (let i = e.length - 1; i >= 0; --i)
              t = Math.max(t, e[i].size(this.resolveDataElementOptions(i)) / 2);
            return t > 0 && t;
          }
          const i = t.dataset,
            s = (i.options && i.options.borderWidth) || 0;
          if (!e.length) return s;
          const n = e[0].size(this.resolveDataElementOptions(0)),
            o = e[e.length - 1].size(
              this.resolveDataElementOptions(e.length - 1)
            );
          return Math.max(s, n, o) / 2;
        }
      }
      (J.id = "scatter"),
        (J.defaults = {
          datasetElementType: !1,
          dataElementType: "point",
          showLine: !1,
          fill: !1,
        }),
        (J.overrides = {
          interaction: { mode: "point" },
          plugins: {
            tooltip: {
              callbacks: {
                title: () => "",
                label: (t) => "(" + t.label + ", " + t.formattedValue + ")",
              },
            },
          },
          scales: { x: { type: "linear" }, y: { type: "linear" } },
        });
      var q = Object.freeze({
        __proto__: null,
        BarController: O,
        BubbleController: L,
        DoughnutController: E,
        LineController: T,
        PolarAreaController: R,
        PieController: z,
        RadarController: I,
        ScatterController: J,
      });
      function Z() {
        throw new Error(
          "This method is not implemented: Check that a complete date adapter is provided."
        );
      }
      class tt {
        constructor(t) {
          this.options = t || {};
        }
        init(t) {}
        formats() {
          return Z();
        }
        parse(t, e) {
          return Z();
        }
        format(t, e) {
          return Z();
        }
        add(t, e, i) {
          return Z();
        }
        diff(t, e, i) {
          return Z();
        }
        startOf(t, e, i) {
          return Z();
        }
        endOf(t, e) {
          return Z();
        }
      }
      tt.override = function (t) {
        Object.assign(tt.prototype, t);
      };
      var et = { _date: tt };
      function it(t, e, i, n) {
        const { controller: o, data: a, _sorted: r } = t,
          h = o._cachedMeta.iScale;
        if (h && e === h.axis && "r" !== e && r && a.length) {
          const t = h._reversePixels ? s.Y : s.Z;
          if (!n) return t(a, e, i);
          if (o._sharedOptions) {
            const s = a[0],
              n = "function" === typeof s.getRange && s.getRange(e);
            if (n) {
              const s = t(a, e, i - n),
                o = t(a, e, i + n);
              return { lo: s.lo, hi: o.hi };
            }
          }
        }
        return { lo: 0, hi: a.length - 1 };
      }
      function st(t, e, i, s, n) {
        const o = t.getSortedVisibleDatasetMetas(),
          a = i[e];
        for (let r = 0, h = o.length; r < h; ++r) {
          const { index: t, data: i } = o[r],
            { lo: h, hi: l } = it(o[r], e, a, n);
          for (let e = h; e <= l; ++e) {
            const n = i[e];
            n.skip || s(n, t, e);
          }
        }
      }
      function nt(t, e, i, n, o) {
        const a = [];
        if (!o && !t.isPointInArea(e)) return a;
        return (
          st(
            t,
            i,
            e,
            function (i, r, h) {
              (o || (0, s.$)(i, t.chartArea, 0)) &&
                i.inRange(e.x, e.y, n) &&
                a.push({ element: i, datasetIndex: r, index: h });
            },
            !0
          ),
          a
        );
      }
      function ot(t, e, i, s, n, o) {
        let a = [];
        const r = (function (t) {
          const e = -1 !== t.indexOf("x"),
            i = -1 !== t.indexOf("y");
          return function (t, s) {
            const n = e ? Math.abs(t.x - s.x) : 0,
              o = i ? Math.abs(t.y - s.y) : 0;
            return Math.sqrt(Math.pow(n, 2) + Math.pow(o, 2));
          };
        })(i);
        let h = Number.POSITIVE_INFINITY;
        return (
          st(t, i, e, function (i, l, c) {
            const d = i.inRange(e.x, e.y, n);
            if (s && !d) return;
            const u = i.getCenterPoint(n);
            if (!(!!o || t.isPointInArea(u)) && !d) return;
            const g = r(e, u);
            g < h
              ? ((a = [{ element: i, datasetIndex: l, index: c }]), (h = g))
              : g === h && a.push({ element: i, datasetIndex: l, index: c });
          }),
          a
        );
      }
      function at(t, e, i, n, o, a) {
        return a || t.isPointInArea(e)
          ? "r" !== i || n
            ? ot(t, e, i, n, o, a)
            : (function (t, e, i, n) {
                let o = [];
                return (
                  st(t, i, e, function (t, i, a) {
                    const { startAngle: r, endAngle: h } = t.getProps(
                        ["startAngle", "endAngle"],
                        n
                      ),
                      { angle: l } = (0, s.a0)(t, { x: e.x, y: e.y });
                    (0, s.p)(l, r, h) &&
                      o.push({ element: t, datasetIndex: i, index: a });
                  }),
                  o
                );
              })(t, e, i, o)
          : [];
      }
      function rt(t, e, i, s, n) {
        const o = [],
          a = "x" === i ? "inXRange" : "inYRange";
        let r = !1;
        return (
          st(t, i, e, (t, s, h) => {
            t[a](e[i], n) &&
              (o.push({ element: t, datasetIndex: s, index: h }),
              (r = r || t.inRange(e.x, e.y, n)));
          }),
          s && !r ? [] : o
        );
      }
      var ht = {
        evaluateInteractionItems: st,
        modes: {
          index(t, e, i, n) {
            const o = (0, s.X)(e, t),
              a = i.axis || "x",
              r = i.includeInvisible || !1,
              h = i.intersect ? nt(t, o, a, n, r) : at(t, o, a, !1, n, r),
              l = [];
            return h.length
              ? (t.getSortedVisibleDatasetMetas().forEach((t) => {
                  const e = h[0].index,
                    i = t.data[e];
                  i &&
                    !i.skip &&
                    l.push({ element: i, datasetIndex: t.index, index: e });
                }),
                l)
              : [];
          },
          dataset(t, e, i, n) {
            const o = (0, s.X)(e, t),
              a = i.axis || "xy",
              r = i.includeInvisible || !1;
            let h = i.intersect ? nt(t, o, a, n, r) : at(t, o, a, !1, n, r);
            if (h.length > 0) {
              const e = h[0].datasetIndex,
                i = t.getDatasetMeta(e).data;
              h = [];
              for (let t = 0; t < i.length; ++t)
                h.push({ element: i[t], datasetIndex: e, index: t });
            }
            return h;
          },
          point: (t, e, i, n) =>
            nt(t, (0, s.X)(e, t), i.axis || "xy", n, i.includeInvisible || !1),
          nearest(t, e, i, n) {
            const o = (0, s.X)(e, t),
              a = i.axis || "xy",
              r = i.includeInvisible || !1;
            return at(t, o, a, i.intersect, n, r);
          },
          x: (t, e, i, n) => rt(t, (0, s.X)(e, t), "x", i.intersect, n),
          y: (t, e, i, n) => rt(t, (0, s.X)(e, t), "y", i.intersect, n),
        },
      };
      const lt = ["left", "top", "right", "bottom"];
      function ct(t, e) {
        return t.filter((t) => t.pos === e);
      }
      function dt(t, e) {
        return t.filter((t) => -1 === lt.indexOf(t.pos) && t.box.axis === e);
      }
      function ut(t, e) {
        return t.sort((t, i) => {
          const s = e ? i : t,
            n = e ? t : i;
          return s.weight === n.weight
            ? s.index - n.index
            : s.weight - n.weight;
        });
      }
      function gt(t, e) {
        const i = (function (t) {
            const e = {};
            for (const i of t) {
              const { stack: t, pos: s, stackWeight: n } = i;
              if (!t || !lt.includes(s)) continue;
              const o =
                e[t] || (e[t] = { count: 0, placed: 0, weight: 0, size: 0 });
              o.count++, (o.weight += n);
            }
            return e;
          })(t),
          { vBoxMaxWidth: s, hBoxMaxHeight: n } = e;
        let o, a, r;
        for (o = 0, a = t.length; o < a; ++o) {
          r = t[o];
          const { fullSize: a } = r.box,
            h = i[r.stack],
            l = h && r.stackWeight / h.weight;
          r.horizontal
            ? ((r.width = l ? l * s : a && e.availableWidth), (r.height = n))
            : ((r.width = s), (r.height = l ? l * n : a && e.availableHeight));
        }
        return i;
      }
      function pt(t, e, i, s) {
        return Math.max(t[i], e[i]) + Math.max(t[s], e[s]);
      }
      function ft(t, e) {
        (t.top = Math.max(t.top, e.top)),
          (t.left = Math.max(t.left, e.left)),
          (t.bottom = Math.max(t.bottom, e.bottom)),
          (t.right = Math.max(t.right, e.right));
      }
      function mt(t, e, i, n) {
        const { pos: o, box: a } = i,
          r = t.maxPadding;
        if (!(0, s.i)(o)) {
          i.size && (t[o] -= i.size);
          const e = n[i.stack] || { size: 0, count: 1 };
          (e.size = Math.max(e.size, i.horizontal ? a.height : a.width)),
            (i.size = e.size / e.count),
            (t[o] += i.size);
        }
        a.getPadding && ft(r, a.getPadding());
        const h = Math.max(0, e.outerWidth - pt(r, t, "left", "right")),
          l = Math.max(0, e.outerHeight - pt(r, t, "top", "bottom")),
          c = h !== t.w,
          d = l !== t.h;
        return (
          (t.w = h),
          (t.h = l),
          i.horizontal ? { same: c, other: d } : { same: d, other: c }
        );
      }
      function xt(t, e) {
        const i = e.maxPadding;
        function s(t) {
          const s = { left: 0, top: 0, right: 0, bottom: 0 };
          return (
            t.forEach((t) => {
              s[t] = Math.max(e[t], i[t]);
            }),
            s
          );
        }
        return s(t ? ["left", "right"] : ["top", "bottom"]);
      }
      function bt(t, e, i, s) {
        const n = [];
        let o, a, r, h, l, c;
        for (o = 0, a = t.length, l = 0; o < a; ++o) {
          (r = t[o]),
            (h = r.box),
            h.update(r.width || e.w, r.height || e.h, xt(r.horizontal, e));
          const { same: a, other: d } = mt(e, i, r, s);
          (l |= a && n.length), (c = c || d), h.fullSize || n.push(r);
        }
        return (l && bt(n, e, i, s)) || c;
      }
      function _t(t, e, i, s, n) {
        (t.top = i),
          (t.left = e),
          (t.right = e + s),
          (t.bottom = i + n),
          (t.width = s),
          (t.height = n);
      }
      function vt(t, e, i, n) {
        const o = i.padding;
        let { x: a, y: r } = e;
        for (const h of t) {
          const t = h.box,
            l = n[h.stack] || { count: 1, placed: 0, weight: 1 },
            c = h.stackWeight / l.weight || 1;
          if (h.horizontal) {
            const n = e.w * c,
              a = l.size || t.height;
            (0, s.j)(l.start) && (r = l.start),
              t.fullSize
                ? _t(t, o.left, r, i.outerWidth - o.right - o.left, a)
                : _t(t, e.left + l.placed, r, n, a),
              (l.start = r),
              (l.placed += n),
              (r = t.bottom);
          } else {
            const n = e.h * c,
              r = l.size || t.width;
            (0, s.j)(l.start) && (a = l.start),
              t.fullSize
                ? _t(t, a, o.top, r, i.outerHeight - o.bottom - o.top)
                : _t(t, a, e.top + l.placed, r, n),
              (l.start = a),
              (l.placed += n),
              (a = t.right);
          }
        }
        (e.x = a), (e.y = r);
      }
      s.d.set("layout", {
        autoPadding: !0,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      var yt = {
        addBox(t, e) {
          t.boxes || (t.boxes = []),
            (e.fullSize = e.fullSize || !1),
            (e.position = e.position || "top"),
            (e.weight = e.weight || 0),
            (e._layers =
              e._layers ||
              function () {
                return [
                  {
                    z: 0,
                    draw(t) {
                      e.draw(t);
                    },
                  },
                ];
              }),
            t.boxes.push(e);
        },
        removeBox(t, e) {
          const i = t.boxes ? t.boxes.indexOf(e) : -1;
          -1 !== i && t.boxes.splice(i, 1);
        },
        configure(t, e, i) {
          (e.fullSize = i.fullSize),
            (e.position = i.position),
            (e.weight = i.weight);
        },
        update(t, e, i, n) {
          if (!t) return;
          const o = (0, s.K)(t.options.layout.padding),
            a = Math.max(e - o.width, 0),
            r = Math.max(i - o.height, 0),
            h = (function (t) {
              const e = (function (t) {
                  const e = [];
                  let i, s, n, o, a, r;
                  for (i = 0, s = (t || []).length; i < s; ++i)
                    (n = t[i]),
                      ({
                        position: o,
                        options: { stack: a, stackWeight: r = 1 },
                      } = n),
                      e.push({
                        index: i,
                        box: n,
                        pos: o,
                        horizontal: n.isHorizontal(),
                        weight: n.weight,
                        stack: a && o + a,
                        stackWeight: r,
                      });
                  return e;
                })(t),
                i = ut(
                  e.filter((t) => t.box.fullSize),
                  !0
                ),
                s = ut(ct(e, "left"), !0),
                n = ut(ct(e, "right")),
                o = ut(ct(e, "top"), !0),
                a = ut(ct(e, "bottom")),
                r = dt(e, "x"),
                h = dt(e, "y");
              return {
                fullSize: i,
                leftAndTop: s.concat(o),
                rightAndBottom: n.concat(h).concat(a).concat(r),
                chartArea: ct(e, "chartArea"),
                vertical: s.concat(n).concat(h),
                horizontal: o.concat(a).concat(r),
              };
            })(t.boxes),
            l = h.vertical,
            c = h.horizontal;
          (0, s.Q)(t.boxes, (t) => {
            "function" === typeof t.beforeLayout && t.beforeLayout();
          });
          const d =
              l.reduce(
                (t, e) =>
                  e.box.options && !1 === e.box.options.display ? t : t + 1,
                0
              ) || 1,
            u = Object.freeze({
              outerWidth: e,
              outerHeight: i,
              padding: o,
              availableWidth: a,
              availableHeight: r,
              vBoxMaxWidth: a / 2 / d,
              hBoxMaxHeight: r / 2,
            }),
            g = Object.assign({}, o);
          ft(g, (0, s.K)(n));
          const p = Object.assign(
              { maxPadding: g, w: a, h: r, x: o.left, y: o.top },
              o
            ),
            f = gt(l.concat(c), u);
          bt(h.fullSize, p, u, f),
            bt(l, p, u, f),
            bt(c, p, u, f) && bt(l, p, u, f),
            (function (t) {
              const e = t.maxPadding;
              function i(i) {
                const s = Math.max(e[i] - t[i], 0);
                return (t[i] += s), s;
              }
              (t.y += i("top")), (t.x += i("left")), i("right"), i("bottom");
            })(p),
            vt(h.leftAndTop, p, u, f),
            (p.x += p.w),
            (p.y += p.h),
            vt(h.rightAndBottom, p, u, f),
            (t.chartArea = {
              left: p.left,
              top: p.top,
              right: p.left + p.w,
              bottom: p.top + p.h,
              height: p.h,
              width: p.w,
            }),
            (0, s.Q)(h.chartArea, (e) => {
              const i = e.box;
              Object.assign(i, t.chartArea),
                i.update(p.w, p.h, { left: 0, top: 0, right: 0, bottom: 0 });
            });
        },
      };
      class Mt {
        acquireContext(t, e) {}
        releaseContext(t) {
          return !1;
        }
        addEventListener(t, e, i) {}
        removeEventListener(t, e, i) {}
        getDevicePixelRatio() {
          return 1;
        }
        getMaximumSize(t, e, i, s) {
          return (
            (e = Math.max(0, e || t.width)),
            (i = i || t.height),
            { width: e, height: Math.max(0, s ? Math.floor(e / s) : i) }
          );
        }
        isAttached(t) {
          return !0;
        }
        updateConfig(t) {}
      }
      class kt extends Mt {
        acquireContext(t) {
          return (t && t.getContext && t.getContext("2d")) || null;
        }
        updateConfig(t) {
          t.options.animation = !1;
        }
      }
      const wt = {
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup",
          pointerenter: "mouseenter",
          pointerdown: "mousedown",
          pointermove: "mousemove",
          pointerup: "mouseup",
          pointerleave: "mouseout",
          pointerout: "mouseout",
        },
        St = (t) => null === t || "" === t;
      const Dt = !!s.a5 && { passive: !0 };
      function Pt(t, e, i) {
        t.canvas.removeEventListener(e, i, Dt);
      }
      function Ct(t, e) {
        for (const i of t) if (i === e || i.contains(e)) return !0;
      }
      function At(t, e, i) {
        const s = t.canvas,
          n = new MutationObserver((t) => {
            let e = !1;
            for (const i of t)
              (e = e || Ct(i.addedNodes, s)), (e = e && !Ct(i.removedNodes, s));
            e && i();
          });
        return n.observe(document, { childList: !0, subtree: !0 }), n;
      }
      function Ot(t, e, i) {
        const s = t.canvas,
          n = new MutationObserver((t) => {
            let e = !1;
            for (const i of t)
              (e = e || Ct(i.removedNodes, s)), (e = e && !Ct(i.addedNodes, s));
            e && i();
          });
        return n.observe(document, { childList: !0, subtree: !0 }), n;
      }
      const Lt = new Map();
      let Et = 0;
      function Tt() {
        const t = window.devicePixelRatio;
        t !== Et &&
          ((Et = t),
          Lt.forEach((e, i) => {
            i.currentDevicePixelRatio !== t && e();
          }));
      }
      function Rt(t, e, i) {
        const n = t.canvas,
          o = n && (0, s.a2)(n);
        if (!o) return;
        const a = (0, s.a4)((t, e) => {
            const s = o.clientWidth;
            i(t, e), s < o.clientWidth && i();
          }, window),
          r = new ResizeObserver((t) => {
            const e = t[0],
              i = e.contentRect.width,
              s = e.contentRect.height;
            (0 === i && 0 === s) || a(i, s);
          });
        return (
          r.observe(o),
          (function (t, e) {
            Lt.size || window.addEventListener("resize", Tt), Lt.set(t, e);
          })(t, a),
          r
        );
      }
      function zt(t, e, i) {
        i && i.disconnect(),
          "resize" === e &&
            (function (t) {
              Lt.delete(t), Lt.size || window.removeEventListener("resize", Tt);
            })(t);
      }
      function It(t, e, i) {
        const n = t.canvas,
          o = (0, s.a4)(
            (e) => {
              null !== t.ctx &&
                i(
                  (function (t, e) {
                    const i = wt[t.type] || t.type,
                      { x: n, y: o } = (0, s.X)(t, e);
                    return {
                      type: i,
                      chart: e,
                      native: t,
                      x: void 0 !== n ? n : null,
                      y: void 0 !== o ? o : null,
                    };
                  })(e, t)
                );
            },
            t,
            (t) => {
              const e = t[0];
              return [e, e.offsetX, e.offsetY];
            }
          );
        return (
          (function (t, e, i) {
            t.addEventListener(e, i, Dt);
          })(n, e, o),
          o
        );
      }
      class Ft extends Mt {
        acquireContext(t, e) {
          const i = t && t.getContext && t.getContext("2d");
          return i && i.canvas === t
            ? ((function (t, e) {
                const i = t.style,
                  n = t.getAttribute("height"),
                  o = t.getAttribute("width");
                if (
                  ((t.$chartjs = {
                    initial: {
                      height: n,
                      width: o,
                      style: {
                        display: i.display,
                        height: i.height,
                        width: i.width,
                      },
                    },
                  }),
                  (i.display = i.display || "block"),
                  (i.boxSizing = i.boxSizing || "border-box"),
                  St(o))
                ) {
                  const e = (0, s.a3)(t, "width");
                  void 0 !== e && (t.width = e);
                }
                if (St(n))
                  if ("" === t.style.height) t.height = t.width / (e || 2);
                  else {
                    const e = (0, s.a3)(t, "height");
                    void 0 !== e && (t.height = e);
                  }
              })(t, e),
              i)
            : null;
        }
        releaseContext(t) {
          const e = t.canvas;
          if (!e.$chartjs) return !1;
          const i = e.$chartjs.initial;
          ["height", "width"].forEach((t) => {
            const n = i[t];
            (0, s.k)(n) ? e.removeAttribute(t) : e.setAttribute(t, n);
          });
          const n = i.style || {};
          return (
            Object.keys(n).forEach((t) => {
              e.style[t] = n[t];
            }),
            (e.width = e.width),
            delete e.$chartjs,
            !0
          );
        }
        addEventListener(t, e, i) {
          this.removeEventListener(t, e);
          const s = t.$proxies || (t.$proxies = {}),
            n = { attach: At, detach: Ot, resize: Rt }[e] || It;
          s[e] = n(t, e, i);
        }
        removeEventListener(t, e) {
          const i = t.$proxies || (t.$proxies = {}),
            s = i[e];
          if (!s) return;
          (({ attach: zt, detach: zt, resize: zt }[e] || Pt)(t, e, s),
            (i[e] = void 0));
        }
        getDevicePixelRatio() {
          return window.devicePixelRatio;
        }
        getMaximumSize(t, e, i, n) {
          return (0, s.a1)(t, e, i, n);
        }
        isAttached(t) {
          const e = (0, s.a2)(t);
          return !(!e || !e.isConnected);
        }
      }
      class Vt {
        constructor() {
          this._init = [];
        }
        notify(t, e, i, s) {
          "beforeInit" === e &&
            ((this._init = this._createDescriptors(t, !0)),
            this._notify(this._init, t, "install"));
          const n = s ? this._descriptors(t).filter(s) : this._descriptors(t),
            o = this._notify(n, t, e, i);
          return (
            "afterDestroy" === e &&
              (this._notify(n, t, "stop"),
              this._notify(this._init, t, "uninstall")),
            o
          );
        }
        _notify(t, e, i, n) {
          n = n || {};
          for (const o of t) {
            const t = o.plugin,
              a = t[i],
              r = [e, n, o.options];
            if (!1 === (0, s.C)(a, r, t) && n.cancelable) return !1;
          }
          return !0;
        }
        invalidate() {
          (0, s.k)(this._cache) ||
            ((this._oldCache = this._cache), (this._cache = void 0));
        }
        _descriptors(t) {
          if (this._cache) return this._cache;
          const e = (this._cache = this._createDescriptors(t));
          return this._notifyStateChanges(t), e;
        }
        _createDescriptors(t, e) {
          const i = t && t.config,
            n = (0, s.v)(i.options && i.options.plugins, {}),
            o = (function (t) {
              const e = {},
                i = [],
                s = Object.keys(G.plugins.items);
              for (let o = 0; o < s.length; o++) i.push(G.getPlugin(s[o]));
              const n = t.plugins || [];
              for (let o = 0; o < n.length; o++) {
                const t = n[o];
                -1 === i.indexOf(t) && (i.push(t), (e[t.id] = !0));
              }
              return { plugins: i, localIds: e };
            })(i);
          return !1 !== n || e
            ? (function (t, { plugins: e, localIds: i }, s, n) {
                const o = [],
                  a = t.getContext();
                for (const r of e) {
                  const e = r.id,
                    h = Bt(s[e], n);
                  null !== h &&
                    o.push({
                      plugin: r,
                      options: Nt(t.config, { plugin: r, local: i[e] }, h, a),
                    });
                }
                return o;
              })(t, o, n, e)
            : [];
        }
        _notifyStateChanges(t) {
          const e = this._oldCache || [],
            i = this._cache,
            s = (t, e) =>
              t.filter((t) => !e.some((e) => t.plugin.id === e.plugin.id));
          this._notify(s(e, i), t, "stop"), this._notify(s(i, e), t, "start");
        }
      }
      function Bt(t, e) {
        return e || !1 !== t ? (!0 === t ? {} : t) : null;
      }
      function Nt(t, { plugin: e, local: i }, s, n) {
        const o = t.pluginScopeKeys(e),
          a = t.getOptionScopes(s, o);
        return (
          i && e.defaults && a.push(e.defaults),
          t.createResolver(a, n, [""], {
            scriptable: !1,
            indexable: !1,
            allKeys: !0,
          })
        );
      }
      function Ht(t, e) {
        const i = s.d.datasets[t] || {};
        return (
          ((e.datasets || {})[t] || {}).indexAxis ||
          e.indexAxis ||
          i.indexAxis ||
          "x"
        );
      }
      function Wt(t, e) {
        return "x" === t || "y" === t
          ? t
          : e.axis ||
              ("top" === (i = e.position) || "bottom" === i
                ? "x"
                : "left" === i || "right" === i
                ? "y"
                : void 0) ||
              t.charAt(0).toLowerCase();
        var i;
      }
      function jt(t) {
        const e = t.options || (t.options = {});
        (e.plugins = (0, s.v)(e.plugins, {})),
          (e.scales = (function (t, e) {
            const i = s.U[t.type] || { scales: {} },
              n = e.scales || {},
              o = Ht(t.type, e),
              a = Object.create(null),
              r = Object.create(null);
            return (
              Object.keys(n).forEach((t) => {
                const e = n[t];
                if (!(0, s.i)(e))
                  return console.error(
                    `Invalid scale configuration for scale: ${t}`
                  );
                if (e._proxy)
                  return console.warn(
                    `Ignoring resolver passed as options for scale: ${t}`
                  );
                const h = Wt(t, e),
                  l = (function (t, e) {
                    return t === e ? "_index_" : "_value_";
                  })(h, o),
                  c = i.scales || {};
                (a[h] = a[h] || t),
                  (r[t] = (0, s.ac)(Object.create(null), [
                    { axis: h },
                    e,
                    c[h],
                    c[l],
                  ]));
              }),
              t.data.datasets.forEach((i) => {
                const o = i.type || t.type,
                  h = i.indexAxis || Ht(o, e),
                  l = (s.U[o] || {}).scales || {};
                Object.keys(l).forEach((t) => {
                  const e = (function (t, e) {
                      let i = t;
                      return (
                        "_index_" === t
                          ? (i = e)
                          : "_value_" === t && (i = "x" === e ? "y" : "x"),
                        i
                      );
                    })(t, h),
                    o = i[e + "AxisID"] || a[e] || e;
                  (r[o] = r[o] || Object.create(null)),
                    (0, s.ac)(r[o], [{ axis: e }, n[o], l[t]]);
                });
              }),
              Object.keys(r).forEach((t) => {
                const e = r[t];
                (0, s.ac)(e, [s.d.scales[e.type], s.d.scale]);
              }),
              r
            );
          })(t, e));
      }
      function $t(t) {
        return (
          ((t = t || {}).datasets = t.datasets || []),
          (t.labels = t.labels || []),
          t
        );
      }
      const Ut = new Map(),
        Yt = new Set();
      function Kt(t, e) {
        let i = Ut.get(t);
        return i || ((i = e()), Ut.set(t, i), Yt.add(i)), i;
      }
      const Xt = (t, e, i) => {
        const n = (0, s.f)(e, i);
        void 0 !== n && t.add(n);
      };
      class Qt {
        constructor(t) {
          (this._config = (function (t) {
            return ((t = t || {}).data = $t(t.data)), jt(t), t;
          })(t)),
            (this._scopeCache = new Map()),
            (this._resolverCache = new Map());
        }
        get platform() {
          return this._config.platform;
        }
        get type() {
          return this._config.type;
        }
        set type(t) {
          this._config.type = t;
        }
        get data() {
          return this._config.data;
        }
        set data(t) {
          this._config.data = $t(t);
        }
        get options() {
          return this._config.options;
        }
        set options(t) {
          this._config.options = t;
        }
        get plugins() {
          return this._config.plugins;
        }
        update() {
          const t = this._config;
          this.clearCache(), jt(t);
        }
        clearCache() {
          this._scopeCache.clear(), this._resolverCache.clear();
        }
        datasetScopeKeys(t) {
          return Kt(t, () => [[`datasets.${t}`, ""]]);
        }
        datasetAnimationScopeKeys(t, e) {
          return Kt(`${t}.transition.${e}`, () => [
            [`datasets.${t}.transitions.${e}`, `transitions.${e}`],
            [`datasets.${t}`, ""],
          ]);
        }
        datasetElementScopeKeys(t, e) {
          return Kt(`${t}-${e}`, () => [
            [
              `datasets.${t}.elements.${e}`,
              `datasets.${t}`,
              `elements.${e}`,
              "",
            ],
          ]);
        }
        pluginScopeKeys(t) {
          const e = t.id;
          return Kt(`${this.type}-plugin-${e}`, () => [
            [`plugins.${e}`, ...(t.additionalOptionScopes || [])],
          ]);
        }
        _cachedScopes(t, e) {
          const i = this._scopeCache;
          let s = i.get(t);
          return (s && !e) || ((s = new Map()), i.set(t, s)), s;
        }
        getOptionScopes(t, e, i) {
          const { options: n, type: o } = this,
            a = this._cachedScopes(t, i),
            r = a.get(e);
          if (r) return r;
          const h = new Set();
          e.forEach((e) => {
            t && (h.add(t), e.forEach((e) => Xt(h, t, e))),
              e.forEach((t) => Xt(h, n, t)),
              e.forEach((t) => Xt(h, s.U[o] || {}, t)),
              e.forEach((t) => Xt(h, s.d, t)),
              e.forEach((t) => Xt(h, s.a7, t));
          });
          const l = Array.from(h);
          return (
            0 === l.length && l.push(Object.create(null)),
            Yt.has(e) && a.set(e, l),
            l
          );
        }
        chartOptionScopes() {
          const { options: t, type: e } = this;
          return [
            t,
            s.U[e] || {},
            s.d.datasets[e] || {},
            { type: e },
            s.d,
            s.a7,
          ];
        }
        resolveNamedOptions(t, e, i, n = [""]) {
          const o = { $shared: !0 },
            { resolver: a, subPrefixes: r } = Gt(this._resolverCache, t, n);
          let h = a;
          if (
            (function (t, e) {
              const { isScriptable: i, isIndexable: n } = (0, s.ab)(t);
              for (const o of e) {
                const e = i(o),
                  a = n(o),
                  r = (a || e) && t[o];
                if ((e && ((0, s.a8)(r) || Jt(r))) || (a && (0, s.b)(r)))
                  return !0;
              }
              return !1;
            })(a, e)
          ) {
            (o.$shared = !1), (i = (0, s.a8)(i) ? i() : i);
            const e = this.createResolver(t, i, r);
            h = (0, s.a9)(a, i, e);
          }
          for (const s of e) o[s] = h[s];
          return o;
        }
        createResolver(t, e, i = [""], n) {
          const { resolver: o } = Gt(this._resolverCache, t, i);
          return (0, s.i)(e) ? (0, s.a9)(o, e, void 0, n) : o;
        }
      }
      function Gt(t, e, i) {
        let n = t.get(e);
        n || ((n = new Map()), t.set(e, n));
        const o = i.join();
        let a = n.get(o);
        if (!a) {
          (a = {
            resolver: (0, s.aa)(e, i),
            subPrefixes: i.filter((t) => !t.toLowerCase().includes("hover")),
          }),
            n.set(o, a);
        }
        return a;
      }
      const Jt = (t) =>
        (0, s.i)(t) &&
        Object.getOwnPropertyNames(t).reduce(
          (e, i) => e || (0, s.a8)(t[i]),
          !1
        );
      const qt = ["top", "bottom", "left", "right", "chartArea"];
      function Zt(t, e) {
        return (
          "top" === t || "bottom" === t || (-1 === qt.indexOf(t) && "x" === e)
        );
      }
      function te(t, e) {
        return function (i, s) {
          return i[t] === s[t] ? i[e] - s[e] : i[t] - s[t];
        };
      }
      function ee(t) {
        const e = t.chart,
          i = e.options.animation;
        e.notifyPlugins("afterRender"), (0, s.C)(i && i.onComplete, [t], e);
      }
      function ie(t) {
        const e = t.chart,
          i = e.options.animation;
        (0, s.C)(i && i.onProgress, [t], e);
      }
      function se(t) {
        return (
          (0, s.a6)() && "string" === typeof t
            ? (t = document.getElementById(t))
            : t && t.length && (t = t[0]),
          t && t.canvas && (t = t.canvas),
          t
        );
      }
      const ne = {},
        oe = (t) => {
          const e = se(t);
          return Object.values(ne)
            .filter((t) => t.canvas === e)
            .pop();
        };
      function ae(t, e, i) {
        const s = Object.keys(t);
        for (const n of s) {
          const s = +n;
          if (s >= e) {
            const o = t[n];
            delete t[n], (i > 0 || s > e) && (t[s + i] = o);
          }
        }
      }
      class re {
        constructor(t, e) {
          const i = (this.config = new Qt(e)),
            o = se(t),
            a = oe(o);
          if (a)
            throw new Error(
              "Canvas is already in use. Chart with ID '" +
                a.id +
                "' must be destroyed before the canvas with ID '" +
                a.canvas.id +
                "' can be reused."
            );
          const r = i.createResolver(i.chartOptionScopes(), this.getContext());
          (this.platform = new (i.platform ||
            (function (t) {
              return !(0, s.a6)() ||
                ("undefined" !== typeof OffscreenCanvas &&
                  t instanceof OffscreenCanvas)
                ? kt
                : Ft;
            })(o))()),
            this.platform.updateConfig(i);
          const h = this.platform.acquireContext(o, r.aspectRatio),
            l = h && h.canvas,
            c = l && l.height,
            d = l && l.width;
          (this.id = (0, s.ad)()),
            (this.ctx = h),
            (this.canvas = l),
            (this.width = d),
            (this.height = c),
            (this._options = r),
            (this._aspectRatio = this.aspectRatio),
            (this._layers = []),
            (this._metasets = []),
            (this._stacks = void 0),
            (this.boxes = []),
            (this.currentDevicePixelRatio = void 0),
            (this.chartArea = void 0),
            (this._active = []),
            (this._lastEvent = void 0),
            (this._listeners = {}),
            (this._responsiveListeners = void 0),
            (this._sortedMetasets = []),
            (this.scales = {}),
            (this._plugins = new Vt()),
            (this.$proxies = {}),
            (this._hiddenIndices = {}),
            (this.attached = !1),
            (this._animationsDisabled = void 0),
            (this.$context = void 0),
            (this._doResize = (0, s.ae)(
              (t) => this.update(t),
              r.resizeDelay || 0
            )),
            (this._dataChanges = []),
            (ne[this.id] = this),
            h && l
              ? (n.listen(this, "complete", ee),
                n.listen(this, "progress", ie),
                this._initialize(),
                this.attached && this.update())
              : console.error(
                  "Failed to create chart: can't acquire context from the given item"
                );
        }
        get aspectRatio() {
          const {
            options: { aspectRatio: t, maintainAspectRatio: e },
            width: i,
            height: n,
            _aspectRatio: o,
          } = this;
          return (0, s.k)(t) ? (e && o ? o : n ? i / n : null) : t;
        }
        get data() {
          return this.config.data;
        }
        set data(t) {
          this.config.data = t;
        }
        get options() {
          return this._options;
        }
        set options(t) {
          this.config.options = t;
        }
        _initialize() {
          return (
            this.notifyPlugins("beforeInit"),
            this.options.responsive
              ? this.resize()
              : (0, s.af)(this, this.options.devicePixelRatio),
            this.bindEvents(),
            this.notifyPlugins("afterInit"),
            this
          );
        }
        clear() {
          return (0, s.ag)(this.canvas, this.ctx), this;
        }
        stop() {
          return n.stop(this), this;
        }
        resize(t, e) {
          n.running(this)
            ? (this._resizeBeforeDraw = { width: t, height: e })
            : this._resize(t, e);
        }
        _resize(t, e) {
          const i = this.options,
            n = this.canvas,
            o = i.maintainAspectRatio && this.aspectRatio,
            a = this.platform.getMaximumSize(n, t, e, o),
            r = i.devicePixelRatio || this.platform.getDevicePixelRatio(),
            h = this.width ? "resize" : "attach";
          (this.width = a.width),
            (this.height = a.height),
            (this._aspectRatio = this.aspectRatio),
            (0, s.af)(this, r, !0) &&
              (this.notifyPlugins("resize", { size: a }),
              (0, s.C)(i.onResize, [this, a], this),
              this.attached && this._doResize(h) && this.render());
        }
        ensureScalesHaveIDs() {
          const t = this.options.scales || {};
          (0, s.Q)(t, (t, e) => {
            t.id = e;
          });
        }
        buildOrUpdateScales() {
          const t = this.options,
            e = t.scales,
            i = this.scales,
            n = Object.keys(i).reduce((t, e) => ((t[e] = !1), t), {});
          let o = [];
          e &&
            (o = o.concat(
              Object.keys(e).map((t) => {
                const i = e[t],
                  s = Wt(t, i),
                  n = "r" === s,
                  o = "x" === s;
                return {
                  options: i,
                  dposition: n ? "chartArea" : o ? "bottom" : "left",
                  dtype: n ? "radialLinear" : o ? "category" : "linear",
                };
              })
            )),
            (0, s.Q)(o, (e) => {
              const o = e.options,
                a = o.id,
                r = Wt(a, o),
                h = (0, s.v)(o.type, e.dtype);
              (void 0 !== o.position &&
                Zt(o.position, r) === Zt(e.dposition)) ||
                (o.position = e.dposition),
                (n[a] = !0);
              let l = null;
              if (a in i && i[a].type === h) l = i[a];
              else {
                (l = new (G.getScale(h))({
                  id: a,
                  type: h,
                  ctx: this.ctx,
                  chart: this,
                })),
                  (i[l.id] = l);
              }
              l.init(o, t);
            }),
            (0, s.Q)(n, (t, e) => {
              t || delete i[e];
            }),
            (0, s.Q)(i, (t) => {
              yt.configure(this, t, t.options), yt.addBox(this, t);
            });
        }
        _updateMetasets() {
          const t = this._metasets,
            e = this.data.datasets.length,
            i = t.length;
          if ((t.sort((t, e) => t.index - e.index), i > e)) {
            for (let t = e; t < i; ++t) this._destroyDatasetMeta(t);
            t.splice(e, i - e);
          }
          this._sortedMetasets = t.slice(0).sort(te("order", "index"));
        }
        _removeUnreferencedMetasets() {
          const {
            _metasets: t,
            data: { datasets: e },
          } = this;
          t.length > e.length && delete this._stacks,
            t.forEach((t, i) => {
              0 === e.filter((e) => e === t._dataset).length &&
                this._destroyDatasetMeta(i);
            });
        }
        buildOrUpdateControllers() {
          const t = [],
            e = this.data.datasets;
          let i, n;
          for (
            this._removeUnreferencedMetasets(), i = 0, n = e.length;
            i < n;
            i++
          ) {
            const n = e[i];
            let o = this.getDatasetMeta(i);
            const a = n.type || this.config.type;
            if (
              (o.type &&
                o.type !== a &&
                (this._destroyDatasetMeta(i), (o = this.getDatasetMeta(i))),
              (o.type = a),
              (o.indexAxis = n.indexAxis || Ht(a, this.options)),
              (o.order = n.order || 0),
              (o.index = i),
              (o.label = "" + n.label),
              (o.visible = this.isDatasetVisible(i)),
              o.controller)
            )
              o.controller.updateIndex(i), o.controller.linkScales();
            else {
              const e = G.getController(a),
                { datasetElementType: n, dataElementType: r } = s.d.datasets[a];
              Object.assign(e.prototype, {
                dataElementType: G.getElement(r),
                datasetElementType: n && G.getElement(n),
              }),
                (o.controller = new e(this, i)),
                t.push(o.controller);
            }
          }
          return this._updateMetasets(), t;
        }
        _resetElements() {
          (0, s.Q)(
            this.data.datasets,
            (t, e) => {
              this.getDatasetMeta(e).controller.reset();
            },
            this
          );
        }
        reset() {
          this._resetElements(), this.notifyPlugins("reset");
        }
        update(t) {
          const e = this.config;
          e.update();
          const i = (this._options = e.createResolver(
              e.chartOptionScopes(),
              this.getContext()
            )),
            n = (this._animationsDisabled = !i.animation);
          if (
            (this._updateScales(),
            this._checkEventBindings(),
            this._updateHiddenIndices(),
            this._plugins.invalidate(),
            !1 ===
              this.notifyPlugins("beforeUpdate", { mode: t, cancelable: !0 }))
          )
            return;
          const o = this.buildOrUpdateControllers();
          this.notifyPlugins("beforeElementsUpdate");
          let a = 0;
          for (let s = 0, l = this.data.datasets.length; s < l; s++) {
            const { controller: t } = this.getDatasetMeta(s),
              e = !n && -1 === o.indexOf(t);
            t.buildOrUpdateElements(e), (a = Math.max(+t.getMaxOverflow(), a));
          }
          (a = this._minPadding = i.layout.autoPadding ? a : 0),
            this._updateLayout(a),
            n ||
              (0, s.Q)(o, (t) => {
                t.reset();
              }),
            this._updateDatasets(t),
            this.notifyPlugins("afterUpdate", { mode: t }),
            this._layers.sort(te("z", "_idx"));
          const { _active: r, _lastEvent: h } = this;
          h
            ? this._eventHandler(h, !0)
            : r.length && this._updateHoverStyles(r, r, !0),
            this.render();
        }
        _updateScales() {
          (0, s.Q)(this.scales, (t) => {
            yt.removeBox(this, t);
          }),
            this.ensureScalesHaveIDs(),
            this.buildOrUpdateScales();
        }
        _checkEventBindings() {
          const t = this.options,
            e = new Set(Object.keys(this._listeners)),
            i = new Set(t.events);
          ((0, s.ah)(e, i) && !!this._responsiveListeners === t.responsive) ||
            (this.unbindEvents(), this.bindEvents());
        }
        _updateHiddenIndices() {
          const { _hiddenIndices: t } = this,
            e = this._getUniformDataChanges() || [];
          for (const { method: i, start: s, count: n } of e) {
            ae(t, s, "_removeElements" === i ? -n : n);
          }
        }
        _getUniformDataChanges() {
          const t = this._dataChanges;
          if (!t || !t.length) return;
          this._dataChanges = [];
          const e = this.data.datasets.length,
            i = (e) =>
              new Set(
                t
                  .filter((t) => t[0] === e)
                  .map((t, e) => e + "," + t.splice(1).join(","))
              ),
            n = i(0);
          for (let o = 1; o < e; o++) if (!(0, s.ah)(n, i(o))) return;
          return Array.from(n)
            .map((t) => t.split(","))
            .map((t) => ({ method: t[1], start: +t[2], count: +t[3] }));
        }
        _updateLayout(t) {
          if (!1 === this.notifyPlugins("beforeLayout", { cancelable: !0 }))
            return;
          yt.update(this, this.width, this.height, t);
          const e = this.chartArea,
            i = e.width <= 0 || e.height <= 0;
          (this._layers = []),
            (0, s.Q)(
              this.boxes,
              (t) => {
                (i && "chartArea" === t.position) ||
                  (t.configure && t.configure(),
                  this._layers.push(...t._layers()));
              },
              this
            ),
            this._layers.forEach((t, e) => {
              t._idx = e;
            }),
            this.notifyPlugins("afterLayout");
        }
        _updateDatasets(t) {
          if (
            !1 !==
            this.notifyPlugins("beforeDatasetsUpdate", {
              mode: t,
              cancelable: !0,
            })
          ) {
            for (let t = 0, e = this.data.datasets.length; t < e; ++t)
              this.getDatasetMeta(t).controller.configure();
            for (let e = 0, i = this.data.datasets.length; e < i; ++e)
              this._updateDataset(e, (0, s.a8)(t) ? t({ datasetIndex: e }) : t);
            this.notifyPlugins("afterDatasetsUpdate", { mode: t });
          }
        }
        _updateDataset(t, e) {
          const i = this.getDatasetMeta(t),
            s = { meta: i, index: t, mode: e, cancelable: !0 };
          !1 !== this.notifyPlugins("beforeDatasetUpdate", s) &&
            (i.controller._update(e),
            (s.cancelable = !1),
            this.notifyPlugins("afterDatasetUpdate", s));
        }
        render() {
          !1 !== this.notifyPlugins("beforeRender", { cancelable: !0 }) &&
            (n.has(this)
              ? this.attached && !n.running(this) && n.start(this)
              : (this.draw(), ee({ chart: this })));
        }
        draw() {
          let t;
          if (this._resizeBeforeDraw) {
            const { width: t, height: e } = this._resizeBeforeDraw;
            this._resize(t, e), (this._resizeBeforeDraw = null);
          }
          if ((this.clear(), this.width <= 0 || this.height <= 0)) return;
          if (!1 === this.notifyPlugins("beforeDraw", { cancelable: !0 }))
            return;
          const e = this._layers;
          for (t = 0; t < e.length && e[t].z <= 0; ++t)
            e[t].draw(this.chartArea);
          for (this._drawDatasets(); t < e.length; ++t)
            e[t].draw(this.chartArea);
          this.notifyPlugins("afterDraw");
        }
        _getSortedDatasetMetas(t) {
          const e = this._sortedMetasets,
            i = [];
          let s, n;
          for (s = 0, n = e.length; s < n; ++s) {
            const n = e[s];
            (t && !n.visible) || i.push(n);
          }
          return i;
        }
        getSortedVisibleDatasetMetas() {
          return this._getSortedDatasetMetas(!0);
        }
        _drawDatasets() {
          if (
            !1 === this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 })
          )
            return;
          const t = this.getSortedVisibleDatasetMetas();
          for (let e = t.length - 1; e >= 0; --e) this._drawDataset(t[e]);
          this.notifyPlugins("afterDatasetsDraw");
        }
        _drawDataset(t) {
          const e = this.ctx,
            i = t._clip,
            n = !i.disabled,
            o = this.chartArea,
            a = { meta: t, index: t.index, cancelable: !0 };
          !1 !== this.notifyPlugins("beforeDatasetDraw", a) &&
            (n &&
              (0, s.L)(e, {
                left: !1 === i.left ? 0 : o.left - i.left,
                right: !1 === i.right ? this.width : o.right + i.right,
                top: !1 === i.top ? 0 : o.top - i.top,
                bottom: !1 === i.bottom ? this.height : o.bottom + i.bottom,
              }),
            t.controller.draw(),
            n && (0, s.N)(e),
            (a.cancelable = !1),
            this.notifyPlugins("afterDatasetDraw", a));
        }
        isPointInArea(t) {
          return (0, s.$)(t, this.chartArea, this._minPadding);
        }
        getElementsAtEventForMode(t, e, i, s) {
          const n = ht.modes[e];
          return "function" === typeof n ? n(this, t, i, s) : [];
        }
        getDatasetMeta(t) {
          const e = this.data.datasets[t],
            i = this._metasets;
          let s = i.filter((t) => t && t._dataset === e).pop();
          return (
            s ||
              ((s = {
                type: null,
                data: [],
                dataset: null,
                controller: null,
                hidden: null,
                xAxisID: null,
                yAxisID: null,
                order: (e && e.order) || 0,
                index: t,
                _dataset: e,
                _parsed: [],
                _sorted: !1,
              }),
              i.push(s)),
            s
          );
        }
        getContext() {
          return (
            this.$context ||
            (this.$context = (0, s.h)(null, { chart: this, type: "chart" }))
          );
        }
        getVisibleDatasetCount() {
          return this.getSortedVisibleDatasetMetas().length;
        }
        isDatasetVisible(t) {
          const e = this.data.datasets[t];
          if (!e) return !1;
          const i = this.getDatasetMeta(t);
          return "boolean" === typeof i.hidden ? !i.hidden : !e.hidden;
        }
        setDatasetVisibility(t, e) {
          this.getDatasetMeta(t).hidden = !e;
        }
        toggleDataVisibility(t) {
          this._hiddenIndices[t] = !this._hiddenIndices[t];
        }
        getDataVisibility(t) {
          return !this._hiddenIndices[t];
        }
        _updateVisibility(t, e, i) {
          const n = i ? "show" : "hide",
            o = this.getDatasetMeta(t),
            a = o.controller._resolveAnimations(void 0, n);
          (0, s.j)(e)
            ? ((o.data[e].hidden = !i), this.update())
            : (this.setDatasetVisibility(t, i),
              a.update(o, { visible: i }),
              this.update((e) => (e.datasetIndex === t ? n : void 0)));
        }
        hide(t, e) {
          this._updateVisibility(t, e, !1);
        }
        show(t, e) {
          this._updateVisibility(t, e, !0);
        }
        _destroyDatasetMeta(t) {
          const e = this._metasets[t];
          e && e.controller && e.controller._destroy(),
            delete this._metasets[t];
        }
        _stop() {
          let t, e;
          for (
            this.stop(), n.remove(this), t = 0, e = this.data.datasets.length;
            t < e;
            ++t
          )
            this._destroyDatasetMeta(t);
        }
        destroy() {
          this.notifyPlugins("beforeDestroy");
          const { canvas: t, ctx: e } = this;
          this._stop(),
            this.config.clearCache(),
            t &&
              (this.unbindEvents(),
              (0, s.ag)(t, e),
              this.platform.releaseContext(e),
              (this.canvas = null),
              (this.ctx = null)),
            this.notifyPlugins("destroy"),
            delete ne[this.id],
            this.notifyPlugins("afterDestroy");
        }
        toBase64Image(...t) {
          return this.canvas.toDataURL(...t);
        }
        bindEvents() {
          this.bindUserEvents(),
            this.options.responsive
              ? this.bindResponsiveEvents()
              : (this.attached = !0);
        }
        bindUserEvents() {
          const t = this._listeners,
            e = this.platform,
            i = (i, s) => {
              e.addEventListener(this, i, s), (t[i] = s);
            },
            n = (t, e, i) => {
              (t.offsetX = e), (t.offsetY = i), this._eventHandler(t);
            };
          (0, s.Q)(this.options.events, (t) => i(t, n));
        }
        bindResponsiveEvents() {
          this._responsiveListeners || (this._responsiveListeners = {});
          const t = this._responsiveListeners,
            e = this.platform,
            i = (i, s) => {
              e.addEventListener(this, i, s), (t[i] = s);
            },
            s = (i, s) => {
              t[i] && (e.removeEventListener(this, i, s), delete t[i]);
            },
            n = (t, e) => {
              this.canvas && this.resize(t, e);
            };
          let o;
          const a = () => {
            s("attach", a),
              (this.attached = !0),
              this.resize(),
              i("resize", n),
              i("detach", o);
          };
          (o = () => {
            (this.attached = !1),
              s("resize", n),
              this._stop(),
              this._resize(0, 0),
              i("attach", a);
          }),
            e.isAttached(this.canvas) ? a() : o();
        }
        unbindEvents() {
          (0, s.Q)(this._listeners, (t, e) => {
            this.platform.removeEventListener(this, e, t);
          }),
            (this._listeners = {}),
            (0, s.Q)(this._responsiveListeners, (t, e) => {
              this.platform.removeEventListener(this, e, t);
            }),
            (this._responsiveListeners = void 0);
        }
        updateHoverStyle(t, e, i) {
          const s = i ? "set" : "remove";
          let n, o, a, r;
          for (
            "dataset" === e &&
              ((n = this.getDatasetMeta(t[0].datasetIndex)),
              n.controller["_" + s + "DatasetHoverStyle"]()),
              a = 0,
              r = t.length;
            a < r;
            ++a
          ) {
            o = t[a];
            const e = o && this.getDatasetMeta(o.datasetIndex).controller;
            e && e[s + "HoverStyle"](o.element, o.datasetIndex, o.index);
          }
        }
        getActiveElements() {
          return this._active || [];
        }
        setActiveElements(t) {
          const e = this._active || [],
            i = t.map(({ datasetIndex: t, index: e }) => {
              const i = this.getDatasetMeta(t);
              if (!i) throw new Error("No dataset found at index " + t);
              return { datasetIndex: t, element: i.data[e], index: e };
            });
          !(0, s.ai)(i, e) &&
            ((this._active = i),
            (this._lastEvent = null),
            this._updateHoverStyles(i, e));
        }
        notifyPlugins(t, e, i) {
          return this._plugins.notify(this, t, e, i);
        }
        _updateHoverStyles(t, e, i) {
          const s = this.options.hover,
            n = (t, e) =>
              t.filter(
                (t) =>
                  !e.some(
                    (e) =>
                      t.datasetIndex === e.datasetIndex && t.index === e.index
                  )
              ),
            o = n(e, t),
            a = i ? t : n(t, e);
          o.length && this.updateHoverStyle(o, s.mode, !1),
            a.length && s.mode && this.updateHoverStyle(a, s.mode, !0);
        }
        _eventHandler(t, e) {
          const i = {
              event: t,
              replay: e,
              cancelable: !0,
              inChartArea: this.isPointInArea(t),
            },
            s = (e) =>
              (e.options.events || this.options.events).includes(t.native.type);
          if (!1 === this.notifyPlugins("beforeEvent", i, s)) return;
          const n = this._handleEvent(t, e, i.inChartArea);
          return (
            (i.cancelable = !1),
            this.notifyPlugins("afterEvent", i, s),
            (n || i.changed) && this.render(),
            this
          );
        }
        _handleEvent(t, e, i) {
          const { _active: n = [], options: o } = this,
            a = e,
            r = this._getActiveElements(t, n, i, a),
            h = (0, s.aj)(t),
            l = (function (t, e, i, s) {
              return i && "mouseout" !== t.type ? (s ? e : t) : null;
            })(t, this._lastEvent, i, h);
          i &&
            ((this._lastEvent = null),
            (0, s.C)(o.onHover, [t, r, this], this),
            h && (0, s.C)(o.onClick, [t, r, this], this));
          const c = !(0, s.ai)(r, n);
          return (
            (c || e) && ((this._active = r), this._updateHoverStyles(r, n, e)),
            (this._lastEvent = l),
            c
          );
        }
        _getActiveElements(t, e, i, s) {
          if ("mouseout" === t.type) return [];
          if (!i) return e;
          const n = this.options.hover;
          return this.getElementsAtEventForMode(t, n.mode, n, s);
        }
      }
      const he = () => (0, s.Q)(re.instances, (t) => t._plugins.invalidate()),
        le = !0;
      function ce(t, e, i) {
        const {
          startAngle: n,
          pixelMargin: o,
          x: a,
          y: r,
          outerRadius: h,
          innerRadius: l,
        } = e;
        let c = o / h;
        t.beginPath(),
          t.arc(a, r, h, n - c, i + c),
          l > o
            ? ((c = o / l), t.arc(a, r, l, i + c, n - c, !0))
            : t.arc(a, r, o, i + s.H, n - s.H),
          t.closePath(),
          t.clip();
      }
      function de(t, e, i, n) {
        const o =
          ((a = t.options.borderRadius),
          (0, s.al)(a, ["outerStart", "outerEnd", "innerStart", "innerEnd"]));
        var a;
        const r = (i - e) / 2,
          h = Math.min(r, (n * e) / 2),
          l = (t) => {
            const e = ((i - Math.min(r, t)) * n) / 2;
            return (0, s.E)(t, 0, Math.min(r, e));
          };
        return {
          outerStart: l(o.outerStart),
          outerEnd: l(o.outerEnd),
          innerStart: (0, s.E)(o.innerStart, 0, h),
          innerEnd: (0, s.E)(o.innerEnd, 0, h),
        };
      }
      function ue(t, e, i, s) {
        return { x: i + t * Math.cos(e), y: s + t * Math.sin(e) };
      }
      function ge(t, e, i, n, o, a) {
        const { x: r, y: h, startAngle: l, pixelMargin: c, innerRadius: d } = e,
          u = Math.max(e.outerRadius + n + i - c, 0),
          g = d > 0 ? d + n + i + c : 0;
        let p = 0;
        const f = o - l;
        if (n) {
          const t = ((d > 0 ? d - n : 0) + (u > 0 ? u - n : 0)) / 2;
          p = (f - (0 !== t ? (f * t) / (t + n) : f)) / 2;
        }
        const m = (f - Math.max(0.001, f * u - i / s.P) / u) / 2,
          x = l + m + p,
          b = o - m - p,
          {
            outerStart: _,
            outerEnd: v,
            innerStart: y,
            innerEnd: M,
          } = de(e, g, u, b - x),
          k = u - _,
          w = u - v,
          S = x + _ / k,
          D = b - v / w,
          P = g + y,
          C = g + M,
          A = x + y / P,
          O = b - M / C;
        if ((t.beginPath(), a)) {
          if ((t.arc(r, h, u, S, D), v > 0)) {
            const e = ue(w, D, r, h);
            t.arc(e.x, e.y, v, D, b + s.H);
          }
          const e = ue(C, b, r, h);
          if ((t.lineTo(e.x, e.y), M > 0)) {
            const e = ue(C, O, r, h);
            t.arc(e.x, e.y, M, b + s.H, O + Math.PI);
          }
          if ((t.arc(r, h, g, b - M / g, x + y / g, !0), y > 0)) {
            const e = ue(P, A, r, h);
            t.arc(e.x, e.y, y, A + Math.PI, x - s.H);
          }
          const i = ue(k, x, r, h);
          if ((t.lineTo(i.x, i.y), _ > 0)) {
            const e = ue(k, S, r, h);
            t.arc(e.x, e.y, _, x - s.H, S);
          }
        } else {
          t.moveTo(r, h);
          const e = Math.cos(S) * u + r,
            i = Math.sin(S) * u + h;
          t.lineTo(e, i);
          const s = Math.cos(D) * u + r,
            n = Math.sin(D) * u + h;
          t.lineTo(s, n);
        }
        t.closePath();
      }
      function pe(t, e, i, n, o, a) {
        const { options: r } = e,
          { borderWidth: h, borderJoinStyle: l } = r,
          c = "inner" === r.borderAlign;
        h &&
          (c
            ? ((t.lineWidth = 2 * h), (t.lineJoin = l || "round"))
            : ((t.lineWidth = h), (t.lineJoin = l || "bevel")),
          e.fullCircles &&
            (function (t, e, i) {
              const {
                  x: n,
                  y: o,
                  startAngle: a,
                  pixelMargin: r,
                  fullCircles: h,
                } = e,
                l = Math.max(e.outerRadius - r, 0),
                c = e.innerRadius + r;
              let d;
              for (
                i && ce(t, e, a + s.T),
                  t.beginPath(),
                  t.arc(n, o, c, a + s.T, a, !0),
                  d = 0;
                d < h;
                ++d
              )
                t.stroke();
              for (t.beginPath(), t.arc(n, o, l, a, a + s.T), d = 0; d < h; ++d)
                t.stroke();
            })(t, e, c),
          c && ce(t, e, o),
          ge(t, e, i, n, o, a),
          t.stroke());
      }
      Object.defineProperties(re, {
        defaults: { enumerable: le, value: s.d },
        instances: { enumerable: le, value: ne },
        overrides: { enumerable: le, value: s.U },
        registry: { enumerable: le, value: G },
        version: { enumerable: le, value: "3.9.1" },
        getChart: { enumerable: le, value: oe },
        register: {
          enumerable: le,
          value: (...t) => {
            G.add(...t), he();
          },
        },
        unregister: {
          enumerable: le,
          value: (...t) => {
            G.remove(...t), he();
          },
        },
      });
      class fe extends F {
        constructor(t) {
          super(),
            (this.options = void 0),
            (this.circumference = void 0),
            (this.startAngle = void 0),
            (this.endAngle = void 0),
            (this.innerRadius = void 0),
            (this.outerRadius = void 0),
            (this.pixelMargin = 0),
            (this.fullCircles = 0),
            t && Object.assign(this, t);
        }
        inRange(t, e, i) {
          const n = this.getProps(["x", "y"], i),
            { angle: o, distance: a } = (0, s.a0)(n, { x: t, y: e }),
            {
              startAngle: r,
              endAngle: h,
              innerRadius: l,
              outerRadius: c,
              circumference: d,
            } = this.getProps(
              [
                "startAngle",
                "endAngle",
                "innerRadius",
                "outerRadius",
                "circumference",
              ],
              i
            ),
            u = this.options.spacing / 2,
            g = (0, s.v)(d, h - r) >= s.T || (0, s.p)(o, r, h),
            p = (0, s.ak)(a, l + u, c + u);
          return g && p;
        }
        getCenterPoint(t) {
          const {
              x: e,
              y: i,
              startAngle: s,
              endAngle: n,
              innerRadius: o,
              outerRadius: a,
            } = this.getProps(
              [
                "x",
                "y",
                "startAngle",
                "endAngle",
                "innerRadius",
                "outerRadius",
                "circumference",
              ],
              t
            ),
            { offset: r, spacing: h } = this.options,
            l = (s + n) / 2,
            c = (o + a + h + r) / 2;
          return { x: e + Math.cos(l) * c, y: i + Math.sin(l) * c };
        }
        tooltipPosition(t) {
          return this.getCenterPoint(t);
        }
        draw(t) {
          const { options: e, circumference: i } = this,
            n = (e.offset || 0) / 2,
            o = (e.spacing || 0) / 2,
            a = e.circular;
          if (
            ((this.pixelMargin = "inner" === e.borderAlign ? 0.33 : 0),
            (this.fullCircles = i > s.T ? Math.floor(i / s.T) : 0),
            0 === i || this.innerRadius < 0 || this.outerRadius < 0)
          )
            return;
          t.save();
          let r = 0;
          if (n) {
            r = n / 2;
            const e = (this.startAngle + this.endAngle) / 2;
            t.translate(Math.cos(e) * r, Math.sin(e) * r),
              this.circumference >= s.P && (r = n);
          }
          (t.fillStyle = e.backgroundColor), (t.strokeStyle = e.borderColor);
          const h = (function (t, e, i, n, o) {
            const { fullCircles: a, startAngle: r, circumference: h } = e;
            let l = e.endAngle;
            if (a) {
              ge(t, e, i, n, r + s.T, o);
              for (let e = 0; e < a; ++e) t.fill();
              isNaN(h) || ((l = r + (h % s.T)), h % s.T === 0 && (l += s.T));
            }
            return ge(t, e, i, n, l, o), t.fill(), l;
          })(t, this, r, o, a);
          pe(t, this, r, o, h, a), t.restore();
        }
      }
      function me(t, e, i = e) {
        (t.lineCap = (0, s.v)(i.borderCapStyle, e.borderCapStyle)),
          t.setLineDash((0, s.v)(i.borderDash, e.borderDash)),
          (t.lineDashOffset = (0, s.v)(i.borderDashOffset, e.borderDashOffset)),
          (t.lineJoin = (0, s.v)(i.borderJoinStyle, e.borderJoinStyle)),
          (t.lineWidth = (0, s.v)(i.borderWidth, e.borderWidth)),
          (t.strokeStyle = (0, s.v)(i.borderColor, e.borderColor));
      }
      function xe(t, e, i) {
        t.lineTo(i.x, i.y);
      }
      function be(t, e, i = {}) {
        const s = t.length,
          { start: n = 0, end: o = s - 1 } = i,
          { start: a, end: r } = e,
          h = Math.max(n, a),
          l = Math.min(o, r),
          c = (n < a && o < a) || (n > r && o > r);
        return {
          count: s,
          start: h,
          loop: e.loop,
          ilen: l < h && !c ? s + l - h : l - h,
        };
      }
      function _e(t, e, i, n) {
        const { points: o, options: a } = e,
          { count: r, start: h, loop: l, ilen: c } = be(o, i, n),
          d = (function (t) {
            return t.stepped
              ? s.as
              : t.tension || "monotone" === t.cubicInterpolationMode
              ? s.at
              : xe;
          })(a);
        let u,
          g,
          p,
          { move: f = !0, reverse: m } = n || {};
        for (u = 0; u <= c; ++u)
          (g = o[(h + (m ? c - u : u)) % r]),
            g.skip ||
              (f ? (t.moveTo(g.x, g.y), (f = !1)) : d(t, p, g, m, a.stepped),
              (p = g));
        return (
          l && ((g = o[(h + (m ? c : 0)) % r]), d(t, p, g, m, a.stepped)), !!l
        );
      }
      function ve(t, e, i, s) {
        const n = e.points,
          { count: o, start: a, ilen: r } = be(n, i, s),
          { move: h = !0, reverse: l } = s || {};
        let c,
          d,
          u,
          g,
          p,
          f,
          m = 0,
          x = 0;
        const b = (t) => (a + (l ? r - t : t)) % o,
          _ = () => {
            g !== p && (t.lineTo(m, p), t.lineTo(m, g), t.lineTo(m, f));
          };
        for (h && ((d = n[b(0)]), t.moveTo(d.x, d.y)), c = 0; c <= r; ++c) {
          if (((d = n[b(c)]), d.skip)) continue;
          const e = d.x,
            i = d.y,
            s = 0 | e;
          s === u
            ? (i < g ? (g = i) : i > p && (p = i), (m = (x * m + e) / ++x))
            : (_(), t.lineTo(e, i), (u = s), (x = 0), (g = p = i)),
            (f = i);
        }
        _();
      }
      function ye(t) {
        const e = t.options,
          i = e.borderDash && e.borderDash.length;
        return !t._decimated &&
          !t._loop &&
          !e.tension &&
          "monotone" !== e.cubicInterpolationMode &&
          !e.stepped &&
          !i
          ? ve
          : _e;
      }
      (fe.id = "arc"),
        (fe.defaults = {
          borderAlign: "center",
          borderColor: "#fff",
          borderJoinStyle: void 0,
          borderRadius: 0,
          borderWidth: 2,
          offset: 0,
          spacing: 0,
          angle: void 0,
          circular: !0,
        }),
        (fe.defaultRoutes = { backgroundColor: "backgroundColor" });
      const Me = "function" === typeof Path2D;
      function ke(t, e, i, s) {
        Me && !e.options.segment
          ? (function (t, e, i, s) {
              let n = e._path;
              n ||
                ((n = e._path = new Path2D()),
                e.path(n, i, s) && n.closePath()),
                me(t, e.options),
                t.stroke(n);
            })(t, e, i, s)
          : (function (t, e, i, s) {
              const { segments: n, options: o } = e,
                a = ye(e);
              for (const r of n)
                me(t, o, r.style),
                  t.beginPath(),
                  a(t, e, r, { start: i, end: i + s - 1 }) && t.closePath(),
                  t.stroke();
            })(t, e, i, s);
      }
      class we extends F {
        constructor(t) {
          super(),
            (this.animated = !0),
            (this.options = void 0),
            (this._chart = void 0),
            (this._loop = void 0),
            (this._fullLoop = void 0),
            (this._path = void 0),
            (this._points = void 0),
            (this._segments = void 0),
            (this._decimated = !1),
            (this._pointsUpdated = !1),
            (this._datasetIndex = void 0),
            t && Object.assign(this, t);
        }
        updateControlPoints(t, e) {
          const i = this.options;
          if (
            (i.tension || "monotone" === i.cubicInterpolationMode) &&
            !i.stepped &&
            !this._pointsUpdated
          ) {
            const n = i.spanGaps ? this._loop : this._fullLoop;
            (0, s.am)(this._points, i, t, n, e), (this._pointsUpdated = !0);
          }
        }
        set points(t) {
          (this._points = t),
            delete this._segments,
            delete this._path,
            (this._pointsUpdated = !1);
        }
        get points() {
          return this._points;
        }
        get segments() {
          return (
            this._segments ||
            (this._segments = (0, s.an)(this, this.options.segment))
          );
        }
        first() {
          const t = this.segments,
            e = this.points;
          return t.length && e[t[0].start];
        }
        last() {
          const t = this.segments,
            e = this.points,
            i = t.length;
          return i && e[t[i - 1].end];
        }
        interpolate(t, e) {
          const i = this.options,
            n = t[e],
            o = this.points,
            a = (0, s.ao)(this, { property: e, start: n, end: n });
          if (!a.length) return;
          const r = [],
            h = (function (t) {
              return t.stepped
                ? s.ap
                : t.tension || "monotone" === t.cubicInterpolationMode
                ? s.aq
                : s.ar;
            })(i);
          let l, c;
          for (l = 0, c = a.length; l < c; ++l) {
            const { start: s, end: c } = a[l],
              d = o[s],
              u = o[c];
            if (d === u) {
              r.push(d);
              continue;
            }
            const g = h(d, u, Math.abs((n - d[e]) / (u[e] - d[e])), i.stepped);
            (g[e] = t[e]), r.push(g);
          }
          return 1 === r.length ? r[0] : r;
        }
        pathSegment(t, e, i) {
          return ye(this)(t, this, e, i);
        }
        path(t, e, i) {
          const s = this.segments,
            n = ye(this);
          let o = this._loop;
          (e = e || 0), (i = i || this.points.length - e);
          for (const a of s) o &= n(t, this, a, { start: e, end: e + i - 1 });
          return !!o;
        }
        draw(t, e, i, s) {
          const n = this.options || {};
          (this.points || []).length &&
            n.borderWidth &&
            (t.save(), ke(t, this, i, s), t.restore()),
            this.animated &&
              ((this._pointsUpdated = !1), (this._path = void 0));
        }
      }
      function Se(t, e, i, s) {
        const n = t.options,
          { [i]: o } = t.getProps([i], s);
        return Math.abs(e - o) < n.radius + n.hitRadius;
      }
      (we.id = "line"),
        (we.defaults = {
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: "miter",
          borderWidth: 3,
          capBezierPoints: !0,
          cubicInterpolationMode: "default",
          fill: !1,
          spanGaps: !1,
          stepped: !1,
          tension: 0,
        }),
        (we.defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor",
        }),
        (we.descriptors = {
          _scriptable: !0,
          _indexable: (t) => "borderDash" !== t && "fill" !== t,
        });
      class De extends F {
        constructor(t) {
          super(),
            (this.options = void 0),
            (this.parsed = void 0),
            (this.skip = void 0),
            (this.stop = void 0),
            t && Object.assign(this, t);
        }
        inRange(t, e, i) {
          const s = this.options,
            { x: n, y: o } = this.getProps(["x", "y"], i);
          return (
            Math.pow(t - n, 2) + Math.pow(e - o, 2) <
            Math.pow(s.hitRadius + s.radius, 2)
          );
        }
        inXRange(t, e) {
          return Se(this, t, "x", e);
        }
        inYRange(t, e) {
          return Se(this, t, "y", e);
        }
        getCenterPoint(t) {
          const { x: e, y: i } = this.getProps(["x", "y"], t);
          return { x: e, y: i };
        }
        size(t) {
          let e = (t = t || this.options || {}).radius || 0;
          e = Math.max(e, (e && t.hoverRadius) || 0);
          return 2 * (e + ((e && t.borderWidth) || 0));
        }
        draw(t, e) {
          const i = this.options;
          this.skip ||
            i.radius < 0.1 ||
            !(0, s.$)(this, e, this.size(i) / 2) ||
            ((t.strokeStyle = i.borderColor),
            (t.lineWidth = i.borderWidth),
            (t.fillStyle = i.backgroundColor),
            (0, s.au)(t, i, this.x, this.y));
        }
        getRange() {
          const t = this.options || {};
          return t.radius + t.hitRadius;
        }
      }
      function Pe(t, e) {
        const {
          x: i,
          y: s,
          base: n,
          width: o,
          height: a,
        } = t.getProps(["x", "y", "base", "width", "height"], e);
        let r, h, l, c, d;
        return (
          t.horizontal
            ? ((d = a / 2),
              (r = Math.min(i, n)),
              (h = Math.max(i, n)),
              (l = s - d),
              (c = s + d))
            : ((d = o / 2),
              (r = i - d),
              (h = i + d),
              (l = Math.min(s, n)),
              (c = Math.max(s, n))),
          { left: r, top: l, right: h, bottom: c }
        );
      }
      function Ce(t, e, i, n) {
        return t ? 0 : (0, s.E)(e, i, n);
      }
      function Ae(t) {
        const e = Pe(t),
          i = e.right - e.left,
          n = e.bottom - e.top,
          o = (function (t, e, i) {
            const n = t.options.borderWidth,
              o = t.borderSkipped,
              a = (0, s.aw)(n);
            return {
              t: Ce(o.top, a.top, 0, i),
              r: Ce(o.right, a.right, 0, e),
              b: Ce(o.bottom, a.bottom, 0, i),
              l: Ce(o.left, a.left, 0, e),
            };
          })(t, i / 2, n / 2),
          a = (function (t, e, i) {
            const { enableBorderRadius: n } = t.getProps([
                "enableBorderRadius",
              ]),
              o = t.options.borderRadius,
              a = (0, s.ax)(o),
              r = Math.min(e, i),
              h = t.borderSkipped,
              l = n || (0, s.i)(o);
            return {
              topLeft: Ce(!l || h.top || h.left, a.topLeft, 0, r),
              topRight: Ce(!l || h.top || h.right, a.topRight, 0, r),
              bottomLeft: Ce(!l || h.bottom || h.left, a.bottomLeft, 0, r),
              bottomRight: Ce(!l || h.bottom || h.right, a.bottomRight, 0, r),
            };
          })(t, i / 2, n / 2);
        return {
          outer: { x: e.left, y: e.top, w: i, h: n, radius: a },
          inner: {
            x: e.left + o.l,
            y: e.top + o.t,
            w: i - o.l - o.r,
            h: n - o.t - o.b,
            radius: {
              topLeft: Math.max(0, a.topLeft - Math.max(o.t, o.l)),
              topRight: Math.max(0, a.topRight - Math.max(o.t, o.r)),
              bottomLeft: Math.max(0, a.bottomLeft - Math.max(o.b, o.l)),
              bottomRight: Math.max(0, a.bottomRight - Math.max(o.b, o.r)),
            },
          },
        };
      }
      function Oe(t, e, i, n) {
        const o = null === e,
          a = null === i,
          r = t && !(o && a) && Pe(t, n);
        return (
          r &&
          (o || (0, s.ak)(e, r.left, r.right)) &&
          (a || (0, s.ak)(i, r.top, r.bottom))
        );
      }
      function Le(t, e) {
        t.rect(e.x, e.y, e.w, e.h);
      }
      function Ee(t, e, i = {}) {
        const s = t.x !== i.x ? -e : 0,
          n = t.y !== i.y ? -e : 0,
          o = (t.x + t.w !== i.x + i.w ? e : 0) - s,
          a = (t.y + t.h !== i.y + i.h ? e : 0) - n;
        return {
          x: t.x + s,
          y: t.y + n,
          w: t.w + o,
          h: t.h + a,
          radius: t.radius,
        };
      }
      (De.id = "point"),
        (De.defaults = {
          borderWidth: 1,
          hitRadius: 1,
          hoverBorderWidth: 1,
          hoverRadius: 4,
          pointStyle: "circle",
          radius: 3,
          rotation: 0,
        }),
        (De.defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor",
        });
      class Te extends F {
        constructor(t) {
          super(),
            (this.options = void 0),
            (this.horizontal = void 0),
            (this.base = void 0),
            (this.width = void 0),
            (this.height = void 0),
            (this.inflateAmount = void 0),
            t && Object.assign(this, t);
        }
        draw(t) {
          const {
              inflateAmount: e,
              options: { borderColor: i, backgroundColor: n },
            } = this,
            { inner: o, outer: a } = Ae(this),
            r =
              (h = a.radius).topLeft ||
              h.topRight ||
              h.bottomLeft ||
              h.bottomRight
                ? s.av
                : Le;
          var h;
          t.save(),
            (a.w === o.w && a.h === o.h) ||
              (t.beginPath(),
              r(t, Ee(a, e, o)),
              t.clip(),
              r(t, Ee(o, -e, a)),
              (t.fillStyle = i),
              t.fill("evenodd")),
            t.beginPath(),
            r(t, Ee(o, e)),
            (t.fillStyle = n),
            t.fill(),
            t.restore();
        }
        inRange(t, e, i) {
          return Oe(this, t, e, i);
        }
        inXRange(t, e) {
          return Oe(this, t, null, e);
        }
        inYRange(t, e) {
          return Oe(this, null, t, e);
        }
        getCenterPoint(t) {
          const {
            x: e,
            y: i,
            base: s,
            horizontal: n,
          } = this.getProps(["x", "y", "base", "horizontal"], t);
          return { x: n ? (e + s) / 2 : e, y: n ? i : (i + s) / 2 };
        }
        getRange(t) {
          return "x" === t ? this.width / 2 : this.height / 2;
        }
      }
      (Te.id = "bar"),
        (Te.defaults = {
          borderSkipped: "start",
          borderWidth: 0,
          borderRadius: 0,
          inflateAmount: "auto",
          pointStyle: void 0,
        }),
        (Te.defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor",
        });
      var Re = Object.freeze({
        __proto__: null,
        ArcElement: fe,
        LineElement: we,
        PointElement: De,
        BarElement: Te,
      });
      function ze(t) {
        if (t._decimated) {
          const e = t._data;
          delete t._decimated,
            delete t._data,
            Object.defineProperty(t, "data", { value: e });
        }
      }
      function Ie(t) {
        t.data.datasets.forEach((t) => {
          ze(t);
        });
      }
      var Fe = {
        id: "decimation",
        defaults: { algorithm: "min-max", enabled: !1 },
        beforeElementsUpdate: (t, e, i) => {
          if (!i.enabled) return void Ie(t);
          const n = t.width;
          t.data.datasets.forEach((e, o) => {
            const { _data: a, indexAxis: r } = e,
              h = t.getDatasetMeta(o),
              l = a || e.data;
            if ("y" === (0, s.a)([r, t.options.indexAxis])) return;
            if (!h.controller.supportsDecimation) return;
            const c = t.scales[h.xAxisID];
            if ("linear" !== c.type && "time" !== c.type) return;
            if (t.options.parsing) return;
            let { start: d, count: u } = (function (t, e) {
              const i = e.length;
              let n,
                o = 0;
              const { iScale: a } = t,
                {
                  min: r,
                  max: h,
                  minDefined: l,
                  maxDefined: c,
                } = a.getUserBounds();
              return (
                l && (o = (0, s.E)((0, s.Z)(e, a.axis, r).lo, 0, i - 1)),
                (n = c
                  ? (0, s.E)((0, s.Z)(e, a.axis, h).hi + 1, o, i) - o
                  : i - o),
                { start: o, count: n }
              );
            })(h, l);
            if (u <= (i.threshold || 4 * n)) return void ze(e);
            let g;
            switch (
              ((0, s.k)(a) &&
                ((e._data = l),
                delete e.data,
                Object.defineProperty(e, "data", {
                  configurable: !0,
                  enumerable: !0,
                  get: function () {
                    return this._decimated;
                  },
                  set: function (t) {
                    this._data = t;
                  },
                })),
              i.algorithm)
            ) {
              case "lttb":
                g = (function (t, e, i, s, n) {
                  const o = n.samples || s;
                  if (o >= i) return t.slice(e, e + i);
                  const a = [],
                    r = (i - 2) / (o - 2);
                  let h = 0;
                  const l = e + i - 1;
                  let c,
                    d,
                    u,
                    g,
                    p,
                    f = e;
                  for (a[h++] = t[f], c = 0; c < o - 2; c++) {
                    let s,
                      n = 0,
                      o = 0;
                    const l = Math.floor((c + 1) * r) + 1 + e,
                      m = Math.min(Math.floor((c + 2) * r) + 1, i) + e,
                      x = m - l;
                    for (s = l; s < m; s++) (n += t[s].x), (o += t[s].y);
                    (n /= x), (o /= x);
                    const b = Math.floor(c * r) + 1 + e,
                      _ = Math.min(Math.floor((c + 1) * r) + 1, i) + e,
                      { x: v, y: y } = t[f];
                    for (u = g = -1, s = b; s < _; s++)
                      (g =
                        0.5 *
                        Math.abs(
                          (v - n) * (t[s].y - y) - (v - t[s].x) * (o - y)
                        )),
                        g > u && ((u = g), (d = t[s]), (p = s));
                    (a[h++] = d), (f = p);
                  }
                  return (a[h++] = t[l]), a;
                })(l, d, u, n, i);
                break;
              case "min-max":
                g = (function (t, e, i, n) {
                  let o,
                    a,
                    r,
                    h,
                    l,
                    c,
                    d,
                    u,
                    g,
                    p,
                    f = 0,
                    m = 0;
                  const x = [],
                    b = e + i - 1,
                    _ = t[e].x,
                    v = t[b].x - _;
                  for (o = e; o < e + i; ++o) {
                    (a = t[o]), (r = ((a.x - _) / v) * n), (h = a.y);
                    const e = 0 | r;
                    if (e === l)
                      h < g ? ((g = h), (c = o)) : h > p && ((p = h), (d = o)),
                        (f = (m * f + a.x) / ++m);
                    else {
                      const i = o - 1;
                      if (!(0, s.k)(c) && !(0, s.k)(d)) {
                        const e = Math.min(c, d),
                          s = Math.max(c, d);
                        e !== u && e !== i && x.push({ ...t[e], x: f }),
                          s !== u && s !== i && x.push({ ...t[s], x: f });
                      }
                      o > 0 && i !== u && x.push(t[i]),
                        x.push(a),
                        (l = e),
                        (m = 0),
                        (g = p = h),
                        (c = d = u = o);
                    }
                  }
                  return x;
                })(l, d, u, n);
                break;
              default:
                throw new Error(
                  `Unsupported decimation algorithm '${i.algorithm}'`
                );
            }
            e._decimated = g;
          });
        },
        destroy(t) {
          Ie(t);
        },
      };
      function Ve(t, e, i, n) {
        if (n) return;
        let o = e[t],
          a = i[t];
        return (
          "angle" === t && ((o = (0, s.az)(o)), (a = (0, s.az)(a))),
          { property: t, start: o, end: a }
        );
      }
      function Be(t, e, i) {
        for (; e > t; e--) {
          const t = i[e];
          if (!isNaN(t.x) && !isNaN(t.y)) break;
        }
        return e;
      }
      function Ne(t, e, i, s) {
        return t && e ? s(t[i], e[i]) : t ? t[i] : e ? e[i] : 0;
      }
      function He(t, e) {
        let i = [],
          n = !1;
        return (
          (0, s.b)(t)
            ? ((n = !0), (i = t))
            : (i = (function (t, e) {
                const { x: i = null, y: s = null } = t || {},
                  n = e.points,
                  o = [];
                return (
                  e.segments.forEach(({ start: t, end: e }) => {
                    e = Be(t, e, n);
                    const a = n[t],
                      r = n[e];
                    null !== s
                      ? (o.push({ x: a.x, y: s }), o.push({ x: r.x, y: s }))
                      : null !== i &&
                        (o.push({ x: i, y: a.y }), o.push({ x: i, y: r.y }));
                  }),
                  o
                );
              })(t, e)),
          i.length
            ? new we({
                points: i,
                options: { tension: 0 },
                _loop: n,
                _fullLoop: n,
              })
            : null
        );
      }
      function We(t) {
        return t && !1 !== t.fill;
      }
      function je(t, e, i) {
        let n = t[e].fill;
        const o = [e];
        let a;
        if (!i) return n;
        for (; !1 !== n && -1 === o.indexOf(n); ) {
          if (!(0, s.g)(n)) return n;
          if (((a = t[n]), !a)) return !1;
          if (a.visible) return n;
          o.push(n), (n = a.fill);
        }
        return !1;
      }
      function $e(t, e, i) {
        const n = (function (t) {
          const e = t.options,
            i = e.fill;
          let n = (0, s.v)(i && i.target, i);
          void 0 === n && (n = !!e.backgroundColor);
          if (!1 === n || null === n) return !1;
          if (!0 === n) return "origin";
          return n;
        })(t);
        if ((0, s.i)(n)) return !isNaN(n.value) && n;
        let o = parseFloat(n);
        return (0, s.g)(o) && Math.floor(o) === o
          ? (function (t, e, i, s) {
              ("-" !== t && "+" !== t) || (i = e + i);
              if (i === e || i < 0 || i >= s) return !1;
              return i;
            })(n[0], e, o, i)
          : ["origin", "start", "end", "stack", "shape"].indexOf(n) >= 0 && n;
      }
      function Ue(t, e, i) {
        const s = [];
        for (let n = 0; n < i.length; n++) {
          const o = i[n],
            { first: a, last: r, point: h } = Ye(o, e, "x");
          if (!(!h || (a && r)))
            if (a) s.unshift(h);
            else if ((t.push(h), !r)) break;
        }
        t.push(...s);
      }
      function Ye(t, e, i) {
        const n = t.interpolate(e, i);
        if (!n) return {};
        const o = n[i],
          a = t.segments,
          r = t.points;
        let h = !1,
          l = !1;
        for (let c = 0; c < a.length; c++) {
          const t = a[c],
            e = r[t.start][i],
            n = r[t.end][i];
          if ((0, s.ak)(o, e, n)) {
            (h = o === e), (l = o === n);
            break;
          }
        }
        return { first: h, last: l, point: n };
      }
      class Ke {
        constructor(t) {
          (this.x = t.x), (this.y = t.y), (this.radius = t.radius);
        }
        pathSegment(t, e, i) {
          const { x: n, y: o, radius: a } = this;
          return (
            (e = e || { start: 0, end: s.T }),
            t.arc(n, o, a, e.end, e.start, !0),
            !i.bounds
          );
        }
        interpolate(t) {
          const { x: e, y: i, radius: s } = this,
            n = t.angle;
          return { x: e + Math.cos(n) * s, y: i + Math.sin(n) * s, angle: n };
        }
      }
      function Xe(t) {
        const { chart: e, fill: i, line: n } = t;
        if ((0, s.g)(i))
          return (function (t, e) {
            const i = t.getDatasetMeta(e);
            return i && t.isDatasetVisible(e) ? i.dataset : null;
          })(e, i);
        if ("stack" === i)
          return (function (t) {
            const { scale: e, index: i, line: s } = t,
              n = [],
              o = s.segments,
              a = s.points,
              r = (function (t, e) {
                const i = [],
                  s = t.getMatchingVisibleMetas("line");
                for (let n = 0; n < s.length; n++) {
                  const t = s[n];
                  if (t.index === e) break;
                  t.hidden || i.unshift(t.dataset);
                }
                return i;
              })(e, i);
            r.push(He({ x: null, y: e.bottom }, s));
            for (let h = 0; h < o.length; h++) {
              const t = o[h];
              for (let e = t.start; e <= t.end; e++) Ue(n, a[e], r);
            }
            return new we({ points: n, options: {} });
          })(t);
        if ("shape" === i) return !0;
        const o = (function (t) {
          if ((t.scale || {}).getPointPositionForValue)
            return (function (t) {
              const { scale: e, fill: i } = t,
                n = e.options,
                o = e.getLabels().length,
                a = n.reverse ? e.max : e.min,
                r = (function (t, e, i) {
                  let n;
                  return (
                    (n =
                      "start" === t
                        ? i
                        : "end" === t
                        ? e.options.reverse
                          ? e.min
                          : e.max
                        : (0, s.i)(t)
                        ? t.value
                        : e.getBaseValue()),
                    n
                  );
                })(i, e, a),
                h = [];
              if (n.grid.circular) {
                const t = e.getPointPositionForValue(0, a);
                return new Ke({
                  x: t.x,
                  y: t.y,
                  radius: e.getDistanceFromCenterForValue(r),
                });
              }
              for (let s = 0; s < o; ++s)
                h.push(e.getPointPositionForValue(s, r));
              return h;
            })(t);
          return (function (t) {
            const { scale: e = {}, fill: i } = t,
              n = (function (t, e) {
                let i = null;
                return (
                  "start" === t
                    ? (i = e.bottom)
                    : "end" === t
                    ? (i = e.top)
                    : (0, s.i)(t)
                    ? (i = e.getPixelForValue(t.value))
                    : e.getBasePixel && (i = e.getBasePixel()),
                  i
                );
              })(i, e);
            if ((0, s.g)(n)) {
              const t = e.isHorizontal();
              return { x: t ? n : null, y: t ? null : n };
            }
            return null;
          })(t);
        })(t);
        return o instanceof Ke ? o : He(o, n);
      }
      function Qe(t, e, i) {
        const n = Xe(e),
          { line: o, scale: a, axis: r } = e,
          h = o.options,
          l = h.fill,
          c = h.backgroundColor,
          { above: d = c, below: u = c } = l || {};
        n &&
          o.points.length &&
          ((0, s.L)(t, i),
          (function (t, e) {
            const {
                line: i,
                target: s,
                above: n,
                below: o,
                area: a,
                scale: r,
              } = e,
              h = i._loop ? "angle" : e.axis;
            t.save(),
              "x" === h &&
                o !== n &&
                (Ge(t, s, a.top),
                Je(t, { line: i, target: s, color: n, scale: r, property: h }),
                t.restore(),
                t.save(),
                Ge(t, s, a.bottom));
            Je(t, { line: i, target: s, color: o, scale: r, property: h }),
              t.restore();
          })(t, {
            line: o,
            target: n,
            above: d,
            below: u,
            area: i,
            scale: a,
            axis: r,
          }),
          (0, s.N)(t));
      }
      function Ge(t, e, i) {
        const { segments: s, points: n } = e;
        let o = !0,
          a = !1;
        t.beginPath();
        for (const r of s) {
          const { start: s, end: h } = r,
            l = n[s],
            c = n[Be(s, h, n)];
          o
            ? (t.moveTo(l.x, l.y), (o = !1))
            : (t.lineTo(l.x, i), t.lineTo(l.x, l.y)),
            (a = !!e.pathSegment(t, r, { move: a })),
            a ? t.closePath() : t.lineTo(c.x, i);
        }
        t.lineTo(e.first().x, i), t.closePath(), t.clip();
      }
      function Je(t, e) {
        const { line: i, target: n, property: o, color: a, scale: r } = e,
          h = (function (t, e, i) {
            const n = t.segments,
              o = t.points,
              a = e.points,
              r = [];
            for (const h of n) {
              let { start: t, end: n } = h;
              n = Be(t, n, o);
              const l = Ve(i, o[t], o[n], h.loop);
              if (!e.segments) {
                r.push({ source: h, target: l, start: o[t], end: o[n] });
                continue;
              }
              const c = (0, s.ao)(e, l);
              for (const e of c) {
                const t = Ve(i, a[e.start], a[e.end], e.loop),
                  n = (0, s.ay)(h, o, t);
                for (const s of n)
                  r.push({
                    source: s,
                    target: e,
                    start: { [i]: Ne(l, t, "start", Math.max) },
                    end: { [i]: Ne(l, t, "end", Math.min) },
                  });
              }
            }
            return r;
          })(i, n, o);
        for (const { source: s, target: l, start: c, end: d } of h) {
          const { style: { backgroundColor: e = a } = {} } = s,
            h = !0 !== n;
          t.save(),
            (t.fillStyle = e),
            qe(t, r, h && Ve(o, c, d)),
            t.beginPath();
          const u = !!i.pathSegment(t, s);
          let g;
          if (h) {
            u ? t.closePath() : Ze(t, n, d, o);
            const e = !!n.pathSegment(t, l, { move: u, reverse: !0 });
            (g = u && e), g || Ze(t, n, c, o);
          }
          t.closePath(), t.fill(g ? "evenodd" : "nonzero"), t.restore();
        }
      }
      function qe(t, e, i) {
        const { top: s, bottom: n } = e.chart.chartArea,
          { property: o, start: a, end: r } = i || {};
        "x" === o && (t.beginPath(), t.rect(a, s, r - a, n - s), t.clip());
      }
      function Ze(t, e, i, s) {
        const n = e.interpolate(i, s);
        n && t.lineTo(n.x, n.y);
      }
      var ti = {
        id: "filler",
        afterDatasetsUpdate(t, e, i) {
          const s = (t.data.datasets || []).length,
            n = [];
          let o, a, r, h;
          for (a = 0; a < s; ++a)
            (o = t.getDatasetMeta(a)),
              (r = o.dataset),
              (h = null),
              r &&
                r.options &&
                r instanceof we &&
                (h = {
                  visible: t.isDatasetVisible(a),
                  index: a,
                  fill: $e(r, a, s),
                  chart: t,
                  axis: o.controller.options.indexAxis,
                  scale: o.vScale,
                  line: r,
                }),
              (o.$filler = h),
              n.push(h);
          for (a = 0; a < s; ++a)
            (h = n[a]), h && !1 !== h.fill && (h.fill = je(n, a, i.propagate));
        },
        beforeDraw(t, e, i) {
          const s = "beforeDraw" === i.drawTime,
            n = t.getSortedVisibleDatasetMetas(),
            o = t.chartArea;
          for (let a = n.length - 1; a >= 0; --a) {
            const e = n[a].$filler;
            e &&
              (e.line.updateControlPoints(o, e.axis),
              s && e.fill && Qe(t.ctx, e, o));
          }
        },
        beforeDatasetsDraw(t, e, i) {
          if ("beforeDatasetsDraw" !== i.drawTime) return;
          const s = t.getSortedVisibleDatasetMetas();
          for (let n = s.length - 1; n >= 0; --n) {
            const e = s[n].$filler;
            We(e) && Qe(t.ctx, e, t.chartArea);
          }
        },
        beforeDatasetDraw(t, e, i) {
          const s = e.meta.$filler;
          We(s) &&
            "beforeDatasetDraw" === i.drawTime &&
            Qe(t.ctx, s, t.chartArea);
        },
        defaults: { propagate: !0, drawTime: "beforeDatasetDraw" },
      };
      const ei = (t, e) => {
        let { boxHeight: i = e, boxWidth: s = e } = t;
        return (
          t.usePointStyle &&
            ((i = Math.min(i, e)), (s = t.pointStyleWidth || Math.min(s, e))),
          { boxWidth: s, boxHeight: i, itemHeight: Math.max(e, i) }
        );
      };
      class ii extends F {
        constructor(t) {
          super(),
            (this._added = !1),
            (this.legendHitBoxes = []),
            (this._hoveredItem = null),
            (this.doughnutMode = !1),
            (this.chart = t.chart),
            (this.options = t.options),
            (this.ctx = t.ctx),
            (this.legendItems = void 0),
            (this.columnSizes = void 0),
            (this.lineWidths = void 0),
            (this.maxHeight = void 0),
            (this.maxWidth = void 0),
            (this.top = void 0),
            (this.bottom = void 0),
            (this.left = void 0),
            (this.right = void 0),
            (this.height = void 0),
            (this.width = void 0),
            (this._margins = void 0),
            (this.position = void 0),
            (this.weight = void 0),
            (this.fullSize = void 0);
        }
        update(t, e, i) {
          (this.maxWidth = t),
            (this.maxHeight = e),
            (this._margins = i),
            this.setDimensions(),
            this.buildLabels(),
            this.fit();
        }
        setDimensions() {
          this.isHorizontal()
            ? ((this.width = this.maxWidth),
              (this.left = this._margins.left),
              (this.right = this.width))
            : ((this.height = this.maxHeight),
              (this.top = this._margins.top),
              (this.bottom = this.height));
        }
        buildLabels() {
          const t = this.options.labels || {};
          let e = (0, s.C)(t.generateLabels, [this.chart], this) || [];
          t.filter && (e = e.filter((e) => t.filter(e, this.chart.data))),
            t.sort && (e = e.sort((e, i) => t.sort(e, i, this.chart.data))),
            this.options.reverse && e.reverse(),
            (this.legendItems = e);
        }
        fit() {
          const { options: t, ctx: e } = this;
          if (!t.display) return void (this.width = this.height = 0);
          const i = t.labels,
            n = (0, s.O)(i.font),
            o = n.size,
            a = this._computeTitleHeight(),
            { boxWidth: r, itemHeight: h } = ei(i, o);
          let l, c;
          (e.font = n.string),
            this.isHorizontal()
              ? ((l = this.maxWidth), (c = this._fitRows(a, o, r, h) + 10))
              : ((c = this.maxHeight), (l = this._fitCols(a, o, r, h) + 10)),
            (this.width = Math.min(l, t.maxWidth || this.maxWidth)),
            (this.height = Math.min(c, t.maxHeight || this.maxHeight));
        }
        _fitRows(t, e, i, s) {
          const {
              ctx: n,
              maxWidth: o,
              options: {
                labels: { padding: a },
              },
            } = this,
            r = (this.legendHitBoxes = []),
            h = (this.lineWidths = [0]),
            l = s + a;
          let c = t;
          (n.textAlign = "left"), (n.textBaseline = "middle");
          let d = -1,
            u = -l;
          return (
            this.legendItems.forEach((t, g) => {
              const p = i + e / 2 + n.measureText(t.text).width;
              (0 === g || h[h.length - 1] + p + 2 * a > o) &&
                ((c += l), (h[h.length - (g > 0 ? 0 : 1)] = 0), (u += l), d++),
                (r[g] = { left: 0, top: u, row: d, width: p, height: s }),
                (h[h.length - 1] += p + a);
            }),
            c
          );
        }
        _fitCols(t, e, i, s) {
          const {
              ctx: n,
              maxHeight: o,
              options: {
                labels: { padding: a },
              },
            } = this,
            r = (this.legendHitBoxes = []),
            h = (this.columnSizes = []),
            l = o - t;
          let c = a,
            d = 0,
            u = 0,
            g = 0,
            p = 0;
          return (
            this.legendItems.forEach((t, o) => {
              const f = i + e / 2 + n.measureText(t.text).width;
              o > 0 &&
                u + s + 2 * a > l &&
                ((c += d + a),
                h.push({ width: d, height: u }),
                (g += d + a),
                p++,
                (d = u = 0)),
                (r[o] = { left: g, top: u, col: p, width: f, height: s }),
                (d = Math.max(d, f)),
                (u += s + a);
            }),
            (c += d),
            h.push({ width: d, height: u }),
            c
          );
        }
        adjustHitBoxes() {
          if (!this.options.display) return;
          const t = this._computeTitleHeight(),
            {
              legendHitBoxes: e,
              options: {
                align: i,
                labels: { padding: n },
                rtl: o,
              },
            } = this,
            a = (0, s.aA)(o, this.left, this.width);
          if (this.isHorizontal()) {
            let o = 0,
              r = (0, s.S)(i, this.left + n, this.right - this.lineWidths[o]);
            for (const h of e)
              o !== h.row &&
                ((o = h.row),
                (r = (0, s.S)(
                  i,
                  this.left + n,
                  this.right - this.lineWidths[o]
                ))),
                (h.top += this.top + t + n),
                (h.left = a.leftForLtr(a.x(r), h.width)),
                (r += h.width + n);
          } else {
            let o = 0,
              r = (0, s.S)(
                i,
                this.top + t + n,
                this.bottom - this.columnSizes[o].height
              );
            for (const h of e)
              h.col !== o &&
                ((o = h.col),
                (r = (0, s.S)(
                  i,
                  this.top + t + n,
                  this.bottom - this.columnSizes[o].height
                ))),
                (h.top = r),
                (h.left += this.left + n),
                (h.left = a.leftForLtr(a.x(h.left), h.width)),
                (r += h.height + n);
          }
        }
        isHorizontal() {
          return (
            "top" === this.options.position ||
            "bottom" === this.options.position
          );
        }
        draw() {
          if (this.options.display) {
            const t = this.ctx;
            (0, s.L)(t, this), this._draw(), (0, s.N)(t);
          }
        }
        _draw() {
          const { options: t, columnSizes: e, lineWidths: i, ctx: n } = this,
            { align: o, labels: a } = t,
            r = s.d.color,
            h = (0, s.aA)(t.rtl, this.left, this.width),
            l = (0, s.O)(a.font),
            { color: c, padding: d } = a,
            u = l.size,
            g = u / 2;
          let p;
          this.drawTitle(),
            (n.textAlign = h.textAlign("left")),
            (n.textBaseline = "middle"),
            (n.lineWidth = 0.5),
            (n.font = l.string);
          const { boxWidth: f, boxHeight: m, itemHeight: x } = ei(a, u),
            b = this.isHorizontal(),
            _ = this._computeTitleHeight();
          (p = b
            ? {
                x: (0, s.S)(o, this.left + d, this.right - i[0]),
                y: this.top + d + _,
                line: 0,
              }
            : {
                x: this.left + d,
                y: (0, s.S)(o, this.top + _ + d, this.bottom - e[0].height),
                line: 0,
              }),
            (0, s.aB)(this.ctx, t.textDirection);
          const v = x + d;
          this.legendItems.forEach((y, M) => {
            (n.strokeStyle = y.fontColor || c),
              (n.fillStyle = y.fontColor || c);
            const k = n.measureText(y.text).width,
              w = h.textAlign(y.textAlign || (y.textAlign = a.textAlign)),
              S = f + g + k;
            let D = p.x,
              P = p.y;
            h.setWidth(this.width),
              b
                ? M > 0 &&
                  D + S + d > this.right &&
                  ((P = p.y += v),
                  p.line++,
                  (D = p.x =
                    (0, s.S)(o, this.left + d, this.right - i[p.line])))
                : M > 0 &&
                  P + v > this.bottom &&
                  ((D = p.x = D + e[p.line].width + d),
                  p.line++,
                  (P = p.y =
                    (0, s.S)(
                      o,
                      this.top + _ + d,
                      this.bottom - e[p.line].height
                    )));
            !(function (t, e, i) {
              if (isNaN(f) || f <= 0 || isNaN(m) || m < 0) return;
              n.save();
              const o = (0, s.v)(i.lineWidth, 1);
              if (
                ((n.fillStyle = (0, s.v)(i.fillStyle, r)),
                (n.lineCap = (0, s.v)(i.lineCap, "butt")),
                (n.lineDashOffset = (0, s.v)(i.lineDashOffset, 0)),
                (n.lineJoin = (0, s.v)(i.lineJoin, "miter")),
                (n.lineWidth = o),
                (n.strokeStyle = (0, s.v)(i.strokeStyle, r)),
                n.setLineDash((0, s.v)(i.lineDash, [])),
                a.usePointStyle)
              ) {
                const r = {
                    radius: (m * Math.SQRT2) / 2,
                    pointStyle: i.pointStyle,
                    rotation: i.rotation,
                    borderWidth: o,
                  },
                  l = h.xPlus(t, f / 2),
                  c = e + g;
                (0, s.aE)(n, r, l, c, a.pointStyleWidth && f);
              } else {
                const a = e + Math.max((u - m) / 2, 0),
                  r = h.leftForLtr(t, f),
                  l = (0, s.ax)(i.borderRadius);
                n.beginPath(),
                  Object.values(l).some((t) => 0 !== t)
                    ? (0, s.av)(n, { x: r, y: a, w: f, h: m, radius: l })
                    : n.rect(r, a, f, m),
                  n.fill(),
                  0 !== o && n.stroke();
              }
              n.restore();
            })(h.x(D), P, y),
              (D = (0, s.aC)(w, D + f + g, b ? D + S : this.right, t.rtl)),
              (function (t, e, i) {
                (0, s.M)(n, i.text, t, e + x / 2, l, {
                  strikethrough: i.hidden,
                  textAlign: h.textAlign(i.textAlign),
                });
              })(h.x(D), P, y),
              b ? (p.x += S + d) : (p.y += v);
          }),
            (0, s.aD)(this.ctx, t.textDirection);
        }
        drawTitle() {
          const t = this.options,
            e = t.title,
            i = (0, s.O)(e.font),
            n = (0, s.K)(e.padding);
          if (!e.display) return;
          const o = (0, s.aA)(t.rtl, this.left, this.width),
            a = this.ctx,
            r = e.position,
            h = i.size / 2,
            l = n.top + h;
          let c,
            d = this.left,
            u = this.width;
          if (this.isHorizontal())
            (u = Math.max(...this.lineWidths)),
              (c = this.top + l),
              (d = (0, s.S)(t.align, d, this.right - u));
          else {
            const e = this.columnSizes.reduce(
              (t, e) => Math.max(t, e.height),
              0
            );
            c =
              l +
              (0, s.S)(
                t.align,
                this.top,
                this.bottom - e - t.labels.padding - this._computeTitleHeight()
              );
          }
          const g = (0, s.S)(r, d, d + u);
          (a.textAlign = o.textAlign((0, s.R)(r))),
            (a.textBaseline = "middle"),
            (a.strokeStyle = e.color),
            (a.fillStyle = e.color),
            (a.font = i.string),
            (0, s.M)(a, e.text, g, c, i);
        }
        _computeTitleHeight() {
          const t = this.options.title,
            e = (0, s.O)(t.font),
            i = (0, s.K)(t.padding);
          return t.display ? e.lineHeight + i.height : 0;
        }
        _getLegendItemAt(t, e) {
          let i, n, o;
          if (
            (0, s.ak)(t, this.left, this.right) &&
            (0, s.ak)(e, this.top, this.bottom)
          )
            for (o = this.legendHitBoxes, i = 0; i < o.length; ++i)
              if (
                ((n = o[i]),
                (0, s.ak)(t, n.left, n.left + n.width) &&
                  (0, s.ak)(e, n.top, n.top + n.height))
              )
                return this.legendItems[i];
          return null;
        }
        handleEvent(t) {
          const e = this.options;
          if (
            !(function (t, e) {
              if (
                ("mousemove" === t || "mouseout" === t) &&
                (e.onHover || e.onLeave)
              )
                return !0;
              if (e.onClick && ("click" === t || "mouseup" === t)) return !0;
              return !1;
            })(t.type, e)
          )
            return;
          const i = this._getLegendItemAt(t.x, t.y);
          if ("mousemove" === t.type || "mouseout" === t.type) {
            const a = this._hoveredItem,
              r =
                ((o = i),
                null !== (n = a) &&
                  null !== o &&
                  n.datasetIndex === o.datasetIndex &&
                  n.index === o.index);
            a && !r && (0, s.C)(e.onLeave, [t, a, this], this),
              (this._hoveredItem = i),
              i && !r && (0, s.C)(e.onHover, [t, i, this], this);
          } else i && (0, s.C)(e.onClick, [t, i, this], this);
          var n, o;
        }
      }
      var si = {
        id: "legend",
        _element: ii,
        start(t, e, i) {
          const s = (t.legend = new ii({ ctx: t.ctx, options: i, chart: t }));
          yt.configure(t, s, i), yt.addBox(t, s);
        },
        stop(t) {
          yt.removeBox(t, t.legend), delete t.legend;
        },
        beforeUpdate(t, e, i) {
          const s = t.legend;
          yt.configure(t, s, i), (s.options = i);
        },
        afterUpdate(t) {
          const e = t.legend;
          e.buildLabels(), e.adjustHitBoxes();
        },
        afterEvent(t, e) {
          e.replay || t.legend.handleEvent(e.event);
        },
        defaults: {
          display: !0,
          position: "top",
          align: "center",
          fullSize: !0,
          reverse: !1,
          weight: 1e3,
          onClick(t, e, i) {
            const s = e.datasetIndex,
              n = i.chart;
            n.isDatasetVisible(s)
              ? (n.hide(s), (e.hidden = !0))
              : (n.show(s), (e.hidden = !1));
          },
          onHover: null,
          onLeave: null,
          labels: {
            color: (t) => t.chart.options.color,
            boxWidth: 40,
            padding: 10,
            generateLabels(t) {
              const e = t.data.datasets,
                {
                  labels: {
                    usePointStyle: i,
                    pointStyle: n,
                    textAlign: o,
                    color: a,
                  },
                } = t.legend.options;
              return t._getSortedDatasetMetas().map((t) => {
                const r = t.controller.getStyle(i ? 0 : void 0),
                  h = (0, s.K)(r.borderWidth);
                return {
                  text: e[t.index].label,
                  fillStyle: r.backgroundColor,
                  fontColor: a,
                  hidden: !t.visible,
                  lineCap: r.borderCapStyle,
                  lineDash: r.borderDash,
                  lineDashOffset: r.borderDashOffset,
                  lineJoin: r.borderJoinStyle,
                  lineWidth: (h.width + h.height) / 4,
                  strokeStyle: r.borderColor,
                  pointStyle: n || r.pointStyle,
                  rotation: r.rotation,
                  textAlign: o || r.textAlign,
                  borderRadius: 0,
                  datasetIndex: t.index,
                };
              }, this);
            },
          },
          title: {
            color: (t) => t.chart.options.color,
            display: !1,
            position: "center",
            text: "",
          },
        },
        descriptors: {
          _scriptable: (t) => !t.startsWith("on"),
          labels: {
            _scriptable: (t) =>
              !["generateLabels", "filter", "sort"].includes(t),
          },
        },
      };
      class ni extends F {
        constructor(t) {
          super(),
            (this.chart = t.chart),
            (this.options = t.options),
            (this.ctx = t.ctx),
            (this._padding = void 0),
            (this.top = void 0),
            (this.bottom = void 0),
            (this.left = void 0),
            (this.right = void 0),
            (this.width = void 0),
            (this.height = void 0),
            (this.position = void 0),
            (this.weight = void 0),
            (this.fullSize = void 0);
        }
        update(t, e) {
          const i = this.options;
          if (((this.left = 0), (this.top = 0), !i.display))
            return void (this.width =
              this.height =
              this.right =
              this.bottom =
                0);
          (this.width = this.right = t), (this.height = this.bottom = e);
          const n = (0, s.b)(i.text) ? i.text.length : 1;
          this._padding = (0, s.K)(i.padding);
          const o = n * (0, s.O)(i.font).lineHeight + this._padding.height;
          this.isHorizontal() ? (this.height = o) : (this.width = o);
        }
        isHorizontal() {
          const t = this.options.position;
          return "top" === t || "bottom" === t;
        }
        _drawArgs(t) {
          const { top: e, left: i, bottom: n, right: o, options: a } = this,
            r = a.align;
          let h,
            l,
            c,
            d = 0;
          return (
            this.isHorizontal()
              ? ((l = (0, s.S)(r, i, o)), (c = e + t), (h = o - i))
              : ("left" === a.position
                  ? ((l = i + t), (c = (0, s.S)(r, n, e)), (d = -0.5 * s.P))
                  : ((l = o - t), (c = (0, s.S)(r, e, n)), (d = 0.5 * s.P)),
                (h = n - e)),
            { titleX: l, titleY: c, maxWidth: h, rotation: d }
          );
        }
        draw() {
          const t = this.ctx,
            e = this.options;
          if (!e.display) return;
          const i = (0, s.O)(e.font),
            n = i.lineHeight / 2 + this._padding.top,
            {
              titleX: o,
              titleY: a,
              maxWidth: r,
              rotation: h,
            } = this._drawArgs(n);
          (0, s.M)(t, e.text, 0, 0, i, {
            color: e.color,
            maxWidth: r,
            rotation: h,
            textAlign: (0, s.R)(e.align),
            textBaseline: "middle",
            translation: [o, a],
          });
        }
      }
      var oi = {
        id: "title",
        _element: ni,
        start(t, e, i) {
          !(function (t, e) {
            const i = new ni({ ctx: t.ctx, options: e, chart: t });
            yt.configure(t, i, e), yt.addBox(t, i), (t.titleBlock = i);
          })(t, i);
        },
        stop(t) {
          const e = t.titleBlock;
          yt.removeBox(t, e), delete t.titleBlock;
        },
        beforeUpdate(t, e, i) {
          const s = t.titleBlock;
          yt.configure(t, s, i), (s.options = i);
        },
        defaults: {
          align: "center",
          display: !1,
          font: { weight: "bold" },
          fullSize: !0,
          padding: 10,
          position: "top",
          text: "",
          weight: 2e3,
        },
        defaultRoutes: { color: "color" },
        descriptors: { _scriptable: !0, _indexable: !1 },
      };
      const ai = new WeakMap();
      var ri = {
        id: "subtitle",
        start(t, e, i) {
          const s = new ni({ ctx: t.ctx, options: i, chart: t });
          yt.configure(t, s, i), yt.addBox(t, s), ai.set(t, s);
        },
        stop(t) {
          yt.removeBox(t, ai.get(t)), ai.delete(t);
        },
        beforeUpdate(t, e, i) {
          const s = ai.get(t);
          yt.configure(t, s, i), (s.options = i);
        },
        defaults: {
          align: "center",
          display: !1,
          font: { weight: "normal" },
          fullSize: !0,
          padding: 0,
          position: "top",
          text: "",
          weight: 1500,
        },
        defaultRoutes: { color: "color" },
        descriptors: { _scriptable: !0, _indexable: !1 },
      };
      const hi = {
        average(t) {
          if (!t.length) return !1;
          let e,
            i,
            s = 0,
            n = 0,
            o = 0;
          for (e = 0, i = t.length; e < i; ++e) {
            const i = t[e].element;
            if (i && i.hasValue()) {
              const t = i.tooltipPosition();
              (s += t.x), (n += t.y), ++o;
            }
          }
          return { x: s / o, y: n / o };
        },
        nearest(t, e) {
          if (!t.length) return !1;
          let i,
            n,
            o,
            a = e.x,
            r = e.y,
            h = Number.POSITIVE_INFINITY;
          for (i = 0, n = t.length; i < n; ++i) {
            const n = t[i].element;
            if (n && n.hasValue()) {
              const t = n.getCenterPoint(),
                i = (0, s.aG)(e, t);
              i < h && ((h = i), (o = n));
            }
          }
          if (o) {
            const t = o.tooltipPosition();
            (a = t.x), (r = t.y);
          }
          return { x: a, y: r };
        },
      };
      function li(t, e) {
        return (
          e && ((0, s.b)(e) ? Array.prototype.push.apply(t, e) : t.push(e)), t
        );
      }
      function ci(t) {
        return ("string" === typeof t || t instanceof String) &&
          t.indexOf("\n") > -1
          ? t.split("\n")
          : t;
      }
      function di(t, e) {
        const { element: i, datasetIndex: s, index: n } = e,
          o = t.getDatasetMeta(s).controller,
          { label: a, value: r } = o.getLabelAndValue(n);
        return {
          chart: t,
          label: a,
          parsed: o.getParsed(n),
          raw: t.data.datasets[s].data[n],
          formattedValue: r,
          dataset: o.getDataset(),
          dataIndex: n,
          datasetIndex: s,
          element: i,
        };
      }
      function ui(t, e) {
        const i = t.chart.ctx,
          { body: n, footer: o, title: a } = t,
          { boxWidth: r, boxHeight: h } = e,
          l = (0, s.O)(e.bodyFont),
          c = (0, s.O)(e.titleFont),
          d = (0, s.O)(e.footerFont),
          u = a.length,
          g = o.length,
          p = n.length,
          f = (0, s.K)(e.padding);
        let m = f.height,
          x = 0,
          b = n.reduce(
            (t, e) => t + e.before.length + e.lines.length + e.after.length,
            0
          );
        if (
          ((b += t.beforeBody.length + t.afterBody.length),
          u &&
            (m +=
              u * c.lineHeight +
              (u - 1) * e.titleSpacing +
              e.titleMarginBottom),
          b)
        ) {
          m +=
            p * (e.displayColors ? Math.max(h, l.lineHeight) : l.lineHeight) +
            (b - p) * l.lineHeight +
            (b - 1) * e.bodySpacing;
        }
        g &&
          (m +=
            e.footerMarginTop + g * d.lineHeight + (g - 1) * e.footerSpacing);
        let _ = 0;
        const v = function (t) {
          x = Math.max(x, i.measureText(t).width + _);
        };
        return (
          i.save(),
          (i.font = c.string),
          (0, s.Q)(t.title, v),
          (i.font = l.string),
          (0, s.Q)(t.beforeBody.concat(t.afterBody), v),
          (_ = e.displayColors ? r + 2 + e.boxPadding : 0),
          (0, s.Q)(n, (t) => {
            (0, s.Q)(t.before, v), (0, s.Q)(t.lines, v), (0, s.Q)(t.after, v);
          }),
          (_ = 0),
          (i.font = d.string),
          (0, s.Q)(t.footer, v),
          i.restore(),
          (x += f.width),
          { width: x, height: m }
        );
      }
      function gi(t, e, i, s) {
        const { x: n, width: o } = i,
          {
            width: a,
            chartArea: { left: r, right: h },
          } = t;
        let l = "center";
        return (
          "center" === s
            ? (l = n <= (r + h) / 2 ? "left" : "right")
            : n <= o / 2
            ? (l = "left")
            : n >= a - o / 2 && (l = "right"),
          (function (t, e, i, s) {
            const { x: n, width: o } = s,
              a = i.caretSize + i.caretPadding;
            return (
              ("left" === t && n + o + a > e.width) ||
              ("right" === t && n - o - a < 0) ||
              void 0
            );
          })(l, t, e, i) && (l = "center"),
          l
        );
      }
      function pi(t, e, i) {
        const s =
          i.yAlign ||
          e.yAlign ||
          (function (t, e) {
            const { y: i, height: s } = e;
            return i < s / 2
              ? "top"
              : i > t.height - s / 2
              ? "bottom"
              : "center";
          })(t, i);
        return { xAlign: i.xAlign || e.xAlign || gi(t, e, i, s), yAlign: s };
      }
      function fi(t, e, i, n) {
        const { caretSize: o, caretPadding: a, cornerRadius: r } = t,
          { xAlign: h, yAlign: l } = i,
          c = o + a,
          {
            topLeft: d,
            topRight: u,
            bottomLeft: g,
            bottomRight: p,
          } = (0, s.ax)(r);
        let f = (function (t, e) {
          let { x: i, width: s } = t;
          return "right" === e ? (i -= s) : "center" === e && (i -= s / 2), i;
        })(e, h);
        const m = (function (t, e, i) {
          let { y: s, height: n } = t;
          return (
            "top" === e ? (s += i) : (s -= "bottom" === e ? n + i : n / 2), s
          );
        })(e, l, c);
        return (
          "center" === l
            ? "left" === h
              ? (f += c)
              : "right" === h && (f -= c)
            : "left" === h
            ? (f -= Math.max(d, g) + o)
            : "right" === h && (f += Math.max(u, p) + o),
          {
            x: (0, s.E)(f, 0, n.width - e.width),
            y: (0, s.E)(m, 0, n.height - e.height),
          }
        );
      }
      function mi(t, e, i) {
        const n = (0, s.K)(i.padding);
        return "center" === e
          ? t.x + t.width / 2
          : "right" === e
          ? t.x + t.width - n.right
          : t.x + n.left;
      }
      function xi(t) {
        return li([], ci(t));
      }
      function bi(t, e) {
        const i =
          e && e.dataset && e.dataset.tooltip && e.dataset.tooltip.callbacks;
        return i ? t.override(i) : t;
      }
      class _i extends F {
        constructor(t) {
          super(),
            (this.opacity = 0),
            (this._active = []),
            (this._eventPosition = void 0),
            (this._size = void 0),
            (this._cachedAnimations = void 0),
            (this._tooltipItems = []),
            (this.$animations = void 0),
            (this.$context = void 0),
            (this.chart = t.chart || t._chart),
            (this._chart = this.chart),
            (this.options = t.options),
            (this.dataPoints = void 0),
            (this.title = void 0),
            (this.beforeBody = void 0),
            (this.body = void 0),
            (this.afterBody = void 0),
            (this.footer = void 0),
            (this.xAlign = void 0),
            (this.yAlign = void 0),
            (this.x = void 0),
            (this.y = void 0),
            (this.height = void 0),
            (this.width = void 0),
            (this.caretX = void 0),
            (this.caretY = void 0),
            (this.labelColors = void 0),
            (this.labelPointStyles = void 0),
            (this.labelTextColors = void 0);
        }
        initialize(t) {
          (this.options = t),
            (this._cachedAnimations = void 0),
            (this.$context = void 0);
        }
        _resolveAnimations() {
          const t = this._cachedAnimations;
          if (t) return t;
          const e = this.chart,
            i = this.options.setContext(this.getContext()),
            s = i.enabled && e.options.animation && i.animations,
            n = new l(this.chart, s);
          return s._cacheable && (this._cachedAnimations = Object.freeze(n)), n;
        }
        getContext() {
          return (
            this.$context ||
            (this.$context =
              ((t = this.chart.getContext()),
              (e = this),
              (i = this._tooltipItems),
              (0, s.h)(t, { tooltip: e, tooltipItems: i, type: "tooltip" })))
          );
          var t, e, i;
        }
        getTitle(t, e) {
          const { callbacks: i } = e,
            s = i.beforeTitle.apply(this, [t]),
            n = i.title.apply(this, [t]),
            o = i.afterTitle.apply(this, [t]);
          let a = [];
          return (a = li(a, ci(s))), (a = li(a, ci(n))), (a = li(a, ci(o))), a;
        }
        getBeforeBody(t, e) {
          return xi(e.callbacks.beforeBody.apply(this, [t]));
        }
        getBody(t, e) {
          const { callbacks: i } = e,
            n = [];
          return (
            (0, s.Q)(t, (t) => {
              const e = { before: [], lines: [], after: [] },
                s = bi(i, t);
              li(e.before, ci(s.beforeLabel.call(this, t))),
                li(e.lines, s.label.call(this, t)),
                li(e.after, ci(s.afterLabel.call(this, t))),
                n.push(e);
            }),
            n
          );
        }
        getAfterBody(t, e) {
          return xi(e.callbacks.afterBody.apply(this, [t]));
        }
        getFooter(t, e) {
          const { callbacks: i } = e,
            s = i.beforeFooter.apply(this, [t]),
            n = i.footer.apply(this, [t]),
            o = i.afterFooter.apply(this, [t]);
          let a = [];
          return (a = li(a, ci(s))), (a = li(a, ci(n))), (a = li(a, ci(o))), a;
        }
        _createItems(t) {
          const e = this._active,
            i = this.chart.data,
            n = [],
            o = [],
            a = [];
          let r,
            h,
            l = [];
          for (r = 0, h = e.length; r < h; ++r) l.push(di(this.chart, e[r]));
          return (
            t.filter && (l = l.filter((e, s, n) => t.filter(e, s, n, i))),
            t.itemSort && (l = l.sort((e, s) => t.itemSort(e, s, i))),
            (0, s.Q)(l, (e) => {
              const i = bi(t.callbacks, e);
              n.push(i.labelColor.call(this, e)),
                o.push(i.labelPointStyle.call(this, e)),
                a.push(i.labelTextColor.call(this, e));
            }),
            (this.labelColors = n),
            (this.labelPointStyles = o),
            (this.labelTextColors = a),
            (this.dataPoints = l),
            l
          );
        }
        update(t, e) {
          const i = this.options.setContext(this.getContext()),
            s = this._active;
          let n,
            o = [];
          if (s.length) {
            const t = hi[i.position].call(this, s, this._eventPosition);
            (o = this._createItems(i)),
              (this.title = this.getTitle(o, i)),
              (this.beforeBody = this.getBeforeBody(o, i)),
              (this.body = this.getBody(o, i)),
              (this.afterBody = this.getAfterBody(o, i)),
              (this.footer = this.getFooter(o, i));
            const e = (this._size = ui(this, i)),
              a = Object.assign({}, t, e),
              r = pi(this.chart, i, a),
              h = fi(i, a, r, this.chart);
            (this.xAlign = r.xAlign),
              (this.yAlign = r.yAlign),
              (n = {
                opacity: 1,
                x: h.x,
                y: h.y,
                width: e.width,
                height: e.height,
                caretX: t.x,
                caretY: t.y,
              });
          } else 0 !== this.opacity && (n = { opacity: 0 });
          (this._tooltipItems = o),
            (this.$context = void 0),
            n && this._resolveAnimations().update(this, n),
            t &&
              i.external &&
              i.external.call(this, {
                chart: this.chart,
                tooltip: this,
                replay: e,
              });
        }
        drawCaret(t, e, i, s) {
          const n = this.getCaretPosition(t, i, s);
          e.lineTo(n.x1, n.y1), e.lineTo(n.x2, n.y2), e.lineTo(n.x3, n.y3);
        }
        getCaretPosition(t, e, i) {
          const { xAlign: n, yAlign: o } = this,
            { caretSize: a, cornerRadius: r } = i,
            {
              topLeft: h,
              topRight: l,
              bottomLeft: c,
              bottomRight: d,
            } = (0, s.ax)(r),
            { x: u, y: g } = t,
            { width: p, height: f } = e;
          let m, x, b, _, v, y;
          return (
            "center" === o
              ? ((v = g + f / 2),
                "left" === n
                  ? ((m = u), (x = m - a), (_ = v + a), (y = v - a))
                  : ((m = u + p), (x = m + a), (_ = v - a), (y = v + a)),
                (b = m))
              : ((x =
                  "left" === n
                    ? u + Math.max(h, c) + a
                    : "right" === n
                    ? u + p - Math.max(l, d) - a
                    : this.caretX),
                "top" === o
                  ? ((_ = g), (v = _ - a), (m = x - a), (b = x + a))
                  : ((_ = g + f), (v = _ + a), (m = x + a), (b = x - a)),
                (y = _)),
            { x1: m, x2: x, x3: b, y1: _, y2: v, y3: y }
          );
        }
        drawTitle(t, e, i) {
          const n = this.title,
            o = n.length;
          let a, r, h;
          if (o) {
            const l = (0, s.aA)(i.rtl, this.x, this.width);
            for (
              t.x = mi(this, i.titleAlign, i),
                e.textAlign = l.textAlign(i.titleAlign),
                e.textBaseline = "middle",
                a = (0, s.O)(i.titleFont),
                r = i.titleSpacing,
                e.fillStyle = i.titleColor,
                e.font = a.string,
                h = 0;
              h < o;
              ++h
            )
              e.fillText(n[h], l.x(t.x), t.y + a.lineHeight / 2),
                (t.y += a.lineHeight + r),
                h + 1 === o && (t.y += i.titleMarginBottom - r);
          }
        }
        _drawColorBox(t, e, i, n, o) {
          const a = this.labelColors[i],
            r = this.labelPointStyles[i],
            { boxHeight: h, boxWidth: l, boxPadding: c } = o,
            d = (0, s.O)(o.bodyFont),
            u = mi(this, "left", o),
            g = n.x(u),
            p = h < d.lineHeight ? (d.lineHeight - h) / 2 : 0,
            f = e.y + p;
          if (o.usePointStyle) {
            const e = {
                radius: Math.min(l, h) / 2,
                pointStyle: r.pointStyle,
                rotation: r.rotation,
                borderWidth: 1,
              },
              i = n.leftForLtr(g, l) + l / 2,
              c = f + h / 2;
            (t.strokeStyle = o.multiKeyBackground),
              (t.fillStyle = o.multiKeyBackground),
              (0, s.au)(t, e, i, c),
              (t.strokeStyle = a.borderColor),
              (t.fillStyle = a.backgroundColor),
              (0, s.au)(t, e, i, c);
          } else {
            (t.lineWidth = (0, s.i)(a.borderWidth)
              ? Math.max(...Object.values(a.borderWidth))
              : a.borderWidth || 1),
              (t.strokeStyle = a.borderColor),
              t.setLineDash(a.borderDash || []),
              (t.lineDashOffset = a.borderDashOffset || 0);
            const e = n.leftForLtr(g, l - c),
              i = n.leftForLtr(n.xPlus(g, 1), l - c - 2),
              r = (0, s.ax)(a.borderRadius);
            Object.values(r).some((t) => 0 !== t)
              ? (t.beginPath(),
                (t.fillStyle = o.multiKeyBackground),
                (0, s.av)(t, { x: e, y: f, w: l, h: h, radius: r }),
                t.fill(),
                t.stroke(),
                (t.fillStyle = a.backgroundColor),
                t.beginPath(),
                (0, s.av)(t, { x: i, y: f + 1, w: l - 2, h: h - 2, radius: r }),
                t.fill())
              : ((t.fillStyle = o.multiKeyBackground),
                t.fillRect(e, f, l, h),
                t.strokeRect(e, f, l, h),
                (t.fillStyle = a.backgroundColor),
                t.fillRect(i, f + 1, l - 2, h - 2));
          }
          t.fillStyle = this.labelTextColors[i];
        }
        drawBody(t, e, i) {
          const { body: n } = this,
            {
              bodySpacing: o,
              bodyAlign: a,
              displayColors: r,
              boxHeight: h,
              boxWidth: l,
              boxPadding: c,
            } = i,
            d = (0, s.O)(i.bodyFont);
          let u = d.lineHeight,
            g = 0;
          const p = (0, s.aA)(i.rtl, this.x, this.width),
            f = function (i) {
              e.fillText(i, p.x(t.x + g), t.y + u / 2), (t.y += u + o);
            },
            m = p.textAlign(a);
          let x, b, _, v, y, M, k;
          for (
            e.textAlign = a,
              e.textBaseline = "middle",
              e.font = d.string,
              t.x = mi(this, m, i),
              e.fillStyle = i.bodyColor,
              (0, s.Q)(this.beforeBody, f),
              g =
                r && "right" !== m
                  ? "center" === a
                    ? l / 2 + c
                    : l + 2 + c
                  : 0,
              v = 0,
              M = n.length;
            v < M;
            ++v
          ) {
            for (
              x = n[v],
                b = this.labelTextColors[v],
                e.fillStyle = b,
                (0, s.Q)(x.before, f),
                _ = x.lines,
                r &&
                  _.length &&
                  (this._drawColorBox(e, t, v, p, i),
                  (u = Math.max(d.lineHeight, h))),
                y = 0,
                k = _.length;
              y < k;
              ++y
            )
              f(_[y]), (u = d.lineHeight);
            (0, s.Q)(x.after, f);
          }
          (g = 0), (u = d.lineHeight), (0, s.Q)(this.afterBody, f), (t.y -= o);
        }
        drawFooter(t, e, i) {
          const n = this.footer,
            o = n.length;
          let a, r;
          if (o) {
            const h = (0, s.aA)(i.rtl, this.x, this.width);
            for (
              t.x = mi(this, i.footerAlign, i),
                t.y += i.footerMarginTop,
                e.textAlign = h.textAlign(i.footerAlign),
                e.textBaseline = "middle",
                a = (0, s.O)(i.footerFont),
                e.fillStyle = i.footerColor,
                e.font = a.string,
                r = 0;
              r < o;
              ++r
            )
              e.fillText(n[r], h.x(t.x), t.y + a.lineHeight / 2),
                (t.y += a.lineHeight + i.footerSpacing);
          }
        }
        drawBackground(t, e, i, n) {
          const { xAlign: o, yAlign: a } = this,
            { x: r, y: h } = t,
            { width: l, height: c } = i,
            {
              topLeft: d,
              topRight: u,
              bottomLeft: g,
              bottomRight: p,
            } = (0, s.ax)(n.cornerRadius);
          (e.fillStyle = n.backgroundColor),
            (e.strokeStyle = n.borderColor),
            (e.lineWidth = n.borderWidth),
            e.beginPath(),
            e.moveTo(r + d, h),
            "top" === a && this.drawCaret(t, e, i, n),
            e.lineTo(r + l - u, h),
            e.quadraticCurveTo(r + l, h, r + l, h + u),
            "center" === a && "right" === o && this.drawCaret(t, e, i, n),
            e.lineTo(r + l, h + c - p),
            e.quadraticCurveTo(r + l, h + c, r + l - p, h + c),
            "bottom" === a && this.drawCaret(t, e, i, n),
            e.lineTo(r + g, h + c),
            e.quadraticCurveTo(r, h + c, r, h + c - g),
            "center" === a && "left" === o && this.drawCaret(t, e, i, n),
            e.lineTo(r, h + d),
            e.quadraticCurveTo(r, h, r + d, h),
            e.closePath(),
            e.fill(),
            n.borderWidth > 0 && e.stroke();
        }
        _updateAnimationTarget(t) {
          const e = this.chart,
            i = this.$animations,
            s = i && i.x,
            n = i && i.y;
          if (s || n) {
            const i = hi[t.position].call(
              this,
              this._active,
              this._eventPosition
            );
            if (!i) return;
            const o = (this._size = ui(this, t)),
              a = Object.assign({}, i, this._size),
              r = pi(e, t, a),
              h = fi(t, a, r, e);
            (s._to === h.x && n._to === h.y) ||
              ((this.xAlign = r.xAlign),
              (this.yAlign = r.yAlign),
              (this.width = o.width),
              (this.height = o.height),
              (this.caretX = i.x),
              (this.caretY = i.y),
              this._resolveAnimations().update(this, h));
          }
        }
        _willRender() {
          return !!this.opacity;
        }
        draw(t) {
          const e = this.options.setContext(this.getContext());
          let i = this.opacity;
          if (!i) return;
          this._updateAnimationTarget(e);
          const n = { width: this.width, height: this.height },
            o = { x: this.x, y: this.y };
          i = Math.abs(i) < 0.001 ? 0 : i;
          const a = (0, s.K)(e.padding),
            r =
              this.title.length ||
              this.beforeBody.length ||
              this.body.length ||
              this.afterBody.length ||
              this.footer.length;
          e.enabled &&
            r &&
            (t.save(),
            (t.globalAlpha = i),
            this.drawBackground(o, t, n, e),
            (0, s.aB)(t, e.textDirection),
            (o.y += a.top),
            this.drawTitle(o, t, e),
            this.drawBody(o, t, e),
            this.drawFooter(o, t, e),
            (0, s.aD)(t, e.textDirection),
            t.restore());
        }
        getActiveElements() {
          return this._active || [];
        }
        setActiveElements(t, e) {
          const i = this._active,
            n = t.map(({ datasetIndex: t, index: e }) => {
              const i = this.chart.getDatasetMeta(t);
              if (!i) throw new Error("Cannot find a dataset at index " + t);
              return { datasetIndex: t, element: i.data[e], index: e };
            }),
            o = !(0, s.ai)(i, n),
            a = this._positionChanged(n, e);
          (o || a) &&
            ((this._active = n),
            (this._eventPosition = e),
            (this._ignoreReplayEvents = !0),
            this.update(!0));
        }
        handleEvent(t, e, i = !0) {
          if (e && this._ignoreReplayEvents) return !1;
          this._ignoreReplayEvents = !1;
          const n = this.options,
            o = this._active || [],
            a = this._getActiveElements(t, o, e, i),
            r = this._positionChanged(a, t),
            h = e || !(0, s.ai)(a, o) || r;
          return (
            h &&
              ((this._active = a),
              (n.enabled || n.external) &&
                ((this._eventPosition = { x: t.x, y: t.y }),
                this.update(!0, e))),
            h
          );
        }
        _getActiveElements(t, e, i, s) {
          const n = this.options;
          if ("mouseout" === t.type) return [];
          if (!s) return e;
          const o = this.chart.getElementsAtEventForMode(t, n.mode, n, i);
          return n.reverse && o.reverse(), o;
        }
        _positionChanged(t, e) {
          const { caretX: i, caretY: s, options: n } = this,
            o = hi[n.position].call(this, t, e);
          return !1 !== o && (i !== o.x || s !== o.y);
        }
      }
      _i.positioners = hi;
      var vi = {
          id: "tooltip",
          _element: _i,
          positioners: hi,
          afterInit(t, e, i) {
            i && (t.tooltip = new _i({ chart: t, options: i }));
          },
          beforeUpdate(t, e, i) {
            t.tooltip && t.tooltip.initialize(i);
          },
          reset(t, e, i) {
            t.tooltip && t.tooltip.initialize(i);
          },
          afterDraw(t) {
            const e = t.tooltip;
            if (e && e._willRender()) {
              const i = { tooltip: e };
              if (!1 === t.notifyPlugins("beforeTooltipDraw", i)) return;
              e.draw(t.ctx), t.notifyPlugins("afterTooltipDraw", i);
            }
          },
          afterEvent(t, e) {
            if (t.tooltip) {
              const i = e.replay;
              t.tooltip.handleEvent(e.event, i, e.inChartArea) &&
                (e.changed = !0);
            }
          },
          defaults: {
            enabled: !0,
            external: null,
            position: "average",
            backgroundColor: "rgba(0,0,0,0.8)",
            titleColor: "#fff",
            titleFont: { weight: "bold" },
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleAlign: "left",
            bodyColor: "#fff",
            bodySpacing: 2,
            bodyFont: {},
            bodyAlign: "left",
            footerColor: "#fff",
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFont: { weight: "bold" },
            footerAlign: "left",
            padding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            boxHeight: (t, e) => e.bodyFont.size,
            boxWidth: (t, e) => e.bodyFont.size,
            multiKeyBackground: "#fff",
            displayColors: !0,
            boxPadding: 0,
            borderColor: "rgba(0,0,0,0)",
            borderWidth: 0,
            animation: { duration: 400, easing: "easeOutQuart" },
            animations: {
              numbers: {
                type: "number",
                properties: ["x", "y", "width", "height", "caretX", "caretY"],
              },
              opacity: { easing: "linear", duration: 200 },
            },
            callbacks: {
              beforeTitle: s.aF,
              title(t) {
                if (t.length > 0) {
                  const e = t[0],
                    i = e.chart.data.labels,
                    s = i ? i.length : 0;
                  if (this && this.options && "dataset" === this.options.mode)
                    return e.dataset.label || "";
                  if (e.label) return e.label;
                  if (s > 0 && e.dataIndex < s) return i[e.dataIndex];
                }
                return "";
              },
              afterTitle: s.aF,
              beforeBody: s.aF,
              beforeLabel: s.aF,
              label(t) {
                if (this && this.options && "dataset" === this.options.mode)
                  return t.label + ": " + t.formattedValue || t.formattedValue;
                let e = t.dataset.label || "";
                e && (e += ": ");
                const i = t.formattedValue;
                return (0, s.k)(i) || (e += i), e;
              },
              labelColor(t) {
                const e = t.chart
                  .getDatasetMeta(t.datasetIndex)
                  .controller.getStyle(t.dataIndex);
                return {
                  borderColor: e.borderColor,
                  backgroundColor: e.backgroundColor,
                  borderWidth: e.borderWidth,
                  borderDash: e.borderDash,
                  borderDashOffset: e.borderDashOffset,
                  borderRadius: 0,
                };
              },
              labelTextColor() {
                return this.options.bodyColor;
              },
              labelPointStyle(t) {
                const e = t.chart
                  .getDatasetMeta(t.datasetIndex)
                  .controller.getStyle(t.dataIndex);
                return { pointStyle: e.pointStyle, rotation: e.rotation };
              },
              afterLabel: s.aF,
              afterBody: s.aF,
              beforeFooter: s.aF,
              footer: s.aF,
              afterFooter: s.aF,
            },
          },
          defaultRoutes: {
            bodyFont: "font",
            footerFont: "font",
            titleFont: "font",
          },
          descriptors: {
            _scriptable: (t) =>
              "filter" !== t && "itemSort" !== t && "external" !== t,
            _indexable: !1,
            callbacks: { _scriptable: !1, _indexable: !1 },
            animation: { _fallback: !1 },
            animations: { _fallback: "animation" },
          },
          additionalOptionScopes: ["interaction"],
        },
        yi = Object.freeze({
          __proto__: null,
          Decimation: Fe,
          Filler: ti,
          Legend: si,
          SubTitle: ri,
          Title: oi,
          Tooltip: vi,
        });
      function Mi(t, e, i, s) {
        const n = t.indexOf(e);
        if (-1 === n)
          return ((t, e, i, s) => (
            "string" === typeof e
              ? ((i = t.push(e) - 1), s.unshift({ index: i, label: e }))
              : isNaN(e) && (i = null),
            i
          ))(t, e, i, s);
        return n !== t.lastIndexOf(e) ? i : n;
      }
      class ki extends X {
        constructor(t) {
          super(t),
            (this._startValue = void 0),
            (this._valueRange = 0),
            (this._addedLabels = []);
        }
        init(t) {
          const e = this._addedLabels;
          if (e.length) {
            const t = this.getLabels();
            for (const { index: i, label: s } of e)
              t[i] === s && t.splice(i, 1);
            this._addedLabels = [];
          }
          super.init(t);
        }
        parse(t, e) {
          if ((0, s.k)(t)) return null;
          const i = this.getLabels();
          return ((t, e) =>
            null === t ? null : (0, s.E)(Math.round(t), 0, e))(
            (e =
              isFinite(e) && i[e] === t
                ? e
                : Mi(i, t, (0, s.v)(e, t), this._addedLabels)),
            i.length - 1
          );
        }
        determineDataLimits() {
          const { minDefined: t, maxDefined: e } = this.getUserBounds();
          let { min: i, max: s } = this.getMinMax(!0);
          "ticks" === this.options.bounds &&
            (t || (i = 0), e || (s = this.getLabels().length - 1)),
            (this.min = i),
            (this.max = s);
        }
        buildTicks() {
          const t = this.min,
            e = this.max,
            i = this.options.offset,
            s = [];
          let n = this.getLabels();
          (n = 0 === t && e === n.length - 1 ? n : n.slice(t, e + 1)),
            (this._valueRange = Math.max(n.length - (i ? 0 : 1), 1)),
            (this._startValue = this.min - (i ? 0.5 : 0));
          for (let o = t; o <= e; o++) s.push({ value: o });
          return s;
        }
        getLabelForValue(t) {
          const e = this.getLabels();
          return t >= 0 && t < e.length ? e[t] : t;
        }
        configure() {
          super.configure(),
            this.isHorizontal() || (this._reversePixels = !this._reversePixels);
        }
        getPixelForValue(t) {
          return (
            "number" !== typeof t && (t = this.parse(t)),
            null === t
              ? NaN
              : this.getPixelForDecimal(
                  (t - this._startValue) / this._valueRange
                )
          );
        }
        getPixelForTick(t) {
          const e = this.ticks;
          return t < 0 || t > e.length - 1
            ? null
            : this.getPixelForValue(e[t].value);
        }
        getValueForPixel(t) {
          return Math.round(
            this._startValue + this.getDecimalForPixel(t) * this._valueRange
          );
        }
        getBasePixel() {
          return this.bottom;
        }
      }
      function wi(t, e, { horizontal: i, minRotation: n }) {
        const o = (0, s.t)(n),
          a = (i ? Math.sin(o) : Math.cos(o)) || 0.001,
          r = 0.75 * e * ("" + t).length;
        return Math.min(e / a, r);
      }
      (ki.id = "category"),
        (ki.defaults = { ticks: { callback: ki.prototype.getLabelForValue } });
      class Si extends X {
        constructor(t) {
          super(t),
            (this.start = void 0),
            (this.end = void 0),
            (this._startValue = void 0),
            (this._endValue = void 0),
            (this._valueRange = 0);
        }
        parse(t, e) {
          return (0, s.k)(t) ||
            (("number" === typeof t || t instanceof Number) && !isFinite(+t))
            ? null
            : +t;
        }
        handleTickRangeOptions() {
          const { beginAtZero: t } = this.options,
            { minDefined: e, maxDefined: i } = this.getUserBounds();
          let { min: n, max: o } = this;
          const a = (t) => (n = e ? n : t),
            r = (t) => (o = i ? o : t);
          if (t) {
            const t = (0, s.s)(n),
              e = (0, s.s)(o);
            t < 0 && e < 0 ? r(0) : t > 0 && e > 0 && a(0);
          }
          if (n === o) {
            let e = 1;
            (o >= Number.MAX_SAFE_INTEGER || n <= Number.MIN_SAFE_INTEGER) &&
              (e = Math.abs(0.05 * o)),
              r(o + e),
              t || a(n - e);
          }
          (this.min = n), (this.max = o);
        }
        getTickLimit() {
          const t = this.options.ticks;
          let e,
            { maxTicksLimit: i, stepSize: s } = t;
          return (
            s
              ? ((e = Math.ceil(this.max / s) - Math.floor(this.min / s) + 1),
                e > 1e3 &&
                  (console.warn(
                    `scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${e} ticks. Limiting to 1000.`
                  ),
                  (e = 1e3)))
              : ((e = this.computeTickLimit()), (i = i || 11)),
            i && (e = Math.min(i, e)),
            e
          );
        }
        computeTickLimit() {
          return Number.POSITIVE_INFINITY;
        }
        buildTicks() {
          const t = this.options,
            e = t.ticks;
          let i = this.getTickLimit();
          i = Math.max(2, i);
          const n = (function (t, e) {
            const i = [],
              {
                bounds: n,
                step: o,
                min: a,
                max: r,
                precision: h,
                count: l,
                maxTicks: c,
                maxDigits: d,
                includeBounds: u,
              } = t,
              g = o || 1,
              p = c - 1,
              { min: f, max: m } = e,
              x = !(0, s.k)(a),
              b = !(0, s.k)(r),
              _ = !(0, s.k)(l),
              v = (m - f) / (d + 1);
            let y,
              M,
              k,
              w,
              S = (0, s.aI)((m - f) / p / g) * g;
            if (S < 1e-14 && !x && !b) return [{ value: f }, { value: m }];
            (w = Math.ceil(m / S) - Math.floor(f / S)),
              w > p && (S = (0, s.aI)((w * S) / p / g) * g),
              (0, s.k)(h) ||
                ((y = Math.pow(10, h)), (S = Math.ceil(S * y) / y)),
              "ticks" === n
                ? ((M = Math.floor(f / S) * S), (k = Math.ceil(m / S) * S))
                : ((M = f), (k = m)),
              x && b && o && (0, s.aJ)((r - a) / o, S / 1e3)
                ? ((w = Math.round(Math.min((r - a) / S, c))),
                  (S = (r - a) / w),
                  (M = a),
                  (k = r))
                : _
                ? ((M = x ? a : M),
                  (k = b ? r : k),
                  (w = l - 1),
                  (S = (k - M) / w))
                : ((w = (k - M) / S),
                  (w = (0, s.aK)(w, Math.round(w), S / 1e3)
                    ? Math.round(w)
                    : Math.ceil(w)));
            const D = Math.max((0, s.aL)(S), (0, s.aL)(M));
            (y = Math.pow(10, (0, s.k)(h) ? D : h)),
              (M = Math.round(M * y) / y),
              (k = Math.round(k * y) / y);
            let P = 0;
            for (
              x &&
              (u && M !== a
                ? (i.push({ value: a }),
                  M < a && P++,
                  (0, s.aK)(Math.round((M + P * S) * y) / y, a, wi(a, v, t)) &&
                    P++)
                : M < a && P++);
              P < w;
              ++P
            )
              i.push({ value: Math.round((M + P * S) * y) / y });
            return (
              b && u && k !== r
                ? i.length && (0, s.aK)(i[i.length - 1].value, r, wi(r, v, t))
                  ? (i[i.length - 1].value = r)
                  : i.push({ value: r })
                : (b && k !== r) || i.push({ value: k }),
              i
            );
          })(
            {
              maxTicks: i,
              bounds: t.bounds,
              min: t.min,
              max: t.max,
              precision: e.precision,
              step: e.stepSize,
              count: e.count,
              maxDigits: this._maxDigits(),
              horizontal: this.isHorizontal(),
              minRotation: e.minRotation || 0,
              includeBounds: !1 !== e.includeBounds,
            },
            this._range || this
          );
          return (
            "ticks" === t.bounds && (0, s.aH)(n, this, "value"),
            t.reverse
              ? (n.reverse(), (this.start = this.max), (this.end = this.min))
              : ((this.start = this.min), (this.end = this.max)),
            n
          );
        }
        configure() {
          const t = this.ticks;
          let e = this.min,
            i = this.max;
          if ((super.configure(), this.options.offset && t.length)) {
            const s = (i - e) / Math.max(t.length - 1, 1) / 2;
            (e -= s), (i += s);
          }
          (this._startValue = e),
            (this._endValue = i),
            (this._valueRange = i - e);
        }
        getLabelForValue(t) {
          return (0, s.o)(
            t,
            this.chart.options.locale,
            this.options.ticks.format
          );
        }
      }
      class Di extends Si {
        determineDataLimits() {
          const { min: t, max: e } = this.getMinMax(!0);
          (this.min = (0, s.g)(t) ? t : 0),
            (this.max = (0, s.g)(e) ? e : 1),
            this.handleTickRangeOptions();
        }
        computeTickLimit() {
          const t = this.isHorizontal(),
            e = t ? this.width : this.height,
            i = (0, s.t)(this.options.ticks.minRotation),
            n = (t ? Math.sin(i) : Math.cos(i)) || 0.001,
            o = this._resolveTickFontOptions(0);
          return Math.ceil(e / Math.min(40, o.lineHeight / n));
        }
        getPixelForValue(t) {
          return null === t
            ? NaN
            : this.getPixelForDecimal(
                (t - this._startValue) / this._valueRange
              );
        }
        getValueForPixel(t) {
          return (
            this._startValue + this.getDecimalForPixel(t) * this._valueRange
          );
        }
      }
      function Pi(t) {
        return 1 === t / Math.pow(10, Math.floor((0, s.z)(t)));
      }
      (Di.id = "linear"),
        (Di.defaults = { ticks: { callback: B.formatters.numeric } });
      class Ci extends X {
        constructor(t) {
          super(t),
            (this.start = void 0),
            (this.end = void 0),
            (this._startValue = void 0),
            (this._valueRange = 0);
        }
        parse(t, e) {
          const i = Si.prototype.parse.apply(this, [t, e]);
          if (0 !== i) return (0, s.g)(i) && i > 0 ? i : null;
          this._zero = !0;
        }
        determineDataLimits() {
          const { min: t, max: e } = this.getMinMax(!0);
          (this.min = (0, s.g)(t) ? Math.max(0, t) : null),
            (this.max = (0, s.g)(e) ? Math.max(0, e) : null),
            this.options.beginAtZero && (this._zero = !0),
            this.handleTickRangeOptions();
        }
        handleTickRangeOptions() {
          const { minDefined: t, maxDefined: e } = this.getUserBounds();
          let i = this.min,
            n = this.max;
          const o = (e) => (i = t ? i : e),
            a = (t) => (n = e ? n : t),
            r = (t, e) => Math.pow(10, Math.floor((0, s.z)(t)) + e);
          i === n && (i <= 0 ? (o(1), a(10)) : (o(r(i, -1)), a(r(n, 1)))),
            i <= 0 && o(r(n, -1)),
            n <= 0 && a(r(i, 1)),
            this._zero &&
              this.min !== this._suggestedMin &&
              i === r(this.min, 0) &&
              o(r(i, -1)),
            (this.min = i),
            (this.max = n);
        }
        buildTicks() {
          const t = this.options,
            e = (function (t, e) {
              const i = Math.floor((0, s.z)(e.max)),
                n = Math.ceil(e.max / Math.pow(10, i)),
                o = [];
              let a = (0, s.B)(
                  t.min,
                  Math.pow(10, Math.floor((0, s.z)(e.min)))
                ),
                r = Math.floor((0, s.z)(a)),
                h = Math.floor(a / Math.pow(10, r)),
                l = r < 0 ? Math.pow(10, Math.abs(r)) : 1;
              do {
                o.push({ value: a, major: Pi(a) }),
                  ++h,
                  10 === h && ((h = 1), ++r, (l = r >= 0 ? 1 : l)),
                  (a = Math.round(h * Math.pow(10, r) * l) / l);
              } while (r < i || (r === i && h < n));
              const c = (0, s.B)(t.max, a);
              return o.push({ value: c, major: Pi(a) }), o;
            })({ min: this._userMin, max: this._userMax }, this);
          return (
            "ticks" === t.bounds && (0, s.aH)(e, this, "value"),
            t.reverse
              ? (e.reverse(), (this.start = this.max), (this.end = this.min))
              : ((this.start = this.min), (this.end = this.max)),
            e
          );
        }
        getLabelForValue(t) {
          return void 0 === t
            ? "0"
            : (0, s.o)(t, this.chart.options.locale, this.options.ticks.format);
        }
        configure() {
          const t = this.min;
          super.configure(),
            (this._startValue = (0, s.z)(t)),
            (this._valueRange = (0, s.z)(this.max) - (0, s.z)(t));
        }
        getPixelForValue(t) {
          return (
            (void 0 !== t && 0 !== t) || (t = this.min),
            null === t || isNaN(t)
              ? NaN
              : this.getPixelForDecimal(
                  t === this.min
                    ? 0
                    : ((0, s.z)(t) - this._startValue) / this._valueRange
                )
          );
        }
        getValueForPixel(t) {
          const e = this.getDecimalForPixel(t);
          return Math.pow(10, this._startValue + e * this._valueRange);
        }
      }
      function Ai(t) {
        const e = t.ticks;
        if (e.display && t.display) {
          const t = (0, s.K)(e.backdropPadding);
          return (0, s.v)(e.font && e.font.size, s.d.font.size) + t.height;
        }
        return 0;
      }
      function Oi(t, e, i, s, n) {
        return t === s || t === n
          ? { start: e - i / 2, end: e + i / 2 }
          : t < s || t > n
          ? { start: e - i, end: e }
          : { start: e, end: e + i };
      }
      function Li(t) {
        const e = {
            l: t.left + t._padding.left,
            r: t.right - t._padding.right,
            t: t.top + t._padding.top,
            b: t.bottom - t._padding.bottom,
          },
          i = Object.assign({}, e),
          n = [],
          o = [],
          a = t._pointLabels.length,
          r = t.options.pointLabels,
          h = r.centerPointLabels ? s.P / a : 0;
        for (let u = 0; u < a; u++) {
          const a = r.setContext(t.getPointLabelContext(u));
          o[u] = a.padding;
          const g = t.getPointPosition(u, t.drawingArea + o[u], h),
            p = (0, s.O)(a.font),
            f =
              ((l = t.ctx),
              (c = p),
              (d = t._pointLabels[u]),
              (d = (0, s.b)(d) ? d : [d]),
              { w: (0, s.aM)(l, c.string, d), h: d.length * c.lineHeight });
          n[u] = f;
          const m = (0, s.az)(t.getIndexAngle(u) + h),
            x = Math.round((0, s.F)(m));
          Ei(i, e, m, Oi(x, g.x, f.w, 0, 180), Oi(x, g.y, f.h, 90, 270));
        }
        var l, c, d;
        t.setCenterPoint(e.l - i.l, i.r - e.r, e.t - i.t, i.b - e.b),
          (t._pointLabelItems = (function (t, e, i) {
            const n = [],
              o = t._pointLabels.length,
              a = t.options,
              r = Ai(a) / 2,
              h = t.drawingArea,
              l = a.pointLabels.centerPointLabels ? s.P / o : 0;
            for (let c = 0; c < o; c++) {
              const o = t.getPointPosition(c, h + r + i[c], l),
                a = Math.round((0, s.F)((0, s.az)(o.angle + s.H))),
                d = e[c],
                u = zi(o.y, d.h, a),
                g = Ti(a),
                p = Ri(o.x, d.w, g);
              n.push({
                x: o.x,
                y: u,
                textAlign: g,
                left: p,
                top: u,
                right: p + d.w,
                bottom: u + d.h,
              });
            }
            return n;
          })(t, n, o));
      }
      function Ei(t, e, i, s, n) {
        const o = Math.abs(Math.sin(i)),
          a = Math.abs(Math.cos(i));
        let r = 0,
          h = 0;
        s.start < e.l
          ? ((r = (e.l - s.start) / o), (t.l = Math.min(t.l, e.l - r)))
          : s.end > e.r &&
            ((r = (s.end - e.r) / o), (t.r = Math.max(t.r, e.r + r))),
          n.start < e.t
            ? ((h = (e.t - n.start) / a), (t.t = Math.min(t.t, e.t - h)))
            : n.end > e.b &&
              ((h = (n.end - e.b) / a), (t.b = Math.max(t.b, e.b + h)));
      }
      function Ti(t) {
        return 0 === t || 180 === t ? "center" : t < 180 ? "left" : "right";
      }
      function Ri(t, e, i) {
        return "right" === i ? (t -= e) : "center" === i && (t -= e / 2), t;
      }
      function zi(t, e, i) {
        return (
          90 === i || 270 === i
            ? (t -= e / 2)
            : (i > 270 || i < 90) && (t -= e),
          t
        );
      }
      function Ii(t, e, i, n) {
        const { ctx: o } = t;
        if (i) o.arc(t.xCenter, t.yCenter, e, 0, s.T);
        else {
          let i = t.getPointPosition(0, e);
          o.moveTo(i.x, i.y);
          for (let s = 1; s < n; s++)
            (i = t.getPointPosition(s, e)), o.lineTo(i.x, i.y);
        }
      }
      (Ci.id = "logarithmic"),
        (Ci.defaults = {
          ticks: { callback: B.formatters.logarithmic, major: { enabled: !0 } },
        });
      class Fi extends Si {
        constructor(t) {
          super(t),
            (this.xCenter = void 0),
            (this.yCenter = void 0),
            (this.drawingArea = void 0),
            (this._pointLabels = []),
            (this._pointLabelItems = []);
        }
        setDimensions() {
          const t = (this._padding = (0, s.K)(Ai(this.options) / 2)),
            e = (this.width = this.maxWidth - t.width),
            i = (this.height = this.maxHeight - t.height);
          (this.xCenter = Math.floor(this.left + e / 2 + t.left)),
            (this.yCenter = Math.floor(this.top + i / 2 + t.top)),
            (this.drawingArea = Math.floor(Math.min(e, i) / 2));
        }
        determineDataLimits() {
          const { min: t, max: e } = this.getMinMax(!1);
          (this.min = (0, s.g)(t) && !isNaN(t) ? t : 0),
            (this.max = (0, s.g)(e) && !isNaN(e) ? e : 0),
            this.handleTickRangeOptions();
        }
        computeTickLimit() {
          return Math.ceil(this.drawingArea / Ai(this.options));
        }
        generateTickLabels(t) {
          Si.prototype.generateTickLabels.call(this, t),
            (this._pointLabels = this.getLabels()
              .map((t, e) => {
                const i = (0, s.C)(
                  this.options.pointLabels.callback,
                  [t, e],
                  this
                );
                return i || 0 === i ? i : "";
              })
              .filter((t, e) => this.chart.getDataVisibility(e)));
        }
        fit() {
          const t = this.options;
          t.display && t.pointLabels.display
            ? Li(this)
            : this.setCenterPoint(0, 0, 0, 0);
        }
        setCenterPoint(t, e, i, s) {
          (this.xCenter += Math.floor((t - e) / 2)),
            (this.yCenter += Math.floor((i - s) / 2)),
            (this.drawingArea -= Math.min(
              this.drawingArea / 2,
              Math.max(t, e, i, s)
            ));
        }
        getIndexAngle(t) {
          const e = s.T / (this._pointLabels.length || 1),
            i = this.options.startAngle || 0;
          return (0, s.az)(t * e + (0, s.t)(i));
        }
        getDistanceFromCenterForValue(t) {
          if ((0, s.k)(t)) return NaN;
          const e = this.drawingArea / (this.max - this.min);
          return this.options.reverse ? (this.max - t) * e : (t - this.min) * e;
        }
        getValueForDistanceFromCenter(t) {
          if ((0, s.k)(t)) return NaN;
          const e = t / (this.drawingArea / (this.max - this.min));
          return this.options.reverse ? this.max - e : this.min + e;
        }
        getPointLabelContext(t) {
          const e = this._pointLabels || [];
          if (t >= 0 && t < e.length) {
            const i = e[t];
            return (function (t, e, i) {
              return (0, s.h)(t, { label: i, index: e, type: "pointLabel" });
            })(this.getContext(), t, i);
          }
        }
        getPointPosition(t, e, i = 0) {
          const n = this.getIndexAngle(t) - s.H + i;
          return {
            x: Math.cos(n) * e + this.xCenter,
            y: Math.sin(n) * e + this.yCenter,
            angle: n,
          };
        }
        getPointPositionForValue(t, e) {
          return this.getPointPosition(
            t,
            this.getDistanceFromCenterForValue(e)
          );
        }
        getBasePosition(t) {
          return this.getPointPositionForValue(t || 0, this.getBaseValue());
        }
        getPointLabelPosition(t) {
          const {
            left: e,
            top: i,
            right: s,
            bottom: n,
          } = this._pointLabelItems[t];
          return { left: e, top: i, right: s, bottom: n };
        }
        drawBackground() {
          const {
            backgroundColor: t,
            grid: { circular: e },
          } = this.options;
          if (t) {
            const i = this.ctx;
            i.save(),
              i.beginPath(),
              Ii(
                this,
                this.getDistanceFromCenterForValue(this._endValue),
                e,
                this._pointLabels.length
              ),
              i.closePath(),
              (i.fillStyle = t),
              i.fill(),
              i.restore();
          }
        }
        drawGrid() {
          const t = this.ctx,
            e = this.options,
            { angleLines: i, grid: n } = e,
            o = this._pointLabels.length;
          let a, r, h;
          if (
            (e.pointLabels.display &&
              (function (t, e) {
                const {
                  ctx: i,
                  options: { pointLabels: n },
                } = t;
                for (let o = e - 1; o >= 0; o--) {
                  const e = n.setContext(t.getPointLabelContext(o)),
                    a = (0, s.O)(e.font),
                    {
                      x: r,
                      y: h,
                      textAlign: l,
                      left: c,
                      top: d,
                      right: u,
                      bottom: g,
                    } = t._pointLabelItems[o],
                    { backdropColor: p } = e;
                  if (!(0, s.k)(p)) {
                    const t = (0, s.ax)(e.borderRadius),
                      n = (0, s.K)(e.backdropPadding);
                    i.fillStyle = p;
                    const o = c - n.left,
                      a = d - n.top,
                      r = u - c + n.width,
                      h = g - d + n.height;
                    Object.values(t).some((t) => 0 !== t)
                      ? (i.beginPath(),
                        (0, s.av)(i, { x: o, y: a, w: r, h: h, radius: t }),
                        i.fill())
                      : i.fillRect(o, a, r, h);
                  }
                  (0, s.M)(i, t._pointLabels[o], r, h + a.lineHeight / 2, a, {
                    color: e.color,
                    textAlign: l,
                    textBaseline: "middle",
                  });
                }
              })(this, o),
            n.display &&
              this.ticks.forEach((t, e) => {
                if (0 !== e) {
                  r = this.getDistanceFromCenterForValue(t.value);
                  !(function (t, e, i, s) {
                    const n = t.ctx,
                      o = e.circular,
                      { color: a, lineWidth: r } = e;
                    (!o && !s) ||
                      !a ||
                      !r ||
                      i < 0 ||
                      (n.save(),
                      (n.strokeStyle = a),
                      (n.lineWidth = r),
                      n.setLineDash(e.borderDash),
                      (n.lineDashOffset = e.borderDashOffset),
                      n.beginPath(),
                      Ii(t, i, o, s),
                      n.closePath(),
                      n.stroke(),
                      n.restore());
                  })(this, n.setContext(this.getContext(e - 1)), r, o);
                }
              }),
            i.display)
          ) {
            for (t.save(), a = o - 1; a >= 0; a--) {
              const s = i.setContext(this.getPointLabelContext(a)),
                { color: n, lineWidth: o } = s;
              o &&
                n &&
                ((t.lineWidth = o),
                (t.strokeStyle = n),
                t.setLineDash(s.borderDash),
                (t.lineDashOffset = s.borderDashOffset),
                (r = this.getDistanceFromCenterForValue(
                  e.ticks.reverse ? this.min : this.max
                )),
                (h = this.getPointPosition(a, r)),
                t.beginPath(),
                t.moveTo(this.xCenter, this.yCenter),
                t.lineTo(h.x, h.y),
                t.stroke());
            }
            t.restore();
          }
        }
        drawBorder() {}
        drawLabels() {
          const t = this.ctx,
            e = this.options,
            i = e.ticks;
          if (!i.display) return;
          const n = this.getIndexAngle(0);
          let o, a;
          t.save(),
            t.translate(this.xCenter, this.yCenter),
            t.rotate(n),
            (t.textAlign = "center"),
            (t.textBaseline = "middle"),
            this.ticks.forEach((n, r) => {
              if (0 === r && !e.reverse) return;
              const h = i.setContext(this.getContext(r)),
                l = (0, s.O)(h.font);
              if (
                ((o = this.getDistanceFromCenterForValue(this.ticks[r].value)),
                h.showLabelBackdrop)
              ) {
                (t.font = l.string),
                  (a = t.measureText(n.label).width),
                  (t.fillStyle = h.backdropColor);
                const e = (0, s.K)(h.backdropPadding);
                t.fillRect(
                  -a / 2 - e.left,
                  -o - l.size / 2 - e.top,
                  a + e.width,
                  l.size + e.height
                );
              }
              (0, s.M)(t, n.label, 0, -o, l, { color: h.color });
            }),
            t.restore();
        }
        drawTitle() {}
      }
      (Fi.id = "radialLinear"),
        (Fi.defaults = {
          display: !0,
          animate: !0,
          position: "chartArea",
          angleLines: {
            display: !0,
            lineWidth: 1,
            borderDash: [],
            borderDashOffset: 0,
          },
          grid: { circular: !1 },
          startAngle: 0,
          ticks: { showLabelBackdrop: !0, callback: B.formatters.numeric },
          pointLabels: {
            backdropColor: void 0,
            backdropPadding: 2,
            display: !0,
            font: { size: 10 },
            callback: (t) => t,
            padding: 5,
            centerPointLabels: !1,
          },
        }),
        (Fi.defaultRoutes = {
          "angleLines.color": "borderColor",
          "pointLabels.color": "color",
          "ticks.color": "color",
        }),
        (Fi.descriptors = { angleLines: { _fallback: "grid" } });
      const Vi = {
          millisecond: { common: !0, size: 1, steps: 1e3 },
          second: { common: !0, size: 1e3, steps: 60 },
          minute: { common: !0, size: 6e4, steps: 60 },
          hour: { common: !0, size: 36e5, steps: 24 },
          day: { common: !0, size: 864e5, steps: 30 },
          week: { common: !1, size: 6048e5, steps: 4 },
          month: { common: !0, size: 2628e6, steps: 12 },
          quarter: { common: !1, size: 7884e6, steps: 4 },
          year: { common: !0, size: 3154e7 },
        },
        Bi = Object.keys(Vi);
      function Ni(t, e) {
        return t - e;
      }
      function Hi(t, e) {
        if ((0, s.k)(e)) return null;
        const i = t._adapter,
          { parser: n, round: o, isoWeekday: a } = t._parseOpts;
        let r = e;
        return (
          "function" === typeof n && (r = n(r)),
          (0, s.g)(r) ||
            (r = "string" === typeof n ? i.parse(r, n) : i.parse(r)),
          null === r
            ? null
            : (o &&
                (r =
                  "week" !== o || (!(0, s.x)(a) && !0 !== a)
                    ? i.startOf(r, o)
                    : i.startOf(r, "isoWeek", a)),
              +r)
        );
      }
      function Wi(t, e, i, s) {
        const n = Bi.length;
        for (let o = Bi.indexOf(t); o < n - 1; ++o) {
          const t = Vi[Bi[o]],
            n = t.steps ? t.steps : Number.MAX_SAFE_INTEGER;
          if (t.common && Math.ceil((i - e) / (n * t.size)) <= s) return Bi[o];
        }
        return Bi[n - 1];
      }
      function ji(t, e, i) {
        if (i) {
          if (i.length) {
            const { lo: n, hi: o } = (0, s.aO)(i, e);
            t[i[n] >= e ? i[n] : i[o]] = !0;
          }
        } else t[e] = !0;
      }
      function $i(t, e, i) {
        const s = [],
          n = {},
          o = e.length;
        let a, r;
        for (a = 0; a < o; ++a)
          (r = e[a]), (n[r] = a), s.push({ value: r, major: !1 });
        return 0 !== o && i
          ? (function (t, e, i, s) {
              const n = t._adapter,
                o = +n.startOf(e[0].value, s),
                a = e[e.length - 1].value;
              let r, h;
              for (r = o; r <= a; r = +n.add(r, 1, s))
                (h = i[r]), h >= 0 && (e[h].major = !0);
              return e;
            })(t, s, n, i)
          : s;
      }
      class Ui extends X {
        constructor(t) {
          super(t),
            (this._cache = { data: [], labels: [], all: [] }),
            (this._unit = "day"),
            (this._majorUnit = void 0),
            (this._offsets = {}),
            (this._normalized = !1),
            (this._parseOpts = void 0);
        }
        init(t, e) {
          const i = t.time || (t.time = {}),
            n = (this._adapter = new et._date(t.adapters.date));
          n.init(e),
            (0, s.ac)(i.displayFormats, n.formats()),
            (this._parseOpts = {
              parser: i.parser,
              round: i.round,
              isoWeekday: i.isoWeekday,
            }),
            super.init(t),
            (this._normalized = e.normalized);
        }
        parse(t, e) {
          return void 0 === t ? null : Hi(this, t);
        }
        beforeLayout() {
          super.beforeLayout(),
            (this._cache = { data: [], labels: [], all: [] });
        }
        determineDataLimits() {
          const t = this.options,
            e = this._adapter,
            i = t.time.unit || "day";
          let {
            min: n,
            max: o,
            minDefined: a,
            maxDefined: r,
          } = this.getUserBounds();
          function h(t) {
            a || isNaN(t.min) || (n = Math.min(n, t.min)),
              r || isNaN(t.max) || (o = Math.max(o, t.max));
          }
          (a && r) ||
            (h(this._getLabelBounds()),
            ("ticks" === t.bounds && "labels" === t.ticks.source) ||
              h(this.getMinMax(!1))),
            (n = (0, s.g)(n) && !isNaN(n) ? n : +e.startOf(Date.now(), i)),
            (o = (0, s.g)(o) && !isNaN(o) ? o : +e.endOf(Date.now(), i) + 1),
            (this.min = Math.min(n, o - 1)),
            (this.max = Math.max(n + 1, o));
        }
        _getLabelBounds() {
          const t = this.getLabelTimestamps();
          let e = Number.POSITIVE_INFINITY,
            i = Number.NEGATIVE_INFINITY;
          return (
            t.length && ((e = t[0]), (i = t[t.length - 1])), { min: e, max: i }
          );
        }
        buildTicks() {
          const t = this.options,
            e = t.time,
            i = t.ticks,
            n =
              "labels" === i.source
                ? this.getLabelTimestamps()
                : this._generate();
          "ticks" === t.bounds &&
            n.length &&
            ((this.min = this._userMin || n[0]),
            (this.max = this._userMax || n[n.length - 1]));
          const o = this.min,
            a = this.max,
            r = (0, s.aN)(n, o, a);
          return (
            (this._unit =
              e.unit ||
              (i.autoSkip
                ? Wi(e.minUnit, this.min, this.max, this._getLabelCapacity(o))
                : (function (t, e, i, s, n) {
                    for (let o = Bi.length - 1; o >= Bi.indexOf(i); o--) {
                      const i = Bi[o];
                      if (Vi[i].common && t._adapter.diff(n, s, i) >= e - 1)
                        return i;
                    }
                    return Bi[i ? Bi.indexOf(i) : 0];
                  })(this, r.length, e.minUnit, this.min, this.max))),
            (this._majorUnit =
              i.major.enabled && "year" !== this._unit
                ? (function (t) {
                    for (let e = Bi.indexOf(t) + 1, i = Bi.length; e < i; ++e)
                      if (Vi[Bi[e]].common) return Bi[e];
                  })(this._unit)
                : void 0),
            this.initOffsets(n),
            t.reverse && r.reverse(),
            $i(this, r, this._majorUnit)
          );
        }
        afterAutoSkip() {
          this.options.offsetAfterAutoskip &&
            this.initOffsets(this.ticks.map((t) => +t.value));
        }
        initOffsets(t) {
          let e,
            i,
            n = 0,
            o = 0;
          this.options.offset &&
            t.length &&
            ((e = this.getDecimalForValue(t[0])),
            (n =
              1 === t.length ? 1 - e : (this.getDecimalForValue(t[1]) - e) / 2),
            (i = this.getDecimalForValue(t[t.length - 1])),
            (o =
              1 === t.length
                ? i
                : (i - this.getDecimalForValue(t[t.length - 2])) / 2));
          const a = t.length < 3 ? 0.5 : 0.25;
          (n = (0, s.E)(n, 0, a)),
            (o = (0, s.E)(o, 0, a)),
            (this._offsets = { start: n, end: o, factor: 1 / (n + 1 + o) });
        }
        _generate() {
          const t = this._adapter,
            e = this.min,
            i = this.max,
            n = this.options,
            o = n.time,
            a = o.unit || Wi(o.minUnit, e, i, this._getLabelCapacity(e)),
            r = (0, s.v)(o.stepSize, 1),
            h = "week" === a && o.isoWeekday,
            l = (0, s.x)(h) || !0 === h,
            c = {};
          let d,
            u,
            g = e;
          if (
            (l && (g = +t.startOf(g, "isoWeek", h)),
            (g = +t.startOf(g, l ? "day" : a)),
            t.diff(i, e, a) > 1e5 * r)
          )
            throw new Error(
              e +
                " and " +
                i +
                " are too far apart with stepSize of " +
                r +
                " " +
                a
            );
          const p = "data" === n.ticks.source && this.getDataTimestamps();
          for (d = g, u = 0; d < i; d = +t.add(d, r, a), u++) ji(c, d, p);
          return (
            (d !== i && "ticks" !== n.bounds && 1 !== u) || ji(c, d, p),
            Object.keys(c)
              .sort((t, e) => t - e)
              .map((t) => +t)
          );
        }
        getLabelForValue(t) {
          const e = this._adapter,
            i = this.options.time;
          return i.tooltipFormat
            ? e.format(t, i.tooltipFormat)
            : e.format(t, i.displayFormats.datetime);
        }
        _tickFormatFunction(t, e, i, n) {
          const o = this.options,
            a = o.time.displayFormats,
            r = this._unit,
            h = this._majorUnit,
            l = r && a[r],
            c = h && a[h],
            d = i[e],
            u = h && c && d && d.major,
            g = this._adapter.format(t, n || (u ? c : l)),
            p = o.ticks.callback;
          return p ? (0, s.C)(p, [g, e, i], this) : g;
        }
        generateTickLabels(t) {
          let e, i, s;
          for (e = 0, i = t.length; e < i; ++e)
            (s = t[e]), (s.label = this._tickFormatFunction(s.value, e, t));
        }
        getDecimalForValue(t) {
          return null === t ? NaN : (t - this.min) / (this.max - this.min);
        }
        getPixelForValue(t) {
          const e = this._offsets,
            i = this.getDecimalForValue(t);
          return this.getPixelForDecimal((e.start + i) * e.factor);
        }
        getValueForPixel(t) {
          const e = this._offsets,
            i = this.getDecimalForPixel(t) / e.factor - e.end;
          return this.min + i * (this.max - this.min);
        }
        _getLabelSize(t) {
          const e = this.options.ticks,
            i = this.ctx.measureText(t).width,
            n = (0, s.t)(this.isHorizontal() ? e.maxRotation : e.minRotation),
            o = Math.cos(n),
            a = Math.sin(n),
            r = this._resolveTickFontOptions(0).size;
          return { w: i * o + r * a, h: i * a + r * o };
        }
        _getLabelCapacity(t) {
          const e = this.options.time,
            i = e.displayFormats,
            s = i[e.unit] || i.millisecond,
            n = this._tickFormatFunction(
              t,
              0,
              $i(this, [t], this._majorUnit),
              s
            ),
            o = this._getLabelSize(n),
            a =
              Math.floor(
                this.isHorizontal() ? this.width / o.w : this.height / o.h
              ) - 1;
          return a > 0 ? a : 1;
        }
        getDataTimestamps() {
          let t,
            e,
            i = this._cache.data || [];
          if (i.length) return i;
          const s = this.getMatchingVisibleMetas();
          if (this._normalized && s.length)
            return (this._cache.data =
              s[0].controller.getAllParsedValues(this));
          for (t = 0, e = s.length; t < e; ++t)
            i = i.concat(s[t].controller.getAllParsedValues(this));
          return (this._cache.data = this.normalize(i));
        }
        getLabelTimestamps() {
          const t = this._cache.labels || [];
          let e, i;
          if (t.length) return t;
          const s = this.getLabels();
          for (e = 0, i = s.length; e < i; ++e) t.push(Hi(this, s[e]));
          return (this._cache.labels = this._normalized
            ? t
            : this.normalize(t));
        }
        normalize(t) {
          return (0, s._)(t.sort(Ni));
        }
      }
      function Yi(t, e, i) {
        let n,
          o,
          a,
          r,
          h = 0,
          l = t.length - 1;
        i
          ? (e >= t[h].pos &&
              e <= t[l].pos &&
              ({ lo: h, hi: l } = (0, s.Z)(t, "pos", e)),
            ({ pos: n, time: a } = t[h]),
            ({ pos: o, time: r } = t[l]))
          : (e >= t[h].time &&
              e <= t[l].time &&
              ({ lo: h, hi: l } = (0, s.Z)(t, "time", e)),
            ({ time: n, pos: a } = t[h]),
            ({ time: o, pos: r } = t[l]));
        const c = o - n;
        return c ? a + ((r - a) * (e - n)) / c : a;
      }
      (Ui.id = "time"),
        (Ui.defaults = {
          bounds: "data",
          adapters: {},
          time: {
            parser: !1,
            unit: !1,
            round: !1,
            isoWeekday: !1,
            minUnit: "millisecond",
            displayFormats: {},
          },
          ticks: { source: "auto", major: { enabled: !1 } },
        });
      class Ki extends Ui {
        constructor(t) {
          super(t),
            (this._table = []),
            (this._minPos = void 0),
            (this._tableRange = void 0);
        }
        initOffsets() {
          const t = this._getTimestampsForTable(),
            e = (this._table = this.buildLookupTable(t));
          (this._minPos = Yi(e, this.min)),
            (this._tableRange = Yi(e, this.max) - this._minPos),
            super.initOffsets(t);
        }
        buildLookupTable(t) {
          const { min: e, max: i } = this,
            s = [],
            n = [];
          let o, a, r, h, l;
          for (o = 0, a = t.length; o < a; ++o)
            (h = t[o]), h >= e && h <= i && s.push(h);
          if (s.length < 2)
            return [
              { time: e, pos: 0 },
              { time: i, pos: 1 },
            ];
          for (o = 0, a = s.length; o < a; ++o)
            (l = s[o + 1]),
              (r = s[o - 1]),
              (h = s[o]),
              Math.round((l + r) / 2) !== h &&
                n.push({ time: h, pos: o / (a - 1) });
          return n;
        }
        _getTimestampsForTable() {
          let t = this._cache.all || [];
          if (t.length) return t;
          const e = this.getDataTimestamps(),
            i = this.getLabelTimestamps();
          return (
            (t =
              e.length && i.length
                ? this.normalize(e.concat(i))
                : e.length
                ? e
                : i),
            (t = this._cache.all = t),
            t
          );
        }
        getDecimalForValue(t) {
          return (Yi(this._table, t) - this._minPos) / this._tableRange;
        }
        getValueForPixel(t) {
          const e = this._offsets,
            i = this.getDecimalForPixel(t) / e.factor - e.end;
          return Yi(this._table, i * this._tableRange + this._minPos, !0);
        }
      }
      (Ki.id = "timeseries"), (Ki.defaults = Ui.defaults);
      const Xi = [
        q,
        Re,
        yi,
        Object.freeze({
          __proto__: null,
          CategoryScale: ki,
          LinearScale: Di,
          LogarithmicScale: Ci,
          RadialLinearScale: Fi,
          TimeScale: Ui,
          TimeSeriesScale: Ki,
        }),
      ];
    },
  },
]);
