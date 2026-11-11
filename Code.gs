/**
 * ระบบบันทึกการอบรมพัฒนาทักษะดิจิทัล
 * Google Apps Script + Google Sheets (ใช้ Spreadsheet เป็นฐานข้อมูล, Google Drive เก็บไฟล์ใบประกาศฯ)
 *
 * ติดตั้ง: ดู README.md  (สรุป: วางไฟล์ → รัน setup() → รัน importLegacyData() (ถ้าต้องการ) → Deploy เป็น Web app)
 */

// ---------------------------------------------------------------------------
// โครงสร้างตาราง (1 ตาราง = 1 ชีต, แถวแรกเป็นหัวคอลัมน์)
// ---------------------------------------------------------------------------
const TABLES = {
  prefixes:    { sheet: 'M_คำนำหน้า',          cols: ['id', 'name', 'sort', 'active'] },
  departments: { sheet: 'M_สังกัด',             cols: ['id', 'name', 'sort', 'active'] },
  positions:   { sheet: 'M_ตำแหน่ง',            cols: ['id', 'name', 'sort', 'active'] },
  staffTypes:  { sheet: 'M_ประเภทเจ้าหน้าที่',     cols: ['id', 'name', 'sort', 'active'] },
  providers:   { sheet: 'M_หน่วยงานผู้จัด',       cols: ['id', 'name', 'fullName', 'sort', 'active'] },
  formats:     { sheet: 'M_รูปแบบการอบรม',       cols: ['id', 'name', 'sort', 'active'] },
  categories:  { sheet: 'M_หมวดหมู่หลักสูตร',     cols: ['id', 'name', 'sort', 'active'] },
  courses:     { sheet: 'M_หลักสูตร',            cols: ['id', 'name', 'providerId', 'hours', 'categoryId', 'active', 'pending'] },
  employees:   { sheet: 'บุคลากร',              cols: ['id', 'prefixId', 'name', 'positionId', 'staffTypeId', 'departmentId', 'email', 'active'] },
  trainings:   { sheet: 'บันทึกการอบรม',         cols: ['id', 'employeeId', 'courseId', 'providerId', 'formatId', 'startDate', 'endDate', 'hours', 'certUrl', 'note', 'createdAt', 'updatedAt'] }
};

// คอลัมน์ที่อ้างอิงไปยังตารางอื่น (ใช้ตอนตรวจก่อนลบ และตอน "รวมรายการซ้ำ")
const REFS = {
  prefixes:    [['employees', 'prefixId']],
  positions:   [['employees', 'positionId']],
  staffTypes:  [['employees', 'staffTypeId']],
  departments: [['employees', 'departmentId']],
  providers:   [['courses', 'providerId'], ['trainings', 'providerId']],
  formats:     [['trainings', 'formatId']],
  categories:  [['courses', 'categoryId']],
  courses:     [['trainings', 'courseId']],
  employees:   [['trainings', 'employeeId']]
};

const MASTER_TABLES = ['prefixes', 'departments', 'positions', 'staffTypes', 'providers', 'formats', 'categories', 'courses', 'employees'];
const MAX_FILE_MB = 2;
// ID ของ Google Sheet ที่ใช้เป็นฐานข้อมูล (ตัวอักษรระหว่าง /d/ และ /edit ใน URL ของชีต)
// เว้นว่างได้ถ้าสร้างโปรเจกต์จากเมนู ส่วนขยาย → Apps Script ในชีต (โปรเจกต์ผูกกับชีตอยู่แล้ว)
const SPREADSHEET_ID = '1DPwtmRPYNRRY3J6ox49mHBkUwSJnKUUWduyf_C9Hm2E';
const REPORT_SHEET = 'รายงานการอบรม';
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const ADMIN_SESSION_SEC = 6 * 60 * 60;
const MAX_LOGIN_FAILS = 5;          // ใส่รหัสผิดได้กี่ครั้งก่อนถูกล็อก
const LOGIN_LOCK_SEC = 15 * 60;     // ระยะเวลาล็อก (วินาที)
const MIN_PASSWORD_LEN = 8;

// ---------------------------------------------------------------------------
// Web app
// ---------------------------------------------------------------------------
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(getSetting_('appTitle') || 'ระบบบันทึกการอบรมพัฒนาทักษะดิจิทัล')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** เมนูในชีต — ใช้ติดตั้งและดูแลระบบได้โดยไม่ต้องเปิด Apps Script editor */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('ระบบบันทึกการอบรม')
    .addItem('1) ติดตั้ง / ตรวจสอบโครงสร้างชีต', 'setup')
    .addItem('2) นำเข้าข้อมูลจากชีตเดิม', 'importLegacyData')
    .addSeparator()
    .addItem('อัปเดตแท็บรายงาน', 'refreshReport')
    .addItem('รีเซ็ตรหัสผู้ดูแลเป็น admin1234', 'resetAdminPassword')
    .addToUi();
}

