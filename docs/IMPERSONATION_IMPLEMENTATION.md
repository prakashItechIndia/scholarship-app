# User Impersonation Feature Implementation Guide

## Overview
The user impersonation feature allows `org_admin` users to impersonate other users and view their portal in real-time without logging out. When an admin clicks "Impersonate" on a user, it opens the iNvox dashboard in a new window with the impersonated user's session.

## Frontend Implementation ✅ COMPLETED

### 1. UI Changes
- Added "Impersonate" menu item in the user action dropdown (triple dots menu)
- Added icons from itech-fluentui: `PersonIcon` for impersonate, `EditIcon` for edit
- Menu now shows both "Impersonate" and "Edit User" options
- Loading state shows "Impersonating..." while processing

### 2. Service Method
Added to `apps/web/apps/experience-app/src/services/users.service.ts`:
```typescript
async impersonateUser(userId: string): Promise<{
  accessToken: string;
  refreshToken: string;
  user: User;
}> {
  const response = await experienceApis.users.usersControllerImpersonateUser(userId);
  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: mapUserDtoToUser(response.data.user),
  };
}
```

### 3. Component Logic
Added to `ProductUsers.tsx`:
- State management for impersonation loading
- Handler function `handleImpersonate` that:
  1. Calls the impersonation API
  2. Encodes user data for secure transmission
  3. Opens new window with tokens in URL
  4. Handles errors gracefully

### 4. URL Structure
The impersonated session opens with:
```
{INVOX_URL}?token={accessToken}&refreshToken={refreshToken}&user={encodedUserData}&impersonated=true
```

### 5. Environment Variable
Add to your `.env` file:
```env
VITE_INVOX_APP_URL=http://localhost:5174  # or your iNvox production URL
```

## Backend Implementation Required ⚠️

### 1. API Endpoint
Create the impersonation endpoint in your backend:

**File**: `apps/api/src/users/users.controller.ts`

```typescript
@Post(':id/impersonate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('org_admin', 'product_admin') // Only admins can impersonate
async impersonateUser(
  @Param('id') userId: string,
  @CurrentUser() currentUser: User,
) {
  // Validate that the current user is an admin
  if (!['org_admin', 'product_admin'].includes(currentUser.role)) {
    throw new ForbiddenException('Only administrators can impersonate users');
  }

  // Get the target user
  const targetUser = await this.usersService.findOne(userId);
  
  if (!targetUser) {
    throw new NotFoundException('User not found');
  }

  // Validate that admin can only impersonate users in their tenant (for org_admin)
  if (currentUser.role === 'org_admin' && targetUser.tenantId !== currentUser.tenantId) {
    throw new ForbiddenException('You can only impersonate users in your organization');
  }

  // Generate new tokens for the impersonated user
  const accessToken = this.authService.generateAccessToken({
    userId: targetUser.id,
    email: targetUser.email,
    role: targetUser.role,
    tenantId: targetUser.tenantId,
    impersonatedBy: currentUser.id, // Track who is impersonating
  });

  const refreshToken = this.authService.generateRefreshToken({
    userId: targetUser.id,
    impersonatedBy: currentUser.id,
  });

  // Log the impersonation for audit trail
  await this.auditService.log({
    action: 'USER_IMPERSONATION',
    performedBy: currentUser.id,
    targetUser: targetUser.id,
    timestamp: new Date(),
    metadata: {
      adminEmail: currentUser.email,
      targetEmail: targetUser.email,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: targetUser.id,
      email: targetUser.email,
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
      role: targetUser.role,
      tenantId: targetUser.tenantId,
      status: targetUser.status,
    },
  };
}
```

### 2. Auth Service Updates

**File**: `apps/api/src/auth/auth.service.ts`

Update token generation to include impersonation metadata:

```typescript
generateAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
  tenantId: string | null;
  impersonatedBy?: string; // Optional: ID of admin doing impersonation
}): string {
  return this.jwtService.sign(
    {
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      ...(payload.impersonatedBy && {
        impersonatedBy: payload.impersonatedBy,
        isImpersonated: true,
      }),
    },
    {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h', // Shorter expiry for impersonated sessions
    },
  );
}
```

