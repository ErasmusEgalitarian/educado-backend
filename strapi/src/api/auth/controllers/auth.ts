import bcrypt from 'bcrypt';

interface LoginBody {
  email: string;
  password: string;
}

export default {
  async login(ctx) {
    try {
      const { email, password } = ctx.request.body as LoginBody;

      if (!email || !password) {
        return ctx.badRequest('Email and password are required');
      }

      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email },
      });

      if (!user) {
        return ctx.unauthorized('Invalid email or password');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return ctx.unauthorized('Invalid email or password');
      }

      // Generate JWT token and assign to user 
      const jwtService = strapi.service('plugin::users-permissions.jwt');
      const token = jwtService.issue({ id: user.id });

       // Exclude sensitive fields
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      ctx.send({ jwt: token, user: safeUser });
    } catch (err) {
      console.error(err);
      ctx.internalServerError('Something went wrong');
    }
  },
};
