import { IconCircleChevronRight } from "@tabler/icons-react";

export default function Home() {
  return (
    <section className="bg-base-300 h-[calc(100vh-4.8rem)] flex items-center">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Secure & Transparent Blockchain Voting
          </h1>
          <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
            BlockVote ensures fair and tamper-proof elections using blockchain
            technology. Vote securely with Metamask authentication and
            transparent blockchain records.
          </p>
          <a
            href="https://forms.gle/ZywwxXbPYjYB4Szq70"
            target="_blank"
            className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
          >
            Register to Vote
            <IconCircleChevronRight />
          </a>
          <a
            href="/features"
            className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
          >
            Learn More
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="/bg.png" alt="Blockchain Voting" />
        </div>
      </div>
    </section>
  );
}
