'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LawCard } from '@/components/UI/LawCard';
import { LawDetailModal } from '@/components/UI/LawDetailModal';
import { BookOpen, TestTube, AlertCircle } from 'lucide-react';

const MOCK_LAW_RESPONSE = {
  rank: 1,
  relevance_score: 0.98,
  uncertain: false,
  official_number: {
    ar: "الأمر رقم 75-58 المؤرخ في 26 سبتمبر 1975",
    fr: "Ordonnance n° 75-58 du 26 septembre 1975",
    en: "Ordinance No. 75-58 of 26 September 1975"
  },
  title: {
    ar: "القانون المدني الجزائري (المسؤولية التقصيرية)",
    fr: "Code civil algérien (Responsabilité délictuelle)",
    en: "Algerian Civil Code (Tortious Liability)"
  },
  domain: "القانون المدني / القانون الخاص",
  gazette: {
    issue_number: "78",
    publication_date: {
      ar: "30 سبتمبر 1975",
      fr: "30 septembre 1975",
      en: "30 September 1975",
      iso: "1975-09-30"
    },
    page: "1",
    official_url: "https://www.joradp.dz"
  },
  relevant_articles: [
    {
      number: "124",
      heading: {
        ar: "مبدأ التعويض العام",
        fr: "Principe général de réparation",
        en: "General Principle of Reparation"
      },
      text: {
        ar: "كل عمل أيًّا كان يرتكبه المرء ويسبب ضررًا للغير يُلزم من كان سببًا في حدوثه بالتعويض.",
        fr: "Tout fait quelconque de l'homme qui cause à autrui un dommage oblige celui par la faute duquel il est arrivé à le réparer.",
        en: "Any act whatsoever of man that causes damage to another obliges the one by whose fault it occurred to compensate it."
      },
      significance: "critical"
    },
    {
      number: "125",
      heading: {
        ar: "المسؤولية عن الشخص غير المميز",
        fr: "Responsabilité de l'incapable",
        en: "Liability of the Incapacitated"
      },
      text: {
        ar: "لا يسأل الشخص عن أعماله غير المشروعة إذا صدرت منه وهو غير مميز.",
        fr: "La personne n'est pas responsable de ses actes illicites si elle est dépourvue de discernement.",
        en: "A person is not liable for their illicit acts if they are devoid of discernment."
      },
      significance: "standard"
    }
  ],
  citizen_summary: {
    ar: "هذا القانون هو الأساس الذي يسمح لك بطلب التعويض إذا تسبب لك شخص ما في ضرر مادي أو معنوي بخطئه.",
    fr: "Cette loi est le fondement qui vous permet de demander réparation si quelqu'un vous cause un dommage matériel ou moral par sa faute.",
    en: "This law is the foundation that allows you to seek compensation if someone causes you material or moral damage through their fault."
  },
  explanation: {
    ar: "تعتبر المادة 124 من القانون المدني الجزائري حجر الزاوية في نظام المسؤولية المدنية. فهي تنص على مبدأ عام وشامل: كل من تسبب في ضرر للغير بخطئه ملزم بجبر هذا الضرر.\n\nتتطلب هذه المسؤولية توفر ثلاثة أركان أساسية: الخطأ (وهو انحراف في السلوك)، الضرر (سواء كان مادياً أو معنوياً)، وعلاقة السببية بينهما. إذا اختل أحد هذه الأركان، تسقط إمكانية طلب التعويض.\n\nبالنسبة للمواطن، هذا يعني أن أي اعتداء على سلامتك الجسدية، ممتلكاتك، أو حتى سمعتك، يمنحك الحق القانوني في المطالبة بجبر الضرر أمام المحاكم المدنية، بشرط إثبات الخطأ والضرر الناتج عنه.",
    fr: "L'article 124 du Code civil algérien constitue la pierre angulaire du système de responsabilité civile. Il pose un principe général et universel : quiconque cause un dommage à autrui par sa faute est tenu de le réparer.\n\nCette responsabilité nécessite la réunion de trois éléments fondamentaux : la faute (un écart de conduite), le dommage (qu'il soit matériel ou moral), et le lien de causalité entre les deux. Si l'un de ces éléments fait défaut, l'action en réparation ne peut aboutir.\n\nPour le citoyen, cela signifie que toute atteinte à son intégrité physique, à ses biens ou même à sa réputation, lui ouvre le droit légal de demander réparation devant les juridictions civiles, à condition de prouver la faute et le préjudice subi.",
    en: "Article 124 of the Algerian Civil Code is the cornerstone of the civil liability system. It establishes a general and universal principle: whoever causes damage to another by their fault is obliged to repair it.\n\nThis liability requires three fundamental elements: fault (a deviation in conduct), damage (whether material or moral), and the causal link between the two. If one of these elements is missing, the action for compensation cannot succeed.\n\nFor the citizen, this means that any infringement of their physical integrity, property, or even reputation, gives them the legal right to claim compensation before civil courts, provided they prove the fault and the resulting damage."
  },
  practical_example: {
    scenario: {
      ar: "شخص يصطدم بمرآة سيارة مركونة أثناء قيادته بسرعة مفرطة في حي سكني.",
      fr: "Une personne percute le rétroviseur d'une voiture garée en conduisant à une vitesse excessive dans un quartier résidentiel.",
      en: "A person hits the side mirror of a parked car while driving at excessive speed in a residential neighborhood."
    },
    outcome: {
      ar: "يلتزم السائق بتعويض صاحب السيارة عن تكلفة إصلاح المرآة لأن السرعة المفرطة تعتبر خطأ تسبب في ضرر مادي.",
      fr: "Le conducteur est tenu d'indemniser le propriétaire du véhicule pour le coût de la réparation, car la vitesse excessive constitue une faute ayant causé un dommage matériel.",
      en: "The driver is obliged to compensate the car owner for the repair cost, as excessive speed constitutes a fault that caused material damage."
    }
  },
  roles: [
    {
      party: { ar: "المسؤول (المخطئ)", fr: "Le responsable (l'auteur)", en: "The liable party (tortfeasor)" },
      rights: {
        ar: ["الحق في الدفاع عن النفس", "المطالبة بإثبات الضرر"],
        fr: ["Droit à la défense", "Exigence de preuve du dommage"],
        en: ["Right to defense", "Requirement of proof of damage"]
      },
      obligations: {
        ar: ["جبر الضرر بالكامل", "دفع التعويضات المحكوم بها"],
        fr: ["Réparation intégrale du préjudice", "Paiement des indemnités allouées"],
        en: ["Full reparation of the damage", "Payment of awarded compensation"]
      }
    }
  ]
};

