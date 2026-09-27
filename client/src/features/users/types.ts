export type UserStatus = "ACTIVE" | "INACTIVE";
export type Theme = "light" | "dark" | "system";

export type MyProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  createdAt: string;
  profile: {
    avatarUrl: string | null;

    barangay: string | null;
    cityMunicipality: string | null;
    province: string | null;
    postalCode: string | null;

    addressLine1: string | null;
    addressLine2: string | null;
    purokSitio: string | null;
    landmark: string | null;
    phoneNumber: string | null;

    updatedAt: string | null;
  };
};

export type MySettings = {
  settings: {
    theme: Theme;
    notifications: {
      email: boolean;
      sms: boolean;
    };
    privacy: {
      showNameInFeed: boolean;
    };
  };
  updatedAt: string | null;
  isDefault?: boolean; 
};

export type PublicUserProfile = {
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
};

export type AdminPrivateUserProfile = {
  user: {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
    role: { id: number; name: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN" };
    createdAt: string;
    updatedAt: string;
    profile: {
      avatarUrl: string | null;

      barangay: string | null;
      cityMunicipality: string | null;
      province: string | null;
      postalCode: string | null;

      addressLine1: string | null;
      addressLine2: string | null;
      purokSitio: string | null;
      landmark: string | null;
      phoneNumber: string | null;

      createdAt: string | null;
      updatedAt: string | null;
    };
  };
};