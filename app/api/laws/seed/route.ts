import { NextResponse } from 'next/server';
import { setLawMetadata } from '@/lib/cache';

const ADMIN_LAWS = [
  {
    law_name: "Code of Administrative Procedures 08-09",
    category: "adminJustice",
    metadata: {
      title: {
        ar: "قانون الإجراءات المدنية والإدارية (08-09)",
        fr: "Code de Procédure Civile et Administrative (08-09)",
        en: "Code of Civil and Administrative Procedures (08-09)"
      },
      official_number: {
        ar: "القانون رقم 08-09",
        fr: "Loi n° 08-09",
        en: "Law No. 08-09"
      },
      gazette: {
        issue_number: "21",
        publication_date: {
          ar: "23 أفريل 2008",
          fr: "23 Avril 2008",
          en: "April 23, 2008",
          iso: "2008-04-23"
        }
      },
      citizen_summary: {
        ar: "هذا القانون يحدد القواعد المطبقة أمام الجهات القضائية في المادة المدنية والمادة الإدارية.",
        fr: "Cette loi fixe les règles applicables devant les juridictions en matière civile et administrative.",
        en: "This law defines the rules applicable before judicial authorities in civil and administrative matters."
      }
    }
  },
  {
    law_name: "Civil Service Ordinance 06-03",
    category: "civilService",
    metadata: {
      title: {
        ar: "الأمر رقم 06-03 المتضمن القانون الأساسي العام للوظيفة العمومية",
        fr: "Ordonnance n° 06-03 portant statut général de la fonction publique",
        en: "Ordinance No. 06-03 regarding the General Civil Service Status"
      },
      official_number: {
        ar: "الأمر رقم 06-03",
        fr: "Ordonnance n° 06-03",
        en: "Ordinance No. 06-03"
      },
      gazette: {
        issue_number: "46",
        publication_date: {
          ar: "16 جويلية 2006",
          fr: "16 Juillet 2006",
          en: "July 16, 2006",
          iso: "2006-07-16"
        }
      },
      citizen_summary: {
        ar: "يحدد هذا الأمر القواعد القانونية المطبقة على الموظفين العموميين وحقوقهم وواجباتهم.",
        fr: "Cette ordonnance définit les règles juridiques applicables aux fonctionnaires, leurs droits et obligations.",
        en: "This ordinance defines the legal rules applicable to public officials, their rights, and duties."
      }
    }
  },
  {
    law_name: "Public Procurement Decree 15-247",
    category: "publicContracts",
    metadata: {
      title: {
        ar: "المرسوم الرئاسي رقم 15-247 المتضمن تنظيم الصفقات العمومية وتفويضات المرفق العام",
        fr: "Décret présidentiel n° 15-247 portant réglementation des marchés publics et des délégations de service public",
        en: "Presidential Decree No. 15-247 regulating public procurement and public service delegations"
      },
      official_number: {
        ar: "المرسوم الرئاسي رقم 15-247",
        fr: "Décret présidentiel n° 15-247",
        en: "Presidential Decree No. 15-247"
      },
      gazette: {
        issue_number: "50",
        publication_date: {
          ar: "16 سبتمبر 2015",
          fr: "16 Septembre 2015",
          en: "September 16, 2015",
          iso: "2015-09-16"
        }
      },
      citizen_summary: {
        ar: "ينظم هذا المرسوم كيفية إبرام وتنفيذ الصفقات التي تقوم بها الدولة والجماعات المحلية والمؤسسات العمومية.",
        fr: "Ce décret réglemente la passation et l'exécution des marchés publics conclus par l'État et les collectivités locales.",
        en: "This decree regulates the awarding and execution of public contracts by the State and local governments."
      }
    }
  },
  {
    law_name: "Municipal Law 11-10",
    category: "adminActs",
    metadata: {
      title: {
        ar: "القانون رقم 11-10 المتعلق بالبلدية",
        fr: "Loi n° 11-10 relative à la commune",
        en: "Law No. 11-10 relating to the Municipality"
      },
      official_number: {
        ar: "القانون رقم 11-10",
        fr: "Loi n° 11-10",
        en: "Law No. 11-10"
      },
      gazette: {
        issue_number: "37",
        publication_date: {
          ar: "22 جوان 2011",
          fr: "22 Juin 2011",
          en: "June 22, 2011",
          iso: "2011-06-22"
        }
      },
      citizen_summary: {
        ar: "يحدد هذا القانون تنظيم وسير البلدية كقاعدة للامركزية ومكان لممارسة المواطنة.",
        fr: "Cette loi définit l'organisation et le fonctionnement de la commune comme base de la décentralisation.",
        en: "This law defines the organization and operation of the municipality as the basis for decentralization."
      }
    }
  },
  {
    law_name: "Wilaya Law 12-07",
    category: "adminActs",
    metadata: {
      title: {
        ar: "القانون رقم 12-07 المتعلق بالولاية",
        fr: "Loi n° 12-07 relative à la wilaya",
        en: "Law No. 12-07 relating to the Wilaya"
      },
      official_number: {
        ar: "القانون رقم 12-07",
        fr: "Loi n° 12-07",
        en: "Law No. 12-07"
      },
      gazette: {
        issue_number: "12",
        publication_date: {
          ar: "21 فيفري 2012",
          fr: "21 Février 2012",
          en: "February 21, 2012",
          iso: "2012-02-21"
        }
      },
      citizen_summary: {
        ar: "يحدد هذا القانون تنظيم وسير الولاية وصلاحياتها.",
        fr: "Cette loi définit l'organisation, le fonctionnement et les compétences de la wilaya.",
        en: "This law defines the organization, operation, and powers of the Wilaya."
      }
    }
  },
  {
    law_name: "Association Law 12-06",
    category: "adminActs",
    metadata: {
      title: {
        ar: "القانون رقم 12-06 المتعلق بالجمعيات",
        fr: "Loi n° 12-06 relative aux associations",
        en: "Law No. 12-06 relating to Associations"
      },
      official_number: {
        ar: "القانون رقم 12-06",
        fr: "Loi n° 12-06",
        en: "Law No. 12-06"
      },
      gazette: {
        issue_number: "02",
        publication_date: {
          ar: "12 جانفي 2012",
          fr: "12 Janvier 2012",
          en: "January 12, 2012",
          iso: "2012-01-12"
        }
      },
      citizen_summary: {
        ar: "يحدد هذا القانون شروط وكيفيات تأسيس الجمعيات وتنظيمها وعملها.",
        fr: "Cette loi définit les conditions et modalités de constitution, d'organisation et de fonctionnement des associations.",
        en: "This law defines the conditions and procedures for the formation, organization, and operation of associations."
      }
    }
  },
  {
    law_name: "Civil Status Law 17-08",
    category: "adminActs",
    metadata: {
      title: {
        ar: "القانون رقم 17-08 المتعلق بالحالة المدنية",
        fr: "Loi n° 17-08 relative à l'état civil",
        en: "Law No. 17-08 relating to Civil Status"
      },
      official_number: {
        ar: "القانون رقم 17-08",
        fr: "Loi n° 17-08",
        en: "Law No. 17-08"
      },
      gazette: {
        issue_number: "14",
        publication_date: {
          ar: "28 فيفري 2017",
          fr: "28 Février 2017",
          en: "February 28, 2017",
          iso: "2017-02-28"
        }
      },
      citizen_summary: {
        ar: "ينظم هذا القانون القواعد المتعلقة بالحالة المدنية للمواطنين وكيفية تسجيل الولادات والوفيات والزواج.",
        fr: "Cette loi régit les règles relatives à l'état civil des citoyens et les modalités d'enregistrement des naissances, décès et mariages.",
        en: "This law governs the rules relating to the civil status of citizens and the procedures for recording births, deaths, and marriages."
      }
    }
  },
  {
    law_name: "Public Domain Law 90-30",
    category: "adminActs",
    metadata: {
      title: {
        ar: "القانون رقم 90-30 المتضمن قانون الأملاك الوطنية",
        fr: "Loi n° 90-30 portant loi sur les domaines nationaux",
        en: "Law No. 90-30 regarding National Domains"
      },
      official_number: {
        ar: "القانون رقم 90-30",
        fr: "Loi n° 90-30",
        en: "Law No. 90-30"
      },
      gazette: {
        issue_number: "52",
        publication_date: {
          ar: "1 ديسمبر 1990",
          fr: "1 Décembre 1990",
          en: "December 1, 1990",
          iso: "1990-12-01"
        }
      },
      citizen_summary: {
        ar: "يحدد هذا القانون القواعد المتعلقة بحماية الأملاك الوطنية العامة والخاصة وتسييرها.",
        fr: "Cette loi définit les règles relatives à la protection et à la gestion des domaines nationaux publics et privés.",
        en: "This law defines the rules relating to the protection and management of public and private national domains."
      }
    }
  }
];

export async function GET() {
  try {
    for (const law of ADMIN_LAWS) {
      await setLawMetadata(law.law_name, law.metadata, law.category);
    }
    return NextResponse.json({ success: true, message: "Administrative laws seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
