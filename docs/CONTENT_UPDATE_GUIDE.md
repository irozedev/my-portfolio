# 📝 Content Update Guide

Quick guide to updating your portfolio content without touching code.

## 🎯 Main Content File

**Location**: `/src/utils/translations.ts`

This file contains ALL your portfolio content in multiple languages.

## 👤 Personal Information

### Update Your Name & Title

```typescript
hero: {
  greeting: "Hi, I'm",
  name: "Your Name Here",           // ← Change this
  title: "Your Professional Title",  // ← Change this
  subtitle: "Your tagline or description",
}
```

### Update Contact Info

```typescript
contact: {
  title: "Get in Touch",
  email: "your.email@example.com",    // ← Your email
  phone: "+1234567890",               // ← Your phone
  location: "Your City, Country",     // ← Your location
}
```

### Update Social Links

```typescript
social: {
  linkedin: "your-linkedin-username",  // ← Just username
  github: "your-github-username",      // ← Just username
  twitter: "your-twitter-handle",      // ← Just handle
  instagram: "your-instagram",         // ← Optional
}
```

## 💼 Work Experience

### Add/Edit Experience

```typescript
experience: {
  items: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Company",
      location: "City, Country",
      period: "2022 - Present",
      description: "What you do/did here",
      responsibilities: [
        "Led team of 5 developers",
        "Built React applications",
        "Improved performance by 60%",
      ],
      technologies: ["React", "TypeScript", "Node.js"],
    },
    // Add more experiences here
  ],
}
```

**Tips**:
- List most recent first
- Use action verbs (Led, Built, Improved)
- Include metrics when possible (60% faster, 5 developers)

## 🚀 Projects

### Add Your Projects

```typescript
projects: {
  items: [
    {
      title: "Project Name",
      description: "Brief description of what it does",
      longDescription: "Detailed explanation of the project",
      tags: ["React", "TypeScript", "API"],
      image: "/path/to/image.jpg",  // ← Project screenshot
      github: "https://github.com/you/project",
      demo: "https://project-demo.com",
      featured: true,  // Show on homepage
    },
    // Add more projects
  ],
}
```

**Image Tips**:
- Use 16:9 aspect ratio (e.g., 1600x900px)
- Optimize to < 200KB
- Use WebP format if possible
- Show the project UI, not just code

## 💪 Skills

### Technical Skills

```typescript
skills: {
  frontend: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Next.js",
  ],
  backend: [
    "Node.js",
    "Express",
    "PostgreSQL",
  ],
  tools: [
    "Git",
    "Docker",
    "VS Code",
  ],
}
```

**Tips**:
- List skills you actually use
- Order by proficiency
- Include version if relevant (e.g., "React 18")

## 🎓 Education

```typescript
education: [
  {
    degree: "Bachelor of Computer Science",
    school: "University Name",
    year: "2018 - 2022",
    description: "Relevant coursework or achievements",
  },
]
```

## ⭐ Testimonials

### Add Client Reviews

```typescript
testimonials: [
  {
    name: "Client Name",
    role: "Their Position",
    company: "Their Company",
    content: "What they said about you",
    avatar: "/path/to/photo.jpg",  // ← Optional
    rating: 5,  // 1-5 stars
  },
]
```

**Tips**:
- Ask clients for permission
- Include their photo if possible
- Keep quotes concise (2-3 sentences)

## 🛠️ Services

### List Your Services

```typescript
services: [
  {
    title: "Web Development",
    description: "Full-stack web applications",
    icon: "code",  // Icon name from Lucide React
    features: [
      "Responsive design",
      "Fast performance",
      "SEO optimized",
    ],
    pricing: "Starting at $5000",  // Optional
  },
]
```

## 🌍 Multiple Languages

### Adding Translations

All sections need translation for each language:

```typescript
export const translations = {
  en: {
    hero: { /* English content */ },
    about: { /* English content */ },
  },
  ru: {
    hero: { /* Russian content */ },
    about: { /* Russian content */ },
  },
  uk: {
    hero: { /* Ukrainian content */ },
    about: { /* Ukrainian content */ },
  },
  nl: {
    hero: { /* Dutch content */ },
    about: { /* Dutch content */ },
  },
};
```

**Tips**:
- Use professional translation service
- Or use DeepL/Google Translate and review
- Keep technical terms in English
- Test each language

## 🎨 Images & Media

### Where to Put Images

1. **Local Images**:
   - Put in `/public/images/`
   - Reference as `/images/filename.jpg`

2. **Imported Images**:
   - Put in `/src/imports/`
   - Import in component

3. **External Images**:
   - Use Unsplash, Imgur, or image CDN
   - Direct URL works

### Image Checklist

- [ ] Optimized (< 200KB each)
- [ ] Correct dimensions
- [ ] WebP format preferred
- [ ] Has alt text in code
- [ ] Loads quickly

## 📄 Resume/CV

### Update Resume Link

```typescript
resume: {
  url: "https://drive.google.com/your-resume",  // ← Link here
  text: "Download Resume",
}
```

