export type AccountType = "all" | "user" | "org";
export type InField = "login" | "name" | "email";

export type Range = { min?: number; max?: number };

export type UserSearchFilters = {
  // 1) user/org
  accountType: AccountType;

  // 2) keyword + where
  keyword: string;
  inField: InField;

  // 3) repos
  repos?: Range;

  // 4) location
  location?: string;

  // 5) language
  language?: string;

  // 6) created
  created?: { from?: string; to?: string }; // YYYY-MM-DD

  // 7) followers
  followers?: Range;

  // 8) sponsorable
  sponsorable?: boolean;
};
