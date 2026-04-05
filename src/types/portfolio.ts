import type {
  Certification,
  Education,
  Experience,
  MediaAsset,
  Portfolio,
  Project,
  Skill,
  SocialLink,
  Testimonial,
  Theme,
} from "@prisma/client";

export type PortfolioRecord = Portfolio & {
  theme: Theme | null;
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  mediaAssets: MediaAsset[];
  testimonials: Testimonial[];
};
