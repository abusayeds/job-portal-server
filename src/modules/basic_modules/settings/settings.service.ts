
import Setting from './settings.model';
import ISetting from './settings.interface';

class Service {
  get = async (key: string): Promise<ISetting | null> => {
    if (!key) throw new Error('Key is required')

    const setting = await Setting.findOne({ key });
    if(!setting) throw new Error('Setting not found');

    return setting;
  };

  // commissionAmount = async (amount: number): Promise<number> => {
  //   if (amount <= 0) return 0;

  //   const setting = await this.get('commission-rate');
  //   const adminCommissionRate = Number(setting?.value) || 0;
  //   const charge = (amount * adminCommissionRate) / 100;

  //   return charge > 1 ? charge : 0;
  // }
}

export const SettingService = new Service();
