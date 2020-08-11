function Operator(t) {
  const s = JSON.parse(JSON.stringify(t)),
    i = (t, i, e) => {
      const n = new Error("Cannot assign an attribute to a string!"),
        r = (t, s, i) => {
          const o = s[0];
          if ("string" == typeof t) throw n;
          if ((t.hasOwnProperty(o) || (t[o] = {}), 1 !== s.length))
            r(t[o], s.slice(1), i);
          else {
            if (e && "string" == typeof t[o]) throw n;
            t[o] = e ? { ...t[o], ...i } : i;
          }
        };
      r(s, t.split("."), i);
    };
  (this.get = t => {
    const i = (t, s) => {
      if (void 0 !== t)
        return 1 === s.length ? t[s[0]] : i(t[s[0]], s.slice(1));
    };
    return i(s, t.split("."));
  }),
    (this.set = (t, s) => (i(t, s, !1), this)),
    (this.patch = (t, s) => (i(t, s, !0), this)),
    (this.delete = t => {
      const i = (t, s) => {
        void 0 !== t &&
          (1 != s.length ? i(t[s[0]], s.slice(1)) : delete t[s[0]]);
      };
      return i(s, t.split(".")), this;
    }),
    (this.done = () => s);
}