function refreshReport() { refreshReportSheet_(); notify_('อัปเดตแท็บ "' + REPORT_SHEET + '" เรียบร้อย'); }

/** ลืมรหัสผู้ดูแล — รันจากเมนูในชีต หรือเลือกฟังก์ชันนี้แล้วกด Run ใน Apps Script editor (เฉพาะเจ้าของสคริปต์) */
function resetAdminPassword() {
  PropertiesService.getScriptProperties().setProperty('ADMIN_HASH', hash_('admin1234'));
  bumpSessionVersion_();
  notify_('รีเซ็ตรหัสผู้ดูแลเป็น admin1234 แล้ว\nกรุณาเข้าสู่ระบบแล้วเปลี่ยนรหัสทันที: ผู้ดูแลระบบ → ตั้งค่าระบบ');
}

// ---------------------------------------------------------------------------
// ติดตั้งครั้งแรก — รันจาก Apps Script editor
// ---------------------------------------------------------------------------
function setup() {
  const ss = ss_();
  Object.keys(TABLES).forEach(function (key) {
    const t = TABLES[key];
    let sh = ss.getSheetByName(t.sheet);
    if (!sh) sh = ss.insertSheet(t.sheet);
    sh.getRange(1, 1, 1, t.cols.length).setValues([t.cols]).setFontWeight('bold').setBackground('#dbe6f3');
    sh.setFrozenRows(1);
    // เก็บทุกคอลัมน์เป็นข้อความ เพื่อไม่ให้ Sheets แปลงวันที่/ตัวเลขเอง
    sh.getRange(1, 1, sh.getMaxRows(), t.cols.length).setNumberFormat('@');
    protectSheet_(sh, 'ข้อมูลของระบบ — กรุณาแก้ไขผ่าน Web app (เมนูผู้ดูแลระบบ)');
  });
  // ลบแท็บว่างที่ติดมากับไฟล์ใหม่ (เช่น "ชีต1") — แท็บที่มีข้อมูลจะไม่ถูกแตะ
  const ours = Object.keys(TABLES).map(function (k) { return TABLES[k].sheet; }).concat([REPORT_SHEET]);
  ss.getSheets().forEach(function (sh) {
    if (ours.indexOf(sh.getName()) < 0 && sh.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(sh);
  });

  ensureSettings_();

  // ข้อมูลหลักตั้งต้น (เพิ่มเฉพาะเมื่อตารางยังว่าง)
  seedIfEmpty_('prefixes', ['นาย', 'นาง', 'นางสาว', 'ว่าที่ร้อยตรี', 'ดร.'].map(nameRow_));
  seedIfEmpty_('staffTypes', ['ข้าราชการ', 'พนักงานราชการ', 'ลูกจ้างประจำ', 'พนักงานจ้างเหมาบริการ'].map(nameRow_));
  seedIfEmpty_('formats', ['ออนไลน์', 'ออนไซต์', 'ผสมผสาน (Hybrid)'].map(nameRow_));
  seedIfEmpty_('categories', ['AI', 'Cybersecurity', 'Data', 'Digital Literacy'].map(nameRow_));
  seedIfEmpty_('departments', ['ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร'].map(nameRow_));
  refreshReportSheet_();
  notify_('ติดตั้งเรียบร้อย\n\nรหัสผู้ดูแลเริ่มต้น = admin1234\nกรุณาเปลี่ยนในหน้าเว็บ: ผู้ดูแลระบบ → ตั้งค่าระบบ\n\nขั้นต่อไป: เมนู "2) นำเข้าข้อมูลจากชีตเดิม" (ถ้าต้องการ) แล้ว Deploy เป็น Web app');
}

/**
 * ค่าตั้งต้นของระบบ (เก็บใน Script Properties ของโปรเจกต์)
 * เรียกทั้งตอนติดตั้งและตอนใช้งาน เพราะโปรเจกต์ที่ Deploy เป็น Web app
 * อาจไม่ใช่โปรเจกต์เดียวกับที่กดเมนูติดตั้งในชีต
 */
function ensureSettings_() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_HASH')) props.setProperty('ADMIN_HASH', hash_('admin1234'));
  if (!props.getProperty('appTitle')) props.setProperty('appTitle', 'ระบบบันทึกการอบรมพัฒนาทักษะดิจิทัล');
  if (!props.getProperty('orgName')) props.setProperty('orgName', 'ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร กรมการค้าต่างประเทศ');
  if (!props.getProperty('CERT_FOLDER_ID')) {
    const folder = DriveApp.createFolder('ใบประกาศนียบัตรการอบรม');
    props.setProperty('CERT_FOLDER_ID', folder.getId());
  }
}

