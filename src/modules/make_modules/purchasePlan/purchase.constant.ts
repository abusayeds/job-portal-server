/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function cleanSubscriptionData(subs_info: any, index: any) {
    const { _id, createdAt, updatedAt, planPrice, numberOfEmployees, __v, ...cleanedData } = subs_info._doc;
    const remain = cleanedData
    if (subs_info.planName === "unlimited_plan") {
        const data = {
            ...cleanedData,
            planPrice: numberOfEmployees[index].price,
            numberOfEmployees: {
                minEmployees: numberOfEmployees[index].minEmployees,
                maxEmployees: numberOfEmployees[index].maxEmployees
            },
            unlimitedPlanIndex: index
        }


        return data
    } else {
        const data = {
            ...remain,
            planPrice: planPrice
        }
        return data

    }

}
