import { AuthAdapter } from './AuthAdapter';
import { usersRepo } from '../../db/users.repository';

export class MockAuthAdapter implements AuthAdapter {
  private mockStore = new Map<string, { displayName: string, phone?: string }>();

  async registerStart(handle: string, displayName: string, phone?: string) {
    const user = usersRepo.getByHandle(handle);
    if (user) throw { status: 409, message: 'Registration failed due to a conflict' };
    
    this.mockStore.set(handle, { displayName, phone });
    return { challenge: 'mock-challenge' };
  }

  async registerFinish(handle: string, response: any) {
    const data = this.mockStore.get(handle);
    if (!data) throw { status: 400, message: 'Mock session expired or not found' };

    const user = usersRepo.create({
      handle,
      display_name: data.displayName,
      phone: data.phone,
    });
    this.mockStore.delete(handle);
    return user;
  }

  async loginStart(handle: string) {
    const user = usersRepo.getByHandle(handle);
    // To prevent enumeration, return a mock challenge even if user is not found
    // (In mock adapter, we don't strictly need to do much more than just return)
    return { challenge: 'mock-challenge' };
  }

  async loginFinish(handle: string, response: any) {
    if (!response || !response.mock) throw { status: 400, message: 'Invalid mock credential' };
    const user = usersRepo.getByHandle(handle);
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  }
}