function nameRow_(name, i) { return { name: name, sort: String(i + 1), active: 'TRUE' }; }

function seedIfEmpty_(table, rows) {
  if (readTable_(table).length) return;
  rows.forEach(function (r) { insert_(table, r); });
}

/**
 * นำเข้าข้อมูลจากชีตเดิม (ไฟล์ Seed.gs) — รันครั้งเดียวหลัง setup()
 * ไม่สร้างซ้ำ: ถ้าชื่อมีอยู่แล้วจะใช้ของเดิม
 */
function importLegacyData() {
  const seed = LEGACY_SEED;
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const deptId = findOrCreate_('departments', { name: seed.department });
    const typeId = findOrCreate_('staffTypes', { name: 'ข้าราชการ' });
    const empIds = seed.employees.map(function (e) {
      return findOrCreate_('employees', {
        name: e.name,
        prefixId: e.prefix ? findOrCreate_('prefixes', { name: e.prefix }) : '',
        positionId: findOrCreate_('positions', { name: e.position }),
        staffTypeId: typeId, departmentId: deptId, active: 'TRUE'
      });
    });
    let n = 0;
    seed.trainings.forEach(function (t) {
      const provId = t.provider ? findOrCreate_('providers', { name: t.provider, fullName: seed.providerFull[t.provider] || t.provider }) : '';
      const courseId = findOrCreate_('courses', { name: t.course, providerId: provId, active: 'TRUE', pending: 'FALSE' });
      const fmtId = t.format ? findOrCreate_('formats', { name: t.format }) : '';
      const exists = readTable_('trainings').some(function (r) {
        return r.employeeId === empIds[t.emp] && r.courseId === courseId && r.startDate === t.start;
      });
      if (exists) return;
      insert_('trainings', {
        employeeId: empIds[t.emp], courseId: courseId, providerId: provId, formatId: fmtId,
        startDate: t.start, endDate: t.end || t.start, note: 'นำเข้าจากชีตเดิม'
      });
      n++;
    });
    refreshReportSheet_();
    notify_('นำเข้าบุคลากร ' + empIds.length + ' คน, รายการอบรมใหม่ ' + n + ' รายการ');
  } finally { lock.releaseLock(); }
}

function findOrCreate_(table, rec) {
  const key = normKey_(rec.name);
  const hit = readTable_(table).filter(function (r) { return normKey_(r.name) === key; })[0];
  if (hit) return hit.id;
  if (rec.active === undefined) rec.active = 'TRUE';
  return insert_(table, rec).id;
}

// ---------------------------------------------------------------------------
// API สำหรับผู้ใช้ทั่วไป
// ---------------------------------------------------------------------------
function getBootstrap() {
  const out = { settings: { appTitle: getSetting_('appTitle'), orgName: getSetting_('orgName') } };
  MASTER_TABLES.concat(['trainings']).forEach(function (t) { out[t] = readTable_(t); });
  return out;
}

/**
 * บันทึกการอบรม (เพิ่มได้หลายหลักสูตรในครั้งเดียว)
 * payload = { employeeId, items: [{ courseId | newCourseName, providerId, formatId, startDate, endDate, hours, note, file: {name, type, data(base64)} }] }
 */
