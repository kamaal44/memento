import minimatch from 'minimatch';

import { wait } from '../../utils/timers';
import { MementoConfiguration } from '../../configuration';
import { Method, Response, Request } from '../entity';
import { RequestRepository } from '../repository';
import { NetworkService } from '../service';

interface Dependencies {
  requestRepository: RequestRepository;
  networkService: NetworkService;
  config: MementoConfiguration;
}

export interface Headers {
  [key: string]: string;
}

export class RespondToRequest {
  private requestRepository: RequestRepository;
  private networkService: NetworkService;
  private config: MementoConfiguration;

  public constructor({
    requestRepository,
    networkService,
    config,
  }: Dependencies) {
    this.requestRepository = requestRepository;
    this.networkService = networkService;
    this.config = config;
  }

  public async execute(
    method: Method,
    url: string,
    headers: Headers,
    body: string
  ): Promise<Response> {
    const request = new Request(method, url, headers, body);

    if (this.shouldIgnoreCaching(method, url)) {
      return this.networkService.executeRequest(request);
    }

    const cachedResponse = await this.requestRepository.getResponseByRequestId(
      request.id
    );
    let response: Response;

    if (cachedResponse) {
      response = cachedResponse;
    } else {
      response = await this.networkService.executeRequest(request);

      await this.requestRepository.persistResponseForRequest(request, response);
    }

    if (this.config.useRealResponseTime) {
      await wait(response.responseTimeInMs);
    }

    return response;
  }

  private shouldIgnoreCaching(method: Method, url: string) {
    return this.config.disableCachingPatterns.some(disableCacheParams => {
      const methodMatch =
        method.toLowerCase() === disableCacheParams.method.toLowerCase();
      const globMatch = minimatch(url, disableCacheParams.urlPattern);

      return methodMatch && globMatch;
    });
  }
}
