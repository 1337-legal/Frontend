import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import BenefitsCard from '@Features/home/components/BenefitsCard';
import FeatureGrid from '@Features/home/components/FeatureGrid';
import HeroSection from '@Features/home/components/HeroSection';
import InfrastructurePostureSection from '@Features/home/components/InfrastructurePostureSection';
import PrivacyEnvelopeCard from '@Features/home/components/PrivacyEnvelopeCard';
import SiteFooter from '@Features/home/components/SiteFooter';
import SessionService from '@Services/SessionService';

const Home: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        console.log('isMobile', isMobile);
        if (!isMobile) return;
        const hasEncrypted = !!SessionService.getEncryptedMnemonic();
        console.log('hasEncrypted', hasEncrypted);
        if (hasEncrypted) {
            navigate('/auth')
            return;
        }
    }, [navigate]);
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
            <style>{`
        @keyframes fade-in-up {0%{opacity:0;transform:translateY(18px) scale(.97)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes glow-loop {0%,100%{opacity:.55;filter:blur(62px) saturate(140%)}50%{opacity:.9;filter:blur(70px) saturate(200%)}}
        @keyframes subtle-pulse {0%,100%{box-shadow:0 0 0 0 rgba(251,146,60,0.0),0 0 24px -6px rgba(251,146,60,.55)}50%{box-shadow:0 0 0 0 rgba(251,146,60,0.0),0 0 42px -8px rgba(251,146,60,.75)}}
        @keyframes dashA {to {stroke-dashoffset: -1000}}
        @keyframes dashB {to {stroke-dashoffset: -1000}}
        @keyframes dashC {to {stroke-dashoffset: -1000}}
        @keyframes orb {0%{transform:translate3d(-10%,0,0) scale(.6);opacity:0}7%{opacity:.9}50%{opacity:.85}93%{opacity:.15}100%{transform:translate3d(110%,0,0) scale(.6);opacity:0}}
        .animate-fade-in-up {animation: fade-in-up .65s cubic-bezier(.16,.8,.34,1) forwards;}
        .animate-fade-in-up-delayed {opacity:0;animation: fade-in-up .75s .15s cubic-bezier(.16,.8,.34,1) forwards;}
        .animate-fade-in-up-long {opacity:0;animation: fade-in-up .8s .3s cubic-bezier(.16,.8,.34,1) forwards;}
        .animate-glow-pulse {animation: subtle-pulse 4.5s ease-in-out infinite;}
        [class*='animate-dash-'] {stroke-dasharray:140 860;stroke-dashoffset:0;}
        .animate-dash-1 {animation: dashA 14s linear infinite;}
        .animate-dash-2 {animation: dashB 17s linear infinite;}
        .animate-dash-3 {animation: dashC 20s linear infinite;}
        .motion-orb-1 {animation: orb 11s linear infinite;}
        .motion-orb-2 {animation: orb 15s linear infinite;animation-delay:4s;}
        .motion-orb-3 {animation: orb 19s linear infinite;animation-delay:2s;}
      `}</style>
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[-15%] h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.18),transparent_60%)] blur-3xl animate-[glow-loop_9s_ease-in-out_infinite]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[480px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,115,60,0.14),transparent_70%)] blur-3xl animate-[glow-loop_11s_reverse_infinite]" />
            </div>
            <HeroSection />
            <FeatureGrid />
            <section className="relative mx-auto max-w-7xl grid gap-10 px-6 pb-24 lg:grid-cols-2">
                <PrivacyEnvelopeCard />
                <BenefitsCard />
            </section>
            <InfrastructurePostureSection />
            <SiteFooter />
        </div>
    );
};

export default Home;