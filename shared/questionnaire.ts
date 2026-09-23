import { QUESTIONNAIRE_VERSION, type QuestionId } from "./types";

export type OptionConfig = {
  value: string;
  label: string;
  description?: string;
  exclusive?: boolean;
  isOther?: boolean;
};

export type QuestionConfig = {
  id: QuestionId;
  type: "multiple";
  maxSelections?: number;
  title: string;
  subtitle?: string;
  icon: "sparkles" | "search" | "users" | "shield" | "help";
  layout: "compact" | "detailed";
  options: OptionConfig[];
};

export const questionnaire: QuestionConfig[] = [
  {
    id: "categories",
    type: "multiple",
    maxSelections: 3,
    title: "What kind of help would you actually use?",
    subtitle: "Choose up to 3.",
    icon: "sparkles",
    layout: "compact",
    options: [
      { value: "cleaning", label: "Cleaning" },
      { value: "cooking", label: "Cooking" },
      { value: "pickup_delivery", label: "Pick up & delivery" },
      { value: "babysitting", label: "Babysitting / Childcare" },
      { value: "technical", label: "Technical Help" },
      { value: "beauty", label: "Beauty & Personal Care" },
      { value: "heavy_lifting", label: "Heavy Lifting & Moving Help" },
      { value: "coaching", label: "Coaching & Lessons" },
      { value: "shopping", label: "Shopping & Errands" },
      { value: "pet", label: "Pet Help" },
      { value: "elderly", label: "Elderly Help" },
      { value: "paperwork", label: "Paperwork & Bureaucracy Help" },
      { value: "event", label: "Event Help" },
      { value: "home_maintenance", label: "Home Maintenance" },
      { value: "digital_creative", label: "Digital & Creative Help" },
      { value: "religious_community", label: "Religious / Community Help" },
      { value: "other", label: "Other", isOther: true },
      { value: "none", label: "I wouldn't use any", exclusive: true },
    ],
  },
  {
    id: "currentMethod",
    type: "multiple",
    title: "When you need help like this, how do you usually find someone?",
    icon: "search",
    layout: "compact",
    options: [
      { value: "friends_family", label: "Friends / family" },
      { value: "social_groups", label: "WhatsApp / Facebook groups" },
      { value: "google", label: "Google" },
      { value: "professional_websites", label: "Professional service websites" },
      { value: "already_know", label: "Someone I already know" },
      { value: "do_myself", label: "I usually do it myself" },
      { value: "other", label: "Other", isOther: true },
    ],
  },
  {
    id: "preferredDiscovery",
    type: "multiple",
    maxSelections: 3,
    title: "If you needed help with something, how would you prefer to find the right person?",
    subtitle: "Choose up to 3.",
    icon: "users",
    layout: "detailed",
    options: [
      {
        value: "browse_yourself",
        label: "Search and browse people yourself",
        description: "See profiles, prices and reviews and choose someone.",
      },
      {
        value: "post_receive_offers",
        label: "Post what you need and receive offers",
        description: "Describe the task and let interested people respond.",
      },
      {
        value: "nearby_people",
        label: "See people available near you",
        description: "Find people nearby who can help.",
      },
      {
        value: "automatic_matching",
        label: "Get matched automatically",
        description: "Describe what you need and receive a few suitable matches.",
      },
      {
        value: "ranked_list",
        label: "See a ranked list of recommended people",
        description: "Based on reviews, experience and previous work.",
      },
      {
        value: "local_community",
        label: "Ask through a local community",
        description: "Post your request and get recommendations from people nearby.",
      },
      {
        value: "guided_message",
        label: "Describe what you need in a simple message",
        description: "Explain the problem and be guided toward the right person.",
      },
      {
        value: "direct_contact",
        label: "Contact someone directly",
        description: "Find their details and call or message them yourself.",
      },
      {
        value: "single_recommendation",
        label: "Get one recommended person",
        description: "Instead of searching, have someone suitable recommended to you.",
      },
      { value: "other", label: "Other", isOther: true },
    ],
  },
  {
    id: "trustFactors",
    type: "multiple",
    maxSelections: 3,
    title: "What would make you trust someone enough to hire them?",
    subtitle: "Choose up to 3.",
    icon: "shield",
    layout: "compact",
    options: [
      { value: "reviews", label: "Reviews" },
      { value: "verified_identity", label: "Verified identity" },
      { value: "real_profile", label: "Real profile / photo" },
      { value: "previous_jobs", label: "Previous completed jobs" },
      { value: "lives_nearby", label: "Lives nearby" },
      { value: "chat_before", label: "Chat before deciding" },
      { value: "recommendations", label: "Recommendation from other people" },
      { value: "clear_price", label: "Clear price" },
      { value: "other", label: "Other", isOther: true },
    ],
  },
  {
    id: "barriers",
    type: "multiple",
    maxSelections: 2,
    title: "What is the biggest reason you sometimes don't ask someone for help?",
    subtitle: "Choose up to 2.",
    icon: "help",
    layout: "compact",
    options: [
      { value: "dont_know_trust", label: "I don't know who to trust" },
      { value: "too_expensive", label: "It is too expensive" },
      { value: "takes_too_much_time", label: "It takes too much time to find someone" },
      { value: "stranger_in_home", label: "I don't want a stranger in my home" },
      { value: "dont_know_where", label: "I don't know where to look" },
      { value: "not_available", label: "People aren't available when I need them" },
      { value: "prefer_myself", label: "I prefer doing it myself" },
      { value: "quality_worry", label: "I worry about the quality of the work" },
      { value: "language", label: "Language makes it difficult" },
      { value: "dont_need_help", label: "I don't usually need help" },
      { value: "other", label: "Other", isOther: true },
    ],
  },
];

export const QUESTION_FIELD_MAP: Record<
  QuestionId,
  { answers: keyof import("./types").SurveyAnswers; other: keyof import("./types").SurveyAnswers }
> = {
  categories: { answers: "categories", other: "categoriesOther" },
  currentMethod: { answers: "currentMethod", other: "currentMethodOther" },
  preferredDiscovery: { answers: "preferredDiscovery", other: "preferredDiscoveryOther" },
  trustFactors: { answers: "trustFactors", other: "trustFactorsOther" },
  barriers: { answers: "barriers", other: "barriersOther" },
};

export function getQuestion(id: QuestionId): QuestionConfig {
  const question = questionnaire.find((item) => item.id === id);
  if (!question) throw new Error(`Unknown question: ${id}`);
  return question;
}

export function getOptionLabel(questionId: QuestionId, value: string): string {
  return getQuestion(questionId).options.find((option) => option.value === value)?.label ?? value;
}

export function allowedValues(questionId: QuestionId): string[] {
  return getQuestion(questionId).options.map((option) => option.value);
}

export { QUESTIONNAIRE_VERSION };
