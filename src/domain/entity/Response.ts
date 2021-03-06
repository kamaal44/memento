import { Headers } from './Headers';

export class Response {
  public cookies: string[];

  public constructor(
    public readonly status: number,
    public readonly headers: Headers,
    public readonly body: Buffer,
    public responseTimeInMs: number
  ) {
    this.headers = this.buildHeaders(headers);
    this.cookies = this.buildCookies();
  }

  public applyCookiesPolicy(policy: RegExp) {
    this.cookies = this.cookies.filter(cookie => {
      policy.lastIndex = 0;
      return !policy.test(cookie);
    });

    policy.lastIndex = 0;
  }

  private buildHeaders(inputHeaders: Headers): Headers {
    const EXCLUDED_HEADERS = [
      'connection',
      'keep-alive',
      'access-control-allow-origin',
      'access-control-allow-credentials',
      'access-control-allow-headers',
      'access-control-allow-methods',
      'access-control-expose-headers',
      'access-control-max-age',
      'access-control-request-headers',
      'access-control-request-method',
      'origin',
      'content-encoding',
      'forwarded',
      'via',
      'transfer-encoding',
      'te',
      'trailer',
      'upgrade',
    ];
    const headers: Headers = {};

    Object.keys(inputHeaders).forEach(key => {
      if (EXCLUDED_HEADERS.includes(key.toLocaleLowerCase())) {
        return;
      }
      headers[key.toLowerCase()] = inputHeaders[key];
    });

    return headers;
  }

  private buildCookies() {
    const cookies = this.parseSetCookieHeader();

    delete this.headers['set-cookie'];

    return cookies.map(cookie => this.makeUnsecureCookie(cookie));
  }

  private makeUnsecureCookie(cookie: string) {
    return cookie.replace(/; Secure/gi, '');
  }

  private parseSetCookieHeader(): string[] {
    const cookies = (this.headers['set-cookie'] as any) || [];

    return Array.isArray(cookies) ? cookies : [cookies];
  }
}
