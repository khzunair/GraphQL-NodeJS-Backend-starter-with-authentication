import { RoleModel } from "../models/Role";
import { UserModel } from "../models/User";

const defaultRoles = [
  {
    name: 'ADMIN',
    displayName: 'Administrator',
    description: 'Full system access',
    permissions: ['CREATE_USER', 'READ_USER', 'UPDATE_USER', 'DELETE_USER', 'MANAGE_ROLES'],
    priority: 100
  },
  {
    name: 'USER',
    displayName: 'User',
    description: 'Standard user access',
    permissions: ['READ_USER'],
    priority: 10
  }
];

export const seedRoles = async (): Promise<void> => {
  try {
    console.log('🌱 Seeding roles...');
    
    for (const roleData of defaultRoles) {
      const existingRole = await RoleModel.findOne({ name: roleData.name });
      if (!existingRole) {
        await RoleModel.create(roleData);
        console.log(`✅ Created role: ${roleData.name}`);
      }
    }

    // Create default admin user if it doesn't exist
    const adminRole = await RoleModel.findOne({ name: 'ADMIN' });
    const adminUser = await UserModel.findOne({ email: 'admin@example.com' });
    
    if (adminRole && !adminUser) {
      await UserModel.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: adminRole._id
      });
      console.log('✅ Created default admin: admin@example.com / admin123');
    }

    console.log('🎉 Roles seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
  }
};