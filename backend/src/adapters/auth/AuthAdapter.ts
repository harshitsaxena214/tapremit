export interface AuthAdapter {
  registerStart(handle: string, displayName: string, phone?: string): Promise<any>;
  registerFinish(handle: string, response: any): Promise<{ id: string, handle: string, display_name: string }>;
  loginStart(handle: string): Promise<any>;
  loginFinish(handle: string, response: any): Promise<{ id: string, handle: string, display_name: string }>;
}
