import { AuthAdapter } from './AuthAdapter';

export class MeraAuthAdapter implements AuthAdapter {
  async registerStart(handle: string, displayName: string): Promise<any> {
    // TODO: Verify Mera SDK usage and implement registerStart
    throw { status: 501, message: 'Mera SDK not yet implemented' };
  }
  async registerFinish(handle: string, response: any, phone?: string): Promise<any> {
    throw { status: 501, message: 'Mera SDK not yet implemented' };
  }
  async loginStart(handle: string): Promise<any> {
    throw { status: 501, message: 'Mera SDK not yet implemented' };
  }
  async loginFinish(handle: string, response: any): Promise<any> {
    throw { status: 501, message: 'Mera SDK not yet implemented' };
  }
}
