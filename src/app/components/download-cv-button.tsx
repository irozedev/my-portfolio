import { motion } from "motion/react";
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";
import jsPDF from "jspdf";

const translations = {
  en: {
    download: "Download CV",
    downloading: "Generating PDF...",
    success: "CV Downloaded!",
    name: "Stepan Roze",
    title: "Senior Full-Stack Developer",
    contact: "Contact Information",
    email: "Email",
    phone: "Phone",
    location: "Location",
    experience: "Experience",
    skills: "Technical Skills",
    education: "Education",
    languages: "Languages",
    projects: "Key Projects",
  },
  uk: {
    download: "Завантажити CV",
    downloading: "Генерація PDF...",
    success: "CV Завантажено!",
    name: "Степан Розе",
    title: "Senior Full-Stack Розробник",
    contact: "Контактна Інформація",
    email: "Email",
    phone: "Телефон",
    location: "Місцезнаходження",
    experience: "Досвід",
    skills: "Технічні Навички",
    education: "Освіта",
    languages: "Мови",
    projects: "Ключові Проєкти",
  },
  nl: {
    download: "CV Downloaden",
    downloading: "PDF Genereren...",
    success: "CV Gedownload!",
    name: "Stepan Roze",
    title: "Senior Full-Stack Developer",
    contact: "Contactinformatie",
    email: "Email",
    phone: "Telefoon",
    location: "Locatie",
    experience: "Ervaring",
    skills: "Technische Vaardigheden",
    education: "Opleiding",
    languages: "Talen",
    projects: "Belangrijke Projecten",
  },
  ar: {
    download: "تحميل السيرة الذاتية",
    downloading: "جاري إنشاء PDF...",
    success: "تم تحميل السيرة الذاتية!",
    name: "ستيبان روز",
    title: "مطور Full-Stack أول",
    contact: "معلومات الاتصال",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    location: "الموقع",
    experience: "الخبرة",
    skills: "المهارات التقنية",
    education: "التعليم",
    languages: "اللغات",
    projects: "المشاريع الرئيسية",
  },
  es: {
    download: "Descargar CV",
    downloading: "Generando PDF...",
    success: "¡CV Descargado!",
    name: "Stepan Roze",
    title: "Desarrollador Full-Stack Senior",
    contact: "Información de Contacto",
    email: "Email",
    phone: "Teléfono",
    location: "Ubicación",
    experience: "Experiencia",
    skills: "Habilidades Técnicas",
    education: "Educación",
    languages: "Idiomas",
    projects: "Proyectos Clave",
  },
};

export function DownloadCVButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Header - Name and Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(t.name, 20, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 217, 255);
      doc.text(t.title, 20, yPos);
      yPos += 15;

      // Horizontal line
      doc.setDrawColor(0, 217, 255);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;

      // Contact Information
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(t.contact, 20, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`${t.email}: stepan.roze@example.com`, 20, yPos);
      yPos += 6;
      doc.text(`${t.phone}: +31 6 12345678`, 20, yPos);
      yPos += 6;
      doc.text(`${t.location}: Amsterdam, Netherlands`, 20, yPos);
      yPos += 12;

      // Experience Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t.experience, 20, yPos);
      yPos += 7;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Senior Full-Stack Developer", 20, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("2022 - Present", 20, yPos);
      yPos += 5;

      doc.setFontSize(10);
      const experiencePoints = [
        "• Developed scalable web applications using React, Next.js, and Node.js",
        "• Built modern UI/UX with TypeScript and Tailwind CSS",
        "• Integrated AI solutions and automation tools",
        "• Managed databases with PostgreSQL and MongoDB",
      ];

      experiencePoints.forEach((point) => {
        doc.text(point, 25, yPos);
        yPos += 5;
      });
      yPos += 7;

      // Skills Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t.skills, 20, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const skills = [
        "Frontend: React, Next.js, TypeScript, Tailwind CSS, Motion",
        "Backend: Node.js, Express, REST APIs, GraphQL",
        "Databases: PostgreSQL, MongoDB, Supabase",
        "Tools: Git, Docker, Figma, VS Code",
        "AI/ML: ChatGPT Integration, Anthropic Claude, AI Automation",
      ];

      skills.forEach((skill) => {
        doc.text(`• ${skill}`, 20, yPos);
        yPos += 6;
      });
      yPos += 7;

      // Education Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t.education, 20, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Bachelor of Computer Science", 20, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.text("University of Technology | 2018 - 2022", 20, yPos);
      yPos += 10;

      // Languages Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t.languages, 20, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const languages = [
        "English - Fluent",
        "Ukrainian - Native",
        "Dutch - Advanced",
        "Spanish - Intermediate",
        "Arabic - Basic",
      ];

      languages.forEach((lang) => {
        doc.text(`• ${lang}`, 20, yPos);
        yPos += 6;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text("Generated from stepanroze.com | " + new Date().toLocaleDateString(), 20, 280);

      // Save PDF
      doc.save(`Stepan_Roze_CV_${language.toUpperCase()}.pdf`);
      
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all overflow-hidden group ${
        isGenerating
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      }`}
      whileHover={!isGenerating ? { scale: 1.05 } : {}}
      whileTap={!isGenerating ? { scale: 0.95 } : {}}
    >
      {/* Shimmer effect */}
      {!isGenerating && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2 text-white">
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t.downloading}
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            {t.download}
          </>
        )}
      </span>
    </motion.button>
  );
}
