import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { eq, and, lte, gte, or } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { EmailService } from '../email/email.service';
import {
  tenantProductSubscriptions,
  tenant,
  userAccount,
  products,
} from '@icaptur/database-schema';

@Injectable()
export class TrialNotificationsService {
  private readonly logger = new Logger(TrialNotificationsService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Cron job that runs daily at 9:00 AM to check for trials ending
   * Sends notifications for trials ending tomorrow (1 day before) and today
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleTrialEndingNotifications() {
    this.logger.log('Starting trial ending notification check...');

    try {
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0); // Start of today

      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999); // End of today

      const tomorrowStart = new Date(now);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0); // Start of tomorrow

      const tomorrowEnd = new Date(now);
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
      tomorrowEnd.setHours(23, 59, 59, 999); // End of tomorrow

      // Find all trial subscriptions ending today or tomorrow
      const endingTrials = await this.db.db
        .select({
          subscription: {
            id: tenantProductSubscriptions.id,
            tenantId: tenantProductSubscriptions.tenantId,
            productId: tenantProductSubscriptions.productId,
            trialEndsAt: tenantProductSubscriptions.trialEndsAt,
            status: tenantProductSubscriptions.status,
          },
          tenant: {
            id: tenant.id,
            orgName: tenant.orgName,
          },
          product: {
            id: products.id,
            name: products.name,
            code: products.code,
          },
        })
        .from(tenantProductSubscriptions)
        .innerJoin(tenant, eq(tenantProductSubscriptions.tenantId, tenant.id))
        .innerJoin(
          products,
          eq(tenantProductSubscriptions.productId, products.id),
        )
        .where(
          and(
            eq(tenantProductSubscriptions.status, 'trial'),
            eq(tenantProductSubscriptions.billingStatus, 'trial'),
            // Trial ends today or tomorrow
            or(
              // Today
              and(
                gte(tenantProductSubscriptions.trialEndsAt, todayStart),
                lte(tenantProductSubscriptions.trialEndsAt, todayEnd),
              ),
              // Tomorrow
              and(
                gte(tenantProductSubscriptions.trialEndsAt, tomorrowStart),
                lte(tenantProductSubscriptions.trialEndsAt, tomorrowEnd),
              ),
            ),
          ),
        );

      this.logger.log(
        `Found ${endingTrials.length} trial subscriptions ending soon`,
      );

      // Get org_admin users for each tenant
      for (const trial of endingTrials) {
        if (!trial.subscription.trialEndsAt) {
          continue;
        }

        const trialEndDate = new Date(trial.subscription.trialEndsAt);
        // Calculate days remaining (round down to get whole days)
        const timeDiff = trialEndDate.getTime() - now.getTime();
        const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // Only send notifications for trials ending tomorrow (1 day) or today (0 days)
        if (daysRemaining > 1 || daysRemaining < 0) {
          continue;
        }

        // Find org_admin users for this tenant
        const orgAdmins = await this.db.db
          .select({
            id: userAccount.id,
            email: userAccount.email,
            firstName: userAccount.firstName,
            lastName: userAccount.lastName,
          })
          .from(userAccount)
          .where(
            and(
              eq(userAccount.tenantId, trial.tenant.id),
              eq(userAccount.role, 'org_admin'),
              eq(userAccount.status, 'active'),
            ),
          );

        this.logger.log(
          `Found ${orgAdmins.length} org_admin users for tenant ${trial.tenant.id} (${trial.tenant.orgName})`,
        );

        // Send email to each org_admin
        for (const admin of orgAdmins) {
          try {
            await this.emailService.sendTrialEndingEmail(
              admin.email,
              admin.firstName,
              trial.tenant.orgName,
              trialEndDate,
              daysRemaining,
            );
            this.logger.log(
              `Sent trial ending email to ${String(admin.email)} (${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining)`,
            );
          } catch (error) {
            this.logger.error(
              `Failed to send trial ending email to ${String(admin.email)}:`,
              error,
            );
          }
        }
      }

      this.logger.log('Trial ending notification check completed');
    } catch (error) {
      this.logger.error('Error in trial ending notification cron job:', error);
    }
  }
}
