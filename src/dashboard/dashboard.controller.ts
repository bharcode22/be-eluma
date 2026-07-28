import { Controller, Get, Res, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get('/stats')
  async findAllStats(@Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.dashboardService.findAllStatsData();

      return res.status(HttpStatus.OK).json({
        message: "success to get all stats data", 
        data: data
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch stats data',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get('/latest/property')
  async latestPropertyList(@Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.dashboardService.latestProperty();

      return res.status(HttpStatus.OK).json({
        message: "success to get latest property data", 
        data: data
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch latest property data',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get('/system-metrics')
  async getSystemMetrics(@Res() res: Response) {
    try {
      const metrics = await this.dashboardService.getSystemMetrics();

      return res.status(HttpStatus.OK).json({
        message: "success to get system metrics",
        data: metrics
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch system metrics',
        error: error.message,
      });
    }
  }
}