function addTrainings(payload) {
  if (!payload || !payload.employeeId) throw new Error('กรุณาเลือกชื่อบุคลากร');
  if (!payload.items || !payload.items.length) throw new Error('กรุณาเพิ่มอย่างน้อย 1 หลักสูตร');
  const emp = readTable_('employees').filter(function (e) { return e.id === payload.employeeId; })[0];
  if (!emp) throw new Error('ไม่พบข้อมูลบุคลากร');

  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    // ตรวจทุกรายการก่อนบันทึก เพื่อไม่ให้บันทึกไปครึ่งเดียวแล้วผู้ใช้กดซ้ำจนข้อมูลซ้ำ
    const ids = {};
    ['courses', 'providers', 'formats'].forEach(function (t) {
      ids[t] = {}; readTable_(t).forEach(function (r) { ids[t][r.id] = true; });
    });
    payload.items.forEach(function (it, i) {
      const no = 'หลักสูตรที่ ' + (i + 1) + ': ';
      if (!it.courseId && !(it.newCourseName && String(it.newCourseName).trim())) throw new Error(no + 'กรุณาระบุชื่อหลักสูตร');
      if (it.courseId && !ids.courses[it.courseId]) throw new Error(no + 'ไม่พบหลักสูตรในระบบ');
      if (it.providerId && !ids.providers[it.providerId]) throw new Error(no + 'ไม่พบหน่วยงานผู้จัดในระบบ');
      if (it.formatId && !ids.formats[it.formatId]) throw new Error(no + 'ไม่พบรูปแบบการอบรมในระบบ');
      if (!it.startDate) throw new Error(no + 'กรุณาระบุวันที่อบรม');
      if (!isIsoDate_(it.startDate)) throw new Error(no + 'รูปแบบวันที่อบรมไม่ถูกต้อง');
      if (it.endDate) {
        if (!isIsoDate_(it.endDate)) throw new Error(no + 'รูปแบบวันที่สิ้นสุดไม่ถูกต้อง');
        if (it.endDate < it.startDate) throw new Error(no + 'วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่ม');
      }
      if (!isValidHours_(it.hours)) throw new Error(no + 'จำนวนชั่วโมงต้องเป็นตัวเลขตั้งแต่ 0 ถึง 999');
      if (it.file && it.file.data) checkCertificate_(it.file);
    });
    const saved = payload.items.map(function (it) {
      let courseId = it.courseId;
      if (!courseId) {
        if (!it.newCourseName || !String(it.newCourseName).trim()) throw new Error('กรุณาระบุชื่อหลักสูตร');
        // หลักสูตรที่ผู้ใช้พิมพ์เอง → เพิ่มเป็น "รอตรวจสอบ" ให้ผู้ดูแลยืนยัน/รวมรายการ
        courseId = findOrCreate_('courses', { name: String(it.newCourseName).trim(), providerId: it.providerId || '', active: 'TRUE', pending: 'TRUE' });
      }
      if (!it.startDate) throw new Error('กรุณาระบุวันที่อบรม');
      const certUrl = it.file && it.file.data ? saveCertificate_(it.file, emp, courseId, it.startDate) : '';
      return insert_('trainings', {
        employeeId: emp.id, courseId: courseId, providerId: it.providerId || '', formatId: it.formatId || '',
        startDate: it.startDate, endDate: it.endDate || it.startDate, hours: hoursStr_(it.hours),
        certUrl: certUrl, note: String(it.note || '').slice(0, 500)
      });
    });
    refreshReportSheet_();
    return { saved: saved, data: getBootstrap() };
  } finally { lock.releaseLock(); }
}

function checkCertificate_(file) {
  const okTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (okTypes.indexOf(file.type) < 0) throw new Error('รองรับเฉพาะไฟล์ PDF / JPG / PNG');
  // base64 → ขนาดจริง ≈ ความยาว × 3/4 (ตรวจก่อนถอดรหัสเพื่อไม่เปลืองหน่วยความจำ)
  if (typeof file.data !== 'string' || !/^[A-Za-z0-9+\/=\s]+$/.test(file.data.slice(0, 64))) throw new Error('ข้อมูลไฟล์ไม่ถูกต้อง');
  if (file.data.length * 0.75 > MAX_FILE_MB * 1024 * 1024 * 1.01) throw new Error('ไฟล์ต้องมีขนาดไม่เกิน ' + MAX_FILE_MB + ' MB');
  // ตรวจลายเซ็นไฟล์ (magic bytes) ให้ตรงกับชนิดที่แจ้งมา ไม่เชื่อ MIME จากฝั่ง client อย่างเดียว
  const head = Utilities.base64Decode(file.data.replace(/\s+/g, '').slice(0, 16)).map(function (b) { return b & 0xff; });
  const sig = {
    'application/pdf': [0x25, 0x50, 0x44, 0x46],
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47]
  }[file.type];
  const match = sig.every(function (b, i) { return head[i] === b; });
  if (!match) throw new Error('เนื้อหาไฟล์ไม่ตรงกับชนิดไฟล์ที่เลือก (รองรับ PDF / JPG / PNG)');
}

