import privacyIllustration from "@/assets/privacy-illustration.png";
import { InfoPage } from "@/components/InfoPage";
import { useSurveyLanguage } from "@/hooks/useSurveyLanguage";

export function PrivacyPage() {
  const { language, copy, selectLanguage } = useSurveyLanguage();
  const text = copy.landing;

  return (
    <InfoPage
      title={text.privacyPageTitle}
      backLabel={copy.back}
      actionLabel={text.getStarted}
      illustration={privacyIllustration}
      footerPrivacy={text.footerPrivacy}
      footerPurpose={text.footerPurpose}
      footerContact={text.footerContact}
      language={language}
      onLanguage={selectLanguage}
    >
      <p>{text.privacy1}</p>
      <p>{text.privacy2}</p>
      <p>{text.privacy3}</p>
      <p>{text.privacy4}</p>
      <p>{text.privacy5}</p>
      <p>{text.privacy6}</p>
    </InfoPage>
  );
}