### 3. Audit Logging

**File**: `apps/api/src/audit/audit.service.ts`

```typescript
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    action: string;
    performedBy: string;
    targetUser?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.auditLogRepository.save({
      action: data.action,
      performedBy: data.performedBy,
      targetUser: data.targetUser,
      timestamp: data.timestamp,
      metadata: data.metadata,
    });
  }
}
```

### 4. Database Migration (Optional but Recommended)

Create audit log table:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(255) NOT NULL,
  performed_by UUID NOT NULL REFERENCES users(id),
  target_user UUID REFERENCES users(id),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

### 5. OpenAPI/Swagger Update

Update your OpenAPI spec to include the new endpoint:

```typescript
@ApiTags('users')
@ApiOperation({ summary: 'Impersonate a user' })
@ApiResponse({
  status: 200,
  description: 'Successfully impersonated user',
  schema: {
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string' },
          tenantId: { type: 'string', nullable: true },
        },
      },
    },
  },
})
@ApiForbiddenResponse({ description: 'Insufficient permissions' })
@ApiNotFoundResponse({ description: 'User not found' })
```

## Security Considerations

### 1. Authorization
- ✅ Only `org_admin` and `product_admin` roles can impersonate
- ✅ `org_admin` can only impersonate users in their own tenant
- ✅ `product_admin` can impersonate users across tenants

### 2. Token Expiry
- Use shorter token expiry for impersonated sessions (recommended: 1 hour)
- Include `isImpersonated: true` flag in JWT payload
- Include `impersonatedBy: adminUserId` for audit trail

### 3. Audit Trail
- Log every impersonation attempt
- Store: who impersonated, who was impersonated, timestamp
- Keep logs for compliance (6-12 months recommended)

### 4. UI Indicators
Consider adding to iNvox app:
- Banner showing "You are viewing as [User Name]"
- "Exit Impersonation" button
- Visual indicator (different color scheme)

## Testing

### 1. Manual Testing
```bash
# 1. Start backend
cd apps/api && npm run dev

# 2. Start experience app
cd apps/web/apps/experience-app && npm run dev

# 3. Login as org_admin
# 4. Navigate to Manage Users
# 5. Click triple dots on a user
# 6. Click "Impersonate"
# 7. Verify new window opens with user's session
```

### 2. API Testing
```bash
# Using curl
curl -X POST http://localhost:3000/api/users/{userId}/impersonate \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

### 3. Unit Tests
```typescript
describe('UsersController - Impersonate', () => {
  it('should allow org_admin to impersonate user in same tenant', async () => {
    // Test implementation
  });

  it('should prevent org_admin from impersonating user in different tenant', async () => {
    // Test implementation
  });

  it('should prevent non-admin from impersonating', async () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Issue: "Failed to impersonate user"
- Check backend logs for the API error
- Verify user has admin role
- Ensure backend endpoint exists

### Issue: New window doesn't open
- Check browser popup blocker
- Verify VITE_INVOX_APP_URL is set correctly
- Check browser console for errors

### Issue: Token not working in new window
- Verify iNvox app handles URL params correctly
- Check auth.service.handleSSOCallback() is called
- Verify token format and expiry

## Future Enhancements

1. **Session Management**
   - Add ability to end impersonation from UI
   - Track active impersonation sessions
   - Auto-expire after timeout

2. **Enhanced Audit**
   - Add detailed activity logs during impersonation
   - Generate impersonation reports
   - Compliance exports

3. **Permissions Control**
   - Fine-grained control over what admins can see
   - Restrict certain actions during impersonation
   - Role-based impersonation limits

4. **Notifications**
   - Email notification when impersonation occurs
   - In-app notification to impersonated user
   - Slack/Teams integration for audit

## Contact
For questions or issues, contact the development team.

