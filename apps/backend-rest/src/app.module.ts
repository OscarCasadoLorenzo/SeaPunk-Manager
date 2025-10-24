import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttributesModule } from './attributes/attributes.module';
import { AuraGiftsModule } from './aura-gifts/aura-gifts.module';
import { AuthModule } from './auth/auth.module';
import { CharactersModule } from './characters/characters.module';
import { DomainsModule } from './domains/domains.module';
import { EffectsModule } from './effects/effects.module';
import { EssencesModule } from './essences/essences.module';
import { PlayersModule } from './players/players.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CharactersModule,
    PlayersModule,
    AttributesModule,
    AuraGiftsModule,
    DomainsModule,
    EffectsModule,
    EssencesModule,
  ],
})
export class AppModule {}
