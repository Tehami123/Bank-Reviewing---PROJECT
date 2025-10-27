export type VibeType = "postive" | "negative" | "neutral";

export type UserType =
  | "individual customer"
  | "bussiness customer"
  | "bank employee"
  | "former employee"
  | "investor"
  | "other";



  export interface Review {
    _id: string;
    vibe: VibeType;
    companyName: string;
    isAnonymous: boolean;
    name?: string;
    anonymousId?:string;
    useType: UserType;
    title: string;
    story: string;
    createdAt: string;
    updatedAt: string;
  }

  export type CompanyType = {
    _id: string;
    name: string;
    positiveCount: Number;
    negativeCount: Number;
    totalReviews: Number;
    neutralCount: Number;
    reviews:Review[];
    complaintRate:Number;

  };
  