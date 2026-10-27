import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "kalem_gumruk_default_session_secret_1997";

export interface UserSession {
  id: string;
  username: string;
  role: "ADMIN" | "EDITOR";
  name: string;
  permissions: {
    canEditServices?: boolean;
    canEditSirkuler?: boolean;
    canEditBaglantilar?: boolean;
    canEditReferences?: boolean;
    canEditForms?: boolean;
    canEditDocuments?: boolean;
    canManageSettings?: boolean;
    canManageUsers?: boolean;
    canManageBackups?: boolean;
    canDelete?: boolean;
    [key: string]: boolean | undefined;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: UserSession;
}

/**
 * Parolayı güvenli scrypt algoritması ile tuzlayarak (salt) hashler
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Girilen parolayı hash ile doğrular
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Oturum token'ı üretir (HMAC-SHA256 imzalı)
 */
export function generateToken(payload: UserSession): string {
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 gün geçerli
  });
  const b64Data = Buffer.from(data).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(b64Data).digest("base64url");
  return `${b64Data}.${signature}`;
}

/**
 * Token'ı doğrular ve payload'ı döner
 */
export function verifyToken(token: string): UserSession | null {
  try {
    const [b64Data, signature] = token.split(".");
    if (!b64Data || !signature) return null;

    const expectedSig = crypto.createHmac("sha256", SECRET).update(b64Data).digest("base64url");
    if (signature !== expectedSig) return null;

    const json = Buffer.from(b64Data, "base64url").toString("utf8");
    const data = JSON.parse(json);

    if (data.exp && Date.now() > data.exp) {
      return null; // Süresi dolmuş
    }

    return {
      id: data.id,
      username: data.username,
      role: data.role,
      name: data.name,
      permissions: data.permissions || {},
    };
  } catch {
    return null;
  }
}

/**
 * Gelen isteğin kimliğini tespit eder (Token, Authorization başlığı veya parola)
 */
export async function authenticateRequest(req: Request): Promise<UserSession | null> {
  // 1. Authorization Bearer Token kontrolü
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const session = verifyToken(token);
    if (session) return session;
  }

  // 2. x-auth-token başlığı kontrolü
  const authTokenHeader = req.headers["x-auth-token"] as string;
  if (authTokenHeader) {
    const session = verifyToken(authTokenHeader.trim());
    if (session) return session;
  }

  // 3. Şifre ile doğrudan doğrulama (Geriye dönük uyumluluk ve basit API erişimi)
  const password =
    (req.headers["x-admin-password"] as string) ||
    req.body?.password ||
    (req.query?.password as string);

  if (password) {
    const cleanPass = String(password).trim();
    const adminPass = (process.env.ADMIN_PASSWORD || "kalem1997").trim();
    const editorPass = (process.env.EDITOR_PASSWORD || "editor1997").trim();

    // Veritabanındaki kullanıcıları da kontrol et
    try {
      const dbUsers = await db.select().from(users).where(eq(users.isActive, true)).all();
      for (const u of dbUsers) {
        if (verifyPassword(cleanPass, u.passwordHash)) {
          let parsedPerms = {};
          try {
            parsedPerms = JSON.parse(u.permissions || "{}");
          } catch {
            parsedPerms = {};
          }
          return {
            id: u.id,
            username: u.username,
            role: u.role as "ADMIN" | "EDITOR",
            name: u.name,
            permissions: parsedPerms,
          };
        }
      }
    } catch (e) {
      // DB hatası olursa env fallback'e devam et
    }

    // ENV şifreleri ile eşleşme kontrolü
    if (cleanPass === adminPass) {
      return {
        id: "env-admin",
        username: "admin",
        role: "ADMIN",
        name: "Yönetici (Admin)",
        permissions: {
          canEditServices: true,
          canEditSirkuler: true,
          canEditBaglantilar: true,
          canEditReferences: true,
          canEditForms: true,
          canEditDocuments: true,
          canManageSettings: true,
          canManageUsers: true,
          canManageBackups: true,
          canDelete: true,
        },
      };
    }

    if (cleanPass === editorPass) {
      return {
        id: "env-editor",
        username: "editor",
        role: "EDITOR",
        name: "Editör",
        permissions: {
          canEditServices: true,
          canEditSirkuler: true,
          canEditBaglantilar: true,
          canEditReferences: true,
          canEditForms: false,
          canEditDocuments: true,
          canManageSettings: false,
          canManageUsers: false,
          canManageBackups: false,
          canDelete: false, // KESİNLİKLE SİLME YETKİSİ YOK
        },
      };
    }
  }

  return null;
}

/**
 * Express Yetkilendirme Middleware'i:
 * - İstek yapan kişinin oturumunu doğrular.
 * - SİLME (DELETE) işlemlerinde Editör'ü KESİNLİKLE engeller (Yalnızca ADMIN yapabilir).
 * - Belirtilmişse özel yetki iznini kontrol eder.
 */
export function requireAuth(requiredPermission?: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({
        error: "Yetkisiz işlem: Lütfen geçerli bir yönetici veya editör şifresi/oturumu sağlayınız.",
      });
    }

    req.user = user;

    // 1. Silme İşlemleri Koruması: Editör hiçbir şeyi silemez!
    if (req.method === "DELETE") {
      if (user.role !== "ADMIN" || user.permissions.canDelete === false) {
        return res.status(403).json({
          error: "Yetkisiz işlem: Editör kullanıcıları silme işlemi yapamaz. Silme yetkisi yalnızca Sistem Yöneticisine (Admin) aittir.",
        });
      }
    }

    // 2. Özel Yetki Kontrolü
    if (requiredPermission && user.role !== "ADMIN") {
      const hasPerm = Boolean(user.permissions[requiredPermission]);
      if (!hasPerm) {
        return res.status(403).json({
          error: `Yetkisiz işlem: Bu işlem için '${requiredPermission}' yetkisine sahip olmanız gerekmektedir.`,
        });
      }
    }

    next();
  };
}

/**
 * Yalnızca ADMIN rolüne izin veren middleware
 */
export function requireAdminOnly() {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({
        error: "Yetkisiz işlem: Lütfen yönetici şifresi giriniz.",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Yetkisiz işlem: Bu alana yalnızca Sistem Yöneticisi (Admin) erişebilir.",
      });
    }

    req.user = user;
    next();
  };
}
