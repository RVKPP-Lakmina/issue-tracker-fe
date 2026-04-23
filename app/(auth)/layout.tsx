import Image from "next/image";
import { ReactNode } from "react";

const STAR_RATING = 5;
const FIRST_STAR = 1;
const STAR_INDEXES = Array.from(
  { length: STAR_RATING },
  (_, index) => FIRST_STAR + index,
);

const SignInLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default border">
        <div className="pb-6 lg:pb-8 flex-1 flex flex-col justify-center">
          {children}
        </div>
      </section>
      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {STAR_INDEXES.map((star) => (
                <Image
                  src="/star.svg"
                  alt="Star"
                  key={star}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <Image
            src="/Page.png"
            alt="Dashboard Preview"
            width={1440}
            height={1150}
            className="auth-dashboard-preview absolute top-0"
          />
        </div>
      </section>
    </main>
  );
};

export default SignInLayout;