export default function TestAIPage() {
  const { t } = useLanguage();
  const [selectedLaw, setSelectedLaw] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12 pb-10">
          <div className="p-4 bg-accent-bg rounded-2xl shadow-premium animate-float">
            <TestTube className="w-10 h-10 text-legal-red" />
          </div>
          <div>
            <h1 className="text-4xl font-cairo font-black text-primary mb-2 uppercase tracking-tighter">
              {t('nav.compare')} - <span className="text-legal-red">{t('common.lab')}</span>
            </h1>
            <p className="text-muted font-inter text-lg">{t('law.simulationDesc')}</p>
          </div>
        </div>

        <div className="bg-soft rounded-3xl p-10 mb-12 relative overflow-hidden shadow-premium animate-reveal">
          <div className="absolute top-0 right-0 p-6">
            <span className="flex items-center gap-2 text-[10px] font-black text-legal-red bg-accent-bg px-3 py-1.5 rounded-full uppercase tracking-widest shadow-premium animate-pulse-accent">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('law.mockAiActive')}
            </span>
          </div>

          <h2 className="text-2xl font-cairo font-black text-primary mb-8 flex items-center gap-3 uppercase tracking-tight">
            <BookOpen className="w-6 h-6 text-legal-red" />
            {t('search.title')}
          </h2>

          <div className="max-w-md mx-auto">
            <LawCard 
              law={MOCK_LAW_RESPONSE} 
              onOpenDetails={(law) => {
                setSelectedLaw(law);
                setIsModalOpen(true);
              }} 
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted text-xs font-black uppercase tracking-widest mb-6">
              {t('common.details')}
            </p>
            <ul className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto text-xs text-muted font-bold uppercase tracking-tight">
              <li className="flex items-center gap-3 bg-card p-2.5 rounded-lg shadow-soft transition-transform hover:translate-x-1">
                <span className="text-legal-red font-black">✓</span> {t('law.featExplanation')}
              </li>
              <li className="flex items-center gap-3 bg-card p-2.5 rounded-lg shadow-soft transition-transform hover:translate-x-1">
                <span className="text-legal-red font-black">✓</span> {t('law.featGazette')}
              </li>
              <li className="flex items-center gap-3 bg-card p-2.5 rounded-lg shadow-soft transition-transform hover:translate-x-1">
                <span className="text-legal-red font-black">✓</span> {t('law.featArticles')}
              </li>
              <li className="flex items-center gap-3 bg-card p-2.5 rounded-lg shadow-soft transition-transform hover:translate-x-1">
                <span className="text-legal-red font-black">✓</span> {t('law.featExamples')}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <LawDetailModal 
        law={selectedLaw} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
