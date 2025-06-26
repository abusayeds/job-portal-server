export const role = {
    admin: "admin",
    candidate: "candidate",
    employer: "employer",
    employe: "employe"
} as const;

export type TRole = keyof typeof role