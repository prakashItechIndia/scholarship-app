import { Module } from '@nestjs/common';
import { DropdownOptionsController } from './dropdown-options.controller';
import { DropdownOptionsService } from './dropdown-options.service';
import { DatabaseModule } from '../../database';

@Module({
  imports: [DatabaseModule],
  controllers: [DropdownOptionsController],
  providers: [DropdownOptionsService],
  exports: [DropdownOptionsService],
})
export class DropdownOptionsModule {}

