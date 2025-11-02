export class AuthService {
  private static readonly VALID_KEYS = [
    '9Z8K7A', 'R2D4F6', 'X5Y9L3', 'M8N1P0', 'B3C7J2',
    'Q4W6E8', 'T1U3O5', 'G7H9K0', 'V2Z4X6', 'A5S8D1',
    'F3G7H2', 'J4K6L8', 'P1O3I5', 'N7M9B0', 'E2R4T6',
    'Y5U7I8', 'W9Q0A1', 'Z3X5C2', 'V6B8N4', 'H1J3K5',
    'L7P0O9', 'D2F4G6', 'S5A8D1', 'T3Y7U2', 'I4O6P8',
    'M1N9B0', 'E5R7T8', 'Q9W0E1', 'Z2X4C6', 'V3B5N7',
    'H8J0K9', 'L1P3O5', 'D6F8G0', 'S2A4D6', 'T5Y7U8',
    'I1O3P5', 'M9N0B2', 'E4R6T8', 'Q7W9E0', 'Z1X3C5',
    'V4B6N8', 'H7J9K0', 'L2P4O6', 'D5F7G8', 'S1A3D5',
    'T6Y8U0', 'I2O4P6', 'M7N9B1', 'E3R5T7', 'Q8W0E2', 'A1B2C3'
  ];

  private static readonly SESSION_KEY = 'pagejet_session';
  private static readonly DEMO_USERS_KEY = 'pagejet_demo_users';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas em ms
  private static readonly DEMO_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 horas em ms

  static validateKey(key: string): boolean {
    return this.VALID_KEYS.includes(key.toUpperCase());
  }

  static login(key: string): boolean {
    if (this.validateKey(key)) {
      const session = {
        key: key.toUpperCase(),
        loginTime: Date.now(),
        expiresAt: Date.now() + this.SESSION_DURATION
      };
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  static isAuthenticated(): boolean {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      const now = Date.now();

      // Verifica se a sessão não expirou
      if (now > session.expiresAt) {
        this.logout();
        return false;
      }

      // Verifica se a chave ainda é válida
      return this.VALID_KEYS.includes(session.key);
    } catch {
      this.logout();
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static getTimeRemaining(): number {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return 0;

      const session = JSON.parse(sessionData);
      const remaining = session.expiresAt - Date.now();
      
      return Math.max(0, remaining);
    } catch {
      return 0;
    }
  }

  static formatTimeRemaining(): string {
    const remaining = this.getTimeRemaining();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  }

  // Métodos para autenticação via URL com hex
  static encodeHexToken(date: string, key: string): string {
    const text = `${date}$${key.toUpperCase()}`;
    return Array.from(new TextEncoder().encode(text))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  static decodeHexToken(hex: string): { date: string; key: string } | null {
    try {
      const bytes = [];
      for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
      }
      const text = new TextDecoder().decode(new Uint8Array(bytes));
      const parts = text.split('$');
      if (parts.length !== 2) return null;
      
      return { date: parts[0], key: parts[1] };
    } catch {
      return null;
    }
  }

  static validateHexAuth(hex: string): boolean {
    const decoded = this.decodeHexToken(hex);
    if (!decoded) return false;

    // Verifica se a chave é válida
    if (!this.VALID_KEYS.includes(decoded.key)) return false;

    // Verifica se a data é hoje
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const currentDate = `${day}_${month}_${year}`;

    return decoded.date === currentDate;
  }

  static loginWithHex(hex: string): boolean {
    if (this.validateHexAuth(hex)) {
      const decoded = this.decodeHexToken(hex);
      if (decoded) {
        const session = {
          key: decoded.key,
          loginTime: Date.now(),
          expiresAt: Date.now() + this.SESSION_DURATION
        };
        
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return true;
      }
    }
    return false;
  }

  // Sistema de cadastro demo
  static registerDemo(email: string, password: string, name: string): boolean {
    try {
      const users = this.getDemoUsers();
      
      // Verifica se email já existe
      if (users.some(u => u.email === email)) {
        return false;
      }

      const newUser = {
        email,
        password, // Em produção real, isso seria hasheado
        name,
        createdAt: Date.now()
      };

      users.push(newUser);
      localStorage.setItem(this.DEMO_USERS_KEY, JSON.stringify(users));
      
      // Faz login automaticamente
      return this.loginDemo(email, password);
    } catch {
      return false;
    }
  }

  static loginDemo(email: string, password: string): boolean {
    try {
      const users = this.getDemoUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) return false;

      const session = {
        email: user.email,
        name: user.name,
        isDemo: true,
        loginTime: Date.now(),
        expiresAt: Date.now() + this.DEMO_SESSION_DURATION
      };
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    } catch {
      return false;
    }
  }

  private static getDemoUsers(): Array<{ email: string; password: string; name: string; createdAt: number }> {
    try {
      const data = localStorage.getItem(this.DEMO_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static isDemoSession(): boolean {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      return session.isDemo === true;
    } catch {
      return false;
    }
  }

  static getDemoUserName(): string | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData);
      return session.isDemo ? session.name : null;
    } catch {
      return null;
    }
  }
}