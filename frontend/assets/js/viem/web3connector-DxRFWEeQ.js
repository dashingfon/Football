const bc = "1.2.3";
let te = class Tr extends Error {
  constructor(t, n = {}) {
    const r = n.cause instanceof Tr ? n.cause.details : n.cause?.message ? n.cause.message : n.details, s = n.cause instanceof Tr && n.cause.docsPath || n.docsPath, o = [
      t || "An error occurred.",
      "",
      ...n.metaMessages ? [...n.metaMessages, ""] : [],
      ...s ? [`Docs: https://abitype.dev${s}`] : [],
      ...r ? [`Details: ${r}`] : [],
      `Version: abitype@${bc}`
    ].join(`
`);
    super(o), Object.defineProperty(this, "details", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "docsPath", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "metaMessages", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "shortMessage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiTypeError"
    }), n.cause && (this.cause = n.cause), this.details = r, this.docsPath = s, this.metaMessages = n.metaMessages, this.shortMessage = t;
  }
};
function Fe(e, t) {
  return e.exec(t)?.groups;
}
const Zo = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/, Ko = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/, Yo = /^\(.+?\).*?$/, Js = /^tuple(?<array>(\[(\d*)\])*)$/;
function kr(e) {
  let t = e.type;
  if (Js.test(e.type) && "components" in e) {
    t = "(";
    const n = e.components.length;
    for (let s = 0; s < n; s++) {
      const o = e.components[s];
      t += kr(o), s < n - 1 && (t += ", ");
    }
    const r = Fe(Js, e.type);
    return t += `)${r?.array || ""}`, kr({
      ...e,
      type: t
    });
  }
  return "indexed" in e && e.indexed && (t = `${t} indexed`), e.name ? `${t} ${e.name}` : t;
}
function dt(e) {
  let t = "";
  const n = e.length;
  for (let r = 0; r < n; r++) {
    const s = e[r];
    t += kr(s), r !== n - 1 && (t += ", ");
  }
  return t;
}
function kn(e) {
  return e.type === "function" ? `function ${e.name}(${dt(e.inputs)})${e.stateMutability && e.stateMutability !== "nonpayable" ? ` ${e.stateMutability}` : ""}${e.outputs?.length ? ` returns (${dt(e.outputs)})` : ""}` : e.type === "event" ? `event ${e.name}(${dt(e.inputs)})` : e.type === "error" ? `error ${e.name}(${dt(e.inputs)})` : e.type === "constructor" ? `constructor(${dt(e.inputs)})${e.stateMutability === "payable" ? " payable" : ""}` : e.type === "fallback" ? `fallback() external${e.stateMutability === "payable" ? " payable" : ""}` : "receive() external payable";
}
const Jo = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function pc(e) {
  return Jo.test(e);
}
function mc(e) {
  return Fe(Jo, e);
}
const Xo = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function yc(e) {
  return Xo.test(e);
}
function gc(e) {
  return Fe(Xo, e);
}
const Qo = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
function wc(e) {
  return Qo.test(e);
}
function xc(e) {
  return Fe(Qo, e);
}
const ei = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
function Ln(e) {
  return ei.test(e);
}
function vc(e) {
  return Fe(ei, e);
}
const ti = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
function Ec(e) {
  return ti.test(e);
}
function Pc(e) {
  return Fe(ti, e);
}
const ni = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
function Ac(e) {
  return ni.test(e);
}
function $c(e) {
  return Fe(ni, e);
}
const Bc = /^receive\(\) external payable$/;
function Ic(e) {
  return Bc.test(e);
}
const Xs = /* @__PURE__ */ new Set([
  "memory",
  "indexed",
  "storage",
  "calldata"
]), Sc = /* @__PURE__ */ new Set(["indexed"]), Nr = /* @__PURE__ */ new Set([
  "calldata",
  "memory",
  "storage"
]);
class Tc extends te {
  constructor({ signature: t }) {
    super("Failed to parse ABI item.", {
      details: `parseAbiItem(${JSON.stringify(t, null, 2)})`,
      docsPath: "/api/human#parseabiitem-1"
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidAbiItemError"
    });
  }
}
class kc extends te {
  constructor({ type: t }) {
    super("Unknown type.", {
      metaMessages: [
        `Type "${t}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "UnknownTypeError"
    });
  }
}
class Nc extends te {
  constructor({ type: t }) {
    super("Unknown type.", {
      metaMessages: [`Type "${t}" is not a valid ABI type.`]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "UnknownSolidityTypeError"
    });
  }
}
class Oc extends te {
  constructor({ params: t }) {
    super("Failed to parse ABI parameters.", {
      details: `parseAbiParameters(${JSON.stringify(t, null, 2)})`,
      docsPath: "/api/human#parseabiparameters-1"
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidAbiParametersError"
    });
  }
}
class Rc extends te {
  constructor({ param: t }) {
    super("Invalid ABI parameter.", {
      details: t
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidParameterError"
    });
  }
}
class Cc extends te {
  constructor({ param: t, name: n }) {
    super("Invalid ABI parameter.", {
      details: t,
      metaMessages: [
        `"${n}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "SolidityProtectedKeywordError"
    });
  }
}
class Fc extends te {
  constructor({ param: t, type: n, modifier: r }) {
    super("Invalid ABI parameter.", {
      details: t,
      metaMessages: [
        `Modifier "${r}" not allowed${n ? ` in "${n}" type` : ""}.`
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidModifierError"
    });
  }
}
class zc extends te {
  constructor({ param: t, type: n, modifier: r }) {
    super("Invalid ABI parameter.", {
      details: t,
      metaMessages: [
        `Modifier "${r}" not allowed${n ? ` in "${n}" type` : ""}.`,
        `Data location can only be specified for array, struct, or mapping types, but "${r}" was given.`
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidFunctionModifierError"
    });
  }
}
class Mc extends te {
  constructor({ abiParameter: t }) {
    super("Invalid ABI parameter.", {
      details: JSON.stringify(t, null, 2),
      metaMessages: ["ABI parameter type is invalid."]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidAbiTypeParameterError"
    });
  }
}
class $t extends te {
  constructor({ signature: t, type: n }) {
    super(`Invalid ${n} signature.`, {
      details: t
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidSignatureError"
    });
  }
}
class Uc extends te {
  constructor({ signature: t }) {
    super("Unknown signature.", {
      details: t
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "UnknownSignatureError"
    });
  }
}
class jc extends te {
  constructor({ signature: t }) {
    super("Invalid struct signature.", {
      details: t,
      metaMessages: ["No properties exist."]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidStructSignatureError"
    });
  }
}
class Lc extends te {
  constructor({ type: t }) {
    super("Circular reference detected.", {
      metaMessages: [`Struct "${t}" is a circular reference.`]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "CircularReferenceError"
    });
  }
}
class _c extends te {
  constructor({ current: t, depth: n }) {
    super("Unbalanced parentheses.", {
      metaMessages: [
        `"${t.trim()}" has too many ${n > 0 ? "opening" : "closing"} parentheses.`
      ],
      details: `Depth "${n}"`
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "InvalidParenthesisError"
    });
  }
}
function Gc(e, t, n) {
  let r = "";
  if (n)
    for (const s of Object.entries(n)) {
      if (!s)
        continue;
      let o = "";
      for (const i of s[1])
        o += `[${i.type}${i.name ? `:${i.name}` : ""}]`;
      r += `(${s[0]}{${o}})`;
    }
  return t ? `${t}:${e}${r}` : `${e}${r}`;
}
const ar = /* @__PURE__ */ new Map([
  // Unnamed
  ["address", { type: "address" }],
  ["bool", { type: "bool" }],
  ["bytes", { type: "bytes" }],
  ["bytes32", { type: "bytes32" }],
  ["int", { type: "int256" }],
  ["int256", { type: "int256" }],
  ["string", { type: "string" }],
  ["uint", { type: "uint256" }],
  ["uint8", { type: "uint8" }],
  ["uint16", { type: "uint16" }],
  ["uint24", { type: "uint24" }],
  ["uint32", { type: "uint32" }],
  ["uint64", { type: "uint64" }],
  ["uint96", { type: "uint96" }],
  ["uint112", { type: "uint112" }],
  ["uint160", { type: "uint160" }],
  ["uint192", { type: "uint192" }],
  ["uint256", { type: "uint256" }],
  // Named
  ["address owner", { type: "address", name: "owner" }],
  ["address to", { type: "address", name: "to" }],
  ["bool approved", { type: "bool", name: "approved" }],
  ["bytes _data", { type: "bytes", name: "_data" }],
  ["bytes data", { type: "bytes", name: "data" }],
  ["bytes signature", { type: "bytes", name: "signature" }],
  ["bytes32 hash", { type: "bytes32", name: "hash" }],
  ["bytes32 r", { type: "bytes32", name: "r" }],
  ["bytes32 root", { type: "bytes32", name: "root" }],
  ["bytes32 s", { type: "bytes32", name: "s" }],
  ["string name", { type: "string", name: "name" }],
  ["string symbol", { type: "string", name: "symbol" }],
  ["string tokenURI", { type: "string", name: "tokenURI" }],
  ["uint tokenId", { type: "uint256", name: "tokenId" }],
  ["uint8 v", { type: "uint8", name: "v" }],
  ["uint256 balance", { type: "uint256", name: "balance" }],
  ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
  ["uint256 value", { type: "uint256", name: "value" }],
  // Indexed
  [
    "event:address indexed from",
    { type: "address", name: "from", indexed: !0 }
  ],
  ["event:address indexed to", { type: "address", name: "to", indexed: !0 }],
  [
    "event:uint indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: !0 }
  ],
  [
    "event:uint256 indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: !0 }
  ]
]);
function Or(e, t = {}) {
  if (wc(e))
    return Dc(e, t);
  if (yc(e))
    return Hc(e, t);
  if (pc(e))
    return qc(e, t);
  if (Ec(e))
    return Vc(e, t);
  if (Ac(e))
    return Wc(e);
  if (Ic(e))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new Uc({ signature: e });
}
function Dc(e, t = {}) {
  const n = xc(e);
  if (!n)
    throw new $t({ signature: e, type: "function" });
  const r = se(n.parameters), s = [], o = r.length;
  for (let a = 0; a < o; a++)
    s.push(Re(r[a], {
      modifiers: Nr,
      structs: t,
      type: "function"
    }));
  const i = [];
  if (n.returns) {
    const a = se(n.returns), c = a.length;
    for (let u = 0; u < c; u++)
      i.push(Re(a[u], {
        modifiers: Nr,
        structs: t,
        type: "function"
      }));
  }
  return {
    name: n.name,
    type: "function",
    stateMutability: n.stateMutability ?? "nonpayable",
    inputs: s,
    outputs: i
  };
}
function Hc(e, t = {}) {
  const n = gc(e);
  if (!n)
    throw new $t({ signature: e, type: "event" });
  const r = se(n.parameters), s = [], o = r.length;
  for (let i = 0; i < o; i++)
    s.push(Re(r[i], {
      modifiers: Sc,
      structs: t,
      type: "event"
    }));
  return { name: n.name, type: "event", inputs: s };
}
function qc(e, t = {}) {
  const n = mc(e);
  if (!n)
    throw new $t({ signature: e, type: "error" });
  const r = se(n.parameters), s = [], o = r.length;
  for (let i = 0; i < o; i++)
    s.push(Re(r[i], { structs: t, type: "error" }));
  return { name: n.name, type: "error", inputs: s };
}
function Vc(e, t = {}) {
  const n = Pc(e);
  if (!n)
    throw new $t({ signature: e, type: "constructor" });
  const r = se(n.parameters), s = [], o = r.length;
  for (let i = 0; i < o; i++)
    s.push(Re(r[i], { structs: t, type: "constructor" }));
  return {
    type: "constructor",
    stateMutability: n.stateMutability ?? "nonpayable",
    inputs: s
  };
}
function Wc(e) {
  const t = $c(e);
  if (!t)
    throw new $t({ signature: e, type: "fallback" });
  return {
    type: "fallback",
    stateMutability: t.stateMutability ?? "nonpayable"
  };
}
const Zc = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/, Kc = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/, Yc = /^u?int$/;
function Re(e, t) {
  const n = Gc(e, t?.type, t?.structs);
  if (ar.has(n))
    return ar.get(n);
  const r = Yo.test(e), s = Fe(r ? Kc : Zc, e);
  if (!s)
    throw new Rc({ param: e });
  if (s.name && Xc(s.name))
    throw new Cc({ param: e, name: s.name });
  const o = s.name ? { name: s.name } : {}, i = s.modifier === "indexed" ? { indexed: !0 } : {}, a = t?.structs ?? {};
  let c, u = {};
  if (r) {
    c = "tuple";
    const d = se(s.type), l = [], h = d.length;
    for (let p = 0; p < h; p++)
      l.push(Re(d[p], { structs: a }));
    u = { components: l };
  } else if (s.type in a)
    c = "tuple", u = { components: a[s.type] };
  else if (Yc.test(s.type))
    c = `${s.type}256`;
  else if (s.type === "address payable")
    c = "address";
  else if (c = s.type, t?.type !== "struct" && !ri(c))
    throw new Nc({ type: c });
  if (s.modifier) {
    if (!t?.modifiers?.has?.(s.modifier))
      throw new Fc({
        param: e,
        type: t?.type,
        modifier: s.modifier
      });
    if (Nr.has(s.modifier) && !Qc(c, !!s.array))
      throw new zc({
        param: e,
        type: t?.type,
        modifier: s.modifier
      });
  }
  const f = {
    type: `${c}${s.array ?? ""}`,
    ...o,
    ...i,
    ...u
  };
  return ar.set(n, f), f;
}
function se(e, t = [], n = "", r = 0) {
  const s = e.trim().length;
  for (let o = 0; o < s; o++) {
    const i = e[o], a = e.slice(o + 1);
    switch (i) {
      case ",":
        return r === 0 ? se(a, [...t, n.trim()]) : se(a, t, `${n}${i}`, r);
      case "(":
        return se(a, t, `${n}${i}`, r + 1);
      case ")":
        return se(a, t, `${n}${i}`, r - 1);
      default:
        return se(a, t, `${n}${i}`, r);
    }
  }
  if (n === "")
    return t;
  if (r !== 0)
    throw new _c({ current: n, depth: r });
  return t.push(n.trim()), t;
}
function ri(e) {
  return e === "address" || e === "bool" || e === "function" || e === "string" || Zo.test(e) || Ko.test(e);
}
const Jc = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
function Xc(e) {
  return e === "address" || e === "bool" || e === "function" || e === "string" || e === "tuple" || Zo.test(e) || Ko.test(e) || Jc.test(e);
}
function Qc(e, t) {
  return t || e === "bytes" || e === "string" || e === "tuple";
}
function fs(e) {
  const t = {}, n = e.length;
  for (let i = 0; i < n; i++) {
    const a = e[i];
    if (!Ln(a))
      continue;
    const c = vc(a);
    if (!c)
      throw new $t({ signature: a, type: "struct" });
    const u = c.properties.split(";"), f = [], d = u.length;
    for (let l = 0; l < d; l++) {
      const p = u[l].trim();
      if (!p)
        continue;
      const m = Re(p, {
        type: "struct"
      });
      f.push(m);
    }
    if (!f.length)
      throw new jc({ signature: a });
    t[c.name] = f;
  }
  const r = {}, s = Object.entries(t), o = s.length;
  for (let i = 0; i < o; i++) {
    const [a, c] = s[i];
    r[a] = si(c, t);
  }
  return r;
}
const eu = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
function si(e = [], t = {}, n = /* @__PURE__ */ new Set()) {
  const r = [], s = e.length;
  for (let o = 0; o < s; o++) {
    const i = e[o];
    if (Yo.test(i.type))
      r.push(i);
    else {
      const c = Fe(eu, i.type);
      if (!c?.type)
        throw new Mc({ abiParameter: i });
      const { array: u, type: f } = c;
      if (f in t) {
        if (n.has(f))
          throw new Lc({ type: f });
        r.push({
          ...i,
          type: `tuple${u ?? ""}`,
          components: si(t[f], t, /* @__PURE__ */ new Set([...n, f]))
        });
      } else if (ri(f))
        r.push(i);
      else
        throw new kc({ type: f });
    }
  }
  return r;
}
function oi(e) {
  const t = fs(e), n = [], r = e.length;
  for (let s = 0; s < r; s++) {
    const o = e[s];
    Ln(o) || n.push(Or(o, t));
  }
  return n;
}
function Qs(e) {
  let t;
  if (typeof e == "string")
    t = Or(e);
  else {
    const n = fs(e), r = e.length;
    for (let s = 0; s < r; s++) {
      const o = e[s];
      if (!Ln(o)) {
        t = Or(o, n);
        break;
      }
    }
  }
  if (!t)
    throw new Tc({ signature: e });
  return t;
}
function eo(e) {
  const t = [];
  if (typeof e == "string") {
    const n = se(e), r = n.length;
    for (let s = 0; s < r; s++)
      t.push(Re(n[s], { modifiers: Xs }));
  } else {
    const n = fs(e), r = e.length;
    for (let s = 0; s < r; s++) {
      const o = e[s];
      if (Ln(o))
        continue;
      const i = se(o), a = i.length;
      for (let c = 0; c < a; c++)
        t.push(Re(i[c], { modifiers: Xs, structs: n }));
    }
  }
  if (t.length === 0)
    throw new Oc({ params: e });
  return t;
}
function z(e, t, n) {
  const r = e[t.name];
  if (typeof r == "function")
    return r;
  const s = e[n];
  return typeof s == "function" ? s : (o) => t(e, o);
}
function be(e, { includeName: t = !1 } = {}) {
  if (e.type !== "function" && e.type !== "event" && e.type !== "error")
    throw new bu(e.type);
  return `${e.name}(${_n(e.inputs, { includeName: t })})`;
}
function _n(e, { includeName: t = !1 } = {}) {
  return e ? e.map((n) => tu(n, { includeName: t })).join(t ? ", " : ",") : "";
}
function tu(e, { includeName: t }) {
  return e.type.startsWith("tuple") ? `(${_n(e.components, { includeName: t })})${e.type.slice(5)}` : e.type + (t && e.name ? ` ${e.name}` : "");
}
function ve(e, { strict: t = !0 } = {}) {
  return !e || typeof e != "string" ? !1 : t ? /^0x[0-9a-fA-F]*$/.test(e) : e.startsWith("0x");
}
function D(e) {
  return ve(e, { strict: !1 }) ? Math.ceil((e.length - 2) / 2) : e.length;
}
const ii = "2.47.12";
let cr = {
  getDocsUrl: ({ docsBaseUrl: e, docsPath: t = "", docsSlug: n }) => t ? `${e ?? "https://viem.sh"}${t}${n ? `#${n}` : ""}` : void 0,
  version: `viem@${ii}`
}, $ = class Rr extends Error {
  constructor(t, n = {}) {
    const r = n.cause instanceof Rr ? n.cause.details : n.cause?.message ? n.cause.message : n.details, s = n.cause instanceof Rr && n.cause.docsPath || n.docsPath, o = cr.getDocsUrl?.({ ...n, docsPath: s }), i = [
      t || "An error occurred.",
      "",
      ...n.metaMessages ? [...n.metaMessages, ""] : [],
      ...o ? [`Docs: ${o}`] : [],
      ...r ? [`Details: ${r}`] : [],
      ...cr.version ? [`Version: ${cr.version}`] : []
    ].join(`
`);
    super(i, n.cause ? { cause: n.cause } : void 0), Object.defineProperty(this, "details", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "docsPath", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "metaMessages", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "shortMessage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "version", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "BaseError"
    }), this.details = r, this.docsPath = s, this.metaMessages = n.metaMessages, this.name = n.name ?? this.name, this.shortMessage = t, this.version = ii;
  }
  walk(t) {
    return ai(this, t);
  }
};
function ai(e, t) {
  return t?.(e) ? e : e && typeof e == "object" && "cause" in e && e.cause !== void 0 ? ai(e.cause, t) : t ? null : e;
}
class nu extends $ {
  constructor({ docsPath: t }) {
    super([
      "A constructor was not found on the ABI.",
      "Make sure you are using the correct ABI and that the constructor exists on it."
    ].join(`
`), {
      docsPath: t,
      name: "AbiConstructorNotFoundError"
    });
  }
}
class to extends $ {
  constructor({ docsPath: t }) {
    super([
      "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
      "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
    ].join(`
`), {
      docsPath: t,
      name: "AbiConstructorParamsNotFoundError"
    });
  }
}
class ci extends $ {
  constructor({ data: t, params: n, size: r }) {
    super([`Data size of ${r} bytes is too small for given parameters.`].join(`
`), {
      metaMessages: [
        `Params: (${_n(n, { includeName: !0 })})`,
        `Data:   ${t} (${r} bytes)`
      ],
      name: "AbiDecodingDataSizeTooSmallError"
    }), Object.defineProperty(this, "data", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "params", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "size", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.data = t, this.params = n, this.size = r;
  }
}
class dn extends $ {
  constructor({ cause: t } = {}) {
    super('Cannot decode zero data ("0x") with ABI parameters.', {
      name: "AbiDecodingZeroDataError",
      cause: t
    });
  }
}
class ru extends $ {
  constructor({ expectedLength: t, givenLength: n, type: r }) {
    super([
      `ABI encoding array length mismatch for type ${r}.`,
      `Expected length: ${t}`,
      `Given length: ${n}`
    ].join(`
`), { name: "AbiEncodingArrayLengthMismatchError" });
  }
}
class su extends $ {
  constructor({ expectedSize: t, value: n }) {
    super(`Size of bytes "${n}" (bytes${D(n)}) does not match expected size (bytes${t}).`, { name: "AbiEncodingBytesSizeMismatchError" });
  }
}
class ou extends $ {
  constructor({ expectedLength: t, givenLength: n }) {
    super([
      "ABI encoding params/values length mismatch.",
      `Expected length (params): ${t}`,
      `Given length (values): ${n}`
    ].join(`
`), { name: "AbiEncodingLengthMismatchError" });
  }
}
class iu extends $ {
  constructor(t, { docsPath: n }) {
    super([
      `Arguments (\`args\`) were provided to "${t}", but "${t}" on the ABI does not contain any parameters (\`inputs\`).`,
      "Cannot encode error result without knowing what the parameter types are.",
      "Make sure you are using the correct ABI and that the inputs exist on it."
    ].join(`
`), {
      docsPath: n,
      name: "AbiErrorInputsNotFoundError"
    });
  }
}
class no extends $ {
  constructor(t, { docsPath: n } = {}) {
    super([
      `Error ${t ? `"${t}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the error exists on it."
    ].join(`
`), {
      docsPath: n,
      name: "AbiErrorNotFoundError"
    });
  }
}
class ui extends $ {
  constructor(t, { docsPath: n, cause: r }) {
    super([
      `Encoded error signature "${t}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the error exists on it.",
      `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${t}.`
    ].join(`
`), {
      docsPath: n,
      name: "AbiErrorSignatureNotFoundError",
      cause: r
    }), Object.defineProperty(this, "signature", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.signature = t;
  }
}
class au extends $ {
  constructor({ docsPath: t }) {
    super("Cannot extract event signature from empty topics.", {
      docsPath: t,
      name: "AbiEventSignatureEmptyTopicsError"
    });
  }
}
class cu extends $ {
  constructor(t, { docsPath: n }) {
    super([
      `Encoded event signature "${t}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the event exists on it.",
      `You can look up the signature here: https://4byte.sourcify.dev/?q=${t}.`
    ].join(`
`), {
      docsPath: n,
      name: "AbiEventSignatureNotFoundError"
    });
  }
}
class ro extends $ {
  constructor(t, { docsPath: n } = {}) {
    super([
      `Event ${t ? `"${t}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the event exists on it."
    ].join(`
`), {
      docsPath: n,
      name: "AbiEventNotFoundError"
    });
  }
}
class wt extends $ {
  constructor(t, { docsPath: n } = {}) {
    super([
      `Function ${t ? `"${t}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join(`
`), {
      docsPath: n,
      name: "AbiFunctionNotFoundError"
    });
  }
}
class fi extends $ {
  constructor(t, { docsPath: n }) {
    super([
      `Function "${t}" does not contain any \`outputs\` on ABI.`,
      "Cannot decode function result without knowing what the parameter types are.",
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join(`
`), {
      docsPath: n,
      name: "AbiFunctionOutputsNotFoundError"
    });
  }
}
class uu extends $ {
  constructor(t, { docsPath: n }) {
    super([
      `Encoded function signature "${t}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the function exists on it.",
      `You can look up the signature here: https://4byte.sourcify.dev/?q=${t}.`
    ].join(`
`), {
      docsPath: n,
      name: "AbiFunctionSignatureNotFoundError"
    });
  }
}
class fu extends $ {
  constructor(t, n) {
    super("Found ambiguous types in overloaded ABI items.", {
      metaMessages: [
        `\`${t.type}\` in \`${be(t.abiItem)}\`, and`,
        `\`${n.type}\` in \`${be(n.abiItem)}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ],
      name: "AbiItemAmbiguityError"
    });
  }
}
let du = class extends $ {
  constructor({ expectedSize: t, givenSize: n }) {
    super(`Expected bytes${t}, got bytes${n}.`, {
      name: "BytesSizeMismatchError"
    });
  }
};
class Nn extends $ {
  constructor({ abiItem: t, data: n, params: r, size: s }) {
    super([
      `Data size of ${s} bytes is too small for non-indexed event parameters.`
    ].join(`
`), {
      metaMessages: [
        `Params: (${_n(r, { includeName: !0 })})`,
        `Data:   ${n} (${s} bytes)`
      ],
      name: "DecodeLogDataMismatch"
    }), Object.defineProperty(this, "abiItem", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "data", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "params", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "size", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.abiItem = t, this.data = n, this.params = r, this.size = s;
  }
}
class ds extends $ {
  constructor({ abiItem: t, param: n }) {
    super([
      `Expected a topic for indexed event parameter${n.name ? ` "${n.name}"` : ""} on event "${be(t, { includeName: !0 })}".`
    ].join(`
`), { name: "DecodeLogTopicsMismatch" }), Object.defineProperty(this, "abiItem", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.abiItem = t;
  }
}
class lu extends $ {
  constructor(t, { docsPath: n }) {
    super([
      `Type "${t}" is not a valid encoding type.`,
      "Please provide a valid ABI type."
    ].join(`
`), { docsPath: n, name: "InvalidAbiEncodingType" });
  }
}
class hu extends $ {
  constructor(t, { docsPath: n }) {
    super([
      `Type "${t}" is not a valid decoding type.`,
      "Please provide a valid ABI type."
    ].join(`
`), { docsPath: n, name: "InvalidAbiDecodingType" });
  }
}
let di = class extends $ {
  constructor(t) {
    super([`Value "${t}" is not a valid array.`].join(`
`), {
      name: "InvalidArrayError"
    });
  }
};
class bu extends $ {
  constructor(t) {
    super([
      `"${t}" is not a valid definition type.`,
      'Valid types: "function", "event", "error"'
    ].join(`
`), { name: "InvalidDefinitionTypeError" });
  }
}
class pu extends $ {
  constructor(t) {
    super(`Filter type "${t}" is not supported.`, {
      name: "FilterTypeNotSupportedError"
    });
  }
}
let li = class extends $ {
  constructor({ offset: t, position: n, size: r }) {
    super(`Slice ${n === "start" ? "starting" : "ending"} at offset "${t}" is out-of-bounds (size: ${r}).`, { name: "SliceOffsetOutOfBoundsError" });
  }
}, hi = class extends $ {
  constructor({ size: t, targetSize: n, type: r }) {
    super(`${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (${t}) exceeds padding size (${n}).`, { name: "SizeExceedsPaddingSizeError" });
  }
};
class so extends $ {
  constructor({ size: t, targetSize: n, type: r }) {
    super(`${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} is expected to be ${n} ${r} long, but is ${t} ${r} long.`, { name: "InvalidBytesLengthError" });
  }
}
function Bt(e, { dir: t, size: n = 32 } = {}) {
  return typeof e == "string" ? je(e, { dir: t, size: n }) : mu(e, { dir: t, size: n });
}
function je(e, { dir: t, size: n = 32 } = {}) {
  if (n === null)
    return e;
  const r = e.replace("0x", "");
  if (r.length > n * 2)
    throw new hi({
      size: Math.ceil(r.length / 2),
      targetSize: n,
      type: "hex"
    });
  return `0x${r[t === "right" ? "padEnd" : "padStart"](n * 2, "0")}`;
}
function mu(e, { dir: t, size: n = 32 } = {}) {
  if (n === null)
    return e;
  if (e.length > n)
    throw new hi({
      size: e.length,
      targetSize: n,
      type: "bytes"
    });
  const r = new Uint8Array(n);
  for (let s = 0; s < n; s++) {
    const o = t === "right";
    r[o ? s : n - s - 1] = e[o ? s : e.length - s - 1];
  }
  return r;
}
let ls = class extends $ {
  constructor({ max: t, min: n, signed: r, size: s, value: o }) {
    super(`Number "${o}" is not in safe ${s ? `${s * 8}-bit ${r ? "signed" : "unsigned"} ` : ""}integer range ${t ? `(${n} to ${t})` : `(above ${n})`}`, { name: "IntegerOutOfRangeError" });
  }
}, yu = class extends $ {
  constructor(t) {
    super(`Bytes value "${t}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
      name: "InvalidBytesBooleanError"
    });
  }
};
class gu extends $ {
  constructor(t) {
    super(`Hex value "${t}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: "InvalidHexBooleanError" });
  }
}
let wu = class extends $ {
  constructor({ givenSize: t, maxSize: n }) {
    super(`Size cannot exceed ${n} bytes. Given size: ${t} bytes.`, { name: "SizeOverflowError" });
  }
};
function Ke(e, { dir: t = "left" } = {}) {
  let n = typeof e == "string" ? e.replace("0x", "") : e, r = 0;
  for (let s = 0; s < n.length - 1 && n[t === "left" ? s : n.length - s - 1].toString() === "0"; s++)
    r++;
  return n = t === "left" ? n.slice(r) : n.slice(0, n.length - r), typeof e == "string" ? (n.length === 1 && t === "right" && (n = `${n}0`), `0x${n.length % 2 === 1 ? `0${n}` : n}`) : n;
}
function ge(e, { size: t }) {
  if (D(e) > t)
    throw new wu({
      givenSize: D(e),
      maxSize: t
    });
}
function Ee(e, t = {}) {
  const { signed: n } = t;
  t.size && ge(e, { size: t.size });
  const r = BigInt(e);
  if (!n)
    return r;
  const s = (e.length - 2) / 2, o = (1n << BigInt(s) * 8n - 1n) - 1n;
  return r <= o ? r : r - BigInt(`0x${"f".padStart(s * 2, "f")}`) - 1n;
}
function xu(e, t = {}) {
  let n = e;
  if (t.size && (ge(n, { size: t.size }), n = Ke(n)), Ke(n) === "0x00")
    return !1;
  if (Ke(n) === "0x01")
    return !0;
  throw new gu(n);
}
function Ce(e, t = {}) {
  const n = Ee(e, t), r = Number(n);
  if (!Number.isSafeInteger(r))
    throw new ls({
      max: `${Number.MAX_SAFE_INTEGER}`,
      min: `${Number.MIN_SAFE_INTEGER}`,
      signed: t.signed,
      size: t.size,
      value: `${n}n`
    });
  return r;
}
const vu = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Le(e, t = {}) {
  return typeof e == "number" || typeof e == "bigint" ? M(e, t) : typeof e == "string" ? zt(e, t) : typeof e == "boolean" ? bi(e, t) : H(e, t);
}
function bi(e, t = {}) {
  const n = `0x${Number(e)}`;
  return typeof t.size == "number" ? (ge(n, { size: t.size }), Bt(n, { size: t.size })) : n;
}
function H(e, t = {}) {
  let n = "";
  for (let s = 0; s < e.length; s++)
    n += vu[e[s]];
  const r = `0x${n}`;
  return typeof t.size == "number" ? (ge(r, { size: t.size }), Bt(r, { dir: "right", size: t.size })) : r;
}
function M(e, t = {}) {
  const { signed: n, size: r } = t, s = BigInt(e);
  let o;
  r ? n ? o = (1n << BigInt(r) * 8n - 1n) - 1n : o = 2n ** (BigInt(r) * 8n) - 1n : typeof e == "number" && (o = BigInt(Number.MAX_SAFE_INTEGER));
  const i = typeof o == "bigint" && n ? -o - 1n : 0;
  if (o && s > o || s < i) {
    const c = typeof e == "bigint" ? "n" : "";
    throw new ls({
      max: o ? `${o}${c}` : void 0,
      min: `${i}${c}`,
      signed: n,
      size: r,
      value: `${e}${c}`
    });
  }
  const a = `0x${(n && s < 0 ? (1n << BigInt(r * 8)) + BigInt(s) : s).toString(16)}`;
  return r ? Bt(a, { size: r }) : a;
}
const Eu = /* @__PURE__ */ new TextEncoder();
function zt(e, t = {}) {
  const n = Eu.encode(e);
  return H(n, t);
}
const Pu = /* @__PURE__ */ new TextEncoder();
function It(e, t = {}) {
  return typeof e == "number" || typeof e == "bigint" ? $u(e, t) : typeof e == "boolean" ? Au(e, t) : ve(e) ? Pe(e, t) : Ye(e, t);
}
function Au(e, t = {}) {
  const n = new Uint8Array(1);
  return n[0] = Number(e), typeof t.size == "number" ? (ge(n, { size: t.size }), Bt(n, { size: t.size })) : n;
}
const Be = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function oo(e) {
  if (e >= Be.zero && e <= Be.nine)
    return e - Be.zero;
  if (e >= Be.A && e <= Be.F)
    return e - (Be.A - 10);
  if (e >= Be.a && e <= Be.f)
    return e - (Be.a - 10);
}
function Pe(e, t = {}) {
  let n = e;
  t.size && (ge(n, { size: t.size }), n = Bt(n, { dir: "right", size: t.size }));
  let r = n.slice(2);
  r.length % 2 && (r = `0${r}`);
  const s = r.length / 2, o = new Uint8Array(s);
  for (let i = 0, a = 0; i < s; i++) {
    const c = oo(r.charCodeAt(a++)), u = oo(r.charCodeAt(a++));
    if (c === void 0 || u === void 0)
      throw new $(`Invalid byte sequence ("${r[a - 2]}${r[a - 1]}" in "${r}").`);
    o[i] = c * 16 + u;
  }
  return o;
}
function $u(e, t) {
  const n = M(e, t);
  return Pe(n);
}
function Ye(e, t = {}) {
  const n = Pu.encode(e);
  return typeof t.size == "number" ? (ge(n, { size: t.size }), Bt(n, { dir: "right", size: t.size })) : n;
}
const An = /* @__PURE__ */ BigInt(2 ** 32 - 1), io = /* @__PURE__ */ BigInt(32);
function Bu(e, t = !1) {
  return t ? { h: Number(e & An), l: Number(e >> io & An) } : { h: Number(e >> io & An) | 0, l: Number(e & An) | 0 };
}
function Iu(e, t = !1) {
  const n = e.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let o = 0; o < n; o++) {
    const { h: i, l: a } = Bu(e[o], t);
    [r[o], s[o]] = [i, a];
  }
  return [r, s];
}
const Su = (e, t, n) => e << n | t >>> 32 - n, Tu = (e, t, n) => t << n | e >>> 32 - n, ku = (e, t, n) => t << n - 32 | e >>> 64 - n, Nu = (e, t, n) => e << n - 32 | t >>> 64 - n, ut = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
function Ou(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Mt(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Xe(e, ...t) {
  if (!Ou(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Ru(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Mt(e.outputLen), Mt(e.blockLen);
}
function xt(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function pi(e, t) {
  Xe(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Cu(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function vt(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function ur(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function we(e, t) {
  return e << 32 - t | e >>> t;
}
const Fu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function zu(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
function Mu(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = zu(e[t]);
  return e;
}
const ao = Fu ? (e) => e : Mu;
function Uu(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Gn(e) {
  return typeof e == "string" && (e = Uu(e)), Xe(e), e;
}
function ju(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    Xe(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
class hs {
}
function mi(e) {
  const t = (r) => e().update(Gn(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Lu(e = 32) {
  if (ut && typeof ut.getRandomValues == "function")
    return ut.getRandomValues(new Uint8Array(e));
  if (ut && typeof ut.randomBytes == "function")
    return Uint8Array.from(ut.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const _u = BigInt(0), Rt = BigInt(1), Gu = BigInt(2), Du = BigInt(7), Hu = BigInt(256), qu = BigInt(113), yi = [], gi = [], wi = [];
for (let e = 0, t = Rt, n = 1, r = 0; e < 24; e++) {
  [n, r] = [r, (2 * n + 3 * r) % 5], yi.push(2 * (5 * r + n)), gi.push((e + 1) * (e + 2) / 2 % 64);
  let s = _u;
  for (let o = 0; o < 7; o++)
    t = (t << Rt ^ (t >> Du) * qu) % Hu, t & Gu && (s ^= Rt << (Rt << /* @__PURE__ */ BigInt(o)) - Rt);
  wi.push(s);
}
const xi = Iu(wi, !0), Vu = xi[0], Wu = xi[1], co = (e, t, n) => n > 32 ? ku(e, t, n) : Su(e, t, n), uo = (e, t, n) => n > 32 ? Nu(e, t, n) : Tu(e, t, n);
function Zu(e, t = 24) {
  const n = new Uint32Array(10);
  for (let r = 24 - t; r < 24; r++) {
    for (let i = 0; i < 10; i++)
      n[i] = e[i] ^ e[i + 10] ^ e[i + 20] ^ e[i + 30] ^ e[i + 40];
    for (let i = 0; i < 10; i += 2) {
      const a = (i + 8) % 10, c = (i + 2) % 10, u = n[c], f = n[c + 1], d = co(u, f, 1) ^ n[a], l = uo(u, f, 1) ^ n[a + 1];
      for (let h = 0; h < 50; h += 10)
        e[i + h] ^= d, e[i + h + 1] ^= l;
    }
    let s = e[2], o = e[3];
    for (let i = 0; i < 24; i++) {
      const a = gi[i], c = co(s, o, a), u = uo(s, o, a), f = yi[i];
      s = e[f], o = e[f + 1], e[f] = c, e[f + 1] = u;
    }
    for (let i = 0; i < 50; i += 10) {
      for (let a = 0; a < 10; a++)
        n[a] = e[i + a];
      for (let a = 0; a < 10; a++)
        e[i + a] ^= ~n[(a + 2) % 10] & n[(a + 4) % 10];
    }
    e[0] ^= Vu[r], e[1] ^= Wu[r];
  }
  vt(n);
}
class bs extends hs {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(t, n, r, s = !1, o = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = t, this.suffix = n, this.outputLen = r, this.enableXOF = s, this.rounds = o, Mt(r), !(0 < t && t < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = Cu(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    ao(this.state32), Zu(this.state32, this.rounds), ao(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(t) {
    xt(this), t = Gn(t), Xe(t);
    const { blockLen: n, state: r } = this, s = t.length;
    for (let o = 0; o < s; ) {
      const i = Math.min(n - this.pos, s - o);
      for (let a = 0; a < i; a++)
        r[this.pos++] ^= t[o++];
      this.pos === n && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: t, suffix: n, pos: r, blockLen: s } = this;
    t[r] ^= n, (n & 128) !== 0 && r === s - 1 && this.keccak(), t[s - 1] ^= 128, this.keccak();
  }
  writeInto(t) {
    xt(this, !1), Xe(t), this.finish();
    const n = this.state, { blockLen: r } = this;
    for (let s = 0, o = t.length; s < o; ) {
      this.posOut >= r && this.keccak();
      const i = Math.min(r - this.posOut, o - s);
      t.set(n.subarray(this.posOut, this.posOut + i), s), this.posOut += i, s += i;
    }
    return t;
  }
  xofInto(t) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(t);
  }
  xof(t) {
    return Mt(t), this.xofInto(new Uint8Array(t));
  }
  digestInto(t) {
    if (pi(t, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(t), this.destroy(), t;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, vt(this.state);
  }
  _cloneInto(t) {
    const { blockLen: n, suffix: r, outputLen: s, rounds: o, enableXOF: i } = this;
    return t || (t = new bs(n, r, s, i, o)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this.posOut, t.finished = this.finished, t.rounds = o, t.suffix = r, t.outputLen = s, t.enableXOF = i, t.destroyed = this.destroyed, t;
  }
}
const Ku = (e, t, n) => mi(() => new bs(t, e, n)), vi = Ku(1, 136, 256 / 8);
function V(e, t) {
  const n = t || "hex", r = vi(ve(e, { strict: !1 }) ? It(e) : e);
  return n === "bytes" ? r : Le(r);
}
const Yu = (e) => V(It(e));
function Ju(e) {
  return Yu(e);
}
function Xu(e) {
  let t = !0, n = "", r = 0, s = "", o = !1;
  for (let i = 0; i < e.length; i++) {
    const a = e[i];
    if (["(", ")", ","].includes(a) && (t = !0), a === "(" && r++, a === ")" && r--, !!t) {
      if (r === 0) {
        if (a === " " && ["event", "function", ""].includes(s))
          s = "";
        else if (s += a, a === ")") {
          o = !0;
          break;
        }
        continue;
      }
      if (a === " ") {
        e[i - 1] !== "," && n !== "," && n !== ",(" && (n = "", t = !1);
        continue;
      }
      s += a, n += a;
    }
  }
  if (!o)
    throw new $("Unable to normalize signature.");
  return s;
}
const Qu = (e) => {
  const t = typeof e == "string" ? e : kn(e);
  return Xu(t);
};
function Ei(e) {
  return Ju(Qu(e));
}
const Dn = Ei;
let _e = class extends $ {
  constructor({ address: t }) {
    super(`Address "${t}" is invalid.`, {
      metaMessages: [
        "- Address must be a hex value of 20 bytes (40 hex characters).",
        "- Address must match its checksum counterpart."
      ],
      name: "InvalidAddressError"
    });
  }
}, Hn = class extends Map {
  constructor(t) {
    super(), Object.defineProperty(this, "maxSize", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.maxSize = t;
  }
  get(t) {
    const n = super.get(t);
    return super.has(t) && (super.delete(t), super.set(t, n)), n;
  }
  set(t, n) {
    if (super.has(t) && super.delete(t), super.set(t, n), this.maxSize && this.size > this.maxSize) {
      const r = super.keys().next().value;
      r !== void 0 && super.delete(r);
    }
    return this;
  }
};
const fr = /* @__PURE__ */ new Hn(8192);
function qn(e, t) {
  if (fr.has(`${e}.${t}`))
    return fr.get(`${e}.${t}`);
  const n = e.substring(2).toLowerCase(), r = V(Ye(n), "bytes"), s = n.split("");
  for (let i = 0; i < 40; i += 2)
    r[i >> 1] >> 4 >= 8 && s[i] && (s[i] = s[i].toUpperCase()), (r[i >> 1] & 15) >= 8 && s[i + 1] && (s[i + 1] = s[i + 1].toUpperCase());
  const o = `0x${s.join("")}`;
  return fr.set(`${e}.${t}`, o), o;
}
function On(e, t) {
  if (!ue(e, { strict: !1 }))
    throw new _e({ address: e });
  return qn(e, t);
}
const e0 = /^0x[a-fA-F0-9]{40}$/, dr = /* @__PURE__ */ new Hn(8192);
function ue(e, t) {
  const { strict: n = !0 } = t ?? {}, r = `${e}.${n}`;
  if (dr.has(r))
    return dr.get(r);
  const s = e0.test(e) ? e.toLowerCase() === e ? !0 : n ? qn(e) === e : !0 : !1;
  return dr.set(r, s), s;
}
function Ae(e) {
  return typeof e[0] == "string" ? St(e) : t0(e);
}
function t0(e) {
  let t = 0;
  for (const s of e)
    t += s.length;
  const n = new Uint8Array(t);
  let r = 0;
  for (const s of e)
    n.set(s, r), r += s.length;
  return n;
}
function St(e) {
  return `0x${e.reduce((t, n) => t + n.replace("0x", ""), "")}`;
}
function Qe(e, t, n, { strict: r } = {}) {
  return ve(e, { strict: !1 }) ? n0(e, t, n, {
    strict: r
  }) : $i(e, t, n, {
    strict: r
  });
}
function Pi(e, t) {
  if (typeof t == "number" && t > 0 && t > D(e) - 1)
    throw new li({
      offset: t,
      position: "start",
      size: D(e)
    });
}
function Ai(e, t, n) {
  if (typeof t == "number" && typeof n == "number" && D(e) !== n - t)
    throw new li({
      offset: n,
      position: "end",
      size: D(e)
    });
}
function $i(e, t, n, { strict: r } = {}) {
  Pi(e, t);
  const s = e.slice(t, n);
  return r && Ai(s, t, n), s;
}
function n0(e, t, n, { strict: r } = {}) {
  Pi(e, t);
  const s = `0x${e.replace("0x", "").slice((t ?? 0) * 2, (n ?? e.length) * 2)}`;
  return r && Ai(s, t, n), s;
}
const r0 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/, Bi = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
function st(e, t) {
  if (e.length !== t.length)
    throw new ou({
      expectedLength: e.length,
      givenLength: t.length
    });
  const n = s0({
    params: e,
    values: t
  }), r = ms(n);
  return r.length === 0 ? "0x" : r;
}
function s0({ params: e, values: t }) {
  const n = [];
  for (let r = 0; r < e.length; r++)
    n.push(ps({ param: e[r], value: t[r] }));
  return n;
}
function ps({ param: e, value: t }) {
  const n = ys(e.type);
  if (n) {
    const [r, s] = n;
    return i0(t, { length: r, param: { ...e, type: s } });
  }
  if (e.type === "tuple")
    return d0(t, {
      param: e
    });
  if (e.type === "address")
    return o0(t);
  if (e.type === "bool")
    return c0(t);
  if (e.type.startsWith("uint") || e.type.startsWith("int")) {
    const r = e.type.startsWith("int"), [, , s = "256"] = Bi.exec(e.type) ?? [];
    return u0(t, {
      signed: r,
      size: Number(s)
    });
  }
  if (e.type.startsWith("bytes"))
    return a0(t, { param: e });
  if (e.type === "string")
    return f0(t);
  throw new lu(e.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function ms(e) {
  let t = 0;
  for (let o = 0; o < e.length; o++) {
    const { dynamic: i, encoded: a } = e[o];
    i ? t += 32 : t += D(a);
  }
  const n = [], r = [];
  let s = 0;
  for (let o = 0; o < e.length; o++) {
    const { dynamic: i, encoded: a } = e[o];
    i ? (n.push(M(t + s, { size: 32 })), r.push(a), s += D(a)) : n.push(a);
  }
  return Ae([...n, ...r]);
}
function o0(e) {
  if (!ue(e))
    throw new _e({ address: e });
  return { dynamic: !1, encoded: je(e.toLowerCase()) };
}
function i0(e, { length: t, param: n }) {
  const r = t === null;
  if (!Array.isArray(e))
    throw new di(e);
  if (!r && e.length !== t)
    throw new ru({
      expectedLength: t,
      givenLength: e.length,
      type: `${n.type}[${t}]`
    });
  let s = !1;
  const o = [];
  for (let i = 0; i < e.length; i++) {
    const a = ps({ param: n, value: e[i] });
    a.dynamic && (s = !0), o.push(a);
  }
  if (r || s) {
    const i = ms(o);
    if (r) {
      const a = M(o.length, { size: 32 });
      return {
        dynamic: !0,
        encoded: o.length > 0 ? Ae([a, i]) : a
      };
    }
    if (s)
      return { dynamic: !0, encoded: i };
  }
  return {
    dynamic: !1,
    encoded: Ae(o.map(({ encoded: i }) => i))
  };
}
function a0(e, { param: t }) {
  const [, n] = t.type.split("bytes"), r = D(e);
  if (!n) {
    let s = e;
    return r % 32 !== 0 && (s = je(s, {
      dir: "right",
      size: Math.ceil((e.length - 2) / 2 / 32) * 32
    })), {
      dynamic: !0,
      encoded: Ae([je(M(r, { size: 32 })), s])
    };
  }
  if (r !== Number.parseInt(n, 10))
    throw new su({
      expectedSize: Number.parseInt(n, 10),
      value: e
    });
  return { dynamic: !1, encoded: je(e, { dir: "right" }) };
}
function c0(e) {
  if (typeof e != "boolean")
    throw new $(`Invalid boolean value: "${e}" (type: ${typeof e}). Expected: \`true\` or \`false\`.`);
  return { dynamic: !1, encoded: je(bi(e)) };
}
function u0(e, { signed: t, size: n = 256 }) {
  if (typeof n == "number") {
    const r = 2n ** (BigInt(n) - (t ? 1n : 0n)) - 1n, s = t ? -r - 1n : 0n;
    if (e > r || e < s)
      throw new ls({
        max: r.toString(),
        min: s.toString(),
        signed: t,
        size: n / 8,
        value: e.toString()
      });
  }
  return {
    dynamic: !1,
    encoded: M(e, {
      size: 32,
      signed: t
    })
  };
}
function f0(e) {
  const t = zt(e), n = Math.ceil(D(t) / 32), r = [];
  for (let s = 0; s < n; s++)
    r.push(je(Qe(t, s * 32, (s + 1) * 32), {
      dir: "right"
    }));
  return {
    dynamic: !0,
    encoded: Ae([
      je(M(D(t), { size: 32 })),
      ...r
    ])
  };
}
function d0(e, { param: t }) {
  let n = !1;
  const r = [];
  for (let s = 0; s < t.components.length; s++) {
    const o = t.components[s], i = Array.isArray(e) ? s : o.name, a = ps({
      param: o,
      value: e[i]
    });
    r.push(a), a.dynamic && (n = !0);
  }
  return {
    dynamic: n,
    encoded: n ? ms(r) : Ae(r.map(({ encoded: s }) => s))
  };
}
function ys(e) {
  const t = e.match(/^(.*)\[(\d+)?\]$/);
  return t ? (
    // Return `null` if the array is dynamic.
    [t[2] ? Number(t[2]) : null, t[1]]
  ) : void 0;
}
const ln = (e) => Qe(Ei(e), 0, 4);
function ot(e) {
  const { abi: t, args: n = [], name: r } = e, s = ve(r, { strict: !1 }), o = t.filter((a) => s ? a.type === "function" ? ln(a) === r : a.type === "event" ? Dn(a) === r : !1 : "name" in a && a.name === r);
  if (o.length === 0)
    return;
  if (o.length === 1)
    return o[0];
  let i;
  for (const a of o) {
    if (!("inputs" in a))
      continue;
    if (!n || n.length === 0) {
      if (!a.inputs || a.inputs.length === 0)
        return a;
      continue;
    }
    if (!a.inputs || a.inputs.length === 0 || a.inputs.length !== n.length)
      continue;
    if (n.every((u, f) => {
      const d = "inputs" in a && a.inputs[f];
      return d ? Cr(u, d) : !1;
    })) {
      if (i && "inputs" in i && i.inputs) {
        const u = Ii(a.inputs, i.inputs, n);
        if (u)
          throw new fu({
            abiItem: a,
            type: u[0]
          }, {
            abiItem: i,
            type: u[1]
          });
      }
      i = a;
    }
  }
  return i || o[0];
}
function Cr(e, t) {
  const n = typeof e, r = t.type;
  switch (r) {
    case "address":
      return ue(e, { strict: !1 });
    case "bool":
      return n === "boolean";
    case "function":
      return n === "string";
    case "string":
      return n === "string";
    default:
      return r === "tuple" && "components" in t ? Object.values(t.components).every((s, o) => n === "object" && Cr(Object.values(e)[o], s)) : /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(r) ? n === "number" || n === "bigint" : /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(r) ? n === "string" || e instanceof Uint8Array : /[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(r) ? Array.isArray(e) && e.every((s) => Cr(s, {
        ...t,
        // Pop off `[]` or `[M]` from end of type
        type: r.replace(/(\[[0-9]{0,}\])$/, "")
      })) : !1;
  }
}
function Ii(e, t, n) {
  for (const r in e) {
    const s = e[r], o = t[r];
    if (s.type === "tuple" && o.type === "tuple" && "components" in s && "components" in o)
      return Ii(s.components, o.components, n[r]);
    const i = [s.type, o.type];
    if (i.includes("address") && i.includes("bytes20") ? !0 : i.includes("address") && i.includes("string") ? ue(n[r], { strict: !1 }) : i.includes("address") && i.includes("bytes") ? ue(n[r], { strict: !1 }) : !1)
      return i;
  }
}
const fo = "/docs/contract/encodeEventTopics";
function hn(e) {
  const { abi: t, eventName: n, args: r } = e;
  let s = t[0];
  if (n) {
    const c = ot({ abi: t, name: n });
    if (!c)
      throw new ro(n, { docsPath: fo });
    s = c;
  }
  if (s.type !== "event")
    throw new ro(void 0, { docsPath: fo });
  const o = be(s), i = Dn(o);
  let a = [];
  if (r && "inputs" in s) {
    const c = s.inputs?.filter((f) => "indexed" in f && f.indexed), u = Array.isArray(r) ? r : Object.values(r).length > 0 ? c?.map((f) => r[f.name]) ?? [] : [];
    u.length > 0 && (a = c?.map((f, d) => Array.isArray(u[d]) ? u[d].map((l, h) => lo({ param: f, value: u[d][h] })) : typeof u[d] < "u" && u[d] !== null ? lo({ param: f, value: u[d] }) : null) ?? []);
  }
  return [i, ...a];
}
function lo({ param: e, value: t }) {
  if (e.type === "string" || e.type === "bytes")
    return V(It(t));
  if (e.type === "tuple" || e.type.match(/^(.*)\[(\d+)?\]$/))
    throw new pu(e.type);
  return st([e], [t]);
}
function Vn(e, { method: t }) {
  const n = {};
  return e.transport.type === "fallback" && e.transport.onResponse?.(({ method: r, response: s, status: o, transport: i }) => {
    o === "success" && t === r && (n[s] = i.request);
  }), ((r) => n[r] || e.request);
}
async function Si(e, t) {
  const { address: n, abi: r, args: s, eventName: o, fromBlock: i, strict: a, toBlock: c } = t, u = Vn(e, {
    method: "eth_newFilter"
  }), f = o ? hn({
    abi: r,
    args: s,
    eventName: o
  }) : void 0, d = await e.request({
    method: "eth_newFilter",
    params: [
      {
        address: n,
        fromBlock: typeof i == "bigint" ? M(i) : i,
        toBlock: typeof c == "bigint" ? M(c) : c,
        topics: f
      }
    ]
  });
  return {
    abi: r,
    args: s,
    eventName: o,
    id: d,
    request: u(d),
    strict: !!a,
    type: "event"
  };
}
function oe(e) {
  return typeof e == "string" ? { address: e, type: "json-rpc" } : e;
}
const ho = "/docs/contract/encodeFunctionData";
function l0(e) {
  const { abi: t, args: n, functionName: r } = e;
  let s = t[0];
  if (r) {
    const o = ot({
      abi: t,
      args: n,
      name: r
    });
    if (!o)
      throw new wt(r, { docsPath: ho });
    s = o;
  }
  if (s.type !== "function")
    throw new wt(void 0, { docsPath: ho });
  return {
    abi: [s],
    functionName: ln(be(s))
  };
}
function fe(e) {
  const { args: t } = e, { abi: n, functionName: r } = e.abi.length === 1 && e.functionName?.startsWith("0x") ? e : l0(e), s = n[0], o = r, i = "inputs" in s && s.inputs ? st(s.inputs, t ?? []) : void 0;
  return St([o, i ?? "0x"]);
}
const h0 = {
  1: "An `assert` condition failed.",
  17: "Arithmetic operation resulted in underflow or overflow.",
  18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
  33: "Attempted to convert to an invalid type.",
  34: "Attempted to access a storage byte array that is incorrectly encoded.",
  49: "Performed `.pop()` on an empty array",
  50: "Array index is out of bounds.",
  65: "Allocated too much memory or created an array which is too large.",
  81: "Attempted to call a zero-initialized variable of internal function type."
}, Ti = {
  inputs: [
    {
      name: "message",
      type: "string"
    }
  ],
  name: "Error",
  type: "error"
}, b0 = {
  inputs: [
    {
      name: "reason",
      type: "uint256"
    }
  ],
  name: "Panic",
  type: "error"
};
let bo = class extends $ {
  constructor({ offset: t }) {
    super(`Offset \`${t}\` cannot be negative.`, {
      name: "NegativeOffsetError"
    });
  }
}, ki = class extends $ {
  constructor({ length: t, position: n }) {
    super(`Position \`${n}\` is out of bounds (\`0 < position < ${t}\`).`, { name: "PositionOutOfBoundsError" });
  }
}, p0 = class extends $ {
  constructor({ count: t, limit: n }) {
    super(`Recursive read limit of \`${n}\` exceeded (recursive read count: \`${t}\`).`, { name: "RecursiveReadLimitExceededError" });
  }
};
const m0 = {
  bytes: new Uint8Array(),
  dataView: new DataView(new ArrayBuffer(0)),
  position: 0,
  positionReadCount: /* @__PURE__ */ new Map(),
  recursiveReadCount: 0,
  recursiveReadLimit: Number.POSITIVE_INFINITY,
  assertReadLimit() {
    if (this.recursiveReadCount >= this.recursiveReadLimit)
      throw new p0({
        count: this.recursiveReadCount + 1,
        limit: this.recursiveReadLimit
      });
  },
  assertPosition(e) {
    if (e < 0 || e > this.bytes.length - 1)
      throw new ki({
        length: this.bytes.length,
        position: e
      });
  },
  decrementPosition(e) {
    if (e < 0)
      throw new bo({ offset: e });
    const t = this.position - e;
    this.assertPosition(t), this.position = t;
  },
  getReadCount(e) {
    return this.positionReadCount.get(e || this.position) || 0;
  },
  incrementPosition(e) {
    if (e < 0)
      throw new bo({ offset: e });
    const t = this.position + e;
    this.assertPosition(t), this.position = t;
  },
  inspectByte(e) {
    const t = e ?? this.position;
    return this.assertPosition(t), this.bytes[t];
  },
  inspectBytes(e, t) {
    const n = t ?? this.position;
    return this.assertPosition(n + e - 1), this.bytes.subarray(n, n + e);
  },
  inspectUint8(e) {
    const t = e ?? this.position;
    return this.assertPosition(t), this.bytes[t];
  },
  inspectUint16(e) {
    const t = e ?? this.position;
    return this.assertPosition(t + 1), this.dataView.getUint16(t);
  },
  inspectUint24(e) {
    const t = e ?? this.position;
    return this.assertPosition(t + 2), (this.dataView.getUint16(t) << 8) + this.dataView.getUint8(t + 2);
  },
  inspectUint32(e) {
    const t = e ?? this.position;
    return this.assertPosition(t + 3), this.dataView.getUint32(t);
  },
  pushByte(e) {
    this.assertPosition(this.position), this.bytes[this.position] = e, this.position++;
  },
  pushBytes(e) {
    this.assertPosition(this.position + e.length - 1), this.bytes.set(e, this.position), this.position += e.length;
  },
  pushUint8(e) {
    this.assertPosition(this.position), this.bytes[this.position] = e, this.position++;
  },
  pushUint16(e) {
    this.assertPosition(this.position + 1), this.dataView.setUint16(this.position, e), this.position += 2;
  },
  pushUint24(e) {
    this.assertPosition(this.position + 2), this.dataView.setUint16(this.position, e >> 8), this.dataView.setUint8(this.position + 2, e & 255), this.position += 3;
  },
  pushUint32(e) {
    this.assertPosition(this.position + 3), this.dataView.setUint32(this.position, e), this.position += 4;
  },
  readByte() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectByte();
    return this.position++, e;
  },
  readBytes(e, t) {
    this.assertReadLimit(), this._touch();
    const n = this.inspectBytes(e);
    return this.position += t ?? e, n;
  },
  readUint8() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint8();
    return this.position += 1, e;
  },
  readUint16() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint16();
    return this.position += 2, e;
  },
  readUint24() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint24();
    return this.position += 3, e;
  },
  readUint32() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint32();
    return this.position += 4, e;
  },
  get remaining() {
    return this.bytes.length - this.position;
  },
  setPosition(e) {
    const t = this.position;
    return this.assertPosition(e), this.position = e, () => this.position = t;
  },
  _touch() {
    if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
      return;
    const e = this.getReadCount();
    this.positionReadCount.set(this.position, e + 1), e > 0 && this.recursiveReadCount++;
  }
};
function gs(e, { recursiveReadLimit: t = 8192 } = {}) {
  const n = Object.create(m0);
  return n.bytes = e, n.dataView = new DataView(e.buffer ?? e, e.byteOffset, e.byteLength), n.positionReadCount = /* @__PURE__ */ new Map(), n.recursiveReadLimit = t, n;
}
function y0(e, t = {}) {
  typeof t.size < "u" && ge(e, { size: t.size });
  const n = H(e, t);
  return Ee(n, t);
}
function g0(e, t = {}) {
  let n = e;
  if (typeof t.size < "u" && (ge(n, { size: t.size }), n = Ke(n)), n.length > 1 || n[0] > 1)
    throw new yu(n);
  return !!n[0];
}
function Ne(e, t = {}) {
  typeof t.size < "u" && ge(e, { size: t.size });
  const n = H(e, t);
  return Ce(n, t);
}
function w0(e, t = {}) {
  let n = e;
  return typeof t.size < "u" && (ge(n, { size: t.size }), n = Ke(n, { dir: "right" })), new TextDecoder().decode(n);
}
function bn(e, t) {
  const n = typeof t == "string" ? Pe(t) : t, r = gs(n);
  if (D(n) === 0 && e.length > 0)
    throw new dn();
  if (D(t) && D(t) < 32)
    throw new ci({
      data: typeof t == "string" ? t : H(t),
      params: e,
      size: D(t)
    });
  let s = 0;
  const o = [];
  for (let i = 0; i < e.length; ++i) {
    const a = e[i];
    r.setPosition(s);
    const [c, u] = pt(r, a, {
      staticPosition: 0
    });
    s += u, o.push(c);
  }
  return o;
}
function pt(e, t, { staticPosition: n }) {
  const r = ys(t.type);
  if (r) {
    const [s, o] = r;
    return v0(e, { ...t, type: o }, { length: s, staticPosition: n });
  }
  if (t.type === "tuple")
    return $0(e, t, { staticPosition: n });
  if (t.type === "address")
    return x0(e);
  if (t.type === "bool")
    return E0(e);
  if (t.type.startsWith("bytes"))
    return P0(e, t, { staticPosition: n });
  if (t.type.startsWith("uint") || t.type.startsWith("int"))
    return A0(e, t);
  if (t.type === "string")
    return B0(e, { staticPosition: n });
  throw new hu(t.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
const po = 32, Fr = 32;
function x0(e) {
  const t = e.readBytes(32);
  return [qn(H($i(t, -20))), 32];
}
function v0(e, t, { length: n, staticPosition: r }) {
  if (!n) {
    const i = Ne(e.readBytes(Fr)), a = r + i, c = a + po;
    e.setPosition(a);
    const u = Ne(e.readBytes(po)), f = Ut(t);
    let d = 0;
    const l = [];
    for (let h = 0; h < u; ++h) {
      e.setPosition(c + (f ? h * 32 : d));
      const [p, m] = pt(e, t, {
        staticPosition: c
      });
      d += m, l.push(p);
    }
    return e.setPosition(r + 32), [l, 32];
  }
  if (Ut(t)) {
    const i = Ne(e.readBytes(Fr)), a = r + i, c = [];
    for (let u = 0; u < n; ++u) {
      e.setPosition(a + u * 32);
      const [f] = pt(e, t, {
        staticPosition: a
      });
      c.push(f);
    }
    return e.setPosition(r + 32), [c, 32];
  }
  let s = 0;
  const o = [];
  for (let i = 0; i < n; ++i) {
    const [a, c] = pt(e, t, {
      staticPosition: r + s
    });
    s += c, o.push(a);
  }
  return [o, s];
}
function E0(e) {
  return [g0(e.readBytes(32), { size: 32 }), 32];
}
function P0(e, t, { staticPosition: n }) {
  const [r, s] = t.type.split("bytes");
  if (!s) {
    const i = Ne(e.readBytes(32));
    e.setPosition(n + i);
    const a = Ne(e.readBytes(32));
    if (a === 0)
      return e.setPosition(n + 32), ["0x", 32];
    const c = e.readBytes(a);
    return e.setPosition(n + 32), [H(c), 32];
  }
  return [H(e.readBytes(Number.parseInt(s, 10), 32)), 32];
}
function A0(e, t) {
  const n = t.type.startsWith("int"), r = Number.parseInt(t.type.split("int")[1] || "256", 10), s = e.readBytes(32);
  return [
    r > 48 ? y0(s, { signed: n }) : Ne(s, { signed: n }),
    32
  ];
}
function $0(e, t, { staticPosition: n }) {
  const r = t.components.length === 0 || t.components.some(({ name: i }) => !i), s = r ? [] : {};
  let o = 0;
  if (Ut(t)) {
    const i = Ne(e.readBytes(Fr)), a = n + i;
    for (let c = 0; c < t.components.length; ++c) {
      const u = t.components[c];
      e.setPosition(a + o);
      const [f, d] = pt(e, u, {
        staticPosition: a
      });
      o += d, s[r ? c : u?.name] = f;
    }
    return e.setPosition(n + 32), [s, 32];
  }
  for (let i = 0; i < t.components.length; ++i) {
    const a = t.components[i], [c, u] = pt(e, a, {
      staticPosition: n
    });
    s[r ? i : a?.name] = c, o += u;
  }
  return [s, o];
}
function B0(e, { staticPosition: t }) {
  const n = Ne(e.readBytes(32)), r = t + n;
  e.setPosition(r);
  const s = Ne(e.readBytes(32));
  if (s === 0)
    return e.setPosition(t + 32), ["", 32];
  const o = e.readBytes(s, 32), i = w0(Ke(o));
  return e.setPosition(t + 32), [i, 32];
}
function Ut(e) {
  const { type: t } = e;
  if (t === "string" || t === "bytes" || t.endsWith("[]"))
    return !0;
  if (t === "tuple")
    return e.components?.some(Ut);
  const n = ys(e.type);
  return !!(n && Ut({ ...e, type: n[1] }));
}
function I0(e) {
  const { abi: t, data: n, cause: r } = e, s = Qe(n, 0, 4);
  if (s === "0x")
    throw new dn({ cause: r });
  const i = [...t || [], Ti, b0].find((a) => a.type === "error" && s === ln(be(a)));
  if (!i)
    throw new ui(s, {
      docsPath: "/docs/contract/decodeErrorResult",
      cause: r
    });
  return {
    abiItem: i,
    args: "inputs" in i && i.inputs && i.inputs.length > 0 ? bn(i.inputs, Qe(n, 4)) : void 0,
    errorName: i.name
  };
}
const W = (e, t, n) => JSON.stringify(e, (r, s) => typeof s == "bigint" ? s.toString() : s, n);
function Ni({ abiItem: e, args: t, includeFunctionName: n = !0, includeName: r = !1 }) {
  if ("name" in e && "inputs" in e && e.inputs)
    return `${n ? e.name : ""}(${e.inputs.map((s, o) => `${r && s.name ? `${s.name}: ` : ""}${typeof t[o] == "object" ? W(t[o]) : t[o]}`).join(", ")})`;
}
const S0 = {
  gwei: 9,
  wei: 18
}, T0 = {
  ether: -9,
  wei: 9
};
function Oi(e, t) {
  let n = e.toString();
  const r = n.startsWith("-");
  r && (n = n.slice(1)), n = n.padStart(t, "0");
  let [s, o] = [
    n.slice(0, n.length - t),
    n.slice(n.length - t)
  ];
  return o = o.replace(/(0+)$/, ""), `${r ? "-" : ""}${s || "0"}${o ? `.${o}` : ""}`;
}
function ws(e, t = "wei") {
  return Oi(e, S0[t]);
}
function ee(e, t = "wei") {
  return Oi(e, T0[t]);
}
class k0 extends $ {
  constructor({ address: t }) {
    super(`State for account "${t}" is set multiple times.`, {
      name: "AccountStateConflictError"
    });
  }
}
class N0 extends $ {
  constructor() {
    super("state and stateDiff are set on the same account.", {
      name: "StateAssignmentConflictError"
    });
  }
}
function mo(e) {
  return e.reduce((t, { slot: n, value: r }) => `${t}        ${n}: ${r}
`, "");
}
function O0(e) {
  return e.reduce((t, { address: n, ...r }) => {
    let s = `${t}    ${n}:
`;
    return r.nonce && (s += `      nonce: ${r.nonce}
`), r.balance && (s += `      balance: ${r.balance}
`), r.code && (s += `      code: ${r.code}
`), r.state && (s += `      state:
`, s += mo(r.state)), r.stateDiff && (s += `      stateDiff:
`, s += mo(r.stateDiff)), s;
  }, `  State Override:
`).slice(0, -1);
}
function pn(e) {
  const t = Object.entries(e).map(([r, s]) => s === void 0 || s === !1 ? null : [r, s]).filter(Boolean), n = t.reduce((r, [s]) => Math.max(r, s.length), 0);
  return t.map(([r, s]) => `  ${`${r}:`.padEnd(n + 1)}  ${s}`).join(`
`);
}
class R0 extends $ {
  constructor({ transaction: t }) {
    super("Cannot infer a transaction type from provided transaction.", {
      metaMessages: [
        "Provided Transaction:",
        "{",
        pn(t),
        "}",
        "",
        "To infer the type, either provide:",
        "- a `type` to the Transaction, or",
        "- an EIP-1559 Transaction with `maxFeePerGas`, or",
        "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
        "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
        "- an EIP-7702 Transaction with `authorizationList`, or",
        "- a Legacy Transaction with `gasPrice`"
      ],
      name: "InvalidSerializableTransactionError"
    });
  }
}
class C0 extends $ {
  constructor(t, { account: n, docsPath: r, chain: s, data: o, gas: i, gasPrice: a, maxFeePerGas: c, maxPriorityFeePerGas: u, nonce: f, to: d, value: l }) {
    const h = pn({
      chain: s && `${s?.name} (id: ${s?.id})`,
      from: n?.address,
      to: d,
      value: typeof l < "u" && `${ws(l)} ${s?.nativeCurrency?.symbol || "ETH"}`,
      data: o,
      gas: i,
      gasPrice: typeof a < "u" && `${ee(a)} gwei`,
      maxFeePerGas: typeof c < "u" && `${ee(c)} gwei`,
      maxPriorityFeePerGas: typeof u < "u" && `${ee(u)} gwei`,
      nonce: f
    });
    super(t.shortMessage, {
      cause: t,
      docsPath: r,
      metaMessages: [
        ...t.metaMessages ? [...t.metaMessages, " "] : [],
        "Request Arguments:",
        h
      ].filter(Boolean),
      name: "TransactionExecutionError"
    }), Object.defineProperty(this, "cause", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.cause = t;
  }
}
class Ri extends $ {
  constructor({ blockHash: t, blockNumber: n, blockTag: r, hash: s, index: o }) {
    let i = "Transaction";
    r && o !== void 0 && (i = `Transaction at block time "${r}" at index "${o}"`), t && o !== void 0 && (i = `Transaction at block hash "${t}" at index "${o}"`), n && o !== void 0 && (i = `Transaction at block number "${n}" at index "${o}"`), s && (i = `Transaction with hash "${s}"`), super(`${i} could not be found.`, {
      name: "TransactionNotFoundError"
    });
  }
}
class Ci extends $ {
  constructor({ hash: t }) {
    super(`Transaction receipt with hash "${t}" could not be found. The Transaction may not be processed on a block yet.`, {
      name: "TransactionReceiptNotFoundError"
    });
  }
}
class F0 extends $ {
  constructor({ receipt: t }) {
    super(`Transaction with hash "${t.transactionHash}" reverted.`, {
      metaMessages: [
        'The receipt marked the transaction as "reverted". This could mean that the function on the contract you are trying to call threw an error.',
        " ",
        "You can attempt to extract the revert reason by:",
        "- calling the `simulateContract` or `simulateCalls` Action with the `abi` and `functionName` of the contract",
        "- using the `call` Action with raw `data`"
      ],
      name: "TransactionReceiptRevertedError"
    }), Object.defineProperty(this, "receipt", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.receipt = t;
  }
}
class z0 extends $ {
  constructor({ hash: t }) {
    super(`Timed out while waiting for transaction with hash "${t}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
  }
}
const M0 = (e) => e, xs = (e) => e;
class Fi extends $ {
  constructor(t, { account: n, docsPath: r, chain: s, data: o, gas: i, gasPrice: a, maxFeePerGas: c, maxPriorityFeePerGas: u, nonce: f, to: d, value: l, stateOverride: h }) {
    const p = n ? oe(n) : void 0;
    let m = pn({
      from: p?.address,
      to: d,
      value: typeof l < "u" && `${ws(l)} ${s?.nativeCurrency?.symbol || "ETH"}`,
      data: o,
      gas: i,
      gasPrice: typeof a < "u" && `${ee(a)} gwei`,
      maxFeePerGas: typeof c < "u" && `${ee(c)} gwei`,
      maxPriorityFeePerGas: typeof u < "u" && `${ee(u)} gwei`,
      nonce: f
    });
    h && (m += `
${O0(h)}`), super(t.shortMessage, {
      cause: t,
      docsPath: r,
      metaMessages: [
        ...t.metaMessages ? [...t.metaMessages, " "] : [],
        "Raw Call Arguments:",
        m
      ].filter(Boolean),
      name: "CallExecutionError"
    }), Object.defineProperty(this, "cause", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.cause = t;
  }
}
class zi extends $ {
  constructor(t, { abi: n, args: r, contractAddress: s, docsPath: o, functionName: i, sender: a }) {
    const c = ot({ abi: n, args: r, name: i }), u = c ? Ni({
      abiItem: c,
      args: r,
      includeFunctionName: !1,
      includeName: !1
    }) : void 0, f = c ? be(c, { includeName: !0 }) : void 0, d = pn({
      address: s && M0(s),
      function: f,
      args: u && u !== "()" && `${[...Array(i?.length ?? 0).keys()].map(() => " ").join("")}${u}`,
      sender: a
    });
    super(t.shortMessage || `An unknown error occurred while executing the contract function "${i}".`, {
      cause: t,
      docsPath: o,
      metaMessages: [
        ...t.metaMessages ? [...t.metaMessages, " "] : [],
        d && "Contract Call:",
        d
      ].filter(Boolean),
      name: "ContractFunctionExecutionError"
    }), Object.defineProperty(this, "abi", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "args", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cause", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "contractAddress", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "formattedArgs", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "functionName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "sender", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.abi = n, this.args = r, this.cause = t, this.contractAddress = s, this.functionName = i, this.sender = a;
  }
}
class zr extends $ {
  constructor({ abi: t, data: n, functionName: r, message: s, cause: o }) {
    let i, a, c, u;
    if (n && n !== "0x")
      try {
        a = I0({ abi: t, data: n, cause: o });
        const { abiItem: d, errorName: l, args: h } = a;
        if (l === "Error")
          u = h[0];
        else if (l === "Panic") {
          const [p] = h;
          u = h0[p];
        } else {
          const p = d ? be(d, { includeName: !0 }) : void 0, m = d && h ? Ni({
            abiItem: d,
            args: h,
            includeFunctionName: !1,
            includeName: !1
          }) : void 0;
          c = [
            p ? `Error: ${p}` : "",
            m && m !== "()" ? `       ${[...Array(l?.length ?? 0).keys()].map(() => " ").join("")}${m}` : ""
          ];
        }
      } catch (d) {
        i = d;
      }
    else s && (u = s);
    let f;
    i instanceof ui && (f = i.signature, c = [
      `Unable to decode signature "${f}" as it was not found on the provided ABI.`,
      "Make sure you are using the correct ABI and that the error exists on it.",
      `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${f}.`
    ]), super(u && u !== "execution reverted" || f ? [
      `The contract function "${r}" reverted with the following ${f ? "signature" : "reason"}:`,
      u || f
    ].join(`
`) : `The contract function "${r}" reverted.`, {
      cause: i ?? o,
      metaMessages: c,
      name: "ContractFunctionRevertedError"
    }), Object.defineProperty(this, "data", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "raw", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "reason", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "signature", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.data = a, this.raw = n, this.reason = u, this.signature = f;
  }
}
class U0 extends $ {
  constructor({ functionName: t, cause: n }) {
    super(`The contract function "${t}" returned no data ("0x").`, {
      metaMessages: [
        "This could be due to any of the following:",
        `  - The contract does not have the function "${t}",`,
        "  - The parameters passed to the contract function may be invalid, or",
        "  - The address is not a contract."
      ],
      name: "ContractFunctionZeroDataError",
      cause: n
    });
  }
}
class j0 extends $ {
  constructor({ factory: t }) {
    super(`Deployment for counterfactual contract call failed${t ? ` for factory "${t}".` : ""}`, {
      metaMessages: [
        "Please ensure:",
        "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
        "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
      ],
      name: "CounterfactualDeploymentFailedError"
    });
  }
}
class Wn extends $ {
  constructor({ data: t, message: n }) {
    super(n || "", { name: "RawContractError" }), Object.defineProperty(this, "code", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 3
    }), Object.defineProperty(this, "data", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.data = t;
  }
}
class Ft extends $ {
  constructor({ body: t, cause: n, details: r, headers: s, status: o, url: i }) {
    super("HTTP request failed.", {
      cause: n,
      details: r,
      metaMessages: [
        o && `Status: ${o}`,
        `URL: ${xs(i)}`,
        t && `Request body: ${W(t)}`
      ].filter(Boolean),
      name: "HttpRequestError"
    }), Object.defineProperty(this, "body", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "headers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "status", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "url", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.body = t, this.headers = s, this.status = o, this.url = i;
  }
}
class vs extends $ {
  constructor({ body: t, error: n, url: r }) {
    super("RPC Request failed.", {
      cause: n,
      details: n.message,
      metaMessages: [`URL: ${xs(r)}`, `Request body: ${W(t)}`],
      name: "RpcRequestError"
    }), Object.defineProperty(this, "code", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "data", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "url", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.code = n.code, this.data = n.data, this.url = r;
  }
}
class yo extends $ {
  constructor({ body: t, url: n }) {
    super("The request took too long to respond.", {
      details: "The request timed out.",
      metaMessages: [`URL: ${xs(n)}`, `Request body: ${W(t)}`],
      name: "TimeoutError"
    }), Object.defineProperty(this, "url", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.url = n;
  }
}
const L0 = -1;
class ne extends $ {
  constructor(t, { code: n, docsPath: r, metaMessages: s, name: o, shortMessage: i }) {
    super(i, {
      cause: t,
      docsPath: r,
      metaMessages: s || t?.metaMessages,
      name: o || "RpcError"
    }), Object.defineProperty(this, "code", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.name = o || t.name, this.code = t instanceof vs ? t.code : n ?? L0;
  }
}
class re extends ne {
  constructor(t, n) {
    super(t, n), Object.defineProperty(this, "data", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.data = n.data;
  }
}
class jt extends ne {
  constructor(t) {
    super(t, {
      code: jt.code,
      name: "ParseRpcError",
      shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
    });
  }
}
Object.defineProperty(jt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32700
});
class Lt extends ne {
  constructor(t) {
    super(t, {
      code: Lt.code,
      name: "InvalidRequestRpcError",
      shortMessage: "JSON is not a valid request object."
    });
  }
}
Object.defineProperty(Lt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32600
});
class _t extends ne {
  constructor(t, { method: n } = {}) {
    super(t, {
      code: _t.code,
      name: "MethodNotFoundRpcError",
      shortMessage: `The method${n ? ` "${n}"` : ""} does not exist / is not available.`
    });
  }
}
Object.defineProperty(_t, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32601
});
class Gt extends ne {
  constructor(t) {
    super(t, {
      code: Gt.code,
      name: "InvalidParamsRpcError",
      shortMessage: [
        "Invalid parameters were provided to the RPC method.",
        "Double check you have provided the correct parameters."
      ].join(`
`)
    });
  }
}
Object.defineProperty(Gt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32602
});
class et extends ne {
  constructor(t) {
    super(t, {
      code: et.code,
      name: "InternalRpcError",
      shortMessage: "An internal error was received."
    });
  }
}
Object.defineProperty(et, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32603
});
class Ge extends ne {
  constructor(t) {
    super(t, {
      code: Ge.code,
      name: "InvalidInputRpcError",
      shortMessage: [
        "Missing or invalid parameters.",
        "Double check you have provided the correct parameters."
      ].join(`
`)
    });
  }
}
Object.defineProperty(Ge, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32e3
});
class Dt extends ne {
  constructor(t) {
    super(t, {
      code: Dt.code,
      name: "ResourceNotFoundRpcError",
      shortMessage: "Requested resource not found."
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "ResourceNotFoundRpcError"
    });
  }
}
Object.defineProperty(Dt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32001
});
class Ht extends ne {
  constructor(t) {
    super(t, {
      code: Ht.code,
      name: "ResourceUnavailableRpcError",
      shortMessage: "Requested resource not available."
    });
  }
}
Object.defineProperty(Ht, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32002
});
class qt extends ne {
  constructor(t) {
    super(t, {
      code: qt.code,
      name: "TransactionRejectedRpcError",
      shortMessage: "Transaction creation failed."
    });
  }
}
Object.defineProperty(qt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32003
});
class We extends ne {
  constructor(t, { method: n } = {}) {
    super(t, {
      code: We.code,
      name: "MethodNotSupportedRpcError",
      shortMessage: `Method${n ? ` "${n}"` : ""} is not supported.`
    });
  }
}
Object.defineProperty(We, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32004
});
class Et extends ne {
  constructor(t) {
    super(t, {
      code: Et.code,
      name: "LimitExceededRpcError",
      shortMessage: "Request exceeds defined limit."
    });
  }
}
Object.defineProperty(Et, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32005
});
class Vt extends ne {
  constructor(t) {
    super(t, {
      code: Vt.code,
      name: "JsonRpcVersionUnsupportedError",
      shortMessage: "Version of JSON-RPC protocol is not supported."
    });
  }
}
Object.defineProperty(Vt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: -32006
});
class mt extends re {
  constructor(t) {
    super(t, {
      code: mt.code,
      name: "UserRejectedRequestError",
      shortMessage: "User rejected the request."
    });
  }
}
Object.defineProperty(mt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 4001
});
class Wt extends re {
  constructor(t) {
    super(t, {
      code: Wt.code,
      name: "UnauthorizedProviderError",
      shortMessage: "The requested method and/or account has not been authorized by the user."
    });
  }
}
Object.defineProperty(Wt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 4100
});
class Zt extends re {
  constructor(t, { method: n } = {}) {
    super(t, {
      code: Zt.code,
      name: "UnsupportedProviderMethodError",
      shortMessage: `The Provider does not support the requested method${n ? ` " ${n}"` : ""}.`
    });
  }
}
Object.defineProperty(Zt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 4200
});
class Kt extends re {
  constructor(t) {
    super(t, {
      code: Kt.code,
      name: "ProviderDisconnectedError",
      shortMessage: "The Provider is disconnected from all chains."
    });
  }
}
Object.defineProperty(Kt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 4900
});
class Yt extends re {
  constructor(t) {
    super(t, {
      code: Yt.code,
      name: "ChainDisconnectedError",
      shortMessage: "The Provider is not connected to the requested chain."
    });
  }
}
Object.defineProperty(Yt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 4901
});
class Jt extends re {
  constructor(t) {
    super(t, {
      code: Jt.code,
      name: "SwitchChainError",
      shortMessage: "An error occurred when attempting to switch chain."
    });
  }
}
Object.defineProperty(Jt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 4902
});
class Xt extends re {
  constructor(t) {
    super(t, {
      code: Xt.code,
      name: "UnsupportedNonOptionalCapabilityError",
      shortMessage: "This Wallet does not support a capability that was not marked as optional."
    });
  }
}
Object.defineProperty(Xt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 5700
});
class Qt extends re {
  constructor(t) {
    super(t, {
      code: Qt.code,
      name: "UnsupportedChainIdError",
      shortMessage: "This Wallet does not support the requested chain ID."
    });
  }
}
Object.defineProperty(Qt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 5710
});
class en extends re {
  constructor(t) {
    super(t, {
      code: en.code,
      name: "DuplicateIdError",
      shortMessage: "There is already a bundle submitted with this ID."
    });
  }
}
Object.defineProperty(en, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 5720
});
class tn extends re {
  constructor(t) {
    super(t, {
      code: tn.code,
      name: "UnknownBundleIdError",
      shortMessage: "This bundle id is unknown / has not been submitted"
    });
  }
}
Object.defineProperty(tn, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 5730
});
class nn extends re {
  constructor(t) {
    super(t, {
      code: nn.code,
      name: "BundleTooLargeError",
      shortMessage: "The call bundle is too large for the Wallet to process."
    });
  }
}
Object.defineProperty(nn, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 5740
});
class rn extends re {
  constructor(t) {
    super(t, {
      code: rn.code,
      name: "AtomicReadyWalletRejectedUpgradeError",
      shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
    });
  }
}
Object.defineProperty(rn, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 5750
});
class sn extends re {
  constructor(t) {
    super(t, {
      code: sn.code,
      name: "AtomicityNotSupportedError",
      shortMessage: "The wallet does not support atomic execution but the request requires it."
    });
  }
}
Object.defineProperty(sn, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 5760
});
class on extends re {
  constructor(t) {
    super(t, {
      code: on.code,
      name: "WalletConnectSessionSettlementError",
      shortMessage: "WalletConnect session settlement failed."
    });
  }
}
Object.defineProperty(on, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 7e3
});
class _0 extends ne {
  constructor(t) {
    super(t, {
      name: "UnknownRpcError",
      shortMessage: "An unknown RPC error occurred."
    });
  }
}
const G0 = 3;
function Pt(e, { abi: t, address: n, args: r, docsPath: s, functionName: o, sender: i }) {
  const a = e instanceof Wn ? e : e instanceof $ ? e.walk((p) => "data" in p) || e.walk() : {}, { code: c, data: u, details: f, message: d, shortMessage: l } = a, h = e instanceof dn ? new U0({ functionName: o, cause: e }) : [G0, et.code].includes(c) && (u || f || d || l) || c === Ge.code && f === "execution reverted" && u ? new zr({
    abi: t,
    data: typeof u == "object" ? u.data : u,
    functionName: o,
    message: a instanceof vs ? f : l ?? d,
    cause: e
  }) : e;
  return new zi(h, {
    abi: t,
    args: r,
    contractAddress: n,
    docsPath: s,
    functionName: o,
    sender: i
  });
}
function D0(e) {
  const t = V(`0x${e.substring(4)}`).substring(26);
  return qn(`0x${t}`);
}
async function H0({ hash: e, signature: t }) {
  const n = ve(e) ? e : Le(e), { secp256k1: r } = await Promise.resolve().then(() => P1);
  return `0x${(() => {
    if (typeof t == "object" && "r" in t && "s" in t) {
      const { r: u, s: f, v: d, yParity: l } = t, h = Number(l ?? d), p = go(h);
      return new r.Signature(Ee(u), Ee(f)).addRecoveryBit(p);
    }
    const i = ve(t) ? t : Le(t);
    if (D(i) !== 65)
      throw new Error("invalid signature length");
    const a = Ce(`0x${i.slice(130)}`), c = go(a);
    return r.Signature.fromCompact(i.substring(2, 130)).addRecoveryBit(c);
  })().recoverPublicKey(n.substring(2)).toHex(!1)}`;
}
function go(e) {
  if (e === 0 || e === 1)
    return e;
  if (e === 27)
    return 0;
  if (e === 28)
    return 1;
  throw new Error("Invalid yParityOrV value");
}
async function Mr({ hash: e, signature: t }) {
  return D0(await H0({ hash: e, signature: t }));
}
function q0(e, t = "hex") {
  const n = Mi(e), r = gs(new Uint8Array(n.length));
  return n.encode(r), t === "hex" ? H(r.bytes) : r.bytes;
}
function Mi(e) {
  return Array.isArray(e) ? V0(e.map((t) => Mi(t))) : W0(e);
}
function V0(e) {
  const t = e.reduce((s, o) => s + o.length, 0), n = Ui(t);
  return {
    length: t <= 55 ? 1 + t : 1 + n + t,
    encode(s) {
      t <= 55 ? s.pushByte(192 + t) : (s.pushByte(247 + n), n === 1 ? s.pushUint8(t) : n === 2 ? s.pushUint16(t) : n === 3 ? s.pushUint24(t) : s.pushUint32(t));
      for (const { encode: o } of e)
        o(s);
    }
  };
}
function W0(e) {
  const t = typeof e == "string" ? Pe(e) : e, n = Ui(t.length);
  return {
    length: t.length === 1 && t[0] < 128 ? 1 : t.length <= 55 ? 1 + t.length : 1 + n + t.length,
    encode(s) {
      t.length === 1 && t[0] < 128 ? s.pushBytes(t) : t.length <= 55 ? (s.pushByte(128 + t.length), s.pushBytes(t)) : (s.pushByte(183 + n), n === 1 ? s.pushUint8(t.length) : n === 2 ? s.pushUint16(t.length) : n === 3 ? s.pushUint24(t.length) : s.pushUint32(t.length), s.pushBytes(t));
    }
  };
}
function Ui(e) {
  if (e < 2 ** 8)
    return 1;
  if (e < 2 ** 16)
    return 2;
  if (e < 2 ** 24)
    return 3;
  if (e < 2 ** 32)
    return 4;
  throw new $("Length is too large.");
}
function Z0(e) {
  const { chainId: t, nonce: n, to: r } = e, s = e.contractAddress ?? e.address, o = V(St([
    "0x05",
    q0([
      t ? M(t) : "0x",
      s,
      n ? M(n) : "0x"
    ])
  ]));
  return r === "bytes" ? Pe(o) : o;
}
async function ji(e) {
  const { authorization: t, signature: n } = e;
  return Mr({
    hash: Z0(t),
    signature: n ?? t
  });
}
class K0 extends $ {
  constructor(t, { account: n, docsPath: r, chain: s, data: o, gas: i, gasPrice: a, maxFeePerGas: c, maxPriorityFeePerGas: u, nonce: f, to: d, value: l }) {
    const h = pn({
      from: n?.address,
      to: d,
      value: typeof l < "u" && `${ws(l)} ${s?.nativeCurrency?.symbol || "ETH"}`,
      data: o,
      gas: i,
      gasPrice: typeof a < "u" && `${ee(a)} gwei`,
      maxFeePerGas: typeof c < "u" && `${ee(c)} gwei`,
      maxPriorityFeePerGas: typeof u < "u" && `${ee(u)} gwei`,
      nonce: f
    });
    super(t.shortMessage, {
      cause: t,
      docsPath: r,
      metaMessages: [
        ...t.metaMessages ? [...t.metaMessages, " "] : [],
        "Estimate Gas Arguments:",
        h
      ].filter(Boolean),
      name: "EstimateGasExecutionError"
    }), Object.defineProperty(this, "cause", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.cause = t;
  }
}
class lt extends $ {
  constructor({ cause: t, message: n } = {}) {
    const r = n?.replace("execution reverted: ", "")?.replace("execution reverted", "");
    super(`Execution reverted ${r ? `with reason: ${r}` : "for an unknown reason"}.`, {
      cause: t,
      name: "ExecutionRevertedError"
    });
  }
}
Object.defineProperty(lt, "code", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 3
});
Object.defineProperty(lt, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /execution reverted|gas required exceeds allowance/
});
class Rn extends $ {
  constructor({ cause: t, maxFeePerGas: n } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${n ? ` = ${ee(n)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
      cause: t,
      name: "FeeCapTooHighError"
    });
  }
}
Object.defineProperty(Rn, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
class Ur extends $ {
  constructor({ cause: t, maxFeePerGas: n } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${n ? ` = ${ee(n)}` : ""} gwei) cannot be lower than the block base fee.`, {
      cause: t,
      name: "FeeCapTooLowError"
    });
  }
}
Object.defineProperty(Ur, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
});
class jr extends $ {
  constructor({ cause: t, nonce: n } = {}) {
    super(`Nonce provided for the transaction ${n ? `(${n}) ` : ""}is higher than the next one expected.`, { cause: t, name: "NonceTooHighError" });
  }
}
Object.defineProperty(jr, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /nonce too high/
});
class Lr extends $ {
  constructor({ cause: t, nonce: n } = {}) {
    super([
      `Nonce provided for the transaction ${n ? `(${n}) ` : ""}is lower than the current nonce of the account.`,
      "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
    ].join(`
`), { cause: t, name: "NonceTooLowError" });
  }
}
Object.defineProperty(Lr, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /nonce too low|transaction already imported|already known/
});
class _r extends $ {
  constructor({ cause: t, nonce: n } = {}) {
    super(`Nonce provided for the transaction ${n ? `(${n}) ` : ""}exceeds the maximum allowed nonce.`, { cause: t, name: "NonceMaxValueError" });
  }
}
Object.defineProperty(_r, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /nonce has max value/
});
class Gr extends $ {
  constructor({ cause: t } = {}) {
    super([
      "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
    ].join(`
`), {
      cause: t,
      metaMessages: [
        "This error could arise when the account does not have enough funds to:",
        " - pay for the total gas fee,",
        " - pay for the value to send.",
        " ",
        "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
        " - `gas` is the amount of gas needed for transaction to execute,",
        " - `gas fee` is the gas fee,",
        " - `value` is the amount of ether to send to the recipient."
      ],
      name: "InsufficientFundsError"
    });
  }
}
Object.defineProperty(Gr, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /insufficient funds|exceeds transaction sender account balance/
});
class Dr extends $ {
  constructor({ cause: t, gas: n } = {}) {
    super(`The amount of gas ${n ? `(${n}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
      cause: t,
      name: "IntrinsicGasTooHighError"
    });
  }
}
Object.defineProperty(Dr, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /intrinsic gas too high|gas limit reached/
});
class Hr extends $ {
  constructor({ cause: t, gas: n } = {}) {
    super(`The amount of gas ${n ? `(${n}) ` : ""}provided for the transaction is too low.`, {
      cause: t,
      name: "IntrinsicGasTooLowError"
    });
  }
}
Object.defineProperty(Hr, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /intrinsic gas too low/
});
class qr extends $ {
  constructor({ cause: t }) {
    super("The transaction type is not supported for this chain.", {
      cause: t,
      name: "TransactionTypeNotSupportedError"
    });
  }
}
Object.defineProperty(qr, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /transaction type not valid/
});
class Cn extends $ {
  constructor({ cause: t, maxPriorityFeePerGas: n, maxFeePerGas: r } = {}) {
    super([
      `The provided tip (\`maxPriorityFeePerGas\`${n ? ` = ${ee(n)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${r ? ` = ${ee(r)} gwei` : ""}).`
    ].join(`
`), {
      cause: t,
      name: "TipAboveFeeCapError"
    });
  }
}
Object.defineProperty(Cn, "nodeMessage", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});
class mn extends $ {
  constructor({ cause: t }) {
    super(`An error occurred while executing: ${t?.shortMessage}`, {
      cause: t,
      name: "UnknownNodeError"
    });
  }
}
function Zn(e, t) {
  const n = (e.details || "").toLowerCase(), r = e instanceof $ ? e.walk((s) => s?.code === lt.code) : e;
  return r instanceof $ ? new lt({
    cause: e,
    message: r.details
  }) : lt.nodeMessage.test(n) ? new lt({
    cause: e,
    message: e.details
  }) : Rn.nodeMessage.test(n) ? new Rn({
    cause: e,
    maxFeePerGas: t?.maxFeePerGas
  }) : Ur.nodeMessage.test(n) ? new Ur({
    cause: e,
    maxFeePerGas: t?.maxFeePerGas
  }) : jr.nodeMessage.test(n) ? new jr({ cause: e, nonce: t?.nonce }) : Lr.nodeMessage.test(n) ? new Lr({ cause: e, nonce: t?.nonce }) : _r.nodeMessage.test(n) ? new _r({ cause: e, nonce: t?.nonce }) : Gr.nodeMessage.test(n) ? new Gr({ cause: e }) : Dr.nodeMessage.test(n) ? new Dr({ cause: e, gas: t?.gas }) : Hr.nodeMessage.test(n) ? new Hr({ cause: e, gas: t?.gas }) : qr.nodeMessage.test(n) ? new qr({ cause: e }) : Cn.nodeMessage.test(n) ? new Cn({
    cause: e,
    maxFeePerGas: t?.maxFeePerGas,
    maxPriorityFeePerGas: t?.maxPriorityFeePerGas
  }) : new mn({
    cause: e
  });
}
function Y0(e, { docsPath: t, ...n }) {
  const r = (() => {
    const s = Zn(e, n);
    return s instanceof mn ? e : s;
  })();
  return new K0(r, {
    docsPath: t,
    ...n
  });
}
function Kn(e, { format: t }) {
  if (!t)
    return {};
  const n = {};
  function r(o) {
    const i = Object.keys(o);
    for (const a of i)
      a in e && (n[a] = e[a]), o[a] && typeof o[a] == "object" && !Array.isArray(o[a]) && r(o[a]);
  }
  const s = t(e || {});
  return r(s), n;
}
const J0 = {
  legacy: "0x0",
  eip2930: "0x1",
  eip1559: "0x2",
  eip4844: "0x3",
  eip7702: "0x4"
};
function yn(e, t) {
  const n = {};
  return typeof e.authorizationList < "u" && (n.authorizationList = X0(e.authorizationList)), typeof e.accessList < "u" && (n.accessList = e.accessList), typeof e.blobVersionedHashes < "u" && (n.blobVersionedHashes = e.blobVersionedHashes), typeof e.blobs < "u" && (typeof e.blobs[0] != "string" ? n.blobs = e.blobs.map((r) => H(r)) : n.blobs = e.blobs), typeof e.data < "u" && (n.data = e.data), e.account && (n.from = e.account.address), typeof e.from < "u" && (n.from = e.from), typeof e.gas < "u" && (n.gas = M(e.gas)), typeof e.gasPrice < "u" && (n.gasPrice = M(e.gasPrice)), typeof e.maxFeePerBlobGas < "u" && (n.maxFeePerBlobGas = M(e.maxFeePerBlobGas)), typeof e.maxFeePerGas < "u" && (n.maxFeePerGas = M(e.maxFeePerGas)), typeof e.maxPriorityFeePerGas < "u" && (n.maxPriorityFeePerGas = M(e.maxPriorityFeePerGas)), typeof e.nonce < "u" && (n.nonce = M(e.nonce)), typeof e.to < "u" && (n.to = e.to), typeof e.type < "u" && (n.type = J0[e.type]), typeof e.value < "u" && (n.value = M(e.value)), n;
}
function X0(e) {
  return e.map((t) => ({
    address: t.address,
    r: t.r ? M(BigInt(t.r)) : t.r,
    s: t.s ? M(BigInt(t.s)) : t.s,
    chainId: M(t.chainId),
    nonce: M(t.nonce),
    ...typeof t.yParity < "u" ? { yParity: M(t.yParity) } : {},
    ...typeof t.v < "u" && typeof t.yParity > "u" ? { v: M(t.v) } : {}
  }));
}
function wo(e) {
  if (!(!e || e.length === 0))
    return e.reduce((t, { slot: n, value: r }) => {
      if (n.length !== 66)
        throw new so({
          size: n.length,
          targetSize: 66,
          type: "hex"
        });
      if (r.length !== 66)
        throw new so({
          size: r.length,
          targetSize: 66,
          type: "hex"
        });
      return t[n] = r, t;
    }, {});
}
function Q0(e) {
  const { balance: t, nonce: n, state: r, stateDiff: s, code: o } = e, i = {};
  if (o !== void 0 && (i.code = o), t !== void 0 && (i.balance = M(t)), n !== void 0 && (i.nonce = M(n)), r !== void 0 && (i.state = wo(r)), s !== void 0) {
    if (i.state)
      throw new N0();
    i.stateDiff = wo(s);
  }
  return i;
}
function Es(e) {
  if (!e)
    return;
  const t = {};
  for (const { address: n, ...r } of e) {
    if (!ue(n, { strict: !1 }))
      throw new _e({ address: n });
    if (t[n])
      throw new k0({ address: n });
    t[n] = Q0(r);
  }
  return t;
}
const ef = 2n ** 256n - 1n;
function Tt(e) {
  const { account: t, maxFeePerGas: n, maxPriorityFeePerGas: r, to: s } = e, o = t ? oe(t) : void 0;
  if (o && !ue(o.address))
    throw new _e({ address: o.address });
  if (s && !ue(s))
    throw new _e({ address: s });
  if (n && n > ef)
    throw new Rn({ maxFeePerGas: n });
  if (r && n && r > n)
    throw new Cn({ maxFeePerGas: n, maxPriorityFeePerGas: r });
}
class Li extends $ {
  constructor() {
    super("`baseFeeMultiplier` must be greater than 1.", {
      name: "BaseFeeScalarError"
    });
  }
}
class Ps extends $ {
  constructor() {
    super("Chain does not support EIP-1559 fees.", {
      name: "Eip1559FeesNotSupportedError"
    });
  }
}
class tf extends $ {
  constructor({ maxPriorityFeePerGas: t }) {
    super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${ee(t)} gwei).`, { name: "MaxFeePerGasTooLowError" });
  }
}
class _i extends $ {
  constructor({ blockHash: t, blockNumber: n }) {
    let r = "Block";
    t && (r = `Block at hash "${t}"`), n && (r = `Block at number "${n}"`), super(`${r} could not be found.`, { name: "BlockNotFoundError" });
  }
}
const Gi = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};
function As(e, t) {
  const n = {
    ...e,
    blockHash: e.blockHash ? e.blockHash : null,
    blockNumber: e.blockNumber ? BigInt(e.blockNumber) : null,
    chainId: e.chainId ? Ce(e.chainId) : void 0,
    gas: e.gas ? BigInt(e.gas) : void 0,
    gasPrice: e.gasPrice ? BigInt(e.gasPrice) : void 0,
    maxFeePerBlobGas: e.maxFeePerBlobGas ? BigInt(e.maxFeePerBlobGas) : void 0,
    maxFeePerGas: e.maxFeePerGas ? BigInt(e.maxFeePerGas) : void 0,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas ? BigInt(e.maxPriorityFeePerGas) : void 0,
    nonce: e.nonce ? Ce(e.nonce) : void 0,
    to: e.to ? e.to : null,
    transactionIndex: e.transactionIndex ? Number(e.transactionIndex) : null,
    type: e.type ? Gi[e.type] : void 0,
    typeHex: e.type ? e.type : void 0,
    value: e.value ? BigInt(e.value) : void 0,
    v: e.v ? BigInt(e.v) : void 0
  };
  return e.authorizationList && (n.authorizationList = nf(e.authorizationList)), n.yParity = (() => {
    if (e.yParity)
      return Number(e.yParity);
    if (typeof n.v == "bigint") {
      if (n.v === 0n || n.v === 27n)
        return 0;
      if (n.v === 1n || n.v === 28n)
        return 1;
      if (n.v >= 35n)
        return n.v % 2n === 0n ? 1 : 0;
    }
  })(), n.type === "legacy" && (delete n.accessList, delete n.maxFeePerBlobGas, delete n.maxFeePerGas, delete n.maxPriorityFeePerGas, delete n.yParity), n.type === "eip2930" && (delete n.maxFeePerBlobGas, delete n.maxFeePerGas, delete n.maxPriorityFeePerGas), n.type === "eip1559" && delete n.maxFeePerBlobGas, n;
}
function nf(e) {
  return e.map((t) => ({
    address: t.address,
    chainId: Number(t.chainId),
    nonce: Number(t.nonce),
    r: t.r,
    s: t.s,
    yParity: Number(t.yParity)
  }));
}
function Di(e, t) {
  const n = (e.transactions ?? []).map((r) => typeof r == "string" ? r : As(r));
  return {
    ...e,
    baseFeePerGas: e.baseFeePerGas ? BigInt(e.baseFeePerGas) : null,
    blobGasUsed: e.blobGasUsed ? BigInt(e.blobGasUsed) : void 0,
    difficulty: e.difficulty ? BigInt(e.difficulty) : void 0,
    excessBlobGas: e.excessBlobGas ? BigInt(e.excessBlobGas) : void 0,
    gasLimit: e.gasLimit ? BigInt(e.gasLimit) : void 0,
    gasUsed: e.gasUsed ? BigInt(e.gasUsed) : void 0,
    hash: e.hash ? e.hash : null,
    logsBloom: e.logsBloom ? e.logsBloom : null,
    nonce: e.nonce ? e.nonce : null,
    number: e.number ? BigInt(e.number) : null,
    size: e.size ? BigInt(e.size) : void 0,
    timestamp: e.timestamp ? BigInt(e.timestamp) : void 0,
    transactions: n,
    totalDifficulty: e.totalDifficulty ? BigInt(e.totalDifficulty) : null
  };
}
async function he(e, { blockHash: t, blockNumber: n, blockTag: r = e.experimental_blockTag ?? "latest", includeTransactions: s } = {}) {
  const o = s ?? !1, i = n !== void 0 ? M(n) : void 0;
  let a = null;
  if (t ? a = await e.request({
    method: "eth_getBlockByHash",
    params: [t, o]
  }, { dedupe: !0 }) : a = await e.request({
    method: "eth_getBlockByNumber",
    params: [i || r, o]
  }, { dedupe: !!i }), !a)
    throw new _i({ blockHash: t, blockNumber: n });
  return (e.chain?.formatters?.block?.format || Di)(a, "getBlock");
}
async function $s(e) {
  const t = await e.request({
    method: "eth_gasPrice"
  });
  return BigInt(t);
}
async function rf(e, t) {
  return Hi(e, t);
}
async function Hi(e, t) {
  const { block: n, chain: r = e.chain, request: s } = t || {};
  try {
    const o = r?.fees?.maxPriorityFeePerGas ?? r?.fees?.defaultPriorityFee;
    if (typeof o == "function") {
      const a = n || await z(e, he, "getBlock")({}), c = await o({
        block: a,
        client: e,
        request: s
      });
      if (c === null)
        throw new Error();
      return c;
    }
    if (typeof o < "u")
      return o;
    const i = await e.request({
      method: "eth_maxPriorityFeePerGas"
    });
    return Ee(i);
  } catch {
    const [o, i] = await Promise.all([
      n ? Promise.resolve(n) : z(e, he, "getBlock")({}),
      z(e, $s, "getGasPrice")({})
    ]);
    if (typeof o.baseFeePerGas != "bigint")
      throw new Ps();
    const a = i - o.baseFeePerGas;
    return a < 0n ? 0n : a;
  }
}
async function sf(e, t) {
  return Vr(e, t);
}
async function Vr(e, t) {
  const { block: n, chain: r = e.chain, request: s, type: o = "eip1559" } = t || {}, i = await (async () => typeof r?.fees?.baseFeeMultiplier == "function" ? r.fees.baseFeeMultiplier({
    block: n,
    client: e,
    request: s
  }) : r?.fees?.baseFeeMultiplier ?? 1.2)();
  if (i < 1)
    throw new Li();
  const c = 10 ** (i.toString().split(".")[1]?.length ?? 0), u = (l) => l * BigInt(Math.ceil(i * c)) / BigInt(c), f = n || await z(e, he, "getBlock")({});
  if (typeof r?.fees?.estimateFeesPerGas == "function") {
    const l = await r.fees.estimateFeesPerGas({
      block: n,
      client: e,
      multiply: u,
      request: s,
      type: o
    });
    if (l !== null)
      return l;
  }
  if (o === "eip1559") {
    if (typeof f.baseFeePerGas != "bigint")
      throw new Ps();
    const l = typeof s?.maxPriorityFeePerGas == "bigint" ? s.maxPriorityFeePerGas : await Hi(e, {
      block: f,
      chain: r,
      request: s
    }), h = u(f.baseFeePerGas);
    return {
      maxFeePerGas: s?.maxFeePerGas ?? h + l,
      maxPriorityFeePerGas: l
    };
  }
  return {
    gasPrice: s?.gasPrice ?? u(await z(e, $s, "getGasPrice")({}))
  };
}
async function qi(e, { address: t, blockTag: n = "latest", blockNumber: r }) {
  const s = await e.request({
    method: "eth_getTransactionCount",
    params: [
      t,
      typeof r == "bigint" ? M(r) : n
    ]
  }, {
    dedupe: !!r
  });
  return Ce(s);
}
function Vi(e) {
  const { kzg: t } = e, n = e.to ?? (typeof e.blobs[0] == "string" ? "hex" : "bytes"), r = typeof e.blobs[0] == "string" ? e.blobs.map((o) => Pe(o)) : e.blobs, s = [];
  for (const o of r)
    s.push(Uint8Array.from(t.blobToKzgCommitment(o)));
  return n === "bytes" ? s : s.map((o) => H(o));
}
function Wi(e) {
  const { kzg: t } = e, n = e.to ?? (typeof e.blobs[0] == "string" ? "hex" : "bytes"), r = typeof e.blobs[0] == "string" ? e.blobs.map((i) => Pe(i)) : e.blobs, s = typeof e.commitments[0] == "string" ? e.commitments.map((i) => Pe(i)) : e.commitments, o = [];
  for (let i = 0; i < r.length; i++) {
    const a = r[i], c = s[i];
    o.push(Uint8Array.from(t.computeBlobKzgProof(a, c)));
  }
  return n === "bytes" ? o : o.map((i) => H(i));
}
function of(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function af(e, t, n) {
  return e & t ^ ~e & n;
}
function cf(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class uf extends hs {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = ur(this.buffer);
  }
  update(t) {
    xt(this), t = Gn(t), Xe(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ur(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    xt(this), pi(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, vt(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    of(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ur(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, f[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = o, t.length = s, t.pos = a, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Me = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ff = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), Ue = /* @__PURE__ */ new Uint32Array(64);
class df extends uf {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Me[0] | 0, this.B = Me[1] | 0, this.C = Me[2] | 0, this.D = Me[3] | 0, this.E = Me[4] | 0, this.F = Me[5] | 0, this.G = Me[6] | 0, this.H = Me[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Ue[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const l = Ue[d - 15], h = Ue[d - 2], p = we(l, 7) ^ we(l, 18) ^ l >>> 3, m = we(h, 17) ^ we(h, 19) ^ h >>> 10;
      Ue[d] = m + Ue[d - 7] + p + Ue[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: f } = this;
    for (let d = 0; d < 64; d++) {
      const l = we(a, 6) ^ we(a, 11) ^ we(a, 25), h = f + l + af(a, c, u) + ff[d] + Ue[d] | 0, m = (we(r, 2) ^ we(r, 13) ^ we(r, 22)) + cf(r, s, o) | 0;
      f = u, u = c, c = a, a = i + h | 0, i = o, o = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, u, f);
  }
  roundClean() {
    vt(Ue);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), vt(this.buffer);
  }
}
const Zi = /* @__PURE__ */ mi(() => new df()), lf = Zi;
function hf(e, t) {
  return lf(ve(e, { strict: !1 }) ? It(e) : e);
}
function bf(e) {
  const { commitment: t, version: n = 1 } = e, r = e.to ?? (typeof t == "string" ? "hex" : "bytes"), s = hf(t);
  return s.set([n], 0), r === "bytes" ? s : H(s);
}
function pf(e) {
  const { commitments: t, version: n } = e, r = e.to, s = [];
  for (const o of t)
    s.push(bf({
      commitment: o,
      to: r,
      version: n
    }));
  return s;
}
const xo = 6, Ki = 32, Bs = 4096, Yi = Ki * Bs, vo = Yi * xo - // terminator byte (0x80).
1 - // zero byte (0x00) appended to each field element.
1 * Bs * xo;
class mf extends $ {
  constructor({ maxSize: t, size: n }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${t} bytes`, `Given: ${n} bytes`],
      name: "BlobSizeTooLargeError"
    });
  }
}
class yf extends $ {
  constructor() {
    super("Blob data must not be empty.", { name: "EmptyBlobError" });
  }
}
function gf(e) {
  const t = typeof e.data == "string" ? Pe(e.data) : e.data, n = D(t);
  if (!n)
    throw new yf();
  if (n > vo)
    throw new mf({
      maxSize: vo,
      size: n
    });
  const r = [];
  let s = !0, o = 0;
  for (; s; ) {
    const i = gs(new Uint8Array(Yi));
    let a = 0;
    for (; a < Bs; ) {
      const c = t.slice(o, o + (Ki - 1));
      if (i.pushByte(0), i.pushBytes(c), c.length < 31) {
        i.pushByte(128), s = !1;
        break;
      }
      a++, o += 31;
    }
    r.push(i);
  }
  return r.map((i) => H(i.bytes));
}
function wf(e) {
  const { data: t, kzg: n, to: r } = e, s = e.blobs ?? gf({ data: t }), o = e.commitments ?? Vi({ blobs: s, kzg: n, to: r }), i = e.proofs ?? Wi({ blobs: s, commitments: o, kzg: n, to: r }), a = [];
  for (let c = 0; c < s.length; c++)
    a.push({
      blob: s[c],
      commitment: o[c],
      proof: i[c]
    });
  return a;
}
function xf(e) {
  if (e.type)
    return e.type;
  if (typeof e.authorizationList < "u")
    return "eip7702";
  if (typeof e.blobs < "u" || typeof e.blobVersionedHashes < "u" || typeof e.maxFeePerBlobGas < "u" || typeof e.sidecars < "u")
    return "eip4844";
  if (typeof e.maxFeePerGas < "u" || typeof e.maxPriorityFeePerGas < "u")
    return "eip1559";
  if (typeof e.gasPrice < "u")
    return typeof e.accessList < "u" ? "eip2930" : "legacy";
  throw new R0({ transaction: e });
}
function vf(e, { docsPath: t, ...n }) {
  const r = (() => {
    const s = Zn(e, n);
    return s instanceof mn ? e : s;
  })();
  return new C0(r, {
    docsPath: t,
    ...n
  });
}
async function Is(e) {
  const t = await e.request({
    method: "eth_chainId"
  }, { dedupe: !0 });
  return Ce(t);
}
async function Ji(e, t) {
  const { account: n = e.account, accessList: r, authorizationList: s, chain: o = e.chain, blobVersionedHashes: i, blobs: a, data: c, gas: u, gasPrice: f, maxFeePerBlobGas: d, maxFeePerGas: l, maxPriorityFeePerGas: h, nonce: p, nonceManager: m, to: E, type: g, value: P, ...w } = t, b = await (async () => {
    if (!n || !m || typeof p < "u")
      return p;
    const B = oe(n), N = o ? o.id : await z(e, Is, "getChainId")({});
    return await m.consume({
      address: B.address,
      chainId: N,
      client: e
    });
  })();
  Tt(t);
  const y = o?.formatters?.transactionRequest?.format, x = (y || yn)({
    // Pick out extra data that might exist on the chain's transaction request type.
    ...Kn(w, { format: y }),
    account: n ? oe(n) : void 0,
    accessList: r,
    authorizationList: s,
    blobs: a,
    blobVersionedHashes: i,
    data: c,
    gas: u,
    gasPrice: f,
    maxFeePerBlobGas: d,
    maxFeePerGas: l,
    maxPriorityFeePerGas: h,
    nonce: b,
    to: E,
    type: g,
    value: P
  }, "fillTransaction");
  try {
    const B = await e.request({
      method: "eth_fillTransaction",
      params: [x]
    }), v = (o?.formatters?.transaction?.format || As)(B.tx);
    delete v.blockHash, delete v.blockNumber, delete v.r, delete v.s, delete v.transactionIndex, delete v.v, delete v.yParity, v.data = v.input, v.gas && (v.gas = t.gas ?? v.gas), v.gasPrice && (v.gasPrice = t.gasPrice ?? v.gasPrice), v.maxFeePerBlobGas && (v.maxFeePerBlobGas = t.maxFeePerBlobGas ?? v.maxFeePerBlobGas), v.maxFeePerGas && (v.maxFeePerGas = t.maxFeePerGas ?? v.maxFeePerGas), v.maxPriorityFeePerGas && (v.maxPriorityFeePerGas = t.maxPriorityFeePerGas ?? v.maxPriorityFeePerGas), v.nonce && (v.nonce = t.nonce ?? v.nonce);
    const k = await (async () => {
      if (typeof o?.fees?.baseFeeMultiplier == "function") {
        const S = await z(e, he, "getBlock")({});
        return o.fees.baseFeeMultiplier({
          block: S,
          client: e,
          request: t
        });
      }
      return o?.fees?.baseFeeMultiplier ?? 1.2;
    })();
    if (k < 1)
      throw new Li();
    const R = 10 ** (k.toString().split(".")[1]?.length ?? 0), U = (S) => S * BigInt(Math.ceil(k * R)) / BigInt(R);
    return v.maxFeePerGas && !t.maxFeePerGas && (v.maxFeePerGas = U(v.maxFeePerGas)), v.gasPrice && !t.gasPrice && (v.gasPrice = U(v.gasPrice)), {
      raw: B.raw,
      transaction: {
        from: x.from,
        ...v
      }
    };
  } catch (B) {
    throw vf(B, {
      ...t,
      chain: e.chain
    });
  }
}
const Ef = [
  "blobVersionedHashes",
  "chainId",
  "fees",
  "gas",
  "nonce",
  "type"
], Eo = /* @__PURE__ */ new Map(), lr = /* @__PURE__ */ new Hn(128);
async function Xi(e, t) {
  let n = t;
  n.account ??= e.account, n.parameters ??= Ef;
  const { account: r, chain: s = e.chain, nonceManager: o, parameters: i } = n, a = (() => {
    if (typeof s?.prepareTransactionRequest == "function")
      return {
        fn: s.prepareTransactionRequest,
        runAt: ["beforeFillTransaction"]
      };
    if (Array.isArray(s?.prepareTransactionRequest))
      return {
        fn: s.prepareTransactionRequest[0],
        runAt: s.prepareTransactionRequest[1].runAt
      };
  })();
  let c;
  async function u() {
    return c || (typeof n.chainId < "u" ? n.chainId : s ? s.id : (c = await z(e, Is, "getChainId")({}), c));
  }
  const f = r && oe(r);
  let d = n.nonce;
  if (i.includes("nonce") && typeof d > "u" && f && o) {
    const b = await u();
    d = await o.consume({
      address: f.address,
      chainId: b,
      client: e
    });
  }
  a?.fn && a.runAt?.includes("beforeFillTransaction") && (n = await a.fn({ ...n, chain: s }, {
    phase: "beforeFillTransaction"
  }), d ??= n.nonce);
  const h = ((i.includes("blobVersionedHashes") || i.includes("sidecars")) && n.kzg && n.blobs || lr.get(e.uid) === !1 || !["fees", "gas"].some((y) => i.includes(y)) ? !1 : !!(i.includes("chainId") && typeof n.chainId != "number" || i.includes("nonce") && typeof d != "number" || i.includes("fees") && typeof n.gasPrice != "bigint" && (typeof n.maxFeePerGas != "bigint" || typeof n.maxPriorityFeePerGas != "bigint") || i.includes("gas") && typeof n.gas != "bigint")) ? await z(e, Ji, "fillTransaction")({ ...n, nonce: d }).then((b) => {
    const { chainId: y, from: A, gas: x, gasPrice: B, nonce: N, maxFeePerBlobGas: v, maxFeePerGas: k, maxPriorityFeePerGas: O, type: R, ...U } = b.transaction;
    return lr.set(e.uid, !0), {
      ...n,
      ...A ? { from: A } : {},
      ...R && !n.type ? { type: R } : {},
      ...typeof y < "u" ? { chainId: y } : {},
      ...typeof x < "u" ? { gas: x } : {},
      ...typeof B < "u" ? { gasPrice: B } : {},
      ...typeof N < "u" ? { nonce: N } : {},
      ...typeof v < "u" && n.type !== "legacy" && n.type !== "eip2930" ? { maxFeePerBlobGas: v } : {},
      ...typeof k < "u" && n.type !== "legacy" && n.type !== "eip2930" ? { maxFeePerGas: k } : {},
      ...typeof O < "u" && n.type !== "legacy" && n.type !== "eip2930" ? { maxPriorityFeePerGas: O } : {},
      ..."nonceKey" in U && typeof U.nonceKey < "u" ? { nonceKey: U.nonceKey } : {},
      ..."keyAuthorization" in U && typeof U.keyAuthorization < "u" && U.keyAuthorization !== null && !("keyAuthorization" in n) ? { keyAuthorization: U.keyAuthorization } : {},
      ..."feePayerSignature" in U && typeof U.feePayerSignature < "u" && U.feePayerSignature !== null ? { feePayerSignature: U.feePayerSignature } : {}
    };
  }).catch((b) => {
    const y = b;
    if (y.name !== "TransactionExecutionError")
      return n;
    if (y.walk?.((B) => B.name === "ExecutionRevertedError"))
      throw b;
    return y.walk?.((B) => {
      const N = B;
      return N.name === "MethodNotFoundRpcError" || N.name === "MethodNotSupportedRpcError" || N.message?.includes("eth_fillTransaction is not available");
    }) && lr.set(e.uid, !1), n;
  }) : n;
  d ??= h.nonce, n = {
    ...h,
    ...f ? { from: f?.address } : {},
    ...d ? { nonce: d } : {}
  };
  const { blobs: p, gas: m, kzg: E, type: g } = n;
  a?.fn && a.runAt?.includes("beforeFillParameters") && (n = await a.fn({ ...n, chain: s }, {
    phase: "beforeFillParameters"
  }));
  let P;
  async function w() {
    return P || (P = await z(e, he, "getBlock")({ blockTag: "latest" }), P);
  }
  if (i.includes("nonce") && typeof d > "u" && f && !o && (n.nonce = await z(e, qi, "getTransactionCount")({
    address: f.address,
    blockTag: "pending"
  })), (i.includes("blobVersionedHashes") || i.includes("sidecars")) && p && E) {
    const b = Vi({ blobs: p, kzg: E });
    if (i.includes("blobVersionedHashes")) {
      const y = pf({
        commitments: b,
        to: "hex"
      });
      n.blobVersionedHashes = y;
    }
    if (i.includes("sidecars")) {
      const y = Wi({ blobs: p, commitments: b, kzg: E }), A = wf({
        blobs: p,
        commitments: b,
        proofs: y,
        to: "hex"
      });
      n.sidecars = A;
    }
  }
  if (i.includes("chainId") && (n.chainId = await u()), (i.includes("fees") || i.includes("type")) && typeof g > "u")
    try {
      n.type = xf(n);
    } catch {
      let b = Eo.get(e.uid);
      typeof b > "u" && (b = typeof (await w())?.baseFeePerGas == "bigint", Eo.set(e.uid, b)), n.type = b ? "eip1559" : "legacy";
    }
  if (i.includes("fees"))
    if (n.type !== "legacy" && n.type !== "eip2930") {
      if (typeof n.maxFeePerGas > "u" || typeof n.maxPriorityFeePerGas > "u") {
        const b = await w(), { maxFeePerGas: y, maxPriorityFeePerGas: A } = await Vr(e, {
          block: b,
          chain: s,
          request: n
        });
        if (typeof n.maxPriorityFeePerGas > "u" && n.maxFeePerGas && n.maxFeePerGas < A)
          throw new tf({
            maxPriorityFeePerGas: A
          });
        n.maxPriorityFeePerGas = A, n.maxFeePerGas = y;
      }
    } else {
      if (typeof n.maxFeePerGas < "u" || typeof n.maxPriorityFeePerGas < "u")
        throw new Ps();
      if (typeof n.gasPrice > "u") {
        const b = await w(), { gasPrice: y } = await Vr(e, {
          block: b,
          chain: s,
          request: n,
          type: "legacy"
        });
        n.gasPrice = y;
      }
    }
  return i.includes("gas") && typeof m > "u" && (n.gas = await z(e, Ss, "estimateGas")({
    ...n,
    account: f,
    prepare: f?.type === "local" ? [] : ["blobVersionedHashes"]
  })), a?.fn && a.runAt?.includes("afterFillParameters") && (n = await a.fn({ ...n, chain: s }, {
    phase: "afterFillParameters"
  })), Tt(n), delete n.parameters, n;
}
async function Ss(e, t) {
  const { account: n = e.account, prepare: r = !0 } = t, s = n ? oe(n) : void 0, o = (() => {
    if (Array.isArray(r))
      return r;
    if (s?.type !== "local")
      return ["blobVersionedHashes"];
  })();
  try {
    const i = await (async () => {
      if (t.to)
        return t.to;
      if (t.authorizationList && t.authorizationList.length > 0)
        return await ji({
          authorization: t.authorizationList[0]
        }).catch(() => {
          throw new $("`to` is required. Could not infer from `authorizationList`");
        });
    })(), { accessList: a, authorizationList: c, blobs: u, blobVersionedHashes: f, blockNumber: d, blockTag: l, data: h, gas: p, gasPrice: m, maxFeePerBlobGas: E, maxFeePerGas: g, maxPriorityFeePerGas: P, nonce: w, value: b, stateOverride: y, ...A } = r ? await Xi(e, {
      ...t,
      parameters: o,
      to: i
    }) : t;
    if (p && t.gas !== p)
      return p;
    const B = (typeof d == "bigint" ? M(d) : void 0) || l, N = Es(y);
    Tt(t);
    const v = e.chain?.formatters?.transactionRequest?.format, O = (v || yn)({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...Kn(A, { format: v }),
      account: s,
      accessList: a,
      authorizationList: c,
      blobs: u,
      blobVersionedHashes: f,
      data: h,
      gasPrice: m,
      maxFeePerBlobGas: E,
      maxFeePerGas: g,
      maxPriorityFeePerGas: P,
      nonce: w,
      to: i,
      value: b
    }, "estimateGas");
    return BigInt(await e.request({
      method: "eth_estimateGas",
      params: N ? [
        O,
        B ?? e.experimental_blockTag ?? "latest",
        N
      ] : B ? [O, B] : [O]
    }));
  } catch (i) {
    throw Y0(i, {
      ...t,
      account: s,
      chain: e.chain
    });
  }
}
async function Pf(e, t) {
  const { abi: n, address: r, args: s, functionName: o, dataSuffix: i = typeof e.dataSuffix == "string" ? e.dataSuffix : e.dataSuffix?.value, ...a } = t, c = fe({
    abi: n,
    args: s,
    functionName: o
  });
  try {
    return await z(e, Ss, "estimateGas")({
      data: `${c}${i ? i.replace("0x", "") : ""}`,
      to: r,
      ...a
    });
  } catch (u) {
    const f = a.account ? oe(a.account) : void 0;
    throw Pt(u, {
      abi: n,
      address: r,
      args: s,
      docsPath: "/docs/contract/estimateContractGas",
      functionName: o,
      sender: f?.address
    });
  }
}
function an(e, t) {
  if (!ue(e, { strict: !1 }))
    throw new _e({ address: e });
  if (!ue(t, { strict: !1 }))
    throw new _e({ address: t });
  return e.toLowerCase() === t.toLowerCase();
}
function $e(e, { args: t, eventName: n } = {}) {
  return {
    ...e,
    blockHash: e.blockHash ? e.blockHash : null,
    blockNumber: e.blockNumber ? BigInt(e.blockNumber) : null,
    blockTimestamp: e.blockTimestamp ? BigInt(e.blockTimestamp) : e.blockTimestamp === null ? null : void 0,
    logIndex: e.logIndex ? Number(e.logIndex) : null,
    transactionHash: e.transactionHash ? e.transactionHash : null,
    transactionIndex: e.transactionIndex ? Number(e.transactionIndex) : null,
    ...n ? { args: t, eventName: n } : {}
  };
}
const Po = "/docs/contract/decodeEventLog";
function Fn(e) {
  const { abi: t, data: n, strict: r, topics: s } = e, o = r ?? !0, [i, ...a] = s;
  if (!i)
    throw new au({ docsPath: Po });
  const c = t.find((g) => g.type === "event" && i === Dn(be(g)));
  if (!(c && "name" in c) || c.type !== "event")
    throw new cu(i, { docsPath: Po });
  const { name: u, inputs: f } = c, d = f?.some((g) => !("name" in g && g.name)), l = d ? [] : {}, h = f.map((g, P) => [g, P]).filter(([g]) => "indexed" in g && g.indexed), p = [];
  for (let g = 0; g < h.length; g++) {
    const [P, w] = h[g], b = a[g];
    if (!b) {
      if (o)
        throw new ds({
          abiItem: c,
          param: P
        });
      p.push([P, w]);
      continue;
    }
    l[d ? w : P.name || w] = Af({
      param: P,
      value: b
    });
  }
  const m = f.filter((g) => !("indexed" in g && g.indexed)), E = o ? m : [...p.map(([g]) => g), ...m];
  if (E.length > 0) {
    if (n && n !== "0x")
      try {
        const g = bn(E, n);
        if (g) {
          let P = 0;
          if (!o)
            for (const [w, b] of p)
              l[d ? b : w.name || b] = g[P++];
          if (d)
            for (let w = 0; w < f.length; w++)
              l[w] === void 0 && P < g.length && (l[w] = g[P++]);
          else
            for (let w = 0; w < m.length; w++)
              l[m[w].name] = g[P++];
        }
      } catch (g) {
        if (o)
          throw g instanceof ci || g instanceof ki ? new Nn({
            abiItem: c,
            data: n,
            params: E,
            size: D(n)
          }) : g;
      }
    else if (o)
      throw new Nn({
        abiItem: c,
        data: "0x",
        params: E,
        size: 0
      });
  }
  return {
    eventName: u,
    args: Object.values(l).length > 0 ? l : void 0
  };
}
function Af({ param: e, value: t }) {
  return e.type === "string" || e.type === "bytes" || e.type === "tuple" || e.type.match(/^(.*)\[(\d+)?\]$/) ? t : (bn([e], t) || [])[0];
}
function Ts(e) {
  const { abi: t, args: n, logs: r, strict: s = !0 } = e, o = (() => {
    if (e.eventName)
      return Array.isArray(e.eventName) ? e.eventName : [e.eventName];
  })(), i = t.filter((a) => a.type === "event").map((a) => ({
    abi: a,
    selector: Dn(a)
  }));
  return r.map((a) => {
    const c = typeof a.blockNumber == "string" ? $e(a) : a, u = i.filter((l) => c.topics[0] === l.selector);
    if (u.length === 0)
      return null;
    let f, d;
    for (const l of u)
      try {
        f = Fn({
          ...c,
          abi: [l.abi],
          strict: !0
        }), d = l;
        break;
      } catch {
      }
    if (!f && !s) {
      d = u[0];
      try {
        f = Fn({
          data: c.data,
          topics: c.topics,
          abi: [d.abi],
          strict: !1
        });
      } catch {
        const l = d.abi.inputs?.some((h) => !("name" in h && h.name));
        return {
          ...c,
          args: l ? [] : {},
          eventName: d.abi.name
        };
      }
    }
    return !f || !d || o && !o.includes(f.eventName) || !$f({
      args: f.args,
      inputs: d.abi.inputs,
      matchArgs: n
    }) ? null : { ...f, ...c };
  }).filter(Boolean);
}
function $f(e) {
  const { args: t, inputs: n, matchArgs: r } = e;
  if (!r)
    return !0;
  if (!t)
    return !1;
  function s(o, i, a) {
    try {
      return o.type === "address" ? an(i, a) : o.type === "string" || o.type === "bytes" ? V(It(i)) === a : i === a;
    } catch {
      return !1;
    }
  }
  return Array.isArray(t) && Array.isArray(r) ? r.every((o, i) => {
    if (o == null)
      return !0;
    const a = n[i];
    return a ? (Array.isArray(o) ? o : [o]).some((u) => s(a, u, t[i])) : !1;
  }) : typeof t == "object" && !Array.isArray(t) && typeof r == "object" && !Array.isArray(r) ? Object.entries(r).every(([o, i]) => {
    if (i == null)
      return !0;
    const a = n.find((u) => u.name === o);
    return a ? (Array.isArray(i) ? i : [i]).some((u) => s(a, u, t[o])) : !1;
  }) : !1;
}
async function ks(e, { address: t, blockHash: n, fromBlock: r, toBlock: s, event: o, events: i, args: a, strict: c } = {}) {
  const u = c ?? !1, f = i ?? (o ? [o] : void 0);
  let d = [];
  f && (d = [f.flatMap((m) => hn({
    abi: [m],
    eventName: m.name,
    args: i ? void 0 : a
  }))], o && (d = d[0]));
  let l;
  n ? l = await e.request({
    method: "eth_getLogs",
    params: [{ address: t, topics: d, blockHash: n }]
  }) : l = await e.request({
    method: "eth_getLogs",
    params: [
      {
        address: t,
        topics: d,
        fromBlock: typeof r == "bigint" ? M(r) : r,
        toBlock: typeof s == "bigint" ? M(s) : s
      }
    ]
  });
  const h = l.map((p) => $e(p));
  return f ? Ts({
    abi: f,
    args: a,
    logs: h,
    strict: u
  }) : h;
}
async function Qi(e, t) {
  const { abi: n, address: r, args: s, blockHash: o, eventName: i, fromBlock: a, toBlock: c, strict: u } = t, f = i ? ot({ abi: n, name: i }) : void 0, d = f ? void 0 : n.filter((l) => l.type === "event");
  return z(e, ks, "getLogs")({
    address: r,
    args: s,
    blockHash: o,
    event: f,
    events: d,
    fromBlock: a,
    toBlock: c,
    strict: u
  });
}
const hr = "/docs/contract/decodeFunctionResult";
function He(e) {
  const { abi: t, args: n, functionName: r, data: s } = e;
  let o = t[0];
  if (r) {
    const a = ot({ abi: t, args: n, name: r });
    if (!a)
      throw new wt(r, { docsPath: hr });
    o = a;
  }
  if (o.type !== "function")
    throw new wt(void 0, { docsPath: hr });
  if (!o.outputs)
    throw new fi(o.name, { docsPath: hr });
  const i = bn(o.outputs, s);
  if (i && i.length > 1)
    return i;
  if (i && i.length === 1)
    return i[0];
}
const Ns = /* @__PURE__ */ BigInt(0), Wr = /* @__PURE__ */ BigInt(1);
function gn(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Os(e) {
  if (!gn(e))
    throw new Error("Uint8Array expected");
}
function cn(e, t) {
  if (typeof t != "boolean")
    throw new Error(e + " boolean expected, got " + t);
}
function $n(e) {
  const t = e.toString(16);
  return t.length & 1 ? "0" + t : t;
}
function ea(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? Ns : BigInt("0x" + e);
}
const ta = (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function"
), Bf = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function un(e) {
  if (Os(e), ta)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Bf[e[n]];
  return t;
}
const Ie = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ao(e) {
  if (e >= Ie._0 && e <= Ie._9)
    return e - Ie._0;
  if (e >= Ie.A && e <= Ie.F)
    return e - (Ie.A - 10);
  if (e >= Ie.a && e <= Ie.f)
    return e - (Ie.a - 10);
}
function zn(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (ta)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Ao(e.charCodeAt(o)), a = Ao(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
function Je(e) {
  return ea(un(e));
}
function na(e) {
  return Os(e), ea(un(Uint8Array.from(e).reverse()));
}
function wn(e, t) {
  return zn(e.toString(16).padStart(t * 2, "0"));
}
function ra(e, t) {
  return wn(e, t).reverse();
}
function ce(e, t, n) {
  let r;
  if (typeof t == "string")
    try {
      r = zn(t);
    } catch (o) {
      throw new Error(e + " must be hex string or Uint8Array, cause: " + o);
    }
  else if (gn(t))
    r = Uint8Array.from(t);
  else
    throw new Error(e + " must be hex string or Uint8Array");
  const s = r.length;
  if (typeof n == "number" && s !== n)
    throw new Error(e + " of length " + n + " expected, got " + s);
  return r;
}
function Mn(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    Os(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const br = (e) => typeof e == "bigint" && Ns <= e;
function Rs(e, t, n) {
  return br(e) && br(t) && br(n) && t <= e && e < n;
}
function yt(e, t, n, r) {
  if (!Rs(t, n, r))
    throw new Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function If(e) {
  let t;
  for (t = 0; e > Ns; e >>= Wr, t += 1)
    ;
  return t;
}
const Yn = (e) => (Wr << BigInt(e)) - Wr, pr = (e) => new Uint8Array(e), $o = (e) => Uint8Array.from(e);
function Sf(e, t, n) {
  if (typeof e != "number" || e < 2)
    throw new Error("hashLen must be a number");
  if (typeof t != "number" || t < 2)
    throw new Error("qByteLen must be a number");
  if (typeof n != "function")
    throw new Error("hmacFn must be a function");
  let r = pr(e), s = pr(e), o = 0;
  const i = () => {
    r.fill(1), s.fill(0), o = 0;
  }, a = (...d) => n(s, r, ...d), c = (d = pr(0)) => {
    s = a($o([0]), d), r = a(), d.length !== 0 && (s = a($o([1]), d), r = a());
  }, u = () => {
    if (o++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let d = 0;
    const l = [];
    for (; d < t; ) {
      r = a();
      const h = r.slice();
      l.push(h), d += r.length;
    }
    return Mn(...l);
  };
  return (d, l) => {
    i(), c(d);
    let h;
    for (; !(h = l(u())); )
      c();
    return i(), h;
  };
}
const Tf = {
  bigint: (e) => typeof e == "bigint",
  function: (e) => typeof e == "function",
  boolean: (e) => typeof e == "boolean",
  string: (e) => typeof e == "string",
  stringOrUint8Array: (e) => typeof e == "string" || gn(e),
  isSafeInteger: (e) => Number.isSafeInteger(e),
  array: (e) => Array.isArray(e),
  field: (e, t) => t.Fp.isValid(e),
  hash: (e) => typeof e == "function" && Number.isSafeInteger(e.outputLen)
};
function Jn(e, t, n = {}) {
  const r = (s, o, i) => {
    const a = Tf[o];
    if (typeof a != "function")
      throw new Error("invalid validator function");
    const c = e[s];
    if (!(i && c === void 0) && !a(c, e))
      throw new Error("param " + String(s) + " is invalid. Expected " + o + ", got " + c);
  };
  for (const [s, o] of Object.entries(t))
    r(s, o, !1);
  for (const [s, o] of Object.entries(n))
    r(s, o, !0);
  return e;
}
function Bo(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (n, ...r) => {
    const s = t.get(n);
    if (s !== void 0)
      return s;
    const o = e(n, ...r);
    return t.set(n, o), o;
  };
}
const kf = "0.1.1";
function Nf() {
  return kf;
}
class j extends Error {
  static setStaticOptions(t) {
    j.prototype.docsOrigin = t.docsOrigin, j.prototype.showVersion = t.showVersion, j.prototype.version = t.version;
  }
  constructor(t, n = {}) {
    const r = (() => {
      if (n.cause instanceof j) {
        if (n.cause.details)
          return n.cause.details;
        if (n.cause.shortMessage)
          return n.cause.shortMessage;
      }
      return n.cause && "details" in n.cause && typeof n.cause.details == "string" ? n.cause.details : n.cause?.message ? n.cause.message : n.details;
    })(), s = n.cause instanceof j && n.cause.docsPath || n.docsPath, o = n.docsOrigin ?? j.prototype.docsOrigin, i = `${o}${s ?? ""}`, a = !!(n.version ?? j.prototype.showVersion), c = n.version ?? j.prototype.version, u = [
      t || "An error occurred.",
      ...n.metaMessages ? ["", ...n.metaMessages] : [],
      ...r || s || a ? [
        "",
        r ? `Details: ${r}` : void 0,
        s ? `See: ${i}` : void 0,
        a ? `Version: ${c}` : void 0
      ] : []
    ].filter((f) => typeof f == "string").join(`
`);
    super(u, n.cause ? { cause: n.cause } : void 0), Object.defineProperty(this, "details", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "docs", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "docsOrigin", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "docsPath", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "shortMessage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "showVersion", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "version", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cause", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "BaseError"
    }), this.cause = n.cause, this.details = r, this.docs = i, this.docsOrigin = o, this.docsPath = s, this.shortMessage = t, this.showVersion = a, this.version = c;
  }
  walk(t) {
    return sa(this, t);
  }
}
Object.defineProperty(j, "defaultStaticOptions", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    docsOrigin: "https://oxlib.sh",
    showVersion: !1,
    version: `ox@${Nf()}`
  }
});
j.setStaticOptions(j.defaultStaticOptions);
function sa(e, t) {
  return t?.(e) ? e : e && typeof e == "object" && "cause" in e && e.cause ? sa(e.cause, t) : t ? null : e;
}
function xn(e, t) {
  if (ht(e) > t)
    throw new Zf({
      givenSize: ht(e),
      maxSize: t
    });
}
const Se = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function Io(e) {
  if (e >= Se.zero && e <= Se.nine)
    return e - Se.zero;
  if (e >= Se.A && e <= Se.F)
    return e - (Se.A - 10);
  if (e >= Se.a && e <= Se.f)
    return e - (Se.a - 10);
}
function Of(e, t = {}) {
  const { dir: n, size: r = 32 } = t;
  if (r === 0)
    return e;
  if (e.length > r)
    throw new Kf({
      size: e.length,
      targetSize: r,
      type: "Bytes"
    });
  const s = new Uint8Array(r);
  for (let o = 0; o < r; o++) {
    const i = n === "right";
    s[i ? o : r - o - 1] = e[i ? o : e.length - o - 1];
  }
  return s;
}
function oa(e, t = {}) {
  const { dir: n = "left" } = t;
  let r = e, s = 0;
  for (let o = 0; o < r.length - 1 && r[n === "left" ? o : r.length - o - 1].toString() === "0"; o++)
    s++;
  return r = n === "left" ? r.slice(s) : r.slice(0, r.length - s), r;
}
function Xn(e, t) {
  if (ie(e) > t)
    throw new td({
      givenSize: ie(e),
      maxSize: t
    });
}
function Rf(e, t) {
  if (typeof t == "number" && t > 0 && t > ie(e) - 1)
    throw new ba({
      offset: t,
      position: "start",
      size: ie(e)
    });
}
function Cf(e, t, n) {
  if (typeof t == "number" && typeof n == "number" && ie(e) !== n - t)
    throw new ba({
      offset: n,
      position: "end",
      size: ie(e)
    });
}
function ia(e, t = {}) {
  const { dir: n, size: r = 32 } = t;
  if (r === 0)
    return e;
  const s = e.replace("0x", "");
  if (s.length > r * 2)
    throw new nd({
      size: Math.ceil(s.length / 2),
      targetSize: r,
      type: "Hex"
    });
  return `0x${s[n === "right" ? "padEnd" : "padStart"](r * 2, "0")}`;
}
const Ff = "#__bigint";
function aa(e, t, n) {
  return JSON.stringify(e, (r, s) => typeof s == "bigint" ? s.toString() + Ff : s, n);
}
const zf = /* @__PURE__ */ new TextDecoder(), Mf = /* @__PURE__ */ new TextEncoder();
function Uf(e) {
  return e instanceof Uint8Array ? e : typeof e == "string" ? ca(e) : jf(e);
}
function jf(e) {
  return e instanceof Uint8Array ? e : new Uint8Array(e);
}
function ca(e, t = {}) {
  const { size: n } = t;
  let r = e;
  n && (Xn(e, n), r = nt(e, n));
  let s = r.slice(2);
  s.length % 2 && (s = `0${s}`);
  const o = s.length / 2, i = new Uint8Array(o);
  for (let a = 0, c = 0; a < o; a++) {
    const u = Io(s.charCodeAt(c++)), f = Io(s.charCodeAt(c++));
    if (u === void 0 || f === void 0)
      throw new j(`Invalid byte sequence ("${s[c - 2]}${s[c - 1]}" in "${s}").`);
    i[a] = u << 4 | f;
  }
  return i;
}
function Lf(e, t = {}) {
  const { size: n } = t, r = Mf.encode(e);
  return typeof n == "number" ? (xn(r, n), _f(r, n)) : r;
}
function _f(e, t) {
  return Of(e, { dir: "right", size: t });
}
function ht(e) {
  return e.length;
}
function Gf(e, t, n, r = {}) {
  const { strict: s } = r;
  return e.slice(t, n);
}
function Df(e, t = {}) {
  const { size: n } = t;
  typeof n < "u" && xn(e, n);
  const r = me(e, t);
  return da(r, t);
}
function Hf(e, t = {}) {
  const { size: n } = t;
  let r = e;
  if (typeof n < "u" && (xn(r, n), r = ua(r)), r.length > 1 || r[0] > 1)
    throw new Wf(r);
  return !!r[0];
}
function Oe(e, t = {}) {
  const { size: n } = t;
  typeof n < "u" && xn(e, n);
  const r = me(e, t);
  return la(r, t);
}
function qf(e, t = {}) {
  const { size: n } = t;
  let r = e;
  return typeof n < "u" && (xn(r, n), r = Vf(r)), zf.decode(r);
}
function ua(e) {
  return oa(e, { dir: "left" });
}
function Vf(e) {
  return oa(e, { dir: "right" });
}
class Wf extends j {
  constructor(t) {
    super(`Bytes value \`${t}\` is not a valid boolean.`, {
      metaMessages: [
        "The bytes array must contain a single byte of either a `0` or `1` value."
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Bytes.InvalidBytesBooleanError"
    });
  }
}
let Zf = class extends j {
  constructor({ givenSize: t, maxSize: n }) {
    super(`Size cannot exceed \`${n}\` bytes. Given size: \`${t}\` bytes.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Bytes.SizeOverflowError"
    });
  }
}, Kf = class extends j {
  constructor({ size: t, targetSize: n, type: r }) {
    super(`${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (\`${t}\`) exceeds padding size (\`${n}\`).`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Bytes.SizeExceedsPaddingSizeError"
    });
  }
};
const Yf = /* @__PURE__ */ new TextEncoder(), Jf = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Xf(e, t = {}) {
  const { strict: n = !1 } = t;
  if (!e)
    throw new So(e);
  if (typeof e != "string")
    throw new So(e);
  if (n && !/^0x[0-9a-fA-F]*$/.test(e))
    throw new To(e);
  if (!e.startsWith("0x"))
    throw new To(e);
}
function pe(...e) {
  return `0x${e.reduce((t, n) => t + n.replace("0x", ""), "")}`;
}
function Qf(e) {
  return e instanceof Uint8Array ? me(e) : Array.isArray(e) ? me(new Uint8Array(e)) : e;
}
function fa(e, t = {}) {
  const n = `0x${Number(e)}`;
  return typeof t.size == "number" ? (Xn(n, t.size), tt(n, t.size)) : n;
}
function me(e, t = {}) {
  let n = "";
  for (let s = 0; s < e.length; s++)
    n += Jf[e[s]];
  const r = `0x${n}`;
  return typeof t.size == "number" ? (Xn(r, t.size), nt(r, t.size)) : r;
}
function K(e, t = {}) {
  const { signed: n, size: r } = t, s = BigInt(e);
  let o;
  r ? n ? o = (1n << BigInt(r) * 8n - 1n) - 1n : o = 2n ** (BigInt(r) * 8n) - 1n : typeof e == "number" && (o = BigInt(Number.MAX_SAFE_INTEGER));
  const i = typeof o == "bigint" && n ? -o - 1n : 0;
  if (o && s > o || s < i) {
    const u = typeof e == "bigint" ? "n" : "";
    throw new ha({
      max: o ? `${o}${u}` : void 0,
      min: `${i}${u}`,
      signed: n,
      size: r,
      value: `${e}${u}`
    });
  }
  const c = `0x${(n && s < 0 ? BigInt.asUintN(r * 8, BigInt(s)) : s).toString(16)}`;
  return r ? tt(c, r) : c;
}
function Cs(e, t = {}) {
  return me(Yf.encode(e), t);
}
function tt(e, t) {
  return ia(e, { dir: "left", size: t });
}
function nt(e, t) {
  return ia(e, { dir: "right", size: t });
}
function xe(e, t, n, r = {}) {
  const { strict: s } = r;
  Rf(e, t);
  const o = `0x${e.replace("0x", "").slice((t ?? 0) * 2, (n ?? e.length) * 2)}`;
  return s && Cf(o, t, n), o;
}
function ie(e) {
  return Math.ceil((e.length - 2) / 2);
}
function da(e, t = {}) {
  const { signed: n } = t;
  t.size && Xn(e, t.size);
  const r = BigInt(e);
  if (!n)
    return r;
  const s = (e.length - 2) / 2, o = (1n << BigInt(s) * 8n) - 1n, i = o >> 1n;
  return r <= i ? r : r - o - 1n;
}
function la(e, t = {}) {
  const { signed: n, size: r } = t;
  return Number(!n && !r ? e : da(e, t));
}
function ed(e, t = {}) {
  const { strict: n = !1 } = t;
  try {
    return Xf(e, { strict: n }), !0;
  } catch {
    return !1;
  }
}
class ha extends j {
  constructor({ max: t, min: n, signed: r, size: s, value: o }) {
    super(`Number \`${o}\` is not in safe${s ? ` ${s * 8}-bit` : ""}${r ? " signed" : " unsigned"} integer range ${t ? `(\`${n}\` to \`${t}\`)` : `(above \`${n}\`)`}`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Hex.IntegerOutOfRangeError"
    });
  }
}
class So extends j {
  constructor(t) {
    super(`Value \`${typeof t == "object" ? aa(t) : t}\` of type \`${typeof t}\` is an invalid hex type.`, {
      metaMessages: ['Hex types must be represented as `"0x${string}"`.']
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Hex.InvalidHexTypeError"
    });
  }
}
class To extends j {
  constructor(t) {
    super(`Value \`${t}\` is an invalid hex value.`, {
      metaMessages: [
        'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).'
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Hex.InvalidHexValueError"
    });
  }
}
class td extends j {
  constructor({ givenSize: t, maxSize: n }) {
    super(`Size cannot exceed \`${n}\` bytes. Given size: \`${t}\` bytes.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Hex.SizeOverflowError"
    });
  }
}
class ba extends j {
  constructor({ offset: t, position: n, size: r }) {
    super(`Slice ${n === "start" ? "starting" : "ending"} at offset \`${t}\` is out-of-bounds (size: \`${r}\`).`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Hex.SliceOffsetOutOfBoundsError"
    });
  }
}
class nd extends j {
  constructor({ size: t, targetSize: n, type: r }) {
    super(`${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (\`${t}\`) exceeds padding size (\`${n}\`).`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Hex.SizeExceedsPaddingSizeError"
    });
  }
}
function rd(e) {
  return {
    address: e.address,
    amount: K(e.amount),
    index: K(e.index),
    validatorIndex: K(e.validatorIndex)
  };
}
function pa(e) {
  return {
    ...typeof e.baseFeePerGas == "bigint" && {
      baseFeePerGas: K(e.baseFeePerGas)
    },
    ...typeof e.blobBaseFee == "bigint" && {
      blobBaseFee: K(e.blobBaseFee)
    },
    ...typeof e.feeRecipient == "string" && {
      feeRecipient: e.feeRecipient
    },
    ...typeof e.gasLimit == "bigint" && {
      gasLimit: K(e.gasLimit)
    },
    ...typeof e.number == "bigint" && {
      number: K(e.number)
    },
    ...typeof e.prevRandao == "bigint" && {
      prevRandao: K(e.prevRandao)
    },
    ...typeof e.time == "bigint" && {
      time: K(e.time)
    },
    ...e.withdrawals && {
      withdrawals: e.withdrawals.map(rd)
    }
  };
}
const At = [
  {
    inputs: [
      {
        components: [
          {
            name: "target",
            type: "address"
          },
          {
            name: "allowFailure",
            type: "bool"
          },
          {
            name: "callData",
            type: "bytes"
          }
        ],
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "aggregate3",
    outputs: [
      {
        components: [
          {
            name: "success",
            type: "bool"
          },
          {
            name: "returnData",
            type: "bytes"
          }
        ],
        name: "returnData",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        name: "addr",
        type: "address"
      }
    ],
    name: "getEthBalance",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
], Zr = [
  {
    name: "query",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        type: "tuple[]",
        name: "queries",
        components: [
          {
            type: "address",
            name: "sender"
          },
          {
            type: "string[]",
            name: "urls"
          },
          {
            type: "bytes",
            name: "data"
          }
        ]
      }
    ],
    outputs: [
      {
        type: "bool[]",
        name: "failures"
      },
      {
        type: "bytes[]",
        name: "responses"
      }
    ]
  },
  {
    name: "HttpError",
    type: "error",
    inputs: [
      {
        type: "uint16",
        name: "status"
      },
      {
        type: "string",
        name: "message"
      }
    ]
  }
], ma = [
  {
    inputs: [
      {
        name: "dns",
        type: "bytes"
      }
    ],
    name: "DNSDecodingFailed",
    type: "error"
  },
  {
    inputs: [
      {
        name: "ens",
        type: "string"
      }
    ],
    name: "DNSEncodingFailed",
    type: "error"
  },
  {
    inputs: [],
    name: "EmptyAddress",
    type: "error"
  },
  {
    inputs: [
      {
        name: "status",
        type: "uint16"
      },
      {
        name: "message",
        type: "string"
      }
    ],
    name: "HttpError",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidBatchGatewayResponse",
    type: "error"
  },
  {
    inputs: [
      {
        name: "errorData",
        type: "bytes"
      }
    ],
    name: "ResolverError",
    type: "error"
  },
  {
    inputs: [
      {
        name: "name",
        type: "bytes"
      },
      {
        name: "resolver",
        type: "address"
      }
    ],
    name: "ResolverNotContract",
    type: "error"
  },
  {
    inputs: [
      {
        name: "name",
        type: "bytes"
      }
    ],
    name: "ResolverNotFound",
    type: "error"
  },
  {
    inputs: [
      {
        name: "primary",
        type: "string"
      },
      {
        name: "primaryAddress",
        type: "bytes"
      }
    ],
    name: "ReverseAddressMismatch",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4"
      }
    ],
    name: "UnsupportedResolverProfile",
    type: "error"
  }
], ya = [
  ...ma,
  {
    name: "resolveWithGateways",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "bytes" },
      { name: "data", type: "bytes" },
      { name: "gateways", type: "string[]" }
    ],
    outputs: [
      { name: "", type: "bytes" },
      { name: "address", type: "address" }
    ]
  }
], sd = [
  ...ma,
  {
    name: "reverseWithGateways",
    type: "function",
    stateMutability: "view",
    inputs: [
      { type: "bytes", name: "reverseName" },
      { type: "uint256", name: "coinType" },
      { type: "string[]", name: "gateways" }
    ],
    outputs: [
      { type: "string", name: "resolvedName" },
      { type: "address", name: "resolver" },
      { type: "address", name: "reverseResolver" }
    ]
  }
], ko = [
  {
    name: "text",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "bytes32" },
      { name: "key", type: "string" }
    ],
    outputs: [{ name: "", type: "string" }]
  }
], No = [
  {
    name: "addr",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "name", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }]
  },
  {
    name: "addr",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "bytes32" },
      { name: "coinType", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bytes" }]
  }
], ga = [
  {
    name: "isValidSignature",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "hash", type: "bytes32" },
      { name: "signature", type: "bytes" }
    ],
    outputs: [{ name: "", type: "bytes4" }]
  }
], Oo = [
  {
    inputs: [
      {
        name: "_signer",
        type: "address"
      },
      {
        name: "_hash",
        type: "bytes32"
      },
      {
        name: "_signature",
        type: "bytes"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        name: "_signer",
        type: "address"
      },
      {
        name: "_hash",
        type: "bytes32"
      },
      {
        name: "_signature",
        type: "bytes"
      }
    ],
    outputs: [
      {
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "isValidSig"
  }
], od = "0x82ad56cb", wa = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe", id = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe", ad = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572", Fs = "0x608060405234801561001057600080fd5b506115b9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e14610325578063bce38bd714610350578063c3077fa914610380578063ee82ac5e146103b2576100f3565b80634d2301cc1461026257806372425d9d1461029f57806382ad56cb146102ca57806386d516e8146102fa576100f3565b80633408e470116100c65780633408e470146101af578063399542e9146101da5780633e64a6961461020c57806342cbb15c14610237576100f3565b80630f28c97d146100f8578063174dea7114610123578063252dba421461015357806327e86d6e14610184575b600080fd5b34801561010457600080fd5b5061010d6103ef565b60405161011a9190610c0a565b60405180910390f35b61013d60048036038101906101389190610c94565b6103f7565b60405161014a9190610e94565b60405180910390f35b61016d60048036038101906101689190610f0c565b610615565b60405161017b92919061101b565b60405180910390f35b34801561019057600080fd5b506101996107ab565b6040516101a69190611064565b60405180910390f35b3480156101bb57600080fd5b506101c46107b7565b6040516101d19190610c0a565b60405180910390f35b6101f460048036038101906101ef91906110ab565b6107bf565b6040516102039392919061110b565b60405180910390f35b34801561021857600080fd5b506102216107e1565b60405161022e9190610c0a565b60405180910390f35b34801561024357600080fd5b5061024c6107e9565b6040516102599190610c0a565b60405180910390f35b34801561026e57600080fd5b50610289600480360381019061028491906111a7565b6107f1565b6040516102969190610c0a565b60405180910390f35b3480156102ab57600080fd5b506102b4610812565b6040516102c19190610c0a565b60405180910390f35b6102e460048036038101906102df919061122a565b61081a565b6040516102f19190610e94565b60405180910390f35b34801561030657600080fd5b5061030f6109e4565b60405161031c9190610c0a565b60405180910390f35b34801561033157600080fd5b5061033a6109ec565b6040516103479190611286565b60405180910390f35b61036a600480360381019061036591906110ab565b6109f4565b6040516103779190610e94565b60405180910390f35b61039a60048036038101906103959190610f0c565b610ba6565b6040516103a99392919061110b565b60405180910390f35b3480156103be57600080fd5b506103d960048036038101906103d491906112cd565b610bca565b6040516103e69190611064565b60405180910390f35b600042905090565b60606000808484905090508067ffffffffffffffff81111561041c5761041b6112fa565b5b60405190808252806020026020018201604052801561045557816020015b610442610bd5565b81526020019060019003908161043a5790505b5092503660005b828110156105c957600085828151811061047957610478611329565b5b6020026020010151905087878381811061049657610495611329565b5b90506020028101906104a89190611367565b925060008360400135905080860195508360000160208101906104cb91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16818580606001906104f2919061138f565b604051610500929190611431565b60006040518083038185875af1925050503d806000811461053d576040519150601f19603f3d011682016040523d82523d6000602084013e610542565b606091505b5083600001846020018290528215151515815250505081516020850135176105bc577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b826001019250505061045c565b5082341461060c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610603906114a7565b60405180910390fd5b50505092915050565b6000606043915060008484905090508067ffffffffffffffff81111561063e5761063d6112fa565b5b60405190808252806020026020018201604052801561067157816020015b606081526020019060019003908161065c5790505b5091503660005b828110156107a157600087878381811061069557610694611329565b5b90506020028101906106a791906114c7565b92508260000160208101906106bc91906111a7565b73ffffffffffffffffffffffffffffffffffffffff168380602001906106e2919061138f565b6040516106f0929190611431565b6000604051808303816000865af19150503d806000811461072d576040519150601f19603f3d011682016040523d82523d6000602084013e610732565b606091505b5086848151811061074657610745611329565b5b60200260200101819052819250505080610795576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078c9061153b565b60405180910390fd5b81600101915050610678565b5050509250929050565b60006001430340905090565b600046905090565b6000806060439250434091506107d68686866109f4565b905093509350939050565b600048905090565b600043905090565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600044905090565b606060008383905090508067ffffffffffffffff81111561083e5761083d6112fa565b5b60405190808252806020026020018201604052801561087757816020015b610864610bd5565b81526020019060019003908161085c5790505b5091503660005b828110156109db57600084828151811061089b5761089a611329565b5b602002602001015190508686838181106108b8576108b7611329565b5b90506020028101906108ca919061155b565b92508260000160208101906108df91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060400190610905919061138f565b604051610913929190611431565b6000604051808303816000865af19150503d8060008114610950576040519150601f19603f3d011682016040523d82523d6000602084013e610955565b606091505b5082600001836020018290528215151515815250505080516020840135176109cf577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b8160010191505061087e565b50505092915050565b600045905090565b600041905090565b606060008383905090508067ffffffffffffffff811115610a1857610a176112fa565b5b604051908082528060200260200182016040528015610a5157816020015b610a3e610bd5565b815260200190600190039081610a365790505b5091503660005b82811015610b9c576000848281518110610a7557610a74611329565b5b60200260200101519050868683818110610a9257610a91611329565b5b9050602002810190610aa491906114c7565b9250826000016020810190610ab991906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060200190610adf919061138f565b604051610aed929190611431565b6000604051808303816000865af19150503d8060008114610b2a576040519150601f19603f3d011682016040523d82523d6000602084013e610b2f565b606091505b508260000183602001829052821515151581525050508715610b90578060000151610b8f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b869061153b565b60405180910390fd5b5b81600101915050610a58565b5050509392505050565b6000806060610bb7600186866107bf565b8093508194508295505050509250925092565b600081409050919050565b6040518060400160405280600015158152602001606081525090565b6000819050919050565b610c0481610bf1565b82525050565b6000602082019050610c1f6000830184610bfb565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610c5457610c53610c2f565b5b8235905067ffffffffffffffff811115610c7157610c70610c34565b5b602083019150836020820283011115610c8d57610c8c610c39565b5b9250929050565b60008060208385031215610cab57610caa610c25565b5b600083013567ffffffffffffffff811115610cc957610cc8610c2a565b5b610cd585828601610c3e565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008115159050919050565b610d2281610d0d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d62578082015181840152602081019050610d47565b83811115610d71576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d9382610d28565b610d9d8185610d33565b9350610dad818560208601610d44565b610db681610d77565b840191505092915050565b6000604083016000830151610dd96000860182610d19565b5060208301518482036020860152610df18282610d88565b9150508091505092915050565b6000610e0a8383610dc1565b905092915050565b6000602082019050919050565b6000610e2a82610ce1565b610e348185610cec565b935083602082028501610e4685610cfd565b8060005b85811015610e825784840389528151610e638582610dfe565b9450610e6e83610e12565b925060208a01995050600181019050610e4a565b50829750879550505050505092915050565b60006020820190508181036000830152610eae8184610e1f565b905092915050565b60008083601f840112610ecc57610ecb610c2f565b5b8235905067ffffffffffffffff811115610ee957610ee8610c34565b5b602083019150836020820283011115610f0557610f04610c39565b5b9250929050565b60008060208385031215610f2357610f22610c25565b5b600083013567ffffffffffffffff811115610f4157610f40610c2a565b5b610f4d85828601610eb6565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000610f918383610d88565b905092915050565b6000602082019050919050565b6000610fb182610f59565b610fbb8185610f64565b935083602082028501610fcd85610f75565b8060005b858110156110095784840389528151610fea8582610f85565b9450610ff583610f99565b925060208a01995050600181019050610fd1565b50829750879550505050505092915050565b60006040820190506110306000830185610bfb565b81810360208301526110428184610fa6565b90509392505050565b6000819050919050565b61105e8161104b565b82525050565b60006020820190506110796000830184611055565b92915050565b61108881610d0d565b811461109357600080fd5b50565b6000813590506110a58161107f565b92915050565b6000806000604084860312156110c4576110c3610c25565b5b60006110d286828701611096565b935050602084013567ffffffffffffffff8111156110f3576110f2610c2a565b5b6110ff86828701610eb6565b92509250509250925092565b60006060820190506111206000830186610bfb565b61112d6020830185611055565b818103604083015261113f8184610e1f565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061117482611149565b9050919050565b61118481611169565b811461118f57600080fd5b50565b6000813590506111a18161117b565b92915050565b6000602082840312156111bd576111bc610c25565b5b60006111cb84828501611192565b91505092915050565b60008083601f8401126111ea576111e9610c2f565b5b8235905067ffffffffffffffff81111561120757611206610c34565b5b60208301915083602082028301111561122357611222610c39565b5b9250929050565b6000806020838503121561124157611240610c25565b5b600083013567ffffffffffffffff81111561125f5761125e610c2a565b5b61126b858286016111d4565b92509250509250929050565b61128081611169565b82525050565b600060208201905061129b6000830184611277565b92915050565b6112aa81610bf1565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2610c25565b5b60006112f1848285016112b8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008235600160800383360303811261138357611382611358565b5b80830191505092915050565b600080833560016020038436030381126113ac576113ab611358565b5b80840192508235915067ffffffffffffffff8211156113ce576113cd61135d565b5b6020830192506001820236038313156113ea576113e9611362565b5b509250929050565b600081905092915050565b82818337600083830152505050565b600061141883856113f2565b93506114258385846113fd565b82840190509392505050565b600061143e82848661140c565b91508190509392505050565b600082825260208201905092915050565b7f4d756c746963616c6c333a2076616c7565206d69736d61746368000000000000600082015250565b6000611491601a8361144a565b915061149c8261145b565b602082019050919050565b600060208201905081810360008301526114c081611484565b9050919050565b6000823560016040038336030381126114e3576114e2611358565b5b80830191505092915050565b7f4d756c746963616c6c333a2063616c6c206661696c6564000000000000000000600082015250565b600061152560178361144a565b9150611530826114ef565b602082019050919050565b6000602082019050818103600083015261155481611518565b9050919050565b60008235600160600383360303811261157757611576611358565b5b8083019150509291505056fea264697066735822122020c1bc9aacf8e4a6507193432a895a8e77094f45a1395583f07b24e860ef06cd64736f6c634300080c0033";
class Kr extends $ {
  constructor({ blockNumber: t, chain: n, contract: r }) {
    super(`Chain "${n.name}" does not support contract "${r.name}".`, {
      metaMessages: [
        "This could be due to any of the following:",
        ...t && r.blockCreated && r.blockCreated > t ? [
          `- The contract "${r.name}" was not deployed until block ${r.blockCreated} (current block ${t}).`
        ] : [
          `- The chain does not have the contract "${r.name}" configured.`
        ]
      ],
      name: "ChainDoesNotSupportContract"
    });
  }
}
class xa extends $ {
  constructor() {
    super("No chain was provided to the Client.", {
      name: "ClientChainNotConfiguredError"
    });
  }
}
const mr = "/docs/contract/encodeDeployData";
function zs(e) {
  const { abi: t, args: n, bytecode: r } = e;
  if (!n || n.length === 0)
    return r;
  const s = t.find((i) => "type" in i && i.type === "constructor");
  if (!s)
    throw new nu({ docsPath: mr });
  if (!("inputs" in s))
    throw new to({ docsPath: mr });
  if (!s.inputs || s.inputs.length === 0)
    throw new to({ docsPath: mr });
  const o = st(s.inputs, n);
  return St([r, o]);
}
function kt({ blockNumber: e, chain: t, contract: n }) {
  const r = t?.contracts?.[n];
  if (!r)
    throw new Kr({
      chain: t,
      contract: { name: n }
    });
  if (e && r.blockCreated && r.blockCreated > e)
    throw new Kr({
      blockNumber: e,
      chain: t,
      contract: {
        name: n,
        blockCreated: r.blockCreated
      }
    });
  return r.address;
}
function va(e, { docsPath: t, ...n }) {
  const r = (() => {
    const s = Zn(e, n);
    return s instanceof mn ? e : s;
  })();
  return new Fi(r, {
    docsPath: t,
    ...n
  });
}
function Ea() {
  let e = () => {
  }, t = () => {
  };
  return { promise: new Promise((r, s) => {
    e = r, t = s;
  }), resolve: e, reject: t };
}
const yr = /* @__PURE__ */ new Map();
function Pa({ fn: e, id: t, shouldSplitBatch: n, wait: r = 0, sort: s }) {
  const o = async () => {
    const f = c();
    i();
    const d = f.map(({ args: l }) => l);
    d.length !== 0 && e(d).then((l) => {
      s && Array.isArray(l) && l.sort(s);
      for (let h = 0; h < f.length; h++) {
        const { resolve: p } = f[h];
        p?.([l[h], l]);
      }
    }).catch((l) => {
      for (let h = 0; h < f.length; h++) {
        const { reject: p } = f[h];
        p?.(l);
      }
    });
  }, i = () => yr.delete(t), a = () => c().map(({ args: f }) => f), c = () => yr.get(t) || [], u = (f) => yr.set(t, [...c(), f]);
  return {
    flush: i,
    async schedule(f) {
      const { promise: d, resolve: l, reject: h } = Ea();
      return n?.([...a(), f]) && o(), c().length > 0 ? (u({ args: f, resolve: l, reject: h }), d) : (u({ args: f, resolve: l, reject: h }), setTimeout(o, r), d);
    }
  };
}
async function vn(e, t) {
  const { account: n = e.account, authorizationList: r, batch: s = !!e.batch?.multicall, blockNumber: o, blockTag: i = e.experimental_blockTag ?? "latest", accessList: a, blobs: c, blockOverrides: u, code: f, data: d, factory: l, factoryData: h, gas: p, gasPrice: m, maxFeePerBlobGas: E, maxFeePerGas: g, maxPriorityFeePerGas: P, nonce: w, to: b, value: y, stateOverride: A, ...x } = t, B = n ? oe(n) : void 0;
  if (f && (l || h))
    throw new $("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
  if (f && b)
    throw new $("Cannot provide both `code` & `to` as parameters.");
  const N = f && d, v = l && h && b && d, k = N || v, O = N ? Aa({
    code: f,
    data: d
  }) : v ? fd({
    data: d,
    factory: l,
    factoryData: h,
    to: b
  }) : d;
  try {
    Tt(t);
    const U = (typeof o == "bigint" ? M(o) : void 0) || i, S = u ? pa(u) : void 0, I = Es(A), F = e.chain?.formatters?.transactionRequest?.format, C = (F || yn)({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...Kn(x, { format: F }),
      accessList: a,
      account: B,
      authorizationList: r,
      blobs: c,
      data: O,
      gas: p,
      gasPrice: m,
      maxFeePerBlobGas: E,
      maxFeePerGas: g,
      maxPriorityFeePerGas: P,
      nonce: w,
      to: k ? void 0 : b,
      value: y
    }, "call");
    if (s && cd({ request: C }) && !I && !S)
      try {
        return await ud(e, {
          ...C,
          blockNumber: o,
          blockTag: i
        });
      } catch (G) {
        if (!(G instanceof xa) && !(G instanceof Kr))
          throw G;
      }
    const L = (() => {
      const G = [
        C,
        U
      ];
      return I && S ? [...G, I, S] : I ? [...G, I] : S ? [...G, {}, S] : G;
    })(), _ = await e.request({
      method: "eth_call",
      params: L
    });
    return _ === "0x" ? { data: void 0 } : { data: _ };
  } catch (R) {
    const U = dd(R), { offchainLookup: S, offchainLookupSignature: I } = await import("./ccip-EYEu8Aj5.js");
    if (e.ccipRead !== !1 && U?.slice(0, 10) === I && b)
      return { data: await S(e, { data: U, to: b }) };
    throw k && U?.slice(0, 10) === "0x101bb98d" ? new j0({ factory: l }) : va(R, {
      ...t,
      account: B,
      chain: e.chain
    });
  }
}
function cd({ request: e }) {
  const { data: t, to: n, ...r } = e;
  return !(!t || t.startsWith(od) || !n || Object.values(r).filter((s) => typeof s < "u").length > 0);
}
async function ud(e, t) {
  const { batchSize: n = 1024, deployless: r = !1, wait: s = 0 } = typeof e.batch?.multicall == "object" ? e.batch.multicall : {}, { blockNumber: o, blockTag: i = e.experimental_blockTag ?? "latest", data: a, to: c } = t, u = (() => {
    if (r)
      return null;
    if (t.multicallAddress)
      return t.multicallAddress;
    if (e.chain)
      return kt({
        blockNumber: o,
        chain: e.chain,
        contract: "multicall3"
      });
    throw new xa();
  })(), d = (typeof o == "bigint" ? M(o) : void 0) || i, { schedule: l } = Pa({
    id: `${e.uid}.${d}`,
    wait: s,
    shouldSplitBatch(m) {
      return m.reduce((g, { data: P }) => g + (P.length - 2), 0) > n * 2;
    },
    fn: async (m) => {
      const E = m.map((w) => ({
        allowFailure: !0,
        callData: w.data,
        target: w.to
      })), g = fe({
        abi: At,
        args: [E],
        functionName: "aggregate3"
      }), P = await e.request({
        method: "eth_call",
        params: [
          {
            ...u === null ? {
              data: Aa({
                code: Fs,
                data: g
              })
            } : { to: u, data: g }
          },
          d
        ]
      });
      return He({
        abi: At,
        args: [E],
        functionName: "aggregate3",
        data: P || "0x"
      });
    }
  }), [{ returnData: h, success: p }] = await l({ data: a, to: c });
  if (!p)
    throw new Wn({ data: h });
  return h === "0x" ? { data: void 0 } : { data: h };
}
function Aa(e) {
  const { code: t, data: n } = e;
  return zs({
    abi: oi(["constructor(bytes, bytes)"]),
    bytecode: wa,
    args: [t, n]
  });
}
function fd(e) {
  const { data: t, factory: n, factoryData: r, to: s } = e;
  return zs({
    abi: oi(["constructor(address, bytes, address, bytes)"]),
    bytecode: id,
    args: [s, t, n, r]
  });
}
function dd(e) {
  if (!(e instanceof $))
    return;
  const t = e.walk();
  return typeof t?.data == "object" ? t.data?.data : t.data;
}
async function ye(e, t) {
  const { abi: n, address: r, args: s, functionName: o, ...i } = t, a = fe({
    abi: n,
    args: s,
    functionName: o
  });
  try {
    const { data: c } = await z(e, vn, "call")({
      ...i,
      data: a,
      to: r
    });
    return He({
      abi: n,
      args: s,
      functionName: o,
      data: c || "0x"
    });
  } catch (c) {
    throw Pt(c, {
      abi: n,
      address: r,
      args: s,
      docsPath: "/docs/contract/readContract",
      functionName: o
    });
  }
}
async function ld(e, t) {
  const { abi: n, address: r, args: s, functionName: o, dataSuffix: i = typeof e.dataSuffix == "string" ? e.dataSuffix : e.dataSuffix?.value, ...a } = t, c = a.account ? oe(a.account) : e.account, u = fe({ abi: n, args: s, functionName: o });
  try {
    const { data: f } = await z(e, vn, "call")({
      batch: !1,
      data: `${u}${i ? i.replace("0x", "") : ""}`,
      to: r,
      ...a,
      account: c
    }), d = He({
      abi: n,
      args: s,
      functionName: o,
      data: f || "0x"
    }), l = n.filter((h) => "name" in h && h.name === t.functionName);
    return {
      result: d,
      request: {
        abi: l,
        address: r,
        args: s,
        dataSuffix: i,
        functionName: o,
        ...a,
        account: c
      }
    };
  } catch (f) {
    throw Pt(f, {
      abi: n,
      address: r,
      args: s,
      docsPath: "/docs/contract/simulateContract",
      functionName: o,
      sender: c?.address
    });
  }
}
const gr = /* @__PURE__ */ new Map(), Ro = /* @__PURE__ */ new Map();
let hd = 0;
function De(e, t, n) {
  const r = ++hd, s = () => gr.get(e) || [], o = () => {
    const f = s();
    gr.set(e, f.filter((d) => d.id !== r));
  }, i = () => {
    const f = s();
    if (!f.some((l) => l.id === r))
      return;
    const d = Ro.get(e);
    if (f.length === 1 && d) {
      const l = d();
      l instanceof Promise && l.catch(() => {
      });
    }
    o();
  }, a = s();
  if (gr.set(e, [
    ...a,
    { id: r, fns: t }
  ]), a && a.length > 0)
    return i;
  const c = {};
  for (const f in t)
    c[f] = ((...d) => {
      const l = s();
      if (l.length !== 0)
        for (const h of l)
          h.fns[f]?.(...d);
    });
  const u = n(c);
  return typeof u == "function" && Ro.set(e, u), i;
}
async function Yr(e) {
  return new Promise((t) => setTimeout(t, e));
}
function En(e, { emitOnBegin: t, initialWaitTime: n, interval: r }) {
  let s = !0;
  const o = () => s = !1;
  return (async () => {
    let a;
    t && (a = await e({ unpoll: o }));
    const c = await n?.(a) ?? r;
    await Yr(c);
    const u = async () => {
      s && (await e({ unpoll: o }), await Yr(r), u());
    };
    u();
  })(), o;
}
const bd = /* @__PURE__ */ new Map(), pd = /* @__PURE__ */ new Map();
function md(e) {
  const t = (s, o) => ({
    clear: () => o.delete(s),
    get: () => o.get(s),
    set: (i) => o.set(s, i)
  }), n = t(e, bd), r = t(e, pd);
  return {
    clear: () => {
      n.clear(), r.clear();
    },
    promise: n,
    response: r
  };
}
async function yd(e, { cacheKey: t, cacheTime: n = Number.POSITIVE_INFINITY }) {
  const r = md(t), s = r.response.get();
  if (s && n > 0 && Date.now() - s.created.getTime() < n)
    return s.data;
  let o = r.promise.get();
  o || (o = e(), r.promise.set(o));
  try {
    const i = await o;
    return r.response.set({ created: /* @__PURE__ */ new Date(), data: i }), i;
  } finally {
    r.promise.clear();
  }
}
const gd = (e) => `blockNumber.${e}`;
async function Pn(e, { cacheTime: t = e.cacheTime } = {}) {
  const n = await yd(() => e.request({
    method: "eth_blockNumber"
  }), { cacheKey: gd(e.uid), cacheTime: t });
  return BigInt(n);
}
async function Qn(e, { filter: t }) {
  const n = "strict" in t && t.strict, r = await t.request({
    method: "eth_getFilterChanges",
    params: [t.id]
  });
  if (typeof r[0] == "string")
    return r;
  const s = r.map((o) => $e(o));
  return !("abi" in t) || !t.abi ? s : Ts({
    abi: t.abi,
    logs: s,
    strict: n
  });
}
async function er(e, { filter: t }) {
  return t.request({
    method: "eth_uninstallFilter",
    params: [t.id]
  });
}
function wd(e, t) {
  const { abi: n, address: r, args: s, batch: o = !0, eventName: i, fromBlock: a, onError: c, onLogs: u, poll: f, pollingInterval: d = e.pollingInterval, strict: l } = t;
  return (typeof f < "u" ? f : typeof a == "bigint" ? !0 : !(e.transport.type === "webSocket" || e.transport.type === "ipc" || e.transport.type === "fallback" && (e.transport.transports[0].config.type === "webSocket" || e.transport.transports[0].config.type === "ipc"))) ? (() => {
    const E = l ?? !1, g = W([
      "watchContractEvent",
      r,
      s,
      o,
      e.uid,
      i,
      d,
      E,
      a
    ]);
    return De(g, { onLogs: u, onError: c }, (P) => {
      let w;
      a !== void 0 && (w = a - 1n);
      let b, y = !1;
      const A = En(async () => {
        if (!y) {
          try {
            b = await z(e, Si, "createContractEventFilter")({
              abi: n,
              address: r,
              args: s,
              eventName: i,
              strict: E,
              fromBlock: a
            });
          } catch {
          }
          y = !0;
          return;
        }
        try {
          let x;
          if (b)
            x = await z(e, Qn, "getFilterChanges")({ filter: b });
          else {
            const B = await z(e, Pn, "getBlockNumber")({});
            w && w < B ? x = await z(e, Qi, "getContractEvents")({
              abi: n,
              address: r,
              args: s,
              eventName: i,
              fromBlock: w + 1n,
              toBlock: B,
              strict: E
            }) : x = [], w = B;
          }
          if (x.length === 0)
            return;
          if (o)
            P.onLogs(x);
          else
            for (const B of x)
              P.onLogs([B]);
        } catch (x) {
          b && x instanceof Ge && (y = !1), P.onError?.(x);
        }
      }, {
        emitOnBegin: !0,
        interval: d
      });
      return async () => {
        b && await z(e, er, "uninstallFilter")({ filter: b }), A();
      };
    });
  })() : (() => {
    const E = l ?? !1, g = W([
      "watchContractEvent",
      r,
      s,
      o,
      e.uid,
      i,
      d,
      E
    ]);
    let P = !0, w = () => P = !1;
    return De(g, { onLogs: u, onError: c }, (b) => ((async () => {
      try {
        const y = (() => {
          if (e.transport.type === "fallback") {
            const B = e.transport.transports.find((N) => N.config.type === "webSocket" || N.config.type === "ipc");
            return B ? B.value : e.transport;
          }
          return e.transport;
        })(), A = i ? hn({
          abi: n,
          eventName: i,
          args: s
        }) : [], { unsubscribe: x } = await y.subscribe({
          params: ["logs", { address: r, topics: A }],
          onData(B) {
            if (!P)
              return;
            const N = B.result;
            try {
              const { eventName: v, args: k } = Fn({
                abi: n,
                data: N.data,
                topics: N.topics,
                strict: l
              }), O = $e(N, {
                args: k,
                eventName: v
              });
              b.onLogs([O]);
            } catch (v) {
              let k, O;
              if (v instanceof Nn || v instanceof ds) {
                if (l)
                  return;
                k = v.abiItem.name, O = v.abiItem.inputs?.some((U) => !("name" in U && U.name));
              }
              const R = $e(N, {
                args: O ? [] : {},
                eventName: k
              });
              b.onLogs([R]);
            }
          },
          onError(B) {
            b.onError?.(B);
          }
        });
        w = x, P || w();
      } catch (y) {
        c?.(y);
      }
    })(), () => w()));
  })();
}
async function xd(e, { serializedTransaction: t }) {
  return e.request({
    method: "eth_sendRawTransaction",
    params: [t]
  }, { retryCount: 0 });
}
function Jr(e, { delay: t = 100, retryCount: n = 2, shouldRetry: r = () => !0 } = {}) {
  return new Promise((s, o) => {
    const i = async ({ count: a = 0 } = {}) => {
      const c = async ({ error: u }) => {
        const f = typeof t == "function" ? t({ count: a, error: u }) : t;
        f && await Yr(f), i({ count: a + 1 });
      };
      try {
        const u = await e();
        s(u);
      } catch (u) {
        if (a < n && await r({ count: a, error: u }))
          return c({ error: u });
        o(u);
      }
    };
    i();
  });
}
const vd = {
  "0x0": "reverted",
  "0x1": "success"
};
function $a(e, t) {
  const n = {
    ...e,
    blockNumber: e.blockNumber ? BigInt(e.blockNumber) : null,
    contractAddress: e.contractAddress ? e.contractAddress : null,
    cumulativeGasUsed: e.cumulativeGasUsed ? BigInt(e.cumulativeGasUsed) : null,
    effectiveGasPrice: e.effectiveGasPrice ? BigInt(e.effectiveGasPrice) : null,
    gasUsed: e.gasUsed ? BigInt(e.gasUsed) : null,
    logs: e.logs ? e.logs.map((r) => $e(r)) : null,
    to: e.to ? e.to : null,
    transactionIndex: e.transactionIndex ? Ce(e.transactionIndex) : null,
    status: e.status ? vd[e.status] : null,
    type: e.type ? Gi[e.type] || e.type : null
  };
  return e.blobGasPrice && (n.blobGasPrice = BigInt(e.blobGasPrice)), e.blobGasUsed && (n.blobGasUsed = BigInt(e.blobGasUsed)), n;
}
const Xr = 256;
let Bn = Xr, In;
function Ba(e = 11) {
  if (!In || Bn + e > Xr * 2) {
    In = "", Bn = 0;
    for (let t = 0; t < Xr; t++)
      In += (256 + Math.random() * 256 | 0).toString(16).substring(1);
  }
  return In.substring(Bn, Bn++ + e);
}
function Ed(e) {
  const { batch: t, chain: n, ccipRead: r, dataSuffix: s, key: o = "base", name: i = "Base Client", type: a = "base" } = e, c = e.experimental_blockTag ?? (typeof n?.experimental_preconfirmationTime == "number" ? "pending" : void 0), u = n?.blockTime ?? 12e3, f = Math.min(Math.max(Math.floor(u / 2), 500), 4e3), d = e.pollingInterval ?? f, l = e.cacheTime ?? d, h = e.account ? oe(e.account) : void 0, { config: p, request: m, value: E } = e.transport({
    account: h,
    chain: n,
    pollingInterval: d
  }), g = { ...p, ...E }, P = {
    account: h,
    batch: t,
    cacheTime: l,
    ccipRead: r,
    chain: n,
    dataSuffix: s,
    key: o,
    name: i,
    pollingInterval: d,
    request: m,
    transport: g,
    type: a,
    uid: Ba(),
    ...c ? { experimental_blockTag: c } : {}
  };
  function w(b) {
    return (y) => {
      const A = y(b);
      for (const B in P)
        delete A[B];
      const x = { ...b, ...A };
      return Object.assign(x, { extend: w(x) });
    };
  }
  return Object.assign(P, { extend: w(P) });
}
function Ms(e) {
  if (!(e instanceof $))
    return !1;
  const t = e.walk((n) => n instanceof zr);
  return t instanceof zr ? t.data?.errorName === "HttpError" || t.data?.errorName === "ResolverError" || t.data?.errorName === "ResolverNotContract" || t.data?.errorName === "ResolverNotFound" || t.data?.errorName === "ReverseAddressMismatch" || t.data?.errorName === "UnsupportedResolverProfile" : !1;
}
function Pd(e) {
  const { abi: t, data: n } = e, r = Qe(n, 0, 4), s = t.find((o) => o.type === "function" && r === ln(be(o)));
  if (!s)
    throw new uu(r, {
      docsPath: "/docs/contract/decodeFunctionData"
    });
  return {
    functionName: s.name,
    args: "inputs" in s && s.inputs && s.inputs.length > 0 ? bn(s.inputs, Qe(n, 4)) : void 0
  };
}
const wr = "/docs/contract/encodeErrorResult";
function Co(e) {
  const { abi: t, errorName: n, args: r } = e;
  let s = t[0];
  if (n) {
    const c = ot({ abi: t, args: r, name: n });
    if (!c)
      throw new no(n, { docsPath: wr });
    s = c;
  }
  if (s.type !== "error")
    throw new no(void 0, { docsPath: wr });
  const o = be(s), i = ln(o);
  let a = "0x";
  if (r && r.length > 0) {
    if (!s.inputs)
      throw new iu(s.name, { docsPath: wr });
    a = st(s.inputs, r);
  }
  return St([i, a]);
}
const xr = "/docs/contract/encodeFunctionResult";
function Ad(e) {
  const { abi: t, functionName: n, result: r } = e;
  let s = t[0];
  if (n) {
    const i = ot({ abi: t, name: n });
    if (!i)
      throw new wt(n, { docsPath: xr });
    s = i;
  }
  if (s.type !== "function")
    throw new wt(void 0, { docsPath: xr });
  if (!s.outputs)
    throw new fi(s.name, { docsPath: xr });
  const o = (() => {
    if (s.outputs.length === 0)
      return [];
    if (s.outputs.length === 1)
      return [r];
    if (Array.isArray(r))
      return r;
    throw new di(r);
  })();
  return st(s.outputs, o);
}
const tr = "x-batch-gateway:true";
async function $d(e) {
  const { data: t, ccipRequest: n } = e, { args: [r] } = Pd({ abi: Zr, data: t }), s = [], o = [];
  return await Promise.all(r.map(async (i, a) => {
    try {
      o[a] = i.urls.includes(tr) ? await $d({ data: i.data, ccipRequest: n }) : await n(i), s[a] = !1;
    } catch (c) {
      s[a] = !0, o[a] = Bd(c);
    }
  })), Ad({
    abi: Zr,
    functionName: "query",
    result: [s, o]
  });
}
function Bd(e) {
  return e.name === "HttpRequestError" && e.status ? Co({
    abi: Zr,
    errorName: "HttpError",
    args: [e.status, e.shortMessage]
  }) : Co({
    abi: [Ti],
    errorName: "Error",
    args: ["shortMessage" in e ? e.shortMessage : e.message]
  });
}
function Ia(e) {
  if (e.length !== 66 || e.indexOf("[") !== 0 || e.indexOf("]") !== 65)
    return null;
  const t = `0x${e.slice(1, 65)}`;
  return ve(t) ? t : null;
}
function Qr(e) {
  let t = new Uint8Array(32).fill(0);
  if (!e)
    return H(t);
  const n = e.split(".");
  for (let r = n.length - 1; r >= 0; r -= 1) {
    const s = Ia(n[r]), o = s ? It(s) : V(Ye(n[r]), "bytes");
    t = V(Ae([t, o]), "bytes");
  }
  return H(t);
}
function Id(e) {
  return `[${e.slice(2)}]`;
}
function Sd(e) {
  const t = new Uint8Array(32).fill(0);
  return e ? Ia(e) || V(Ye(e)) : H(t);
}
function Us(e) {
  const t = e.replace(/^\.|\.$/gm, "");
  if (t.length === 0)
    return new Uint8Array(1);
  const n = new Uint8Array(Ye(t).byteLength + 2);
  let r = 0;
  const s = t.split(".");
  for (let o = 0; o < s.length; o++) {
    let i = Ye(s[o]);
    i.byteLength > 255 && (i = Ye(Id(Sd(s[o])))), n[r] = i.length, n.set(i, r + 1), r += i.length + 1;
  }
  return n.byteLength !== r + 1 ? n.slice(0, r + 1) : n;
}
async function Td(e, t) {
  const { blockNumber: n, blockTag: r, coinType: s, name: o, gatewayUrls: i, strict: a } = t, { chain: c } = e, u = (() => {
    if (t.universalResolverAddress)
      return t.universalResolverAddress;
    if (!c)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return kt({
      blockNumber: n,
      chain: c,
      contract: "ensUniversalResolver"
    });
  })(), f = c?.ensTlds;
  if (f && !f.some((l) => o.endsWith(l)))
    return null;
  const d = s != null ? [Qr(o), BigInt(s)] : [Qr(o)];
  try {
    const l = fe({
      abi: No,
      functionName: "addr",
      args: d
    }), h = {
      address: u,
      abi: ya,
      functionName: "resolveWithGateways",
      args: [
        Le(Us(o)),
        l,
        i ?? [tr]
      ],
      blockNumber: n,
      blockTag: r
    }, m = await z(e, ye, "readContract")(h);
    if (m[0] === "0x")
      return null;
    const E = He({
      abi: No,
      args: d,
      functionName: "addr",
      data: m[0]
    });
    return E === "0x" || Ke(E) === "0x00" ? null : E;
  } catch (l) {
    if (a)
      throw l;
    if (Ms(l))
      return null;
    throw l;
  }
}
class kd extends $ {
  constructor({ data: t }) {
    super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
      metaMessages: [
        "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
        "",
        `Provided data: ${JSON.stringify(t)}`
      ],
      name: "EnsAvatarInvalidMetadataError"
    });
  }
}
class Ct extends $ {
  constructor({ reason: t }) {
    super(`ENS NFT avatar URI is invalid. ${t}`, {
      name: "EnsAvatarInvalidNftUriError"
    });
  }
}
class js extends $ {
  constructor({ uri: t }) {
    super(`Unable to resolve ENS avatar URI "${t}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
  }
}
class Nd extends $ {
  constructor({ namespace: t }) {
    super(`ENS NFT avatar namespace "${t}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
  }
}
const Od = /(?<protocol>https?:\/\/[^/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/, Rd = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/, Cd = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/, Fd = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
async function zd(e) {
  try {
    const t = await fetch(e, { method: "HEAD" });
    return t.status === 200 ? t.headers.get("content-type")?.startsWith("image/") : !1;
  } catch (t) {
    return typeof t == "object" && typeof t.response < "u" || !Object.hasOwn(globalThis, "Image") ? !1 : new Promise((n) => {
      const r = new Image();
      r.onload = () => {
        n(!0);
      }, r.onerror = () => {
        n(!1);
      }, r.src = e;
    });
  }
}
function Fo(e, t) {
  return e ? e.endsWith("/") ? e.slice(0, -1) : e : t;
}
function Sa({ uri: e, gatewayUrls: t }) {
  const n = Cd.test(e);
  if (n)
    return { uri: e, isOnChain: !0, isEncoded: n };
  const r = Fo(t?.ipfs, "https://ipfs.io"), s = Fo(t?.arweave, "https://arweave.net"), o = e.match(Od), { protocol: i, subpath: a, target: c, subtarget: u = "" } = o?.groups || {}, f = i === "ipns:/" || a === "ipns/", d = i === "ipfs:/" || a === "ipfs/" || Rd.test(e);
  if (e.startsWith("http") && !f && !d) {
    let h = e;
    return t?.arweave && (h = e.replace(/https:\/\/arweave.net/g, t?.arweave)), { uri: h, isOnChain: !1, isEncoded: !1 };
  }
  if ((f || d) && c)
    return {
      uri: `${r}/${f ? "ipns" : "ipfs"}/${c}${u}`,
      isOnChain: !1,
      isEncoded: !1
    };
  if (i === "ar:/" && c)
    return {
      uri: `${s}/${c}${u || ""}`,
      isOnChain: !1,
      isEncoded: !1
    };
  let l = e.replace(Fd, "");
  if (l.startsWith("<svg") && (l = `data:image/svg+xml;base64,${btoa(l)}`), l.startsWith("data:") || l.startsWith("{"))
    return {
      uri: l,
      isOnChain: !0,
      isEncoded: !1
    };
  throw new js({ uri: e });
}
function Ta(e) {
  if (typeof e != "object" || !("image" in e) && !("image_url" in e) && !("image_data" in e))
    throw new kd({ data: e });
  return e.image || e.image_url || e.image_data;
}
async function Md({ gatewayUrls: e, uri: t }) {
  try {
    const n = await fetch(t).then((s) => s.json());
    return await Ls({
      gatewayUrls: e,
      uri: Ta(n)
    });
  } catch {
    throw new js({ uri: t });
  }
}
async function Ls({ gatewayUrls: e, uri: t }) {
  const { uri: n, isOnChain: r } = Sa({ uri: t, gatewayUrls: e });
  if (r || await zd(n))
    return n;
  throw new js({ uri: t });
}
function Ud(e) {
  let t = e;
  t.startsWith("did:nft:") && (t = t.replace("did:nft:", "").replace(/_/g, "/"));
  const [n, r, s] = t.split("/"), [o, i] = n.split(":"), [a, c] = r.split(":");
  if (!o || o.toLowerCase() !== "eip155")
    throw new Ct({ reason: "Only EIP-155 supported" });
  if (!i)
    throw new Ct({ reason: "Chain ID not found" });
  if (!c)
    throw new Ct({
      reason: "Contract address not found"
    });
  if (!s)
    throw new Ct({ reason: "Token ID not found" });
  if (!a)
    throw new Ct({ reason: "ERC namespace not found" });
  return {
    chainID: Number.parseInt(i, 10),
    namespace: a.toLowerCase(),
    contractAddress: c,
    tokenID: s
  };
}
async function jd(e, { nft: t }) {
  if (t.namespace === "erc721")
    return ye(e, {
      address: t.contractAddress,
      abi: [
        {
          name: "tokenURI",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "tokenURI",
      args: [BigInt(t.tokenID)]
    });
  if (t.namespace === "erc1155")
    return ye(e, {
      address: t.contractAddress,
      abi: [
        {
          name: "uri",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "_id", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "uri",
      args: [BigInt(t.tokenID)]
    });
  throw new Nd({ namespace: t.namespace });
}
async function Ld(e, { gatewayUrls: t, record: n }) {
  return /eip155:/i.test(n) ? _d(e, { gatewayUrls: t, record: n }) : Ls({ uri: n, gatewayUrls: t });
}
async function _d(e, { gatewayUrls: t, record: n }) {
  const r = Ud(n), s = await jd(e, { nft: r }), { uri: o, isOnChain: i, isEncoded: a } = Sa({ uri: s, gatewayUrls: t });
  if (i && (o.includes("data:application/json;base64,") || o.startsWith("{"))) {
    const u = a ? (
      // if it is encoded, decode it
      atob(o.replace("data:application/json;base64,", ""))
    ) : (
      // if it isn't encoded assume it is a JSON string, but it could be anything (it will error if it is)
      o
    ), f = JSON.parse(u);
    return Ls({ uri: Ta(f), gatewayUrls: t });
  }
  let c = r.tokenID;
  return r.namespace === "erc1155" && (c = c.replace("0x", "").padStart(64, "0")), Md({
    gatewayUrls: t,
    uri: o.replace(/(?:0x)?{id}/, c)
  });
}
async function ka(e, t) {
  const { blockNumber: n, blockTag: r, key: s, name: o, gatewayUrls: i, strict: a } = t, { chain: c } = e, u = (() => {
    if (t.universalResolverAddress)
      return t.universalResolverAddress;
    if (!c)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return kt({
      blockNumber: n,
      chain: c,
      contract: "ensUniversalResolver"
    });
  })(), f = c?.ensTlds;
  if (f && !f.some((d) => o.endsWith(d)))
    return null;
  try {
    const d = {
      address: u,
      abi: ya,
      args: [
        Le(Us(o)),
        fe({
          abi: ko,
          functionName: "text",
          args: [Qr(o), s]
        }),
        i ?? [tr]
      ],
      functionName: "resolveWithGateways",
      blockNumber: n,
      blockTag: r
    }, h = await z(e, ye, "readContract")(d);
    if (h[0] === "0x")
      return null;
    const p = He({
      abi: ko,
      functionName: "text",
      data: h[0]
    });
    return p === "" ? null : p;
  } catch (d) {
    if (a)
      throw d;
    if (Ms(d))
      return null;
    throw d;
  }
}
async function Gd(e, { blockNumber: t, blockTag: n, assetGatewayUrls: r, name: s, gatewayUrls: o, strict: i, universalResolverAddress: a }) {
  const c = await z(e, ka, "getEnsText")({
    blockNumber: t,
    blockTag: n,
    key: "avatar",
    name: s,
    universalResolverAddress: a,
    gatewayUrls: o,
    strict: i
  });
  if (!c)
    return null;
  try {
    return await Ld(e, {
      record: c,
      gatewayUrls: r
    });
  } catch {
    return null;
  }
}
async function Dd(e, t) {
  const { address: n, blockNumber: r, blockTag: s, coinType: o = 60n, gatewayUrls: i, strict: a } = t, { chain: c } = e, u = (() => {
    if (t.universalResolverAddress)
      return t.universalResolverAddress;
    if (!c)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return kt({
      blockNumber: r,
      chain: c,
      contract: "ensUniversalResolver"
    });
  })();
  try {
    const f = {
      address: u,
      abi: sd,
      args: [n, o, i ?? [tr]],
      functionName: "reverseWithGateways",
      blockNumber: r,
      blockTag: s
    }, d = z(e, ye, "readContract"), [l] = await d(f);
    return l || null;
  } catch (f) {
    if (a)
      throw f;
    if (Ms(f))
      return null;
    throw f;
  }
}
async function Hd(e, t) {
  const { blockNumber: n, blockTag: r, name: s } = t, { chain: o } = e, i = (() => {
    if (t.universalResolverAddress)
      return t.universalResolverAddress;
    if (!o)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return kt({
      blockNumber: n,
      chain: o,
      contract: "ensUniversalResolver"
    });
  })(), a = o?.ensTlds;
  if (a && !a.some((u) => s.endsWith(u)))
    throw new Error(`${s} is not a valid ENS TLD (${a?.join(", ")}) for chain "${o.name}" (id: ${o.id}).`);
  const [c] = await z(e, ye, "readContract")({
    address: i,
    abi: [
      {
        inputs: [{ type: "bytes" }],
        name: "findResolver",
        outputs: [
          { type: "address" },
          { type: "bytes32" },
          { type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "findResolver",
    args: [Le(Us(s))],
    blockNumber: n,
    blockTag: r
  });
  return c;
}
async function Na(e, t) {
  const { account: n = e.account, blockNumber: r, blockTag: s = "latest", blobs: o, data: i, gas: a, gasPrice: c, maxFeePerBlobGas: u, maxFeePerGas: f, maxPriorityFeePerGas: d, to: l, value: h, ...p } = t, m = n ? oe(n) : void 0;
  try {
    Tt(t);
    const g = (typeof r == "bigint" ? M(r) : void 0) || s, P = e.chain?.formatters?.transactionRequest?.format, b = (P || yn)({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...Kn(p, { format: P }),
      account: m,
      blobs: o,
      data: i,
      gas: a,
      gasPrice: c,
      maxFeePerBlobGas: u,
      maxFeePerGas: f,
      maxPriorityFeePerGas: d,
      to: l,
      value: h
    }, "createAccessList"), y = await e.request({
      method: "eth_createAccessList",
      params: [b, g]
    });
    return {
      accessList: y.accessList,
      gasUsed: BigInt(y.gasUsed)
    };
  } catch (E) {
    throw va(E, {
      ...t,
      account: m,
      chain: e.chain
    });
  }
}
async function qd(e) {
  const t = Vn(e, {
    method: "eth_newBlockFilter"
  }), n = await e.request({
    method: "eth_newBlockFilter"
  });
  return { id: n, request: t(n), type: "block" };
}
async function Oa(e, { address: t, args: n, event: r, events: s, fromBlock: o, strict: i, toBlock: a } = {}) {
  const c = s ?? (r ? [r] : void 0), u = Vn(e, {
    method: "eth_newFilter"
  });
  let f = [];
  c && (f = [c.flatMap((h) => hn({
    abi: [h],
    eventName: h.name,
    args: n
  }))], r && (f = f[0]));
  const d = await e.request({
    method: "eth_newFilter",
    params: [
      {
        address: t,
        fromBlock: typeof o == "bigint" ? M(o) : o,
        toBlock: typeof a == "bigint" ? M(a) : a,
        ...f.length ? { topics: f } : {}
      }
    ]
  });
  return {
    abi: c,
    args: n,
    eventName: r ? r.name : void 0,
    fromBlock: o,
    id: d,
    request: u(d),
    strict: !!i,
    toBlock: a,
    type: "event"
  };
}
async function Ra(e) {
  const t = Vn(e, {
    method: "eth_newPendingTransactionFilter"
  }), n = await e.request({
    method: "eth_newPendingTransactionFilter"
  });
  return { id: n, request: t(n), type: "transaction" };
}
async function Vd(e, { address: t, blockNumber: n, blockTag: r = e.experimental_blockTag ?? "latest" }) {
  if (e.batch?.multicall && e.chain?.contracts?.multicall3) {
    const i = e.chain.contracts.multicall3.address, a = fe({
      abi: At,
      functionName: "getEthBalance",
      args: [t]
    }), { data: c } = await z(e, vn, "call")({
      to: i,
      data: a,
      blockNumber: n,
      blockTag: r
    });
    return He({
      abi: At,
      functionName: "getEthBalance",
      args: [t],
      data: c || "0x"
    });
  }
  const s = typeof n == "bigint" ? M(n) : void 0, o = await e.request({
    method: "eth_getBalance",
    params: [t, s || r]
  });
  return BigInt(o);
}
async function Wd(e) {
  const t = await e.request({
    method: "eth_blobBaseFee"
  });
  return BigInt(t);
}
async function Zd(e, { blockHash: t, blockNumber: n, blockTag: r = "latest" } = {}) {
  const s = n !== void 0 ? M(n) : void 0;
  let o;
  return t ? o = await e.request({
    method: "eth_getBlockTransactionCountByHash",
    params: [t]
  }, { dedupe: !0 }) : o = await e.request({
    method: "eth_getBlockTransactionCountByNumber",
    params: [s || r]
  }, { dedupe: !!s }), Ce(o);
}
async function Un(e, { address: t, blockNumber: n, blockTag: r = "latest" }) {
  const s = n !== void 0 ? M(n) : void 0, o = await e.request({
    method: "eth_getCode",
    params: [t, s || r]
  }, { dedupe: !!s });
  if (o !== "0x")
    return o;
}
async function Kd(e, { address: t, blockNumber: n, blockTag: r = "latest" }) {
  const s = await Un(e, {
    address: t,
    ...n !== void 0 ? { blockNumber: n } : { blockTag: r }
  });
  if (s && D(s) === 23 && s.startsWith("0xef0100"))
    return On(Qe(s, 3, 23));
}
class Yd extends $ {
  constructor({ address: t }) {
    super(`No EIP-712 domain found on contract "${t}".`, {
      metaMessages: [
        "Ensure that:",
        `- The contract is deployed at the address "${t}".`,
        "- `eip712Domain()` function exists on the contract.",
        "- `eip712Domain()` function matches signature to ERC-5267 specification."
      ],
      name: "Eip712DomainNotFoundError"
    });
  }
}
async function Jd(e, t) {
  const { address: n, factory: r, factoryData: s } = t;
  try {
    const [o, i, a, c, u, f, d] = await z(e, ye, "readContract")({
      abi: Xd,
      address: n,
      functionName: "eip712Domain",
      factory: r,
      factoryData: s
    });
    return {
      domain: {
        name: i,
        version: a,
        chainId: Number(c),
        verifyingContract: u,
        salt: f
      },
      extensions: d,
      fields: o
    };
  } catch (o) {
    const i = o;
    throw i.name === "ContractFunctionExecutionError" && i.cause.name === "ContractFunctionZeroDataError" ? new Yd({ address: n }) : i;
  }
}
const Xd = [
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields", type: "bytes1" },
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
      { name: "extensions", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  }
];
function Qd(e) {
  return {
    baseFeePerGas: e.baseFeePerGas.map((t) => BigInt(t)),
    gasUsedRatio: e.gasUsedRatio,
    oldestBlock: BigInt(e.oldestBlock),
    reward: e.reward?.map((t) => t.map((n) => BigInt(n)))
  };
}
async function el(e, { blockCount: t, blockNumber: n, blockTag: r = "latest", rewardPercentiles: s }) {
  const o = typeof n == "bigint" ? M(n) : void 0, i = await e.request({
    method: "eth_feeHistory",
    params: [
      M(t),
      o || r,
      s
    ]
  }, { dedupe: !!o });
  return Qd(i);
}
async function tl(e, { filter: t }) {
  const n = t.strict ?? !1, s = (await t.request({
    method: "eth_getFilterLogs",
    params: [t.id]
  })).map((o) => $e(o));
  return t.abi ? Ts({
    abi: t.abi,
    logs: s,
    strict: n
  }) : s;
}
async function nl({ address: e, authorization: t, signature: n }) {
  return an(On(e), await ji({
    authorization: t,
    signature: n
  }));
}
const Sn = /* @__PURE__ */ new Hn(8192);
function rl(e, { enabled: t = !0, id: n }) {
  if (!t || !n)
    return e();
  if (Sn.get(n))
    return Sn.get(n);
  const r = e().finally(() => Sn.delete(n));
  return Sn.set(n, r), r;
}
function sl(e, t = {}) {
  return async (n, r = {}) => {
    const { dedupe: s = !1, methods: o, retryDelay: i = 150, retryCount: a = 3, uid: c } = {
      ...t,
      ...r
    }, { method: u } = n;
    if (o?.exclude?.includes(u))
      throw new We(new Error("method not supported"), {
        method: u
      });
    if (o?.include && !o.include.includes(u))
      throw new We(new Error("method not supported"), {
        method: u
      });
    const f = s ? zt(`${c}.${W(n)}`) : void 0;
    return rl(() => Jr(async () => {
      try {
        return await e(n);
      } catch (d) {
        const l = d;
        switch (l.code) {
          // -32700
          case jt.code:
            throw new jt(l);
          // -32600
          case Lt.code:
            throw new Lt(l);
          // -32601
          case _t.code:
            throw new _t(l, { method: n.method });
          // -32602
          case Gt.code:
            throw new Gt(l);
          // -32603
          case et.code:
            throw new et(l);
          // -32000
          case Ge.code:
            throw new Ge(l);
          // -32001
          case Dt.code:
            throw new Dt(l);
          // -32002
          case Ht.code:
            throw new Ht(l);
          // -32003
          case qt.code:
            throw new qt(l);
          // -32004
          case We.code:
            throw new We(l, {
              method: n.method
            });
          // -32005
          case Et.code:
            throw new Et(l);
          // -32006
          case Vt.code:
            throw new Vt(l);
          // 4001
          case mt.code:
            throw new mt(l);
          // 4100
          case Wt.code:
            throw new Wt(l);
          // 4200
          case Zt.code:
            throw new Zt(l);
          // 4900
          case Kt.code:
            throw new Kt(l);
          // 4901
          case Yt.code:
            throw new Yt(l);
          // 4902
          case Jt.code:
            throw new Jt(l);
          // 5700
          case Xt.code:
            throw new Xt(l);
          // 5710
          case Qt.code:
            throw new Qt(l);
          // 5720
          case en.code:
            throw new en(l);
          // 5730
          case tn.code:
            throw new tn(l);
          // 5740
          case nn.code:
            throw new nn(l);
          // 5750
          case rn.code:
            throw new rn(l);
          // 5760
          case sn.code:
            throw new sn(l);
          // CAIP-25: User Rejected Error
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
          case 5e3:
            throw new mt(l);
          // WalletConnect: Session Settlement Failed
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
          case on.code:
            throw new on(l);
          default:
            throw d instanceof $ ? d : new _0(l);
        }
      }
    }, {
      delay: ({ count: d, error: l }) => {
        if (l && l instanceof Ft) {
          const h = l?.headers?.get("Retry-After");
          if (h?.match(/\d/))
            return Number.parseInt(h, 10) * 1e3;
        }
        return ~~(1 << d) * i;
      },
      retryCount: a,
      shouldRetry: ({ error: d }) => ol(d)
    }), { enabled: s, id: f });
  };
}
function ol(e) {
  return "code" in e && typeof e.code == "number" ? e.code === -1 || e.code === Et.code || e.code === et.code || e.code === 429 : e instanceof Ft && e.status ? e.status === 403 || e.status === 408 || e.status === 413 || e.status === 429 || e.status === 500 || e.status === 502 || e.status === 503 || e.status === 504 : !0;
}
function il(e) {
  const t = {
    formatters: void 0,
    fees: void 0,
    serializers: void 0,
    ...e
  };
  function n(r) {
    return (s) => {
      const o = typeof s == "function" ? s(r) : s, i = { ...r, ...o };
      return Object.assign(i, { extend: n(i) });
    };
  }
  return Object.assign(t, {
    extend: n(t)
  });
}
function al(e, { errorInstance: t = new Error("timed out"), timeout: n, signal: r }) {
  return new Promise((s, o) => {
    (async () => {
      let i;
      try {
        const a = new AbortController();
        n > 0 && (i = setTimeout(() => {
          r && a.abort();
        }, n)), s(await e({ signal: a?.signal || null }));
      } catch (a) {
        a?.name === "AbortError" && o(t), o(a);
      } finally {
        clearTimeout(i);
      }
    })();
  });
}
function cl() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
}
const zo = /* @__PURE__ */ cl();
function ul(e, t = {}) {
  const { url: n, headers: r } = fl(e);
  return {
    async request(s) {
      const { body: o, fetchFn: i = t.fetchFn ?? fetch, onRequest: a = t.onRequest, onResponse: c = t.onResponse, timeout: u = t.timeout ?? 1e4 } = s, f = {
        ...t.fetchOptions ?? {},
        ...s.fetchOptions ?? {}
      }, { headers: d, method: l, signal: h } = f;
      try {
        const p = await al(async ({ signal: E }) => {
          const g = {
            ...f,
            body: Array.isArray(o) ? W(o.map((y) => ({
              jsonrpc: "2.0",
              id: y.id ?? zo.take(),
              ...y
            }))) : W({
              jsonrpc: "2.0",
              id: o.id ?? zo.take(),
              ...o
            }),
            headers: {
              ...r,
              "Content-Type": "application/json",
              ...d
            },
            method: l || "POST",
            signal: h || (u > 0 ? E : null)
          }, P = new Request(n, g), w = await a?.(P, g) ?? { ...g, url: n };
          return await i(w.url ?? n, w);
        }, {
          errorInstance: new yo({ body: o, url: n }),
          timeout: u,
          signal: !0
        });
        c && await c(p);
        let m;
        if (p.headers.get("Content-Type")?.startsWith("application/json"))
          m = await p.json();
        else {
          m = await p.text();
          try {
            m = JSON.parse(m || "{}");
          } catch (E) {
            if (p.ok)
              throw E;
            m = { error: m };
          }
        }
        if (!p.ok) {
          if (typeof m.error?.code == "number" && typeof m.error?.message == "string")
            return m;
          throw new Ft({
            body: o,
            details: W(m.error) || p.statusText,
            headers: p.headers,
            status: p.status,
            url: n
          });
        }
        return m;
      } catch (p) {
        throw p instanceof Ft || p instanceof yo ? p : new Ft({
          body: o,
          cause: p,
          url: n
        });
      }
    }
  };
}
function fl(e) {
  try {
    const t = new URL(e), n = (() => {
      if (t.username) {
        const r = `${decodeURIComponent(t.username)}:${decodeURIComponent(t.password)}`;
        return t.username = "", t.password = "", {
          url: t.toString(),
          headers: { Authorization: `Basic ${btoa(r)}` }
        };
      }
    })();
    return { url: t.toString(), ...n };
  } catch {
    return { url: e };
  }
}
const dl = `Ethereum Signed Message:
`;
function ll(e) {
  const t = typeof e == "string" ? zt(e) : typeof e.raw == "string" ? e.raw : H(e.raw), n = zt(`${dl}${D(t)}`);
  return Ae([n, t]);
}
function Ca(e, t) {
  return V(ll(e), t);
}
class hl extends $ {
  constructor({ domain: t }) {
    super(`Invalid domain "${W(t)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
  }
}
class bl extends $ {
  constructor({ primaryType: t, types: n }) {
    super(`Invalid primary type \`${t}\` must be one of \`${JSON.stringify(Object.keys(n))}\`.`, {
      docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
  }
}
class pl extends $ {
  constructor({ type: t }) {
    super(`Struct type "${t}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."],
      name: "InvalidStructTypeError"
    });
  }
}
function ml(e) {
  const { domain: t, message: n, primaryType: r, types: s } = e, o = (i, a) => {
    for (const c of i) {
      const { name: u, type: f } = c, d = a[u], l = f.match(Bi);
      if (l && (typeof d == "number" || typeof d == "bigint")) {
        const [m, E, g] = l;
        M(d, {
          signed: E === "int",
          size: Number.parseInt(g, 10) / 8
        });
      }
      if (f === "address" && typeof d == "string" && !ue(d))
        throw new _e({ address: d });
      const h = f.match(r0);
      if (h) {
        const [m, E] = h;
        if (E && D(d) !== Number.parseInt(E, 10))
          throw new du({
            expectedSize: Number.parseInt(E, 10),
            givenSize: D(d)
          });
      }
      const p = s[f];
      p && (gl(f), o(p, d));
    }
  };
  if (s.EIP712Domain && t) {
    if (typeof t != "object")
      throw new hl({ domain: t });
    o(s.EIP712Domain, t);
  }
  if (r !== "EIP712Domain")
    if (s[r])
      o(s[r], n);
    else
      throw new bl({ primaryType: r, types: s });
}
function yl({ domain: e }) {
  return [
    typeof e?.name == "string" && { name: "name", type: "string" },
    e?.version && { name: "version", type: "string" },
    (typeof e?.chainId == "number" || typeof e?.chainId == "bigint") && {
      name: "chainId",
      type: "uint256"
    },
    e?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    e?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
function gl(e) {
  if (e === "address" || e === "bool" || e === "string" || e.startsWith("bytes") || e.startsWith("uint") || e.startsWith("int"))
    throw new pl({ type: e });
}
function wl(e) {
  const { domain: t = {}, message: n, primaryType: r } = e, s = {
    EIP712Domain: yl({ domain: t }),
    ...e.types
  };
  ml({
    domain: t,
    message: n,
    primaryType: r,
    types: s
  });
  const o = ["0x1901"];
  return t && o.push(xl({
    domain: t,
    types: s
  })), r !== "EIP712Domain" && o.push(Fa({
    data: n,
    primaryType: r,
    types: s
  })), V(Ae(o));
}
function xl({ domain: e, types: t }) {
  return Fa({
    data: e,
    primaryType: "EIP712Domain",
    types: t
  });
}
function Fa({ data: e, primaryType: t, types: n }) {
  const r = za({
    data: e,
    primaryType: t,
    types: n
  });
  return V(r);
}
function za({ data: e, primaryType: t, types: n }) {
  const r = [{ type: "bytes32" }], s = [vl({ primaryType: t, types: n })];
  for (const o of n[t]) {
    const [i, a] = Ua({
      types: n,
      name: o.name,
      type: o.type,
      value: e[o.name]
    });
    r.push(i), s.push(a);
  }
  return st(r, s);
}
function vl({ primaryType: e, types: t }) {
  const n = Le(El({ primaryType: e, types: t }));
  return V(n);
}
function El({ primaryType: e, types: t }) {
  let n = "";
  const r = Ma({ primaryType: e, types: t });
  r.delete(e);
  const s = [e, ...Array.from(r).sort()];
  for (const o of s)
    n += `${o}(${t[o].map(({ name: i, type: a }) => `${a} ${i}`).join(",")})`;
  return n;
}
function Ma({ primaryType: e, types: t }, n = /* @__PURE__ */ new Set()) {
  const s = e.match(/^\w*/u)?.[0];
  if (n.has(s) || t[s] === void 0)
    return n;
  n.add(s);
  for (const o of t[s])
    Ma({ primaryType: o.type, types: t }, n);
  return n;
}
function Ua({ types: e, name: t, type: n, value: r }) {
  if (e[n] !== void 0)
    return [
      { type: "bytes32" },
      V(za({ data: r, primaryType: n, types: e }))
    ];
  if (n === "bytes")
    return [{ type: "bytes32" }, V(r)];
  if (n === "string")
    return [{ type: "bytes32" }, V(Le(r))];
  if (n.lastIndexOf("]") === n.length - 1) {
    const s = n.slice(0, n.lastIndexOf("[")), o = r.map((i) => Ua({
      name: t,
      type: s,
      types: e,
      value: i
    }));
    return [
      { type: "bytes32" },
      V(st(o.map(([i]) => i), o.map(([, i]) => i)))
    ];
  }
  return [{ type: n }, r];
}
class Pl extends Map {
  constructor(t) {
    super(), Object.defineProperty(this, "maxSize", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.maxSize = t;
  }
  get(t) {
    const n = super.get(t);
    return super.has(t) && n !== void 0 && (this.delete(t), super.set(t, n)), n;
  }
  set(t, n) {
    if (super.set(t, n), this.maxSize && this.size > this.maxSize) {
      const r = this.keys().next().value;
      r && this.delete(r);
    }
    return this;
  }
}
const Al = {
  checksum: /* @__PURE__ */ new Pl(8192)
}, vr = Al.checksum;
class ja extends hs {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ru(t);
    const r = Gn(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), vt(o);
  }
  update(t) {
    return xt(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    xt(this), Xe(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const La = (e, t, n) => new ja(e, t).update(n).digest();
La.create = (e, t) => new ja(e, t);
function _a(e, t = {}) {
  const { as: n = typeof e == "string" ? "Hex" : "Bytes" } = t, r = vi(Uf(e));
  return n === "Bytes" ? r : me(r);
}
const $l = /^0x[a-fA-F0-9]{40}$/;
function nr(e, t = {}) {
  const { strict: n = !0 } = t;
  if (!$l.test(e))
    throw new Mo({
      address: e,
      cause: new Bl()
    });
  if (n) {
    if (e.toLowerCase() === e)
      return;
    if (Ga(e) !== e)
      throw new Mo({
        address: e,
        cause: new Il()
      });
  }
}
function Ga(e) {
  if (vr.has(e))
    return vr.get(e);
  nr(e, { strict: !1 });
  const t = e.substring(2).toLowerCase(), n = _a(Lf(t), { as: "Bytes" }), r = t.split("");
  for (let o = 0; o < 40; o += 2)
    n[o >> 1] >> 4 >= 8 && r[o] && (r[o] = r[o].toUpperCase()), (n[o >> 1] & 15) >= 8 && r[o + 1] && (r[o + 1] = r[o + 1].toUpperCase());
  const s = `0x${r.join("")}`;
  return vr.set(e, s), s;
}
function es(e, t = {}) {
  const { strict: n = !0 } = t ?? {};
  try {
    return nr(e, { strict: n }), !0;
  } catch {
    return !1;
  }
}
class Mo extends j {
  constructor({ address: t, cause: n }) {
    super(`Address "${t}" is invalid.`, {
      cause: n
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Address.InvalidAddressError"
    });
  }
}
class Bl extends j {
  constructor() {
    super("Address is not a 20 byte (40 hexadecimal character) value."), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Address.InvalidInputError"
    });
  }
}
class Il extends j {
  constructor() {
    super("Address does not match its checksum counterpart."), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Address.InvalidChecksumError"
    });
  }
}
const Sl = /^(.*)\[([0-9]*)\]$/, Tl = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/, Da = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/, Uo = 2n ** 256n - 1n;
function gt(e, t, n) {
  const { checksumAddress: r, staticPosition: s } = n, o = Ds(t.type);
  if (o) {
    const [i, a] = o;
    return Nl(e, { ...t, type: a }, { checksumAddress: r, length: i, staticPosition: s });
  }
  if (t.type === "tuple")
    return Fl(e, t, {
      checksumAddress: r,
      staticPosition: s
    });
  if (t.type === "address")
    return kl(e, { checksum: r });
  if (t.type === "bool")
    return Ol(e);
  if (t.type.startsWith("bytes"))
    return Rl(e, t, { staticPosition: s });
  if (t.type.startsWith("uint") || t.type.startsWith("int"))
    return Cl(e, t);
  if (t.type === "string")
    return zl(e, { staticPosition: s });
  throw new qs(t.type);
}
const jo = 32, ts = 32;
function kl(e, t = {}) {
  const { checksum: n = !1 } = t, r = e.readBytes(32);
  return [((o) => n ? Ga(o) : o)(me(Gf(r, -20))), 32];
}
function Nl(e, t, n) {
  const { checksumAddress: r, length: s, staticPosition: o } = n;
  if (!s) {
    const c = Oe(e.readBytes(ts)), u = o + c, f = u + jo;
    e.setPosition(u);
    const d = Oe(e.readBytes(jo)), l = fn(t);
    let h = 0;
    const p = [];
    for (let m = 0; m < d; ++m) {
      e.setPosition(f + (l ? m * 32 : h));
      const [E, g] = gt(e, t, {
        checksumAddress: r,
        staticPosition: f
      });
      h += g, p.push(E);
    }
    return e.setPosition(o + 32), [p, 32];
  }
  if (fn(t)) {
    const c = Oe(e.readBytes(ts)), u = o + c, f = [];
    for (let d = 0; d < s; ++d) {
      e.setPosition(u + d * 32);
      const [l] = gt(e, t, {
        checksumAddress: r,
        staticPosition: u
      });
      f.push(l);
    }
    return e.setPosition(o + 32), [f, 32];
  }
  let i = 0;
  const a = [];
  for (let c = 0; c < s; ++c) {
    const [u, f] = gt(e, t, {
      checksumAddress: r,
      staticPosition: o + i
    });
    i += f, a.push(u);
  }
  return [a, i];
}
function Ol(e) {
  return [Hf(e.readBytes(32), { size: 32 }), 32];
}
function Rl(e, t, { staticPosition: n }) {
  const [r, s] = t.type.split("bytes");
  if (!s) {
    const i = Oe(e.readBytes(32));
    e.setPosition(n + i);
    const a = Oe(e.readBytes(32));
    if (a === 0)
      return e.setPosition(n + 32), ["0x", 32];
    const c = e.readBytes(a);
    return e.setPosition(n + 32), [me(c), 32];
  }
  return [me(e.readBytes(Number.parseInt(s, 10), 32)), 32];
}
function Cl(e, t) {
  const n = t.type.startsWith("int"), r = Number.parseInt(t.type.split("int")[1] || "256", 10), s = e.readBytes(32);
  return [
    r > 48 ? Df(s, { signed: n }) : Oe(s, { signed: n }),
    32
  ];
}
function Fl(e, t, n) {
  const { checksumAddress: r, staticPosition: s } = n, o = t.components.length === 0 || t.components.some(({ name: c }) => !c), i = o ? [] : {};
  let a = 0;
  if (fn(t)) {
    const c = Oe(e.readBytes(ts)), u = s + c;
    for (let f = 0; f < t.components.length; ++f) {
      const d = t.components[f];
      e.setPosition(u + a);
      const [l, h] = gt(e, d, {
        checksumAddress: r,
        staticPosition: u
      });
      a += h, i[o ? f : d?.name] = l;
    }
    return e.setPosition(s + 32), [i, 32];
  }
  for (let c = 0; c < t.components.length; ++c) {
    const u = t.components[c], [f, d] = gt(e, u, {
      checksumAddress: r,
      staticPosition: s
    });
    i[o ? c : u?.name] = f, a += d;
  }
  return [i, a];
}
function zl(e, { staticPosition: t }) {
  const n = Oe(e.readBytes(32)), r = t + n;
  e.setPosition(r);
  const s = Oe(e.readBytes(32));
  if (s === 0)
    return e.setPosition(t + 32), ["", 32];
  const o = e.readBytes(s, 32), i = qf(ua(o));
  return e.setPosition(t + 32), [i, 32];
}
function Ml({ checksumAddress: e, parameters: t, values: n }) {
  const r = [];
  for (let s = 0; s < t.length; s++)
    r.push(_s({
      checksumAddress: e,
      parameter: t[s],
      value: n[s]
    }));
  return r;
}
function _s({ checksumAddress: e = !1, parameter: t, value: n }) {
  const r = t, s = Ds(r.type);
  if (s) {
    const [o, i] = s;
    return jl(n, {
      checksumAddress: e,
      length: o,
      parameter: {
        ...r,
        type: i
      }
    });
  }
  if (r.type === "tuple")
    return Hl(n, {
      checksumAddress: e,
      parameter: r
    });
  if (r.type === "address")
    return Ul(n, {
      checksum: e
    });
  if (r.type === "bool")
    return _l(n);
  if (r.type.startsWith("uint") || r.type.startsWith("int")) {
    const o = r.type.startsWith("int"), [, , i = "256"] = Da.exec(r.type) ?? [];
    return Gl(n, {
      signed: o,
      size: Number(i)
    });
  }
  if (r.type.startsWith("bytes"))
    return Ll(n, { type: r.type });
  if (r.type === "string")
    return Dl(n);
  throw new qs(r.type);
}
function Gs(e) {
  let t = 0;
  for (let o = 0; o < e.length; o++) {
    const { dynamic: i, encoded: a } = e[o];
    i ? t += 32 : t += ie(a);
  }
  const n = [], r = [];
  let s = 0;
  for (let o = 0; o < e.length; o++) {
    const { dynamic: i, encoded: a } = e[o];
    i ? (n.push(K(t + s, { size: 32 })), r.push(a), s += ie(a)) : n.push(a);
  }
  return pe(...n, ...r);
}
function Ul(e, t) {
  const { checksum: n = !1 } = t;
  return nr(e, { strict: n }), {
    dynamic: !1,
    encoded: tt(e.toLowerCase())
  };
}
function jl(e, t) {
  const { checksumAddress: n, length: r, parameter: s } = t, o = r === null;
  if (!Array.isArray(e))
    throw new Ql(e);
  if (!o && e.length !== r)
    throw new Xl({
      expectedLength: r,
      givenLength: e.length,
      type: `${s.type}[${r}]`
    });
  let i = !1;
  const a = [];
  for (let c = 0; c < e.length; c++) {
    const u = _s({
      checksumAddress: n,
      parameter: s,
      value: e[c]
    });
    u.dynamic && (i = !0), a.push(u);
  }
  if (o || i) {
    const c = Gs(a);
    if (o) {
      const u = K(a.length, { size: 32 });
      return {
        dynamic: !0,
        encoded: a.length > 0 ? pe(u, c) : u
      };
    }
    if (i)
      return { dynamic: !0, encoded: c };
  }
  return {
    dynamic: !1,
    encoded: pe(...a.map(({ encoded: c }) => c))
  };
}
function Ll(e, { type: t }) {
  const [, n] = t.split("bytes"), r = ie(e);
  if (!n) {
    let s = e;
    return r % 32 !== 0 && (s = nt(s, Math.ceil((e.length - 2) / 2 / 32) * 32)), {
      dynamic: !0,
      encoded: pe(tt(K(r, { size: 32 })), s)
    };
  }
  if (r !== Number.parseInt(n, 10))
    throw new qa({
      expectedSize: Number.parseInt(n, 10),
      value: e
    });
  return { dynamic: !1, encoded: nt(e) };
}
function _l(e) {
  if (typeof e != "boolean")
    throw new j(`Invalid boolean value: "${e}" (type: ${typeof e}). Expected: \`true\` or \`false\`.`);
  return { dynamic: !1, encoded: tt(fa(e)) };
}
function Gl(e, { signed: t, size: n }) {
  if (typeof n == "number") {
    const r = 2n ** (BigInt(n) - (t ? 1n : 0n)) - 1n, s = t ? -r - 1n : 0n;
    if (e > r || e < s)
      throw new ha({
        max: r.toString(),
        min: s.toString(),
        signed: t,
        size: n / 8,
        value: e.toString()
      });
  }
  return {
    dynamic: !1,
    encoded: K(e, {
      size: 32,
      signed: t
    })
  };
}
function Dl(e) {
  const t = Cs(e), n = Math.ceil(ie(t) / 32), r = [];
  for (let s = 0; s < n; s++)
    r.push(nt(xe(t, s * 32, (s + 1) * 32)));
  return {
    dynamic: !0,
    encoded: pe(nt(K(ie(t), { size: 32 })), ...r)
  };
}
function Hl(e, t) {
  const { checksumAddress: n, parameter: r } = t;
  let s = !1;
  const o = [];
  for (let i = 0; i < r.components.length; i++) {
    const a = r.components[i], c = Array.isArray(e) ? i : a.name, u = _s({
      checksumAddress: n,
      parameter: a,
      value: e[c]
    });
    o.push(u), u.dynamic && (s = !0);
  }
  return {
    dynamic: s,
    encoded: s ? Gs(o) : pe(...o.map(({ encoded: i }) => i))
  };
}
function Ds(e) {
  const t = e.match(/^(.*)\[(\d+)?\]$/);
  return t ? (
    // Return `null` if the array is dynamic.
    [t[2] ? Number(t[2]) : null, t[1]]
  ) : void 0;
}
function fn(e) {
  const { type: t } = e;
  if (t === "string" || t === "bytes" || t.endsWith("[]"))
    return !0;
  if (t === "tuple")
    return e.components?.some(fn);
  const n = Ds(e.type);
  return !!(n && fn({
    ...e,
    type: n[1]
  }));
}
const ql = {
  bytes: new Uint8Array(),
  dataView: new DataView(new ArrayBuffer(0)),
  position: 0,
  positionReadCount: /* @__PURE__ */ new Map(),
  recursiveReadCount: 0,
  recursiveReadLimit: Number.POSITIVE_INFINITY,
  assertReadLimit() {
    if (this.recursiveReadCount >= this.recursiveReadLimit)
      throw new Zl({
        count: this.recursiveReadCount + 1,
        limit: this.recursiveReadLimit
      });
  },
  assertPosition(e) {
    if (e < 0 || e > this.bytes.length - 1)
      throw new Wl({
        length: this.bytes.length,
        position: e
      });
  },
  decrementPosition(e) {
    if (e < 0)
      throw new Lo({ offset: e });
    const t = this.position - e;
    this.assertPosition(t), this.position = t;
  },
  getReadCount(e) {
    return this.positionReadCount.get(e || this.position) || 0;
  },
  incrementPosition(e) {
    if (e < 0)
      throw new Lo({ offset: e });
    const t = this.position + e;
    this.assertPosition(t), this.position = t;
  },
  inspectByte(e) {
    const t = e ?? this.position;
    return this.assertPosition(t), this.bytes[t];
  },
  inspectBytes(e, t) {
    const n = t ?? this.position;
    return this.assertPosition(n + e - 1), this.bytes.subarray(n, n + e);
  },
  inspectUint8(e) {
    const t = e ?? this.position;
    return this.assertPosition(t), this.bytes[t];
  },
  inspectUint16(e) {
    const t = e ?? this.position;
    return this.assertPosition(t + 1), this.dataView.getUint16(t);
  },
  inspectUint24(e) {
    const t = e ?? this.position;
    return this.assertPosition(t + 2), (this.dataView.getUint16(t) << 8) + this.dataView.getUint8(t + 2);
  },
  inspectUint32(e) {
    const t = e ?? this.position;
    return this.assertPosition(t + 3), this.dataView.getUint32(t);
  },
  pushByte(e) {
    this.assertPosition(this.position), this.bytes[this.position] = e, this.position++;
  },
  pushBytes(e) {
    this.assertPosition(this.position + e.length - 1), this.bytes.set(e, this.position), this.position += e.length;
  },
  pushUint8(e) {
    this.assertPosition(this.position), this.bytes[this.position] = e, this.position++;
  },
  pushUint16(e) {
    this.assertPosition(this.position + 1), this.dataView.setUint16(this.position, e), this.position += 2;
  },
  pushUint24(e) {
    this.assertPosition(this.position + 2), this.dataView.setUint16(this.position, e >> 8), this.dataView.setUint8(this.position + 2, e & 255), this.position += 3;
  },
  pushUint32(e) {
    this.assertPosition(this.position + 3), this.dataView.setUint32(this.position, e), this.position += 4;
  },
  readByte() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectByte();
    return this.position++, e;
  },
  readBytes(e, t) {
    this.assertReadLimit(), this._touch();
    const n = this.inspectBytes(e);
    return this.position += t ?? e, n;
  },
  readUint8() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint8();
    return this.position += 1, e;
  },
  readUint16() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint16();
    return this.position += 2, e;
  },
  readUint24() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint24();
    return this.position += 3, e;
  },
  readUint32() {
    this.assertReadLimit(), this._touch();
    const e = this.inspectUint32();
    return this.position += 4, e;
  },
  get remaining() {
    return this.bytes.length - this.position;
  },
  setPosition(e) {
    const t = this.position;
    return this.assertPosition(e), this.position = e, () => this.position = t;
  },
  _touch() {
    if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
      return;
    const e = this.getReadCount();
    this.positionReadCount.set(this.position, e + 1), e > 0 && this.recursiveReadCount++;
  }
};
function Vl(e, { recursiveReadLimit: t = 8192 } = {}) {
  const n = Object.create(ql);
  return n.bytes = e, n.dataView = new DataView(e.buffer, e.byteOffset, e.byteLength), n.positionReadCount = /* @__PURE__ */ new Map(), n.recursiveReadLimit = t, n;
}
class Lo extends j {
  constructor({ offset: t }) {
    super(`Offset \`${t}\` cannot be negative.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Cursor.NegativeOffsetError"
    });
  }
}
class Wl extends j {
  constructor({ length: t, position: n }) {
    super(`Position \`${n}\` is out of bounds (\`0 < position < ${t}\`).`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Cursor.PositionOutOfBoundsError"
    });
  }
}
class Zl extends j {
  constructor({ count: t, limit: n }) {
    super(`Recursive read limit of \`${n}\` exceeded (recursive read count: \`${t}\`).`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Cursor.RecursiveReadLimitExceededError"
    });
  }
}
function Kl(e, t, n = {}) {
  const { as: r = "Array", checksumAddress: s = !1 } = n, o = typeof t == "string" ? ca(t) : t, i = Vl(o);
  if (ht(o) === 0 && e.length > 0)
    throw new Jl();
  if (ht(o) && ht(o) < 32)
    throw new Yl({
      data: typeof t == "string" ? t : me(t),
      parameters: e,
      size: ht(o)
    });
  let a = 0;
  const c = r === "Array" ? [] : {};
  for (let u = 0; u < e.length; ++u) {
    const f = e[u];
    i.setPosition(a);
    const [d, l] = gt(i, f, {
      checksumAddress: s,
      staticPosition: 0
    });
    a += l, r === "Array" ? c.push(d) : c[f.name ?? u] = d;
  }
  return c;
}
function Hs(e, t, n) {
  const { checksumAddress: r = !1 } = {};
  if (e.length !== t.length)
    throw new Va({
      expectedLength: e.length,
      givenLength: t.length
    });
  const s = Ml({
    checksumAddress: r,
    parameters: e,
    values: t
  }), o = Gs(s);
  return o.length === 0 ? "0x" : o;
}
function ns(e, t) {
  if (e.length !== t.length)
    throw new Va({
      expectedLength: e.length,
      givenLength: t.length
    });
  const n = [];
  for (let r = 0; r < e.length; r++) {
    const s = e[r], o = t[r];
    n.push(ns.encode(s, o));
  }
  return pe(...n);
}
(function(e) {
  function t(n, r, s = !1) {
    if (n === "address") {
      const c = r;
      return nr(c), tt(c.toLowerCase(), s ? 32 : 0);
    }
    if (n === "string")
      return Cs(r);
    if (n === "bytes")
      return r;
    if (n === "bool")
      return tt(fa(r), s ? 32 : 1);
    const o = n.match(Da);
    if (o) {
      const [c, u, f = "256"] = o, d = Number.parseInt(f, 10) / 8;
      return K(r, {
        size: s ? 32 : d,
        signed: u === "int"
      });
    }
    const i = n.match(Tl);
    if (i) {
      const [c, u] = i;
      if (Number.parseInt(u, 10) !== (r.length - 2) / 2)
        throw new qa({
          expectedSize: Number.parseInt(u, 10),
          value: r
        });
      return nt(r, s ? 32 : 0);
    }
    const a = n.match(Sl);
    if (a && Array.isArray(r)) {
      const [c, u] = a, f = [];
      for (let d = 0; d < r.length; d++)
        f.push(t(u, r[d], !0));
      return f.length === 0 ? "0x" : pe(...f);
    }
    throw new qs(n);
  }
  e.encode = t;
})(ns || (ns = {}));
function Ha(e) {
  return Array.isArray(e) && typeof e[0] == "string" || typeof e == "string" ? eo(e) : e;
}
class Yl extends j {
  constructor({ data: t, parameters: n, size: r }) {
    super(`Data size of ${r} bytes is too small for given parameters.`, {
      metaMessages: [
        `Params: (${dt(n)})`,
        `Data:   ${t} (${r} bytes)`
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiParameters.DataSizeTooSmallError"
    });
  }
}
class Jl extends j {
  constructor() {
    super('Cannot decode zero data ("0x") with ABI parameters.'), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiParameters.ZeroDataError"
    });
  }
}
class Xl extends j {
  constructor({ expectedLength: t, givenLength: n, type: r }) {
    super(`Array length mismatch for type \`${r}\`. Expected: \`${t}\`. Given: \`${n}\`.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiParameters.ArrayLengthMismatchError"
    });
  }
}
class qa extends j {
  constructor({ expectedSize: t, value: n }) {
    super(`Size of bytes "${n}" (bytes${ie(n)}) does not match expected size (bytes${t}).`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiParameters.BytesSizeMismatchError"
    });
  }
}
class Va extends j {
  constructor({ expectedLength: t, givenLength: n }) {
    super([
      "ABI encoding parameters/values length mismatch.",
      `Expected length (parameters): ${t}`,
      `Given length (values): ${n}`
    ].join(`
`)), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiParameters.LengthMismatchError"
    });
  }
}
class Ql extends j {
  constructor(t) {
    super(`Value \`${t}\` is not a valid array.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiParameters.InvalidArrayError"
    });
  }
}
class qs extends j {
  constructor(t) {
    super(`Type \`${t}\` is not a valid ABI Type.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiParameters.InvalidTypeError"
    });
  }
}
const Q = BigInt(0), Y = BigInt(1), Ze = /* @__PURE__ */ BigInt(2), e1 = /* @__PURE__ */ BigInt(3), Wa = /* @__PURE__ */ BigInt(4), Za = /* @__PURE__ */ BigInt(5), Ka = /* @__PURE__ */ BigInt(8);
function X(e, t) {
  const n = e % t;
  return n >= Q ? n : t + n;
}
function ae(e, t, n) {
  let r = e;
  for (; t-- > Q; )
    r *= r, r %= n;
  return r;
}
function rs(e, t) {
  if (e === Q)
    throw new Error("invert: expected non-zero number");
  if (t <= Q)
    throw new Error("invert: expected positive modulus, got " + t);
  let n = X(e, t), r = t, s = Q, o = Y;
  for (; n !== Q; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== Y)
    throw new Error("invert: does not exist");
  return X(s, t);
}
function Ya(e, t) {
  const n = (e.ORDER + Y) / Wa, r = e.pow(t, n);
  if (!e.eql(e.sqr(r), t))
    throw new Error("Cannot find square root");
  return r;
}
function t1(e, t) {
  const n = (e.ORDER - Za) / Ka, r = e.mul(t, Ze), s = e.pow(r, n), o = e.mul(t, s), i = e.mul(e.mul(o, Ze), s), a = e.mul(o, e.sub(i, e.ONE));
  if (!e.eql(e.sqr(a), t))
    throw new Error("Cannot find square root");
  return a;
}
function n1(e) {
  if (e < BigInt(3))
    throw new Error("sqrt is not defined for small field");
  let t = e - Y, n = 0;
  for (; t % Ze === Q; )
    t /= Ze, n++;
  let r = Ze;
  const s = Vs(e);
  for (; _o(s, r) === 1; )
    if (r++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (n === 1)
    return Ya;
  let o = s.pow(r, t);
  const i = (t + Y) / Ze;
  return function(c, u) {
    if (c.is0(u))
      return u;
    if (_o(c, u) !== 1)
      throw new Error("Cannot find square root");
    let f = n, d = c.mul(c.ONE, o), l = c.pow(u, t), h = c.pow(u, i);
    for (; !c.eql(l, c.ONE); ) {
      if (c.is0(l))
        return c.ZERO;
      let p = 1, m = c.sqr(l);
      for (; !c.eql(m, c.ONE); )
        if (p++, m = c.sqr(m), p === f)
          throw new Error("Cannot find square root");
      const E = Y << BigInt(f - p - 1), g = c.pow(d, E);
      f = p, d = c.sqr(g), l = c.mul(l, d), h = c.mul(h, g);
    }
    return h;
  };
}
function r1(e) {
  return e % Wa === e1 ? Ya : e % Ka === Za ? t1 : n1(e);
}
const s1 = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function o1(e) {
  const t = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  }, n = s1.reduce((r, s) => (r[s] = "function", r), t);
  return Jn(e, n);
}
function i1(e, t, n) {
  if (n < Q)
    throw new Error("invalid exponent, negatives unsupported");
  if (n === Q)
    return e.ONE;
  if (n === Y)
    return t;
  let r = e.ONE, s = t;
  for (; n > Q; )
    n & Y && (r = e.mul(r, s)), s = e.sqr(s), n >>= Y;
  return r;
}
function Ja(e, t, n = !1) {
  const r = new Array(t.length).fill(n ? e.ZERO : void 0), s = t.reduce((i, a, c) => e.is0(a) ? i : (r[c] = i, e.mul(i, a)), e.ONE), o = e.inv(s);
  return t.reduceRight((i, a, c) => e.is0(a) ? i : (r[c] = e.mul(i, r[c]), e.mul(i, a)), o), r;
}
function _o(e, t) {
  const n = (e.ORDER - Y) / Ze, r = e.pow(t, n), s = e.eql(r, e.ONE), o = e.eql(r, e.ZERO), i = e.eql(r, e.neg(e.ONE));
  if (!s && !o && !i)
    throw new Error("invalid Legendre symbol result");
  return s ? 1 : o ? 0 : -1;
}
function Xa(e, t) {
  t !== void 0 && Mt(t);
  const n = t !== void 0 ? t : e.toString(2).length, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
function Vs(e, t, n = !1, r = {}) {
  if (e <= Q)
    throw new Error("invalid field: expected ORDER > 0, got " + e);
  const { nBitLength: s, nByteLength: o } = Xa(e, t);
  if (o > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let i;
  const a = Object.freeze({
    ORDER: e,
    isLE: n,
    BITS: s,
    BYTES: o,
    MASK: Yn(s),
    ZERO: Q,
    ONE: Y,
    create: (c) => X(c, e),
    isValid: (c) => {
      if (typeof c != "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof c);
      return Q <= c && c < e;
    },
    is0: (c) => c === Q,
    isOdd: (c) => (c & Y) === Y,
    neg: (c) => X(-c, e),
    eql: (c, u) => c === u,
    sqr: (c) => X(c * c, e),
    add: (c, u) => X(c + u, e),
    sub: (c, u) => X(c - u, e),
    mul: (c, u) => X(c * u, e),
    pow: (c, u) => i1(a, c, u),
    div: (c, u) => X(c * rs(u, e), e),
    // Same as above, but doesn't normalize
    sqrN: (c) => c * c,
    addN: (c, u) => c + u,
    subN: (c, u) => c - u,
    mulN: (c, u) => c * u,
    inv: (c) => rs(c, e),
    sqrt: r.sqrt || ((c) => (i || (i = r1(e)), i(a, c))),
    toBytes: (c) => n ? ra(c, o) : wn(c, o),
    fromBytes: (c) => {
      if (c.length !== o)
        throw new Error("Field.fromBytes: expected " + o + " bytes, got " + c.length);
      return n ? na(c) : Je(c);
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (c) => Ja(a, c),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (c, u, f) => f ? u : c
  });
  return Object.freeze(a);
}
function Qa(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function ec(e) {
  const t = Qa(e);
  return t + Math.ceil(t / 2);
}
function a1(e, t, n = !1) {
  const r = e.length, s = Qa(t), o = ec(t);
  if (r < 16 || r < o || r > 1024)
    throw new Error("expected " + o + "-1024 bytes of input, got " + r);
  const i = n ? na(e) : Je(e), a = X(i, t - Y) + Y;
  return n ? ra(a, s) : wn(a, s);
}
const Go = BigInt(0), ss = BigInt(1);
function Er(e, t) {
  const n = t.negate();
  return e ? n : t;
}
function tc(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function Pr(e, t) {
  tc(e, t);
  const n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), s = 2 ** e, o = Yn(e), i = BigInt(e);
  return { windows: n, windowSize: r, mask: o, maxNumber: s, shiftBy: i };
}
function Do(e, t, n) {
  const { windowSize: r, mask: s, maxNumber: o, shiftBy: i } = n;
  let a = Number(e & s), c = e >> i;
  a > r && (a -= o, c += ss);
  const u = t * r, f = u + Math.abs(a) - 1, d = a === 0, l = a < 0, h = t % 2 !== 0;
  return { nextN: c, offset: f, isZero: d, isNeg: l, isNegF: h, offsetF: u };
}
function c1(e, t) {
  if (!Array.isArray(e))
    throw new Error("array expected");
  e.forEach((n, r) => {
    if (!(n instanceof t))
      throw new Error("invalid point at index " + r);
  });
}
function u1(e, t) {
  if (!Array.isArray(e))
    throw new Error("array of scalars expected");
  e.forEach((n, r) => {
    if (!t.isValid(n))
      throw new Error("invalid scalar at index " + r);
  });
}
const Ar = /* @__PURE__ */ new WeakMap(), nc = /* @__PURE__ */ new WeakMap();
function $r(e) {
  return nc.get(e) || 1;
}
function f1(e, t) {
  return {
    constTimeNegate: Er,
    hasPrecomputes(n) {
      return $r(n) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(n, r, s = e.ZERO) {
      let o = n;
      for (; r > Go; )
        r & ss && (s = s.add(o)), o = o.double(), r >>= ss;
      return s;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(n, r) {
      const { windows: s, windowSize: o } = Pr(r, t), i = [];
      let a = n, c = a;
      for (let u = 0; u < s; u++) {
        c = a, i.push(c);
        for (let f = 1; f < o; f++)
          c = c.add(a), i.push(c);
        a = c.double();
      }
      return i;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(n, r, s) {
      let o = e.ZERO, i = e.BASE;
      const a = Pr(n, t);
      for (let c = 0; c < a.windows; c++) {
        const { nextN: u, offset: f, isZero: d, isNeg: l, isNegF: h, offsetF: p } = Do(s, c, a);
        s = u, d ? i = i.add(Er(h, r[p])) : o = o.add(Er(l, r[f]));
      }
      return { p: o, f: i };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(n, r, s, o = e.ZERO) {
      const i = Pr(n, t);
      for (let a = 0; a < i.windows && s !== Go; a++) {
        const { nextN: c, offset: u, isZero: f, isNeg: d } = Do(s, a, i);
        if (s = c, !f) {
          const l = r[u];
          o = o.add(d ? l.negate() : l);
        }
      }
      return o;
    },
    getPrecomputes(n, r, s) {
      let o = Ar.get(r);
      return o || (o = this.precomputeWindow(r, n), n !== 1 && Ar.set(r, s(o))), o;
    },
    wNAFCached(n, r, s) {
      const o = $r(n);
      return this.wNAF(o, this.getPrecomputes(o, n, s), r);
    },
    wNAFCachedUnsafe(n, r, s, o) {
      const i = $r(n);
      return i === 1 ? this.unsafeLadder(n, r, o) : this.wNAFUnsafe(i, this.getPrecomputes(i, n, s), r, o);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(n, r) {
      tc(r, t), nc.set(n, r), Ar.delete(n);
    }
  };
}
function d1(e, t, n, r) {
  c1(n, e), u1(r, t);
  const s = n.length, o = r.length;
  if (s !== o)
    throw new Error("arrays of points and scalars must have equal length");
  const i = e.ZERO, a = If(BigInt(s));
  let c = 1;
  a > 12 ? c = a - 3 : a > 4 ? c = a - 2 : a > 0 && (c = 2);
  const u = Yn(c), f = new Array(Number(u) + 1).fill(i), d = Math.floor((t.BITS - 1) / c) * c;
  let l = i;
  for (let h = d; h >= 0; h -= c) {
    f.fill(i);
    for (let m = 0; m < o; m++) {
      const E = r[m], g = Number(E >> BigInt(h) & u);
      f[g] = f[g].add(n[m]);
    }
    let p = i;
    for (let m = f.length - 1, E = i; m > 0; m--)
      E = E.add(f[m]), p = p.add(E);
    if (l = l.add(p), h !== 0)
      for (let m = 0; m < c; m++)
        l = l.double();
  }
  return l;
}
function rc(e) {
  return o1(e.Fp), Jn(e, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  }), Object.freeze({
    ...Xa(e.n, e.nBitLength),
    ...e,
    p: e.Fp.ORDER
  });
}
function Ho(e) {
  e.lowS !== void 0 && cn("lowS", e.lowS), e.prehash !== void 0 && cn("prehash", e.prehash);
}
function l1(e) {
  const t = rc(e);
  Jn(t, {
    a: "field",
    b: "field"
  }, {
    allowInfinityPoint: "boolean",
    allowedPrivateKeyLengths: "array",
    clearCofactor: "function",
    fromBytes: "function",
    isTorsionFree: "function",
    toBytes: "function",
    wrapPrivateKey: "boolean"
  });
  const { endo: n, Fp: r, a: s } = t;
  if (n) {
    if (!r.eql(s, r.ZERO))
      throw new Error("invalid endo: CURVE.a must be 0");
    if (typeof n != "object" || typeof n.beta != "bigint" || typeof n.splitScalar != "function")
      throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
  }
  return Object.freeze({ ...t });
}
class h1 extends Error {
  constructor(t = "") {
    super(t);
  }
}
const Te = {
  // asn.1 DER encoding utils
  Err: h1,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: n } = Te;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new n("tlv.encode: unpadded data");
      const r = t.length / 2, s = $n(r);
      if (s.length / 2 & 128)
        throw new n("tlv.encode: long form length too big");
      const o = r > 127 ? $n(s.length / 2 | 128) : "";
      return $n(e) + o + s + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: n } = Te;
      let r = 0;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length < 2 || t[r++] !== e)
        throw new n("tlv.decode: wrong tlv");
      const s = t[r++], o = !!(s & 128);
      let i = 0;
      if (!o)
        i = s;
      else {
        const c = s & 127;
        if (!c)
          throw new n("tlv.decode(long): indefinite length not supported");
        if (c > 4)
          throw new n("tlv.decode(long): byte length is too big");
        const u = t.subarray(r, r + c);
        if (u.length !== c)
          throw new n("tlv.decode: length bytes not complete");
        if (u[0] === 0)
          throw new n("tlv.decode(long): zero leftmost byte");
        for (const f of u)
          i = i << 8 | f;
        if (r += c, i < 128)
          throw new n("tlv.decode(long): not minimal encoding");
      }
      const a = t.subarray(r, r + i);
      if (a.length !== i)
        throw new n("tlv.decode: wrong value length");
      return { v: a, l: t.subarray(r + i) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(e) {
      const { Err: t } = Te;
      if (e < ke)
        throw new t("integer: negative integers are not allowed");
      let n = $n(e);
      if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return n;
    },
    decode(e) {
      const { Err: t } = Te;
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return Je(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: n, _tlv: r } = Te, s = ce("signature", e), { v: o, l: i } = r.decode(48, s);
    if (i.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: a, l: c } = r.decode(2, o), { v: u, l: f } = r.decode(2, c);
    if (f.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: n.decode(a), s: n.decode(u) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: n } = Te, r = t.encode(2, n.encode(e.r)), s = t.encode(2, n.encode(e.s)), o = r + s;
    return t.encode(48, o);
  }
};
function Br(e, t) {
  return un(wn(e, t));
}
const ke = BigInt(0), q = BigInt(1);
BigInt(2);
const Ir = BigInt(3), b1 = BigInt(4);
function p1(e) {
  const t = l1(e), { Fp: n } = t, r = Vs(t.n, t.nBitLength), s = t.toBytes || ((w, b, y) => {
    const A = b.toAffine();
    return Mn(Uint8Array.from([4]), n.toBytes(A.x), n.toBytes(A.y));
  }), o = t.fromBytes || ((w) => {
    const b = w.subarray(1), y = n.fromBytes(b.subarray(0, n.BYTES)), A = n.fromBytes(b.subarray(n.BYTES, 2 * n.BYTES));
    return { x: y, y: A };
  });
  function i(w) {
    const { a: b, b: y } = t, A = n.sqr(w), x = n.mul(A, w);
    return n.add(n.add(x, n.mul(w, b)), y);
  }
  function a(w, b) {
    const y = n.sqr(b), A = i(w);
    return n.eql(y, A);
  }
  if (!a(t.Gx, t.Gy))
    throw new Error("bad curve params: generator point");
  const c = n.mul(n.pow(t.a, Ir), b1), u = n.mul(n.sqr(t.b), BigInt(27));
  if (n.is0(n.add(c, u)))
    throw new Error("bad curve params: a or b");
  function f(w) {
    return Rs(w, q, t.n);
  }
  function d(w) {
    const { allowedPrivateKeyLengths: b, nByteLength: y, wrapPrivateKey: A, n: x } = t;
    if (b && typeof w != "bigint") {
      if (gn(w) && (w = un(w)), typeof w != "string" || !b.includes(w.length))
        throw new Error("invalid private key");
      w = w.padStart(y * 2, "0");
    }
    let B;
    try {
      B = typeof w == "bigint" ? w : Je(ce("private key", w, y));
    } catch {
      throw new Error("invalid private key, expected hex or " + y + " bytes, got " + typeof w);
    }
    return A && (B = X(B, x)), yt("private key", B, q, x), B;
  }
  function l(w) {
    if (!(w instanceof m))
      throw new Error("ProjectivePoint expected");
  }
  const h = Bo((w, b) => {
    const { px: y, py: A, pz: x } = w;
    if (n.eql(x, n.ONE))
      return { x: y, y: A };
    const B = w.is0();
    b == null && (b = B ? n.ONE : n.inv(x));
    const N = n.mul(y, b), v = n.mul(A, b), k = n.mul(x, b);
    if (B)
      return { x: n.ZERO, y: n.ZERO };
    if (!n.eql(k, n.ONE))
      throw new Error("invZ was invalid");
    return { x: N, y: v };
  }), p = Bo((w) => {
    if (w.is0()) {
      if (t.allowInfinityPoint && !n.is0(w.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: b, y } = w.toAffine();
    if (!n.isValid(b) || !n.isValid(y))
      throw new Error("bad point: x or y not FE");
    if (!a(b, y))
      throw new Error("bad point: equation left != right");
    if (!w.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  class m {
    constructor(b, y, A) {
      if (b == null || !n.isValid(b))
        throw new Error("x required");
      if (y == null || !n.isValid(y) || n.is0(y))
        throw new Error("y required");
      if (A == null || !n.isValid(A))
        throw new Error("z required");
      this.px = b, this.py = y, this.pz = A, Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(b) {
      const { x: y, y: A } = b || {};
      if (!b || !n.isValid(y) || !n.isValid(A))
        throw new Error("invalid affine point");
      if (b instanceof m)
        throw new Error("projective point not allowed");
      const x = (B) => n.eql(B, n.ZERO);
      return x(y) && x(A) ? m.ZERO : new m(y, A, n.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(b) {
      const y = Ja(n, b.map((A) => A.pz));
      return b.map((A, x) => A.toAffine(y[x])).map(m.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(b) {
      const y = m.fromAffine(o(ce("pointHex", b)));
      return y.assertValidity(), y;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(b) {
      return m.BASE.multiply(d(b));
    }
    // Multiscalar Multiplication
    static msm(b, y) {
      return d1(m, r, b, y);
    }
    // "Private method", don't use it directly
    _setWindowSize(b) {
      P.setWindowSize(this, b);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      p(this);
    }
    hasEvenY() {
      const { y: b } = this.toAffine();
      if (n.isOdd)
        return !n.isOdd(b);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(b) {
      l(b);
      const { px: y, py: A, pz: x } = this, { px: B, py: N, pz: v } = b, k = n.eql(n.mul(y, v), n.mul(B, x)), O = n.eql(n.mul(A, v), n.mul(N, x));
      return k && O;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new m(this.px, n.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: b, b: y } = t, A = n.mul(y, Ir), { px: x, py: B, pz: N } = this;
      let v = n.ZERO, k = n.ZERO, O = n.ZERO, R = n.mul(x, x), U = n.mul(B, B), S = n.mul(N, N), I = n.mul(x, B);
      return I = n.add(I, I), O = n.mul(x, N), O = n.add(O, O), v = n.mul(b, O), k = n.mul(A, S), k = n.add(v, k), v = n.sub(U, k), k = n.add(U, k), k = n.mul(v, k), v = n.mul(I, v), O = n.mul(A, O), S = n.mul(b, S), I = n.sub(R, S), I = n.mul(b, I), I = n.add(I, O), O = n.add(R, R), R = n.add(O, R), R = n.add(R, S), R = n.mul(R, I), k = n.add(k, R), S = n.mul(B, N), S = n.add(S, S), R = n.mul(S, I), v = n.sub(v, R), O = n.mul(S, U), O = n.add(O, O), O = n.add(O, O), new m(v, k, O);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(b) {
      l(b);
      const { px: y, py: A, pz: x } = this, { px: B, py: N, pz: v } = b;
      let k = n.ZERO, O = n.ZERO, R = n.ZERO;
      const U = t.a, S = n.mul(t.b, Ir);
      let I = n.mul(y, B), F = n.mul(A, N), T = n.mul(x, v), C = n.add(y, A), L = n.add(B, N);
      C = n.mul(C, L), L = n.add(I, F), C = n.sub(C, L), L = n.add(y, x);
      let _ = n.add(B, v);
      return L = n.mul(L, _), _ = n.add(I, T), L = n.sub(L, _), _ = n.add(A, x), k = n.add(N, v), _ = n.mul(_, k), k = n.add(F, T), _ = n.sub(_, k), R = n.mul(U, L), k = n.mul(S, T), R = n.add(k, R), k = n.sub(F, R), R = n.add(F, R), O = n.mul(k, R), F = n.add(I, I), F = n.add(F, I), T = n.mul(U, T), L = n.mul(S, L), F = n.add(F, T), T = n.sub(I, T), T = n.mul(U, T), L = n.add(L, T), I = n.mul(F, L), O = n.add(O, I), I = n.mul(_, L), k = n.mul(C, k), k = n.sub(k, I), I = n.mul(C, F), R = n.mul(_, R), R = n.add(R, I), new m(k, O, R);
    }
    subtract(b) {
      return this.add(b.negate());
    }
    is0() {
      return this.equals(m.ZERO);
    }
    wNAF(b) {
      return P.wNAFCached(this, b, m.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(b) {
      const { endo: y, n: A } = t;
      yt("scalar", b, ke, A);
      const x = m.ZERO;
      if (b === ke)
        return x;
      if (this.is0() || b === q)
        return this;
      if (!y || P.hasPrecomputes(this))
        return P.wNAFCachedUnsafe(this, b, m.normalizeZ);
      let { k1neg: B, k1: N, k2neg: v, k2: k } = y.splitScalar(b), O = x, R = x, U = this;
      for (; N > ke || k > ke; )
        N & q && (O = O.add(U)), k & q && (R = R.add(U)), U = U.double(), N >>= q, k >>= q;
      return B && (O = O.negate()), v && (R = R.negate()), R = new m(n.mul(R.px, y.beta), R.py, R.pz), O.add(R);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(b) {
      const { endo: y, n: A } = t;
      yt("scalar", b, q, A);
      let x, B;
      if (y) {
        const { k1neg: N, k1: v, k2neg: k, k2: O } = y.splitScalar(b);
        let { p: R, f: U } = this.wNAF(v), { p: S, f: I } = this.wNAF(O);
        R = P.constTimeNegate(N, R), S = P.constTimeNegate(k, S), S = new m(n.mul(S.px, y.beta), S.py, S.pz), x = R.add(S), B = U.add(I);
      } else {
        const { p: N, f: v } = this.wNAF(b);
        x = N, B = v;
      }
      return m.normalizeZ([x, B])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(b, y, A) {
      const x = m.BASE, B = (v, k) => k === ke || k === q || !v.equals(x) ? v.multiplyUnsafe(k) : v.multiply(k), N = B(this, y).add(B(b, A));
      return N.is0() ? void 0 : N;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(b) {
      return h(this, b);
    }
    isTorsionFree() {
      const { h: b, isTorsionFree: y } = t;
      if (b === q)
        return !0;
      if (y)
        return y(m, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: b, clearCofactor: y } = t;
      return b === q ? this : y ? y(m, this) : this.multiplyUnsafe(t.h);
    }
    toRawBytes(b = !0) {
      return cn("isCompressed", b), this.assertValidity(), s(m, this, b);
    }
    toHex(b = !0) {
      return cn("isCompressed", b), un(this.toRawBytes(b));
    }
  }
  m.BASE = new m(t.Gx, t.Gy, n.ONE), m.ZERO = new m(n.ZERO, n.ONE, n.ZERO);
  const { endo: E, nBitLength: g } = t, P = f1(m, E ? Math.ceil(g / 2) : g);
  return {
    CURVE: t,
    ProjectivePoint: m,
    normPrivateKeyToScalar: d,
    weierstrassEquation: i,
    isWithinCurveOrder: f
  };
}
function m1(e) {
  const t = rc(e);
  return Jn(t, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  }), Object.freeze({ lowS: !0, ...t });
}
function y1(e) {
  const t = m1(e), { Fp: n, n: r, nByteLength: s, nBitLength: o } = t, i = n.BYTES + 1, a = 2 * n.BYTES + 1;
  function c(S) {
    return X(S, r);
  }
  function u(S) {
    return rs(S, r);
  }
  const { ProjectivePoint: f, normPrivateKeyToScalar: d, weierstrassEquation: l, isWithinCurveOrder: h } = p1({
    ...t,
    toBytes(S, I, F) {
      const T = I.toAffine(), C = n.toBytes(T.x), L = Mn;
      return cn("isCompressed", F), F ? L(Uint8Array.from([I.hasEvenY() ? 2 : 3]), C) : L(Uint8Array.from([4]), C, n.toBytes(T.y));
    },
    fromBytes(S) {
      const I = S.length, F = S[0], T = S.subarray(1);
      if (I === i && (F === 2 || F === 3)) {
        const C = Je(T);
        if (!Rs(C, q, n.ORDER))
          throw new Error("Point is not on curve");
        const L = l(C);
        let _;
        try {
          _ = n.sqrt(L);
        } catch (J) {
          const Z = J instanceof Error ? ": " + J.message : "";
          throw new Error("Point is not on curve" + Z);
        }
        const G = (_ & q) === q;
        return (F & 1) === 1 !== G && (_ = n.neg(_)), { x: C, y: _ };
      } else if (I === a && F === 4) {
        const C = n.fromBytes(T.subarray(0, n.BYTES)), L = n.fromBytes(T.subarray(n.BYTES, 2 * n.BYTES));
        return { x: C, y: L };
      } else {
        const C = i, L = a;
        throw new Error("invalid Point, expected length of " + C + ", or uncompressed " + L + ", got " + I);
      }
    }
  });
  function p(S) {
    const I = r >> q;
    return S > I;
  }
  function m(S) {
    return p(S) ? c(-S) : S;
  }
  const E = (S, I, F) => Je(S.slice(I, F));
  class g {
    constructor(I, F, T) {
      yt("r", I, q, r), yt("s", F, q, r), this.r = I, this.s = F, T != null && (this.recovery = T), Object.freeze(this);
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(I) {
      const F = s;
      return I = ce("compactSignature", I, F * 2), new g(E(I, 0, F), E(I, F, 2 * F));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(I) {
      const { r: F, s: T } = Te.toSig(ce("DER", I));
      return new g(F, T);
    }
    /**
     * @todo remove
     * @deprecated
     */
    assertValidity() {
    }
    addRecoveryBit(I) {
      return new g(this.r, this.s, I);
    }
    recoverPublicKey(I) {
      const { r: F, s: T, recovery: C } = this, L = x(ce("msgHash", I));
      if (C == null || ![0, 1, 2, 3].includes(C))
        throw new Error("recovery id invalid");
      const _ = C === 2 || C === 3 ? F + t.n : F;
      if (_ >= n.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const G = (C & 1) === 0 ? "02" : "03", de = f.fromHex(G + Br(_, n.BYTES)), J = u(_), Z = c(-L * J), it = c(T * J), ze = f.BASE.multiplyAndAddUnsafe(de, Z, it);
      if (!ze)
        throw new Error("point at infinify");
      return ze.assertValidity(), ze;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return p(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new g(this.r, c(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return zn(this.toDERHex());
    }
    toDERHex() {
      return Te.hexFromSig(this);
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return zn(this.toCompactHex());
    }
    toCompactHex() {
      const I = s;
      return Br(this.r, I) + Br(this.s, I);
    }
  }
  const P = {
    isValidPrivateKey(S) {
      try {
        return d(S), !0;
      } catch {
        return !1;
      }
    },
    normPrivateKeyToScalar: d,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const S = ec(t.n);
      return a1(t.randomBytes(S), t.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(S = 8, I = f.BASE) {
      return I._setWindowSize(S), I.multiply(BigInt(3)), I;
    }
  };
  function w(S, I = !0) {
    return f.fromPrivateKey(S).toRawBytes(I);
  }
  function b(S) {
    if (typeof S == "bigint")
      return !1;
    if (S instanceof f)
      return !0;
    const F = ce("key", S).length, T = n.BYTES, C = T + 1, L = 2 * T + 1;
    if (!(t.allowedPrivateKeyLengths || s === C))
      return F === C || F === L;
  }
  function y(S, I, F = !0) {
    if (b(S) === !0)
      throw new Error("first arg must be private key");
    if (b(I) === !1)
      throw new Error("second arg must be public key");
    return f.fromHex(I).multiply(d(S)).toRawBytes(F);
  }
  const A = t.bits2int || function(S) {
    if (S.length > 8192)
      throw new Error("input is too large");
    const I = Je(S), F = S.length * 8 - o;
    return F > 0 ? I >> BigInt(F) : I;
  }, x = t.bits2int_modN || function(S) {
    return c(A(S));
  }, B = Yn(o);
  function N(S) {
    return yt("num < 2^" + o, S, ke, B), wn(S, s);
  }
  function v(S, I, F = k) {
    if (["recovered", "canonical"].some((qe) => qe in F))
      throw new Error("sign() legacy options not supported");
    const { hash: T, randomBytes: C } = t;
    let { lowS: L, prehash: _, extraEntropy: G } = F;
    L == null && (L = !0), S = ce("msgHash", S), Ho(F), _ && (S = ce("prehashed msgHash", T(S)));
    const de = x(S), J = d(I), Z = [N(J), N(de)];
    if (G != null && G !== !1) {
      const qe = G === !0 ? C(n.BYTES) : G;
      Z.push(ce("extraEntropy", qe));
    }
    const it = Mn(...Z), ze = de;
    function or(qe) {
      const at = A(qe);
      if (!h(at))
        return;
      const ir = u(at), Nt = f.BASE.multiply(at).toAffine(), Ve = c(Nt.x);
      if (Ve === ke)
        return;
      const Ot = c(ir * c(ze + Ve * J));
      if (Ot === ke)
        return;
      let ct = (Nt.x === Ve ? 0 : 2) | Number(Nt.y & q), Ys = Ot;
      return L && p(Ot) && (Ys = m(Ot), ct ^= 1), new g(Ve, Ys, ct);
    }
    return { seed: it, k2sig: or };
  }
  const k = { lowS: t.lowS, prehash: !1 }, O = { lowS: t.lowS, prehash: !1 };
  function R(S, I, F = k) {
    const { seed: T, k2sig: C } = v(S, I, F), L = t;
    return Sf(L.hash.outputLen, L.nByteLength, L.hmac)(T, C);
  }
  f.BASE._setWindowSize(8);
  function U(S, I, F, T = O) {
    const C = S;
    I = ce("msgHash", I), F = ce("publicKey", F);
    const { lowS: L, prehash: _, format: G } = T;
    if (Ho(T), "strict" in T)
      throw new Error("options.strict was renamed to lowS");
    if (G !== void 0 && G !== "compact" && G !== "der")
      throw new Error("format must be compact or der");
    const de = typeof C == "string" || gn(C), J = !de && !G && typeof C == "object" && C !== null && typeof C.r == "bigint" && typeof C.s == "bigint";
    if (!de && !J)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    let Z, it;
    try {
      if (J && (Z = new g(C.r, C.s)), de) {
        try {
          G !== "compact" && (Z = g.fromDER(C));
        } catch (ct) {
          if (!(ct instanceof Te.Err))
            throw ct;
        }
        !Z && G !== "der" && (Z = g.fromCompact(C));
      }
      it = f.fromHex(F);
    } catch {
      return !1;
    }
    if (!Z || L && Z.hasHighS())
      return !1;
    _ && (I = t.hash(I));
    const { r: ze, s: or } = Z, qe = x(I), at = u(or), ir = c(qe * at), Nt = c(ze * at), Ve = f.BASE.multiplyAndAddUnsafe(it, ir, Nt)?.toAffine();
    return Ve ? c(Ve.x) === ze : !1;
  }
  return {
    CURVE: t,
    getPublicKey: w,
    getSharedSecret: y,
    sign: R,
    verify: U,
    ProjectivePoint: f,
    Signature: g,
    utils: P
  };
}
function g1(e) {
  return {
    hash: e,
    hmac: (t, ...n) => La(e, t, ju(...n)),
    randomBytes: Lu
  };
}
function w1(e, t) {
  const n = (r) => y1({ ...e, ...g1(r) });
  return { ...n(t), create: n };
}
const sc = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), qo = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), x1 = BigInt(0), v1 = BigInt(1), os = BigInt(2), Vo = (e, t) => (e + t / os) / t;
function E1(e) {
  const t = sc, n = BigInt(3), r = BigInt(6), s = BigInt(11), o = BigInt(22), i = BigInt(23), a = BigInt(44), c = BigInt(88), u = e * e * e % t, f = u * u * e % t, d = ae(f, n, t) * f % t, l = ae(d, n, t) * f % t, h = ae(l, os, t) * u % t, p = ae(h, s, t) * h % t, m = ae(p, o, t) * p % t, E = ae(m, a, t) * m % t, g = ae(E, c, t) * E % t, P = ae(g, a, t) * m % t, w = ae(P, n, t) * f % t, b = ae(w, i, t) * p % t, y = ae(b, r, t) * u % t, A = ae(y, os, t);
  if (!is.eql(is.sqr(A), e))
    throw new Error("Cannot find square root");
  return A;
}
const is = Vs(sc, void 0, void 0, { sqrt: E1 }), oc = w1({
  a: x1,
  b: BigInt(7),
  Fp: is,
  n: qo,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  lowS: !0,
  // Allow only low-S signatures by default in sign() and verify()
  endo: {
    // Endomorphism, see above
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (e) => {
      const t = qo, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -v1 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = Vo(o * e, t), c = Vo(-r * e, t);
      let u = X(e - a * n - c * s, t), f = X(-a * r - c * o, t);
      const d = u > i, l = f > i;
      if (d && (u = t - u), l && (f = t - f), u > i || f > i)
        throw new Error("splitScalar: Endomorphism failed, k=" + e);
      return { k1neg: d, k1: u, k2neg: l, k2: f };
    }
  }
}, Zi), P1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  secp256k1: oc
}, Symbol.toStringTag, { value: "Module" }));
function ic(e, t = {}) {
  const { recovered: n } = t;
  if (typeof e.r > "u")
    throw new Sr({ signature: e });
  if (typeof e.s > "u")
    throw new Sr({ signature: e });
  if (n && typeof e.yParity > "u")
    throw new Sr({ signature: e });
  if (e.r < 0n || e.r > Uo)
    throw new k1({ value: e.r });
  if (e.s < 0n || e.s > Uo)
    throw new N1({ value: e.s });
  if (typeof e.yParity == "number" && e.yParity !== 0 && e.yParity !== 1)
    throw new Zs({ value: e.yParity });
}
function A1(e) {
  return ac(me(e));
}
function ac(e) {
  if (e.length !== 130 && e.length !== 132)
    throw new T1({ signature: e });
  const t = BigInt(xe(e, 0, 32)), n = BigInt(xe(e, 32, 64)), r = (() => {
    const s = +`0x${e.slice(130)}`;
    if (!Number.isNaN(s))
      try {
        return Ws(s);
      } catch {
        throw new Zs({ value: s });
      }
  })();
  return typeof r > "u" ? {
    r: t,
    s: n
  } : {
    r: t,
    s: n,
    yParity: r
  };
}
function $1(e) {
  if (!(typeof e.r > "u") && !(typeof e.s > "u"))
    return B1(e);
}
function B1(e) {
  const t = typeof e == "string" ? ac(e) : e instanceof Uint8Array ? A1(e) : typeof e.r == "string" ? S1(e) : e.v ? I1(e) : {
    r: e.r,
    s: e.s,
    ...typeof e.yParity < "u" ? { yParity: e.yParity } : {}
  };
  return ic(t), t;
}
function I1(e) {
  return {
    r: e.r,
    s: e.s,
    yParity: Ws(e.v)
  };
}
function S1(e) {
  const t = (() => {
    const n = e.v ? Number(e.v) : void 0;
    let r = e.yParity ? Number(e.yParity) : void 0;
    if (typeof n == "number" && typeof r != "number" && (r = Ws(n)), typeof r != "number")
      throw new Zs({ value: e.yParity });
    return r;
  })();
  return {
    r: BigInt(e.r),
    s: BigInt(e.s),
    yParity: t
  };
}
function Ws(e) {
  if (e === 0 || e === 27)
    return 0;
  if (e === 1 || e === 28)
    return 1;
  if (e >= 35)
    return e % 2 === 0 ? 1 : 0;
  throw new O1({ value: e });
}
class T1 extends j {
  constructor({ signature: t }) {
    super(`Value \`${t}\` is an invalid signature size.`, {
      metaMessages: [
        "Expected: 64 bytes or 65 bytes.",
        `Received ${ie(Qf(t))} bytes.`
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Signature.InvalidSerializedSizeError"
    });
  }
}
class Sr extends j {
  constructor({ signature: t }) {
    super(`Signature \`${aa(t)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Signature.MissingPropertiesError"
    });
  }
}
class k1 extends j {
  constructor({ value: t }) {
    super(`Value \`${t}\` is an invalid r value. r must be a positive integer less than 2^256.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Signature.InvalidRError"
    });
  }
}
class N1 extends j {
  constructor({ value: t }) {
    super(`Value \`${t}\` is an invalid s value. s must be a positive integer less than 2^256.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Signature.InvalidSError"
    });
  }
}
class Zs extends j {
  constructor({ value: t }) {
    super(`Value \`${t}\` is an invalid y-parity value. Y-parity must be 0 or 1.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Signature.InvalidYParityError"
    });
  }
}
class O1 extends j {
  constructor({ value: t }) {
    super(`Value \`${t}\` is an invalid v value. v must be 27, 28 or >=35.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Signature.InvalidVError"
    });
  }
}
function R1(e, t = {}) {
  return typeof e.chainId == "string" ? C1(e) : { ...e, ...t.signature };
}
function C1(e) {
  const { address: t, chainId: n, nonce: r } = e, s = $1(e);
  return {
    address: t,
    chainId: Number(n),
    nonce: BigInt(r),
    ...s
  };
}
const F1 = "0x8010801080108010801080108010801080108010801080108010801080108010", z1 = Ha("(uint256 chainId, address delegation, uint256 nonce, uint8 yParity, uint256 r, uint256 s), address to, bytes data");
function cc(e) {
  if (typeof e == "string") {
    if (xe(e, -32) !== F1)
      throw new j1(e);
  } else
    ic(e.authorization);
}
function M1(e) {
  cc(e);
  const t = la(xe(e, -64, -32)), n = xe(e, -t - 64, -64), r = xe(e, 0, -t - 64), [s, o, i] = Kl(z1, n);
  return {
    authorization: R1({
      address: s.delegation,
      chainId: Number(s.chainId),
      nonce: s.nonce,
      yParity: s.yParity,
      r: s.r,
      s: s.s
    }),
    signature: r,
    ...i && i !== "0x" ? { data: i, to: o } : {}
  };
}
function U1(e) {
  try {
    return cc(e), !0;
  } catch {
    return !1;
  }
}
let j1 = class extends j {
  constructor(t) {
    super(`Value \`${t}\` is an invalid ERC-8010 wrapped signature.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "SignatureErc8010.InvalidWrappedSignatureError"
    });
  }
};
function L1(e) {
  return e.map((t) => ({
    ...t,
    value: BigInt(t.value)
  }));
}
function _1(e) {
  return {
    ...e,
    balance: e.balance ? BigInt(e.balance) : void 0,
    nonce: e.nonce ? Ce(e.nonce) : void 0,
    storageProof: e.storageProof ? L1(e.storageProof) : void 0
  };
}
async function G1(e, { address: t, blockNumber: n, blockTag: r, storageKeys: s }) {
  const o = r ?? "latest", i = n !== void 0 ? M(n) : void 0, a = await e.request({
    method: "eth_getProof",
    params: [t, s, i || o]
  });
  return _1(a);
}
async function D1(e, { address: t, blockNumber: n, blockTag: r = "latest", slot: s }) {
  const o = n !== void 0 ? M(n) : void 0;
  return await e.request({
    method: "eth_getStorageAt",
    params: [t, s, o || r]
  });
}
async function Ks(e, { blockHash: t, blockNumber: n, blockTag: r, hash: s, index: o, sender: i, nonce: a }) {
  const c = r || "latest", u = n !== void 0 ? M(n) : void 0;
  let f = null;
  if (s ? f = await e.request({
    method: "eth_getTransactionByHash",
    params: [s]
  }, { dedupe: !0 }) : t ? f = await e.request({
    method: "eth_getTransactionByBlockHashAndIndex",
    params: [t, M(o)]
  }, { dedupe: !0 }) : typeof o == "number" ? f = await e.request({
    method: "eth_getTransactionByBlockNumberAndIndex",
    params: [u || c, M(o)]
  }, { dedupe: !!u }) : i && typeof a == "number" && (f = await e.request({
    method: "eth_getTransactionBySenderAndNonce",
    params: [i, M(a)]
  }, { dedupe: !0 })), !f)
    throw new Ri({
      blockHash: t,
      blockNumber: n,
      blockTag: c,
      hash: s,
      index: o
    });
  return (e.chain?.formatters?.transaction?.format || As)(f, "getTransaction");
}
async function H1(e, { hash: t, transactionReceipt: n }) {
  const [r, s] = await Promise.all([
    z(e, Pn, "getBlockNumber")({}),
    t ? z(e, Ks, "getTransaction")({ hash: t }) : void 0
  ]), o = n?.blockNumber || s?.blockNumber;
  return o ? r - o + 1n : 0n;
}
async function Tn(e, { hash: t }) {
  const n = await e.request({
    method: "eth_getTransactionReceipt",
    params: [t]
  }, { dedupe: !0 });
  if (!n)
    throw new Ci({ hash: t });
  return (e.chain?.formatters?.transactionReceipt?.format || $a)(n, "getTransactionReceipt");
}
async function q1(e, t) {
  const { account: n, authorizationList: r, allowFailure: s = !0, blockNumber: o, blockOverrides: i, blockTag: a, stateOverride: c } = t, u = t.contracts, { batchSize: f = t.batchSize ?? 1024, deployless: d = t.deployless ?? !1 } = typeof e.batch?.multicall == "object" ? e.batch.multicall : {}, l = (() => {
    if (t.multicallAddress)
      return t.multicallAddress;
    if (d)
      return null;
    if (e.chain)
      return kt({
        blockNumber: o,
        chain: e.chain,
        contract: "multicall3"
      });
    throw new Error("client chain not configured. multicallAddress is required.");
  })(), h = [[]];
  let p = 0, m = 0;
  for (let P = 0; P < u.length; P++) {
    const { abi: w, address: b, args: y, functionName: A } = u[P];
    try {
      const x = fe({ abi: w, args: y, functionName: A });
      m += (x.length - 2) / 2, // Check if batching is enabled.
      f > 0 && // Check if the current size of the batch exceeds the size limit.
      m > f && // Check if the current chunk is not already empty.
      h[p].length > 0 && (p++, m = (x.length - 2) / 2, h[p] = []), h[p] = [
        ...h[p],
        {
          allowFailure: !0,
          callData: x,
          target: b
        }
      ];
    } catch (x) {
      const B = Pt(x, {
        abi: w,
        address: b,
        args: y,
        docsPath: "/docs/contract/multicall",
        functionName: A,
        sender: n
      });
      if (!s)
        throw B;
      h[p] = [
        ...h[p],
        {
          allowFailure: !0,
          callData: "0x",
          target: b
        }
      ];
    }
  }
  const E = await Promise.allSettled(h.map((P) => z(e, ye, "readContract")({
    ...l === null ? { code: Fs } : { address: l },
    abi: At,
    account: n,
    args: [P],
    authorizationList: r,
    blockNumber: o,
    blockOverrides: i,
    blockTag: a,
    functionName: "aggregate3",
    stateOverride: c
  }))), g = [];
  for (let P = 0; P < E.length; P++) {
    const w = E[P];
    if (w.status === "rejected") {
      if (!s)
        throw w.reason;
      for (let y = 0; y < h[P].length; y++)
        g.push({
          status: "failure",
          error: w.reason,
          result: void 0
        });
      continue;
    }
    const b = w.value;
    for (let y = 0; y < b.length; y++) {
      const { returnData: A, success: x } = b[y], { callData: B } = h[P][y], { abi: N, address: v, functionName: k, args: O } = u[g.length];
      try {
        if (B === "0x")
          throw new dn();
        if (!x)
          throw new Wn({ data: A });
        const R = He({
          abi: N,
          args: O,
          data: A,
          functionName: k
        });
        g.push(s ? { result: R, status: "success" } : R);
      } catch (R) {
        const U = Pt(R, {
          abi: N,
          address: v,
          args: O,
          docsPath: "/docs/contract/multicall",
          functionName: k
        });
        if (!s)
          throw U;
        g.push({ error: U, result: void 0, status: "failure" });
      }
    }
  }
  if (g.length !== u.length)
    throw new $("multicall results mismatch");
  return g;
}
async function as(e, t) {
  const { blockNumber: n, blockTag: r = e.experimental_blockTag ?? "latest", blocks: s, returnFullTransactions: o, traceTransfers: i, validation: a } = t;
  try {
    const c = [];
    for (const l of s) {
      const h = l.blockOverrides ? pa(l.blockOverrides) : void 0, p = l.calls.map((E) => {
        const g = E, P = g.account ? oe(g.account) : void 0, w = g.abi ? fe(g) : g.data, b = {
          ...g,
          account: P,
          data: g.dataSuffix ? Ae([w || "0x", g.dataSuffix]) : w,
          from: g.from ?? P?.address
        };
        return Tt(b), yn(b);
      }), m = l.stateOverrides ? Es(l.stateOverrides) : void 0;
      c.push({
        blockOverrides: h,
        calls: p,
        stateOverrides: m
      });
    }
    const f = (typeof n == "bigint" ? M(n) : void 0) || r;
    return (await e.request({
      method: "eth_simulateV1",
      params: [
        { blockStateCalls: c, returnFullTransactions: o, traceTransfers: i, validation: a },
        f
      ]
    })).map((l, h) => ({
      ...Di(l),
      calls: l.calls.map((p, m) => {
        const { abi: E, args: g, functionName: P, to: w } = s[h].calls[m], b = p.error?.data ?? p.returnData, y = BigInt(p.gasUsed), A = p.logs?.map((v) => $e(v)), x = p.status === "0x1" ? "success" : "failure", B = E && x === "success" && b !== "0x" ? He({
          abi: E,
          data: b,
          functionName: P
        }) : null, N = (() => {
          if (x === "success")
            return;
          let v;
          if (b === "0x" ? v = new dn() : b && (v = new Wn({ data: b })), !!v)
            return Pt(v, {
              abi: E ?? [],
              address: w ?? "0x",
              args: g,
              functionName: P ?? "<unknown>"
            });
        })();
        return {
          data: b,
          gasUsed: y,
          logs: A,
          status: x,
          ...x === "success" ? {
            result: B
          } : {
            error: N
          }
        };
      })
    }));
  } catch (c) {
    const u = c, f = Zn(u, {});
    throw f instanceof mn ? u : f;
  }
}
function cs(e) {
  let t = !0, n = "", r = 0, s = "", o = !1;
  for (let i = 0; i < e.length; i++) {
    const a = e[i];
    if (["(", ")", ","].includes(a) && (t = !0), a === "(" && r++, a === ")" && r--, !!t) {
      if (r === 0) {
        if (a === " " && ["event", "function", "error", ""].includes(s))
          s = "";
        else if (s += a, a === ")") {
          o = !0;
          break;
        }
        continue;
      }
      if (a === " ") {
        e[i - 1] !== "," && n !== "," && n !== ",(" && (n = "", t = !1);
        continue;
      }
      s += a, n += a;
    }
  }
  if (!o)
    throw new j("Unable to normalize signature.");
  return s;
}
function us(e, t) {
  const n = typeof e, r = t.type;
  switch (r) {
    case "address":
      return es(e, { strict: !1 });
    case "bool":
      return n === "boolean";
    case "function":
      return n === "string";
    case "string":
      return n === "string";
    default:
      return r === "tuple" && "components" in t ? Object.values(t.components).every((s, o) => us(Object.values(e)[o], s)) : /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(r) ? n === "number" || n === "bigint" : /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(r) ? n === "string" || e instanceof Uint8Array : /[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(r) ? Array.isArray(e) && e.every((s) => us(s, {
        ...t,
        // Pop off `[]` or `[M]` from end of type
        type: r.replace(/(\[[0-9]{0,}\])$/, "")
      })) : !1;
  }
}
function uc(e, t, n) {
  for (const r in e) {
    const s = e[r], o = t[r];
    if (s.type === "tuple" && o.type === "tuple" && "components" in s && "components" in o)
      return uc(s.components, o.components, n[r]);
    const i = [s.type, o.type];
    if (i.includes("address") && i.includes("bytes20") ? !0 : i.includes("address") && i.includes("string") ? es(n[r], {
      strict: !1
    }) : i.includes("address") && i.includes("bytes") ? es(n[r], {
      strict: !1
    }) : !1)
      return i;
  }
}
function fc(e, t = {}) {
  const { prepare: n = !0 } = t, r = Array.isArray(e) || typeof e == "string" ? Qs(e) : e;
  return {
    ...r,
    ...n ? { hash: bt(r) } : {}
  };
}
function rr(e, t, n) {
  const { args: r = [], prepare: s = !0 } = n ?? {}, o = ed(t, { strict: !1 }), i = e.filter((u) => o ? u.type === "function" || u.type === "error" ? dc(u) === xe(t, 0, 4) : u.type === "event" ? bt(u) === t : !1 : "name" in u && u.name === t);
  if (i.length === 0)
    throw new jn({ name: t });
  if (i.length === 1)
    return {
      ...i[0],
      ...s ? { hash: bt(i[0]) } : {}
    };
  let a;
  for (const u of i) {
    if (!("inputs" in u))
      continue;
    if (!r || r.length === 0) {
      if (!u.inputs || u.inputs.length === 0)
        return {
          ...u,
          ...s ? { hash: bt(u) } : {}
        };
      continue;
    }
    if (!u.inputs || u.inputs.length === 0 || u.inputs.length !== r.length)
      continue;
    if (r.every((d, l) => {
      const h = "inputs" in u && u.inputs[l];
      return h ? us(d, h) : !1;
    })) {
      if (a && "inputs" in a && a.inputs) {
        const d = uc(u.inputs, a.inputs, r);
        if (d)
          throw new W1({
            abiItem: u,
            type: d[0]
          }, {
            abiItem: a,
            type: d[1]
          });
      }
      a = u;
    }
  }
  const c = (() => {
    if (a)
      return a;
    const [u, ...f] = i;
    return { ...u, overloads: f };
  })();
  if (!c)
    throw new jn({ name: t });
  return {
    ...c,
    ...s ? { hash: bt(c) } : {}
  };
}
function dc(...e) {
  const t = (() => {
    if (Array.isArray(e[0])) {
      const [n, r] = e;
      return rr(n, r);
    }
    return e[0];
  })();
  return xe(bt(t), 0, 4);
}
function V1(...e) {
  const t = (() => {
    if (Array.isArray(e[0])) {
      const [r, s] = e;
      return rr(r, s);
    }
    return e[0];
  })(), n = typeof t == "string" ? t : kn(t);
  return cs(n);
}
function bt(...e) {
  const t = (() => {
    if (Array.isArray(e[0])) {
      const [n, r] = e;
      return rr(n, r);
    }
    return e[0];
  })();
  return typeof t != "string" && "hash" in t && t.hash ? t.hash : _a(Cs(V1(t)));
}
class W1 extends j {
  constructor(t, n) {
    super("Found ambiguous types in overloaded ABI Items.", {
      metaMessages: [
        // TODO: abitype to add support for signature-formatted ABI items.
        `\`${t.type}\` in \`${cs(kn(t.abiItem))}\`, and`,
        `\`${n.type}\` in \`${cs(kn(n.abiItem))}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ]
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiItem.AmbiguityError"
    });
  }
}
class jn extends j {
  constructor({ name: t, data: n, type: r = "item" }) {
    const s = t ? ` with name "${t}"` : n ? ` with data "${n}"` : "";
    super(`ABI ${r}${s} not found.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AbiItem.NotFoundError"
    });
  }
}
function Z1(...e) {
  const [t, n] = (() => {
    if (Array.isArray(e[0])) {
      const [o, i] = e;
      return [Y1(o), i];
    }
    return e;
  })(), { bytecode: r, args: s } = n;
  return pe(r, t.inputs?.length && s?.length ? Hs(t.inputs, s) : "0x");
}
function K1(e) {
  return fc(e);
}
function Y1(e) {
  const t = e.find((n) => n.type === "constructor");
  if (!t)
    throw new jn({ name: "constructor" });
  return t;
}
function J1(...e) {
  const [t, n = []] = (() => {
    if (Array.isArray(e[0])) {
      const [u, f, d] = e;
      return [Wo(u, f, { args: d }), d];
    }
    const [a, c] = e;
    return [a, c];
  })(), { overloads: r } = t, s = r ? Wo([t, ...r], t.name, {
    args: n
  }) : t, o = X1(s), i = n.length > 0 ? Hs(s.inputs, n) : void 0;
  return i ? pe(o, i) : o;
}
function ft(e, t = {}) {
  return fc(e, t);
}
function Wo(e, t, n) {
  const r = rr(e, t, n);
  if (r.type !== "function")
    throw new jn({ name: t, type: "function" });
  return r;
}
function X1(e) {
  return dc(e);
}
const Q1 = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", le = "0x0000000000000000000000000000000000000000", eh = "0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033";
async function th(e, t) {
  const { blockNumber: n, blockTag: r, calls: s, stateOverrides: o, traceAssetChanges: i, traceTransfers: a, validation: c } = t, u = t.account ? oe(t.account) : void 0;
  if (i && !u)
    throw new $("`account` is required when `traceAssetChanges` is true");
  const f = u ? Z1(K1("constructor(bytes, bytes)"), {
    bytecode: wa,
    args: [
      eh,
      J1(ft("function getBalance(address)"), [u.address])
    ]
  }) : void 0, d = i ? await Promise.all(t.calls.map(async (T) => {
    if (!T.data && !T.abi)
      return;
    const { accessList: C } = await Na(e, {
      account: u.address,
      ...T,
      data: T.abi ? fe(T) : T.data
    });
    return C.map(({ address: L, storageKeys: _ }) => _.length > 0 ? L : null);
  })).then((T) => T.flat().filter(Boolean)) : [], l = await as(e, {
    blockNumber: n,
    blockTag: r,
    blocks: [
      ...i ? [
        // ETH pre balances
        {
          calls: [{ data: f }],
          stateOverrides: o
        },
        // Asset pre balances
        {
          calls: d.map((T, C) => ({
            abi: [
              ft("function balanceOf(address) returns (uint256)")
            ],
            functionName: "balanceOf",
            args: [u.address],
            to: T,
            from: le,
            nonce: C
          })),
          stateOverrides: [
            {
              address: le,
              nonce: 0
            }
          ]
        }
      ] : [],
      {
        calls: [...s, { to: le }].map((T) => ({
          ...T,
          from: u?.address
        })),
        stateOverrides: o
      },
      ...i ? [
        // ETH post balances
        {
          calls: [{ data: f }]
        },
        // Asset post balances
        {
          calls: d.map((T, C) => ({
            abi: [
              ft("function balanceOf(address) returns (uint256)")
            ],
            functionName: "balanceOf",
            args: [u.address],
            to: T,
            from: le,
            nonce: C
          })),
          stateOverrides: [
            {
              address: le,
              nonce: 0
            }
          ]
        },
        // Decimals
        {
          calls: d.map((T, C) => ({
            to: T,
            abi: [
              ft("function decimals() returns (uint256)")
            ],
            functionName: "decimals",
            from: le,
            nonce: C
          })),
          stateOverrides: [
            {
              address: le,
              nonce: 0
            }
          ]
        },
        // Token URI
        {
          calls: d.map((T, C) => ({
            to: T,
            abi: [
              ft("function tokenURI(uint256) returns (string)")
            ],
            functionName: "tokenURI",
            args: [0n],
            from: le,
            nonce: C
          })),
          stateOverrides: [
            {
              address: le,
              nonce: 0
            }
          ]
        },
        // Symbols
        {
          calls: d.map((T, C) => ({
            to: T,
            abi: [ft("function symbol() returns (string)")],
            functionName: "symbol",
            from: le,
            nonce: C
          })),
          stateOverrides: [
            {
              address: le,
              nonce: 0
            }
          ]
        }
      ] : []
    ],
    traceTransfers: a,
    validation: c
  }), h = i ? l[2] : l[0], [p, m, , E, g, P, w, b] = i ? l : [], { calls: y, ...A } = h, x = y.slice(0, -1) ?? [], B = p?.calls ?? [], N = m?.calls ?? [], v = [...B, ...N].map((T) => T.status === "success" ? Ee(T.data) : null), k = E?.calls ?? [], O = g?.calls ?? [], R = [...k, ...O].map((T) => T.status === "success" ? Ee(T.data) : null), U = (P?.calls ?? []).map((T) => T.status === "success" ? T.result : null), S = (b?.calls ?? []).map((T) => T.status === "success" ? T.result : null), I = (w?.calls ?? []).map((T) => T.status === "success" ? T.result : null), F = [];
  for (const [T, C] of R.entries()) {
    const L = v[T];
    if (typeof C != "bigint" || typeof L != "bigint")
      continue;
    const _ = U[T - 1], G = S[T - 1], de = I[T - 1], J = T === 0 ? {
      address: Q1,
      decimals: 18,
      symbol: "ETH"
    } : {
      address: d[T - 1],
      decimals: de || _ ? Number(_ ?? 1) : void 0,
      symbol: G ?? void 0
    };
    F.some((Z) => Z.token.address === J.address) || F.push({
      token: J,
      value: {
        pre: L,
        post: C,
        diff: C - L
      }
    });
  }
  return {
    assetChanges: F,
    block: A,
    results: x
  };
}
const lc = "0x6492649264926492649264926492649264926492649264926492649264926492";
function nh(e) {
  if (xe(e, -32) !== lc)
    throw new oh(e);
}
function rh(e) {
  const { data: t, signature: n, to: r } = e;
  return pe(Hs(Ha("address, bytes, bytes"), [
    r,
    t,
    n
  ]), lc);
}
function sh(e) {
  try {
    return nh(e), !0;
  } catch {
    return !1;
  }
}
class oh extends j {
  constructor(t) {
    super(`Value \`${t}\` is an invalid ERC-6492 wrapped signature.`), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "SignatureErc6492.InvalidWrappedSignatureError"
    });
  }
}
function ih({ r: e, s: t, to: n = "hex", v: r, yParity: s }) {
  const o = (() => {
    if (s === 0 || s === 1)
      return s;
    if (r && (r === 27n || r === 28n || r >= 35n))
      return r % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })(), i = `0x${new oc.Signature(Ee(e), Ee(t)).toCompactHex()}${o === 0 ? "1b" : "1c"}`;
  return n === "hex" ? i : Pe(i);
}
async function sr(e, t) {
  const { address: n, chain: r = e.chain, hash: s, erc6492VerifierAddress: o = t.universalSignatureVerifierAddress ?? r?.contracts?.erc6492Verifier?.address, multicallAddress: i = t.multicallAddress ?? r?.contracts?.multicall3?.address, mode: a = "auto" } = t;
  if (r?.verifyHash)
    return await r.verifyHash(e, t);
  const c = (() => {
    const u = t.signature;
    return ve(u) ? u : typeof u == "object" && "r" in u && "s" in u ? ih(u) : H(u);
  })();
  try {
    if (a === "eoa")
      try {
        if (an(On(n), await Mr({ hash: s, signature: c })))
          return !0;
      } catch {
      }
    return U1(c) ? await ah(e, {
      ...t,
      multicallAddress: i,
      signature: c
    }) : await ch(e, {
      ...t,
      verifierAddress: o,
      signature: c
    });
  } catch (u) {
    if (a !== "eoa")
      try {
        if (an(On(n), await Mr({ hash: s, signature: c })))
          return !0;
      } catch {
      }
    if (u instanceof rt)
      return !1;
    throw u;
  }
}
async function ah(e, t) {
  const { address: n, blockNumber: r, blockTag: s, hash: o, multicallAddress: i } = t, { authorization: a, data: c, signature: u, to: f } = M1(t.signature);
  if (await Un(e, {
    address: n,
    blockNumber: r,
    blockTag: s
  }) === St(["0xef0100", a.address]))
    return await uh(e, {
      address: n,
      blockNumber: r,
      blockTag: s,
      hash: o,
      signature: u
    });
  const l = {
    address: a.address,
    chainId: Number(a.chainId),
    nonce: Number(a.nonce),
    r: M(a.r, { size: 32 }),
    s: M(a.s, { size: 32 }),
    yParity: a.yParity
  };
  if (!await nl({
    address: n,
    authorization: l
  }))
    throw new rt();
  const p = await z(e, ye, "readContract")({
    ...i ? { address: i } : { code: Fs },
    authorizationList: [l],
    abi: At,
    blockNumber: r,
    blockTag: "pending",
    functionName: "aggregate3",
    args: [
      [
        ...c ? [
          {
            allowFailure: !0,
            target: f ?? n,
            callData: c
          }
        ] : [],
        {
          allowFailure: !0,
          target: n,
          callData: fe({
            abi: ga,
            functionName: "isValidSignature",
            args: [o, u]
          })
        }
      ]
    ]
  });
  if (p[p.length - 1]?.returnData?.startsWith("0x1626ba7e"))
    return !0;
  throw new rt();
}
async function ch(e, t) {
  const { address: n, factory: r, factoryData: s, hash: o, signature: i, verifierAddress: a, ...c } = t, u = await (async () => !r && !s || sh(i) ? i : rh({
    data: s,
    signature: i,
    to: r
  }))(), f = a ? {
    to: a,
    data: fe({
      abi: Oo,
      functionName: "isValidSig",
      args: [n, o, u]
    }),
    ...c
  } : {
    data: zs({
      abi: Oo,
      args: [n, o, u],
      bytecode: ad
    }),
    ...c
  }, { data: d } = await z(e, vn, "call")(f).catch((l) => {
    throw l instanceof Fi ? new rt() : l;
  });
  if (xu(d ?? "0x0"))
    return !0;
  throw new rt();
}
async function uh(e, t) {
  const { address: n, blockNumber: r, blockTag: s, hash: o, signature: i } = t;
  if ((await z(e, ye, "readContract")({
    address: n,
    abi: ga,
    args: [o, i],
    blockNumber: r,
    blockTag: s,
    functionName: "isValidSignature"
  }).catch((c) => {
    throw c instanceof zi ? new rt() : c;
  })).startsWith("0x1626ba7e"))
    return !0;
  throw new rt();
}
class rt extends Error {
}
async function fh(e, { address: t, message: n, factory: r, factoryData: s, signature: o, ...i }) {
  const a = Ca(n);
  return z(e, sr, "verifyHash")({
    address: t,
    factory: r,
    factoryData: s,
    hash: a,
    signature: o,
    ...i
  });
}
async function dh(e, t) {
  const { address: n, factory: r, factoryData: s, signature: o, message: i, primaryType: a, types: c, domain: u, ...f } = t, d = wl({ message: i, primaryType: a, types: c, domain: u });
  return z(e, sr, "verifyHash")({
    address: n,
    factory: r,
    factoryData: s,
    hash: d,
    signature: o,
    ...f
  });
}
function hc(e, { emitOnBegin: t = !1, emitMissed: n = !1, onBlockNumber: r, onError: s, poll: o, pollingInterval: i = e.pollingInterval }) {
  const a = typeof o < "u" ? o : !(e.transport.type === "webSocket" || e.transport.type === "ipc" || e.transport.type === "fallback" && (e.transport.transports[0].config.type === "webSocket" || e.transport.transports[0].config.type === "ipc"));
  let c;
  return a ? (() => {
    const d = W([
      "watchBlockNumber",
      e.uid,
      t,
      n,
      i
    ]);
    return De(d, { onBlockNumber: r, onError: s }, (l) => En(async () => {
      try {
        const h = await z(e, Pn, "getBlockNumber")({ cacheTime: 0 });
        if (c !== void 0) {
          if (h === c)
            return;
          if (h - c > 1 && n)
            for (let p = c + 1n; p < h; p++)
              l.onBlockNumber(p, c), c = p;
        }
        (c === void 0 || h > c) && (l.onBlockNumber(h, c), c = h);
      } catch (h) {
        l.onError?.(h);
      }
    }, {
      emitOnBegin: t,
      interval: i
    }));
  })() : (() => {
    const d = W([
      "watchBlockNumber",
      e.uid,
      t,
      n
    ]);
    return De(d, { onBlockNumber: r, onError: s }, (l) => {
      let h = !0, p = () => h = !1;
      return (async () => {
        try {
          const m = (() => {
            if (e.transport.type === "fallback") {
              const g = e.transport.transports.find((P) => P.config.type === "webSocket" || P.config.type === "ipc");
              return g ? g.value : e.transport;
            }
            return e.transport;
          })(), { unsubscribe: E } = await m.subscribe({
            params: ["newHeads"],
            onData(g) {
              if (!h)
                return;
              const P = Ee(g.result?.number);
              l.onBlockNumber(P, c), c = P;
            },
            onError(g) {
              l.onError?.(g);
            }
          });
          p = E, h || p();
        } catch (m) {
          s?.(m);
        }
      })(), () => p();
    });
  })();
}
async function lh(e, t) {
  const {
    checkReplacement: n = !0,
    confirmations: r = 1,
    hash: s,
    onReplaced: o,
    retryCount: i = 6,
    retryDelay: a = ({ count: y }) => ~~(1 << y) * 200,
    // exponential backoff
    timeout: c = 18e4
  } = t, u = W(["waitForTransactionReceipt", e.uid, s]), f = t.pollingInterval ? t.pollingInterval : e.chain?.experimental_preconfirmationTime ? e.chain.experimental_preconfirmationTime : e.pollingInterval;
  let d, l, h, p = !1, m, E;
  const { promise: g, resolve: P, reject: w } = Ea(), b = c ? setTimeout(() => {
    E?.(), m?.(), w(new z0({ hash: s }));
  }, c) : void 0;
  return m = De(u, { onReplaced: o, resolve: P, reject: w }, async (y) => {
    if (h = await z(e, Tn, "getTransactionReceipt")({ hash: s }).catch(() => {
    }), h && r <= 1) {
      clearTimeout(b), y.resolve(h), m?.();
      return;
    }
    E = z(e, hc, "watchBlockNumber")({
      emitMissed: !0,
      emitOnBegin: !0,
      poll: !0,
      pollingInterval: f,
      async onBlockNumber(A) {
        const x = (N) => {
          clearTimeout(b), E?.(), N(), m?.();
        };
        let B = A;
        if (!p)
          try {
            if (h) {
              if (r > 1 && (!h.blockNumber || B - h.blockNumber + 1n < r))
                return;
              x(() => y.resolve(h));
              return;
            }
            if (n && !d && (p = !0, await Jr(async () => {
              d = await z(e, Ks, "getTransaction")({ hash: s }), d.blockNumber && (B = d.blockNumber);
            }, {
              delay: a,
              retryCount: i
            }), p = !1), h = await z(e, Tn, "getTransactionReceipt")({ hash: s }), r > 1 && (!h.blockNumber || B - h.blockNumber + 1n < r))
              return;
            x(() => y.resolve(h));
          } catch (N) {
            if (N instanceof Ri || N instanceof Ci) {
              if (!d) {
                p = !1;
                return;
              }
              try {
                l = d, p = !0;
                const v = await Jr(() => z(e, he, "getBlock")({
                  blockNumber: B,
                  includeTransactions: !0
                }), {
                  delay: a,
                  retryCount: i,
                  shouldRetry: ({ error: R }) => R instanceof _i
                });
                p = !1;
                const k = v.transactions.find(({ from: R, nonce: U }) => R === l.from && U === l.nonce);
                if (!k || (h = await z(e, Tn, "getTransactionReceipt")({
                  hash: k.hash
                }), r > 1 && (!h.blockNumber || B - h.blockNumber + 1n < r)))
                  return;
                let O = "replaced";
                k.to === l.to && k.value === l.value && k.input === l.input ? O = "repriced" : k.from === k.to && k.value === 0n && (O = "cancelled"), x(() => {
                  y.onReplaced?.({
                    reason: O,
                    replacedTransaction: l,
                    transaction: k,
                    transactionReceipt: h
                  }), y.resolve(h);
                });
              } catch (v) {
                x(() => y.reject(v));
              }
            } else
              x(() => y.reject(N));
          }
      }
    });
  }), g;
}
function hh(e, { blockTag: t = e.experimental_blockTag ?? "latest", emitMissed: n = !1, emitOnBegin: r = !1, onBlock: s, onError: o, includeTransactions: i, poll: a, pollingInterval: c = e.pollingInterval }) {
  const u = typeof a < "u" ? a : !(e.transport.type === "webSocket" || e.transport.type === "ipc" || e.transport.type === "fallback" && (e.transport.transports[0].config.type === "webSocket" || e.transport.transports[0].config.type === "ipc")), f = i ?? !1;
  let d;
  return u ? (() => {
    const p = W([
      "watchBlocks",
      e.uid,
      t,
      n,
      r,
      f,
      c
    ]);
    return De(p, { onBlock: s, onError: o }, (m) => En(async () => {
      try {
        const E = await z(e, he, "getBlock")({
          blockTag: t,
          includeTransactions: f
        });
        if (E.number !== null && d?.number != null) {
          if (E.number === d.number)
            return;
          if (E.number - d.number > 1 && n)
            for (let g = d?.number + 1n; g < E.number; g++) {
              const P = await z(e, he, "getBlock")({
                blockNumber: g,
                includeTransactions: f
              });
              m.onBlock(P, d), d = P;
            }
        }
        // If no previous block exists, emit.
        (d?.number == null || // If the block tag is "pending" with no block number, emit.
        t === "pending" && E?.number == null || // If the next block number is greater than the previous block number, emit.
        // We don't want to emit blocks in the past.
        E.number !== null && E.number > d.number) && (m.onBlock(E, d), d = E);
      } catch (E) {
        m.onError?.(E);
      }
    }, {
      emitOnBegin: r,
      interval: c
    }));
  })() : (() => {
    let p = !0, m = !0, E = () => p = !1;
    return (async () => {
      try {
        r && z(e, he, "getBlock")({
          blockTag: t,
          includeTransactions: f
        }).then((w) => {
          p && m && (s(w, void 0), m = !1);
        }).catch(o);
        const g = (() => {
          if (e.transport.type === "fallback") {
            const w = e.transport.transports.find((b) => b.config.type === "webSocket" || b.config.type === "ipc");
            return w ? w.value : e.transport;
          }
          return e.transport;
        })(), { unsubscribe: P } = await g.subscribe({
          params: ["newHeads"],
          async onData(w) {
            if (!p)
              return;
            const b = await z(e, he, "getBlock")({
              blockNumber: w.result?.number,
              includeTransactions: f
            }).catch(() => {
            });
            p && (s(b, d), m = !1, d = b);
          },
          onError(w) {
            o?.(w);
          }
        });
        E = P, p || E();
      } catch (g) {
        o?.(g);
      }
    })(), () => E();
  })();
}
function bh(e, { address: t, args: n, batch: r = !0, event: s, events: o, fromBlock: i, onError: a, onLogs: c, poll: u, pollingInterval: f = e.pollingInterval, strict: d }) {
  const l = typeof u < "u" ? u : typeof i == "bigint" ? !0 : !(e.transport.type === "webSocket" || e.transport.type === "ipc" || e.transport.type === "fallback" && (e.transport.transports[0].config.type === "webSocket" || e.transport.transports[0].config.type === "ipc")), h = d ?? !1;
  return l ? (() => {
    const E = W([
      "watchEvent",
      t,
      n,
      r,
      e.uid,
      s,
      f,
      i
    ]);
    return De(E, { onLogs: c, onError: a }, (g) => {
      let P;
      i !== void 0 && (P = i - 1n);
      let w, b = !1;
      const y = En(async () => {
        if (!b) {
          try {
            w = await z(e, Oa, "createEventFilter")({
              address: t,
              args: n,
              event: s,
              events: o,
              strict: h,
              fromBlock: i
            });
          } catch {
          }
          b = !0;
          return;
        }
        try {
          let A;
          if (w)
            A = await z(e, Qn, "getFilterChanges")({ filter: w });
          else {
            const x = await z(e, Pn, "getBlockNumber")({});
            P && P !== x ? A = await z(e, ks, "getLogs")({
              address: t,
              args: n,
              event: s,
              events: o,
              fromBlock: P + 1n,
              toBlock: x
            }) : A = [], P = x;
          }
          if (A.length === 0)
            return;
          if (r)
            g.onLogs(A);
          else
            for (const x of A)
              g.onLogs([x]);
        } catch (A) {
          w && A instanceof Ge && (b = !1), g.onError?.(A);
        }
      }, {
        emitOnBegin: !0,
        interval: f
      });
      return async () => {
        w && await z(e, er, "uninstallFilter")({ filter: w }), y();
      };
    });
  })() : (() => {
    let E = !0, g = () => E = !1;
    return (async () => {
      try {
        const P = (() => {
          if (e.transport.type === "fallback") {
            const A = e.transport.transports.find((x) => x.config.type === "webSocket" || x.config.type === "ipc");
            return A ? A.value : e.transport;
          }
          return e.transport;
        })(), w = o ?? (s ? [s] : void 0);
        let b = [];
        w && (b = [w.flatMap((x) => hn({
          abi: [x],
          eventName: x.name,
          args: n
        }))], s && (b = b[0]));
        const { unsubscribe: y } = await P.subscribe({
          params: ["logs", { address: t, topics: b }],
          onData(A) {
            if (!E)
              return;
            const x = A.result;
            try {
              const { eventName: B, args: N } = Fn({
                abi: w ?? [],
                data: x.data,
                topics: x.topics,
                strict: h
              }), v = $e(x, { args: N, eventName: B });
              c([v]);
            } catch (B) {
              let N, v;
              if (B instanceof Nn || B instanceof ds) {
                if (d)
                  return;
                N = B.abiItem.name, v = B.abiItem.inputs?.some((O) => !("name" in O && O.name));
              }
              const k = $e(x, {
                args: v ? [] : {},
                eventName: N
              });
              c([k]);
            }
          },
          onError(A) {
            a?.(A);
          }
        });
        g = y, E || g();
      } catch (P) {
        a?.(P);
      }
    })(), () => g();
  })();
}
function ph(e, { batch: t = !0, onError: n, onTransactions: r, poll: s, pollingInterval: o = e.pollingInterval }) {
  return (typeof s < "u" ? s : e.transport.type !== "webSocket" && e.transport.type !== "ipc") ? (() => {
    const u = W([
      "watchPendingTransactions",
      e.uid,
      t,
      o
    ]);
    return De(u, { onTransactions: r, onError: n }, (f) => {
      let d;
      const l = En(async () => {
        try {
          if (!d)
            try {
              d = await z(e, Ra, "createPendingTransactionFilter")({});
              return;
            } catch (p) {
              throw l(), p;
            }
          const h = await z(e, Qn, "getFilterChanges")({ filter: d });
          if (h.length === 0)
            return;
          if (t)
            f.onTransactions(h);
          else
            for (const p of h)
              f.onTransactions([p]);
        } catch (h) {
          f.onError?.(h);
        }
      }, {
        emitOnBegin: !0,
        interval: o
      });
      return async () => {
        d && await z(e, er, "uninstallFilter")({ filter: d }), l();
      };
    });
  })() : (() => {
    let u = !0, f = () => u = !1;
    return (async () => {
      try {
        const { unsubscribe: d } = await e.transport.subscribe({
          params: ["newPendingTransactions"],
          onData(l) {
            if (!u)
              return;
            const h = l.result;
            r([h]);
          },
          onError(l) {
            n?.(l);
          }
        });
        f = d, u || f();
      } catch (d) {
        n?.(d);
      }
    })(), () => f();
  })();
}
function mh(e) {
  const { scheme: t, statement: n, ...r } = e.match(yh)?.groups ?? {}, { chainId: s, expirationTime: o, issuedAt: i, notBefore: a, requestId: c, ...u } = e.match(gh)?.groups ?? {}, f = e.split("Resources:")[1]?.split(`
- `).slice(1);
  return {
    ...r,
    ...u,
    ...s ? { chainId: Number(s) } : {},
    ...o ? { expirationTime: new Date(o) } : {},
    ...i ? { issuedAt: new Date(i) } : {},
    ...a ? { notBefore: new Date(a) } : {},
    ...c ? { requestId: c } : {},
    ...f ? { resources: f } : {},
    ...t ? { scheme: t } : {},
    ...n ? { statement: n } : {}
  };
}
const yh = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/, gh = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;
function wh(e) {
  const { address: t, domain: n, message: r, nonce: s, scheme: o, time: i = /* @__PURE__ */ new Date() } = e;
  if (n && r.domain !== n || s && r.nonce !== s || o && r.scheme !== o || r.expirationTime && i >= r.expirationTime || r.notBefore && i < r.notBefore)
    return !1;
  try {
    if (!r.address || !ue(r.address, { strict: !1 }) || t && !an(r.address, t))
      return !1;
  } catch {
    return !1;
  }
  return !0;
}
async function xh(e, t) {
  const { address: n, domain: r, message: s, nonce: o, scheme: i, signature: a, time: c = /* @__PURE__ */ new Date(), ...u } = t, f = mh(s);
  if (!f.address || !wh({
    address: n,
    domain: r,
    message: f,
    nonce: o,
    scheme: i,
    time: c
  }))
    return !1;
  const l = Ca(s);
  return sr(e, {
    address: f.address,
    hash: l,
    signature: a,
    ...u
  });
}
async function vh(e, { serializedTransaction: t, throwOnReceiptRevert: n, timeout: r }) {
  const s = await e.request({
    method: "eth_sendRawTransactionSync",
    params: r ? [t, r] : [t]
  }, { retryCount: 0 }), i = (e.chain?.formatters?.transactionReceipt?.format || $a)(s);
  if (i.status === "reverted" && n)
    throw new F0({ receipt: i });
  return i;
}
function Eh(e) {
  return {
    call: (t) => vn(e, t),
    createAccessList: (t) => Na(e, t),
    createBlockFilter: () => qd(e),
    createContractEventFilter: (t) => Si(e, t),
    createEventFilter: (t) => Oa(e, t),
    createPendingTransactionFilter: () => Ra(e),
    estimateContractGas: (t) => Pf(e, t),
    estimateGas: (t) => Ss(e, t),
    getBalance: (t) => Vd(e, t),
    getBlobBaseFee: () => Wd(e),
    getBlock: (t) => he(e, t),
    getBlockNumber: (t) => Pn(e, t),
    getBlockTransactionCount: (t) => Zd(e, t),
    getBytecode: (t) => Un(e, t),
    getChainId: () => Is(e),
    getCode: (t) => Un(e, t),
    getContractEvents: (t) => Qi(e, t),
    getDelegation: (t) => Kd(e, t),
    getEip712Domain: (t) => Jd(e, t),
    getEnsAddress: (t) => Td(e, t),
    getEnsAvatar: (t) => Gd(e, t),
    getEnsName: (t) => Dd(e, t),
    getEnsResolver: (t) => Hd(e, t),
    getEnsText: (t) => ka(e, t),
    getFeeHistory: (t) => el(e, t),
    estimateFeesPerGas: (t) => sf(e, t),
    getFilterChanges: (t) => Qn(e, t),
    getFilterLogs: (t) => tl(e, t),
    getGasPrice: () => $s(e),
    getLogs: (t) => ks(e, t),
    getProof: (t) => G1(e, t),
    estimateMaxPriorityFeePerGas: (t) => rf(e, t),
    fillTransaction: (t) => Ji(e, t),
    getStorageAt: (t) => D1(e, t),
    getTransaction: (t) => Ks(e, t),
    getTransactionConfirmations: (t) => H1(e, t),
    getTransactionCount: (t) => qi(e, t),
    getTransactionReceipt: (t) => Tn(e, t),
    multicall: (t) => q1(e, t),
    prepareTransactionRequest: (t) => Xi(e, t),
    readContract: (t) => ye(e, t),
    sendRawTransaction: (t) => xd(e, t),
    sendRawTransactionSync: (t) => vh(e, t),
    simulate: (t) => as(e, t),
    simulateBlocks: (t) => as(e, t),
    simulateCalls: (t) => th(e, t),
    simulateContract: (t) => ld(e, t),
    verifyHash: (t) => sr(e, t),
    verifyMessage: (t) => fh(e, t),
    verifySiweMessage: (t) => xh(e, t),
    verifyTypedData: (t) => dh(e, t),
    uninstallFilter: (t) => er(e, t),
    waitForTransactionReceipt: (t) => lh(e, t),
    watchBlocks: (t) => hh(e, t),
    watchBlockNumber: (t) => hc(e, t),
    watchContractEvent: (t) => wd(e, t),
    watchEvent: (t) => bh(e, t),
    watchPendingTransactions: (t) => ph(e, t)
  };
}
function Ph(e) {
  const { key: t = "public", name: n = "Public Client" } = e;
  return Ed({
    ...e,
    key: t,
    name: n,
    type: "publicClient"
  }).extend(Eh);
}
function Ah({ key: e, methods: t, name: n, request: r, retryCount: s = 3, retryDelay: o = 150, timeout: i, type: a }, c) {
  const u = Ba();
  return {
    config: {
      key: e,
      methods: t,
      name: n,
      request: r,
      retryCount: s,
      retryDelay: o,
      timeout: i,
      type: a
    },
    request: sl(r, { methods: t, retryCount: s, retryDelay: o, uid: u }),
    value: c
  };
}
class $h extends $ {
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
}
function Bh(e, t = {}) {
  const { batch: n, fetchFn: r, fetchOptions: s, key: o = "http", methods: i, name: a = "HTTP JSON-RPC", onFetchRequest: c, onFetchResponse: u, retryDelay: f, raw: d } = t;
  return ({ chain: l, retryCount: h, timeout: p }) => {
    const { batchSize: m = 1e3, wait: E = 0 } = typeof n == "object" ? n : {}, g = t.retryCount ?? h, P = p ?? t.timeout ?? 1e4, w = l?.rpcUrls.default.http[0];
    if (!w)
      throw new $h();
    const b = ul(w, {
      fetchFn: r,
      fetchOptions: s,
      onRequest: c,
      onResponse: u,
      timeout: P
    });
    return Ah({
      key: o,
      methods: i,
      name: a,
      async request({ method: y, params: A }) {
        const x = { method: y, params: A }, { schedule: B } = Pa({
          id: w,
          wait: E,
          shouldSplitBatch(O) {
            return O.length > m;
          },
          fn: (O) => b.request({
            body: O
          }),
          sort: (O, R) => O.id - R.id
        }), N = async (O) => n ? B(O) : [
          await b.request({
            body: O
          })
        ], [{ error: v, result: k }] = await N(x);
        if (d)
          return { error: v, result: k };
        if (v)
          throw new vs({
            body: x,
            error: v,
            url: w
          });
        return k;
      },
      retryCount: g,
      retryDelay: f,
      timeout: P,
      type: "http"
    }, {
      fetchOptions: s,
      url: w
    });
  };
}
const Ih = /* @__PURE__ */ il({
  id: 10143,
  name: "Monad Testnet",
  blockTime: 400,
  nativeCurrency: {
    name: "Testnet MON Token",
    symbol: "MON",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"]
    }
  },
  blockExplorers: {
    default: {
      name: "Monad Testnet explorer",
      url: "https://testnet.monadexplorer.com"
    }
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 251449
    }
  },
  testnet: !0
});
Ph({
  chain: Ih,
  transport: Bh()
});
export {
  $ as B,
  Ft as H,
  $d as a,
  Ae as b,
  vn as c,
  I0 as d,
  st as e,
  ve as f,
  xs as g,
  an as i,
  tr as l,
  W as s
};
