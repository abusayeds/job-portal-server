import { TJobPost } from "./jobPost.interface"
import { JobPostModel } from "./jobPost.model"

const crateJobDB = async (userId: string, payload: TJobPost) => {

    const result = await JobPostModel.create(payload)
    return result

}

export const jobService = {
    crateJobDB
}