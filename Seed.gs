/**
 * ข้อมูลจากชีตเดิม "ตั้งแต่วันที่ 1 ตุลาคม 2568 - 30 กันยายน 2569" (ปรับรูปแบบแล้ว)
 * - แยกคำนำหน้าออกจากชื่อ, แปลงวันที่ไทยเป็น ค.ศ. (yyyy-mm-dd)
 * - ตัดเลขลำดับหน้าชื่อหลักสูตร และรวมชื่อหลักสูตรที่เขียนต่างกันให้เป็นชื่อเดียว
 * ใช้โดยฟังก์ชัน importLegacyData() ใน Code.gs
 */
const LEGACY_SEED = {
 "employees": [
  {
   "prefix": "นาง",
   "name": "สรารัศม์ ภัทรหิรัณย์คุณ",
   "position": "ผู้อำนวยการศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร"
  },
  {
   "prefix": "นาง",
   "name": "ปัณณพร ยุติธรรมคุณา",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการพิเศษ"
  },
  {
   "prefix": "นางสาว",
   "name": "กฤษณา กุดั่น",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการพิเศษ"
  },
  {
   "prefix": "นาย",
   "name": "กังสทัศน์ รอบคอบ",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการพิเศษ"
  },
  {
   "prefix": "นาง",
   "name": "พรวดี แสงทับทิม",
   "position": "นักวิชาการพาณิชย์ชำนาญการพิเศษ"
  },
  {
   "prefix": "นาง",
   "name": "กนกอร ไทยรัก",
   "position": "นักวิชาการพาณิชย์ชำนาญการพิเศษ"
  },
  {
   "prefix": "นางสาว",
   "name": "พัชรินทร์ธร ดีสมจรนีย์",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นางสาว",
   "name": "บุษกร ธีรนันทน์",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นางสาว",
   "name": "พิไลพร พวงสมบัติ",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นางสาว",
   "name": "รัตนา แสนสุข",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นางสาว",
   "name": "วรากร คำมูล",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นางสาว",
   "name": "วิจิตรา ตรีพลกุล",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นาย",
   "name": "เชิง ชุมภู",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นาย",
   "name": "เดชา ภาษี",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นาย",
   "name": "คณุตม์ พึ่งเกษม",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นาย",
   "name": "นริศร จินตวรรณ",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นาย",
   "name": "มารุต เหล่าสิทธิบุญชัย",
   "position": "นักวิชาการคอมพิวเตอร์ชำนาญการ"
  },
  {
   "prefix": "นาย",
   "name": "ลือชา ชูเชิด",
   "position": "นักวิชาการพาณิชย์ชำนาญการ"
  },
  {
   "prefix": "นาย",
   "name": "สมภพ ชุ่มมณีกูล",
   "position": "นักคอมพิวเตอร์"
  },
  {
   "prefix": "",
   "name": "อดิเทพ รอดพุก",
   "position": "นักคอมพิวเตอร์"
  },
  {
   "prefix": "นาง",
   "name": "ปาริชา ดำรงวณิชย์",
   "position": "เจ้าพนักงานธุรการชำนาญงาน"
  },
  {
   "prefix": "นาง",
   "name": "ประภารัตน์ รัตนสัมฤทธิ์",
   "position": "เจ้าพนักงานธุรการชำนาญงาน"
  },
  {
   "prefix": "นาย",
   "name": "สิริชัย เผ่าพันธ์",
   "position": "นักคอมพิวเตอร์"
  },
  {
   "prefix": "นางสาว",
   "name": "ภัคธนัช กลั่นเอม",
   "position": "นักวิชาการพาณิชย์ชำนาญการ"
  },
  {
   "prefix": "",
   "name": "ฐิติมนต์ วิทูภาสกาญจน์",
   "position": "นักวิชาการพาณิชย์ชำนาญการ"
  }
 ],
 "trainings": [
  {
   "emp": 0,
   "course": "ธรรมาภิบาลข้อมูล สำหรับผู้บริหารองค์กร",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-12",
   "end": "2026-03-12"
  },
  {
   "emp": 2,
   "course": "ทักษะเอไอระดับพื้นฐาน (AI Basics)",
   "provider": "TDGA",
   "format": "",
   "start": "",
   "end": ""
  },
  {
   "emp": 2,
   "course": "การออกแบบและพัฒนา Data Visualization สำหรับผู้ปฏิบัติงาน (Data Visualization Design and Development for Practitioners)",
   "provider": "BDE",
   "format": "",
   "start": "",
   "end": ""
  },
  {
   "emp": 3,
   "course": "ความเข้าใจการบริหารความเสี่ยงและความปลอดภัยไซเบอร์ (Understanding Cybersecurity Risk Management)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-10",
   "end": "2026-03-10"
  },
  {
   "emp": 3,
   "course": "AI Governance & Ethics หลักการจริยธรรม ธรรมาภิบาล และข้อกฎหมายในการประยุกต์ใช้ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-13",
   "end": "2026-03-13"
  },
  {
   "emp": 4,
   "course": "ความเข้าใจและใช้เทคโนโลยีดิจิทัล ทักษะที่จำเป็นสำหรับการปฏิบัติงาน",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-16",
   "end": "2026-03-16"
  },
  {
   "emp": 4,
   "course": "การตรวจติดตามสำหรับการตรวจประเมินภายใน (Internal Audit) ให้สอดคล้องกับมาตรฐาน ISO/IEC 27001 : 2022",
   "provider": "บริษัท เอเชี่ยน อินเทลลีเจนท์ อินฟอร์เมชั่น เทคโนโลยี จำกัด",
   "format": "ออนไลน์",
   "start": "2026-07-09",
   "end": "2026-07-09"
  },
  {
   "emp": 5,
   "course": "ทักษะเอไอระดับพื้นฐาน (AI Basics)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-10-10",
   "end": "2025-10-10"
  },
  {
   "emp": 5,
   "course": "AI for Everyone : ปัญญาประดิษฐ์เพื่ออนาคตของทุกคน",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-10-10",
   "end": "2025-10-10"
  },
  {
   "emp": 5,
   "course": "การประยุกต์ใช้ความรู้ปัญญาประดิษฐ์ในการพัฒนาหุ่นยนต์สนทนา (Chatbot) เพื่อการบริการภาครัฐ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-10-21",
   "end": "2025-10-21"
  },
  {
   "emp": 5,
   "course": "หลักการสร้างภาพข้อมูลและการออกแบบ Dashboard อย่างมีประสิทธิภาพ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-12",
   "end": "2025-11-12"
  },
  {
   "emp": 5,
   "course": "กฎหมายคุ้มครองข้อมูลส่วนบุคคลสำหรับผู้ปฏิบัติงานภาครัฐ (PDPA for Government Officer)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-07",
   "end": "2026-09-07"
  },
  {
   "emp": 6,
   "course": "AI Governance & Ethics หลักการจริยธรรม ธรรมาภิบาล และข้อกฎหมายในการประยุกต์ใช้ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-27",
   "end": "2025-11-27"
  },
  {
   "emp": 6,
   "course": "แนวทางในการนำเทคโนโลยีปัญญาประดิษฐ์มาใช้สำหรับบริการภาครัฐ (AI for Government Services)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-27",
   "end": "2025-11-27"
  },
  {
   "emp": 6,
   "course": "AI for Everyone : ปัญญาประดิษฐ์เพื่ออนาคตของทุกคน",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-02",
   "end": "2026-09-02"
  },
  {
   "emp": 6,
   "course": "กฎหมายคุ้มครองข้อมูลส่วนบุคคลสำหรับผู้ปฏิบัติงานภาครัฐ (PDPA for Government Officer)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-07",
   "end": "2026-09-07"
  },
  {
   "emp": 7,
   "course": "การบริหารจัดการโครงการด้วยอไจล์ (Agile Project Management)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-07-13",
   "end": "2026-07-13"
  },
  {
   "emp": 7,
   "course": "กฎหมายคุ้มครองข้อมูลส่วนบุคคลสำหรับผู้ปฏิบัติงานภาครัฐ (PDPA for Government Officer)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-12-12",
   "end": "2025-12-12"
  },
  {
   "emp": 8,
   "course": "AI Governance & Ethics หลักการจริยธรรม ธรรมาภิบาล และข้อกฎหมายในการประยุกต์ใช้ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-13",
   "end": "2026-03-13"
  },
  {
   "emp": 8,
   "course": "การตรวจติดตามสำหรับการตรวจประเมินภายใน (Internal Audit) ให้สอดคล้องกับมาตรฐาน ISO/IEC 27001 : 2022",
   "provider": "บริษัท เอเชี่ยน อินเทลลีเจนท์ อินฟอร์เมชั่น เทคโนโลยี จำกัด",
   "format": "ออนไลน์",
   "start": "2026-07-09",
   "end": "2026-07-09"
  },
  {
   "emp": 8,
   "course": "การพัฒนา AI Chatbot เพื่อยกระดับองค์กรสู่ดิจิทัล",
   "provider": "สดช.",
   "format": "ออนไซต์",
   "start": "2026-06-22",
   "end": "2026-06-24"
  },
  {
   "emp": 9,
   "course": "ความรู้ความเข้าใจเกี่ยวกับปัญญาประดิษฐ์ (Artificial Intelligence) สำหรับบุคลากรภาครัฐทุกระดับ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-13",
   "end": "2025-11-13"
  },
  {
   "emp": 9,
   "course": "ความมั่นคงปลอดภัยทางไซเบอร์เบื้องต้น (Basic Cybersecurity Series)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-05",
   "end": "2026-03-05"
  },
  {
   "emp": 9,
   "course": "การใช้เครื่องมือดิจิทัลเพื่อการทำงานภาครัฐ (Essential Digital Tools for Workplace)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-03",
   "end": "2026-09-03"
  },
  {
   "emp": 9,
   "course": "การเปลี่ยนผ่านสู่องค์กรดิจิทัล (Digital Transformation)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-10",
   "end": "2026-09-10"
  },
  {
   "emp": 10,
   "course": "กฎหมายคุ้มครองข้อมูลส่วนบุคคลสำหรับผู้ปฏิบัติงานภาครัฐ (PDPA for Government Officer)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-07",
   "end": "2026-09-07"
  },
  {
   "emp": 10,
   "course": "การขับเคลื่อนด้วยข้อมูลสู่การเป็นรัฐบาลดิจิทัล (Data Driven Digital Government Transformation)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-11",
   "end": "2026-03-11"
  },
  {
   "emp": 10,
   "course": "เรียนรู้ Prompt Engineering สู่ความเป็นผู้เชี่ยวชาญ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-10-21",
   "end": "2025-10-21"
  },
  {
   "emp": 11,
   "course": "ความเข้าใจการบริหารความเสี่ยงและความปลอดภัยไซเบอร์ (Understanding Cybersecurity Risk Management)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-06-29",
   "end": "2026-06-29"
  },
  {
   "emp": 11,
   "course": "เรียนรู้ Prompt Engineering สู่ความเป็นผู้เชี่ยวชาญ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-07-24",
   "end": "2026-07-24"
  },
  {
   "emp": 11,
   "course": "แนวปฏิบัติกระบวนการทางดิจิทัลภาครัฐเพื่อสนับสนุนการดำเนินการตาม พรบ.ปฏิบัติราชการฯ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-16",
   "end": "2026-09-16"
  },
  {
   "emp": 12,
   "course": "ภาวะผู้นำในยุคดิจิทัล (Digital Leadership)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-15",
   "end": "2026-09-15"
  },
  {
   "emp": 12,
   "course": "ความฉลาดทางดิจิทัล (Digital Intelligence)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-06-16",
   "end": "2026-06-16"
  },
  {
   "emp": 12,
   "course": "ความมั่นคงปลอดภัยทางไซเบอร์เบื้องต้น (Basic Cybersecurity Series)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-06-16",
   "end": "2026-06-16"
  },
  {
   "emp": 12,
   "course": "ทักษะเอไอระดับพื้นฐาน (AI Basics)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-04",
   "end": "2025-11-04"
  },
  {
   "emp": 12,
   "course": "การเปลี่ยนผ่านสู่องค์กรดิจิทัล (Digital Transformation)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-04",
   "end": "2025-11-04"
  },
  {
   "emp": 13,
   "course": "ภาวะผู้นำในยุคดิจิทัล (Digital Leadership)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "",
   "end": ""
  },
  {
   "emp": 13,
   "course": "ทักษะเอไอระดับพื้นฐาน (AI Basics)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-10-01",
   "end": "2026-10-01"
  },
  {
   "emp": 13,
   "course": "AI Governance & Ethics หลักการจริยธรรม ธรรมาภิบาล และข้อกฎหมายในการประยุกต์ใช้ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-10-01",
   "end": "2026-10-01"
  },
  {
   "emp": 13,
   "course": "AI for Everyone : ปัญญาประดิษฐ์เพื่ออนาคตของทุกคน",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-10-01",
   "end": "2026-10-01"
  },
  {
   "emp": 13,
   "course": "แนวทางในการนำเทคโนโลยีปัญญาประดิษฐ์มาใช้สำหรับบริการภาครัฐ (AI for Government Services)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-10-01",
   "end": "2026-10-01"
  },
  {
   "emp": 13,
   "course": "ความรู้ความเข้าใจเกี่ยวกับปัญญาประดิษฐ์ (Artificial Intelligence) สำหรับบุคลากรภาครัฐทุกระดับ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-10-02",
   "end": "2026-10-02"
  },
  {
   "emp": 14,
   "course": "AI for Everyone : ปัญญาประดิษฐ์เพื่ออนาคตของทุกคน",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-16",
   "end": "2026-03-16"
  },
  {
   "emp": 15,
   "course": "การออกแบบและพัฒนา Data Visualization สำหรับผู้ปฏิบัติงาน (Data Visualization Design and Development for Practitioners)",
   "provider": "BDE",
   "format": "ออนไลน์",
   "start": "2025-10-21",
   "end": "2025-10-21"
  },
  {
   "emp": 16,
   "course": "ความมั่นคงปลอดภัยทางไซเบอร์เบื้องต้น (Basic Cybersecurity Series)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-10-09",
   "end": "2025-10-09"
  },
  {
   "emp": 16,
   "course": "ความรู้ความเข้าใจเกี่ยวกับปัญญาประดิษฐ์ (Artificial Intelligence) สำหรับบุคลากรภาครัฐทุกระดับ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-05",
   "end": "2026-03-05"
  },
  {
   "emp": 16,
   "course": "AI Governance & Ethics หลักการจริยธรรม ธรรมาภิบาล และข้อกฎหมายในการประยุกต์ใช้ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-08-31",
   "end": "2026-08-31"
  },
  {
   "emp": 16,
   "course": "การเปลี่ยนผ่านสู่องค์กรดิจิทัล (Digital Transformation)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-09-07",
   "end": "2026-09-07"
  },
  {
   "emp": 18,
   "course": "AI Governance & Ethics หลักการจริยธรรม ธรรมาภิบาล และข้อกฎหมายในการประยุกต์ใช้ AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-25",
   "end": "2025-11-25"
  },
  {
   "emp": 18,
   "course": "ความฉลาดทางดิจิทัล (Digital Intelligence)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-25",
   "end": "2025-11-25"
  },
  {
   "emp": 18,
   "course": "Leadership in the Age of AI ผู้นำในยุค AI",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-27",
   "end": "2025-11-27"
  },
  {
   "emp": 18,
   "course": "ความรู้ความเข้าใจเกี่ยวกับปัญญาประดิษฐ์ (Artificial Intelligence) สำหรับบุคลากรภาครัฐทุกระดับ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2025-11-27",
   "end": "2025-11-27"
  },
  {
   "emp": 19,
   "course": "บทเรียนการออกแบบ UX/UI สุดปังเพื่อดึงดูดความสนใจของผู้ใช้ (Awesome UX/UI design to Grab the User Attention)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-02-13",
   "end": "2026-02-13"
  },
  {
   "emp": 19,
   "course": "ทักษะเอไอระดับพื้นฐาน (AI Basics)",
   "provider": "TDGA",
   "format": "",
   "start": "2026-02-13",
   "end": "2026-02-13"
  },
  {
   "emp": 19,
   "course": "AI for Everyone : ปัญญาประดิษฐ์เพื่ออนาคตของทุกคน",
   "provider": "TDGA",
   "format": "",
   "start": "2026-09-18",
   "end": "2026-09-18"
  },
  {
   "emp": 21,
   "course": "ความเข้าใจและใช้เทคโนโลยีดิจิทัล ทักษะที่จำเป็นสำหรับการปฏิบัติงาน",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-11",
   "end": "2026-03-11"
  },
  {
   "emp": 21,
   "course": "ความฉลาดทางดิจิทัล (Digital Intelligence)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-10",
   "end": "2026-03-10"
  },
  {
   "emp": 22,
   "course": "แนวทางและแนวปฏิบัติการเปิดเผยข้อมูลภาครัฐ (Open Government Data Guideline)",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-11",
   "end": "2026-03-11"
  },
  {
   "emp": 22,
   "course": "การประยุกต์ใช้ความรู้ปัญญาประดิษฐ์ในการพัฒนาหุ่นยนต์สนทนา (Chatbot) เพื่อการบริการภาครัฐ",
   "provider": "TDGA",
   "format": "ออนไลน์",
   "start": "2026-03-11",
   "end": "2026-03-11"
  },
  {
   "emp": 23,
   "course": "Google Tools เพื่อการพัฒนางาน",
   "provider": "BDE",
   "format": "ออนไลน์",
   "start": "2025-12-19",
   "end": "2025-12-19"
  },
  {
   "emp": 23,
   "course": "ความตระหนักในการใช้เทคโนโลยีให้ปลอดภัยสำหรับผู้ปฏิบัติงาน (Technology Safety Awareness for Practitioners)",
   "provider": "BDE",
   "format": "ออนไลน์",
   "start": "2026-08-24",
   "end": "2026-08-24"
  }
 ],
 "providerFull": {
  "TDGA": "สถาบันพัฒนาบุคลากรภาครัฐด้านดิจิทัล (TDGA)",
  "BDE": "สถาบันพัฒนาบุคลากรด้านดิจิทัล (BDE)",
  "สดช.": "สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ (สดช.)"
 },
 "department": "ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร"
};
