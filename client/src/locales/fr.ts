import type { LocalePack } from "./en";

export const fr: LocalePack = {
  chooseLanguage: "Choisissez votre langue",
  back: "Retour",
  continue: "Continuer",
  submit: "Envoyer",
  submitting: "Envoi...",
  questionOf: "Question {current} sur {total}",
  selected: "{count} sélectionné(s)",
  selectedMax: "{max} sur {max} sélectionnés",
  pleaseChoose: "Veuillez choisir au moins une réponse.",
  otherPlaceholder: "Dites-nous en plus...",
  maxToast: "Vous pouvez en choisir jusqu'à {max}.",
  submitError: "Impossible d'envoyer vos réponses.",
  thankYouTitle: "Merci !",
  thankYouBody: "Vos réponses nous aident à comprendre comment les gens trouvent et choisissent vraiment une aide du quotidien.",
  share: "Partager",
  linkCopied: "Lien copié",
  done: "Terminé",
  contact: "Nous contacter",
  shareText: "Aidez-nous à comprendre comment les gens trouvent une aide du quotidien.",
  landing: {
    eyebrow: "Recherche anonyme",
    headlineLead: "Aidez-nous à comprendre",
    headlineMiddle: "comment les gens trouvent",
    headlineAccent: "une aide du quotidien",
    body: "Nous étudions comment les gens trouvent de l'aide pour les tâches du quotidien, et ce qui rend cette expérience plus simple, plus sûre et plus utile.",
    questions: "5 questions",
    noAccount: "Aucun compte requis",
    anonymous: "Anonyme",
    getStarted: "Commencer",
    duration: "Environ 2 minutes.",
    privacyTitle: "Votre vie privée compte",
    privacyBody: "Aucune information personnelle n'est demandée.",
    researchTitle: "Réponses utilisées uniquement pour la recherche",
    researchBody: "Nous analysons les résultats dans leur ensemble.",
    lifeTitle: "Un quotidien plus simple",
    lifeBody: "Vos réponses nous aident à comprendre les vrais besoins.",
    footerPrivacy: "Confidentialité",
    footerPurpose: "Objectif de la recherche",
    footerContact: "Contact",
    privacyPageTitle: "Confidentialité",
    privacy1:
      "Ce questionnaire est anonyme et ne demande ni votre nom, ni votre adresse e-mail, ni votre numéro de téléphone, ni les détails d'un compte.",
    privacy2:
      "Vos réponses sont enregistrées sans information qui vous identifie directement et sont utilisées uniquement pour la recherche et le développement du produit.",
    privacy3:
      "Si vous choisissez « Autre », décrivez le type d'aide ou la situation, sans inclure d'informations personnelles ou sensibles.",
    privacy4:
      "Nous pouvons collecter des informations techniques limitées, comme la langue choisie, le type d'appareil, le type de navigateur et les données de complétion du questionnaire, afin de comprendre son usage et d'améliorer l'expérience.",
    privacy5:
      "Les réponses sont analysées de façon agrégée. Elles ne sont pas vendues à des tiers et ne sont pas utilisées pour la publicité.",
    privacy6:
      "En envoyant le questionnaire, vous acceptez que vos réponses anonymes puissent servir à la recherche, à l'analyse et au développement du service.",
    purposePageTitle: "Objectif de la recherche",
    purpose1:
      "Nous étudions comment les gens trouvent aujourd'hui de l'aide pour les besoins du quotidien, et ce qui rend cette démarche plus simple, plus sûre, plus rapide et plus fiable.",
    purpose2:
      "Dans le cadre de cette recherche, nous développons une nouvelle application destinée à mettre en relation les personnes qui ont besoin d'une aide du quotidien avec des personnes de leur communauté disponibles pour la fournir.",
    purpose3:
      "L'objectif est de créer un lieu communautaire où l'on peut trouver une aide fiable pour le ménage, la cuisine, la garde d'enfants, les livraisons, l'entretien de la maison, l'aide technique, les courses et d'autres tâches du quotidien.",
    purpose4:
      "Le service pourra permettre de découvrir des personnes à proximité, de publier un besoin, de recevoir des réponses, de comparer des profils adaptés, de communiquer directement et de choisir en connaissance de cause grâce aux avis, à la disponibilité, à l'expérience et à la vérification.",
    purpose5:
      "Ce questionnaire nous aide à comprendre quels besoins comptent le plus, comment les gens les résolvent aujourd'hui, ce qui crée la confiance, et quelles façons de trouver de l'aide semblent les plus utiles.",
    purpose6: "Il y a 5 questions et le questionnaire prend environ 1 à 2 minutes.",
  },
  questions: {
    categories: {
      title: "Quel type d'aide utiliseriez-vous vraiment ?",
      subtitle: "Choisissez-en jusqu'à 3.",
      options: {
        cleaning: { label: "Ménage" },
        cooking: { label: "Cuisine" },
        pickup_delivery: { label: "Récupération et livraison" },
        babysitting: { label: "Garde d'enfants" },
        technical: { label: "Aide technique" },
        beauty: { label: "Beauté et soins personnels" },
        heavy_lifting: { label: "Port de charges et aide au déménagement" },
        coaching: { label: "Coaching et cours" },
        shopping: { label: "Courses et démarches" },
        pet: { label: "Aide pour les animaux" },
        elderly: { label: "Aide aux personnes âgées" },
        paperwork: { label: "Papiers et démarches administratives" },
        event: { label: "Aide pour un événement" },
        home_maintenance: { label: "Entretien de la maison" },
        digital_creative: { label: "Aide numérique et créative" },
        religious_community: { label: "Aide religieuse / communautaire" },
        other: { label: "Autre" },
        none: { label: "Je n'utiliserais aucune de ces aides" },
      },
    },
    currentMethod: {
      title: "Quand vous avez besoin de ce genre d'aide, comment trouvez-vous quelqu'un ?",
      subtitle: "",
      options: {
        friends_family: { label: "Amis / famille" },
        social_groups: { label: "Groupes WhatsApp / Facebook" },
        google: { label: "Google" },
        professional_websites: { label: "Sites de services professionnels" },
        already_know: { label: "Quelqu'un que je connais déjà" },
        do_myself: { label: "Je le fais généralement moi-même" },
        other: { label: "Autre" },
      },
    },
    preferredDiscovery: {
      title: "Si vous aviez besoin d'aide, comment préféreriez-vous trouver la bonne personne ?",
      subtitle: "Choisissez-en jusqu'à 3.",
      options: {
        browse_yourself: {
          label: "Chercher et parcourir les profils vous-même",
          description: "Voir les profils, les prix et les avis, puis choisir.",
        },
        post_receive_offers: {
          label: "Publier votre besoin et recevoir des offres",
          description: "Décrire la tâche et laisser les personnes intéressées répondre.",
        },
        nearby_people: {
          label: "Voir les personnes disponibles près de chez vous",
          description: "Trouver des personnes à proximité qui peuvent aider.",
        },
        automatic_matching: {
          label: "Être mis en relation automatiquement",
          description: "Décrire ce dont vous avez besoin et recevoir quelques profils adaptés.",
        },
        ranked_list: {
          label: "Voir une liste classée de personnes recommandées",
          description: "Selon les avis, l'expérience et les travaux précédents.",
        },
        local_community: {
          label: "Demander via une communauté locale",
          description: "Publier votre demande et recevoir des recommandations de personnes proches.",
        },
        guided_message: {
          label: "Décrire votre besoin dans un message simple",
          description: "Expliquer le problème et être orienté vers la bonne personne.",
        },
        direct_contact: {
          label: "Contacter quelqu'un directement",
          description: "Trouver ses coordonnées et l'appeler ou lui écrire vous-même.",
        },
        single_recommendation: {
          label: "Recevoir une seule personne recommandée",
          description: "Au lieu de chercher, recevoir la recommandation d'une personne adaptée.",
        },
        other: { label: "Autre" },
      },
    },
    trustFactors: {
      title: "Qu'est-ce qui vous ferait assez confiance à quelqu'un pour l'engager ?",
      subtitle: "Choisissez-en jusqu'à 3.",
      options: {
        reviews: { label: "Avis" },
        verified_identity: { label: "Identité vérifiée" },
        real_profile: { label: "Profil réel / photo" },
        previous_jobs: { label: "Travaux déjà réalisés" },
        lives_nearby: { label: "Habite à proximité" },
        chat_before: { label: "Discuter avant de décider" },
        recommendations: { label: "Recommandation d'autres personnes" },
        clear_price: { label: "Prix clair" },
        other: { label: "Autre" },
      },
    },
    barriers: {
      title: "Quelle est la principale raison pour laquelle vous ne demandez parfois pas d'aide ?",
      subtitle: "Choisissez-en jusqu'à 2.",
      options: {
        dont_know_trust: { label: "Je ne sais pas à qui faire confiance" },
        too_expensive: { label: "C'est trop cher" },
        takes_too_much_time: { label: "Trouver quelqu'un prend trop de temps" },
        stranger_in_home: { label: "Je ne veux pas d'un inconnu chez moi" },
        dont_know_where: { label: "Je ne sais pas où chercher" },
        not_available: { label: "Les gens ne sont pas disponibles quand j'en ai besoin" },
        prefer_myself: { label: "Je préfère le faire moi-même" },
        quality_worry: { label: "Je m'inquiète de la qualité du travail" },
        language: { label: "La langue rend les choses difficiles" },
        dont_need_help: { label: "Je n'ai généralement pas besoin d'aide" },
        other: { label: "Autre" },
      },
    },
  },
};
