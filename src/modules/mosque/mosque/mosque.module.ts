import { Module } from "@nestjs/common";
import { MosqueService } from "@modules/mosque/mosque/mosque.service";
import { MosqueController } from "@modules/mosque/mosque/mosque.controller";

@Module({
    providers: [MosqueService],
    controllers: [MosqueController],
    exports: [MosqueService],
})
export class MosqueModule {}
