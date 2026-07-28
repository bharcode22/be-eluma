import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as os from 'os';
import * as fs from 'fs';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async findAllStatsData(from?: string, to?: string) {
    const whereCondition: Prisma.PropertiesOwnerWhereInput = {
      deleted_at: null,
      ...(from && to && {
        created_at: {
          gte: new Date(from),
          lte: new Date(to),
        },
      }),
    };

    // 2. Ambil data owner sesuai filter
    const allOwners = await this.prisma.propertiesOwner.findMany({
      where: whereCondition,
      select: {
        id: true,
        phone: true,
      },
    });

    // 3. Deduplicate berdasarkan phone
    const uniqueDataMap = new Map<string, typeof allOwners[0]>();
    for (const item of allOwners) {
      if (item.phone && !uniqueDataMap.has(item.phone)) {
        uniqueDataMap.set(item.phone, item);
      }
    }
    const uniqueOwners = Array.from(uniqueDataMap.values());

    // 4. Hitung data lain
    const totalProperty = await this.prisma.properties.count({
      where: { deleted_at: null },
    });

    const totalUsers = await this.prisma.user.count({
      where: { deleted_at: null },
    });

    const totalService = await this.prisma.service.count({
      where: { deleted_at: null },
    });

    // 5. Kembalikan hasil
    return {
      totalProperty,
      totalUsers,
      totalPropertyOwner: uniqueOwners.length,
      totalService,
    };
  }

  async latestProperty() {
    const latestPropertyData = await this.prisma.properties.findMany({
      orderBy: {
        created_at: 'desc'
      }, 
      select: {
        property_code: true, 
        number_of_bedrooms: true, 
        number_of_bathrooms: true, 
        maximum_guest: true,
        minimum_stay: true,
        price: true,
        monthly_price: true,
        yearly_price: true,
        isPublic: true,
        created_at: true,
      }, 
      take: 5, 
      where: {
        deleted_at: null
      }
    });

    return latestPropertyData;
  }

  async getSystemMetrics() {
    // 1. Storage / Disk Usage using fs.statfsSync if available
    let storage = {
      totalGB: 0,
      usedGB: 0,
      freeGB: 0,
      usedPercentage: 0,
    };

    try {
      if (typeof fs.statfsSync === 'function') {
        const stats = fs.statfsSync(process.cwd());
        const bsize = stats.bsize;
        const totalBytes = stats.blocks * bsize;
        const freeBytes = stats.bavail * bsize;
        const usedBytes = totalBytes - freeBytes;

        const totalGB = parseFloat((totalBytes / (1024 ** 3)).toFixed(2));
        const freeGB = parseFloat((freeBytes / (1024 ** 3)).toFixed(2));
        const usedGB = parseFloat((usedBytes / (1024 ** 3)).toFixed(2));
        const usedPercentage = totalGB > 0 ? parseFloat(((usedGB / totalGB) * 100).toFixed(1)) : 0;

        storage = { totalGB, usedGB, freeGB, usedPercentage };
      }
    } catch (err) {
      console.warn('Unable to retrieve disk stats via fs.statfsSync:', err);
    }

    // 2. RAM Usage
    const totalRamBytes = os.totalmem();
    const freeRamBytes = os.freemem();
    const usedRamBytes = totalRamBytes - freeRamBytes;

    const totalRamMB = Math.round(totalRamBytes / (1024 * 1024));
    const usedRamMB = Math.round(usedRamBytes / (1024 * 1024));
    const freeRamMB = Math.round(freeRamBytes / (1024 * 1024));
    const ramUsedPercentage = parseFloat(((usedRamMB / totalRamMB) * 100).toFixed(1));

    // 3. CPU Load & Model
    const cpus = os.cpus();
    const cpuCores = cpus.length;
    const cpuModel = cpus[0]?.model || 'Unknown CPU';
    const loadAvg = os.loadavg(); // [1m, 5m, 15m]

    // 4. Server Uptime
    const uptimeSeconds = Math.floor(os.uptime());
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    const formattedUptime = `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m`;

    // 5. Database Health Ping
    let dbStatus = 'connected';
    let latencyMs = 0;
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      latencyMs = Date.now() - start;
    } catch (dbErr) {
      dbStatus = 'disconnected';
    }

    return {
      storage,
      memory: {
        totalMB: totalRamMB,
        usedMB: usedRamMB,
        freeMB: freeRamMB,
        usedPercentage: ramUsedPercentage,
      },
      cpu: {
        cores: cpuCores,
        model: cpuModel,
        loadAvg: loadAvg.map(l => parseFloat(l.toFixed(2))),
      },
      uptime: {
        seconds: uptimeSeconds,
        formatted: formattedUptime,
      },
      database: {
        status: dbStatus,
        latencyMs,
      },
      platform: os.platform(),
      arch: os.arch(),
    };
  }
}
