import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    userRole?: string;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
