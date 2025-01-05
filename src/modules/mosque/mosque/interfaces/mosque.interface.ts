import { MosqueStatus, MosqueType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { MosqueQueryOptions } from "./mosque-query-options.interface";
import { UpdateMosqueDto, PatchMosqueDto } from "@modules/mosque/mosque/dto";

export interface InterfaceMosque {
  id: string;
  name: string;
  codeName: string;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude?: Decimal | null;
  longitude?: Decimal | null;
  establishmentDate?: Date | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  description?: string | null;
  status: MosqueStatus;
  type: MosqueType;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface InterfaceMosqueService {
    create(data: Omit<InterfaceMosque, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>, options?: MosqueQueryOptions): Promise<InterfaceMosque>;
    findAll(options?: MosqueQueryOptions): Promise<InterfaceMosque[]>;
    findOne(id: string, options?: MosqueQueryOptions): Promise<InterfaceMosque>;
    update(id: string, data: Partial<InterfaceMosque>, options?: MosqueQueryOptions): Promise<InterfaceMosque>;
    softDelete(id: string, options?: MosqueQueryOptions): Promise<void>;
    restore(id: string, options?: MosqueQueryOptions): Promise<InterfaceMosque>;
    replace(id: string, data: UpdateMosqueDto): Promise<InterfaceMosque>;
    patch(id: string, data: PatchMosqueDto): Promise<InterfaceMosque>;
}
  
export interface InterfaceMosqueRepository {
    create(data: Omit<InterfaceMosque, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>, options?: MosqueQueryOptions): Promise<InterfaceMosque>;
    findAll(options?: MosqueQueryOptions): Promise<InterfaceMosque[]>;
    findOne(id: string, options?: MosqueQueryOptions): Promise<InterfaceMosque | null>;
    update(id: string, data: Partial<InterfaceMosque>, options?: MosqueQueryOptions): Promise<InterfaceMosque>;
    softDelete(id: string, options?: MosqueQueryOptions): Promise<void>;
    restore(id: string, options?: MosqueQueryOptions): Promise<InterfaceMosque>;
    replace(id: string, data: InterfaceMosque): Promise<InterfaceMosque>;
    patch(id: string, data: Partial<InterfaceMosque>): Promise<InterfaceMosque>;
}