function saveCertificate_(file, emp, courseId, startDate) {
  checkCertificate_(file);
  const bytes = Utilities.base64Decode(file.data);
  if (bytes.length > MAX_FILE_MB * 1024 * 1024) throw new Error('ไฟล์ต้องมีขนาดไม่เกิน ' + MAX_FILE_MB + ' MB');
  // เก็บแยกโฟลเดอร์ตามปีงบประมาณ ตั้งชื่อไฟล์ ชื่อ_หลักสูตร_วันที่อบรม
  const course = readTable_('courses').filter(function (c) { return c.id === courseId; })[0];
  const safe = function (s, n) { return String(s || '').replace(/[\\/:*?"<>|#%]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n); };
  // นามสกุลกำหนดจากชนิดไฟล์ที่ตรวจแล้ว ไม่ใช้ชื่อไฟล์จากผู้ใช้
  const ext = { 'application/pdf': '.pdf', 'image/jpeg': '.jpg', 'image/png': '.png' }[file.type];
  const name = safe(emp.name, 60) + '_' + safe(course ? course.name : 'หลักสูตร', 80) + '_' + startDate + ext;
  return certFolder_(fyOf_(startDate)).createFile(Utilities.newBlob(bytes, file.type, name)).getUrl();
}

// ---------------------------------------------------------------------------
// API ผู้ดูแลระบบ (ต้องมี token จาก adminLogin)
// ---------------------------------------------------------------------------
function adminLogin(password) {
  ensureSettings_();
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('login_fails') || 0);
  if (fails >= MAX_LOGIN_FAILS) throw new Error('ใส่รหัสผ่านผิดหลายครั้ง ระบบล็อกชั่วคราว กรุณารอ ' + Math.round(LOGIN_LOCK_SEC / 60) + ' นาทีแล้วลองใหม่');
  if (hash_(String(password || '')) !== getSetting_('ADMIN_HASH')) {
    cache.put('login_fails', String(fails + 1), LOGIN_LOCK_SEC);
    throw new Error('รหัสผ่านไม่ถูกต้อง');
  }
  cache.put('login_fails', '0', 1);
  const token = Utilities.getUuid();
  cache.put('adm_' + token, sessionVersion_(), ADMIN_SESSION_SEC);
  return token;
}

/** เลขรุ่นของ session — เพิ่มค่าเมื่อเปลี่ยน/รีเซ็ตรหัส เพื่อให้ token เดิมทั้งหมดใช้ไม่ได้ */
function sessionVersion_() { return getSetting_('SESSION_VER') || '0'; }
function bumpSessionVersion_() {
  PropertiesService.getScriptProperties().setProperty('SESSION_VER', String(Number(sessionVersion_()) + 1));
}

function adminSave(token, table, rec) {
  requireAdmin_(token);
  if (!TABLES[table]) throw new Error('ไม่รู้จักตาราง ' + table);
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    if (table !== 'trainings') {
      if (!rec.name || !String(rec.name).trim()) throw new Error('กรุณากรอกชื่อ');
      const key = normKey_(rec.name);
      const dup = readTable_(table).some(function (r) { return r.id !== rec.id && normKey_(r.name) === key; });
      if (dup) throw new Error('มีชื่อนี้อยู่แล้ว: ' + rec.name);
    }
    if (table === 'trainings') {
      if (rec.startDate && !isIsoDate_(rec.startDate)) throw new Error('รูปแบบวันที่เริ่มไม่ถูกต้อง');
      if (rec.endDate && !isIsoDate_(rec.endDate)) throw new Error('รูปแบบวันที่สิ้นสุดไม่ถูกต้อง');
      if (rec.startDate && rec.endDate && rec.endDate < rec.startDate) throw new Error('วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่ม');
      if (!isValidHours_(rec.hours)) throw new Error('จำนวนชั่วโมงต้องเป็นตัวเลขตั้งแต่ 0 ถึง 999');
      if (rec.hours !== undefined) rec.hours = hoursStr_(rec.hours);
      if (rec.certUrl && !/^https:\/\//i.test(rec.certUrl)) throw new Error('ลิงก์ใบประกาศฯ ต้องขึ้นต้นด้วย https://');
    }
    if (rec.id) update_(table, rec); else insert_(table, rec);
    refreshReportSheet_();
    return getBootstrap();
  } finally { lock.releaseLock(); }
}

function adminDelete(token, table, id) {
  requireAdmin_(token);
  if (!TABLES[table]) throw new Error('ไม่รู้จักตาราง ' + table);
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const used = countRefs_(table, id);
    if (used) throw new Error('ลบไม่ได้ เพราะมีข้อมูลอ้างอิงอยู่ ' + used + ' รายการ — ใช้ "ปิดใช้งาน" หรือ "รวมรายการ" แทน');
    remove_(table, id);
    refreshReportSheet_();
    return getBootstrap();
  } finally { lock.releaseLock(); }
}

/** รวมรายการซ้ำ: ย้ายการอ้างอิงทั้งหมดจาก fromId → toId แล้วลบ fromId */
function adminMerge(token, table, fromId, toId) {
  requireAdmin_(token);
  if (MASTER_TABLES.indexOf(table) < 0) throw new Error('ตารางนี้ไม่รองรับการรวมรายการ');
  if (!fromId || !toId || fromId === toId) throw new Error('เลือกรายการปลายทางไม่ถูกต้อง');
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const rows = readTable_(table);
    const hasId = function (id) { return rows.some(function (r) { return r.id === id; }); };
    if (!hasId(fromId) || !hasId(toId)) throw new Error('ไม่พบรายการที่ต้องการรวม');
    (REFS[table] || []).forEach(function (ref) { relink_(ref[0], ref[1], fromId, toId); });
    remove_(table, fromId);
    refreshReportSheet_();
    return getBootstrap();
  } finally { lock.releaseLock(); }
}

