import { useEffect, useState } from "react";
import { MEMBERS } from "./data";
import { TeamSectionHeading } from "./team-section-heading";
import { TeamMemberCard } from "./team-member-card";
import type { TeamMember } from "./types";

type TeamSectionProps = {
  members?: readonly TeamMember[];
};

export default function TeamSection({ members = MEMBERS }: TeamSectionProps) {
  const [activeMemberId, setActiveMemberId] = useState<TeamMember["id"] | null>(
    null,
  );
  const activeIndex =
    activeMemberId === null
      ? -1
      : members.findIndex((member) => member.id === activeMemberId);

  useEffect(() => {
    if (activeIndex === -1 && activeMemberId !== null) {
      setActiveMemberId(null);
    }
  }, [activeIndex, activeMemberId]);

  if (members.length === 0) {
    return null;
  }

  const cards = members.map((member, index) => (
    <TeamMemberCard
      key={member.id}
      member={member}
      index={index}
      totalMembers={members.length}
      activeIndex={activeIndex}
      onActivate={() => setActiveMemberId(member.id)}
      onDeactivate={() => setActiveMemberId(null)}
    />
  ));

  return (
    <section className="relative w-full overflow-hidden px-3 pb-8 pt-5 text-white md:px-5 md:pb-12 md:pt-8 lg:pt-10">
      <TeamSectionHeading />

      <div className="relative z-10 mt-4 flex justify-center md:mt-5">
        <div className="w-full max-w-md md:hidden">
          <ul className="flex flex-col gap-4">
            {members.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index}
                totalMembers={members.length}
                activeIndex={-1}
                disableMotion
                onActivate={() => setActiveMemberId(member.id)}
                onDeactivate={() => setActiveMemberId(null)}
              />
            ))}
          </ul>
        </div>

        <div className="hidden origin-top scale-[0.75] md:block lg:scale-[0.88] xl:scale-100">
          <ul
            className="flex min-h-[470px] w-[1020px] max-w-full items-end justify-center pt-4 pb-2"
            onMouseLeave={() => setActiveMemberId(null)}
          >
            {cards}
          </ul>
        </div>
      </div>
    </section>
  );
}
