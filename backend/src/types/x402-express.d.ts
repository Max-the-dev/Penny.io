declare module 'x402-express' {
  import { RequestHandler } from 'express';

  interface PaymentConfig {
    price: string;
    network: string;
  }

  interface PaymentRoutes {
    [route: string]: PaymentConfig;
  }

  interface FacilitatorConfig {
    url: string;
  }

  export function paymentMiddleware(
    walletAddress: string,
    routes: PaymentRoutes,
    facilitator: FacilitatorConfig
  ): RequestHandler;
}