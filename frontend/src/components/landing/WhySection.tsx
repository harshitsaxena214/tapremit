import React from 'react';
import SectionHeading from './SectionHeading';
import Card from './Card';
import Reveal from './Reveal';
import { LANDING_CONTENT } from './content';

export default function WhySection() {
  const { why } = LANDING_CONTENT;

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="scroll-mt-[100px] w-full border-t border-[var(--line)] py-[clamp(80px,10vw,140px)] px-[clamp(20px,4vw,50px)]"
    >
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <SectionHeading
            id="why-heading"
            overline={why.overline}
            heading={why.heading}
          />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {why.items.map((item) => (
              <Card
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
