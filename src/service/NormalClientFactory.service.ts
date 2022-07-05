import { ServiceFactory } from '@midwayjs/core';
import {
  Config,
  Init,
  Provide,
  Scope,
  ScopeEnum,
  Logger,
} from '@midwayjs/decorator';

/**
 * 非 aliyun mqclient 配置
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class NormalClientFactoryService extends ServiceFactory<NacosNamingClient> {
  @Logger('coreLogger')
  logger;

  @Config('nacos.registry')
  nacosRegistry: any;

  getName(): string {
    return 'nacosNamingFactoryService';
  }

  @Init()
  async init() {
    await this.initClients(this.nacosRegistry);
  }

  protected async createClient(config: any): Promise<NacosNamingClient> {
    if (!config) {
      throw new Error('config 空');
    }
    if (!config.logger) {
      config.logger = console;
    }
    let client;
    try {
      this.logger.info('NacosNamingClient初始化');
      client = new NacosNamingClient(config);
      await client.ready();
      this.logger.info('NacosNamingClient连接ready');
    } catch (e) {
      this.logger.error(
        `NacosNamingClient连接异常, ${JSON.stringify(config)}`,
        e
      );
    }
    return client;
  }

  protected async destroyClient(client: NacosNamingClient) {}
}
