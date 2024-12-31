/**
 * Service untuk menangani autentikasi pengguna
 * File ini berisi logika untuk proses login dan pembuatan token JWT
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  /**
   * Constructor untuk AuthService
   * @param jwtService - Service untuk mengelola JWT token
   */
  constructor(private jwtService: JwtService) {}

  /**
   * Method untuk melakukan proses login pengguna
   * @param user - Data pengguna yang akan diproses
   * @returns Object yang berisi access token JWT
   */
  async login(user: any) {
    // Membuat payload untuk JWT token
    const payload = { username: user.username, sub: user.userId };
    
    // Mengembalikan access token yang sudah di-sign
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 

// created by : Muhammad Arif https://github.com/BlackCoffeee
// created at : 2025-01-01
// updated by : .... https://github.com/....
// updated at : ....