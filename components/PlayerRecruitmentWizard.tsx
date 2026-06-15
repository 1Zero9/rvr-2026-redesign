'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, User, Mail, Phone, CheckCircle2 } from 'lucide-react';

type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

interface WizardData {
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  position: Position | '';
  parentName: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
}

export default function PlayerRecruitmentWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<WizardData>({
    firstName: '',
    lastName: '',
    yearOfBirth: '',
    position: '',
    parentName: '',
    email: '',
    phone: '',
    gdprConsent: false,
  });

  const positions: Position[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  const handleInputChange = (field: keyof WizardData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Registration submitted! Thank you for registering ${formData.firstName} ${formData.lastName}.`);
    // Reset wizard
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      yearOfBirth: '',
      position: '',
      parentName: '',
      email: '',
      phone: '',
      gdprConsent: false,
    });
  };

  // Check step validations to enable Next button
  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.firstName.trim().length > 0 &&
        formData.lastName.trim().length > 0 &&
        formData.yearOfBirth.trim().length === 4 &&
        formData.position !== ''
      );
    }
    if (step === 2) {
      return (
        formData.parentName.trim().length > 0 &&
        formData.email.trim().length > 0 &&
        formData.phone.trim().length > 0
      );
    }
    if (step === 3) {
      return formData.gdprConsent;
    }
    return false;
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-12 select-none">
      
      {/* Wizard card container */}
      <div className="brutalist-card bg-white p-6 md:p-8 shadow-brutalist border-4 border-brand-charcoal">
        
        {/* Step Progress indicators */}
        <div className="flex items-center justify-between mb-8 border-b-2 border-brand-charcoal pb-4">
          <span className="font-display font-black text-sm uppercase italic text-brand-green">
            Player Registration Funnel
          </span>
          <span className="font-display font-black text-xs bg-brand-neon border-2 border-brand-charcoal px-3 py-1 rounded-full text-brand-charcoal">
            Step {step} of 3
          </span>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Player Profile */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                1. Player Profile
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">First Name</label>
                  <input
                    required
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">Last Name</label>
                  <input
                    required
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="yearOfBirth" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">Year of Birth</label>
                <input
                  required
                  type="text"
                  id="yearOfBirth"
                  maxLength={4}
                  value={formData.yearOfBirth}
                  onChange={(e) => handleInputChange('yearOfBirth', e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm max-w-xs"
                  placeholder="e.g. 2012"
                />
              </div>

              {/* Positions Card Grid Selection */}
              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wide mb-2">Preferred Position</label>
                <div className="grid grid-cols-2 gap-3">
                  {positions.map((pos) => {
                    const isSelected = formData.position === pos;
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handleInputChange('position', pos)}
                        className={`p-3 text-left border-3 rounded-xl font-display font-black text-xs uppercase transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#E8F4F0] border-brand-green text-brand-greenDark shadow-[2px_2px_0px_0px_#121212]'
                            : 'border-zinc-200 hover:border-brand-charcoal text-zinc-600 bg-zinc-50'
                        }`}
                      >
                        <span>{pos}</span>
                        {isSelected && <Check className="w-4 h-4 text-brand-green" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                2. Parent / Guardian Contact Details
              </h3>

              <div>
                <label htmlFor="parentName" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">Parent/Guardian Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    required
                    type="text"
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange('parentName', e.target.value)}
                    className="w-full p-3 pl-10 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    required
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 pl-10 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    required
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 pl-10 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="e.g. 087 123 4567"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Value Proposition & Consent */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                3. Club Benefits & Guardian Consent
              </h3>

              {/* Club benefits details */}
              <div className="p-4 bg-[#E8F4F0] border-2 border-brand-green/30 rounded-2xl space-y-3">
                <span className="font-display font-black text-[10px] text-brand-green uppercase tracking-wider block">
                  Club Membership Benefits
                </span>
                
                <div className="space-y-2 text-xs font-semibold text-brand-greenDark">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Access to full-size floodlit Astro pitch facility.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Accredited FAI Club Mark charter structure.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Training delivered by qualified UEFA/FAI coaches.</span>
                  </div>
                </div>
              </div>

              {/* GDPR digital media consent toggle */}
              <div className="p-4 border-3 border-brand-charcoal rounded-2xl bg-white space-y-3 shadow-[3px_3px_0px_0px_#121212]">
                <h4 className="font-display font-black text-sm uppercase italic text-brand-charcoal">
                  GDPR Digital Media Consent
                </h4>
                <p className="font-sans text-xs text-zinc-600 leading-relaxed font-semibold">
                  I consent to the club using training and match day action photographs containing my child on club social media channels and training brochures.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    required
                    type="checkbox"
                    id="gdprConsent"
                    checked={formData.gdprConsent}
                    onChange={(e) => handleInputChange('gdprConsent', e.target.checked)}
                    className="w-5 h-5 border-3 border-brand-charcoal rounded cursor-pointer accent-brand-neon focus:ring-2 focus:ring-brand-neon"
                  />
                  <label htmlFor="gdprConsent" className="font-display font-bold text-xs uppercase tracking-wider text-brand-charcoal cursor-pointer">
                    I agree to the GDPR consent terms
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t-2 border-brand-charcoal pt-6 mt-6 gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 text-xs uppercase font-display font-black border-3 border-brand-charcoal rounded-xl shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none hover:bg-zinc-50 transition-all flex items-center justify-center gap-1.5 focus:ring-4 focus:ring-brand-green focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div></div> // Empty placeholder to align Next button
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-3.5 text-xs uppercase font-display font-black border-3 border-brand-charcoal bg-brand-neon text-brand-charcoal rounded-xl shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all flex items-center justify-center gap-1.5 focus:ring-4 focus:ring-brand-green focus:outline-none"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid()}
                className="px-6 py-3.5 text-xs uppercase font-display font-black border-3 border-brand-charcoal bg-brand-neon text-brand-charcoal rounded-xl shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all flex items-center justify-center gap-1.5 focus:ring-4 focus:ring-brand-green focus:outline-none"
              >
                Submit Registration
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

      </div>
      
    </section>
  );
}
