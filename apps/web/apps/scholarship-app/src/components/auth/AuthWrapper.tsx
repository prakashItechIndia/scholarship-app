import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import iCapturLogo from '@ui/assets/logos/iCaptur-Brand.svg';
import leftPanelBg from '@ui/assets/images/left-panel-bg.png';
import iTechLogo from '@ui/assets/logos/iTech-Brand.svg';

interface AuthWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: ReactNode;
  emailOrUsername?: string;
  hideBrandPanel?: boolean;
}

const CAROUSEL_SLIDES = [
  {
    heading: 'One Login. Unlimited Access.',
    subheading:
      'The iCaptur Experience begins here. Sign in once to access all your subscribed iCaptur products securely and seamlessly.',
  },
  {
    heading: 'The Unified AI Experience Platform.',
    subheading:
      'iCaptur brings all your AI-powered document, data, and workflow solutions under one secure, unified experience.',
  },
  {
    heading: 'Security You Can Trust.',
    subheading:
      'Your data is protected with encryption, access controls, session security, and compliance-focused architecture.',
  },
  {
    heading: 'AI at the Core of Every Workflow.',
    subheading:
      'From document intelligence to automated processing, iCaptur accelerates operations with enterprise-grade AI models.',
  },
];

const LogoWordmark = () => (
  <img src={iCapturLogo} alt="iCaptur" className="h-8" />
);

const BrandPanel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden bg-[#2148C0] px-12 py-16 text-white lg:flex"
      style={{
        backgroundImage: `url(${leftPanelBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main content area - vertically centered */}
      <div className="flex flex-1 flex-col justify-center max-w-lg">
        <div className="space-y-6 relative">
          {CAROUSEL_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={clsx(
                'absolute inset-0 transition-opacity duration-1000',
                index === activeSlide ? 'opacity-100' : 'opacity-0',
              )}
            >
              <h1 className="text-white text-5xl font-bold font-inter leading-[60px] mb-6">
                {slide.heading}
              </h1>
              <p className="text-white text-xs font-normal font-inter leading-5 max-w-md">
                {slide.subheading}
              </p>
            </div>
          ))}
          {/* Spacer to maintain height */}
          {/* <div className="invisible">
            <h1 className="text-[56px] font-bold leading-[1.15] tracking-tight mb-6">
              {CAROUSEL_SLIDES[0].heading}
            </h1>
            <p className="text-[17px] text-white/90 leading-relaxed max-w-md">
              {CAROUSEL_SLIDES[0].subheading}
            </p>
          </div> */}
        </div>
      </div>

      {/* Carousel dots at bottom */}
      <div className="flex items-center gap-2.5">
        {CAROUSEL_SLIDES.map((_, index) => (
          <div
            key={index}
            className={clsx(
              'rounded-full transition-all duration-300',
              index === activeSlide
                ? 'h-1 w-14 bg-white'
                : 'h-1.5 w-1.5 bg-white/50',
            )}
          />
        ))}
      </div>
    </div>
  );
};

export const AuthWrapper = ({
  children,
  title,
  subtitle,
  emailOrUsername,
  hideBrandPanel = false,
}: AuthWrapperProps) => {
  return (
    <div className="min-h-screen bg-[#2148C0] text-Neutral-Foreground-1-Rest font-inter">
      <div className="flex min-h-screen flex-col lg:flex-row bg-rgb(68 0 203 / 0%);">
        {!hideBrandPanel && <BrandPanel />}

        <div
          className={clsx(
            'flex flex-1 flex-col overflow-hidden rounded-[20px_0px_0px_20px]',
          )}
        >
          {/* Main content area */}
          <div className="flex-1 flex flex-col px-6 py-12 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 bg-Neutral-Background-1-Rest">
            {/* Container with consistent max-width for logo and content */}
            <div className="w-full max-w-[480px] xl:max-w-[520px] 2xl:max-w-[600px] mx-auto lg:mx-0">
              {/* Logo at top-left */}
              <div className="mb-16">
                <LogoWordmark />
              </div>
            </div>

            {/* Centered content */}
            <div className="flex-1 flex items-center justify-center lg:justify-start">
              <div className="w-full max-w-[480px] xl:max-w-[520px] 2xl:max-w-[600px] space-y-8">
                {((title ?? '') || (subtitle ?? '') || emailOrUsername) && (
                  <header className="space-y-2">
                    {emailOrUsername ? (
                      <div className="text-[14px] text-Neutral-Foreground-1-Rest font-normal leading-[20px] mb-4">
                        {emailOrUsername}
                      </div>
                    ) : null}
                    {title ? (
                      <h1 className="text-Neutral-Foreground-1-Rest text-xl font-semibold font-inter leading-7">
                        {title}
                      </h1>
                    ) : null}
                    {subtitle ? (
                      <p className="text-Neutral-Foreground-4-Rest text-xs font-normal leading-5">
                        {subtitle}
                      </p>
                    ) : null}
                  </header>
                )}

                <div className="space-y-6">{children}</div>
              </div>
            </div>
          </div>

          {/* Footer at bottom with gray background */}
          <div className="bg-Neutral-Background-3-Rest px-6 py-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
            <footer className="mx-auto lg:mx-0 w-full max-w-[480px] xl:max-w-[520px] 2xl:max-w-[600px]">
              <div className="flex items-start justify-between gap-[41px]">
                {/* Left side: Support Info */}
                <div className="flex flex-col gap-[6px] text-Neutral-Foreground-4-Rest">
                  <div className="text-xs font-normal font-inter leading-5">
                    <span className="text-Neutral-Foreground-4-Rest">Need help? </span>
                    <a
                      href="mailto:support@icaptur.ai"
                      className="text-Neutral-Foreground-2-Link-Rest text-xs font-medium font-inter underline leading-5"
                    >
                      Contact Support
                    </a>
                  </div>
                  <div className="text-Neutral-Foreground-4-Rest text-xs font-normal font-inter leading-5">
                    © 2024 iCaptur. All rights reserved.
                  </div>
                </div>

                {/* Right side: Powered By Container */}
                <div className="flex flex-col gap-[8px] items-end justify-center shrink-0">
                  <div className="text-Neutral-Foreground-4-Rest text-xs font-normal font-inter leading-5">
                    Powered by
                  </div>
                  <a
                    href="https://itechindia.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    <img src={iTechLogo} alt="iTech" className="h-5" />
                  </a>
                </div>
              </div>

              {/* Second line: Copyright + iTech logo */}

            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
