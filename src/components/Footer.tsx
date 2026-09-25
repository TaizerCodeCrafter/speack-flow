import React from 'react';
import { BookOpen, Headphones, Mic, MessageSquare, Heart, ArrowUp } from 'lucide-react';
import { SkillType } from '../types';
import { TaizerFlowLogo } from './TaizerFlowLogo';

interface FooterProps {
  onSelectSkill: (skill: SkillType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSkill }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="bg-white border-t border-slate-200 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-100">
          {/* Brand Info */}
          <div className="space-y-2">
            <TaizerFlowLogo size="md" />
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              An interactive English language platform designed for active immersion in Reading, Listening, Speaking, and Spoken Conversation.
            </p>
          </div>

          {/* Quick Pillar Links */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onSelectSkill('writing')}
              className="hover:text-teal-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Writing</span>
            </button>
            <button
              onClick={() => onSelectSkill('spoken_oral')}
              className="hover:text-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-purple-600" />
              <span>Spoken / Oral</span>
            </button>
            <button
              onClick={() => onSelectSkill('grammar')}
              className="hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Grammar</span>
            </button>
            <button
              onClick={() => onSelectSkill('simple_sentence')}
              className="hover:text-sky-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Simple Sentence</span>
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Resources
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              About
            </button>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer shadow-2xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom line with exact required user copyright notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p className="font-medium text-slate-600">
            © 2026 Taizer Code Crafter. • Active English Learning & Fluency
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>PWA Ready for Phone & Laptop</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
