import { LuHand, LuMegaphone, LuServer } from "react-icons/lu";
import { Container } from "@/components/ui/SectionHeading";
import { ECOSYSTEM_ROLES } from "@/lib/ecosystem-content";

const ROLE_ICONS = {
  announce: LuMegaphone,
  hand: LuHand,
  server: LuServer,
};

export function EcosystemRoles() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-[34px]">
          <div className="flex items-center gap-[14px]">
            <span className="h-7 w-[5px] shrink-0 rounded-sm bg-pesacheck-blue" />
            <h2 className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#021d32]">
              How we build the ecosystem
            </h2>
          </div>
          <div className="mt-[18px] h-px bg-[#e4e5e8]" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_ROLES.map((role) => {
            const RoleIcon = ROLE_ICONS[role.icon];
            return (
              <div key={role.title}>
                <span className="mb-4 inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#e4e5e8] bg-[#f6f7f9] text-[#021d32]">
                  <RoleIcon size={20} strokeWidth={1.7} aria-hidden />
                </span>
                <h4 className="mb-2 text-[17px] font-bold text-[#021d32]">
                  {role.title}
                </h4>
                <p className="text-sm font-normal leading-[1.65] text-[#3b3f45]">
                  {role.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
