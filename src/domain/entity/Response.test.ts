import { Response } from './Response';

describe('headers', () => {
  it('should remove hop-by-hop headers', () => {
    // Given
    const response = new Response(
      200,
      {
        'WWW-AUTHENTICATE': 'www-authenticate',
        AGE: 'age',
        'CACHE-CONTROL': 'cache-control',
        'CLEAR-SITE-DATA': 'clear-site-data',
        EXPIRES: 'expires',
        PRAGMA: 'pragma',
        WARNING: 'warning',
        'LAST-MODIFIED': 'last-modified',
        ETAG: 'etag',
        VARY: 'vary',
        CONNECTION: 'connection',
        'KEEP-ALIVE': 'keep-alive',
        'SET-COOKIE': 'set-cookie',
        'ACCESS-CONTROL-ALLOW-ORIGIN': 'access-control-allow-origin',
        'ACCESS-CONTROL-ALLOW-CREDENTIALS': 'access-control-allow-credentials',
        'ACCESS-CONTROL-ALLOW-HEADERS': 'access-control-allow-headers',
        'ACCESS-CONTROL-ALLOW-METHODS': 'access-control-allow-methods',
        'ACCESS-CONTROL-EXPOSE-HEADERS': 'access-control-expose-headers',
        'ACCESS-CONTROL-MAX-AGE': 'access-control-max-age',
        'ACCESS-CONTROL-REQUEST-HEADERS': 'access-control-request-headers',
        'ACCESS-CONTROL-REQUEST-METHOD': 'access-control-request-method',
        ORIGIN: 'origin',
        'CONTENT-DISPOSITION': 'content-disposition',
        'CONTENT-LENGTH': 'content-length',
        'CONTENT-TYPE': 'content-type',
        'CONTENT-ENCODING': 'content-encoding',
        'CONTENT-LANGUAGE': 'content-language',
        'CONTENT-LOCATION': 'content-location',
        LOCATION: 'location',
        FORWARDED: 'forwarded',
        VIA: 'via',
        ALLOW: 'allow',
        SERVER: 'server',
        'CROSS-ORIGIN-OPENER-POLICY': 'cross-origin-opener-policy',
        'CROSS-ORIGIN-RESOURCE-POLICY': 'cross-origin-resource-policy',
        'CONTENT-SECURITY-POLICY': 'content-security-policy',
        'content-security-policy-report-only':
          'content-security-policy-report-only',
        'EXPECT-CT': 'expect-ct',
        'FEATURE-POLICY': 'feature-policy',
        'PUBLIC-KEY-PINS': 'public-key-pins',
        'PUBLIC-KEY-PINS-REPORT-ONLY': 'public-key-pins-report-only',
        'STRICT-TRANSPORT-SECURITY': 'strict-transport-security',
        'TRANSFER-ENCODING': 'transfer-encoding',
        TE: 'te',
        TRAILER: 'trailer',
        'ALT-SVC': 'alt-svc',
        DATE: 'date',
        'LARGE-ALLOCATION': 'large-allocation',
        LINK: 'link',
        'RETRY-AFTER': 'retry-after',
        'SERVER-TIMING': 'server-timing',
        SOURCEMAP: 'sourcemap',
        UPGRADE: 'upgrade',
      },
      Buffer.from('OK'),
      0
    );

    // When
    const headers = response.headers;

    //Then
    expect(headers).toEqual({
      'www-authenticate': 'www-authenticate',
      age: 'age',
      'cache-control': 'cache-control',
      'clear-site-data': 'clear-site-data',
      expires: 'expires',
      pragma: 'pragma',
      warning: 'warning',
      'last-modified': 'last-modified',
      etag: 'etag',
      vary: 'vary',
      'content-disposition': 'content-disposition',
      'content-length': 'content-length',
      'content-type': 'content-type',
      'content-language': 'content-language',
      'content-location': 'content-location',
      location: 'location',
      allow: 'allow',
      server: 'server',
      'cross-origin-opener-policy': 'cross-origin-opener-policy',
      'cross-origin-resource-policy': 'cross-origin-resource-policy',
      'content-security-policy': 'content-security-policy',
      'content-security-policy-report-only':
        'content-security-policy-report-only',
      'expect-ct': 'expect-ct',
      'feature-policy': 'feature-policy',
      'public-key-pins': 'public-key-pins',
      'public-key-pins-report-only': 'public-key-pins-report-only',
      'strict-transport-security': 'strict-transport-security',
      'alt-svc': 'alt-svc',
      date: 'date',
      'large-allocation': 'large-allocation',
      link: 'link',
      'retry-after': 'retry-after',
      'server-timing': 'server-timing',
      sourcemap: 'sourcemap',
    });
  });

  it('should set the cookies', () => {
    // Given
    const response = new Response(
      200,
      {
        // @ts-ignore
        'SET-COOKIE': [
          'test1=value1; Path=/; Secure',
          'test2=value2; Path=/; secure',
          'test3=value2; Path=/',
        ],
      },
      Buffer.from('OK'),
      0
    );

    // When
    const cookies = response.cookies;

    // Then
    expect(cookies).toEqual([
      'test1=value1; Path=/',
      'test2=value2; Path=/',
      'test3=value2; Path=/',
    ]);
  });
});

describe('applyCookiesPolicy', () => {
  it('should remove google analytics cookies', () => {
    // Given
    const response = new Response(
      200,
      {
        // @ts-ignore
        'set-cookie': [
          '_ga=gavalue; Path=/; Secure',
          'test=value; Path=/; Secure',
          '_gid=gidvalue; Path=/',
        ],
      },
      Buffer.from(''),
      0
    );
    const policy = /AMP_TOKEN|_ga.*|_gid/gi;

    // When
    response.applyCookiesPolicy(policy);

    // Then
    expect(response.cookies).toEqual(['test=value; Path=/']);
  });
});
