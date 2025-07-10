import { UserModel } from "../modules/basic_modules/user/user.model";


export const admin = {
  fullName: "MD Admin",
  email: "admin@gmail.com",
  password: "1qazxsw21qaz",
  role: "admin",
  address: "dhaka",
  phone: "017",
  adminErnings: 0,
  isDeleted: false,
  isApprove: true,
  isVerify: true,
  isActive: true,
  isCompleted: true
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await UserModel.findOne({ email: admin.email });

  if (!isSuperAdminExists) {

    // console.log("Super Admin created");
    await UserModel.create(admin);
  }
};

export default seedSuperAdmin;
