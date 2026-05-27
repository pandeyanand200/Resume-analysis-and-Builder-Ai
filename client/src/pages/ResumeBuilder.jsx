import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Briefcase, GraduationCap, Wrench, FileText,
  Plus, Trash2, Download, ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff,
  Globe, Calendar, ShieldCheck, CreditCard, Clock,
  Languages, Award, Heart, FolderOpen, BookOpen, Trophy,
  Building2, BookMarked, Users, PenLine, LayoutTemplate, Camera
} from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

// ─── Default Data ─────────────────────────────────────────────────────────────
const defaultData = {
  personal: {
    fullName: '', title: '', email: '', phone: '', location: '',
    linkedin: '', website: '', nationality: '', dateOfBirth: '',
    visa: '', passport: '', availability: '', photo: null,
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  interests: [],
  projects: [],
  courses: [],
  awards: [],
  organisations: [],
  publications: [],
  references: [],
  declaration: { text: '', signatureDataUrl: null },
  custom: [],
};

const emptyExp = () => ({
  id: Date.now() + Math.random(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

const emptyEdu = () => ({
  id: Date.now() + Math.random(),
  institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '',
});

const emptyLang   = () => ({ id: Date.now() + Math.random(), language: '', proficiency: 'Intermediate' });
const emptyCert   = () => ({ id: Date.now() + Math.random(), name: '', issuer: '', date: '', url: '' });
const emptyProj   = () => ({ id: Date.now() + Math.random(), name: '', role: '', description: '', startDate: '', endDate: '', url: '' });
const emptyCourse = () => ({ id: Date.now() + Math.random(), name: '', provider: '', type: 'Online', completedDate: '' });
const emptyAward  = () => ({ id: Date.now() + Math.random(), title: '', issuer: '', date: '', description: '' });
const emptyOrg    = () => ({ id: Date.now() + Math.random(), name: '', role: '', startDate: '', endDate: '', description: '' });
const emptyPub    = () => ({ id: Date.now() + Math.random(), title: '', publisher: '', date: '', url: '', description: '' });
const emptyRef    = () => ({ id: Date.now() + Math.random(), name: '', position: '', company: '', email: '', phone: '' });
const emptyCustom = () => ({ id: Date.now() + Math.random(), title: '', content: '' });

// ─── Section tabs ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'personal',      label: 'Info',          icon: <User size={14} /> },
  { id: 'summary',       label: 'Summary',        icon: <FileText size={14} /> },
  { id: 'experience',    label: 'Experience',     icon: <Briefcase size={14} /> },
  { id: 'education',     label: 'Education',      icon: <GraduationCap size={14} /> },
  { id: 'skills',        label: 'Skills',         icon: <Wrench size={14} /> },
  { id: 'languages',     label: 'Languages',      icon: <Languages size={14} /> },
  { id: 'certificates',  label: 'Certificates',   icon: <Award size={14} /> },
  { id: 'interests',     label: 'Interests',      icon: <Heart size={14} /> },
  { id: 'projects',      label: 'Projects',       icon: <FolderOpen size={14} /> },
  { id: 'courses',       label: 'Courses',        icon: <BookOpen size={14} /> },
  { id: 'awards',        label: 'Awards',         icon: <Trophy size={14} /> },
  { id: 'organisations', label: 'Organisations',  icon: <Building2 size={14} /> },
  { id: 'publications',  label: 'Publications',   icon: <BookMarked size={14} /> },
  { id: 'references',    label: 'References',     icon: <Users size={14} /> },
  { id: 'declaration',   label: 'Declaration',    icon: <PenLine size={14} /> },
  { id: 'custom',        label: 'Custom',         icon: <LayoutTemplate size={14} /> },
];

const TEMPLATES = [
  'Modern', 'Classic', 'Minimal',
  'Executive', 'Creative', 'Tech', 'Elegant', 'Bold', 'Sidebar', 'Timeline', 'Compact'
];

const TEMPLATE_COLORS = {
  Modern:    '#4F46E5', Classic:  '#1a1a1a', Minimal:   '#0f172a',
  Executive: '#0F2144', Creative: '#7C3AED', Tech:      '#0D1117',
  Elegant:   '#8B7355', Bold:     '#E11D48', Sidebar:   '#0F766E',
  Timeline:  '#1D4ED8', Compact:  '#374151',
};

// ─── Shared Extra Sections Renderer ───────────────────────────────────────────
function ResumeExtras({ data, accent = '#4F46E5', dark = false }) {
  const { languages, certificates, interests, projects, courses, awards,
          organisations, publications, references, declaration, custom } = data;
  const txt  = dark ? '#E6EDF3' : '#374151';
  const sub  = dark ? '#8B949E' : '#6B7280';
  const bg   = dark ? '#161B22' : `${accent}0D`;
  const bdr  = dark ? '#30363D' : `${accent}25`;

  const STitle = ({ children }) => (
    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: accent, textTransform: 'uppercase',
      letterSpacing: '0.14em', marginBottom: 9, paddingBottom: 5,
      borderBottom: `1px solid ${bdr}` }}>{children}</div>
  );

  const hasAny = [languages, certificates, interests, projects, courses,
    awards, organisations, publications, references, custom]
    .some(a => Array.isArray(a) && a.length > 0) || declaration?.text;
  if (!hasAny) return null;

  return (
    <div style={{ marginTop: 20, fontSize: '0.825rem', lineHeight: 1.55 }}>

      {languages?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Languages</STitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {languages.map(l => (
              <span key={l.id} style={{ background: bg, color: accent, border: `1px solid ${bdr}`,
                padding: '3px 11px', borderRadius: 20, fontWeight: 700, fontSize: '0.775rem' }}>
                {l.language}{l.proficiency ? <span style={{ opacity: 0.65, fontWeight: 500 }}> · {l.proficiency}</span> : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {certificates?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Certificates</STitle>
          {certificates.map(c => (
            <div key={c.id} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: txt }}>{c.name}</span>
              {c.issuer && <span style={{ color: sub }}> · {c.issuer}</span>}
              {c.date && <span style={{ color: sub, fontSize: '0.775rem' }}> · {c.date}</span>}
            </div>
          ))}
        </div>
      )}

      {interests?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Interests</STitle>
          <div style={{ color: sub }}>{interests.join(' · ')}</div>
        </div>
      )}

      {projects?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Projects</STitle>
          {projects.map(p => (
            <div key={p.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: txt }}>{p.name}</span>
                {(p.startDate || p.endDate) && <span style={{ fontSize: '0.75rem', color: sub }}>{p.startDate}{p.endDate ? ` – ${p.endDate}` : ''}</span>}
              </div>
              {p.role && <div style={{ color: accent, fontWeight: 600, fontSize: '0.78rem' }}>{p.role}</div>}
              {p.description && <div style={{ color: sub, marginTop: 3, lineHeight: 1.6 }}>{p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {courses?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Courses</STitle>
          {courses.map(c => (
            <div key={c.id} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: txt }}>{c.name}</span>
              {c.provider && <span style={{ color: sub }}> · {c.provider}</span>}
              {c.completedDate && <span style={{ color: sub, fontSize: '0.775rem' }}> · {c.completedDate}</span>}
              {c.type && <span style={{ marginLeft: 6, fontSize: '0.72rem', background: bg, color: accent, border: `1px solid ${bdr}`, padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>{c.type}</span>}
            </div>
          ))}
        </div>
      )}

      {awards?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Awards</STitle>
          {awards.map(a => (
            <div key={a.id} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: txt }}>{a.title}</span>
                {a.date && <span style={{ fontSize: '0.75rem', color: sub }}>{a.date}</span>}
              </div>
              {a.issuer && <div style={{ color: accent, fontWeight: 600, fontSize: '0.78rem' }}>{a.issuer}</div>}
              {a.description && <div style={{ color: sub, lineHeight: 1.6 }}>{a.description}</div>}
            </div>
          ))}
        </div>
      )}

      {organisations?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Organisations</STitle>
          {organisations.map(o => (
            <div key={o.id} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: txt }}>{o.name}</span>
                {(o.startDate || o.endDate) && <span style={{ fontSize: '0.75rem', color: sub }}>{o.startDate}{o.endDate ? ` – ${o.endDate}` : ''}</span>}
              </div>
              {o.role && <div style={{ color: accent, fontWeight: 600, fontSize: '0.78rem' }}>{o.role}</div>}
              {o.description && <div style={{ color: sub, lineHeight: 1.6 }}>{o.description}</div>}
            </div>
          ))}
        </div>
      )}

      {publications?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Publications</STitle>
          {publications.map(p => (
            <div key={p.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: txt }}>{p.title}</span>
              {p.publisher && <span style={{ color: sub }}> · {p.publisher}</span>}
              {p.date && <span style={{ color: sub, fontSize: '0.775rem' }}> · {p.date}</span>}
              {p.description && <div style={{ color: sub, lineHeight: 1.6 }}>{p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {references?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <STitle>References</STitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
            {references.map(r => (
              <div key={r.id} style={{ padding: '9px 11px', background: bg, border: `1px solid ${bdr}`, borderRadius: 8 }}>
                <div style={{ fontWeight: 700, color: txt }}>{r.name}</div>
                {r.position && <div style={{ color: accent, fontWeight: 600, fontSize: '0.775rem' }}>{r.position}{r.company ? `, ${r.company}` : ''}</div>}
                {r.email && <div style={{ color: sub, fontSize: '0.75rem' }}>{r.email}</div>}
                {r.phone && <div style={{ color: sub, fontSize: '0.75rem' }}>{r.phone}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {custom?.filter(s => s.title || s.content).map(sec => (
        <div key={sec.id} style={{ marginBottom: 16 }}>
          {sec.title && <STitle>{sec.title}</STitle>}
          {sec.content && <div style={{ color: sub, lineHeight: 1.7 }}>{sec.content}</div>}
        </div>
      ))}

      {declaration?.text && (
        <div style={{ marginBottom: 16 }}>
          <STitle>Declaration</STitle>
          <div style={{ color: sub, lineHeight: 1.7, fontStyle: 'italic' }}>{declaration.text}</div>
          {declaration.signatureDataUrl && (
            <img src={declaration.signatureDataUrl} alt="Signature"
              style={{ maxHeight: 54, marginTop: 8, objectFit: 'contain' }} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Resume Preview Components ────────────────────────────────────────────────
function ResumeModern({ data }) {
  const { personal, summary, experience, education, skills } = data;
  return (
    <div className="resume-modern">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 4 }}>
        {personal.photo && (
          <img src={personal.photo} alt="Profile"
            style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid #4F46E5', flexShrink: 0, marginTop: 4 }} />
        )}
        <div style={{ flex: 1 }}>
          {personal.fullName && <div className="resume-name">{personal.fullName}</div>}
          {personal.title && <div className="resume-tagline">{personal.title}</div>}
          <div className="resume-contact">
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>📱 {personal.phone}</span>}
            {personal.location && <span>📍 {personal.location}</span>}
            {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            {personal.website && <span>🌐 {personal.website}</span>}
          </div>
        </div>
      </div>
      {summary && (
        <>
          <div className="resume-section-title">Professional Summary</div>
          <div className="resume-summary">{summary}</div>
        </>
      )}
      {experience.length > 0 && (
        <>
          <div className="resume-section-title">Work Experience</div>
          {experience.map(exp => (
            <div key={exp.id} className="resume-entry">
              <div className="entry-header">
                <div>
                  <div className="entry-title">{exp.position || 'Position'}</div>
                  <div className="entry-subtitle">{exp.company || 'Company'}</div>
                </div>
                <div className="entry-period">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              </div>
              {exp.description && <div className="entry-desc">{exp.description}</div>}
            </div>
          ))}
        </>
      )}
      {education.length > 0 && (
        <>
          <div className="resume-section-title">Education</div>
          {education.map(edu => (
            <div key={edu.id} className="resume-entry">
              <div className="entry-header">
                <div>
                  <div className="entry-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div className="entry-subtitle">{edu.institution}</div>
                </div>
                <div className="entry-period">{edu.startDate} – {edu.endDate}</div>
              </div>
              {edu.gpa && <div className="entry-desc">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </>
      )}
      {skills.length > 0 && (
        <>
          <div className="resume-section-title">Skills</div>
          <div className="resume-skills-wrap">
            {skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
          </div>
        </>
      )}
      <ResumeExtras data={data} accent="#4F46E5" />
    </div>
  );
}

function ResumeClassic({ data }) {
  const { personal, summary, experience, education, skills } = data;
  return (
    <div className="resume-classic">
      {personal.fullName && (
        <>
          <div className="resume-name">{personal.fullName}</div>
          {personal.title && <div className="resume-tagline">{personal.title}</div>}
          <div className="resume-contact">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
          </div>
        </>
      )}
      {summary && (
        <>
          <div className="resume-section-title">Summary</div>
          <div className="resume-summary">{summary}</div>
        </>
      )}
      {experience.length > 0 && (
        <>
          <div className="resume-section-title">Professional Experience</div>
          {experience.map(exp => (
            <div key={exp.id} className="resume-entry">
              <div className="entry-header">
                <div>
                  <div className="entry-title">{exp.position || 'Position'}</div>
                  <div className="entry-subtitle">{exp.company || 'Company'}</div>
                </div>
                <div className="entry-period">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && <div className="entry-desc">{exp.description}</div>}
            </div>
          ))}
        </>
      )}
      {education.length > 0 && (
        <>
          <div className="resume-section-title">Education</div>
          {education.map(edu => (
            <div key={edu.id} className="resume-entry">
              <div className="entry-header">
                <div>
                  <div className="entry-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div className="entry-subtitle">{edu.institution}</div>
                </div>
                <div className="entry-period">{edu.startDate} – {edu.endDate}</div>
              </div>
            </div>
          ))}
        </>
      )}
      {skills.length > 0 && (
        <>
          <div className="resume-section-title">Skills</div>
          <div className="resume-skills-wrap">
            {skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
          </div>
        </>
      )}
      <ResumeExtras data={data} accent="#1a1a1a" />
    </div>
  );
}

function ResumeMinimal({ data }) {
  const { personal, summary, experience, education, skills } = data;
  return (
    <div className="resume-minimal">
      {personal.fullName && (
        <>
          <div className="resume-name">{personal.fullName}</div>
          {personal.title && <div className="resume-tagline">{personal.title}</div>}
          <div className="resume-contact">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.website && <span>{personal.website}</span>}
          </div>
        </>
      )}
      {summary && (
        <>
          <div className="resume-section-title">About</div>
          <div className="resume-summary">{summary}</div>
        </>
      )}
      {experience.length > 0 && (
        <>
          <div className="resume-section-title">Experience</div>
          {experience.map(exp => (
            <div key={exp.id} className="resume-entry">
              <div className="entry-header">
                <div>
                  <div className="entry-title">{exp.position || 'Position'}</div>
                  <div className="entry-subtitle">{exp.company || 'Company'}</div>
                </div>
                <div className="entry-period">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && <div className="entry-desc">{exp.description}</div>}
            </div>
          ))}
        </>
      )}
      {education.length > 0 && (
        <>
          <div className="resume-section-title">Education</div>
          {education.map(edu => (
            <div key={edu.id} className="resume-entry">
              <div className="entry-header">
                <div>
                  <div className="entry-title">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</div>
                  <div className="entry-subtitle">{edu.institution}</div>
                </div>
                <div className="entry-period">{edu.startDate} – {edu.endDate}</div>
              </div>
            </div>
          ))}
        </>
      )}
      {skills.length > 0 && (
        <>
          <div className="resume-section-title">Skills</div>
          <div className="resume-skills-wrap">
            {skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
          </div>
        </>
      )}
      <ResumeExtras data={data} accent="#0f172a" />
    </div>
  );
}

// ─── Template: Executive ─────────────────────────────────────────────────────
function ResumeExecutive({ data }) {
  const { personal, summary, experience, education, skills } = data;
  const accent = '#0F2144';
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a', fontSize: '0.875rem', lineHeight: 1.5 }}>
      {/* Dark navy header */}
      <div style={{ background: accent, color: 'white', padding: '36px 48px 28px' }}>
        {personal.fullName && <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{personal.fullName}</div>}
        {personal.title && <div style={{ fontSize: '1rem', color: '#93C5FD', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{personal.title}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', fontSize: '0.8rem', color: '#CBD5E1' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>✆ {personal.phone}</span>}
          {personal.location && <span>⬡ {personal.location}</span>}
          {personal.linkedin && <span>⊛ {personal.linkedin}</span>}
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '28px 48px 40px' }}>
        {summary && (
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `3px double ${accent}` }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>Executive Profile</div>
            <div style={{ color: '#374151', lineHeight: 1.75, fontStyle: 'italic' }}>{summary}</div>
          </div>
        )}
        {experience.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14, borderBottom: `1px solid ${accent}`, paddingBottom: 6 }}>Professional Experience</div>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{exp.position || 'Position'}</div>
                    <div style={{ color: accent, fontWeight: 600, fontSize: '0.875rem', marginTop: 2 }}>{exp.company || 'Company'}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', background: '#F3F4F6', padding: '3px 10px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.description && <div style={{ color: '#4B5563', marginTop: 6, lineHeight: 1.65, fontSize: '0.85rem' }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          {education.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14, borderBottom: `1px solid ${accent}`, paddingBottom: 6 }}>Education</div>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.825rem' }}>{edu.institution} · {edu.startDate}–{edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
          {skills.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14, borderBottom: `1px solid ${accent}`, paddingBottom: 6 }}>Core Competencies</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map((s, i) => <span key={i} style={{ fontSize: '0.8rem', color: '#374151', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '3px 10px', borderRadius: 4 }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '0 48px 28px' }}><ResumeExtras data={data} accent="#0F2144" /></div>
    </div>
  );
}

// ─── Template: Creative (Purple sidebar) ─────────────────────────────────────
function ResumeCreative({ data }) {
  const { personal, summary, experience, education, skills } = data;
  const accent = '#7C3AED';
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 700, fontSize: '0.8rem' }}>
      {/* Left sidebar */}
      <div style={{ background: accent, color: 'white', padding: '36px 20px' }}>
        {personal.fullName && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900, marginBottom: 14 }}>
              {personal.fullName.charAt(0)}
            </div>
            <div style={{ fontWeight: 900, fontSize: '1rem', lineHeight: 1.3, letterSpacing: '-0.02em' }}>{personal.fullName}</div>
            {personal.title && <div style={{ fontSize: '0.75rem', color: '#DDD6FE', marginTop: 4, fontWeight: 500 }}>{personal.title}</div>}
          </div>
        )}
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C4B5FD', marginBottom: 10 }}>Contact</div>
        {personal.email && <div style={{ color: '#EDE9FE', marginBottom: 6, wordBreak: 'break-all' }}>{personal.email}</div>}
        {personal.phone && <div style={{ color: '#EDE9FE', marginBottom: 6 }}>{personal.phone}</div>}
        {personal.location && <div style={{ color: '#EDE9FE', marginBottom: 6 }}>{personal.location}</div>}
        {personal.linkedin && <div style={{ color: '#EDE9FE', marginBottom: 6, wordBreak: 'break-all' }}>{personal.linkedin}</div>}
        {skills.length > 0 && (
          <>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C4B5FD', marginTop: 24, marginBottom: 10 }}>Skills</div>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ color: '#EDE9FE', marginBottom: 3, fontSize: '0.775rem' }}>{s}</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 9999 }}>
                  <div style={{ height: '100%', background: '#A78BFA', borderRadius: 9999, width: `${Math.min(90, 65 + (i * 7) % 30)}%` }} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Right content */}
      <div style={{ padding: '36px 32px', background: 'white' }}>
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: accent }} />About Me
            </div>
            <div style={{ color: '#374151', lineHeight: 1.75 }}>{summary}</div>
          </div>
        )}
        {experience.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: accent }} />Experience
            </div>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: `3px solid ${accent}` }}>
                <div style={{ fontWeight: 700, color: '#111827' }}>{exp.position || 'Position'}</div>
                <div style={{ color: accent, fontWeight: 600, fontSize: '0.8rem' }}>{exp.company || 'Company'} · {exp.startDate}–{exp.current ? 'Present' : exp.endDate}</div>
                {exp.description && <div style={{ color: '#6B7280', marginTop: 4, lineHeight: 1.6 }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}
        {education.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: accent }} />Education
            </div>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 12, paddingLeft: 14, borderLeft: '3px solid #E5E7EB' }}>
                <div style={{ fontWeight: 700, color: '#111827' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>{edu.institution} · {edu.startDate}–{edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Template: Tech (Dark) ────────────────────────────────────────────────────
function ResumeTech({ data }) {
  const { personal, summary, experience, education, skills } = data;
  return (
    <div style={{ fontFamily: 'monospace', background: '#0D1117', color: '#E6EDF3', padding: '36px 44px', fontSize: '0.85rem', lineHeight: 1.6 }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #30363D', paddingBottom: 20, marginBottom: 24 }}>
        {personal.fullName && <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#58A6FF', letterSpacing: '-0.02em', marginBottom: 4 }}>{personal.fullName}</div>}
        {personal.title && <div style={{ color: '#8B949E', fontSize: '0.9rem' }}>// {personal.title}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: 12, fontSize: '0.775rem', color: '#8B949E' }}>
          {personal.email && <span style={{ color: '#79C0FF' }}>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span style={{ color: '#79C0FF' }}>{personal.linkedin}</span>}
          {personal.website && <span style={{ color: '#79C0FF' }}>{personal.website}</span>}
        </div>
      </div>
      {summary && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: '#3FB950', fontWeight: 700, fontSize: '0.75rem', marginBottom: 8 }}>/* ABOUT */</div>
          <div style={{ color: '#8B949E', borderLeft: '3px solid #30363D', paddingLeft: 14, lineHeight: 1.75 }}>{summary}</div>
        </div>
      )}
      {experience.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ color: '#3FB950', fontWeight: 700, fontSize: '0.75rem', marginBottom: 14 }}>/* EXPERIENCE */</div>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 16, background: '#161B22', borderRadius: 8, padding: '12px 16px', border: '1px solid #30363D' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                <div style={{ fontWeight: 700, color: '#F0F6FC' }}>{exp.position || 'Position'} <span style={{ color: '#8B949E' }}>@</span> <span style={{ color: '#79C0FF' }}>{exp.company || 'Company'}</span></div>
                <div style={{ fontSize: '0.75rem', color: '#8B949E', background: '#0D1117', padding: '2px 8px', borderRadius: 4, border: '1px solid #30363D' }}>{exp.startDate}–{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              {exp.description && <div style={{ color: '#8B949E', marginTop: 8, fontSize: '0.8rem', lineHeight: 1.65 }}>{exp.description}</div>}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
        {education.length > 0 && (
          <div>
            <div style={{ color: '#3FB950', fontWeight: 700, fontSize: '0.75rem', marginBottom: 12 }}>/* EDUCATION */</div>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 10, background: '#161B22', borderRadius: 6, padding: '10px 12px', border: '1px solid #30363D' }}>
                <div style={{ color: '#F0F6FC', fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ color: '#8B949E', fontSize: '0.8rem' }}>{edu.institution} · {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <div style={{ color: '#3FB950', fontWeight: 700, fontSize: '0.75rem', marginBottom: 12 }}>/* SKILLS */</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skills.map((s, i) => <span key={i} style={{ background: '#161B22', border: '1px solid #58A6FF', color: '#79C0FF', padding: '3px 10px', borderRadius: 4, fontSize: '0.775rem', fontFamily: 'monospace' }}>{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Template: Elegant (Gold accents) ────────────────────────────────────────
function ResumeElegant({ data }) {
  const { personal, summary, experience, education, skills } = data;
  const gold = '#8B7355';
  return (
    <div style={{ fontFamily: 'Garamond, Georgia, serif', color: '#2D2D2D', padding: '48px 52px', fontSize: '0.9rem', lineHeight: 1.55 }}>
      {/* Decorative top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, marginBottom: 36 }} />
      {personal.fullName && (
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 8 }}>{personal.fullName}</div>
          {personal.title && <div style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: gold, marginBottom: 14 }}>{personal.title}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 18px', fontSize: '0.8rem', color: '#6B6B6B' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
          </div>
        </div>
      )}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, marginBottom: 28 }} />
      {summary && (
        <div style={{ textAlign: 'center', marginBottom: 28, fontStyle: 'italic', color: '#555', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.8 }}>{summary}</div>
      )}
      {experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: gold, marginBottom: 18 }}>Experience</div>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid #E8E0D4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{exp.position || 'Position'}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div style={{ color: gold, fontSize: '0.85rem', fontStyle: 'italic', marginBottom: 6 }}>{exp.company || 'Company'}</div>
              {exp.description && <div style={{ color: '#555', lineHeight: 1.7, fontSize: '0.875rem' }}>{exp.description}</div>}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: education.length > 0 && skills.length > 0 ? '1fr 1fr' : '1fr', gap: '0 40px' }}>
        {education.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: gold, marginBottom: 16 }}>Education</div>
            {education.map(edu => (
              <div key={edu.id} style={{ textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontWeight: 600 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>{edu.institution}</div>
                <div style={{ color: '#AAA', fontSize: '0.8rem' }}>{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: gold, marginBottom: 16 }}>Skills</div>
            <div style={{ textAlign: 'center', color: '#555', lineHeight: 2 }}>{skills.join(' · ')}</div>
          </div>
        )}
      </div>
      <div style={{ height: 4, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, marginTop: 36 }} />
    </div>
  );
}

// ─── Template: Bold (Red gradient) ───────────────────────────────────────────
function ResumeBold({ data }) {
  const { personal, summary, experience, education, skills } = data;
  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif', color: '#111827', fontSize: '0.875rem', lineHeight: 1.5 }}>
      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, #E11D48 0%, #9333EA 100%)', padding: '44px 48px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 60, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        {personal.fullName && <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 8, position: 'relative' }}>{personal.fullName}</div>}
        {personal.title && <div style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.01em', position: 'relative' }}>{personal.title}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginTop: 18, fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', position: 'relative' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>📱 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: '32px 48px 40px' }}>
        {summary && (
          <div style={{ marginBottom: 28, padding: '20px 24px', background: '#FFF1F2', borderRadius: 12, borderLeft: '4px solid #E11D48' }}>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#E11D48', marginBottom: 8 }}>About</div>
            <div style={{ color: '#374151', lineHeight: 1.75 }}>{summary}</div>
          </div>
        )}
        {experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #E11D48, #9333EA)' }} />
              Experience
            </div>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16, padding: '16px 20px', background: 'white', border: '1.5px solid #F3F4F6', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#111827' }}>{exp.position || 'Position'}</div>
                    <div style={{ fontWeight: 600, color: '#E11D48', fontSize: '0.85rem', marginTop: 2 }}>{exp.company || 'Company'}</div>
                  </div>
                  <div style={{ fontSize: '0.775rem', background: '#FFF1F2', color: '#E11D48', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>{exp.startDate}–{exp.current ? 'Present' : exp.endDate}</div>
                </div>
                {exp.description && <div style={{ color: '#6B7280', marginTop: 10, lineHeight: 1.65, fontSize: '0.85rem' }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          {education.length > 0 && (
            <div>
              <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #E11D48, #9333EA)' }} />
                Education
              </div>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 12, padding: '12px 16px', background: 'white', border: '1.5px solid #F3F4F6', borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{edu.degree}</div>
                  <div style={{ color: '#9333EA', fontSize: '0.825rem', fontWeight: 600 }}>{edu.institution}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.775rem', marginTop: 2 }}>{edu.startDate}–{edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
          {skills.length > 0 && (
            <div>
              <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #E11D48, #9333EA)' }} />
                Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {skills.map((s, i) => <span key={i} style={{ padding: '5px 12px', borderRadius: 20, background: i % 3 === 0 ? '#FFF1F2' : i % 3 === 1 ? '#F5F3FF' : '#F0FDF4', color: i % 3 === 0 ? '#E11D48' : i % 3 === 1 ? '#9333EA' : '#059669', fontWeight: 700, fontSize: '0.775rem' }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Template: Sidebar (Teal) ─────────────────────────────────────────────────
function ResumeSidebar({ data }) {
  const { personal, summary, experience, education, skills } = data;
  const accent = '#0F766E';
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', display: 'grid', gridTemplateColumns: '1fr 2fr', minHeight: 700, fontSize: '0.825rem' }}>
      {/* Sidebar */}
      <div style={{ background: '#F0FDFA', borderRight: `3px solid ${accent}`, padding: '36px 22px' }}>
        {personal.fullName && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, marginBottom: 14 }}>
              {personal.fullName.charAt(0)}
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0F172A', lineHeight: 1.25, letterSpacing: '-0.02em' }}>{personal.fullName}</div>
            {personal.title && <div style={{ fontSize: '0.75rem', color: accent, fontWeight: 700, marginTop: 4 }}>{personal.title}</div>}
          </div>
        )}
        {(personal.email || personal.phone || personal.location) && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 10 }}>Contact</div>
            {personal.email && <div style={{ color: '#374151', marginBottom: 6, wordBreak: 'break-all' }}>{personal.email}</div>}
            {personal.phone && <div style={{ color: '#374151', marginBottom: 6 }}>{personal.phone}</div>}
            {personal.location && <div style={{ color: '#374151', marginBottom: 6 }}>{personal.location}</div>}
            {personal.linkedin && <div style={{ color: accent, marginBottom: 6, wordBreak: 'break-all' }}>{personal.linkedin}</div>}
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 10 }}>Skills</div>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, color: '#1F2937', marginBottom: 4, fontSize: '0.8rem' }}>{s}</div>
                <div style={{ height: 6, background: '#CCFBF1', borderRadius: 9999 }}>
                  <div style={{ height: '100%', background: accent, borderRadius: 9999, width: `${Math.min(95, 60 + (i * 11) % 36)}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {education.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 10 }}>Education</div>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.825rem' }}>{edu.degree}</div>
                {edu.field && <div style={{ color: '#6B7280', fontSize: '0.775rem' }}>{edu.field}</div>}
                <div style={{ color: accent, fontSize: '0.775rem', fontWeight: 600 }}>{edu.institution}</div>
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{edu.startDate}–{edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Main content */}
      <div style={{ padding: '36px 32px', background: 'white' }}>
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 10 }}>Profile</div>
            <div style={{ color: '#4B5563', lineHeight: 1.75 }}>{summary}</div>
          </div>
        )}
        {experience.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${accent}` }}>Work Experience</div>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.9rem' }}>{exp.position || 'Position'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'white', background: accent, padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>{exp.startDate}–{exp.current ? 'Now' : exp.endDate}</div>
                </div>
                <div style={{ color: accent, fontWeight: 700, fontSize: '0.825rem', marginTop: 3, marginBottom: 6 }}>{exp.company || 'Company'}</div>
                {exp.description && <div style={{ color: '#6B7280', lineHeight: 1.65 }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Template: Timeline ───────────────────────────────────────────────────────
function ResumeTimeline({ data }) {
  const { personal, summary, experience, education, skills } = data;
  const accent = '#1D4ED8';
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '40px 44px', color: '#111827', fontSize: '0.875rem', lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: `2px solid ${accent}` }}>
        <div>
          {personal.fullName && <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em' }}>{personal.fullName}</div>}
          {personal.title && <div style={{ fontSize: '1rem', color: accent, fontWeight: 700, marginTop: 4 }}>{personal.title}</div>}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#6B7280', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span style={{ color: accent }}>{personal.linkedin}</span>}
        </div>
      </div>
      {summary && (
        <div style={{ marginBottom: 28, background: '#EFF6FF', borderRadius: 10, padding: '16px 20px', border: `1px solid ${accent}33` }}>
          <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 8 }}>Summary</div>
          <div style={{ color: '#374151', lineHeight: 1.75 }}>{summary}</div>
        </div>
      )}
      {experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 18 }}>Experience Timeline</div>
          <div style={{ position: 'relative', paddingLeft: 28 }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${accent}, #BFDBFE)` }} />
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: 20, position: 'relative' }}>
                {/* Dot */}
                <div style={{ position: 'absolute', left: -24, top: 4, width: 12, height: 12, borderRadius: '50%', background: i === 0 ? accent : 'white', border: `2px solid ${accent}`, boxShadow: i === 0 ? `0 0 0 3px ${accent}33` : 'none' }} />
                <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{exp.position || 'Position'}</div>
                    <div style={{ fontSize: '0.75rem', color: accent, background: '#EFF6FF', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{exp.startDate}–{exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div style={{ color: accent, fontWeight: 600, fontSize: '0.85rem', marginTop: 2 }}>{exp.company || 'Company'}</div>
                  {exp.description && <div style={{ color: '#6B7280', marginTop: 8, lineHeight: 1.65, fontSize: '0.825rem' }}>{exp.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
        {education.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 14 }}>Education</div>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 12, padding: '12px 14px', background: '#EFF6FF', borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
                <div style={{ fontWeight: 700 }}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</div>
                <div style={{ color: '#6B7280', fontSize: '0.825rem' }}>{edu.institution}</div>
                <div style={{ color: accent, fontSize: '0.775rem', marginTop: 3 }}>{edu.startDate}–{edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 14 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills.map((s, i) => <span key={i} style={{ padding: '5px 12px', background: '#EFF6FF', color: accent, borderRadius: 20, fontWeight: 700, fontSize: '0.775rem', border: `1px solid ${accent}33` }}>{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Template: Compact (Two-column dense) ─────────────────────────────────────
function ResumeCompact({ data }) {
  const { personal, summary, experience, education, skills } = data;
  const accent = '#374151';
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '28px 36px', color: '#1F2937', fontSize: '0.8rem', lineHeight: 1.45 }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #1F2937' }}>
        <div>
          {personal.fullName && <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#111827' }}>{personal.fullName}</div>}
          {personal.title && <div style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>{personal.title}</div>}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'right', display: 'flex', flexWrap: 'wrap', gap: '2px 16px', justifyContent: 'flex-end' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>
      {summary && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 5 }}>Summary</div>
          <div style={{ color: '#4B5563', lineHeight: 1.6 }}>{summary}</div>
          <div style={{ height: 1, background: '#E5E7EB', marginTop: 12 }} />
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '0 24px' }}>
        {/* Left: Experience */}
        <div>
          {experience.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 10 }}>Experience</div>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 2 }}>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.825rem' }}>{exp.position || 'Position'} <span style={{ fontWeight: 500, color: '#6B7280' }}>· {exp.company || 'Company'}</span></div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{exp.startDate}–{exp.current ? 'Now' : exp.endDate}</div>
                  </div>
                  {exp.description && <div style={{ color: '#6B7280', marginTop: 3, lineHeight: 1.55 }}>{exp.description}</div>}
                </div>
              ))}
              <div style={{ height: 1, background: '#E5E7EB', marginTop: 10 }} />
            </div>
          )}
        </div>
        {/* Right: Skills + Education */}
        <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: 20 }}>
          {skills.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 8 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
                {skills.map((s, i) => <span key={i} style={{ background: '#F3F4F6', color: '#374151', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>{s}</span>)}
              </div>
            </div>
          )}
          {education.length > 0 && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 8 }}>Education</div>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.8rem' }}>{edu.degree}</div>
                  {edu.field && <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>{edu.field}</div>}
                  <div style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>{edu.institution} · {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Personal Info ────────────────────────────────────────────────────
function PersonalSection({ data, onChange }) {
  const [showMore, setShowMore] = useState(false);

  const primaryFields = [
    { key: 'fullName', label: 'Full Name', placeholder: 'Jane Smith', span: true },
    { key: 'title', label: 'Professional Title', placeholder: 'Senior Software Engineer', span: true },
    { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
    { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000' },
    { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
  ];

  const contactFields = [
    {
      key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/janesmith',
      icon: <Globe size={14} />,
    },
    {
      key: 'website', label: 'Website / Portfolio', placeholder: 'janesmith.dev',
      icon: <Globe size={14} />, span: true,
    },
  ];

  const extraFields = [
    {
      key: 'nationality', label: 'Nationality', placeholder: 'e.g. American',
      icon: <ShieldCheck size={14} />,
    },
    {
      key: 'dateOfBirth', label: 'Date of Birth', placeholder: 'e.g. 15 Jan 1990',
      icon: <Calendar size={14} />,
    },
    {
      key: 'visa', label: 'Visa / Work Permit', placeholder: 'e.g. H-1B, Tier 2',
      icon: <CreditCard size={14} />,
    },
    {
      key: 'passport', label: 'Passport / National ID', placeholder: 'e.g. US Passport',
      icon: <ShieldCheck size={14} />,
    },
    {
      key: 'availability', label: 'Availability', placeholder: 'e.g. Immediate, 2 weeks notice',
      icon: <Clock size={14} />, span: true,
    },
  ];

  const renderField = (f) => (
    <div key={f.key} className="form-group" style={f.span ? { gridColumn: '1 / -1' } : {}}>
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {f.icon && <span style={{ color: 'var(--primary)', opacity: 0.8 }}>{f.icon}</span>}
        {f.label}
      </label>
      <input
        type="text"
        className="form-input"
        placeholder={f.placeholder}
        value={data[f.key] || ''}
        onChange={e => onChange({ ...data, [f.key]: e.target.value })}
      />
    </div>
  );

  return (
    <div>
      <div className="builder-section-heading">Personal Information</div>

      {/* Photo Upload */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {data.photo
            ? <img src={data.photo} alt="Profile"
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                  border: '3px solid var(--primary)', display: 'block' }} />
            : <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-surface-3)',
                border: '2px dashed var(--border-accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'var(--primary)' }}>
                <Camera size={22} />
              </div>
          }
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Profile Photo</div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px',
            border: '1.5px solid var(--border-accent)', borderRadius: 8, cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-subtle)' }}>
            <Camera size={14} /> {data.photo ? 'Change Photo' : 'Upload Photo'}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => onChange({ ...data, photo: ev.target.result });
                reader.readAsDataURL(file);
              }} />
          </label>
          {data.photo && (
            <button type="button" onClick={() => onChange({ ...data, photo: null })}
              style={{ marginLeft: 8, fontSize: '0.775rem', fontWeight: 700, color: 'var(--danger)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '7px 0' }}>
              Remove
            </button>
          )}
          <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 5, fontWeight: 500 }}>JPG, PNG or WebP · Max 5 MB</p>
        </div>
      </div>

      {/* Primary fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
        {primaryFields.map(f => renderField(f))}
      </div>

      {/* Contact / Online Presence */}
      <div style={{ marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
          Online Presence
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
          {contactFields.map(f => renderField(f))}
        </div>
      </div>

      {/* Show More toggle */}
      <button
        type="button"
        onClick={() => setShowMore(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 14,
          padding: '7px 14px',
          width: '100%',
          justifyContent: 'center',
          background: showMore ? 'var(--bg-elevated)' : 'transparent',
          border: '1.5px dashed var(--border)',
          borderRadius: 10,
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          fontFamily: 'inherit',
          transition: 'all 150ms ease',
        }}
      >
        {showMore ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        {showMore ? 'Show Less' : 'Show More — Nationality, DOB, Visa, Passport, Availability'}
      </button>

      {/* Extra detail fields */}
      {showMore && (
        <div style={{
          marginTop: 10,
          padding: '16px 16px 4px',
          background: 'var(--bg-elevated)',
          borderRadius: 12,
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
            Additional Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            {extraFields.map(f => renderField(f))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Summary ─────────────────────────────────────────────────────────
function SummarySection({ data, onChange }) {
  return (
    <div>
      <div className="builder-section-heading">Professional Summary</div>
      <div className="form-group">
        <label className="form-label">Summary / Objective</label>
        <textarea
          className="form-input form-textarea"
          style={{ minHeight: 140 }}
          placeholder="Write a compelling 2-4 sentence overview of your professional background, key skills, and career goals…"
          value={data}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
        💡 Tip: Tailor this to match the job description you're applying to.
      </p>
    </div>
  );
}

// ─── Section: Experience ──────────────────────────────────────────────────────
function ExperienceSection({ data, onChange }) {
  const addEntry = () => onChange([...data, emptyExp()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEntry = (id) => onChange(data.filter(e => e.id !== id));

  return (
    <div>
      <div className="builder-section-heading">Work Experience</div>

      {data.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 500 }}>
          No experience entries yet. Click below to add one.
        </div>
      )}

      {data.map((exp, idx) => (
        <div key={exp.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Experience {idx + 1}</div>
            <button
              className="btn btn-ghost btn-xs"
              style={{ color: 'var(--danger)' }}
              onClick={() => removeEntry(exp.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Job Title / Position</label>
              <input className="form-input" placeholder="Software Engineer" value={exp.position}
                onChange={e => updateEntry(exp.id, 'position', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Company</label>
              <input className="form-input" placeholder="Google" value={exp.company}
                onChange={e => updateEntry(exp.id, 'company', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" placeholder="Jan 2022" value={exp.startDate}
                onChange={e => updateEntry(exp.id, 'startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" placeholder="Present" value={exp.endDate}
                disabled={exp.current}
                onChange={e => updateEntry(exp.id, 'endDate', e.target.value)} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" checked={exp.current} onChange={e => updateEntry(exp.id, 'current', e.target.checked)} />
                Currently working here
              </label>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description / Achievements</label>
              <textarea className="form-input form-textarea" style={{ minHeight: 88 }}
                placeholder="• Led development of key features that increased user engagement by 40%&#10;• Collaborated with cross-functional teams to deliver projects on time"
                value={exp.description}
                onChange={e => updateEntry(exp.id, 'description', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button className="btn btn-outline w-full" onClick={addEntry} style={{ marginTop: 4 }}>
        <Plus size={16} /> Add Experience
      </button>
    </div>
  );
}

// ─── Section: Education ───────────────────────────────────────────────────────
function EducationSection({ data, onChange }) {
  const addEntry = () => onChange([...data, emptyEdu()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEntry = (id) => onChange(data.filter(e => e.id !== id));

  return (
    <div>
      <div className="builder-section-heading">Education</div>

      {data.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 500 }}>
          No education entries yet. Click below to add one.
        </div>
      )}

      {data.map((edu, idx) => (
        <div key={edu.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Education {idx + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => removeEntry(edu.id)}>
              <Trash2 size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Institution / University</label>
              <input className="form-input" placeholder="MIT" value={edu.institution}
                onChange={e => updateEntry(edu.id, 'institution', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input className="form-input" placeholder="Bachelor of Science" value={edu.degree}
                onChange={e => updateEntry(edu.id, 'degree', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Field of Study</label>
              <input className="form-input" placeholder="Computer Science" value={edu.field}
                onChange={e => updateEntry(edu.id, 'field', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" placeholder="Sep 2018" value={edu.startDate}
                onChange={e => updateEntry(edu.id, 'startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" placeholder="May 2022" value={edu.endDate}
                onChange={e => updateEntry(edu.id, 'endDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">GPA (optional)</label>
              <input className="form-input" placeholder="3.8 / 4.0" value={edu.gpa}
                onChange={e => updateEntry(edu.id, 'gpa', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button className="btn btn-outline w-full" onClick={addEntry} style={{ marginTop: 4 }}>
        <Plus size={16} /> Add Education
      </button>
    </div>
  );
}

// ─── Section: Skills ──────────────────────────────────────────────────────────
function SkillsSection({ data, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (data.includes(trimmed)) {
      toast.error('Skill already added');
      return;
    }
    onChange([...data, trimmed]);
    setInput('');
  };

  const removeSkill = (s) => onChange(data.filter(x => x !== s));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestions = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git',
    'AWS', 'Docker', 'Figma', 'Project Management', 'Leadership',
  ].filter(s => !data.includes(s));

  return (
    <div>
      <div className="builder-section-heading">Skills</div>

      <div className="form-group">
        <label className="form-label">Add Skill</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="form-input"
            placeholder="e.g. React, Python, Leadership…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary btn-sm" onClick={addSkill} disabled={!input.trim()}>
            <Plus size={15} /> Add
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6, fontWeight: 500 }}>
          Press Enter or comma to add quickly
        </p>
      </div>

      {data.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Added Skills ({data.length})
          </div>
          <div className="skill-chips-wrap">
            {data.map(s => (
              <div key={s} className="skill-chip" onClick={() => removeSkill(s)}>
                {s} <span className="skill-chip-remove">×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Suggestions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {suggestions.slice(0, 8).map(s => (
              <button
                key={s}
                className="btn btn-secondary btn-xs"
                onClick={() => onChange([...data, s])}
              >
                <Plus size={11} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Languages ───────────────────────────────────────────────────────
const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

function LanguagesSection({ data, onChange }) {
  const add = () => onChange([...data, emptyLang()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Languages</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add your languages and proficiency level to show your communication range.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No languages added yet.</div>}
      {data.map((l, i) => (
        <div key={l.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Language {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(l.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group">
              <label className="form-label">Language</label>
              <input className="form-input" placeholder="e.g. Spanish" value={l.language} onChange={e => upd(l.id, 'language', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Proficiency</label>
              <select className="form-input" value={l.proficiency} onChange={e => upd(l.id, 'proficiency', e.target.value)}>
                {PROFICIENCY_LEVELS.map(lv => <option key={lv}>{lv}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Language</button>
    </div>
  );
}

// ─── Section: Certificates ────────────────────────────────────────────────────
function CertificatesSection({ data, onChange }) {
  const add = () => onChange([...data, emptyCert()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Certificates</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add your industry certificates or licences. Include issuer and date earned.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No certificates added yet.</div>}
      {data.map((c, i) => (
        <div key={c.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Certificate {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(c.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Certificate Name</label><input className="form-input" placeholder="AWS Certified Solutions Architect" value={c.name} onChange={e => upd(c.id, 'name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Issuing Organisation</label><input className="form-input" placeholder="Amazon Web Services" value={c.issuer} onChange={e => upd(c.id, 'issuer', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Date Earned</label><input className="form-input" placeholder="Jun 2023" value={c.date} onChange={e => upd(c.id, 'date', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Certificate URL (optional)</label><input className="form-input" placeholder="https://..." value={c.url} onChange={e => upd(c.id, 'url', e.target.value)} /></div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Certificate</button>
    </div>
  );
}

// ─── Section: Interests ───────────────────────────────────────────────────────
function InterestsSection({ data, onChange }) {
  const [input, setInput] = useState('');
  const add = () => { const t = input.trim(); if (!t) return; if (data.includes(t)) { toast.error('Already added'); return; } onChange([...data, t]); setInput(''); };
  const rem = s => onChange(data.filter(x => x !== s));
  return (
    <div>
      <div className="builder-section-heading">Interests</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add relevant personal interests that support your career story and cultural fit.</p>
      <div className="form-group">
        <label className="form-label">Add Interest</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="form-input" placeholder="e.g. Open Source, Photography…" value={input} style={{ flex: 1 }}
            onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }}} />
          <button className="btn btn-primary btn-sm" onClick={add} disabled={!input.trim()}><Plus size={15} /> Add</button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6, fontWeight: 500 }}>Press Enter or comma to add quickly</p>
      </div>
      {data.length > 0 && (
        <div className="skill-chips-wrap">
          {data.map(s => <div key={s} className="skill-chip" onClick={() => rem(s)}>{s} <span className="skill-chip-remove">×</span></div>)}
        </div>
      )}
    </div>
  );
}

// ─── Section: Projects ────────────────────────────────────────────────────────
function ProjectsSection({ data, onChange }) {
  const add = () => onChange([...data, emptyProj()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Projects</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add key projects you participated in and highlight your challenges, role, and impact.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No projects added yet.</div>}
      {data.map((p, i) => (
        <div key={p.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Project {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(p.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Project Name</label><input className="form-input" placeholder="E-Commerce Platform" value={p.name} onChange={e => upd(p.id, 'name', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Your Role</label><input className="form-input" placeholder="Lead Frontend Developer" value={p.role} onChange={e => upd(p.id, 'role', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" placeholder="Jan 2023" value={p.startDate} onChange={e => upd(p.id, 'startDate', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">End Date</label><input className="form-input" placeholder="Jun 2023" value={p.endDate} onChange={e => upd(p.id, 'endDate', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Description, Challenges &amp; Impact</label><textarea className="form-input form-textarea" style={{ minHeight: 84 }} placeholder="Describe the project, your challenges, and the impact you made…" value={p.description} onChange={e => upd(p.id, 'description', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Project URL (optional)</label><input className="form-input" placeholder="https://github.com/…" value={p.url} onChange={e => upd(p.id, 'url', e.target.value)} /></div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Project</button>
    </div>
  );
}

// ─── Section: Courses ─────────────────────────────────────────────────────────
function CoursesSection({ data, onChange }) {
  const add = () => onChange([...data, emptyCourse()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Courses</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add online or in-person courses and trainings you joined and completed.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No courses added yet.</div>}
      {data.map((c, i) => (
        <div key={c.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Course {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(c.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Course Name</label><input className="form-input" placeholder="Machine Learning Specialization" value={c.name} onChange={e => upd(c.id, 'name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Provider / Institution</label><input className="form-input" placeholder="Coursera / Stanford" value={c.provider} onChange={e => upd(c.id, 'provider', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Completed Date</label><input className="form-input" placeholder="Dec 2023" value={c.completedDate} onChange={e => upd(c.id, 'completedDate', e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={c.type} onChange={e => upd(c.id, 'type', e.target.value)}>
                <option>Online</option><option>In-Person</option><option>Hybrid</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Course</button>
    </div>
  );
}

// ─── Section: Awards ──────────────────────────────────────────────────────────
function AwardsSection({ data, onChange }) {
  const add = () => onChange([...data, emptyAward()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Awards</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add your awards and recognitions from industry, competitions, or academia.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No awards added yet.</div>}
      {data.map((a, i) => (
        <div key={a.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Award {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(a.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Award Title</label><input className="form-input" placeholder="Best Innovation Award" value={a.title} onChange={e => upd(a.id, 'title', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Issuer / Organisation</label><input className="form-input" placeholder="TechConf 2023" value={a.issuer} onChange={e => upd(a.id, 'issuer', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" placeholder="Nov 2023" value={a.date} onChange={e => upd(a.id, 'date', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Description (optional)</label><textarea className="form-input form-textarea" style={{ minHeight: 70 }} placeholder="Brief description of the award…" value={a.description} onChange={e => upd(a.id, 'description', e.target.value)} /></div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Award</button>
    </div>
  );
}

// ─── Section: Organisations ───────────────────────────────────────────────────
function OrganisationsSection({ data, onChange }) {
  const add = () => onChange([...data, emptyOrg()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Organisations</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add your memberships or volunteering with organisations including your role.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No organisations added yet.</div>}
      {data.map((o, i) => (
        <div key={o.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Organisation {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(o.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Organisation Name</label><input className="form-input" placeholder="Red Cross" value={o.name} onChange={e => upd(o.id, 'name', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Your Role</label><input className="form-input" placeholder="Volunteer Coordinator" value={o.role} onChange={e => upd(o.id, 'role', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" placeholder="Jan 2021" value={o.startDate} onChange={e => upd(o.id, 'startDate', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">End Date</label><input className="form-input" placeholder="Present" value={o.endDate} onChange={e => upd(o.id, 'endDate', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Description (optional)</label><textarea className="form-input form-textarea" style={{ minHeight: 70 }} placeholder="Describe your involvement…" value={o.description} onChange={e => upd(o.id, 'description', e.target.value)} /></div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Organisation</button>
    </div>
  );
}

// ─── Section: Publications ────────────────────────────────────────────────────
function PublicationsSection({ data, onChange }) {
  const add = () => onChange([...data, emptyPub()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Publications</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add publications, articles, or books you wrote or contributed to.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No publications added yet.</div>}
      {data.map((p, i) => (
        <div key={p.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Publication {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(p.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Title</label><input className="form-input" placeholder="Deep Learning Approaches in NLP" value={p.title} onChange={e => upd(p.id, 'title', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Publisher / Journal</label><input className="form-input" placeholder="IEEE" value={p.publisher} onChange={e => upd(p.id, 'publisher', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Date Published</label><input className="form-input" placeholder="Mar 2023" value={p.date} onChange={e => upd(p.id, 'date', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">URL / DOI (optional)</label><input className="form-input" placeholder="https://doi.org/…" value={p.url} onChange={e => upd(p.id, 'url', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Description (optional)</label><textarea className="form-input form-textarea" style={{ minHeight: 70 }} placeholder="Brief description…" value={p.description} onChange={e => upd(p.id, 'description', e.target.value)} /></div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Publication</button>
    </div>
  );
}

// ─── Section: References ──────────────────────────────────────────────────────
function ReferencesSection({ data, onChange }) {
  const add = () => onChange([...data, emptyRef()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">References</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add your references from managers or coworkers, including their contact details.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No references added yet.</div>}
      {data.map((r, i) => (
        <div key={r.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Reference {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(r.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Full Name</label><input className="form-input" placeholder="John Doe" value={r.name} onChange={e => upd(r.id, 'name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Position / Title</label><input className="form-input" placeholder="Engineering Manager" value={r.position} onChange={e => upd(r.id, 'position', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Company</label><input className="form-input" placeholder="Google" value={r.company} onChange={e => upd(r.id, 'company', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" placeholder="john@example.com" value={r.email} onChange={e => upd(r.id, 'email', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+1 (555) 000-0000" value={r.phone} onChange={e => upd(r.id, 'phone', e.target.value)} /></div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Reference</button>
    </div>
  );
}

// ─── Section: Declaration ─────────────────────────────────────────────────────
function DeclarationSection({ data, onChange }) {
  return (
    <div>
      <div className="builder-section-heading">Declaration</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add your declaration by creating or uploading your personal signature.</p>
      <div className="form-group">
        <label className="form-label">Declaration Text</label>
        <textarea className="form-input form-textarea" style={{ minHeight: 110 }}
          placeholder="I hereby declare that all the information provided in this resume is true and correct to the best of my knowledge…"
          value={data.text} onChange={e => onChange({ ...data, text: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Signature</label>
        {data.signatureDataUrl && (
          <div style={{ marginBottom: 12, padding: 12, background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <img src={data.signatureDataUrl} alt="Signature" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }} />
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)', marginTop: 8, display: 'block' }}
              onClick={() => onChange({ ...data, signatureDataUrl: null })}>Remove</button>
          </div>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
          border: '1.5px dashed var(--border)', borderRadius: 10, cursor: 'pointer',
          color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>
          <PenLine size={16} />
          {data.signatureDataUrl ? 'Replace Signature' : 'Upload Signature Image'}
          <input type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = ev => onChange({ ...data, signatureDataUrl: ev.target.result });
              reader.readAsDataURL(file);
            }} />
        </label>
      </div>
    </div>
  );
}

// ─── Section: Custom ──────────────────────────────────────────────────────────
function CustomSection({ data, onChange }) {
  const add = () => onChange([...data, emptyCustom()]);
  const upd = (id, f, v) => onChange(data.map(e => e.id === id ? { ...e, [f]: v } : e));
  const rem = id => onChange(data.filter(e => e.id !== id));
  return (
    <div>
      <div className="builder-section-heading">Custom Section</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500 }}>Add a custom section for anything else, or combine sections cleanly.</p>
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No custom sections yet.</div>}
      {data.map((s, i) => (
        <div key={s.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-title">Section {i + 1}</div>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--danger)' }} onClick={() => rem(s.id)}><Trash2 size={14} /></button>
          </div>
          <div className="form-group"><label className="form-label">Section Title</label><input className="form-input" placeholder="e.g. Volunteering, Hobbies…" value={s.title} onChange={e => upd(s.id, 'title', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Content</label><textarea className="form-input form-textarea" style={{ minHeight: 100 }} placeholder="Write your content here…" value={s.content} onChange={e => upd(s.id, 'content', e.target.value)} /></div>
        </div>
      ))}
      <button className="btn btn-outline w-full" onClick={add} style={{ marginTop: 4 }}><Plus size={16} /> Add Custom Section</button>
    </div>
  );
}

// ─── Main Builder Component ───────────────────────────────────────────────────
export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [data, setData] = useState(defaultData);
  const [activeTab, setActiveTab] = useState('personal');
  const [template, setTemplate] = useState('Modern');
  const [showPreview, setShowPreview] = useState(false);

  const updatePersonal = useCallback((val) => setData(d => ({ ...d, personal: val })), []);
  const updateSummary = useCallback((val) => setData(d => ({ ...d, summary: val })), []);
  const updateExp = useCallback((val) => setData(d => ({ ...d, experience: val })), []);
  const updateEdu = useCallback((val) => setData(d => ({ ...d, education: val })), []);
  const updateSkills        = useCallback((val) => setData(d => ({ ...d, skills:        val })), []);
  const updateLanguages     = useCallback((val) => setData(d => ({ ...d, languages:     val })), []);
  const updateCertificates  = useCallback((val) => setData(d => ({ ...d, certificates:  val })), []);
  const updateInterests     = useCallback((val) => setData(d => ({ ...d, interests:     val })), []);
  const updateProjects      = useCallback((val) => setData(d => ({ ...d, projects:      val })), []);
  const updateCourses       = useCallback((val) => setData(d => ({ ...d, courses:       val })), []);
  const updateAwards        = useCallback((val) => setData(d => ({ ...d, awards:        val })), []);
  const updateOrganisations = useCallback((val) => setData(d => ({ ...d, organisations: val })), []);
  const updatePublications  = useCallback((val) => setData(d => ({ ...d, publications:  val })), []);
  const updateReferences    = useCallback((val) => setData(d => ({ ...d, references:    val })), []);
  const updateDeclaration   = useCallback((val) => setData(d => ({ ...d, declaration:   val })), []);
  const updateCustom        = useCallback((val) => setData(d => ({ ...d, custom:        val })), []);

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog…');
  };

  const renderTemplate = () => {
    const map = {
      Modern:    <ResumeModern data={data} />,
      Classic:   <ResumeClassic data={data} />,
      Minimal:   <ResumeMinimal data={data} />,
      Executive: <ResumeExecutive data={data} />,
      Creative:  <ResumeCreative data={data} />,
      Tech:      <ResumeTech data={data} />,
      Elegant:   <ResumeElegant data={data} />,
      Bold:      <ResumeBold data={data} />,
      Sidebar:   <ResumeSidebar data={data} />,
      Timeline:  <ResumeTimeline data={data} />,
      Compact:   <ResumeCompact data={data} />,
    };
    return map[template] || map.Modern;
  };

  const renderSection = () => {
    if (activeTab === 'personal')      return <PersonalSection      data={data.personal}      onChange={updatePersonal} />;
    if (activeTab === 'summary')       return <SummarySection       data={data.summary}       onChange={updateSummary} />;
    if (activeTab === 'experience')    return <ExperienceSection    data={data.experience}    onChange={updateExp} />;
    if (activeTab === 'education')     return <EducationSection     data={data.education}     onChange={updateEdu} />;
    if (activeTab === 'skills')        return <SkillsSection        data={data.skills}        onChange={updateSkills} />;
    if (activeTab === 'languages')     return <LanguagesSection     data={data.languages}     onChange={updateLanguages} />;
    if (activeTab === 'certificates')  return <CertificatesSection  data={data.certificates}  onChange={updateCertificates} />;
    if (activeTab === 'interests')     return <InterestsSection     data={data.interests}     onChange={updateInterests} />;
    if (activeTab === 'projects')      return <ProjectsSection      data={data.projects}      onChange={updateProjects} />;
    if (activeTab === 'courses')       return <CoursesSection       data={data.courses}       onChange={updateCourses} />;
    if (activeTab === 'awards')        return <AwardsSection        data={data.awards}        onChange={updateAwards} />;
    if (activeTab === 'organisations') return <OrganisationsSection data={data.organisations} onChange={updateOrganisations} />;
    if (activeTab === 'publications')  return <PublicationsSection  data={data.publications}  onChange={updatePublications} />;
    if (activeTab === 'references')    return <ReferencesSection    data={data.references}    onChange={updateReferences} />;
    if (activeTab === 'declaration')   return <DeclarationSection   data={data.declaration}   onChange={updateDeclaration} />;
    if (activeTab === 'custom')        return <CustomSection        data={data.custom}        onChange={updateCustom} />;
  };

  return (
    <>
      <Navbar />
      <div className="builder-layout">

        {/* ── Left: Form Panel ─────────────────────────────────── */}
        <div className="builder-form-panel no-print">
          <div className="builder-form-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="builder-form-title">Resume Builder</div>
              {/* Mobile toggle preview */}
              <button
                className="btn btn-secondary btn-sm"
                style={{ display: 'none' }} // shown at mobile via media query in css
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {/* Template selector */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Template — <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{template}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 }}>
                {TEMPLATES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    style={{
                      padding: '8px 4px',
                      border: template === t ? `2px solid ${TEMPLATE_COLORS[t]}` : '1.5px solid var(--border)',
                      borderRadius: 10,
                      background: template === t ? `${TEMPLATE_COLORS[t]}12` : 'var(--bg-base)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '0.72rem',
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      color: template === t ? TEMPLATE_COLORS[t] : 'var(--text-secondary)',
                      transition: 'all 150ms ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>
                      {{
                        Modern: '💼', Classic: '📜', Minimal: '✦',
                        Executive: '🏛', Creative: '🎨', Tech: '💻',
                        Elegant: '✨', Bold: '🔥', Sidebar: '📋',
                        Timeline: '⏱', Compact: '🗂',
                      }[t]}
                    </span>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Section tabs */}
            <div className="builder-tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`builder-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section body */}
          <div className="builder-form-body">
            {renderSection()}
          </div>

          {/* Footer actions */}
          <div className="builder-footer">
            <button className="btn btn-primary w-full" onClick={handlePrint}>
              <Download size={16} />
              Export PDF
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ flexShrink: 0 }}>
              <ArrowLeft size={15} />
            </button>
          </div>
        </div>

        {/* ── Right: Preview Panel ──────────────────────────────── */}
        <div className="builder-preview-panel">
          <div className="preview-toolbar no-print">
            <div style={{ display: 'flex', align: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Live Preview
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Auto-updating</span>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Download size={14} /> Export PDF
            </button>
          </div>

          <div className="resume-preview-paper">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </>
  );
}
