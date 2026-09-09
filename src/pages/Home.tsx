import BenefitsCard from '@Features/home/components/BenefitsCard';
import FeatureGrid from '@Features/home/components/FeatureGrid';
import HeroSection from '@Features/home/components/HeroSection';
import InfrastructurePostureSection from '@Features/home/components/InfrastructurePostureSection';
import PrivacyEnvelopeCard from '@Features/home/components/PrivacyEnvelopeCard';
import SpecBar from '@Features/home/components/SpecBar';
import SiteFooter from '@Features/shared/components/SiteFooter';
import SiteNav from '@Features/shared/components/SiteNav';
import SessionService from '@Services/SessionService';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Home: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        if (!isMobile) return;
        const hasEncrypted = !!SessionService.getEncryptedMnemonic();
        if (hasEncrypted) {
            navigate('/auth');
            return;
        }
    }, [navigate]);

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
            <SiteNav />
            <HeroSection />
            <SpecBar />
            <FeatureGrid />
            <section className="mx-auto grid max-w-7xl items-start gap-8 px-6 pt-22 lg:grid-cols-2 lg:px-12">
                <PrivacyEnvelopeCard />
                <BenefitsCard />
            </section>
            <InfrastructurePostureSection />
            <SiteFooter />
        </div>
    );
};

export default Home;
