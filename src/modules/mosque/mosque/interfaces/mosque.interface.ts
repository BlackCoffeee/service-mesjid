import { MosqueStatus, MosqueType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

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
    create(data: Omit<InterfaceMosque, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<InterfaceMosque>;
    findAll(): Promise<InterfaceMosque[]>;
    findOne(id: string): Promise<InterfaceMosque>;
    update(id: string, data: Partial<InterfaceMosque>): Promise<InterfaceMosque>;
    remove(id: string): Promise<InterfaceMosque>;
  }
  
  export interface InterfaceMosqueRepository {
    create(data: Omit<InterfaceMosque, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<InterfaceMosque>;
    findAll(): Promise<InterfaceMosque[]>;
    findOne(id: string): Promise<InterfaceMosque | null>;
    update(id: string, data: Partial<InterfaceMosque>): Promise<InterfaceMosque>;
    remove(id: string): Promise<InterfaceMosque>;
}