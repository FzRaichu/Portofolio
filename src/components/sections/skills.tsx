import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { skills } from "@/lib/data";
export function Skills() {
  return (
    <section id="skills" data-chapter className="chapter skills-chapter">
      <div className="chapter-inner">
        <div className="skills-copy">
          <ScrollReveal>
            <p className="eyebrow">03 / THE TOOLKIT</p>
            <h2 className="section-title">
              Different tools.
              <br />
              <span className="text-dim">Shared curiosity.</span>
            </h2>
            <p className="section-intro">
              The languages, frameworks, and tools behind the work.
            </p>
          </ScrollReveal>
          <div className="skill-groups">
            {skills.map((group, index) => (
              <ScrollReveal key={group.category} delay={index * 0.06}>
                <div className="skill-row">
                  <span className="skill-index">0{index + 1}</span>
                  <div>
                    <h3>{group.category}</h3>
                    <div className="skill-items">
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="skill-arrow" />
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="section-note">
            Starter skill list · personal details will be refined next.
          </p>
        </div>
      </div>
    </section>
  );
}
