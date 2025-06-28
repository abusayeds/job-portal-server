/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "../../basic_modules/user/user.interface";

export const subscriptionHandle = async (user: IUser | any) => {
    const subscription = user?.purchasePlan
    if (subscription.planName === "basic plan") {
        console.log("basic plan subscription = >>>> ", user);
    } else if (subscription.planName === "standard plan") {
        console.log("standard plan subscription = >>>> ", user);
    } else if (subscription.planName === "unlimited plan") {
        console.log("unlimited plan subscription = >>>> ", user);
    }
}