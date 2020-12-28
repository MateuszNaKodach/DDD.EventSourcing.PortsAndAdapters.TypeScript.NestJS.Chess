import { Module } from '@nestjs/common';
import { InMemoryPersistenceModule } from './persistence/inmemory/in-memory-persistence-module';
import { SharedKernelInfrastructureModule } from '../../shared-kernel/infrastructure/shared-kernel-infrastructure.module';
import { TimeProviderModule } from './time/time-provider.module';


@Module({
  imports: [
    SharedKernelInfrastructureModule,
    InMemoryPersistenceModule,
    TimeProviderModule,
  ],
  exports: [
    SharedKernelInfrastructureModule,
    InMemoryPersistenceModule,
    TimeProviderModule,
  ],
})
export class ChessGameInfrastructureModule {
}