**Tips**:
- Host on Google Drive or Dropbox
- Make sure link is public
- Keep PDF updated
- Include ATS-friendly version

## 🎯 Call-to-Action

### Update CTA Button

```typescript
cta: {
  primary: "Hire Me",
  secondary: "View My Work",
  email: "Let's Talk",
}
```

## ✅ Content Checklist

Before publishing, ensure:

### Personal Info
- [ ] Name and title updated
- [ ] Email is correct
- [ ] Phone number is correct
- [ ] Location is accurate
- [ ] All social links work

### Professional Content
- [ ] Work experience is current
- [ ] Projects showcase best work
- [ ] Skills list is accurate
- [ ] Education is complete
- [ ] Testimonials are real

### Media
- [ ] All images load
- [ ] Profile photo is professional
- [ ] Project screenshots are clear
- [ ] Resume link works

### Languages
- [ ] All languages translated
- [ ] No placeholder text
- [ ] Grammar is correct
- [ ] Technical terms consistent

### Links
- [ ] GitHub profiles work
- [ ] LinkedIn profile is public
- [ ] Project demos load
- [ ] Email link works
- [ ] Social media links correct

## 🔄 Quick Update Workflow

### For Small Changes (10 minutes)

1. Open `/src/utils/translations.ts`
2. Find the section to update
3. Change the content
4. Save file
5. Test in browser (`pnpm dev`)
6. Commit and push

### For New Project (30 minutes)

1. Prepare project screenshot
2. Optimize image
3. Upload to `/public/images/`
4. Add project to `translations.ts`
5. Test on mobile
6. Update all languages
7. Deploy

### For Major Updates (2 hours)

1. Update all sections
2. Review all translations
3. Update images
4. Test thoroughly
5. Get feedback
6. Make adjustments
7. Deploy to production

## 💡 Content Tips

### Writing Style

**Do**:
- Use active voice: "Built" not "Was responsible for building"
- Include numbers: "Improved speed by 60%"
- Be specific: "React 18" not "Modern framework"
- Show impact: "Increased sales by $50k"

**Don't**:
- Use buzzwords without backing them up
- Lie or exaggerate
- Include outdated skills
- Write in third person

### SEO Tips

Include these keywords naturally:
- Your name
- Your location
- Your specialization (e.g., "React Developer")
- Technologies you use
- Services you offer

### Accessibility

- Write clear alt text for images
- Use descriptive link text
- Avoid jargon in main content
- Keep sentences concise

## 🚀 Content Ideas

### Blog Posts (if adding blog)
- Tutorial on something you're expert in
- Project case studies
- Technology comparisons
- Industry insights

### Project Descriptions
- Problem you solved
- Technologies used
- Challenges overcome
- Results/impact
- Lessons learned

### About Section
- Your journey to development
- What drives you
- What you love about coding
- Your work philosophy
- Hobbies (briefly)

## 📊 Content Performance

Track which content works:

### High-Converting Content
- Clear CTAs
- Specific metrics
- Real testimonials
- Live project demos
- Case studies

### Less Effective Content
- Vague descriptions
- Generic statements
- Outdated projects
- Broken links
- Poor images

## 🔄 Update Schedule

### Weekly
- Check for typos
- Update availability status
- Respond to messages

### Monthly
- Add new projects
- Update skills
- Check all links
- Update resume

### Quarterly
- Major content review
- Update testimonials
- Refresh images
- SEO optimization

### Yearly
- Complete redesign consideration
- Remove outdated content
- Update all sections
- Professional photoshoot

## 🆘 Content Help

### Need Inspiration?

Look at these portfolios:
- [Awwwards](https://www.awwwards.com/websites/portfolio/)
- [Dribbble](https://dribbble.com/tags/portfolio)
- [Behance](https://www.behance.net/galleries/interaction)

### Need Copy Help?

Tools:
- **Grammarly**: Check grammar
- **Hemingway**: Simplify writing
- **QuillBot**: Rewrite sentences
- **ChatGPT**: Generate ideas

### Need Images?

Sources:
- **Unsplash**: Free stock photos
- **Pexels**: Free images
- **Canva**: Create graphics
- **Figma**: Design mockups

## ✍️ Template Examples

### Project Description Template

```
[Project Name] is a [type of project] that [main purpose].

Key Features:
- [Feature 1 with benefit]
- [Feature 2 with benefit]
- [Feature 3 with benefit]

Built with [tech stack], this project [achievement/impact].

Challenges overcome:
- [Challenge 1 and solution]
- [Challenge 2 and solution]

Results: [Metrics, user feedback, or impact]
```

### Experience Description Template

```
[Action verb] [what you did] resulting in [measurable impact].

Key achievements:
- [Achievement with metric]
- [Achievement with metric]
- [Achievement with metric]

Technologies: [List relevant tech]
```

---

**Remember**: Your portfolio tells your professional story. Keep it authentic, updated, and focused on your best work!

Need help? Check other guides or reach out to the community.
