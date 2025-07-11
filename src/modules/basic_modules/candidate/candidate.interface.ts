export type TCandidate = {
    // step 1
    image: string
    title: string
    experience: "Freshers" | "1-2" | "2-4" | "4-6" | "8-10" | "10-15" | "15 +"
    educations: {
        type: [string],
        enum: [
            'All',
            'High-School',
            'Intermediate',
            'Graduation',
            'Associate-Degree',
            'Bachelor-Degree',
            'Master-Degree',
            'Phd',
        ],
    }
    parsonalWebsite: string
    cv: string[]
    // step 2
    nationality: string
    dateOfBrith: string
    gender: string
    maritalStatus: string
    biography: string
    // step 3
    facebook: string
    twitter: string
    youtube: string
    instagram: string
    linkedin: string
    //   step 4
    address: string
    phone: string
    contactEmail: string
    jobType: string
    jobLevel: string
}