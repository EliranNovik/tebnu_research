import researchIllustration from "@/assets/research-illustration.png";
import { InfoPage } from "@/components/InfoPage";
import { useSurveyLanguage } from "@/hooks/useSurveyLanguage";

export function ResearchPurposePage() {
  const { language, copy, selectLanguage } = useSurveyLanguage();
  const text = copy.landing;

  return (
    <InfoPage
      title={text.purposePageTitle}
      backLabel={copy.back}
      actionLabel={text.getStarted}
      illustration={researchIllustration}
      footerPrivacy={text.footerPrivacy}
      footerPurpose={text.footerPurpose}
      footerContact={text.footerContact}
      language={language}
      onLanguage={selectLanguage}
    >
      <p>{text.purpose1}</p>
      <p>{text.purpose2}</p>
      <p>{text.purpose3}</p>
      <p>{text.purpose4}</p>
      <p>{text.purpose5}</p>
      <p>{text.purpose6}</p>
    </InfoPage>
  );
}
