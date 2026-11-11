/*
 * ตัวจำลอง Google Apps Script สำหรับทดลองระบบในเบราว์เซอร์ (preview.html เท่านั้น — ไม่ต้องอัปโหลดไฟล์นี้ขึ้น Apps Script)
 * ข้อมูลเก็บใน localStorage ของเบราว์เซอร์   ล้างข้อมูล: เปิด preview.html?reset
 */
(function () {
  const KEY = 'training-preview-db';
  if (location.search.includes('reset')) localStorage.removeItem(KEY);
  let db = JSON.parse(localStorage.getItem(KEY) || 'null') || { sheets: {}, props: {} };
  const save = () => localStorage.setItem(KEY, JSON.stringify(db));

  function Range(name, r, c, nr, nc) {
    const rows = () => db.sheets[name];
    return {
      getValues() {
        const out = [];
        for (let i = 0; i < nr; i++) { const row = rows()[r - 1 + i] || []; out.push(Array.from({ length: nc }, (_, j) => row[c - 1 + j] ?? '')); }
        return out;
      },
      setValues(v) {
        v.forEach((row, i) => { const t = rows()[r - 1 + i] = rows()[r - 1 + i] || []; row.forEach((x, j) => t[c - 1 + j] = x); });
        save(); return this;
      },
      setFontWeight() { return this; }, setBackground() { return this; }, setNumberFormat() { return this; }
    };
  }
  function Sheet(name) {
    return {
      getLastRow: () => db.sheets[name].length,
      getMaxRows: () => 1000,
      getRange: (r, c, nr = 1, nc = 1) => Range(name, r, c, nr, nc),
      appendRow(row) { db.sheets[name].push(row.slice()); save(); },
      deleteRow(r) { db.sheets[name].splice(r - 1, 1); save(); },
      setFrozenRows() {},
      getName: () => name,
      clearContents() { db.sheets[name] = []; save(); },
      getProtections: () => (db.prot[name] ? [1] : []),
      protect() { db.prot[name] = 1; const pr = { setDescription: () => pr, setWarningOnly: () => pr }; return pr; }
    };
  }
  db.prot = db.prot || {};
  const ss = {
    getSheetByName: n => (db.sheets[n] ? Sheet(n) : null),
    insertSheet: n => { db.sheets[n] = []; save(); return Sheet(n); },
    getSheets: () => Object.keys(db.sheets).map(Sheet),
    deleteSheet: sh => { delete db.sheets[sh.getName()]; save(); }
  };
  window.SpreadsheetApp = { getActiveSpreadsheet: () => ss, openById: () => ss, ProtectionType: { SHEET: 'SHEET' },
    getUi() { throw new Error('no UI in preview'); } };
  const props = { getProperty: k => db.props[k] ?? null, setProperty: (k, v) => { db.props[k] = String(v); save(); } };
  window.PropertiesService = { getScriptProperties: () => props };
  const cache = {};
  window.CacheService = { getScriptCache: () => ({ get: k => cache[k] ?? null, put: (k, v) => { cache[k] = v; } }) };
  window.LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) };
  window.Logger = { log: (...a) => console.log('[Logger]', ...a) };
  window.Utilities = {
    getUuid: () => crypto.randomUUID(),
    formatDate(d, tz, f) {
      const p = n => String(n).padStart(2, '0');
      return f.replace('yyyy', d.getFullYear()).replace('MM', p(d.getMonth() + 1)).replace('dd', p(d.getDate()))
        .replace('HH', p(d.getHours())).replace('mm', p(d.getMinutes())).replace('ss', p(d.getSeconds())).replace(/'/g, '');
    },
    DigestAlgorithm: {}, Charset: {},
    computeDigest(_a, s) { // ไม่ใช่ SHA-256 จริง ใช้แค่ในโหมดทดลอง
      let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
      return [h >>> 24, (h >>> 16) & 255, (h >>> 8) & 255, h & 255].map(b => (b > 127 ? b - 256 : b));
    },
    base64Decode: b64 => Array.from(atob(b64), c => c.charCodeAt(0)),
    newBlob: (bytes, type, name) => ({ bytes, type, name })
  };
  const folders = {};
  function Folder(name) {
    return {
      getId: () => name,
      getFoldersByName(n) { const k = name + '/' + n, ok = !!folders[k]; let done = false; return { hasNext: () => ok && !done, next: () => { done = true; return Folder(k); } }; },
      createFolder(n) { folders[name + '/' + n] = 1; return Folder(name + '/' + n); },
      createFile(blob) { console.log('[Drive]', name + '/' + blob.name); return { getUrl: () => URL.createObjectURL(new Blob([new Uint8Array(blob.bytes)], { type: blob.type })) }; }
    };
  }
  window.DriveApp = { createFolder: n => Folder(n), getFolderById: id => Folder(id) };

  // google.script.run → เรียกฟังก์ชันใน Code.gs โดยตรง (ส่งผ่าน JSON เหมือนของจริง)
  function runner(ok, fail) {
    return new Proxy({}, { get(_, fn) {
      if (fn === 'withSuccessHandler') return h => runner(h, fail);
      if (fn === 'withFailureHandler') return h => runner(ok, h);
      return (...args) => setTimeout(() => {
        try { const r = window[fn](...JSON.parse(JSON.stringify(args))); ok && ok(r === undefined ? r : JSON.parse(JSON.stringify(r))); }
        catch (e) { console.error(e); fail && fail(e); }
      }, 150);
    } });
  }
  window.google = { script: { get run() { return runner(); } } };

  // ครั้งแรก: ติดตั้ง + นำเข้าข้อมูลเดิม
  window.__previewInit = function () {
    if (!db.props.ADMIN_HASH) { setup(); importLegacyData(); }
  };
})();
