
import { UserModel } from "../modules/basic_modules/user/user.model";



const admins = [
  {
    fullName: "MD Admin",
    userName: "admin",
    email: "admin@gmail.com",
    password: "1qazxsw21qaz",
    role: "admin",
    address: "Dhaka",
    phone: "017",
    adminErnings: 0,
    isDeleted: false,
    isApprove: true,
    isVerify: true,
    isActive: true,
    isCompleted: true
  },
  {
    fullName: "Info Admin",
    userName: "infoAdmin",
    email: "info@remotisjobs.com",
    password: "1qazxsw21qaz",
    role: "admin",
    address: "Dhaka",
    phone: "018",
    adminErnings: 0,
    isDeleted: false,
    isApprove: true,
    isVerify: true,
    isActive: true,
    isCompleted: true
  },
  {
    fullName: "Support Admin",
    userName: "supportAdmin",
    email: "support@remotisjobs.com",
    password: "1qazxsw21qaz",
    role: "admin",
    address: "Dhaka",
    phone: "019",
    adminErnings: 0,
    isDeleted: false,
    isApprove: true,
    isVerify: true,
    isActive: true,
    isCompleted: true
  },
  {
    fullName: "Payment Admin",
    userName: "paymentAdmin",
    email: "payment@remotisjobs.com",
    password: "1qazxsw21qaz",
    role: "admin",
    address: "Dhaka",
    phone: "016",
    adminErnings: 0,
    isDeleted: false,
    isApprove: true,
    isVerify: true,
    isActive: true,
    isCompleted: true
  },

];


export const seedSuperAdmin = async () => {
  for (const admin of admins) {
    const isAdminExists = await UserModel.findOne({ email: admin.email });
    if (!isAdminExists) {
      await UserModel.create(admin);
      console.log(`✅ Admin created: ${admin.email}`);
    }
  }
};

export default seedSuperAdmin;
