import { adminEarningModel } from './adminEarning';
/* eslint-disable @typescript-eslint/no-explicit-any */
import queryBuilder from "../../../builder/queryBuilder";
import { UserModel } from "../../basic_modules/user/user.model";
import { JobPostModel } from "../job-post/jobPost.model";

const adminEarningDB = async (year: any) => {

    const result = await adminEarningModel.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(Date.UTC(year, 0, 1)),
                    $lt: new Date(Date.UTC(year + 1, 0, 1))
                }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalIncome: { $sum: "$amount" }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $project: {
                month: "$_id",
                totalIncome: 1,
                _id: 0
            }
        }
    ]);


    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    const incomeRatio = monthNames.reduce((acc: any, month) => {
        acc[month] = 0;
        return acc;
    }, {});


    result.forEach(item => {
        const monthName = monthNames[item.month - 1];
        incomeRatio[monthName] = item.totalIncome;
    });





    return incomeRatio

};


const earningListDB = async (query: Record<string, unknown>) => {
    const earningQuery = new queryBuilder(adminEarningModel.find().populate({
        path: "userId",
        select: ' fullName email , address'
    }).populate({
        path: "subscriptionId",
        select: " planName planPrice"
    }), query).fields().filter().sort()
    const { totalData } = await earningQuery.paginate(adminEarningModel.find())
    const earnings: any = await earningQuery.modelQuery.exec()
    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = earningQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });


    const list = earnings?.map((earning: any) => {
        return {
            _id: earning?._id,
            fullName: earning?.userId?.fullName,
            email: earning?.userId?.email,
            planName: earning?.subscriptionId?.planName,
            planPrice: earning?.subscriptionId?.planPrice,
            amount: earning?.amount,
            createdAt: earning?.createdAt
        }
    })
    const totalAmount = list.reduce((sum: number, earning: any) => sum + earning.amount, 0);
    return {
        pagination,
        totalEarning: totalAmount,
        earningsList: list
    }
}

const showEarningDB = async () => {
    const JobSeeker = await UserModel.find({ role: "candidate", isVerify: true, isApprove: true });
    const employer = await UserModel.find({ role: "employer", isVerify: true, isApprove: true });
    const totalJobPost = await JobPostModel.find();
    const list = await adminEarningModel.find();
    const totalAmount = list.reduce((sum: number, earning: any) => sum + earning.amount, 0);

    const earning = {
        totalEarning: totalAmount,
        totalCandidate: JobSeeker.length,
        totalEmployer: employer.length,
        totalJobPost: totalJobPost.length
    };
    return earning
}
export const adminEarningService = {
    adminEarningDB,
    earningListDB,
    showEarningDB
}