/** เปลี่ยนค่าอ้างอิงในคอลัมน์ col จาก fromId เป็น toId (อ่าน/เขียนทั้งคอลัมน์ครั้งเดียว) */
function relink_(table, col, fromId, toId) {
  const sh = sheet_(table), last = sh.getLastRow();
  if (last < 2) return;
  const range = sh.getRange(2, TABLES[table].cols.indexOf(col) + 1, last - 1, 1);
  const vals = range.getValues();
  let changed = false;
  vals.forEach(function (row) { if (String(row[0]) === fromId) { row[0] = toId; changed = true; } });
  if (changed) range.setValues(vals);
}

/**
 * เพิ่มข้อมูลหลักหลายรายการพร้อมกัน (วางจาก Excel ได้ บรรทัดละ 1 รายการ, คั่นคอลัมน์ด้วย Tab หรือ |)
 *  employees : ชื่อ-นามสกุล (มีคำนำหน้าได้) | ตำแหน่ง | สังกัด | ประเภทเจ้าหน้าที่
 *  courses   : ชื่อหลักสูตร | หน่วยงานผู้จัด (ชื่อย่อ) | จำนวนชั่วโมง
 *  providers : ชื่อย่อ | ชื่อเต็ม
 *  อื่น ๆ     : ชื่อ
 */
function adminBulkAdd(token, table, lines) {
  requireAdmin_(token);
  if (!TABLES[table] || table === 'trainings') throw new Error('ตารางนี้ไม่รองรับการเพิ่มหลายรายการ');
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    let added = 0, skipped = 0;
    (lines || []).forEach(function (line) {
      const p = String(line).split(/\t|\|/).map(function (s) { return s.trim(); });
      if (!p[0]) return;
      let rec;
      if (table === 'employees') {
        const sp = splitPrefix_(p[0]);
        rec = {
          name: sp.name,
          prefixId: sp.prefix ? findOrCreate_('prefixes', { name: sp.prefix }) : '',
          positionId: p[1] ? findOrCreate_('positions', { name: p[1] }) : '',
          departmentId: p[2] ? findOrCreate_('departments', { name: p[2] }) : '',
          staffTypeId: p[3] ? findOrCreate_('staffTypes', { name: p[3] }) : ''
        };
      } else if (table === 'courses') {
        rec = { name: p[0], providerId: p[1] ? findOrCreate_('providers', { name: p[1], fullName: p[1] }) : '', hours: p[2] || '', pending: 'FALSE' };
      } else if (table === 'providers') {
        rec = { name: p[0], fullName: p[1] || p[0] };
      } else {
        rec = { name: p[0] };
      }
      rec.active = 'TRUE';
      const key = normKey_(rec.name);
      if (readTable_(table).some(function (r) { return normKey_(r.name) === key; })) { skipped++; return; }
      insert_(table, rec); added++;
    });
    refreshReportSheet_();
    return { added: added, skipped: skipped, data: getBootstrap() };
  } finally { lock.releaseLock(); }
}

/** แยกคำนำหน้าออกจากชื่อ ตามรายการใน M_คำนำหน้า (ยาวสุดก่อน เช่น "นางสาว" ก่อน "นาง") */
function splitPrefix_(full) {
  full = String(full).trim();
  const names = readTable_('prefixes').map(function (r) { return r.name; })
    .sort(function (a, b) { return b.length - a.length; });
  for (let i = 0; i < names.length; i++) {
    if (names[i] && full.indexOf(names[i]) === 0) return { prefix: names[i], name: full.slice(names[i].length).trim() };
  }
  return { prefix: '', name: full };
}

