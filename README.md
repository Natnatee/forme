# FORME — Architecture & Interiors

เว็บไซต์ single-page สตูดิโอสถาปัตยกรรมสมมติ สไตล์ premium editorial โทนกระดาษขาว–ถ่าน–เขียวหม่น รองรับมือถือและเดสก์ท็อป ใช้ข้อมูล mock ทั้งหมด ไม่มี backend, database, API key หรือ analytics

**Live Demo:** https://forme-beige.vercel.app/ (โครงการและฟอร์มเป็นข้อมูลจำลอง)

## เริ่มพัฒนา

ต้องมี Node.js >= 20.9 และ pnpm 9.15.4 คำสั่งต่อไปนี้รันจากโฟลเดอร์ `forme`

```sh
pnpm install --frozen-lockfile
pnpm dev
```

เปิด `http://localhost:3000` หากไม่มี pnpm ใช้ `corepack enable` และ `corepack prepare pnpm@9.15.4 --activate` ก่อน

## ตรวจสอบและ production

```sh
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm start
```

Browser tests ใช้ production build และเริ่ม/ปิด server พอร์ต 3100 ให้อัตโนมัติ:

```sh
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

ถ้ามี Google Chrome อยู่แล้ว ใช้ Git Bash `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e` แทนการดาวน์โหลด Chromium ได้ ทดสอบทั้ง desktop/mobile: filter, dialog, keyboard focus, Escape, form validation, demo confirmation, mobile navigation, viewport overflow และ reduced motion ภาพหน้าจออยู่ใน `test-results/` ซึ่งไม่รวมใน git

## Deploy บน Vercel

1. Import Git repository ใน Vercel
2. ตั้ง **Root Directory เป็น `forme`** หาก repository root คือ `template` (ถ้า repository ครอบ `template` อีกชั้น ให้เลือก `template/forme`)
3. Framework Preset: **Next.js**
4. Install Command: `pnpm install --frozen-lockfile`
5. Build Command: `pnpm build` ใช้ Output Directory ค่าเริ่มต้นของ Next.js
6. เลือก Node.js LTS ที่ >= 20.9 และกด Deploy ไม่ต้องเพิ่ม environment variables

ไม่ต้องแก้ config ของ `hotel` หรือ `clinic` และไม่ต้องตั้ง `output: export` เพราะใช้ Next.js Image Optimization

## ฟังก์ชัน

- โครงการสมมติ 3 ประเภท House / Condo / Commercial พร้อมตัวกรอง
- Native `<dialog>` แสดงแนวคิด วัสดุ พื้นที่ ปี และภาพประกอบ รองรับ focus containment, Escape, ปุ่มปิด และคืนโฟกัสให้ปุ่มเดิม
- เมนูมือถือแบบ modal และ anchor navigation
- ฟอร์ม demo รับเฉพาะประเภทงาน ขนาดพื้นที่ และช่วงงบประมาณ ใช้ browser validation และแสดงสรุปใน React state
- ไม่ส่งข้อมูล ไม่จัดเก็บใน localStorage/cookie ไม่เก็บชื่อ อีเมล เบอร์โทร ที่อยู่ และไม่มีการติดต่อกลับ รีโหลดหน้าแล้วข้อมูลหาย
- Skip link, focus indicator, alt text, filter announcement และ `prefers-reduced-motion`

## ไฟล์สำคัญ / ปรับเนื้อหา

- `src/app/page.tsx` — ข้อมูลโครงการ รูปภาพ sections, dialogs, filter และฟอร์ม
- `src/app/globals.css` — design tokens, layout, responsive และ reduced motion ใช้ Tailwind CSS v4 ร่วมกับ semantic CSS
- `src/app/layout.tsx` — metadata และภาษาหน้าเว็บ
- `src/app/icon.svg` — ไอคอน FORME
- `next.config.ts` — allowlist รูปจาก `images.unsplash.com`
- `tests/site.spec.ts`, `playwright.config.ts` — browser regression tests

Next.js 16.3.5, React/React DOM 19.2.8 และ eslint-config-next 16.3.5 ตรงกับ `clinic` โดยมี pnpm lockfile แยกโปรเจกต์ ใช้ system font เพื่อไม่ต้องดาวน์โหลด font ตอน build

## ภาพและข้อจำกัดของ demo

ภาพ Unsplash ทุกภาพเป็น **ภาพประกอบแนวคิด ไม่ใช่ผลงานจริง** และภาพประกอบในรายละเอียดอาจไม่ใช่สถานที่เดียวกัน ชื่อโครงการ ปี พื้นที่ และวัสดุเป็น mock ไม่ได้อ้างถึงลูกค้าจริง ไม่มี testimonial หรือสถิติผลงานที่สร้างขึ้น

รูปที่ใช้ (ตรวจ HTTP 200 แล้วในขั้นพัฒนา):

- `photo-1600607687939-ce8a6c25118c`
- `photo-1600210492486-724fe5c67fb0`
- `photo-1600607687920-4e2a09cf159d`
- `photo-1497366811353-6870744d04b2`
- `photo-1600566753086-00f18fb6b3ea`
- `photo-1484154218962-a197022b5858`

โหลดผ่าน `https://images.unsplash.com/<id>` และ Next Image รูปต้องใช้อินเทอร์เน็ตและขึ้นกับบริการภายนอก Vercel Image Optimization อาจนับตามโควตา/ค่าใช้จ่ายของแพ็กเกจ ก่อนใช้เชิงพาณิชย์ควรตรวจสิทธิ์ภาพและแทนด้วยภาพที่มีสิทธิ์ของตนเอง

ESLint 9 อาจแจ้ง deprecated ตอนติดตั้ง คง major version ให้เข้ากับโปรเจกต์ต้นแบบ ไม่ใช่ lint error ของเว็บไซต์
