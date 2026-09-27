import babysitting from "@/assets/categories/babysitting.png";
import beauty from "@/assets/categories/beauty.png";
import cleaning from "@/assets/categories/cleaning.png";
import coaching from "@/assets/categories/coaching.png";
import cooking from "@/assets/categories/cooking.png";
import digitalCreative from "@/assets/categories/digital_creative.png";
import elderly from "@/assets/categories/elderly.png";
import event from "@/assets/categories/event.png";
import heavyLifting from "@/assets/categories/heavy_lifting.png";
import homeMaintenance from "@/assets/categories/home_maintenance.png";
import none from "@/assets/categories/none.png";
import other from "@/assets/categories/other.png";
import paperwork from "@/assets/categories/paperwork.png";
import pet from "@/assets/categories/pet.png";
import pickupDelivery from "@/assets/categories/pickup_delivery.png";
import religiousCommunity from "@/assets/categories/religious_community.png";
import shopping from "@/assets/categories/shopping.png";
import technical from "@/assets/categories/technical.png";
import alreadyKnow from "@/assets/methods/already_know.png";
import doMyself from "@/assets/methods/do_myself.png";
import friendsFamily from "@/assets/methods/friends_family.png";
import google from "@/assets/methods/google.png";
import professionalWebsites from "@/assets/methods/professional_websites.png";
import socialGroups from "@/assets/methods/social_groups.png";
import chatBefore from "@/assets/trust/chat_before.png";
import clearPrice from "@/assets/trust/clear_price.png";
import livesNearby from "@/assets/trust/lives_nearby.png";
import previousJobs from "@/assets/trust/previous_jobs.png";
import realProfile from "@/assets/trust/real_profile.png";
import recommendations from "@/assets/trust/recommendations.png";
import reviews from "@/assets/trust/reviews.png";
import verifiedIdentity from "@/assets/trust/verified_identity.png";

export const categoryImages: Record<string, string> = {
  cleaning,
  cooking,
  pickup_delivery: pickupDelivery,
  babysitting,
  technical,
  beauty,
  heavy_lifting: heavyLifting,
  coaching,
  shopping,
  pet,
  elderly,
  paperwork,
  event,
  home_maintenance: homeMaintenance,
  digital_creative: digitalCreative,
  religious_community: religiousCommunity,
  other,
  none,
};

export const methodImages: Record<string, string> = {
  friends_family: friendsFamily,
  social_groups: socialGroups,
  google,
  professional_websites: professionalWebsites,
  already_know: alreadyKnow,
  do_myself: doMyself,
  other,
};

export const trustImages: Record<string, string> = {
  reviews,
  verified_identity: verifiedIdentity,
  real_profile: realProfile,
  previous_jobs: previousJobs,
  lives_nearby: livesNearby,
  chat_before: chatBefore,
  recommendations,
  clear_price: clearPrice,
  other,
};

const imagesByQuestion: Record<string, Record<string, string>> = {
  categories: categoryImages,
  currentMethod: methodImages,
  trustFactors: trustImages,
};

export function optionImage(questionId: string, value: string) {
  return imagesByQuestion[questionId]?.[value];
}