function adminSaveSettings(token, s) {
  requireAdmin_(token);
  const props = PropertiesService.getScriptProperties();
  let passwordChanged = false;
  if (s.appTitle) props.setProperty('appTitle', s.appTitle);
  if (s.orgName) props.setProperty('orgName', s.orgName);
  if (s.newPassword) {
    if (String(s.newPassword).length < MIN_PASSWORD_LEN) throw new Error('รหัสผ่านใหม่ต้องมีอย่างน้อย ' + MIN_PASSWORD_LEN + ' ตัวอักษร');
    if (String(s.newPassword) === 'admin1234') throw new Error('ห้ามใช้รหัสเริ่มต้น กรุณาตั้งรหัสใหม่');
    props.setProperty('ADMIN_HASH', hash_(s.newPassword));
    bumpSessionVersion_();
    passwordChanged = true;
  }
  const out = getBootstrap();
  if (passwordChanged) out.newToken = adminLogin(s.newPassword);  // ให้ผู้ที่เปลี่ยนรหัสอยู่ในระบบต่อได้
  return out;
}

function requireAdmin_(token) {
  if (!token || CacheService.getScriptCache().get('adm_' + token) !== sessionVersion_()) throw new Error('หมดเวลาการเข้าสู่ระบบผู้ดูแล กรุณาเข้าสู่ระบบใหม่');
}

function countRefs_(table, id) {
  return (REFS[table] || []).reduce(function (n, ref) {
    return n + readTable_(ref[0]).filter(function (r) { return r[ref[1]] === id; }).length;
  }, 0);
}

// ---------------------------------------------------------------------------
// ชั้นข้อมูล (Sheets)
// ---------------------------------------------------------------------------
function sheet_(table) {
  const sh = ss_().getSheetByName(TABLES[table].sheet);
  if (!sh) throw new Error('ไม่พบชีต "' + TABLES[table].sheet + '" — กรุณารัน setup() ก่อน');
  return sh;
}

function readTable_(table) {
  const cols = TABLES[table].cols;
  const sh = sheet_(table);
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, cols.length).getValues()
    .filter(function (row) { return row[0] !== ''; })
    .map(function (row) {
      const o = {};
      cols.forEach(function (c, i) {
        const v = row[i];
        o[c] = v instanceof Date ? Utilities.formatDate(v, 'Asia/Bangkok', 'yyyy-MM-dd') : String(v);
      });
      return o;
    });
}

function insert_(table, rec) {
  const cols = TABLES[table].cols;
  const now = Utilities.formatDate(new Date(), 'Asia/Bangkok', "yyyy-MM-dd'T'HH:mm:ss");
  rec = Object.assign({}, rec, { id: Utilities.getUuid().slice(0, 8) });
  if (cols.indexOf('createdAt') >= 0) { rec.createdAt = now; rec.updatedAt = now; }
  sheet_(table).appendRow(cols.map(function (c) { return rec[c] === undefined || rec[c] === null ? '' : String(rec[c]); }));
  return rec;
}

function update_(table, rec) {
  const cols = TABLES[table].cols;
  const sh = sheet_(table);
  const row = findRow_(sh, rec.id);
  if (!row) throw new Error('ไม่พบรายการที่ต้องการแก้ไข');
  const cur = sh.getRange(row, 1, 1, cols.length).getValues()[0];
  if (cols.indexOf('updatedAt') >= 0) rec.updatedAt = Utilities.formatDate(new Date(), 'Asia/Bangkok', "yyyy-MM-dd'T'HH:mm:ss");
  const next = cols.map(function (c, i) {
    if (c === 'id' || c === 'createdAt') return cur[i];
    return rec[c] === undefined ? cur[i] : String(rec[c]);
  });
  sh.getRange(row, 1, 1, cols.length).setValues([next]);
}

function remove_(table, id) {
  const sh = sheet_(table);
  const row = findRow_(sh, id);
  if (row) sh.deleteRow(row);
}

function findRow_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

