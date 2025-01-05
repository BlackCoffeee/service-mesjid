import { MosqueStatus, MosqueType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class MosqueEntity {
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