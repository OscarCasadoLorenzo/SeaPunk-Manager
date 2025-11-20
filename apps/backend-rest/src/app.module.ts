import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AttributesModule } from "./attributes/attributes.module";
import { AuraGiftsModule } from "./aura-gifts/aura-gifts.module";
import { AuthModule } from "./auth/auth.module";
import { CharactersModule } from "./characters/characters.module";
import { CommonModule } from "./common/common.module";
import { DomainsModule } from "./domains/domains.module";
import { EffectsModule } from "./effects/effects.module";
import { EssencesModule } from "./essences/essences.module";
import { InventoriesModule } from "./inventories/inventories.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SettingsModule } from "./settings/settings.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    PrismaModule,
    AuthModule,
    CharactersModule,
    AttributesModule,
    AuraGiftsModule,
    DomainsModule,
    EffectsModule,
    EssencesModule,
    InventoriesModule,
    SettingsModule,
  ],
})
export class AppModule {}
