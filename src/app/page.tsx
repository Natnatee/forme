"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Check,
  Menu,
  Plus,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=85`;
const images = {
  hero: photo("photo-1600607687939-ce8a6c25118c"),
  house: photo("photo-1600210492486-724fe5c67fb0"),
  condo: photo("photo-1600607687920-4e2a09cf159d"),
  commercial: photo("photo-1497366811353-6870744d04b2"),
  detail: photo("photo-1600566753086-00f18fb6b3ea"),
  studio: photo("photo-1484154218962-a197022b5858"),
};

type Category = "all" | "house" | "condo" | "commercial";
type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "all">;
  label: string;
  area: string;
  year: string;
  image: string;
  alt: string;
  description: string;
  materials: string[];
  note: string;
};
const projects: Project[] = [
  {
    id: "01",
    title: "The Quiet Residence",
    subtitle: "A home, in its own rhythm.",
    category: "house",
    label: "Private residence",
    area: "320",
    year: "2025",
    image: images.house,
    alt: "ห้องนั่งเล่นโปร่ง โซฟาสีอ่อน และแสงธรรมชาติจากหน้าต่างบานใหญ่",
    description:
      "บ้านที่เริ่มต้นจากคำถามเรียบง่าย — เราอยากใช้ชีวิตในแต่ละวันอย่างไร? แนวคิดนี้วางพื้นที่ส่วนกลางไว้เป็นหัวใจของบ้าน เชื่อมมุมอ่านหนังสือ โต๊ะอาหาร และสวนเข้าด้วยกัน ให้แสงและลมเป็นส่วนหนึ่งของจังหวะชีวิต โดยไม่จำเป็นต้องเติมสิ่งของให้เต็มพื้นที่",
    materials: ["Natural oak", "Lime plaster", "Honed limestone"],
    note: "ออกแบบช่องเปิดเพื่อรับแสงอ่อน พร้อมพื้นที่กึ่งภายนอกที่ช่วยเชื่อมบ้านกับธรรมชาติ",
  },
  {
    id: "02",
    title: "Soft Geometry",
    subtitle: "Less space. More possibility.",
    category: "condo",
    label: "Urban apartment",
    area: "86",
    year: "2025",
    image: images.condo,
    alt: "พื้นที่ภายในสีขาวอบอุ่นพร้อมเฟอร์นิเจอร์ไม้และรายละเอียดเรียบง่าย",
    description:
      "คอนโดขนาดกะทัดรัดที่ไม่ลดทอนคุณภาพการอยู่อาศัย ใช้เส้นสายที่ต่อเนื่องและพื้นที่จัดเก็บที่กลมกลืนกับผนัง เพื่อให้ห้องเปลี่ยนบทบาทได้ระหว่างการทำงาน การพักผ่อน และการต้อนรับเพื่อน โทนสีอุ่นช่วยให้พื้นที่เมืองรู้สึกสงบและเป็นส่วนตัว",
    materials: ["Oak veneer", "Warm-white plaster", "Brushed steel"],
    note: "เฟอร์นิเจอร์บิลต์อินแบบยืดหยุ่นช่วยให้ทุกตารางเมตรมีความหมาย โดยยังเหลือพื้นที่ให้หายใจ",
  },
  {
    id: "03",
    title: "Common Ground",
    subtitle: "A place for ideas to meet.",
    category: "commercial",
    label: "Creative workplace",
    area: "240",
    year: "2024",
    image: images.commercial,
    alt: "สำนักงานเปิดโล่งพร้อมต้นไม้ แสงธรรมชาติ และพื้นที่นั่งทำงานร่วมกัน",
    description:
      "พื้นที่ทำงานที่มองความเป็นมนุษย์ก่อนประสิทธิภาพ แนวคิดแบ่งพื้นที่ตามระดับความสงบ ตั้งแต่โต๊ะสนทนาที่เปิดรับความคิดใหม่ ไปจนถึงมุมทำงานที่ต้องการสมาธิ ต้นไม้และวัสดุสัมผัสธรรมชาติทำหน้าที่เป็นจุดพักสายตาระหว่างวัน",
    materials: ["Reclaimed timber", "Exposed concrete", "Acoustic felt"],
    note: "จัดวางพื้นที่ทำงานร่วมกันสลับกับมุมส่วนตัว เพื่อรองรับจังหวะการทำงานที่แตกต่าง",
  },
];
const filters: { value: Category; label: string }[] = [
  { value: "all", label: "All spaces" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "commercial", label: "Commercial" },
];
const steps = [
  {
    title: "Listen first.",
    thai: "เริ่มจากการฟัง",
    text: "ทำความเข้าใจชีวิต ความต้องการ และข้อจำกัดของพื้นที่ เพื่อค้นหาคำถามที่ใช่ก่อนเริ่มออกแบบ",
  },
  {
    title: "Find the essence.",
    thai: "ค้นหาแก่นของพื้นที่",
    text: "แปลเรื่องราวของคุณเป็นแนวคิด ผังพื้นที่ และทิศทางวัสดุที่ชัดเจน ผ่านการแลกเปลี่ยนร่วมกัน",
  },
  {
    title: "Shape the details.",
    thai: "ใส่ใจทุกรายละเอียด",
    text: "พัฒนาแบบ แสง และพื้นผิวให้สอดคล้องกัน วางรายละเอียดที่รองรับทั้งความสวยงามและการใช้งาน",
  },
  {
    title: "Bring it to life.",
    thai: "จากแบบสู่การอยู่อาศัย",
    text: "วางแผนงานและประสานรายละเอียดระหว่างก่อสร้าง เพื่อให้แนวคิดค่อย ๆ กลายเป็นพื้นที่จริง",
  },
];

function keepDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  // Native modal inertness excludes the page, but some browsers still tab to browser chrome.
  const controls = event.currentTarget.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]',
  );
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      onKeyDown={keepDialogFocus}
      aria-labelledby="project-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <article className="dialog-content">
          <div className="dialog-top">
            <span className="eyebrow">Concept project / {project.id}</span>
            <button
              autoFocus
              className="icon-button"
              onClick={onClose}
              aria-label="ปิดรายละเอียดโครงการ"
            >
              <X />
            </button>
          </div>
          <div className="dialog-image">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>
          <div className="dialog-body">
            <p className="eyebrow">
              {project.label} — {project.year}
            </p>
            <h2 id="project-title">{project.title}</h2>
            <p className="thai-copy">{project.description}</p>
            <dl className="project-specs">
              <div>
                <dt>Area</dt>
                <dd>{project.area} m²</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>Architecture & interiors concept</dd>
              </div>
            </dl>
            <h3>Material palette</h3>
            <div className="material-list">
              {project.materials.map((material) => (
                <span key={material}>{material}</span>
              ))}
            </div>
            <div className="detail-image">
              <Image
                src={images.detail}
                alt="ภาพอ้างอิงพื้นที่ภายในและพื้นผิววัสดุโทนธรรมชาติ ไม่ใช่ภาพของโครงการจริง"
                fill
                sizes="(max-width: 900px) 90vw, 800px"
              />
            </div>
            <p className="thai-copy">{project.note}</p>
            <p className="disclaimer">
              โครงการและข้อมูลทั้งหมดเป็นเรื่องสมมติ ภาพจาก Unsplash
              ใช้ประกอบแนวคิด ไม่ใช่ผลงานจริงหรือภาพสถานที่เดียวกัน
            </p>
            <button
              className="text-link"
              onClick={() => {
                onClose();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "auto" });
              }}
            >
              เริ่มต้นจากพื้นที่ของคุณ <ArrowUpRight size={18} />
            </button>
          </div>
        </article>
      )}
    </dialog>
  );
}

export default function Home() {
  const [category, setCategory] = useState<Category>("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState<{
    type: string;
    area: string;
    budget: string;
  } | null>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const dialog = menuRef.current;
    const trigger = menuButton.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      media.removeEventListener("change", closeOnDesktop);
      trigger?.focus({ preventScroll: true });
    };
  }, [menuOpen]);
  useEffect(() => {
    if (submitted) confirmation.current?.focus();
  }, [submitted]);
  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted({
      type: String(data.get("type")),
      area: String(data.get("area")),
      budget: String(data.get("budget")),
    });
  }
  const visibleProjects = projects.filter(
    (project) => category === "all" || project.category === category,
  );
  const navigation = [
    { href: "#projects", name: "Selected work" },
    { href: "#studio", name: "The studio" },
    { href: "#process", name: "Our approach" },
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        ข้ามไปเนื้อหา
      </a>
      <header className="header">
        <a className="wordmark" href="#" aria-label="FORME หน้าแรก">
          FORME<span>®</span>
        </a>
        <span className="header-caption">
          Architecture
          <br />& Interiors
        </span>
        <nav className="desktop-nav" aria-label="เมนูหลัก">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="#contact">
          Let’s talk <ArrowUpRight size={17} />
        </a>
        <button
          ref={menuButton}
          className="icon-button menu-button"
          aria-label="เปิดเมนู"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </button>
      </header>
      <dialog
        id="mobile-menu"
        ref={menuRef}
        className="mobile-menu"
        onKeyDown={keepDialogFocus}
        aria-labelledby="menu-title"
        onCancel={(event) => {
          event.preventDefault();
          setMenuOpen(false);
        }}
      >
        <div className="dialog-top">
          <span id="menu-title" className="wordmark">
            FORME
          </span>
          <button
            className="icon-button"
            aria-label="ปิดเมนู"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
        </div>
        <nav aria-label="เมนูมือถือ">
          {[...navigation, { href: "#contact", name: "Let’s talk" }].map(
            (item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                <small>0{index + 1}</small>
                {item.name}
                <ArrowUpRight />
              </a>
            ),
          )}
        </nav>
        <p className="eyebrow">Thoughtful spaces. Meaningful living.</p>
      </dialog>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-heading">
            <div>
              <p className="eyebrow">
                <span className="status-dot" /> Independent design studio ·
                Concept edition
              </p>
              <h1 id="hero-title">
                Space to live.
                <br />
                <span>Room to feel.</span>
              </h1>
            </div>
            <div className="hero-aside">
              <span className="coordinate">
                13°45′ N &nbsp; 100°30′ E<br />
                BANGKOK, THAILAND
              </span>
              <p>
                ออกแบบพื้นที่
                <br />
                ให้ชีวิตได้เป็นตัวเอง
              </p>
              <a
                href="#projects"
                className="circle-link"
                aria-label="ดูโครงการตัวอย่าง"
              >
                <ArrowDown size={22} />
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <Image
              src={images.hero}
              alt="สถาปัตยกรรมภายในโปร่งสูง บันไดเรียบ และแสงธรรมชาติบนวัสดุโทนอุ่น"
              fill
              priority
              sizes="100vw"
            />
            <div className="hero-photo-label">
              <span>THE ART OF EVERYDAY LIVING</span>
              <span>FORME / STUDY NO. 01</span>
            </div>
            <a className="hero-feature" href="#projects">
              <span>
                <small>Featured concept</small>The Quiet Residence
              </span>
              <ArrowUpRight />
            </a>
          </div>
          <div className="photo-caption">
            <span>Architecture, interiors & the spaces in between.</span>
            <span>Illustrative photography / Unsplash</span>
          </div>
        </section>
        <section className="intro section-shell">
          <p className="eyebrow section-index">01 / Our perspective</p>
          <div>
            <h2>
              Not just a place.
              <br />
              <span>A way of living.</span>
            </h2>
            <div className="intro-bottom">
              <p className="thai-copy">
                เราเชื่อว่าพื้นที่ที่ดี ไม่ได้เริ่มจากรูปทรงที่สวยงาม
                <br className="desktop-break" />{" "}
                แต่เริ่มจากความเข้าใจคนที่ใช้ชีวิตอยู่ในนั้น
                <br />
                เรียบง่ายอย่างมีความหมาย และอยู่ด้วยกันได้นาน
              </p>
              <a className="text-link" href="#studio">
                Get to know FORME <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>
        <section
          id="projects"
          className="projects section-shell"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / Selected work</p>
              <h2 id="work-title">
                Considered spaces<span className="heading-period">.</span>
              </h2>
            </div>
            <p className="section-note">
              Different lives. Different spaces.
              <br />
              The same attention to detail.
            </p>
          </div>
          <div className="filter-bar">
            <div
              className="filters"
              role="group"
              aria-label="กรองประเภทโครงการ"
            >
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  aria-pressed={category === filter.value}
                  onClick={() => setCategory(filter.value)}
                >
                  {filter.label}
                  {filter.value === "all" && <sup>03</sup>}
                </button>
              ))}
            </div>
            <span className="eyebrow" aria-live="polite">
              {String(visibleProjects.length).padStart(2, "0")} projects
            </span>
          </div>
          <div
            className={`project-grid ${category !== "all" ? "filtered-grid" : ""}`}
          >
            {visibleProjects.map((project) => (
              <button
                className={`project-card project-${project.id}`}
                key={project.id}
                onClick={() => setActiveProject(project)}
                aria-label={`ดูรายละเอียด ${project.title}`}
              >
                <div className="project-photo">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 60vw"
                  />
                  <span className="project-number">F—{project.id}</span>
                  <span className="project-open">
                    <Plus size={23} />
                  </span>
                </div>
                <div className="project-info">
                  <div>
                    <h3>{project.title}</h3>
                    <p>
                      {project.label} <span>/</span> {project.area} m²
                    </p>
                  </div>
                  <ArrowUpRight size={25} strokeWidth={1.2} />
                </div>
                <p className="project-subtitle">{project.subtitle}</p>
              </button>
            ))}
            {category === "all" && (
              <div className="work-note">
                <span className="line-symbol" aria-hidden="true">
                  F /
                </span>
                <p>
                  Good design leaves room
                  <br />
                  for life to happen.
                </p>
                <span className="eyebrow">A collection of imagined spaces</span>
              </div>
            )}
          </div>
          <p className="disclaimer">
            Portfolio concept — โครงการ ชื่อ พื้นที่ และปี
            เป็นข้อมูลสมมติทั้งหมด ภาพประกอบจาก Unsplash
            ไม่ใช่ผลงานของสตูดิโอจริง
          </p>
        </section>
        <section id="studio" className="studio" aria-labelledby="studio-title">
          <div className="studio-photo">
            <Image
              src={images.studio}
              alt="ครัวและพื้นที่อยู่อาศัยสีขาวตัดไม้ธรรมชาติ ใช้ประกอบแนวคิดการออกแบบ"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <span className="image-footnote">
              MATERIAL, LIGHT, AND EVERYTHING BETWEEN.
            </span>
          </div>
          <div className="studio-copy">
            <p className="eyebrow">03 / The studio</p>
            <h2 id="studio-title">
              Quiet by design.
              <br />
              <span>Human by nature.</span>
            </h2>
            <p className="thai-copy">
              FORME คือแนวคิดสตูดิโอสถาปัตยกรรมและออกแบบภายใน
              ที่ให้ความสำคัญกับความสัมพันธ์ระหว่างคน พื้นที่ และธรรมชาติ
            </p>
            <p className="thai-copy muted">
              เราสนใจแสงที่เปลี่ยนไปในแต่ละชั่วโมง พื้นผิวที่สวยขึ้นตามเวลา
              และรายละเอียดเล็ก ๆ ที่ทำให้การอยู่บ้านรู้สึกดีขึ้น
              โดยไม่ต้องเรียกร้องความสนใจ
            </p>
            <div className="studio-values">
              <div>
                <span>01</span>Honest materials
              </div>
              <div>
                <span>02</span>Natural light
              </div>
              <div>
                <span>03</span>Lasting simplicity
              </div>
            </div>
            <span className="eyebrow studio-signature">
              FORME — Less, but with meaning.
            </span>
          </div>
        </section>
        <section
          id="process"
          className="process section-shell"
          aria-labelledby="process-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / Our approach</p>
              <h2 id="process-title">A shared journey.</h2>
            </div>
            <p className="section-note">
              จากบทสนทนาแรก
              <br />
              สู่พื้นที่ที่เป็นคุณ
            </p>
          </div>
          <div className="steps">
            {steps.map((step, index) => (
              <article key={step.title}>
                <span className="step-number">
                  0{index + 1}
                  <ArrowRight size={18} />
                </span>
                <h3>{step.title}</h3>
                <h4>{step.thai}</h4>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="interlude" aria-label="ปรัชญาการออกแบบ">
          <p className="eyebrow">A note on our philosophy</p>
          <p>
            “The most beautiful thing
            <br />
            in a room should be
            <br />
            <em>the life lived in it.</em>”
          </p>
          <span className="eyebrow">The FORME concept manifesto</span>
        </section>
        <section
          id="contact"
          className="contact section-shell"
          aria-labelledby="contact-title"
        >
          <div className="contact-intro">
            <p className="eyebrow">05 / Start a conversation</p>
            <h2 id="contact-title">
              Your space.
              <br />
              <span>Our next story.</span>
            </h2>
            <p className="thai-copy">
              ทุกพื้นที่เริ่มต้นจากความเป็นไปได้
              <br />
              ลองเล่าโจทย์ของคุณให้เราฟัง
            </p>
            <div className="demo-note">
              <span className="status-dot" />
              <p>
                ลองวางโจทย์ให้พื้นที่ของคุณ
                <br />
                <small>
                  Demo only — ไม่ส่งข้อมูล ไม่ติดต่อกลับ
                  <br />
                  และไม่ต้องกรอกข้อมูลส่วนตัว
                </small>
              </p>
            </div>
          </div>
          <div className="quote-panel">
            {submitted ? (
              <div
                className="confirmation"
                ref={confirmation}
                tabIndex={-1}
                role="status"
              >
                <span className="confirmation-icon">
                  <Check size={28} />
                </span>
                <p className="eyebrow">Your imagined space / Demo</p>
                <h3>เริ่มต้นเรื่องราวแล้ว</h3>
                <p>
                  นี่คือสรุปโจทย์ตัวอย่างของคุณเท่านั้น
                  <br />
                  ไม่มีการส่ง บันทึกข้อมูล หรือติดต่อกลับ
                </p>
                <dl>
                  <div>
                    <dt>ประเภท</dt>
                    <dd>{submitted.type}</dd>
                  </div>
                  <div>
                    <dt>พื้นที่</dt>
                    <dd>{submitted.area} m²</dd>
                  </div>
                  <div>
                    <dt>งบประมาณ</dt>
                    <dd>{submitted.budget}</dd>
                  </div>
                </dl>
                <p className="disclaimer">
                  ขั้นตอนถัดไปในงานจริงคือสำรวจพื้นที่และพูดคุยขอบเขตงาน
                  สรุปนี้ไม่ใช่ใบเสนอราคาหรือการรับนัดหมาย
                </p>
                <button
                  className="text-link"
                  onClick={() => setSubmitted(null)}
                >
                  ลองโจทย์ใหม่ <ArrowUpRight size={18} />
                </button>
              </div>
            ) : (
              <form onSubmit={submitQuote}>
                <div className="form-heading">
                  <h3>Tell us about your space.</h3>
                  <span className="eyebrow">Demo brief</span>
                </div>
                <label htmlFor="type">
                  01 / ประเภทโครงการ <span>Project type</span>
                </label>
                <select id="type" name="type" required defaultValue="">
                  <option value="" disabled>
                    เลือกประเภทพื้นที่
                  </option>
                  <option>บ้านพักอาศัย / House</option>
                  <option>คอนโด / Condo</option>
                  <option>พื้นที่เชิงพาณิชย์ / Commercial</option>
                </select>
                <label htmlFor="area">
                  02 / ขนาดพื้นที่ <span>Area (m²)</span>
                </label>
                <input
                  id="area"
                  name="area"
                  type="number"
                  placeholder="เช่น 120"
                  min="1"
                  max="100000"
                  step="1"
                  required
                />
                <label htmlFor="budget">
                  03 / งบประมาณโดยประมาณ <span>Budget (THB)</span>
                </label>
                <select id="budget" name="budget" required defaultValue="">
                  <option value="" disabled>
                    เลือกช่วงงบประมาณ
                  </option>
                  <option>ต่ำกว่า 1 ล้านบาท</option>
                  <option>1–3 ล้านบาท</option>
                  <option>3–5 ล้านบาท</option>
                  <option>5–10 ล้านบาท</option>
                  <option>มากกว่า 10 ล้านบาท</option>
                  <option>ยังไม่แน่ใจ / ขอวางแนวทางก่อน</option>
                </select>
                <p className="form-privacy">
                  ทุกช่องจำเป็น · ใช้แสดงสรุปบนหน้านี้เท่านั้น
                  ไม่มีการส่งไปยังเซิร์ฟเวอร์
                </p>
                <button className="submit-button" type="submit">
                  สร้างโจทย์ตัวอย่าง <ArrowUpRight size={21} />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a href="#" className="footer-logo" aria-label="FORME กลับด้านบน">
            FORME<span>®</span>
          </a>
          <div>
            <p>Architecture & Interiors</p>
            <span>
              Thoughtful spaces.
              <br />
              Meaningful living.
            </span>
          </div>
          <a href="#" className="back-top" aria-label="กลับด้านบน">
            <ArrowUpRight size={24} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} FORME. A fictional studio concept.
          </span>
          <span>ภาพประกอบ Unsplash · เว็บไซต์สาธิตเท่านั้น</span>
          <span>Designed with intention.</span>
        </div>
      </footer>
      <ProjectDialog
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}