// ---------------------------------------------------------------------------
// แท็บรายงาน (อ่านได้ทันทีในชีต — สร้างใหม่ทุกครั้งที่มีการบันทึก/แก้ไข)
// ---------------------------------------------------------------------------
function refreshReportSheet_() {
  const ss = ss_();
  const sh = ss.getSheetByName(REPORT_SHEET) || ss.insertSheet(REPORT_SHEET, 0);
  const name = {};
  ['prefixes', 'departments', 'positions', 'staffTypes', 'providers', 'formats', 'courses'].forEach(function (t) {
    name[t] = {}; readTable_(t).forEach(function (r) { name[t][r.id] = r.name; });
  });
  const emps = readTable_('employees'), emp = {}, order = {};
  emps.forEach(function (e, i) { emp[e.id] = e; order[e.id] = i; });
  const trs = readTable_('trainings').filter(function (t) { return emp[t.employeeId]; });
  trs.sort(function (a, b) {
    return (fyOf_(b.startDate) - fyOf_(a.startDate)) || (order[a.employeeId] - order[b.employeeId]) || a.startDate.localeCompare(b.startDate);
  });
  const head = ['ปีงบประมาณ', 'คำนำหน้า', 'ชื่อ - นามสกุล', 'ตำแหน่ง', 'สังกัด', 'ประเภทเจ้าหน้าที่', 'หลักสูตรที่ผ่านการอบรม',
    'หน่วยงานผู้จัด', 'รูปแบบการอบรม', 'วันที่เริ่ม', 'วันที่สิ้นสุด', 'จำนวนชั่วโมง', 'ใบประกาศนียบัตร', 'บันทึกเมื่อ'];
  const rows = trs.map(function (t) {
    const e = emp[t.employeeId];
    return [String(fyOf_(t.startDate) || 'ไม่ระบุวันที่'), name.prefixes[e.prefixId] || '', e.name, name.positions[e.positionId] || '',
      name.departments[e.departmentId] || '', name.staffTypes[e.staffTypeId] || '', name.courses[t.courseId] || '',
      name.providers[t.providerId] || '', name.formats[t.formatId] || '', thDate_(t.startDate), thDate_(t.endDate),
      t.hours, t.certUrl, String(t.createdAt).replace('T', ' ')];
  });
  sh.clearContents();
  sh.getRange(1, 1, Math.max(rows.length + 1, 2), head.length).setNumberFormat('@');
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#dbe6f3');
  if (rows.length) sh.getRange(2, 1, rows.length, head.length).setValues(rows);
  sh.setFrozenRows(1);
  protectSheet_(sh, 'แท็บนี้สร้างอัตโนมัติจากระบบ — การแก้ไขในแท็บนี้จะถูกเขียนทับ');
}

function protectSheet_(sh, msg) {
  // แบบ "แจ้งเตือน" — ผู้แก้ไขยังแก้ได้ แต่จะมีคำเตือนก่อนแก้ข้อมูลด้วยมือ
  if (sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).length) return;
  sh.protect().setDescription(msg).setWarningOnly(true);
}

function certFolder_(fy) {
  ensureSettings_();
  const root = DriveApp.getFolderById(getSetting_('CERT_FOLDER_ID'));
  const label = 'ปีงบประมาณ ' + (fy || 'ไม่ระบุ');
  const it = root.getFoldersByName(label);
  return it.hasNext() ? it.next() : root.createFolder(label);
}

/** แสดงข้อความเป็นกล่องในชีต (เมื่อรันจากเมนู) หรือใน Log (เมื่อรันจาก editor) */
function notify_(msg) {
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { /* รันจาก editor/trigger */ }
}

// ---------------------------------------------------------------------------
// utils
// ---------------------------------------------------------------------------
function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ---------------------------------------------------------------------------
// utils (อื่น ๆ)
// ---------------------------------------------------------------------------
function fyOf_(iso) {
  if (!iso) return 0;
  const p = String(iso).split('-').map(Number);
  return p[0] + 543 + (p[1] >= 10 ? 1 : 0);
}

function thDate_(iso) {
  if (!iso) return '';
  const p = String(iso).split('-').map(Number);
  return p[2] + ' ' + TH_MONTHS[p[1] - 1] + ' ' + (p[0] + 543);
}

function isIsoDate_(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return false;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (y < 1900 || y > 2200 || mo < 1 || mo > 12 || d < 1) return false;
  return d <= new Date(Date.UTC(y, mo, 0)).getUTCDate();
}

/** ชั่วโมง: ว่างได้ หรือเป็นตัวเลข 0–999 */
function isValidHours_(h) {
  if (h === undefined || h === null || String(h).trim() === '') return true;
  const n = Number(h);
  return isFinite(n) && n >= 0 && n <= 999;
}
function hoursStr_(h) { return (h === undefined || h === null || String(h).trim() === '') ? '' : String(Number(h)); }

function getSetting_(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }

function hash_(s) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'dft-training:' + s, Utilities.Charset.UTF_8);
  return raw.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

/** คีย์สำหรับตรวจชื่อซ้ำ: ตัดช่องว่าง/เครื่องหมาย และตัวพิมพ์ */
function normKey_(s) {
  return String(s || '').toLowerCase().replace(/ํา/g, 'ำ').replace(/[\s:.\-–()]/g, '');
}
