import { MosqueStatus, MosqueType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsString, IsOptional, IsEmail, IsUrl, IsEnum, IsDate, IsDecimal } from 'class-validator';

export class UpdateMosqueDto {
    @IsString()
    name: string;

    @IsString()
    codeName: string;

    @IsString()
    address: string;

    @IsString()
    village: string;

    @IsString()
    district: string;

    @IsString()
    city: string;

    @IsString()
    province: string;

    @IsString()
    postalCode: string;

    @IsDecimal()
    @IsOptional()
    latitude?: Decimal | null;

    @IsDecimal()
    @IsOptional()
    longitude?: Decimal | null;

    @IsDate()
    @IsOptional()
    establishmentDate?: Date | null;

    @IsString()
    @IsOptional()
    phone?: string | null;

    @IsEmail()
    @IsOptional()
    email?: string | null;

    @IsUrl()
    @IsOptional()
    website?: string | null;

    @IsString()
    @IsOptional()
    description?: string | null;

    @IsEnum(MosqueStatus)
    status: MosqueStatus;

    @IsEnum(MosqueType)
    type: MosqueType;
}

export class PatchMosqueDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    codeName?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    village?: string;

    @IsString()
    @IsOptional()
    district?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    province?: string;

    @IsString()
    @IsOptional()
    postalCode?: string;

    @IsDecimal()
    @IsOptional()
    latitude?: Decimal | null;

    @IsDecimal()
    @IsOptional()
    longitude?: Decimal | null;

    @IsDate()
    @IsOptional()
    establishmentDate?: Date | null;

    @IsString()
    @IsOptional()
    phone?: string | null;

    @IsEmail()
    @IsOptional()
    email?: string | null;

    @IsUrl()
    @IsOptional()
    website?: string | null;

    @IsString()
    @IsOptional()
    description?: string | null;

    @IsEnum(MosqueStatus)
    @IsOptional()
    status?: MosqueStatus;

    @IsEnum(MosqueType)
    @IsOptional()
    type?: MosqueType;
} 