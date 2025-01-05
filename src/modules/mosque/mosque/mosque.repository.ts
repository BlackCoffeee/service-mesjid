import { PrismaService } from "@common/prisma.service";
import { Injectable } from "@nestjs/common";
import { InterfaceMosque, InterfaceMosqueRepository, MosqueQueryOptions } from "@modules/mosque/mosque/interfaces";
@Injectable()
export class MosqueRepository implements InterfaceMosqueRepository {

    constructor(
       private readonly prismaService: PrismaService
    ) {}

    async create(mosque: InterfaceMosque): Promise<InterfaceMosque> {
        return this.prismaService.mosque.create({
            data: mosque
        })
    }

    async findAll(options: MosqueQueryOptions): Promise<InterfaceMosque[]> {
        return this.prismaService.mosque.findMany({
            where: {
                deletedAt: options.includeDeleted ? undefined : null
            }
        })
    }

    async findOne(id: string): Promise<InterfaceMosque> {
        return this.prismaService.mosque.findUnique({
            where: { id }
        })
    }

    async update(id: string, mosque: Partial<InterfaceMosque>): Promise<InterfaceMosque> {
        return this.prismaService.mosque.update({
            where: { id },
            data: mosque
        })
    }

    async replace(id: string, mosque: InterfaceMosque): Promise<InterfaceMosque> {
        return this.prismaService.mosque.update({
            where: { id },
            data: mosque
        })
    }

    async softDelete(id: string, options?: MosqueQueryOptions): Promise<void> {
        await this.prismaService.mosque.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    async restore(id: string, options?: MosqueQueryOptions): Promise<InterfaceMosque> {
        return this.prismaService.mosque.update({
            where: { id },
            data: { 
                deletedAt: null 
            }
        });
    }

    async patch(id: string, data: Partial<InterfaceMosque>): Promise<InterfaceMosque> {
        return this.prismaService.mosque.update({
            where: { id },
            data
        });
    }
}
